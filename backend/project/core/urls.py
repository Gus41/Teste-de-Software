from django.urls import path
from .views import ClienteListCreateView, ClienteDetailView

urlpatterns = [
    path('clientes/', ClienteListCreateView.as_view(), name='clientes-list-create'),
    path('clientes/<int:pk>/', ClienteDetailView.as_view(), name='clientes-detail'),
]
urlpatterns = [
    path('clientes/', lista_clientes, name='lista_clientes'),
]
