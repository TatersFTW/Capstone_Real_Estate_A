from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
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
       path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
       path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
       path('', TemplateView.as_view(template_name='index.html'), name='home'),
       path('about/', TemplateView.as_view(template_name='about.html'), name='about'),
       path('properties/', TemplateView.as_view(template_name='properties.html'), name='properties'),
       path('contact/', TemplateView.as_view(template_name='contact.html'), name='contact'),
   ]