from rest_framework import serializers
from .models import PropertyType, Client, Agent, Broker, Property, Booking
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
         class Meta:
             model = User
             fields = ['id', 'username', 'email']

class PropertyTypeSerializer(serializers.ModelSerializer):
         class Meta:
             model = PropertyType
             fields = '__all__'

class ClientSerializer(serializers.ModelSerializer):
         user = UserSerializer()
         class Meta:
             model = Client
             fields = '__all__'

class AgentSerializer(serializers.ModelSerializer):
         user = UserSerializer()
         class Meta:
             model = Agent
             fields = '__all__'

class BrokerSerializer(serializers.ModelSerializer):
         user = UserSerializer()
         class Meta:
             model = Broker
             fields = '__all__'

class PropertySerializer(serializers.ModelSerializer):
         property_type = PropertyTypeSerializer()
         agent = AgentSerializer()
         class Meta:
             model = Property
             fields = '__all__'

class BookingSerializer(serializers.ModelSerializer):
         client = ClientSerializer()
         property = PropertySerializer()
         class Meta:
             model = Booking
             fields = '__all__'