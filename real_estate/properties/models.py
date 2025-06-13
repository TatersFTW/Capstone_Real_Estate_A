from django.db import models
from django.contrib.auth.models import User

class PropertyType(models.Model):
       name = models.CharField(max_length=100)

       def __str__(self):
           return self.name

class Client(models.Model):
       user = models.OneToOneField(User, on_delete=models.CASCADE)
       phone = models.CharField(max_length=15)
       address = models.TextField()

       def __str__(self):
           return self.user.username

class Agent(models.Model):
       user = models.OneToOneField(User, on_delete=models.CASCADE)
       phone = models.CharField(max_length=15)
       license_number = models.CharField(max_length=50)

       def __str__(self):
           return self.user.username

class Broker(models.Model):
       user = models.OneToOneField(User, on_delete=models.CASCADE)
       phone = models.CharField(max_length=15)
       company_name = models.CharField(max_length=100)

       def __str__(self):
           return self.user.username

class Property(models.Model):
       title = models.CharField(max_length=200)
       description = models.TextField()
       price = models.DecimalField(max_digits=10, decimal_places=2)
       address = models.TextField()
       property_type = models.ForeignKey(PropertyType, on_delete=models.CASCADE)
       agent = models.ForeignKey(Agent, on_delete=models.CASCADE)
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