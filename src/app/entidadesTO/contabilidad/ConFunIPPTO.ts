export class ConFunIPPTO {
    id: number;
    costoEmpresa: string;
    costoSector: string;
    costoPiscina: string;
    costoTotal: number;
    costoCuentaOrigen: string;
    costoCuentaDestino: string;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.id = data.id ? data.id : this.id;
        this.costoEmpresa = data.costoEmpresa ? data.costoEmpresa : this.costoEmpresa;
        this.costoSector = data.costoSector ? data.costoSector : this.costoSector;
        this.costoPiscina = data.costoPiscina ? data.costoPiscina : this.costoPiscina;
        this.costoTotal = data.costoTotal ? data.costoTotal : this.costoTotal;
        this.costoCuentaOrigen = data.costoCuentaOrigen ? data.costoCuentaOrigen : this.costoCuentaOrigen;
        this.costoCuentaDestino = data.costoCuentaDestino ? data.costoCuentaDestino : this.costoCuentaDestino;
    }
}