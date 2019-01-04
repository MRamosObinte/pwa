export class AfCategoriasTO {
    public catEmpresa: string = "";
    public catCodigo: string = "";
    public catDescripcion: string = "";
    public catVidaUtil: number = 0;
    public catPorcentajeDepreciacion: number = 0;
    public catInactivo: boolean = false;
    public catCuentaActivo: string = "";
    public catCuentaDepreciacion: string = "";
    public catCuentaDepreciacionAcumulada: string = "";
    public usrEmpresa: string = "";
    public usrCodigo: string = "";
    public usrFechaInserta: Date = new Date();

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.catEmpresa = data.catEmpresa ? data.catEmpresa : this.catEmpresa;
        this.catCodigo = data.catCodigo ? data.catCodigo : this.catCodigo;
        this.catDescripcion = data.catDescripcion ? data.catDescripcion : this.catDescripcion;
        this.catVidaUtil = data.catVidaUtil ? data.catVidaUtil : this.catVidaUtil;
        this.catPorcentajeDepreciacion = data.catPorcentajeDepreciacion ? data.catPorcentajeDepreciacion : this.catPorcentajeDepreciacion;
        this.catInactivo = data.catInactivo ? data.catInactivo : this.catInactivo;
        this.catCuentaActivo = data.catCuentaActivo ? data.catCuentaActivo : this.catCuentaActivo;
        this.catCuentaDepreciacion = data.catCuentaDepreciacion ? data.catCuentaDepreciacion : this.catCuentaDepreciacion;
        this.catCuentaDepreciacionAcumulada = data.catCuentaDepreciacionAcumulada ? data.catCuentaDepreciacionAcumulada : this.catCuentaDepreciacionAcumulada;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
    }

}