from django.db import models
from django.contrib.auth.models import User

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

    def calculate_daily_earnings(self):
        earnings = sum(
            inv.amount * inv.daily_return_rate for inv in self.user.investments.all()
        )
        self.daily_earnings = earnings
        self.total += earnings
        self.save()

    def deposit(self, amount):
        self.total += amount
        self.total_deposit += amount
        self.save()

    def withdraw(self, amount):
        if self.total >= amount:
            self.total -= amount
            self.total_withdraw += amount
            self.save()
            return True
        return False

    def __str__(self):
        return f"Profile of {self.user.username}"