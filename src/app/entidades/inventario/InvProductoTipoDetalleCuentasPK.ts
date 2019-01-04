export class InvProductoTipoDetalleCuentasPK {

    detEmpresa: String = null;
    detTipo: String = null;
    detSector: String = null;
    detPiscina: String = null;
    detCuenta: String = null;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.detEmpresa = data.detEmpresa ? data.detEmpresa : this.detEmpresa;
        this.detTipo = data.detTipo ? data.detTipo : this.detTipo;
        this.detSector = data.detSector ? data.detSector : this.detSector;
        this.detPiscina = data.detPiscina ? data.detPiscina : this.detPiscina;
        this.detCuenta = data.detCuenta ? data.detCuenta : this.detCuenta;
    }
}