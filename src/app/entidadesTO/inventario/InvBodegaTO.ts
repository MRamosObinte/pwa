export class InvBodegaTO {
    public empCodigo: string = null;
    public bodCodigo: string = null;
    public bodNombre: string = null;
    public bodInactiva: boolean = false;
    public secEmpresa: string = null;
    public secCodigo: string = null;
    public detEmpresa: string = null;
    public detUsuario: string = null;
    public usrEmpresa: string = null;
    public usrInsertaBodega: string = null;
    public usrFechaInsertaBodega: string = null;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.empCodigo = data.empCodigo ? data.empCodigo : this.empCodigo;
        this.bodCodigo = data.bodCodigo ? data.bodCodigo : this.bodCodigo;
        this.bodNombre = data.bodNombre ? data.bodNombre : this.bodNombre;
        this.bodInactiva = data.bodInactiva ? data.bodInactiva : this.bodInactiva;
        this.secEmpresa = data.secEmpresa ? data.secEmpresa : this.secEmpresa;
        this.secCodigo = data.secCodigo ? data.secCodigo : this.secCodigo;
        this.detEmpresa = data.detEmpresa ? data.detEmpresa : this.detEmpresa;
        this.detUsuario = data.detUsuario ? data.detUsuario : this.detUsuario;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrInsertaBodega = data.usrInsertaBodega ? data.usrInsertaBodega : this.usrInsertaBodega;
        this.usrFechaInsertaBodega = data.usrFechaInsertaBodega ? data.usrFechaInsertaBodega : this.usrFechaInsertaBodega;
    }

}