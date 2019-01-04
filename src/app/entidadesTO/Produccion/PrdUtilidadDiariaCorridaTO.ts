
export class PrdUtilidadDiariaCorridaTO {

    uTipo: string = "";
    uDescripcion: string = "";
    uValorNumerico: number = 0;
    uValorTexto: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.uTipo = data.uTipo ? data.uTipo : this.uTipo;
        this.uDescripcion = data.uDescripcion ? data.uDescripcion : this.uDescripcion;
        this.uValorNumerico = data.uValorNumerico ? data.uValorNumerico : this.uValorNumerico;
        this.uValorTexto = data.uValorTexto ? data.uValorTexto : this.uValorTexto;
    }
}