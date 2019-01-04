export class InvTransferenciaMotivoComboTO {
    public tmCodigo: string = null;
    public tmDetalle: string = null;
    public usrEmpresa: string = null;
    public usrCodigo: string = null;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.tmCodigo = data.tmCodigo ? data.tmCodigo : this.tmCodigo;
        this.tmDetalle = data.tmDetalle ? data.tmDetalle : this.tmDetalle;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
    }
}