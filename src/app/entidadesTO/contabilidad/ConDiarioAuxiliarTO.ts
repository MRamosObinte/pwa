export class ConDiarioAuxiliarTO {
    public id: number = null;
    public daBloque: String = null;
    public daOrden: number = null;
    public daCuenta: String = null;
    public daDetalle: String = null;
    public daCP: String = null;
    public daCC: String = null;
    public daDocumento: String = null;
    public daDebe: String = null;
    public daHaber: String = null;
    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.id = data ? data.id : this.id;
        this.daBloque = data ? data.daBloque : this.daBloque;
        this.daOrden = data ? data.daOrden : this.daOrden;
        this.daCuenta = data ? data.daCuenta : this.daCuenta;
        this.daDetalle = data ? data.daDetalle : this.daDetalle;
        this.daCP = data ? data.daCP : this.daCP;
        this.daCC = data ? data.daCC : this.daCC;
        this.daDocumento = data ? data.daDocumento : this.daDocumento;
        this.daDebe = data ? data.daDebe : this.daDebe;
        this.daHaber = data ? data.daHaber : this.daHaber;
    }
}