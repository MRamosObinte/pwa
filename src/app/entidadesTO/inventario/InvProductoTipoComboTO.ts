export class InvProductoTipoComboTO {

    tipCodigo: string = "";
    tipDetalle: string = "";
    tipTipo: string = "";
    tipActivo: boolean = false;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.tipCodigo = data.tipCodigo ? data.tipCodigo : this.tipCodigo;
        this.tipDetalle = data.tipDetalle ? data.tipDetalle : this.tipDetalle;
        this.tipTipo = data.tipTipo ? data.tipTipo : this.tipTipo;
        this.tipActivo = data.tipActivo ? data.tipActivo : this.tipActivo;
    }

}