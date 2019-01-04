export class Contacto {

    public contacto: string = "";
    public telefono: string = "";
    public email: string = "";
    public cargo: string = "";
    public lugarEntrega: string = "";
    public lugarEntrega2: string = "";
    public lugarDestino: string = "";
    public transporte: string = "";
    public recordatorio: string = "";
    public predeterminado: boolean = false;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.contacto = data.contacto ? data.contacto : this.contacto;
        this.telefono = data.telefono ? data.telefono : this.telefono;
        this.email = data.email ? data.email : this.email;
        this.cargo = data.cargo ? data.cargo : this.cargo;
        this.lugarEntrega = data.lugarEntrega ? data.lugarEntrega : this.lugarEntrega;
        this.lugarEntrega2 = data.lugarEntrega2 ? data.lugarEntrega2 : this.lugarEntrega2;
        this.lugarDestino = data.lugarDestino ? data.lugarDestino : this.lugarDestino;
        this.transporte = data.transporte ? data.transporte : this.transporte;
        this.recordatorio = data.recordatorio ? data.recordatorio : this.recordatorio;
        this.predeterminado = data.predeterminado ? data.predeterminado : this.predeterminado;
    }

}