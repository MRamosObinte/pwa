export class Mensaje {
    texto: String = "";
    tipo: string = "";//primary, secondary, success, danger, warning, info, light
    icono: string = "";//fa fa-icons

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.texto = data.texto ? data.texto : this.texto;
        this.tipo = data.tipo ? data.tipo : this.tipo;
        this.icono = data.icono ? data.icono : this.icono;
    }
}