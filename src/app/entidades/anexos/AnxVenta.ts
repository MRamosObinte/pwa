import { AnxVentaPK } from "./AnxVentaPK";

export class AnxVenta {

    anxVentaPK: AnxVentaPK = new AnxVentaPK();
    venRetencionnumero: String = "";
    venRetencionautorizacion: String = "";
    venRetencionfechaemision: Date = new Date();
    venBase0: Number = 0;
    venBaseimponible: Number = 0;
    venBasenoobjetoiva: Number = 0;
    venMontoiva: Number = 0;
    venValorretenidoiva: Number = 0;
    venValorretenidorenta: Number = 0;
    conEmpresa: String = "";
    conPeriodo: String = "";
    conTipo: String = "";
    conNumero: String = "";
    usrEmpresa: String = "";
    usrCodigo: String = "";
    usrFechaInserta: Date = new Date();

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.anxVentaPK = data.anxVentaPK ? data.anxVentaPK : this.anxVentaPK;
        this.venRetencionnumero = data.venRetencionnumero ? data.venRetencionnumero : this.venRetencionnumero;
        this.venRetencionautorizacion = data.venRetencionautorizacion ? data.venRetencionautorizacion : this.venRetencionautorizacion;
        this.venRetencionfechaemision = data.venRetencionfechaemision ? data.venRetencionfechaemision : this.venRetencionfechaemision;
        this.venBase0 = data.venBase0 ? data.venBase0 : this.venBase0;
        this.venBaseimponible = data.venBaseimponible ? data.venBaseimponible : this.venBaseimponible;
        this.venBasenoobjetoiva = data.venBasenoobjetoiva ? data.venBasenoobjetoiva : this.venBasenoobjetoiva;
        this.venMontoiva = data.venMontoiva ? data.venMontoiva : this.venMontoiva;
        this.venValorretenidoiva = data.venValorretenidoiva ? data.venValorretenidoiva : this.venValorretenidoiva;
        this.venValorretenidorenta = data.venValorretenidorenta ? data.venValorretenidorenta : this.venValorretenidorenta;
        this.conEmpresa = data.conEmpresa ? data.conEmpresa : this.conEmpresa;
        this.conPeriodo = data.conPeriodo ? data.conPeriodo : this.conPeriodo;
        this.conTipo = data.conTipo ? data.conTipo : this.conTipo;
        this.conNumero = data.conNumero ? data.conNumero : this.conNumero;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
    }
}