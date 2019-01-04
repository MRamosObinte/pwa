import { ConContablePK } from "./ConContablePK";
import { ConDetalle } from "./ConDetalle";
import { ConContableMotivoAnulacion } from "./ConContableMotivoAnulacion";
import { RhAnticipo } from "../rrhh/RhAnticipo";
import { RhPrestamo } from "../rrhh/RhPrestamo";
import { RhBono } from "../rrhh/RhBono";
import { RhRol } from "../rrhh/RhRol";
import { RhXiiiSueldo } from "../rrhh/RhXiiiSueldo";
import { RhXivSueldo } from "../rrhh/RhXivSueldo";
import { RhUtilidades } from "../rrhh/RhUtilidades";
import { PrdCorrida } from "../produccion/PrdCorrida";

export class ConContable {
    public conContablePK: ConContablePK = new ConContablePK();
    public conCodigo: string = null;
    public conFecha: Date = new Date();
    public conPendiente: boolean = false;
    public conBloqueado: boolean = false;
    public conReversado: boolean = false;
    public conAnulado: boolean = false;
    public conGenerado: boolean = false;
    public conReferencia: string = null;
    public conConcepto: string = "";
    public conDetalle: string = "";
    public conObservaciones: string = "";
    public usrEmpresa: string = null;
    public usrCodigo: string = null;
    public usrFechaInserta: Date = new Date();
    public conDetalleList: Array<ConDetalle> = [];
    public conContableMotivoAnulacionList: Array<ConContableMotivoAnulacion> = [];
    public rhAnticipoList: Array<RhAnticipo> = [];
    public rhPrestamoList: Array<RhPrestamo> = [];
    public rhBonoList: Array<RhBono> = [];
    public rhRolList: Array<RhRol> = [];
    public rhRolProvisionList: Array<RhRol> = [];
    public rhXiiiSueldoList: Array<RhXiiiSueldo> = [];
    public rhXivSueldoList: Array<RhXivSueldo> = [];
    public rhUtilidadesList: Array<RhUtilidades> = [];
    public prdCorridaList: Array<PrdCorrida> = [];

    constructor(data?) {
        this.hydrate(data);
    }
    hydrate(data) {
        this.conContablePK = data ? data.conContablePK : this.conContablePK;
        this.conCodigo = data ? data.conCodigo : this.conCodigo;
        this.conFecha = data ? data.conFecha : this.conFecha;
        this.conPendiente = data ? data.conPendiente : this.conPendiente;
        this.conBloqueado = data ? data.conBloqueado : this.conBloqueado;
        this.conReversado = data ? data.conReversado : this.conReversado;
        this.conAnulado = data ? data.conAnulado : this.conAnulado;
        this.conGenerado = data ? data.conGenerado : this.conGenerado;
        this.conReferencia = data ? data.conReferencia : this.conReferencia;
        this.conConcepto = data ? data.conConcepto : this.conConcepto;
        this.conDetalle = data ? data.conDetalle : this.conDetalle;
        this.conObservaciones = data ? data.conObservaciones : this.conObservaciones;
        this.usrEmpresa = data ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data ? data.usrCodigo : this.conCodigo;
        this.usrFechaInserta = data ? data.usrFechaInserta : this.usrFechaInserta;
        this.conDetalleList = data ? data.conDetalleList : this.conDetalleList;
        this.conContableMotivoAnulacionList = data ? data.conContableMotivoAnulacionList : this.conContableMotivoAnulacionList;
        this.rhAnticipoList = data ? data.rhAnticipoList : this.rhAnticipoList;
        this.rhPrestamoList = data ? data.rhPrestamoList : this.rhPrestamoList;
        this.rhBonoList = data ? data.rhBonoList : this.rhBonoList;
        this.rhRolList = data ? data.rhRolList : this.rhRolList;
        this.rhRolProvisionList = data ? data.rhRolProvisionList : this.rhRolProvisionList;
        this.rhXiiiSueldoList = data ? data.rhXiiiSueldoList : this.rhXiiiSueldoList;
        this.rhXivSueldoList = data ? data.rhXivSueldoList : this.rhXivSueldoList;
        this.rhUtilidadesList = data ? data.rhUtilidadesList : this.rhUtilidadesList;
        this.prdCorridaList = data ? data.prdCorridaList : this.prdCorridaList;
    }
}