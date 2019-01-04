import { InvConsumos } from "./InvConsumos";

export class InvConsumosMotivoAnulacion {
    anuSecuencial: Number = 0;
    anuComentario: String = null;
    invConsumos: InvConsumos = new InvConsumos();

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.anuSecuencial = data.anuSecuencial ? data.anuSecuencial : this.anuSecuencial;
        this.anuComentario = data.anuComentario ? data.anuComentario : this.anuComentario;
        this.invConsumos = data.invConsumos ? data.invConsumos : this.invConsumos;
    }

}