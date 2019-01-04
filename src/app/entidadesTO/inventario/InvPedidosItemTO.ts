export class InvPedidosItemTO {
    pedItemCodigo: String = null;
    pedItemEmpresa: String = null;
    pedItemDescripcion: String = null;
    pedItemPrecio: number = 0;
    pedItemInactivo: boolean = false;
    pedItemProductoCodigo: String = null;
    pedItemProductoDescripcion: String = null;
    pedItemMedidaCodigo: String = null;
    pedItemMedidaDescripcion: String = null;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }
    
    hydrate(data) {
        this.pedItemCodigo = data ? data.pedItemCodigo : this.pedItemCodigo;
        this.pedItemEmpresa = data ? data.pedItemEmpresa : this.pedItemEmpresa;
        this.pedItemDescripcion = data ? data.pedItemDescripcion : this.pedItemDescripcion;
        this.pedItemPrecio = data ? data.pedItemPrecio : this.pedItemPrecio;
        this.pedItemInactivo = data ? data.pedItemInactivo : this.pedItemInactivo;
        this.pedItemProductoCodigo = data ? data.pedItemProductoCodigo : this.pedItemProductoCodigo;
        this.pedItemProductoDescripcion = data ? data.pedItemProductoDescripcion : this.pedItemProductoDescripcion;
        this.pedItemMedidaCodigo = data ? data.pedItemMedidaCodigo : this.pedItemMedidaCodigo;
        this.pedItemMedidaDescripcion = data ? data.pedItemMedidaDescripcion : this.pedItemMedidaDescripcion;
    }

}