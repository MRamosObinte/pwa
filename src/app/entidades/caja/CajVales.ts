import { CajValesPK } from "./CajValesPK";
import { CajValesConceptos } from "./CajValesConceptos";

export class CajVales {

    cajValesPK: CajValesPK = new CajValesPK();
    valeFecha: Date = new Date();
    valeValor: number = 0;
    valeAnulado: boolean = false;
    valeBeneficiario: String = "";
    valeObservaciones: String = "";
    usrEmpresa: String = "";
    usrCodigo: String = "";
    usrFechaInserta: Date = new Date();
    cajValesConceptos: CajValesConceptos = new CajValesConceptos();

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.cajValesPK = data.cajValesPK ? new CajValesPK(data.cajValesPK) : this.cajValesPK;
        this.valeFecha = data.valeFecha ? data.valeFecha : this.valeFecha;
        this.valeValor = data.valeValor ? data.valeValor : this.valeValor;
        this.valeAnulado = data.valeAnulado ? data.valeAnulado : this.valeAnulado;
        this.valeBeneficiario = data.valeBeneficiario ? data.valeBeneficiario : this.valeBeneficiario;
        this.valeObservaciones = data.valeObservaciones ? data.valeObservaciones : this.valeObservaciones;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
        this.cajValesConceptos = data.cajValesConceptos ? new CajValesConceptos(data.cajValesConceptos) : this.cajValesConceptos;
    }

}   