export class UsuarioEmpresaReporteTO {
    empCodigo: String = "";
    empNombre: String = "";
    empRuc: String = "";
    empRazonSocial: String = "";
    empGerente: String = "";
    empContador: String = "";
    empDireccion: String = "";
    empTelefono: String = "";
    usrNick: String = "";
    usrNombre: String = "";
    usrApellido: String = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }
    
    hydrate(data) {
        this.empCodigo = data ? data.empCodigo : this.empCodigo;
        this.empNombre = data ? data.empNombre : this.empNombre;
        this.empRuc = data ? data.empRuc : this.empRuc;
        this.empRazonSocial = data ? data.empRazonSocial : this.empRazonSocial;
        this.empGerente = data ? data.empGerente : this.empGerente;
        this.empContador = data ? data.empContador : this.empContador;
        this.empDireccion = data ? data.empDireccion : this.empDireccion;
        this.empTelefono = data ? data.empTelefono : this.empTelefono;
        this.usrNick = data ? data.usrNick : this.usrNick;
        this.usrNombre = data.usrNombre ? data.usrNombre : this.usrNombre;
        this.usrApellido = data.usrApellido ? data.usrApellido : this.usrApellido;
    }

}