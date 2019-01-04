import { InvComprasMotivoPK } from "./InvComprasMotivoPK";

export class InvComprasMotivo {

    invComprasMotivoPK: InvComprasMotivoPK = new InvComprasMotivoPK();
    cmDetalle: string = null;
    cmFormaContabilizar: string = null;
    cmFormaImprimir: string = null;
    cmAjustesDeInventario: boolean = null;
    cmInactivo: boolean = null;
    tipEmpresa: string = null;
    tipCodigo: string = null;
    usrEmpresa: string = null;
    usrCodigo: string = null;
    usrFechaInserta: Date = null;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.invComprasMotivoPK = data.invComprasMotivoPK ? data.invComprasMotivoPK : this.invComprasMotivoPK;
        this.cmDetalle = data.cmDetalle ? data.cmDetalle : this.cmDetalle;
        this.cmFormaContabilizar = data.cmFormaContabilizar ? data.cmFormaContabilizar : this.cmFormaContabilizar;
        this.cmFormaContabilizar = data.cmFormaContabilizar ? data.cmFormaContabilizar : this.cmFormaContabilizar;
        this.cmFormaImprimir = data.cmFormaImprimir ? data.cmFormaImprimir : this.cmFormaImprimir;
        this.cmAjustesDeInventario = data.cmAjustesDeInventario ? data.cmAjustesDeInventario : this.cmAjustesDeInventario;
        this.cmInactivo = data.cmInactivo ? data.cmInactivo : this.cmInactivo;
        this.tipEmpresa = data.tipEmpresa ? data.tipEmpresa : this.tipEmpresa;
        this.tipCodigo = data.tipCodigo ? data.tipCodigo : this.tipCodigo;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
    }

}