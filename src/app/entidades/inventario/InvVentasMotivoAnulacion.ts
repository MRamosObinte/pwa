import { InvVentas } from "./InvVentas";

export class InvVentasMotivoAnulacion {

    anuSecuencial: number = 0;
    anuComentario: string = null;
    invVentas: InvVentas = new InvVentas();

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }
    hydrate(data) {
        this.anuSecuencial = data.anuSecuencial ? data.anuSecuencial : this.anuSecuencial;
        this.anuComentario = data.anuComentario ? data.anuComentario : this.anuComentario;
        this.invVentas = data.invVentas ? data.invVentas : this.invVentas;
    }
}