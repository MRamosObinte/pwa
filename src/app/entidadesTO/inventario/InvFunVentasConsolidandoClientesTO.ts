export class InvFunVentasConsolidandoClientesTO {
    id: number = null;
    vtaIdentificacion: string = null;
    vtaNombreCliente: string = null;
    vtaNumeroComprobantes: number = null;
    vtaBase0: number = null;
    vtaBaseimponible: number = null;
    vtaMontoiva: number = null;
    vtaTotal: number = null;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.id = data.id ? data.id : this.id;
        this.vtaIdentificacion = data.vtaIdentificacion ? data.vtaIdentificacion : this.vtaIdentificacion;
        this.vtaNombreCliente = data.vtaNombreCliente ? data.vtaNombreCliente : this.vtaNombreCliente;
        this.vtaNumeroComprobantes = data.vtaNumeroComprobantes ? data.vtaNumeroComprobantes : this.vtaNumeroComprobantes;
        this.vtaBase0 = data.vtaBase0 ? data.vtaBase0 : this.vtaBase0;
        this.vtaBaseimponible = data.vtaBaseimponible ? data.vtaBaseimponible : this.vtaBaseimponible;
        this.vtaMontoiva = data.vtaMontoiva ? data.vtaMontoiva : this.vtaMontoiva;
        this.vtaTotal = data.vtaTotal ? data.vtaTotal : this.vtaTotal;
    }

}