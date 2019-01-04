export class SisListaUsuarioTO {

    usrCodigo: string = "";
    usrNombre: string = "";
    usrApellido: string = "";
    usrEmailUsuario: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrNombre = data.usrNombre ? data.usrNombre : this.usrNombre;
        this.usrApellido = data.usrApellido ? data.usrApellido : this.usrApellido;
        this.usrEmailUsuario = data.usrEmailUsuario ? data.usrEmailUsuario : this.usrEmailUsuario;
    }

}