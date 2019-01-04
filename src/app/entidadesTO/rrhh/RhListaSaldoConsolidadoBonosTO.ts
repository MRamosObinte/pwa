export class RhListaSaldoConsolidadoBonosTO {
    id: number;
    scbvCategoria: string = "";
    scbvId: string = "";
    scbvNombres: string = "";
    scbvBonos: number = 0;
    scbvViaticos: number = 0;
    scbvTotal: number = 0;
    scbvOrden: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.scbvCategoria = data.dbCategoria ? data.scbvCategoria : this.scbvCategoria;
        this.scbvId = data.scbvId ? data.scbvId : this.scbvId;
        this.scbvNombres = data.scbvNombres ? data.scbvNombres : this.scbvNombres;
        this.scbvBonos = data.scbvBonos ? data.scbvBonos : this.scbvBonos;
        this.scbvViaticos = data.scbvViaticos ? data.scbvViaticos : this.scbvViaticos;
        this.scbvTotal = data.scbvTotal ? data.scbvTotal : this.scbvTotal;
        this.scbvOrden = data.scbvOrden ? data.scbvOrden : this.scbvOrden;
    }
}