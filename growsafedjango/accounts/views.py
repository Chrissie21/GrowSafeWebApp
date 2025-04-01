from django.contrib.auth import authenticate, logout
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.http import JsonResponse
from .models import UserProfile, Investment
from decimal import Decimal

# Root endpoint
def auth_root(request):
    return JsonResponse({"message": "Auth root endpoint"})

# Signup with profile creation
@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')
    confirm_password = request.data.get('confirm_password')

    if not all([username, email, password, confirm_password]):
        return Response({'error': 'All fields are required'}, status=status.HTTP_400_BAD_REQUEST)

    if password != confirm_password:
        return Response({'error': 'Passwords do not match'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(email=email).exists():
        return Response({'error': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=username, email=email, password=password)
    UserProfile.objects.get_or_create(user=user)  # Ensure Profile Exists
    refresh = RefreshToken.for_user(user)
    access_token = refresh.access_token
    return Response({
        'access': str(access_token),
        'refresh': str(refresh),
        'message': 'User created successfully'
    }, status=status.HTTP_201_CREATED)

# Login
@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(request, username=username, password=password)
    if user is not None:
        refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token
        return Response({
            'access': str(access_token),
            'refresh': str(refresh),
            'message': 'Login successful'
        }, status=status.HTTP_200_OK)
    return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

# Logout
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)

# Enhanced Profile with financial data
@api_view(['GET'])
@permission_classes([AllowAny]) # Temporarily Allowing any for testing
def profile(request):
    try:
     user = request.user
     profile = user.profile
     profile.calculate_daily_earnings()  # Update earnings
     investments = [
         {'name': inv.name, 'amount': str(inv.amount), 'daily_return_rate': str(inv.daily_return_rate)}
         for inv in user.investments.all()
     ]
     return Response({
         'username': user.username,
         'email': user.email,
         'total': str(profile.total),
         'total_deposit': str(profile.total_deposit),
         'total_withdraw': str(profile.total_withdraw),
         'daily_earnings': str(profile.daily_earnings),
         'investments': investments,
         'message': 'You are logged in'
     }, status=status.HTTP_200_OK)
    except UserProfile.DoesNotExist:
        return Response({'error': 'User Profile not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'error': f'Internal server error: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Deposit
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def deposit(request):
    amount = request.data.get('amount')
    try:
        amount = Decimal(amount)
        if amount <= 0:
            return Response({'error': 'Amount must be positive'}, status=status.HTTP_400_BAD_REQUEST)
        profile = request.user.profile
        profile.deposit(amount)
        return Response({'message': 'Deposit successful', 'total': str(profile.total)}, status=status.HTTP_200_OK)
    except (ValueError, TypeError):
        return Response({'error': 'Invalid amount'}, status=status.HTTP_400_BAD_REQUEST)

# Withdraw
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def withdraw(request):
    amount = request.data.get('amount')
    try:
        amount = Decimal(amount)
        if amount <= 0:
            return Response({'error': 'Amount must be positive'}, status=status.HTTP_400_BAD_REQUEST)
        profile = request.user.profile
        if profile.withdraw(amount):
            return Response({'message': 'Withdrawal successful', 'total': str(profile.total)}, status=status.HTTP_200_OK)
        return Response({'error': 'Insufficient balance'}, status=status.HTTP_400_BAD_REQUEST)
    except (ValueError, TypeError):
        return Response({'error': 'Invalid amount'}, status=status.HTTP_400_BAD_REQUEST)

# Invest
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def invest(request):
    name = request.data.get('name')
    amount = request.data.get('amount')
    daily_return_rate = request.data.get('daily_return_rate')
    
    try:
        amount = Decimal(amount)
        daily_return_rate = Decimal(daily_return_rate)
        if amount <= 0 or daily_return_rate <= 0:
            return Response({'error': 'Amount and return rate must be positive'}, status=status.HTTP_400_BAD_REQUEST)
        
        profile = request.user.profile
        if profile.total < amount:
            return Response({'error': 'Insufficient balance'}, status=status.HTTP_400_BAD_REQUEST)
        
        profile.total -= amount
        investment = Investment.objects.create(
            user=request.user,
            name=name,
            amount=amount,
            daily_return_rate=daily_return_rate
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
    except (ValueError, TypeError):
        return Response({'error': 'Invalid data'}, status=status.HTTP_400_BAD_REQUEST)

# Refresh Token (fix endpoint name)
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
    except Exception as e:
        return Response({'error': 'Invalid refresh token or session expired'}, status=status.HTTP_400_BAD_REQUEST)