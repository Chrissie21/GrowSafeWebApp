from django.urls import path
from . import views
from django.contrib.auth.views import LoginView

app_name = 'api-auth'

urlpatterns = [
    # path('login//', LoginView.as_view(template_name='registration/login.html'), name='login'),
    # Client endpoints
    path('', views.auth_root, name='auth_root'),
    path('signup/', views.signup, name='signup'),
    path('login/', views.login, name='login'),
    path('logout/', views.logout, name='logout'),
    path('profile/', views.profile, name='profile'),
    path('deposit/', views.deposit, name='deposit'),
    path('withdraw/', views.withdraw, name='withdraw'),
    path('sell/', views.sell, name='sell'),
    path('invest/', views.invest, name='invest'),
    path('token/refresh/', views.refresh_token, name='token_refresh'),
    path('account-activity/', views.account_activity, name='account_activity'),
    path('change-password/', views.change_password, name='change_password'),
    path('available-investments/', views.available_investments, name='available_investments'),
    # Admin endpoints
    path('admin/transactions/', views.admin_list_transactions, name='admin_list_transactions'),
    path('admin/transaction/<int:transaction_id>/approve/', views.admin_approve_transaction, name='admin_approve_transaction'),
    path('admin/transaction/<int:transaction_id>/decline/', views.admin_decline_transaction, name='admin_decline_transaction'),
    path('admin/user/<int:user_id>/mobile/', views.admin_update_mobile, name='admin_update_mobile'),
    path('admin/metrics/', views.admin_metrics, name='admin_metrics'),
    path('admin/users/create/', views.admin_create_user, name='admin_create_user'),
    path('admin/user/<int:user_id>/delete/', views.admin_delete_user, name='admin_delete_user'),
    path('admin/transaction/<int:transaction_id>/pending/', views.admin_set_transaction_pending, name='admin_set_transaction_pending'),
    path('admin/investment-options/create/', views.admin_create_investment_option, name='admin_create_investment_option'),
    path('admin/users/', views.admin_list_users, name='admin_list_users'),
    path('admin/user/<int:user_id>/update/', views.admin_update_user, name='admin_update_user'),
]
