from django.db import models
from django.contrib.auth.models import User
from decimal import Decimal

class Investment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='investments')
    name = models.CharField(max_length=50)
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    daily_return_rate = models.DecimalField(max_digits=5, decimal_places=4)  # e.g., 0.05 for 5%
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.user.username}"

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    total = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)
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
    transaction_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    mobile_number = models.CharField(max_length=15, blank=True, null=True)  # Mobile number used
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    processed_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='processed_transactions', limit_choices_to={'is_staff': True}
    )  # Admin who processed it
    notes = models.TextField(blank=True, null=True)  # Optional notes (e.g., decline reason)

    def __str__(self):
        return f"{self.transaction_type} - {self.user.username} - {self.amount} - {self.status}"