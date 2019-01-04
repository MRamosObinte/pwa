
export class PrdListaSobrevivenciaTO {

    sobCodigo: number;
    sobDiasDesde: number;
    sobDiasHasta: number;
    sobSobrevivencia: number;
    sobAlimentacion: number;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.sobCodigo = data.sobCodigo ? data.sobCodigo : this.sobCodigo;
        this.sobDiasDesde = data.sobDiasDesde ? data.sobDiasDesde : this.sobDiasDesde;
        this.sobDiasHasta = data.sobDiasHasta ? data.sobDiasHasta : this.sobDiasHasta;
        this.sobSobrevivencia = data.sobSobrevivencia ? data.sobSobrevivencia : this.sobSobrevivencia;
        this.sobAlimentacion = data.sobAlimentacion ? data.sobAlimentacion : this.sobAlimentacion;
    }
}