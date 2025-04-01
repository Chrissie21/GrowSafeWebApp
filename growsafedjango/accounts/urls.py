from django.urls import path
from . import views

urlpatterns = [
    path('', views.auth_root, name='auth_root'),
    path('signup/', views.signup, name='signup'),
    path('login/', views.login, name='login'),
    path('logout/', views.logout, name='logout'),
    path('profile/', views.profile, name='profile'),
    path('deposit/', views.deposit, name='deposit'),
    path('withdraw/', views.withdraw, name='withdraw'),
    path('invest/', views.invest, name='invest'),
    path('token/refresh/', views.refresh_token, name='token_refresh'),
]