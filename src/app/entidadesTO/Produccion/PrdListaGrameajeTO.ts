
export class PrdListaGrameajeTO {

    graFecha: string = "";
    gratPromedio: number = 0;
    graiPromedio: number = 0;
    graBiomasa: number = 0;
    graSobrevivencia: number = 0;
    gratBalanceadoAcumulado: number = 0;
    graComentario: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.graFecha = data.graFecha ? data.graFecha : this.graFecha;
        this.gratPromedio = data.gratPromedio ? data.gratPromedio : this.gratPromedio;
        this.graiPromedio = data.graiPromedio ? data.graiPromedio : this.graiPromedio;
        this.graBiomasa = data.graBiomasa ? data.graBiomasa : this.graBiomasa;
        this.graSobrevivencia = data.graSobrevivencia ? data.graSobrevivencia : this.graSobrevivencia;
        this.gratBalanceadoAcumulado = data.gratBalanceadoAcumulado ? data.gratBalanceadoAcumulado : this.gratBalanceadoAcumulado;
        this.graComentario = data.graComentario ? data.graComentario : this.graComentario;
    }
}