from rest_framework import viewsets
from .models import PropertyType, Client, Agent, Broker, Property, Booking
from .serializers import PropertyTypeSerializer, ClientSerializer, AgentSerializer, BrokerSerializer, PropertySerializer, BookingSerializer

class PropertyTypeViewSet(viewsets.ModelViewSet):
         queryset = PropertyType.objects.all()
         serializer_class = PropertyTypeSerializer

class ClientViewSet(viewsets.ModelViewSet):
         queryset = Client.objects.all()
         serializer_class = ClientSerializer

class AgentViewSet(viewsets.ModelViewSet):
         queryset = Agent.objects.all()
         serializer_class = AgentSerializer

class BrokerViewSet(viewsets.ModelViewSet):
         queryset = Broker.objects.all()
         serializer_class = BrokerSerializer

class PropertyViewSet(viewsets.ModelViewSet):
         queryset = Property.objects.all()
         serializer_class = PropertySerializer

class BookingViewSet(viewsets.ModelViewSet):
         queryset = Booking.objects.all()
         serializer_class = BookingSerializer