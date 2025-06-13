from rest_framework import serializers
from .models import PropertyType, Client, Agent, Broker, Property, Booking
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
       class Meta:
           model = User
           fields = ['id', 'username', 'email', 'password']
           extra_kwargs = {'password': {'write_only': True}}

       def create(self, validated_data):
           user = User.objects.create_user(**validated_data)
           return user

class PropertyTypeSerializer(serializers.ModelSerializer):
       class Meta:
           model = PropertyType
           fields = '__all__'

class ClientSerializer(serializers.ModelSerializer):
       user = UserSerializer()
       class Meta:
           model = Client
           fields = '__all__'

       def create(self, validated_data):
           user_data = validated_data.pop('user')
           user = UserSerializer().create(user_data)
           client = Client.objects.create(user=user, **validated_data)
           return client

class AgentSerializer(serializers.ModelSerializer):
       user = UserSerializer()
       class Meta:
           model = Agent
           fields = '__all__'

       def create(self, validated_data):
           user_data = validated_data.pop('user')
           user = UserSerializer().create(user_data)
           agent = Agent.objects.create(user=user, **validated_data)
           return agent

class BrokerSerializer(serializers.ModelSerializer):
       user = UserSerializer()
       class Meta:
           model = Broker
           fields = '__all__'

       def create(self, validated_data):
           user_data = validated_data.pop('user')
           user = UserSerializer().create(user_data)
           user.is_staff = True  # Grant admin access
           user.save()
           broker = Broker.objects.create(user=user, **validated_data)
           return broker

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