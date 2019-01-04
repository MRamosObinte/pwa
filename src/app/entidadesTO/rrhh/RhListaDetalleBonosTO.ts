export class RhListaDetalleBonosTO {
    id: number;
    dbCategoria: string = "";
    dbFecha: string = "";
    dbId: string = "";
    dbNombres: string = "";
    dbConcepto: string = "";
    dbSector: string = "";
    dbPiscina: string = "";
    dbValor: number = 0;
    dbDeducible: boolean = false;
    dbPendiente: boolean = false;
    dbReversado: boolean = false;
    dbAnulado: boolean = false;
    dbContable: string = "";
    dbObservaciones: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.dbCategoria = data.dbCategoria ? data.dbCategoria : this.dbCategoria;
        this.dbFecha = data.dbFecha ? data.dbFecha : this.dbFecha;
        this.dbId = data.dbId ? data.dbId : this.dbId;
        this.dbNombres = data.dbNombres ? data.dbNombres : this.dbNombres;
        this.dbConcepto = data.dbConcepto ? data.dbConcepto : this.dbConcepto;
        this.dbSector = data.dbSector ? data.dbSector : this.dbSector;
        this.dbPiscina = data.dbPiscina ? data.dbPiscina : this.dbPiscina;
        this.dbValor = data.dbValor ? data.dbValor : this.dbValor;
        this.dbDeducible = data.dbDeducible ? data.dbDeducible : this.dbDeducible;
        this.dbPendiente = data.dbPendiente ? data.dbPendiente : this.dbPendiente;
        this.dbReversado = data.dbReversado ? data.dbReversado : this.dbReversado;
        this.dbAnulado = data.dbAnulado ? data.dbAnulado : this.dbAnulado;
        this.dbContable = data.dbContable ? data.dbContable : this.dbContable;
        this.dbObservaciones = data.dbObservaciones ? data.dbObservaciones : this.dbObservaciones;
    }
}