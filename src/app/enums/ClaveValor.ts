export class ClaveValor {
    clave: string = null;
    valor: string = null;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.clave = data.clave ? data.clave : this.clave;
        this.valor = data.valor ? data.valor : this.valor;
    }

}