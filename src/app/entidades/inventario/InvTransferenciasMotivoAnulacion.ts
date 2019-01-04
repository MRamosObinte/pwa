import { InvTransferencias } from "./InvTransferencias";

export class InvTransferenciasMotivoAnulacion {

    anuSecuencial: Number = 0;
    anuComentario: String = null;
    invTransferencias: InvTransferencias = new InvTransferencias();


    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.anuSecuencial = data.anuSecuencial ? data.anuSecuencial : this.anuSecuencial;
        this.anuComentario = data.anuComentario ? data.anuComentario : this.anuComentario;
        this.invTransferencias = data.invTransferencias ? data.invTransferencias : this.invTransferencias;
    }
}