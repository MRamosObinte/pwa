export class SisUsuario {
    usrCodigo: string = "";
    usrNick: string = "";
    usrNombre: string = "";
    usrApellido: string = "";
    usrPassword: string = "";
    usrCaduca: Date = new Date();
    usrActivo: boolean = true;
    usrCambiarContrasenia = true;
    usrEmail: string = "";
    usrPasswordEmail: string = "";
    usrIP: string = "";
    usrCodigoInserta: string = "";
    usrFechaInsertaUsuario: Date = new Date();

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }
    hydrate(data) {
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrNick = data.usrNick ? data.usrNick : this.usrNick;
        this.usrNombre = data.usrNombre ? data.usrNombre : this.usrNombre;
        this.usrApellido = data.usrApellido ? data.usrApellido : this.usrApellido;
        this.usrPassword = data.usrPassword ? data.usrPassword : this.usrPassword;
        this.usrCaduca = data.usrCaduca ? data.usrCaduca : this.usrCaduca;
        this.usrActivo = data.usrActivo ? data.usrActivo : this.usrActivo;
        this.usrCambiarContrasenia = data.usrCambiarContrasenia ? data.usrCambiarContrasenia: this.usrCambiarContrasenia;
        this.usrEmail = data.usrEmail ? data.usrEmail: this.usrEmail;
        this.usrPasswordEmail = data.usrPasswordEmail ? data.usrPasswordEmail : this.usrPasswordEmail;
        this.usrIP = data.usrIP = data.usrIP ? data.usrIP: this.usrIP;
        this.usrCodigoInserta = data.usrCodigoInserta ? data.usrCodigoInserta: this.usrCodigoInserta;
        this.usrFechaInsertaUsuario = data.usrFechaInsertaUsuario ? data.usrFechaInsertaUsuario: this.usrFechaInsertaUsuario;
    }
}