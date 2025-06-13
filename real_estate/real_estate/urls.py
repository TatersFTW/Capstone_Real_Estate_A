from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from rest_framework.routers import DefaultRouter
from properties.views import PropertyTypeViewSet, ClientViewSet, AgentViewSet, BrokerViewSet, PropertyViewSet, BookingViewSet

router = DefaultRouter()
router.register(r'property-types', PropertyTypeViewSet)
router.register(r'clients', ClientViewSet)
router.register(r'agents', AgentViewSet)
router.register(r'brokers', BrokerViewSet)
router.register(r'properties', PropertyViewSet)
router.register(r'bookings', BookingViewSet)

urlpatterns = [
path('admin/', admin.site.urls),
path('api/', include(router.urls)),
path('', TemplateView.as_view(template_name='index.html'), name='home'),
      ]