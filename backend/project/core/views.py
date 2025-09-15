from rest_framework import status, generics
from .models import Cliente, ContaCorrente
from .serializers import ClienteSerializer, ContaCorrenteSerializer


class ClienteListCreateView(generics.ListCreateAPIView):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer

class ClienteDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer

class ContaCorrenteListCreateView(generics.ListCreateAPIView):
    queryset = ContaCorrente.objects.all()
    serializer_class = ContaCorrenteSerializer

class ContaCorrenteDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ContaCorrente.objects.all()
    serializer_class = ContaCorrenteSerializer