import { CajValesConceptosPK } from "./CajValesConceptosPK";
import { CajVales } from "./CajVales";

export class CajValesConceptos {

    cajValesConceptosPK: CajValesConceptosPK = new CajValesConceptosPK();
    concDetalle: String = "";
    concInactivo: boolean = false;
    usrEmpresa: String = "";
    usrCodigo: String = "";
    cajValesList: Array<CajVales> = [];

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.cajValesConceptosPK = data.CajValesConceptosPK ? new CajValesConceptosPK(data.CajValesConceptosPK) : this.cajValesConceptosPK;
        this.concDetalle = data.concDetalle ? data.concDetalle : this.concDetalle;
        this.concInactivo = data.concInactivo ? data.concInactivo : this.concInactivo;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.cajValesList = data.cajValesList ? data.cajValesList : this.cajValesList;
    }

}