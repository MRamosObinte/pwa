export class RhListaSaldoConsolidadoAnticiposPrestamosTO {
    id: number = null;
    scapCategoria: string = null;
    scapId: string = null;
    scapNombres: string = null;
    scapAnticipos: number = 0;
    scapPrestamos: number = 0;
    scapTotal: number = 0;
    scapOrden: string = null;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.id = data.id ? data.id : this.id;
        this.scapCategoria = data.scapCategoria ? data.scapCategoria : this.scapCategoria;
        this.scapId = data.scapId ? data.scapId : this.scapId;
        this.scapNombres = data.scapNombres ? data.scapNombres : this.scapNombres;
        this.scapAnticipos = data.scapAnticipos ? data.scapAnticipos : this.scapAnticipos;
        this.scapPrestamos = data.scapPrestamos ? data.scapPrestamos : this.scapPrestamos;
        this.scapTotal = data.scapTotal ? data.scapTotal : this.scapTotal;
        this.scapOrden = data.scapOrden ? data.scapOrden : this.scapOrden;
    }
}