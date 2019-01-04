
export class MultiplePiscinaCorrida {

    sector: string = "";
    piscina: string = "";
    corrida: string = "";
    desde: string = "";
    hasta: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.sector = data.sector ? data.sector : this.sector;
        this.piscina = data.piscina ? data.piscina : this.piscina;
        this.corrida = data.corrida ? data.corrida : this.corrida;
        this.desde = data.desde ? data.desde : this.desde;
        this.hasta = data.hasta ? data.hasta : this.hasta;
    }
}