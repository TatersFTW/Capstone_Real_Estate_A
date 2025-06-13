from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from .models import PropertyType, Client, Agent, Broker, Property, Booking
from .serializers import PropertyTypeSerializer, ClientSerializer, AgentSerializer, BrokerSerializer, PropertySerializer, BookingSerializer

class PropertyTypeViewSet(viewsets.ModelViewSet):
       queryset = PropertyType.objects.all()
       serializer_class = PropertyTypeSerializer
       permission_classes = [IsAuthenticated]

class ClientViewSet(viewsets.ModelViewSet):
       queryset = Client.objects.all()
       serializer_class = ClientSerializer
       permission_classes = [AllowAny]  # Allow guests to register as clients

       def get_permissions(self):
           if self.action in ['list', 'retrieve', 'update', 'partial_update', 'destroy']:
               return [IsAdminUser()]  # Restrict other actions to admins
           return [AllowAny()]

class AgentViewSet(viewsets.ModelViewSet):
       queryset = Agent.objects.all()
       serializer_class = AgentSerializer
       permission_classes = [IsAdminUser]

class BrokerViewSet(viewsets.ModelViewSet):
       queryset = Broker.objects.all()
       serializer_class = BrokerSerializer
       permission_classes = [IsAdminUser]

class PropertyViewSet(viewsets.ModelViewSet):
       queryset = Property.objects.all()
       serializer_class = PropertySerializer
       permission_classes = [IsAuthenticated]

       def get_permissions(self):
           if self.action in ['create', 'update', 'partial_update', 'destroy']:
               return [IsAdminUser() | IsAgent()]
           return [IsAuthenticated()]

class BookingViewSet(viewsets.ModelViewSet):
       queryset = Booking.objects.all()
       serializer_class = BookingSerializer
       permission_classes = [IsAuthenticated]

       def get_permissions(self):
           if self.action in ['create']:
               return [IsClient()]
           return [IsAdminUser()]

from rest_framework.permissions import BasePermission

class IsAgent(BasePermission):
       def has_permission(self, request, view):
           return hasattr(request.user, 'agent')

class IsClient(BasePermission):
       def has_permission(self, request, view):
           return hasattr(request.user, 'client')