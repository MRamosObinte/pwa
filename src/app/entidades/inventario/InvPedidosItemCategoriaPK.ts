import { InvProductoCategoria } from "./InvProductoCategoria";

export class InvPedidosItemCategoriaPK {

    icatEmpresa:string="";
    icatCodigo:string;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.icatEmpresa = data.icatEmpresa ? data.icatEmpresa : this.icatEmpresa;
        this.icatCodigo = data.icatCodigo ? data.icatCodigo : this.icatCodigo;
    }
}