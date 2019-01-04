
export class PrdSobrevivenciaTO {

    sobCodigo: number;
    sobDiasDesde: number;
    sobDiasHasta: number;
    sobSobrevivencia: number = 0;
    sobAlimentacion: number = 0;
    secEmpresa: string = null;
    secCodigo: string = null;
    usrEmpresa: string = "";
    usrCodigo: string = "";
    usrFechaInsertaSobrevivencia: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.sobCodigo = data.sobCodigo ? data.sobCodigo : this.sobCodigo;
        this.sobDiasDesde = data.sobDiasDesde ? data.sobDiasDesde : this.sobDiasDesde;
        this.sobDiasHasta = data.sobDiasHasta ? data.sobDiasHasta : this.sobDiasHasta;
        this.sobSobrevivencia = data.sobSobrevivencia ? data.sobSobrevivencia : this.sobSobrevivencia;
        this.sobAlimentacion = data.sobAlimentacion ? data.sobAlimentacion : this.sobAlimentacion;

        this.secEmpresa = data.secEmpresa ? data.secEmpresa : this.secEmpresa;
        this.secCodigo = data.secCodigo ? data.secCodigo : this.secCodigo;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInsertaSobrevivencia = data.usrFechaInsertaSobrevivencia ? data.usrFechaInsertaSobrevivencia : this.usrFechaInsertaSobrevivencia;
    }
}