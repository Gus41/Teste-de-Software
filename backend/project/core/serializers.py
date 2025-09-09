from rest_framework import serializers
from .models import Cliente, ContaCorrente


class ContaCorrenteSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContaCorrente
        fields = ['id', 'saldo', 'ativa']


class ClienteSerializer(serializers.ModelSerializer):
    conta_corrente = ContaCorrenteSerializer()

    class Meta:
        model = Cliente
        fields = ['id', 'nome', 'idade', 'email', 'ativo', 'conta_corrente']

    def create(self, validated_data):
        conta_corrente_data = validated_data.pop('conta_corrente')
        conta_corrente = ContaCorrente.objects.create(**conta_corrente_data)
        cliente = Cliente.objects.create(conta_corrente=conta_corrente, **validated_data)
        return cliente

    def update(self, instance, validated_data):
        conta_corrente_data = validated_data.pop('conta_corrente', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if conta_corrente_data:
            conta_corrente = instance.conta_corrente
            for attr, value in conta_corrente_data.items():
                setattr(conta_corrente, attr, value)
            conta_corrente.save()

        return instance
