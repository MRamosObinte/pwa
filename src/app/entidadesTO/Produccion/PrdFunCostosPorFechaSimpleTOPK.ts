    
export class PrdFunCostosPorFechaSimpleTOPK {

    costo_sector: string = "";
    costo_piscina: string = "";
    costo_corrida: string = "";
    costo_total: number = 0;
    desde: string = "";
    hasta: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.costo_sector = data.costo_sector ? data.costo_sector : this.costo_sector;
        this.costo_piscina = data.costo_piscina ? data.costo_piscina : this.costo_piscina;
        this.costo_corrida = data.costo_corrida ? data.costo_corrida : this.costo_corrida;
        this.costo_total = data.costo_total ? data.costo_total : this.costo_total;
        this.desde = data.desde ? data.desde : this.desde;
        this.hasta = data.hasta ? data.hasta : this.hasta;
    }
}