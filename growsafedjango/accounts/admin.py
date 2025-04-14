from django.contrib import admin
from .models import UserProfile, Investment, Transaction, InvestmentOption

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'total', 'total_deposit', 'total_withdraw', 'daily_earnings', 'mobile_number')
    search_fields = ('user__username', 'user__email', 'mobile_number')
    list_filter = ('total', 'daily_earnings')
    readonly_fields = ('daily_earnings',)

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user')

@admin.register(Investment)
class InvestmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'amount', 'daily_return_rate', 'created_at')
    search_fields = ('name', 'user__username')
    list_filter = ('created_at', 'daily_return_rate')
    date_hierarchy = 'created_at'

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user')

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('user', 'transaction_type', 'amount', 'status', 'mobile_number', 'created_at', 'processed_by')
    search_fields = ('user__username', 'mobile_number')
    list_filter = ('transaction_type', 'status', 'created_at')
    date_hierarchy = 'created_at'
    actions = ['approve_transactions', 'decline_transactions']

    def get_queryset(self, request):
        return super().get_queryset(request).select_related('user', 'processed_by')

    @admin.action(description='Approve selected transactions')
    def approve_transactions(self, request, queryset):
        for transaction in queryset.filter(status='PENDING'):
            transaction.status = 'APPROVED'
            transaction.processed_by = request.user
            transaction.save()
            profile = transaction.user.profile
            if transaction.transaction_type == 'DEPOSIT':
                profile.total += transaction.amount
                profile.total_deposit += transaction.amount
            elif transaction.transaction_type == 'WITHDRAWAL' and profile.total >= transaction.amount:
                profile.total -= transaction.amount
                profile.total_withdraw += transaction.amount
            profile.save()
        self.message_user(request, "Selected transactions approved.")

    @admin.action(description='Decline selected transactions')
    def decline_transactions(self, request, queryset):
        for transaction in queryset.filter(status='PENDING'):
            transaction.status = 'DECLINED'
            transaction.processed_by = request.user
            transaction.save()
        self.message_user(request, "Selected transactions declined.")
