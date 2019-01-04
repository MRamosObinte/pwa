
export class PiscinaGrameajeTO {
    id: number = 0;
    graPiscinaCodigo: string = "";
    graPiscinaNombre: string = "";
    graHectareas: number = 0;
    graFechaSiembra: any;
    graDiasCultivo: number = 0;
    graCantidadLarvas: number = 0;
    graPesoAnterior: number = 0;
    graPesoActual: number = 0;
    graBiomasa: number = 0;
    graAnimalesM2: number = 0;
    graSobrevivencia: number = 0;
    graComentario: string = "";
    isMenorQuePesoAnterior: boolean = false;//Temporal
    isMayorQueSobrevivenciaAnterior: boolean = false;//Temporal
    graSobrevivenciaAnterior: number = 0;//Temporal
    noEditable: boolean = false;//Temporal

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.id = data.id ? data.id : this.id;
        this.graPiscinaCodigo = data.graPiscinaCodigo ? data.graPiscinaCodigo : this.graPiscinaCodigo;
        this.graPiscinaNombre = data.graPiscinaNombre ? data.graPiscinaNombre : this.graPiscinaNombre;
        this.graHectareas = data.graHectareas ? data.graHectareas : this.graHectareas;
        this.graFechaSiembra = data.graFechaSiembra ? data.graFechaSiembra : this.graFechaSiembra;
        this.graDiasCultivo = data.graDiasCultivo ? data.graDiasCultivo : this.graDiasCultivo;
        this.graCantidadLarvas = data.graCantidadLarvas ? data.graCantidadLarvas : this.graCantidadLarvas;
        this.graPesoAnterior = data.graPesoAnterior ? data.graPesoAnterior : this.graPesoAnterior;
        this.graPesoActual = data.graPesoActual ? data.graPesoActual : this.graPesoActual;
        this.graBiomasa = data.graBiomasa ? data.graBiomasa : this.graBiomasa;
        this.graAnimalesM2 = data.graAnimalesM2 ? data.graAnimalesM2 : this.graAnimalesM2;
        this.graSobrevivencia = data.graSobrevivencia ? data.graSobrevivencia : this.graSobrevivencia;
        this.graComentario = data.graComentario ? data.graComentario : this.graComentario;
    }
}