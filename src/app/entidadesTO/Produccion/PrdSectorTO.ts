
export class PrdSectorTO {
    secEmpresa: string = "";
    secCodigo: string = "";
    secNombre: string = "";
    secLatitud: string = "";
    secLongitud: string = "";
    secActivo: boolean = true;
    usrEmpresa: string = "";
    usrCodigo: string = "";
    usrFechaInsertaSector: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.secEmpresa = data.secEmpresa ? data.secEmpresa : this.secEmpresa;
        this.secCodigo = data.secCodigo ? data.secCodigo : this.secCodigo;
        this.secNombre = data.secNombre ? data.secNombre : this.secNombre;
        this.secLatitud = data.secLatitud ? data.secLatitud : this.secLatitud;
        this.secLongitud = data.secLongitud ? data.secLongitud : this.secLongitud;
        this.secActivo = data.secActivo == true || data.secActivo == true ? data.secActivo : this.secActivo;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInsertaSector = data.usrFechaInsertaSector ? data.usrFechaInsertaSector : this.usrFechaInsertaSector;
    }
}