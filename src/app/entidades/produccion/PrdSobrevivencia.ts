export class PrdSobrevivencia {

    sobCodigo: number = 0;
    sobDiasDesde: number = 0;
    sobDiasHasta: number = 0;
    sobSobrevivencia: number = 0;
    sobAlimentacion: number = 0;
    usrEmpresa: String = "";
    usrCodigo: String = "";
    usrFechaInserta: Date = new Date();

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }
    
    hydrate(data) {
        this.sobCodigo = data.sobCodigo ? data.sobCodigo : this.sobCodigo;
        this.sobDiasDesde = data.sobDiasDesde ? data.sobDiasDesde : this.sobDiasDesde;
        this.sobDiasHasta = data.sobDiasHasta ? data.sobDiasHasta : this.sobDiasHasta;
        this.sobSobrevivencia = data.sobSobrevivencia ? data.sobSobrevivencia : this.sobSobrevivencia;
        this.sobAlimentacion = data.sobAlimentacion ? data.sobAlimentacion : this.sobAlimentacion;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
    }
    
}