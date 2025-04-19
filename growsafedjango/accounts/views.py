from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from rest_framework_simplejwt.tokens import RefreshToken
from django.http import JsonResponse
from .models import UserProfile, Investment, Transaction
from decimal import Decimal
from django.db import transaction
import traceback
from .models import UserProfile, AccountActivity, InvestmentOption, Transaction, Investment
from django.contrib.auth import update_session_auth_hash
from django.shortcuts import render


# Root endpoint
def auth_root(request):
    return JsonResponse({"message": "Auth root endpoint"})

# Signup with profile creation
@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    username = request.data.get('username')
    first_name = request.data.get('first_name')
    last_name = request.data.get('last_name')
    email = request.data.get('email')
    password = request.data.get('password')
    confirm_password = request.data.get('confirm_password')

    if not all([username, email, first_name, last_name, password, confirm_password]):
        return Response({'error': 'All fields are required'}, status=status.HTTP_400_BAD_REQUEST)

    if password != confirm_password:
        return Response({'error': 'Passwords do not match'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(email=email).exists():
        return Response({'error': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Creating user with first_name and last_name
        user = User.objects.create_user(
            username=username,
            first_name=first_name,
            last_name=last_name,
            email=email,
            password=password
        )
        UserProfile.objects.get_or_create(user=user)
        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'message': 'User created successfully'
        }, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({
            'error': f'Failed to create user: {str(e)}',
        }, status=status.HTTP_400_BAD_REQUEST)

# Page with admin status
@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    username_or_email = request.data.get('usernameOrEmail')
    password = request.data.get('password')
    user = authenticate(request, username=username_or_email, password=password)

    if user is None and '@' in username_or_email:
        try:
            # Find user with the email
            user_obj = User.objects.get(email=username_or_email)
            # Then authenticate with they username
            user = authenticate(request, username=user_obj.username, password=password)
        except User.DoesNotExist:
            # No user with the email exists
            pass

    if user is not None:
        refresh = RefreshToken.for_user(user)

        # Log in the login activity
        AccountActivity.objects.create(
            user=user,
            action='Logged in',
            ip_address=request.META.get('REMOTE_ADDR', 'Unknown'),
            device=request.META.get('HTTP_USER_AGENT', 'Unknown')
        )
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'is_admin': user.is_staff or user.is_superuser,
            'message': 'Page successful'
        }, status=status.HTTP_200_OK)
    return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

# Logout with token blacklisting
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    try:
        refresh_token = request.data.get('refresh')
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)
    except Exception:
        return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT'])
