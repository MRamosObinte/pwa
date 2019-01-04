
export class ListaPreLiquidacionTO {
    id: number = null;
    plMotivo: string = null;
    plNumero: string = null;
    plLote: string = null;
    plFecha: string = null;
    pisSector: string = null;
    pisNumero: string = null;
    cliCodigo: string = null;
    cliNombre: string = null;
    plLibrasEnviadas: number = null;
    plLibrasRecibidas: number = null;
    plLibrasBasura: number = null;
    plLibrasRetiradas: number = null;
    plLibrasNetas: number = null;
    plLibrasEntero: number = null;
    plLibrasCola: number = null;
    plLibrasColaProcesadas: number = null;
    plAnimalesCosechados: number = null;
    plTotalMonto: number = null;
    plPendiente: string = null;
    plAnulado: string = null;
    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.id = data.id ? data.id : this.id;
        this.plMotivo = data.plMotivo ? data.plMotivo : this.plMotivo;
        this.plNumero = data.plNumero ? data.plNumero : this.plNumero;
        this.plLote = data.plLote ? data.plLote : this.plLote;
        this.plFecha = data.plFecha ? data.plFecha : this.plFecha;
        this.pisSector = data.pisSector ? data.pisSector : this.pisSector;
        this.pisNumero = data.pisNumero ? data.pisNumero : this.pisNumero;
        this.cliCodigo = data.cliCodigo ? data.cliCodigo : this.cliCodigo;
        this.cliNombre = data.cliNombre ? data.cliNombre : this.cliNombre;
        this.plLibrasEnviadas = data.plLibrasEnviadas ? data.plLibrasEnviadas : this.plLibrasEnviadas;
        this.plLibrasRecibidas = data.plLibrasRecibidas ? data.plLibrasRecibidas : this.plLibrasRecibidas;
        this.plLibrasBasura = data.plLibrasBasura ? data.plLibrasBasura : this.plLibrasBasura;
        this.plLibrasRetiradas = data.plLibrasRetiradas ? data.plLibrasRetiradas : this.plLibrasRetiradas;
        this.plLibrasNetas = data.plLibrasNetas ? data.plLibrasNetas : this.plLibrasNetas;
        this.plLibrasCola = data.plLibrasCola ? data.plLibrasCola : this.plLibrasCola;
        this.plLibrasEntero = data.plLibrasEntero ? data.plLibrasEntero : this.plLibrasEntero;
        this.plLibrasColaProcesadas = data.plLibrasColaProcesadas ? data.plLibrasColaProcesadas : this.plLibrasColaProcesadas;
        this.plAnimalesCosechados = data.plAnimalesCosechados ? data.plAnimalesCosechados : this.plAnimalesCosechados;
        this.plTotalMonto = data.plTotalMonto ? data.plTotalMonto : this.plTotalMonto;
        this.plPendiente = data.plPendiente ? data.plPendiente : this.plPendiente;
        this.plAnulado = data.plAnulado ? data.plAnulado : this.plAnulado;
    }
}