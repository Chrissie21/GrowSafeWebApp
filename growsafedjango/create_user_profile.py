from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from accounts.models import UserProfile

class Command(BaseCommand):
    help = "Creates UserProfile for users without one"

    def handle(self, *args, **kwargs):
        users = User.objects.all()
        created_count = 0
        for user in users:
            profile, created = UserProfile.objects.get_or_create(user=user)
            if created:
                self.stdout.write(self.style.SUCCESS(f"Created profile for {user.username}"))
                created_count += 1
            else:
                self.stdout.write(f"Profile already exists for {user.username}")
        self.stdout.write(self.style.SUCCESS(f"Created {created_count} profiles"))