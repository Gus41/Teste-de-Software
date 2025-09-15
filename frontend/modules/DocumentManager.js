import { Client } from '../modules/models/Client.js'
import { ApiManager } from './ApiManager.js';

export class DocumentManager {
    constructor(formID, clientsContainerID) {

        this.apiManager = new ApiManager('http://127.0.0.1:8000/api')

        this.formID = formID;
        this.form = document.getElementById(this.formID);
        this.form.addEventListener('submit', e => {
            e.preventDefault();
            if (this.validateForm()) {
                this.handlePost();
            }
        });

        this.clientsContainerID = clientsContainerID
        this.loadClients()

    }

    async loadClients() {
        if (this.clientsContainerID) {
            const container = document.getElementById(this.clientsContainerID)
            if(container){
                const clientes = await this.apiManager.getClients()

                if(clientes.length == 0){
                    container.innerHTML = "<p>Nenhum cadastrado ainda</p>"
                    return
                }

                container.innerHTML = ""

                for(let i = 0 ; i < clientes.length ; i ++){
                    const node = document.createElement("p")
                    node.innerText = clientes[i].nome
                    container.appendChild(node)
                }
            }
        }
    }

    validateForm() {
        const nome = this.form.nome.value.trim();
        const idade = parseInt(this.form.idade.value, 10);
        const email = this.form.email.value.trim();
        const saldo = parseFloat(this.form.saldo.value);

        if (!nome) {
            alert("O campo nome é obrigatório.");
            return false;
        }

        if (isNaN(idade) || idade < 18) {
            alert("A idade deve ser um número válido e maior ou igual a 18.");
            return false;
        }

        if (!this.isValidEmail(email)) {
            alert("Digite um e-mail válido.");
            return false;
        }

        if (isNaN(saldo) || saldo < 0) {
            alert("O saldo deve ser um número válido e não pode ser negativo.");
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
            this.form.nome.value.trim(),
            parseInt(this.form.idade.value, 10),
            this.form.email.value.trim(),
            this.form.ativo.checked,
            conta_corrente
        );

        console.log("Cliente pronto para envio:", cliente);
        this.post(cliente);
    }


    post(cliente) {
        this.apiManager.createClient(cliente)
    }
}

