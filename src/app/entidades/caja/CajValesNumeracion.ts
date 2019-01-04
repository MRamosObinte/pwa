import { CajValesNumeracionPK } from "./CajValesNumeracionPK";

export class CajValesNumeracion {

    cajValesNumeracionPK: CajValesNumeracionPK = new CajValesNumeracionPK();
    numSecuencia: String = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.cajValesNumeracionPK = data.cajValesNumeracionPK ? new CajValesNumeracionPK(data.cajValesNumeracionPK) : this.cajValesNumeracionPK;
        this.numSecuencia = data.numSecuencia ? data.numSecuencia : this.numSecuencia;
    }

}