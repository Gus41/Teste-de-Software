export class Account {
    constructor(id=null, saldo, ativa) {
        this.id = id;
        this.saldo = saldo;
        this.ativa = ativa;
    }

    getInfo() {
        return `Account ID: ${this.id}, Balance: ${this.saldo}, Active: ${this.ativa ? "Yes" : "No"}`;
    }
}
