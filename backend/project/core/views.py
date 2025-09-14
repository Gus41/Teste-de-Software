from rest_framework import status, generics
from .models import Cliente
from .serializers import ClienteSerializer
from django.shortcuts import render
from .views import lista_clientes

def pagina_criar_cliente(request):
    return render(request, 'CriarCliente.html')
    
class ClienteListCreateView(generics.ListCreateAPIView):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer

class ClienteDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer
    
def lista_clientes(request):
    clientes = Cliente.objects.select_related('conta_corrente').all()
    return render(request, 'Clientes.html', {'clientes': clientes})
