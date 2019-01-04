export class RhUtilidadesPeriodoTO {
    utiDescripcion: string = "";
    utiEmpresa: string = null;
    utiDesde: string = null;
    utiHasta: string = null;
    utiFechaMaximaPago: string = null;
    utiTotalDias: number = 0;
    utiTotalCargas: number = 0;
    utiTotalPagar: number = 0;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.utiDescripcion = data.utiDescripcion ? data.utiDescripcion : this.utiDescripcion;
        this.utiEmpresa = data.utiEmpresa ? data.utiEmpresa : this.utiEmpresa;
        this.utiDesde = data.utiDesde ? data.utiDesde : this.utiDesde;
        this.utiHasta = data.utiHasta ? data.utiHasta : this.utiHasta;
        this.utiFechaMaximaPago = data.utiFechaMaximaPago ? data.utiFechaMaximaPago : this.utiFechaMaximaPago;
        this.utiTotalDias = data.utiTotalDias ? data.utiTotalDias : this.utiTotalDias;
        this.utiTotalCargas = data.utiTotalCargas ? data.utiTotalCargas : this.utiTotalCargas;
        this.utiTotalPagar = data.utiTotalPagar ? data.utiTotalPagar : this.utiTotalPagar;
    }
}