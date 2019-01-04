export class RhListaConsolidadoBonosTO {
    id: number;
    cbvCategoria: string = "";
    cbvId: string = "";
    cbvNombres: string = "";
    cbvHorasExtras: number = 0;
    cbvHorasExtras100: number = 0;
    cbvBonos: number = 0;
    cbvBonosND: number = 0;
    cbvBonoFijo: number = 0;
    cbvBonoFijoND: number = 0;
    cbvTotal: number = 0;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.id = data.id ? data.id : this.id;
        this.cbvCategoria = data.cbvCategoria ? data.cbvCategoria : this.cbvCategoria;
        this.cbvId = data.cbvId ? data.cbvId : this.cbvId;
        this.cbvNombres = data.cbvNombres ? data.cbvNombres : this.cbvNombres;
        this.cbvHorasExtras = data.cbvHorasExtras ? data.cbvHorasExtras : this.cbvHorasExtras;
        this.cbvHorasExtras100 = data.cbvHorasExtras100 ? data.cbvHorasExtras100 : this.cbvHorasExtras100;
        this.cbvBonos = data.cbvBonos ? data.cbvBonos : this.cbvBonos;
        this.cbvBonosND = data.cbvBonosND ? data.cbvBonosND : this.cbvBonosND;
        this.cbvBonoFijo = data.cbvBonoFijo ? data.cbvBonoFijo : this.cbvBonoFijo;
        this.cbvBonoFijoND = data.cbvBonoFijoND ? data.cbvBonoFijoND : this.cbvBonoFijoND;
        this.cbvTotal = data.cbvTotal ? data.cbvTotal : this.cbvTotal;
    }
}