export class InvKardexTO {

    id: number = 0;
    kTransaccion: string = "";
    kFecha: string = "";
    kEntradasCantidad: number = 0;
    kEntradasCosto: number = 0;
    kSalidasCantidad: number = 0;
    kSalidasCosto: number = 0;
    kSaldosCantidad: number = 0;
    kSaldosCosto: number = 0;
    kCostoActual: number = 0;
    kSectorPiscina: string = "";
    kNumeroSistema: string = "";
    kDocumentoNumero: string = "";
    kProveedor: string = "";
    kObservaciones: string = "";
    kStatus: string = "";
    kBodega: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.id = data.id ? data.id : this.id;
        this.kTransaccion = data.kTransaccion ? data.kTransaccion : this.kTransaccion;
        this.kFecha = data.kFecha ? data.kFecha : this.kFecha;
        this.kEntradasCantidad = data.kEntradasCantidad ? data.kEntradasCantidad : this.kEntradasCantidad;
        this.kEntradasCosto = data.kEntradasCosto ? data.kEntradasCosto : this.kEntradasCosto;
        this.kSalidasCantidad = data.kSalidasCantidad ? data.kSalidasCantidad : this.kSalidasCantidad;
        this.kSalidasCosto = data.kSalidasCosto ? data.kSalidasCosto : this.kSalidasCosto;
        this.kSaldosCantidad = data.kSaldosCantidad ? data.kSaldosCantidad : this.kSaldosCantidad;
        this.kSaldosCosto = data.kSaldosCosto ? data.kSaldosCosto : this.kSaldosCosto;
        this.kCostoActual = data.kCostoActual ? data.kCostoActual : this.kCostoActual;
        this.kSectorPiscina = data.kSectorPiscina ? data.kSectorPiscina : this.kSectorPiscina;
        this.kNumeroSistema = data.kNumeroSistema ? data.kNumeroSistema : this.kNumeroSistema;
        this.kDocumentoNumero = data.kDocumentoNumero ? data.kDocumentoNumero : this.kDocumentoNumero;
        this.kProveedor = data.kProveedor ? data.kProveedor : this.kProveedor;
        this.kObservaciones = data.kObservaciones ? data.kObservaciones : this.kObservaciones;
        this.kStatus = data.kStatus ? data.kStatus : this.kStatus;
        this.kBodega = data.kBodega ? data.kBodega : this.kBodega;
    }
}