import { Account } from '../models/Account.js'

export class Client {
    constructor(id,name, age, email, active, conta_corrente) {
        this.id = id
        this.nome = name;
        this.idade = age;
        this.email = email;
        this.ativo = active;
        this.conta_corrente = conta_corrente
        ? new Account(
            conta_corrente.id,
            conta_corrente.saldo,
            conta_corrente.ativa
          )
        : null;
    }

    setId(id){
        this.id = id
    }
    getInfo() {
        return `
            Client ID: ${this.id}
            Name: ${this.nome}
            Age: ${this.idade}
            Email: ${this.email}
            Active: ${this.ativo ? "Yes" : "No"}
            ${this.conta_corrente ? this.conta_corrente.getInfo() : "No Account"}
        `;
    }

    toggleActive() {
        this.active = !this.active;
    }

    updateData({ name, age, email }) {
        if (name) this.name = name;
        if (age) this.age = age;
        if (email) this.email = email;
    }
}
