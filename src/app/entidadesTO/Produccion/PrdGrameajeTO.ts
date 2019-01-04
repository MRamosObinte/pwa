export class PrdGrameajeTO {

    graEmpresa: string = "";
    graSector: string = "";
    graPiscina: string = "";
    graFecha: string = "";
    graTGrande: number = 0;
    graTMediano: number = 0;
    graTPequeno: number = 0;
    graTPromedio: number = 0;
    graItGrande: number = 0;
    graItMediano: number = 0;
    graItPequeno: number = 0;
    graItPromedio: number = 0;
    graBiomasa: number = 0;
    graSobrevivencia: number = 0;
    graAlimentacion: number = 0;
    graLibrasBalanceado: number = 0;
    graCostoDirecto: number = 0;
    graCostoIndirecto: number = 0;
    graComentario: string = "";
    graAnulado: boolean = false;
    pisEmpresa: string = "";
    pisSector: string = "";
    pisNumero: string = "";
    usrEmpresa: string = "";
    usrCodigo: string = "";
    usrFechaInsertaGrameaje: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.graEmpresa = data.graEmpresa ? data.graEmpresa : this.graEmpresa;
        this.graSector = data.graSector ? data.graSector : this.graSector;
        this.graPiscina = data.graPiscina ? data.graPiscina : this.graPiscina;
        this.graFecha = data.graFecha ? data.graFecha : this.graFecha;
        this.graTGrande = data.graTGrande ? data.graTGrande : this.graTGrande;
        this.graTMediano = data.graTMediano ? data.graTMediano : this.graTMediano;
        this.graTPequeno = data.graTPequeno ? data.graTPequeno : this.graTPequeno;
        this.graTPromedio = data.graTPromedio ? data.graTPromedio : this.graTPromedio;
        this.graItGrande = data.graItGrande ? data.graItGrande : this.graItGrande;
        this.graItMediano = data.graItMediano ? data.graItMediano : this.graItMediano;
        this.graItPequeno = data.graItPequeno ? data.graItPequeno : this.graItPequeno;
        this.graItPromedio = data.graItPromedio ? data.graItPromedio : this.graItPromedio;
        this.graBiomasa = data.graBiomasa ? data.graBiomasa : this.graBiomasa;
        this.graSobrevivencia = data.graSobrevivencia ? data.graSobrevivencia : this.graSobrevivencia;
        this.graAlimentacion = data.graAlimentacion ? data.graAlimentacion : this.graAlimentacion;
        this.graLibrasBalanceado = data.graLibrasBalanceado ? data.graLibrasBalanceado : this.graLibrasBalanceado;
        this.graCostoDirecto = data.graCostoDirecto ? data.graCostoDirecto : this.graCostoDirecto;
        this.graCostoIndirecto = data.graCostoIndirecto ? data.graCostoIndirecto : this.graCostoIndirecto;
        this.graComentario = data.graComentario ? data.graComentario : this.graComentario;
        this.graAnulado = data.graAnulado ? data.graAnulado : this.graAnulado;
        this.pisEmpresa = data.pisEmpresa ? data.pisEmpresa : this.pisEmpresa;
        this.pisSector = data.pisSector ? data.pisSector : this.pisSector;
        this.pisNumero = data.pisNumero ? data.pisNumero : this.pisNumero;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInsertaGrameaje = data.usrFechaInsertaGrameaje ? data.usrFechaInsertaGrameaje : this.usrFechaInsertaGrameaje;
    }
}