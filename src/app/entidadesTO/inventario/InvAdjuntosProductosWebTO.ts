import { InvProducto } from "../../entidades/inventario/InvProducto";

export class InvAdjuntosProductosWebTO {
    public adjSecuencial: number = null;
    public adjArchivo: any = null;
    public invProducto: InvProducto = new InvProducto();
    public imagenString: string = null;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.adjSecuencial = data.adjSecuencial ? data.adjSecuencial : this.adjSecuencial;
        this.adjArchivo = data.adjArchivo ? data.adjArchivo : this.adjArchivo;
        this.invProducto = data.invProducto ? data.invProducto : this.invProducto;
        this.imagenString = data.imagenString ? data.imagenString : this.imagenString;
    }

}