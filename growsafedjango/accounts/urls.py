from django.urls import path
from . import views

urlpatterns = [
    # Client endpoints
    path('', views.auth_root, name='auth_root'),
    path('signup/', views.signup, name='signup'),
    path('login/', views.login, name='login'),
    path('logout/', views.logout, name='logout'),
    path('profile/', views.profile, name='profile'),
    path('deposit/', views.deposit, name='deposit'),
    path('withdraw/', views.withdraw, name='withdraw'),
    path('invest/', views.invest, name='invest'),
    path('token/refresh/', views.refresh_token, name='token_refresh'),
    # Admin endpoints
    path('admin/transactions/', views.admin_list_transactions, name='admin_list_transactions'),
    path('admin/transaction/<int:transaction_id>/approve/', views.admin_approve_transaction, name='admin_approve_transaction'),
    path('admin/transaction/<int:transaction_id>/decline/', views.admin_decline_transaction, name='admin_decline_transaction'),
    path('admin/user/<int:user_id>/mobile/', views.admin_update_mobile, name='admin_update_mobile'),
]