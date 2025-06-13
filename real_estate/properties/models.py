from django.db import models
from django.contrib.auth.models import User

class PropertyType(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class Client(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='client')
    phone = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.user.username

class Agent(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='agent')
    phone = models.CharField(max_length=15, blank=True, null=True)
    license_number = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.user.username

class Broker(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='broker')
    phone = models.CharField(max_length=15, blank=True, null=True)
    company_name = models.CharField(max_length=100)

    def __str__(self):
        return self.user.username

class Property(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    address = models.TextField()
    property_type = models.ForeignKey(PropertyType, on_delete=models.CASCADE, related_name='properties')
    agent = models.ForeignKey(Agent, on_delete=models.CASCADE, related_name='properties')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Booking(models.Model):
         client = models.ForeignKey(Client, on_delete=models.CASCADE)
         property = models.ForeignKey(Property, on_delete=models.CASCADE)
         booking_date = models.DateTimeField(auto_now_add=True)
         status = models.CharField(max_length=20, choices=[('pending', 'Pending'), ('confirmed', 'Confirmed'), ('cancelled', 'Cancelled')])

         def __str__(self):
             return f"{self.client} - {self.property}"