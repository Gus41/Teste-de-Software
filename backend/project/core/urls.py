from django.urls import path
from .views import ClienteListCreateView, ClienteDetailView, ContaCorrenteDetailView, ContaCorrenteListCreateView

urlpatterns = [
    path('clientes/', ClienteListCreateView.as_view(), name='clientes-list-create'),
    path('clientes/<int:pk>/', ClienteDetailView.as_view(), name='clientes-detail'),
    path('contas/', ContaCorrenteListCreateView.as_view(), name='contas-list-create'),
    path('contas/<int:pk>/', ContaCorrenteDetailView.as_view(), name='contas-detail')
]
