export class PrdListaPiscinaTO {

    public pisNumero: string = null;
    public pisNombre: string = null;
    public pisHectareaje: number = null;
    public ctaCostoDirecto: string = null;
    public ctaCostoIndirecto: string = null;
    public ctaCostoTransferencia: string = null;
    public ctaCostoProductoTerminado: string = null;
    public pisActiva: boolean = false;
    public pisSector: string = null;
    
    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.pisNumero = data ? new data.pisNumero : this.pisNumero;
        this.pisNombre = data ? new data.pisNombre : this.pisNombre;
        this.pisHectareaje = data ? new data.pisHectareaje : this.pisHectareaje;
        this.ctaCostoDirecto = data ? new data.ctaCostoDirecto : this.ctaCostoDirecto;
        this.ctaCostoIndirecto = data ? new data.ctaCostoIndirecto : this.ctaCostoIndirecto;
        this.ctaCostoTransferencia = data ? new data.ctaCostoTransferencia : this.ctaCostoTransferencia;
        this.ctaCostoProductoTerminado = data ? new data.ctaCostoProductoTerminado : this.ctaCostoProductoTerminado;
        this.pisActiva = data ? new data.pisActiva : this.pisActiva;
        this.pisSector = data ? new data.pisSector : this.pisSector;
    }
}