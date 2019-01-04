import { PrdPresupuestoPescaPK } from "./PrdPresupuestoPescaPK";
import { PrdPresupuestoPescaDetalle } from "./PrdPresupuestoPescaDetalle";
import { PrdPiscina } from "./PrdPiscina";

export class PrdPresupuestoPesca {

    prdPresupuestoPescaPK: PrdPresupuestoPescaPK = new PrdPresupuestoPescaPK();
    presuFecha: Date = new Date();
    presuObservaciones: String = "";
    presuPendiente: boolean = false;
    presuAnulado: boolean = false;
    presuGramosPromedio: number = 0;
    presuBiomasaEstimada: number = 0;
    presuTotalVenta: number = 0;
    prdPiscina: PrdPiscina = new PrdPiscina();
    prdPresupuestoPescaDetalleList: Array<PrdPresupuestoPescaDetalle> = [];
    usrEmpresa: String = "";
    usrCodigo: String = "";
    usrFechaInserta: Date = new Date();

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.prdPresupuestoPescaPK = data.prdPresupuestoPescaPK ? new PrdPresupuestoPescaPK(data.prdPresupuestoPescaPK) : this.prdPresupuestoPescaPK;
        this.presuFecha = data.presuFecha ? data.presuFecha : this.presuFecha;
        this.presuObservaciones = data.presuObservaciones ? data.presuObservaciones : this.presuObservaciones;
        this.presuPendiente = data.presuPendiente ? data.presuPendiente : this.presuPendiente;
        this.presuAnulado = data.presuAnulado ? data.presuAnulado : this.presuAnulado;
        this.presuGramosPromedio = data.presuGramosPromedio ? data.presuGramosPromedio : this.presuGramosPromedio;
        this.presuBiomasaEstimada = data.presuBiomasaEstimada ? data.presuBiomasaEstimada : this.presuBiomasaEstimada;
        this.presuTotalVenta = data.presuTotalVenta ? data.presuTotalVenta : this.presuTotalVenta;
        this.prdPiscina = data.prdPiscina ? new PrdPiscina(data.prdPiscina) : this.prdPiscina;
        this.prdPresupuestoPescaDetalleList = data.prdPresupuestoPescaDetalleList ? data.prdPresupuestoPescaDetalleList : this.prdPresupuestoPescaDetalleList;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
    }

}