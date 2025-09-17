from decimal import Decimal
from django.urls import reverse
from django.core.exceptions import ValidationError
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

    # -------------------
    # FLUXO DE DADOS
    # -------------------
    def test_criacao_cliente_fluxo_dados(self):
        url = reverse("clientes-list-create")
        conta = ContaCorrente.objects.create(saldo=200.00, ativa=True)
        data = {
            "nome": "João Souza",
            "idade": 28,
            "email": "joaosouza@gmail.com",
            "ativo": True,
            "conta_corrente": {
                "saldo": conta.saldo,
                "ativa": conta.ativa
            },
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Cliente.objects.filter(email="joaosouza@gmail.com").exists())

    # -------------------
    # FLUXO DE CONTROLE
    # -------------------
    def test_email_unico(self):
        url = reverse("clientes-list-create")
        conta = self.conta2
        data = {
            "nome": "Duplicado",
            "idade": 25,
            "email": "mariasilva@gmail.com",  # já existe
            "ativo": True,
            "conta_corrente": {
                "saldo": conta.saldo,
                "ativa": conta.ativa
            },
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.data)

    # -------------------
    # TRANSIÇÃO DE ESTADOS
    # -------------------
    def test_transicao_estado_cliente(self):
        url = reverse("clientes-detail", args=[self.cliente1.id])
        response = self.client.patch(url, {"ativo": False}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.cliente1.refresh_from_db()
        self.assertFalse(self.cliente1.ativo)

    def test_transicao_estado_conta(self):
        url = reverse("contas-detail", args=[self.conta1.id])
        response = self.client.patch(url, {"ativa": False}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.conta1.refresh_from_db()
        self.assertFalse(self.conta1.ativa)

    # -------------------
    # ANÁLISE DO VALOR LIMITE
    # -------------------
    def test_idade_valor_minimo(self):
        url = reverse("clientes-list-create")
        conta = ContaCorrente.objects.create()
        data = {
            "nome": "Bebê",
            "idade": 0,
            "email": "bebe@example.com",
            "conta_corrente": {
                "saldo": conta.saldo,
                "ativa": conta.ativa
            },
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_idade_valor_maximo_razoavel(self):
        url = reverse("clientes-list-create")
        conta = ContaCorrente.objects.create()
        data = {
            "nome": "Ancião",
            "idade": 151,
            "email": "anciao@example.com",
            "conta_corrente": {
                "saldo": conta.saldo,
                "ativa": conta.ativa
            },
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        

    def test_idade_valor_invalido(self):
        url = reverse("clientes-list-create")
        conta = ContaCorrente.objects.create()
        data = {
            "nome": "Idade inválida",
            "idade": 200,
            "email": "idadeinvalida@example.com",
            "conta_corrente": {
                "saldo": conta.saldo,
                "ativa": conta.ativa
            },
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_saldo_limites(self):
        conta = ContaCorrente.objects.create(saldo="0.00", ativa=True)
        conta.refresh_from_db()
        self.assertEqual(str(conta.saldo), "0.00")

        conta.saldo = "9999999999.99"  # max_digits=12
        conta.save()
        conta.refresh_from_db()
        self.assertEqual(str(conta.saldo), "9999999999.99")
        
        
    def test_saldo_acima_do_limite_invalido(self):
        conta = ContaCorrente(saldo=Decimal("10000000000.00"))  
        with self.assertRaises(ValidationError):
            conta.full_clean()   


    # -------------------
    # TESTE DE MATRIZ (decision table)
    # -------------------
    def test_matriz_cliente_conta(self):
        url = reverse("clientes-list-create")

        casos = [
            (True, True, status.HTTP_201_CREATED),   # cliente ativo + conta ativa
            (True, False, status.HTTP_201_CREATED),  # cliente ativo + conta inativa
            (False, True, status.HTTP_201_CREATED),  # cliente inativo + conta ativa
            (False, False, status.HTTP_201_CREATED), # ambos inativos
        ]

        for ativo, ativa, esperado in casos:
            conta = ContaCorrente.objects.create(ativa=ativa)
            data = {
                "nome": f"Teste {ativo}-{ativa}",
                "idade": 40,
                "email": f"teste{ativo}{ativa}@example.com",
                "ativo": ativo,
                "conta_corrente": {
                    "saldo": conta.saldo,
                    "ativa": conta.ativa
                },
            }
            response = self.client.post(url, data, format="json")
            self.assertEqual(response.status_code, esperado)
