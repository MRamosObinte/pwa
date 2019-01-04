export class BanPreavisosPK {

    preEmpresa: string = "";
    preCuentaContable: string = "";
    preNombreArchivoGenerado: string = "";


    constructor(data?) {
        data ? this.hydrate(data) : null
    }
    hydrate(data) {
        this.preEmpresa = data.preEmpresa ? data.preEmpresa : this.preEmpresa;
        this.preCuentaContable = data.preCuentaContable ? data.preCuentaContable : this.preCuentaContable;
        this.preNombreArchivoGenerado = data.preNombreArchivoGenerado ? data.preNombreArchivoGenerado : this.preNombreArchivoGenerado;
    }

}