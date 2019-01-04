export class RhListaSaldoConsolidadoSueldosPorPagarTO {
    id: number = 0;
    scspCategoria: string = "";
    scspId: string = "";
    scspNombres: string = "";
    scspValor: number = 0;
    scspOrden: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.id = data.id ? data.id : this.id;
        this.scspCategoria = data.scspCategoria ? data.scspCategoria : this.scspCategoria;
        this.scspId = data.scspId ? data.scspId : this.scspId;
        this.scspNombres = data.scspNombres ? data.scspNombres : this.scspNombres;
        this.scspValor = data.scspValor ? data.scspValor : this.scspValor;
        this.scspOrden = data.scspOrden ? data.scspOrden : this.scspOrden;
    }
}