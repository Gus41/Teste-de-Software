from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Cliente, ContaCorrente


class ClienteAPITestCase(APITestCase):

    def setUp(self):

        self.conta1 = ContaCorrente.objects.create(saldo=1000.00, ativa=True)
        self.cliente1 = Cliente.objects.create(
            nome="Maria Silva",
            idade=31,
            email="mariasilva@gmail.com",
            ativo=True,
            conta_corrente=self.conta1
        )

        self.conta2 = ContaCorrente.objects.create(saldo=500.00, ativa=True)
        self.cliente2 = Cliente.objects.create(
            nome="Felipe Augusto",
            idade=34,
            email="felipeaugusto@gmail.com",
            ativo=True,
            conta_corrente=self.conta2
        )

