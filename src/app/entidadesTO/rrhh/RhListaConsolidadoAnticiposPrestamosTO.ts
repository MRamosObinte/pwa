export class RhListaConsolidadoAnticiposPrestamosTO {
    id: number;
    capCategoria: string = "";
    capId: string = "";
    capNombres: string = "";
    capAnticipos: number = 0;
    capPrestamos: number = 0;
    capTotal: number = 0;
    capOrden: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.capCategoria = data.capCategoria ? data.capCategoria : this.capCategoria;
        this.capId = data.capId ? data.capId : this.capId;
        this.capNombres = data.capNombres ? data.capNombres : this.capNombres;
        this.capAnticipos = data.capAnticipos ? data.capAnticipos : this.capAnticipos;
        this.capPrestamos = data.capPrestamos ? data.capPrestamos : this.capPrestamos;
        this.capTotal = data.capTotal ? data.capTotal : this.capTotal;
        this.capOrden = data.capOrden ? data.capOrden : this.capOrden;
    }
}