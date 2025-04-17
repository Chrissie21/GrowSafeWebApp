from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from .models import UserProfile, Investment, Transaction, InvestmentOption, TransactionStatusHistory, AccountActivity
from django.contrib import messages

# Custom Admin Site for Dashboard Metrics
class CustomAdminSite(admin.AdminSite):
    def each_context(self, request):
        context = super().each_context(request)
        context['total_users'] = User.objects.count()
        context['pending_transactions'] = Transaction.objects.filter(status='PENDING').count()
        context['total_investments'] = Investment.objects.count()
        context['active_options'] = InvestmentOption.objects.count()
        return context

# Replace the default admin site
admin.site = CustomAdminSite(name='custom_admin')

# Inline UserProfile for User admin
class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    verbose_name_plural = 'Profile'
    fields = ('total', 'total_deposit', 'total_withdraw', 'daily_earnings', 'mobile_number', 'address')
    readonly_fields = ('daily_earnings',)

# Extend UserAdmin to include UserProfile
class UserAdmin(BaseUserAdmin):
    inlines = (UserProfileInline,)
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'is_superuser', 'get_total_balance')
    list_filter = ('is_staff', 'is_superuser')
    search_fields = ('username', 'email', 'first_name', 'last_name')
    actions = ['delete_selected']  # Enable user deletion

    def get_total_balance(self, obj):
        try:
            return obj.profile.total if hasattr(obj, 'profile') else 0.00
        except UserProfile.DoesNotExist:
            return 0.00
    get_total_balance.short_description = 'Total Balance'

    def has_delete_permission(self, request, obj=None):
        # Only superusers can delete users
        return request.user.is_superuser

# Token Admin for managing auth tokens
@admin.register(Token)
class TokenAdmin(admin.ModelAdmin):
    list_display = ('user', 'key', 'created')
    search_fields = ('user__username', 'key')
    list_filter = ('created',)
    raw_id_fields = ('user',)
    readonly_fields = ('key', 'created')

    def has_add_permission(self, request):
        # Only superusers can create tokens
        return request.user.is_superuser

    def has_delete_permission(self, request, obj=None):
        # Only superusers can delete tokens
        return request.user.is_superuser

# Register UserProfile
@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'total', 'total_deposit', 'total_withdraw', 'daily_earnings', 'mobile_number')
    search_fields = ('user__username', 'user__email', 'mobile_number')
    list_filter = ('total', 'daily_earnings')
    readonly_fields = ('daily_earnings',)
    raw_id_fields = ('user',)

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user')

    def has_delete_permission(self, request, obj=None):
        # Only superusers can delete profiles
        return request.user.is_superuser

# Register Investment
@admin.register(Investment)
class InvestmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'option', 'amount', 'daily_return_rate', 'created_at')
    search_fields = ('name', 'user__username')
    list_filter = ('created_at', 'daily_return_rate', 'option__risk_level')
    date_hierarchy = 'created_at'
    raw_id_fields = ('user', 'option')

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user', 'option')

# Register Transaction
@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('transaction_id', 'user', 'transaction_type', 'amount', 'status', 'mobile_number', 'created_at', 'processed_by')
    search_fields = ('user__username', 'mobile_number', 'transaction_id')
    list_filter = ('transaction_type', 'status', 'created_at')
    date_hierarchy = 'created_at'
    actions = ['approve_transactions', 'decline_transactions', 'set_pending_transactions']
    raw_id_fields = ('user', 'processed_by')

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user', 'processed_by')

    @admin.action(description='Approve selected transactions')
    def approve_transactions(self, request, queryset):
        if not request.user.is_superuser:
            self.message_user(request, "Only superusers can approve transactions.", level='error')
            return
        for transaction in queryset.filter(status='PENDING'):
            profile = transaction.user.profile
            if transaction.transaction_type == 'WITHDRAWAL' and profile.total < transaction.amount:
                self.message_user(request, f"Skipped {transaction.transaction_id}: Insufficient balance.", level='error')
                continue
            transaction.status = 'APPROVED'
            transaction.processed_by = request.user
            if transaction.transaction_type == 'DEPOSIT':
                profile.total += transaction.amount
                profile.total_deposit += transaction.amount
            elif transaction.transaction_type == 'WITHDRAWAL':
                profile.total -= transaction.amount
                profile.total_withdraw += transaction.amount
            transaction.save()
            profile.save()
        self.message_user(request, "Selected transactions approved.", level=messages.SUCCESS)

    @admin.action(description='Decline selected transactions')
    def decline_transactions(self, request, queryset):
        if not request.user.is_superuser:
            self.message_user(request, "Only superusers can decline transactions.", level='error')
            return
        for transaction in queryset.filter(status='PENDING'):
            transaction.status = 'DECLINED'
            transaction.processed_by = request.user
            transaction.save()
        self.message_user(request, "Selected transactions declined.", level=messages.SUCCESS)

    @admin.action(description='Set selected transactions to PENDING')
    def set_pending_transactions(self, request, queryset):
        if not request.user.is_superuser:
            self.message_user(request, "Only superusers can set transactions to PENDING.", level='error')
            return
        for transaction in queryset.exclude(status='PENDING'):
            transaction.status = 'PENDING'
            transaction.processed_by = None  # Reset processed_by
            transaction.save()
        self.message_user(request, "Selected transactions set to PENDING.", level=messages.SUCCESS)

    def has_change_permission(self, request, obj=None):
        # Allow superusers and staff to view/edit transactions
        return request.user.is_superuser or request.user.is_staff

# Register InvestmentOption
@admin.register(InvestmentOption)
class InvestmentOptionAdmin(admin.ModelAdmin):
    list_display = ('name', 'min_investment', 'expected_return', 'risk_level', 'created_at')
    list_filter = ('risk_level',)
    search_fields = ('name',)
    ordering = ('-created_at',)

# Register TransactionStatusHistory
@admin.register(TransactionStatusHistory)
class TransactionStatusHistoryAdmin(admin.ModelAdmin):
    list_display = ('transaction', 'status', 'changed_at', 'changed_by')
    list_filter = ('status',)
    search_fields = ('transaction__transaction_id', 'changed_by__username')
    raw_id_fields = ('transaction', 'changed_by')
    ordering = ('-changed_at',)

# Register AccountActivity
@admin.register(AccountActivity)
class AccountActivityAdmin(admin.ModelAdmin):
    list_display = ('user', 'action', 'ip_address', 'device', 'timestamp')
    list_filter = ('action',)
    search_fields = ('user__username', 'ip_address', 'device')
    raw_id_fields = ('user',)
    ordering = ('-timestamp',)

# Register User with custom UserAdmin
admin.site.register(User, UserAdmin)
