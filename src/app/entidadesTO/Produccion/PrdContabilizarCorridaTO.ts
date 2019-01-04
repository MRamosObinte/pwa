
export class PrdContabilizarCorridaTO {

    id:number=0;
	empCodigo: string = "";
	secCodigo: string = "";
	pisNumero: string = "";
	rcCorridaNumero: string = "";
	rcFechaDesde: string = "";
	rcFechaHasta: string = "";
	rcCosto:number=0;
	rcDirecto:number=0;
	rcIndirecto:number=0;
	rcCostoTransferencia:number=0;
	rcContablePeriodo: string = "";
	rcContableTipo: string = "";
    rcContableNumero: string = "";
    
    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.id = data.id ? data.id : this.id;
        this.empCodigo = data.empCodigo ? data.empCodigo : this.empCodigo;
        this.secCodigo = data.secCodigo ? data.secCodigo : this.secCodigo;
        this.pisNumero = data.pisNumero ? data.pisNumero : this.pisNumero;
        this.rcCorridaNumero = data.rcCorridaNumero ? data.rcCorridaNumero : this.rcCorridaNumero;
        this.rcFechaDesde = data.rcFechaDesde ? data.rcFechaDesde : this.rcFechaDesde;
        this.rcFechaHasta = data.rcFechaHasta ? data.rcFechaHasta : this.rcFechaHasta;
        this.rcCosto = data.rcCosto ? data.rcCosto : this.rcCosto;
        this.rcDirecto = data.rcDirecto ? data.rcDirecto : this.rcDirecto;
        this.rcIndirecto = data.rcIndirecto ? data.rcIndirecto : this.rcIndirecto;
        this.rcCostoTransferencia = data.rcCostoTransferencia ? data.rcCostoTransferencia : this.rcCostoTransferencia;
        this.rcContablePeriodo = data.rcContablePeriodo ? data.rcContablePeriodo : this.rcContablePeriodo;
        this.rcContableTipo = data.rcContableTipo ? data.rcContableTipo : this.rcContableTipo;
        this.rcContableNumero = data.rcContableNumero ? data.rcContableNumero : this.rcContableNumero;
    }
}