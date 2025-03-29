from django.contrib.auth import authenticate, logout
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.http import JsonResponse

# Root endpoint
def auth_root(request):
    return JsonResponse({"message": "Auth root endpoint"})

# Signup API view for user registration
@api_view(['POST'])
@permission_classes([AllowAny])  # Allow unauthenticated access
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

    # Create user and generate a token
    user = User.objects.create_user(username=username, email=email, password=password)
    # Create JWT tokens for the user
    refresh = RefreshToken.for_user(user)
    access_token = refresh.access_token
    return Response({
        'access': str(access_token),
        'refresh': str(refresh),
        'message': 'User created successfully'
    }, status=status.HTTP_201_CREATED)

# Login API view for user authentication
@api_view(['POST'])
@permission_classes([AllowAny])  # Allow unauthenticated access
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(request, username=username, password=password)
    if user is not None:
        # Generate JWT tokens for the user
        refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token
        return Response({
            'access': str(access_token),
            'refresh': str(refresh),
            'message': 'Login successful'
        }, status=status.HTTP_200_OK)
    return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

# Logout API view for user logout (simply client side delete token)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    # Since JWT is stateless, no need to do anything on the server side. 
    # We simply instruct the client to delete the token.
    return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)

# Profile API view to get user details
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile(request):
    user = request.user
    return Response({
        'username': user.username,
        'email': user.email,
        'message': 'You are logged in'
    }, status=status.HTTP_200_OK)
