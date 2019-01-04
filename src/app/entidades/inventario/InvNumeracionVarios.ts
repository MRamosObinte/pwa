export class InvNumeracionVarios {

    numEmpresa: String = null;
    numClientes: String = null;
    numProveedores: String = null;
    numProductos: String = null;
    empCodigo: String = null;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.numEmpresa = data.numEmpresa ? data.numEmpresa : this.numEmpresa;
        this.numClientes = data.numClientes ? data.numClientes : this.numClientes;
        this.numProveedores = data.numProveedores ? data.numProveedores : this.numProveedores;
        this.numProductos = data.numProductos ? data.numProductos : this.numProductos;
        this.empCodigo = data.empCodigo ? data.empCodigo : this.empCodigo;
    }
}