import { Account } from 'models/Account'

class Client {
    constructor(name, age, email, active, conta_corrente) {
        this.name = name;
        this.age = age;
        this.email = email;
        this.active = active;
        this.conta_corrente = conta_corrente
        ? new Account(
            conta_corrente.id,
            conta_corrente.saldo,
            conta_corrente.ativa
          )
        : null;
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
