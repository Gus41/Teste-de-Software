import { Client } from '../modules/models/Client.js';
import { Account } from '../modules/models/Account.js'
import { ApiManager } from './ApiManager.js';

export class DocumentManager {
    constructor(formID, clientsContainerID) {
        this.apiManager = new ApiManager('http://127.0.0.1:8000/api');
        this.formID = formID;
        this.form = document.getElementById(this.formID);
        if (this.form) {
            this.form.addEventListener('submit', e => {
                e.preventDefault();
                if (this.validateForm()) {
                    this.handlePost();
                }
            });
        }

        this.clientsContainerID = clientsContainerID;
        this.modal = document.getElementById('editModal');
        this.editForm = document.getElementById('edit-form');
        this.cancelBtn = document.getElementById('cancelBtn');
        this.currentClient = null;

        this.deleteClientButton = document.getElementById("deleteBtn")

        if (this.cancelBtn) {
            this.cancelBtn.addEventListener('click', () => this.modal.classList.add('hidden'));
        }
        if (this.editForm) {
            this.editForm.addEventListener('submit', e => this.handleEditSubmit(e));
        }
        if (this.deleteClientButton) {
            this.deleteClientButton.addEventListener("click", () => this.handleDelete())
        }

        this.loadClients();
    }

    handleDelete() {
        if (confirm("Tem certeza que deseja deletar o atual cliente?")) {
            this.apiManager.deleteClient(this.editForm.id.value)
        }
    }

    async deleteClient() {
        if (this.editForm.id.value) {
            await this.apiManager.deleteClient(this.editForm.id.value)
        }
    }

    async loadClients() {
        if (!this.clientsContainerID) return;
        const container = document.getElementById(this.clientsContainerID);
        if (!container) return;

        const clientes = await this.apiManager.getClients();

        container.innerHTML = '';

        if (clientes.length === 0) {
            container.innerHTML = '<p>Nenhum cadastrado ainda</p>';
            return;
        }

        clientes.forEach(cliente => {
            const card = document.createElement('div');
            card.className = 'p-4 bg-white rounded-xl shadow hover:shadow-lg transition cursor-pointer flex flex-col gap-2';

            card.innerHTML = `
                <div class="flex justify-between items-center">
                    <h3 class="text-lg font-semibold text-gray-800">${cliente.nome}</h3>
                    <span class="text-sm ${cliente.ativo ? 'text-green-600' : 'text-red-500'} font-medium">
                        ${cliente.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                </div>
                <p class="text-sm text-gray-500">Idade: ${cliente.idade}</p>
                <p class="text-sm text-gray-500">Email: ${cliente.email}</p>
                ${cliente.conta_corrente ? `
                    <p class="text-sm text-gray-700">Saldo: R$ ${cliente.conta_corrente.saldo}</p>
                    <p class="text-sm ${cliente.conta_corrente.ativa ? 'text-green-600' : 'text-red-500'}">
                        Conta: ${cliente.conta_corrente.ativa ? 'Ativa' : 'Inativa'}
                    </p>
                ` : '<p class="text-sm text-gray-400">Sem conta corrente</p>'}
            `;

            card.addEventListener('click', () => this.openModal(cliente));
            container.appendChild(card);
        });

    }
    openModal(cliente) {
        this.currentClient = cliente;

        this.editForm.nome.value = cliente.nome;
        this.editForm.idade.value = cliente.idade;
        this.editForm.email.value = cliente.email;
        this.editForm.ativo.checked = cliente.ativo;


        if (cliente.conta_corrente) {
            this.editForm.saldo.value = cliente.conta_corrente.saldo;
            this.editForm.ativa.checked = cliente.conta_corrente.ativa;
        } else {
            this.editForm.saldo.value = 0;
            this.editForm.ativa.checked = true;
        }

        this.editForm.id.value = cliente.id;

        this.modal.classList.remove('hidden');
    }



    handleEditSubmit(e) {
        e.preventDefault();
        if (!this.currentClient) return;
        this.currentClient.nome = this.editForm.nome.value;
        this.currentClient.idade = parseInt(this.editForm.idade.value, 10);
        this.currentClient.email = this.editForm.email.value;
        this.currentClient.ativo = this.editForm.ativo.checked;
        this.currentClient.id = this.editForm.id.value;
        const conta_corrente = new Account(
            null,
            this.editForm.saldo.value,
            this.editForm.ativa.checked
        )


        const client = new Client(
            this.currentClient.id,
            this.currentClient.nome,
            this.currentClient.idade,
            this.currentClient.email,
            this.currentClient.ativo,
            conta_corrente
        )
        this.apiManager.updateClient(client.id, client);
        this.modal.classList.add('hidden');
        this.loadClients();
    }

    validateForm() {
        const nome = this.form.nome.value.trim();
        const idade = parseInt(this.form.idade.value, 10);
        const email = this.form.email.value.trim();
        const saldo = parseFloat(this.form.saldo.value);

        if (!nome) {
            alert('O campo nome é obrigatório.');
            return false;
        }

        if (isNaN(idade) || idade < 18) {
            alert('A idade deve ser um número válido e maior ou igual a 18.');
            return false;
        }

        if (!this.isValidEmail(email)) {
            alert('Digite um e-mail válido.');
            return false;
        }

        if (isNaN(saldo) || saldo < 0) {
            alert('O saldo deve ser um número válido e não pode ser negativo.');
            return false;
        }

        return true;
    }

    isValidEmail(email) {
        return /\S+@\S+\.\S+/.test(email);
    }

    handlePost() {
        const conta_corrente = {
            saldo: parseFloat(this.form.saldo.value),
            ativa: this.form.ativa.checked
        };

        const cliente = new Client(
            null,
            this.form.nome.value.trim(),
            parseInt(this.form.idade.value, 10),
            this.form.email.value.trim(),
            this.form.ativo.checked,
            conta_corrente
        );

        console.log('Cliente pronto para envio:', cliente);
        this.post(cliente);
    }

    post(cliente) {
        this.apiManager.createClient(cliente);
    }
}
