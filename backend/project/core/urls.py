from django.urls import path
from .views import ClienteListCreateView, ClienteDetailView
from .views import ClienteViewSet

urlpatterns = [
    path('api/', include(router.urls)),
]
urlpatterns = [
    path('clientes/', ClienteListCreateView.as_view(), name='clientes-list-create'),
    path('clientes/<int:pk>/', ClienteDetailView.as_view(), name='clientes-detail'),
]

