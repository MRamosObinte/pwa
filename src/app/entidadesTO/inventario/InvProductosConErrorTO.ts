export class InvProductosConErrorTO {
    id: number = null;
    errBodega: string = "";
    errProductoCodigo: string = "";
    errProductoNombre: string = "";
    errCantidad: number = null;
    errDesde: string = "";
    errHasta: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.id = data.id ? data.id : this.id;
        this.errBodega = data.errBodega ? data.errBodega : this.errBodega;
        this.errProductoCodigo = data.errProductoCodigo ? data.errProductoCodigo : this.errProductoCodigo;
        this.errProductoNombre = data.errProductoNombre ? data.errProductoNombre : this.errProductoNombre;
        this.errCantidad = data.errCantidad ? data.errCantidad : this.errCantidad;
        this.errDesde = data.errDesde ? data.errDesde : this.errDesde;
        this.errHasta = data.errHasta ? data.errHasta : this.errHasta;
    }

}