export class InvVentaMotivoComboTO {

    vmCodigo : string = "";
	vmDetalle : string = "";
	vmTipo : string = "";
	vmFormaContabilizar : string = "";
    vmFormaImprimir : string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.vmCodigo = data.vmCodigo ? data.vmCodigo : this.vmCodigo;
        this.vmDetalle = data.vmDetalle ? data.vmDetalle : this.vmDetalle;
        this.vmTipo = data.vmTipo ? data.vmTipo : this.vmTipo;
        this.vmFormaContabilizar = data.vmFormaContabilizar ? data.vmFormaContabilizar : this.vmFormaContabilizar;
        this.vmFormaImprimir = data.vmFormaImprimir ? data.vmFormaImprimir : this.vmFormaImprimir;
    }
    
}