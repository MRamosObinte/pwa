export class RhFunXivSueldoConsultarTO {
    id: number = 0;
    xivCategoria: string = "";
    xivSector: string = "";
    xivId: string = "";
    xivNombres: string = "";
    xivApellidos: string = "";
    xivGenero: string = "";
    xivFechaIngreso: string = "";
    xivCargo: string = "";
    xivCargoIess: string = "";
    xivTotalIngresos: number = 0;
    xivDiasLaborados: number = 0;
    xivValorXivSueldo: number = 0;
    xivFormaPago: string = "";
    xivDocumento: string = "";
    xivCodigoMinisterial: string = "";
    xivPeriodo: string = "";
    xivTipo: string = "";
    xivNumero: string = "";
    xivObservaciones: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.id = data.id ? data.id : this.id;
        this.xivCategoria = data.xivCategoria ? data.xivCategoria : this.xivCategoria;
        this.xivSector = data.xivSector ? data.xivSector : this.xivSector;
        this.xivId = data.xivId ? data.xivId : this.xivId;
        this.xivNombres = data.xivNombres ? data.xivNombres : this.xivNombres;
        this.xivApellidos = data.xivApellidos ? data.xivApellidos : this.xivApellidos;
        this.xivGenero = data.xivGenero ? data.xivGenero : this.xivGenero;
        this.xivFechaIngreso = data.xivFechaIngreso ? data.xivFechaIngreso : this.xivFechaIngreso;
        this.xivCargo = data.xivCargo ? data.xivCargo : this.xivCargo;
        this.xivCargoIess = data.xivCargoIess ? data.xivCargoIess : this.xivCargoIess;
        this.xivTotalIngresos = data.xivTotalIngresos ? data.xivTotalIngresos : this.xivTotalIngresos;
        this.xivDiasLaborados = data.xivDiasLaborados ? data.xivDiasLaborados : this.xivDiasLaborados;
        this.xivValorXivSueldo = data.xivValorXivSueldo ? data.xivValorXivSueldo : this.xivValorXivSueldo;
        this.xivDiasLaborados = data.xivDiasLaborados ? data.xivDiasLaborados : this.xivDiasLaborados;
        this.xivFormaPago = data.xivFormaPago ? data.xivFormaPago : this.xivFormaPago;
        this.xivDocumento = data.xivCodigoMinisterial ? data.xivDocumento : this.xivDocumento;
        this.xivCodigoMinisterial = data.xivCodigoMinisterial ? data.xivCodigoMinisterial : this.xivCodigoMinisterial;
        this.xivPeriodo = data.xivPeriodo ? data.xivPeriodo : this.xivPeriodo;
        this.xivTipo = data.xivTipo ? data.xivTipo : this.xivTipo;
        this.xivNumero = data.xivNumero ? data.xivNumero : this.xivNumero;
        this.xivObservaciones = data.xivObservaciones ? data.xivObservaciones : this.xivObservaciones;
    }

}