
export class ConFunContablesVerificacionesComprasTO {
    public id: number = null;
    public contabilidadFecha: String = null;
    public contabilidadSecuencial: String = null;
    public inventarioFecha: String = null;
    public inventarioSecuencial: String = null;
    public inventarioMonto: number = null;
    public inventarioObservacion: String = null;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.id = data ? data.id : this.id;
        this.contabilidadFecha = data ? data.contabilidadFecha : this.contabilidadFecha;
        this.contabilidadSecuencial = data ? data.contabilidadSecuencial : this.contabilidadSecuencial;
        this.inventarioFecha = data ? data.inventarioFecha : this.inventarioFecha;
        this.inventarioSecuencial = data ? data.inventarioSecuencial : this.inventarioSecuencial;
        this.inventarioMonto = data ? data.inventarioMonto : this.inventarioMonto;
        this.inventarioObservacion = data ? data.inventarioObservacion : this.inventarioObservacion;
    }
}