import { AfActivos } from "./AfActivos";

export class AfDepreciaciones {

    depSecuencial: number = 0;
    depDesde: Date = new Date();
    depHasta: Date = new Date();
    depValor: Date = new Date();
    afFechaAdquisicion: Date = new Date();
    afValorAdquision: number = 0;
    afValorResidual: number = 0;
    conEmpresa: string = "";
    conPeriodo: string = "";
    conTipo: string = "";
    conNumero: string = "";
    secEmpresa: string = "";
    secCodigo: string = "";
    usrEmpresa: string = "";
    usrCodigo: string = "";
    usrFechaInserta: Date = new Date();
    afActivos: AfActivos = new AfActivos();

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.depSecuencial = data.depSecuencial ? data.depSecuencial : this.depSecuencial;
        this.depDesde = data.depDesde ? data.depDesde : this.depDesde;
        this.depHasta = data.depHasta ? data.depHasta : this.depHasta;
        this.depValor = data.depValor ? data.depValor : this.depValor;
        this.afFechaAdquisicion = data.afFechaAdquisicion ? data.afFechaAdquisicion : this.afFechaAdquisicion;
        this.afValorAdquision = data.afValorAdquision ? data.afValorAdquision : this.afValorAdquision;
        this.afValorResidual = data.afValorResidual ? data.afValorResidual : this.afValorResidual;
        this.conEmpresa = data.conEmpresa ? data.conEmpresa : this.conEmpresa;
        this.conPeriodo = data.conPeriodo ? data.conPeriodo : this.conPeriodo;
        this.conTipo = data.conTipo ? data.conTipo : this.conTipo;
        this.conNumero = data.conNumero ? data.conNumero : this.conNumero;
        this.secEmpresa = data.secEmpresa ? data.secEmpresa : this.secEmpresa;
        this.secCodigo = data.secCodigo ? data.secCodigo : this.secCodigo;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
        this.afActivos = data.afActivos ? new AfActivos(data.afActivos) : this.afActivos;

    }

}