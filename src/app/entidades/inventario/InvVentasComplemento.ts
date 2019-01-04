import { InvVentasComplementoPK } from "./InvVentasComplementoPK";
import { InvVentas } from "./InvVentas";

export class InvVentasComplemento {

    invVentasComplementoPK: InvVentasComplementoPK = new InvVentasComplementoPK();
    comDocumentoTipo: String = null;
    comDocumentoNumero: String = null;
    invVentas: InvVentas = new InvVentas();

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.invVentasComplementoPK = data.invVentasComplementoPK ? data.invVentasComplementoPK : this.invVentasComplementoPK;
        this.comDocumentoTipo = data.comDocumentoTipo ? data.comDocumentoTipo : this.comDocumentoTipo;
        this.comDocumentoNumero = data.comDocumentoNumero ? data.comDocumentoNumero : this.comDocumentoNumero;
        this.invVentas = data.invVentas ? data.invVentas : this.invVentas;
    }
}