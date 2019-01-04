
export class ListaLiquidacionTO {
    id: number = null;
    liqMotivo: string = null;
    liqNumero: string = null;
    liqLote: string = null;
    liqFecha: string = null;
    pisSector: string = null;
    pisNumero: string = null;
    cliCodigo: string = null;
    cliNombre: string = null;
    liqLibrasEnviadas: number = null;
    liqLibrasRecibidas: number = null;
    liqLibrasBasura: number = null;
    liqLibrasRetiradas: number = null;
    liqLibrasNetas: number = null;
    liqLibrasEntero: number = null;
    liqLibrasCola: number = null;
    liqLibrasColaProcesadas: number = null;
    liqAnimalesCosechados: number = null;
    liqTotalMonto: number = null;
    liqPendiente: string = null;
    liqAnulado: string = null;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.id = data.id ? data.id : this.id;
        this.liqMotivo = data.liqMotivo ? data.liqMotivo : this.liqMotivo;
        this.liqNumero = data.liqNumero ? data.liqNumero : this.liqNumero;
        this.liqLote = data.liqLote ? data.liqLote : this.liqLote;
        this.liqFecha = data.liqFecha ? data.liqFecha : this.liqFecha;
        this.pisSector = data.pisSector ? data.pisSector : this.pisSector;
        this.pisNumero = data.pisNumero ? data.pisNumero : this.pisNumero;
        this.cliCodigo = data.cliCodigo ? data.cliCodigo : this.cliCodigo;
        this.cliNombre = data.cliNombre ? data.cliNombre : this.cliNombre;
        this.liqLibrasEnviadas = data.liqLibrasEnviadas ? data.liqLibrasEnviadas : this.liqLibrasEnviadas;
        this.liqLibrasRecibidas = data.liqLibrasRecibidas ? data.liqLibrasRecibidas : this.liqLibrasRecibidas;
        this.liqLibrasBasura = data.liqLibrasBasura ? data.liqLibrasBasura : this.liqLibrasBasura;
        this.liqLibrasRetiradas = data.liqLibrasRetiradas ? data.liqLibrasRetiradas : this.liqLibrasRetiradas;
        this.liqLibrasNetas = data.liqLibrasNetas ? data.liqLibrasNetas : this.liqLibrasNetas;
        this.liqLibrasCola = data.liqLibrasCola ? data.liqLibrasCola : this.liqLibrasCola;
        this.liqLibrasColaProcesadas = data.liqLibrasColaProcesadas ? data.liqLibrasColaProcesadas : this.liqLibrasColaProcesadas;
        this.liqAnimalesCosechados = data.liqAnimalesCosechados ? data.liqAnimalesCosechados : this.liqAnimalesCosechados;
        this.liqTotalMonto = data.liqTotalMonto ? data.liqTotalMonto : this.liqTotalMonto;
        this.liqPendiente = data.liqPendiente ? data.liqPendiente : this.liqPendiente;
        this.liqAnulado = data.liqAnulado ? data.liqAnulado : this.liqAnulado;
    }
}