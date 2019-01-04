import { InvCompras } from "./InvCompras";

export class InvComprasMotivoAnulacion {
    anuSecuencial: number = 0;
    anuComentario: string = null;
    invCompras: InvCompras = new InvCompras();

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.anuSecuencial = data.anuSecuencial ? data.anuSecuencial : this.anuSecuencial;
        this.anuComentario = data.anuComentario ? data.anuComentario : this.anuComentario;
        this.invCompras = data.invCompras ? data.invCompras : this.invCompras;
    }

}