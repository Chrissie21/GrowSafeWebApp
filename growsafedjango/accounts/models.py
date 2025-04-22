from django.db import models
from django.contrib.auth.models import User
from decimal import Decimal
import uuid
from uuid import uuid4

class InvestmentOption(models.Model):
    name = models.CharField(max_length=50)
    min_investment = models.DecimalField(max_digits=15, decimal_places=2)
    expected_return = models.DecimalField(max_digits=5, decimal_places=2)
    risk_level = models.CharField(max_length=20, choices=[
        ('LOW', 'Low'),
        ('MEDIUM', 'Medium'),
        ('HIGH', 'High')
    ])
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Investment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='investments')
    option = models.ForeignKey(InvestmentOption, on_delete=models.CASCADE, related_name='investments', null=True)
    name = models.CharField(max_length=50)
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    daily_return_rate = models.DecimalField(max_digits=5, decimal_places=4)  # e.g., 0.05 for 5%
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.user.username}"

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    total = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    address = models.TextField(null=True, blank=True)
    total_deposit = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    total_withdraw = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    daily_earnings = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
    mobile_number = models.CharField(max_length=15, blank=True, null=True)  # For payment processing

    def calculate_daily_earnings(self):
        earnings = sum(
            inv.amount * inv.daily_return_rate for inv in self.user.investments.all()
        )
        self.daily_earnings = earnings
        self.total += earnings
        self.save()

    def __str__(self):
        return f"Profile of {self.user.username}"

class Transaction(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('APPROVED', 'Approved'),
        ('DECLINED', 'Declined'),
    )
    TYPE_CHOICES = (
        ('DEPOSIT', 'Deposit'),
        ('WITHDRAWAL', 'Withdrawal'),
    )

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='transactions')
    transaction_id = models.UUIDField(default=uuid4, editable=False, unique=True)
    transaction_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    mobile_number = models.CharField(max_length=15, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    processed_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='processed_transactions', limit_choices_to={'is_staff': True}
    )
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.transaction_type} - {self.user.username} - {self.amount} - {self.status}"
class TransactionStatusHistory(models.Model):
    transaction = models.ForeignKey(Transaction, on_delete=models.CASCADE, related_name='status_history')
    status = models.CharField(max_length=20, choices=Transaction.STATUS_CHOICES)
    changed_at = models.DateTimeField(auto_now_add=True)
    changed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return f"{self.transaction.code}-> {self.status} by {self.changed_by}"


class AccountActivity(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    action = models.CharField(max_length=100)
    ip_address = models.CharField(max_length=45)
    device = models.CharField(max_length=200)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.action} at {self.timestamp}"