@permission_classes([IsAuthenticated])
def profile(request):
    try:
        user = request.user
        profile, _ = UserProfile.objects.get_or_create(user=user)

        if request.method == 'GET':
            profile.calculate_daily_earnings()
            investments = [
                {'name': inv.name, 'amount': str(inv.amount), 'daily_return_rate': str(inv.daily_return_rate)}
                for inv in user.investments.all()
            ]
            transactions = [
                {
                    'type': tx.transaction_type,
                    'amount': str(tx.amount),
                    'status': tx.status,
                    'mobile_number': tx.mobile_number,
                    'created_at': tx.created_at.isoformat(),
                    'updated_at': tx.updated_at.isoformat(),
                    'notes': tx.notes,
                    'transaction_id': str(tx.transaction_id)
                }
                for tx in user.transactions.all()
            ]
            return Response({
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'total': str(profile.total),
                'total_deposit': str(profile.total_deposit),
                'total_withdraw': str(profile.total_withdraw),
                'daily_earnings': str(profile.daily_earnings),
                'mobile_number': profile.mobile_number,
                'address': profile.address or '',
                'joined_date': user.date_joined.isoformat(),
                'investments': investments,
                'transactions': transactions,
                'message': 'Profile retrieved'
            }, status=status.HTTP_200_OK)

        elif request.method == 'PUT':
            data = request.data
            # Update User fields
            user.first_name = data.get('first_name', user.first_name)
            user.last_name = data.get('last_name', user.last_name)
            user.email = data.get('email', user.email)
            # Update UserProfile fields
            profile.mobile_number = data.get('mobile_number', profile.mobile_number)
            profile.address = data.get('address', profile.address)
            # Save changes
            user.save()
            profile.save()
            # Log the activity
            AccountActivity.objects.create(
                user=user,
                action="Profile updated",
                ip_address=request.META.get('REMOTE_ADDR', 'Unknown'),
                device=request.META.get('HTTP_USER_AGENT', 'Unknown'),
            )
            return Response({
                'message': 'Profile updated successfully'
            }, status=status.HTTP_200_OK)

    except Exception as e:
        print("Error in profile view:", str(e))
        traceback.print_exc()
        return Response(
            {"error": "Something went wrong in the profile view."},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

# Deposit (creates pending transaction)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def deposit(request):
    amount = request.data.get('amount')
    mobile_number = request.data.get('mobile_number')
    try:
        amount = Decimal(amount)
        if amount <= 0:
            return Response({'error': 'Amount must be positive'}, status=status.HTTP_400_BAD_REQUEST)
        with transaction.atomic():
            tx = Transaction.objects.create(
                user=request.user,
                transaction_type='DEPOSIT',
                amount=amount,
                mobile_number=mobile_number
            )
        return Response({
            'message': 'Deposit request submitted, pending admin approval',
            'transaction_id': str(tx.transaction_id)
        }, status=status.HTTP_201_CREATED)
    except (ValueError, TypeError):
        return Response({'error': 'Invalid amount'}, status=status.HTTP_400_BAD_REQUEST)

# Withdraw (creates pending transaction)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def withdraw(request):
    amount = request.data.get('amount')
    mobile_number = request.data.get('mobile_number')
    try:
        amount = Decimal(amount)
        if amount <= 0:
            return Response({'error': 'Amount must be positive'}, status=status.HTTP_400_BAD_REQUEST)
        profile = request.user.profile
        if profile.total < amount:
            return Response({'error': 'Insufficient balance'}, status=status.HTTP_400_BAD_REQUEST)
        with transaction.atomic():
            tx = Transaction.objects.create(
                user=request.user,
                transaction_type='WITHDRAWAL',
                amount=amount,
                mobile_number=mobile_number
            )
        return Response({
            'message': 'Withdrawal request submitted, pending admin approval',
            'transaction_id': str(tx.transaction_id)
        }, status=status.HTTP_201_CREATED)
    except (ValueError, TypeError):
        return Response({'error': 'Invalid amount'}, status=status.HTTP_400_BAD_REQUEST)

# Add investment option.
@api_view(['POST'])
@permission_classes([IsAdminUser])
def admin_create_investment_option(request):
    if not request.user.is_superuser:
        return Response({'error': 'Only superusers can create investment options'}, status=status.HTTP_403_FORBIDDEN)

    name = request.data.get('name')
    min_investment = request.data.get('min_investment')
    expected_return = request.data.get('expected_return')
    risk_level = request.data.get('risk_level')

    if not all([name, min_investment, expected_return, risk_level]):
        return Response({'error': 'All fields are required'}, status=status.HTTP_400_BAD_REQUEST)

    if risk_level not in ['LOW', 'MEDIUM', 'HIGH']:
        return Response({'error': 'Invalid risk level'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        min_investment = Decimal(min_investment)
        expected_return = Decimal(expected_return)
        option = InvestmentOption.objects.create(
            name=name,
            min_investment=min_investment,
            expected_return=expected_return,
            risk_level=risk_level
        )
        return Response({
            'message': 'Investment option created successfully',
            'option_id': option.id
        }, status=status.HTTP_201_CREATED)
    except (ValueError, TypeError):
        return Response({'error': 'Invalid numerical values'}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': f'Failed to create investment option: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)

# Invest (unchanged, but wrapped in transaction)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def available_investments(request):
    try:
        options = InvestmentOption.objects.all()
        response_data = [
            {
                'id': option.id,
                'name': option.name,
                'min_investment': str(option.min_investment),
                'expected_return': str(option.expected_return),
                'risk_level': option.risk_level
            }
            for option in options
        ]
        return Response(response_data, status=status.HTTP_200_OK)
    except Exception as e:
        print(f"Error in available_investments: {str(e)}")
        return Response(
            {"error": f"Failed to fetch investment options: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def invest(request):
    option_id = request.data.get('option_id')
    amount = request.data.get('amount')
    try:
        amount = Decimal(amount)
        option = InvestmentOption.objects.get(id=option_id)
        if amount < option.min_investment:
            return Response({'error': f'Amount must be at least {option.min_investment}'}, status=status.HTTP_400_BAD_REQUEST)
        profile = request.user.profile
        if profile.total < amount:
            return Response({'error': 'Insufficient balance'}, status=status.HTTP_400_BAD_REQUEST)
        with transaction.atomic():
            profile.total -= amount
            investment = Investment.objects.create(
                user=request.user,
                option=option,
                name=option.name,
                amount=amount,
                daily_return_rate=option.expected_return / 100  # Convert percentage to decimal
            )
            profile.save()
        return Response({
            'message': 'Investment successful',
            'investment': {
                'name': investment.name,
                'amount': str(investment.amount),
                'daily_return_rate': str(investment.daily_return_rate)
            },
            'total': str(profile.total)
        }, status=status.HTTP_201_CREATED)
    except InvestmentOption.DoesNotExist:
        return Response({'error': 'Investment option not found'}, status=status.HTTP_404_NOT_FOUND)
    except (ValueError, TypeError):
        return Response({'error': 'Invalid data'}, status=status.HTTP_400_BAD_REQUEST)
# Refresh Token
@api_view(['POST'])
@permission_classes([AllowAny])
def refresh_token(request):
    refresh_token = request.data.get('refresh')
    if not refresh_token:
        return Response({'error': 'Refresh token is required'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        refresh = RefreshToken(refresh_token)
        access_token = refresh.access_token
        return Response({'access': str(access_token)}, status=status.HTTP_200_OK)
    except Exception:
        return Response({'error': 'Invalid refresh token'}, status=status.HTTP_400_BAD_REQUEST)


# Admin: List all transactions
@api_view(['GET'])
@permission_classes([AllowAny])
def admin_list_transactions(request):
    transactions = Transaction.objects.all().select_related('user', 'processed_by')
    data = [
        {
            'id': tx.id,
            'user': tx.user.username,
            'type': tx.transaction_type,
            'amount': str(tx.amount),
            'status': tx.status,
            'mobile_number': tx.mobile_number,
            'created_at': tx.created_at,
            'updated_at': tx.updated_at,
            'processed_by': tx.processed_by.username if tx.processed_by else None,
            'notes': tx.notes,
            'transaction': str(tx.transaction_id)
        }
        for tx in transactions
    ]
    return Response(data, status=status.HTTP_200_OK)

# Admin: Approve transaction
@api_view(['POST'])
@permission_classes([IsAdminUser])
def admin_approve_transaction(request, transaction_id):
    try:
        with transaction.atomic():
            tx = Transaction.objects.select_related('user').get(id=transaction_id, status='PENDING')
            profile = tx.user.profile
            if tx.transaction_type == 'DEPOSIT':
                profile.total += tx.amount
                profile.total_deposit += tx.amount
            elif tx.transaction_type == 'WITHDRAWAL':
                if profile.total < tx.amount:
                    return Response({'error': 'Insufficient balance'}, status=status.HTTP_400_BAD_REQUEST)
                profile.total -= tx.amount
                profile.total_withdraw += tx.amount
            tx.status = 'APPROVED'
            tx.processed_by = request.user
            tx.save()
            profile.save()
        return Response({
            'message': f'{tx.transaction_type.lower()} approved',
            'user_total': str(profile.total)
        }, status=status.HTTP_200_OK)
    except Transaction.DoesNotExist:
        return Response({'error': 'Transaction not found or already processed'}, status=status.HTTP_404_NOT_FOUND)

# Admin: Set transaction to Pending
@api_view(['POST'])
@permission_classes([IsAdminUser])
def admin_set_transaction_pending(request, transaction_id):
    if not request.user.is_superuser:
        return Response({'error': 'Only superusers can modify transaction status'}, status=status.HTTP_403_FORBIDDEN)

    try:
        with transaction.atomic():
            tx = Transaction.objects.get(id=transaction_id)
            if tx.status == 'PENDING':
                return Response({'message': 'Transaction is already pending'}, status=status.HTTP_200_OK)
            tx.status = 'PENDING'
            tx.processed_by = None
            tx.notes = request.data.get('notes', '')
            tx.save()
        return Response({'message': 'Transaction set to pending'}, status=status.HTTP_200_OK)
    except Transaction.DoesNotExist:
        return Response({'error': 'Transaction not found'}, status=status.HTTP_404_NOT_FOUND)

# Admin: Decline transaction
@api_view(['POST'])
@permission_classes([IsAdminUser])
def admin_decline_transaction(request, transaction_id):
    notes = request.data.get('notes', '')
    try:
        with transaction.atomic():
            tx = Transaction.objects.get(id=transaction_id, status='PENDING')
            tx.status = 'DECLINED'
            tx.processed_by = request.user
            tx.notes = notes
            tx.save()
        return Response({'message': f'{tx.transaction_type.lower()} declined'}, status=status.HTTP_200_OK)
    except Transaction.DoesNotExist:
        return Response({'error': 'Transaction not found or already processed'}, status=status.HTTP_404_NOT_FOUND)

# Admin: Update user mobile number
@api_view(['POST'])
@permission_classes([IsAdminUser])
def admin_update_mobile(request, user_id):
    mobile_number = request.data.get('mobile_number')
    try:
        user = User.objects.get(id=user_id)
        profile = user.profile
        profile.mobile_number = mobile_number
        profile.save()
        return Response({
            'message': 'Mobile number updated',
            'mobile_number': profile.mobile_number
        }, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    except UserProfile.DoesNotExist:
        return Response({'error': 'User profile not found'}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def check_transaction_status(request, transaction_id):
    try:
        tx = Transaction.objects.get(transaction_id=transaction_id, user=request.user)
        return Response({
            'type' : tx.transaction_type,
            'amount' : str(tx.amount),
            'status' : tx.status,
            'created_at' : tx.created_at,
            'updated_at' : tx.updated_at
        })
    except Transaction.DoesNotExist:
        return Response({
            'error': 'Transaction not found'
        }, status=404)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def account_activity(request):
    try:
        activities = AccountActivity.objects.filter(user=request.user).order_by('-timestamp')[:10]
        response_data = [
            {
                'id': activity.id,
                'date': activity.timestamp.isoformat(),
                'action': activity.action,
                'ip': activity.ip_address or 'Unknown',
                'device': activity.device or 'Unknown',
            }
            for activity in activities
        ]
        return Response(response_data, status=status.HTTP_200_OK)
    except AccountActivity.DoesNotExist:
        return Response([], status=status.HTTP_200_OK)  # Return empty list if none exist
    except Exception as e:
        print("Error in account_activity view:", str(e))
        traceback.print_exc()
        return Response(
            {"error": f"Failed to fetch account activity: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    try:
        user = request.user
        current_password = request.data.get('current_password')
        new_password = request.data.get('new_password')

        if not current_password or not new_password:
            return Response(
                {'error': 'Current and new passwords are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not user.check_password(current_password):
            return Response(
                {'error': 'Current password is incorrect'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if len(new_password) < 8:
            return Response(
                {'error': 'New password must be at least 8 characters'},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.set_password(new_password)
        user.save()
        update_session_auth_hash(request, user)  # Keep user logged in

        # Log the activity
        AccountActivity.objects.create(
            user=user,
            action="Password updated",
            ip_address=request.META.get('REMOTE_ADDR', 'Unknown'),
            device=request.META.get('HTTP_USER_AGENT', 'Unknown'),
        )

        return Response(
            {'message': 'Password changed successfully'},
            status=status.HTTP_200_OK
        )
    except Exception as e:
        print("Error in change_password view:", str(e))
        traceback.print_exc()
        return Response(
            {"error": f"Failed to change password: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def sell(request):
    investment_id = request.data.get('investment_id')
    try:
        investment = Investment.objects.get(id=investment_id, user=request.user)
        profile = request.user.profile
        with transaction.atomic():
            profile.total += investment.amount
            investment.delete()
            profile.save()
        return Response(
            {
                'message': 'Investment sold',
                'total': str(profile.total),
            },
            status=status.HTTP_200_OK
        )
    except Investment.DoesNotExist:
        return Response({'error': 'Investment not found'}, status=status.HTTP_404_NOT_FOUND)



def homepage(request):
    return render(request, 'homepage.html', {'site_name': 'GrowSafe Investments'})


@api_view(['GET'])
@permission_classes([AllowAny])
def admin_metrics(request):
    return Response({
        'total_users': User.objects.count(),
        'pending_transactions': Transaction.objects.filter(status='PENDING').count(),
        'total_investments': Investment.objects.count(),
        'active_options': InvestmentOption.objects.count(),
    })


@api_view(['POST'])
@permission_classes([IsAdminUser])
def admin_create_user(request):
    if not request.user.is_superuser:
        return Response({'error': 'Only superusers can create users'}, status=status.HTTP_403_FORBIDDEN)

    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')
    first_name = request.data.get('first_name', '')
    last_name = request.data.get('last_name', '')
    is_staff = request.data.get('is_staff', False)

    if not all([username, email, password]):
        return Response({'error': 'Username, email, and password are required'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(email=email).exists():
        return Response({'error': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=first_name,
            last_name=last_name,
            is_staff=is_staff
        )
        UserProfile.objects.get_or_create(user=user)
        return Response({'message': 'User created successfully', 'user_id': user.id}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': f'Failed to create user: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def admin_delete_user(request, user_id):
    if not request.user.is_superuser:
        return Response({'error': 'Only superusers can delete users'}, status=status.HTTP_403_FORBIDDEN)

    try:
        user = User.objects.get(id=user_id)
        if user == request.user:
            return Response({'error': 'Cannot delete yourself'}, status=status.HTTP_400_BAD_REQUEST)
        user.delete()
        return Response({'message': 'User deleted successfully'}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': f'Failed to delete user: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)
