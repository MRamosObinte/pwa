import { PrdGrameajePK } from "./PrdGrameajePK";
import { PrdPiscina } from './PrdPiscina';

export class PrdGrameaje {

    prdGrameajePK: PrdGrameajePK = new PrdGrameajePK();
    graTgrande: number = 0;
    graTmediano: number = 0;
    graTpequeno: number = 0;
    graTpromedio: number = 0;
    graItgrande: number = 0;
    graItmediano: number = 0;
    graItpequeno: number = 0;
    graIpromedio: number = 0;
    graBiomasa: number = 0;
    graSobrevivencia: number = 0;
    graAlimentacion: number = 0;
    graLibrasBalanceado: number = 0;
    graCostoDirecto: number = 0;
    graCostoIndirecto: number = 0;
    graComentario: String = "";
    graAnulado: boolean = false;
    usrEmpresa: String = "";
    usrCodigo: String = "";
    usrFechaInserta: Date = new Date();
    prdPiscina: PrdPiscina = new PrdPiscina();

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.prdGrameajePK = data.prdGrameajePK ? new PrdGrameajePK(data.prdGrameajePK) : this.prdGrameajePK;
        this.graTgrande = data.graTgrande ? data.graTgrande : this.graTgrande;
        this.graTmediano = data.graTmediano ? data.graTmediano : this.graTmediano;
        this.graTpequeno = data.graTpequeno ? data.graTpequeno : this.graTpequeno;
        this.graTpromedio = data.graTpromedio ? data.graTpromedio : this.graTpromedio;
        this.graItgrande = data.graItgrande ? data.graItgrande : this.graItgrande;
        this.graItmediano = data.graItmediano ? data.graItmediano : this.graItmediano;
        this.graItpequeno = data.graItpequeno ? data.graItpequeno : this.graItpequeno;
        this.graIpromedio = data.graIpromedio ? data.graIpromedio : this.graIpromedio;
        this.graBiomasa = data.graBiomasa ? data.graBiomasa : this.graBiomasa;
        this.graSobrevivencia = data.graSobrevivencia ? data.graSobrevivencia : this.graSobrevivencia;
        this.graAlimentacion = data.graAlimentacion ? data.graAlimentacion : this.graAlimentacion;
        this.graLibrasBalanceado = data.graLibrasBalanceado ? data.graLibrasBalanceado : this.graLibrasBalanceado;
        this.graCostoDirecto = data.graCostoDirecto ? data.graCostoDirecto : this.graCostoDirecto;
        this.graCostoIndirecto = data.graCostoIndirecto ? data.graCostoIndirecto : this.graCostoIndirecto;
        this.graComentario = data.graComentario ? data.graComentario : this.graComentario;
        this.graAnulado = data.graAnulado ? data.graAnulado : this.graAnulado;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
        this.prdPiscina = data.prdPiscina ? new PrdPiscina(data.prdPiscina) : this.prdPiscina;
    }

}