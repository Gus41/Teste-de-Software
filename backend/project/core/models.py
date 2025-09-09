from django.db import models

class ContaCorrente(models.Model):
    saldo = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    ativa = models.BooleanField(default=True)

    def __str__(self):
        status = "Ativa" if self.ativa else "Inativa"
        return (
            f"=========================\n"
            f"Id: {self.id}\n"
            f"Saldo: {self.saldo}\n"
            f"Status: {status}\n"
            f"========================="
        )


class Cliente(models.Model):
    nome = models.CharField(max_length=255)
    idade = models.PositiveIntegerField()
    email = models.EmailField(unique=True)
    ativo = models.BooleanField(default=True)
    conta_corrente = models.OneToOneField(
        'ContaCorrente',
        on_delete=models.CASCADE,
        related_name='cliente'
    )

    def __str__(self):
        status = "Ativo" if self.ativo else "Inativo"
        return (
            f"=========================\n"
            f"Id: {self.id}\n"
            f"Nome: {self.nome}\n"
            f"Email: {self.email}\n"
            f"Idade: {self.idade}\n"
            f"Status: {status}\n"
            f"========================="
        )
