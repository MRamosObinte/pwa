export class RhFunXiiiSueldoConsultarTO {
    id: number = 0;
    xiiiCategoria: string = "";
    xiiiSector: string = "";
    xiiiId: string = "";
    xiiiNombres: string = "";
    xiiiApellidos: string = "";
    xiiiGenero: string = "";
    xiiiFechaIngreso: string = "";
    xiiiCargo: string = "";
    xiiiCargoIess: string = "";
    xiiiTotalIngresos: number = 0;
    xiiiDiasLaborados: number = 0;
    xiiiValorXiiiSueldo: number = 0;
    xiiiFormaPago: string = "";
    xiiiDocumento: string = "";
    xiiiCodigoMinisterial: string = "";
    xiiiPeriodo: string = "";
    xiiiTipo: string = "";
    xiiiNumero: string = "";
    xiiiObservaciones: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.id = data.id ? data.id : this.id;
        this.xiiiCategoria = data.xiiiCategoria ? data.xiiiCategoria : this.xiiiCategoria;
        this.xiiiSector = data.xiiiSector ? data.xiiiSector : this.xiiiSector;
        this.xiiiId = data.xiiiId ? data.xiiiId : this.xiiiId;
        this.xiiiNombres = data.xiiiNombres ? data.xiiiNombres : this.xiiiNombres;
        this.xiiiApellidos = data.xiiiApellidos ? data.xiiiApellidos : this.xiiiApellidos;
        this.xiiiGenero = data.xiiiGenero ? data.xiiiGenero : this.xiiiGenero;
        this.xiiiFechaIngreso = data.xiiiFechaIngreso ? data.xiiiFechaIngreso : this.xiiiFechaIngreso;
        this.xiiiCargo = data.xiiiCargo ? data.xiiiCargo : this.xiiiCargo;
        this.xiiiCargoIess = data.xiiiCargoIess ? data.xiiiCargoIess : this.xiiiCargoIess;
        this.xiiiTotalIngresos = data.xiiiTotalIngresos ? data.xiiiTotalIngresos : this.xiiiTotalIngresos;
        this.xiiiDiasLaborados = data.xiiiDiasLaborados ? data.xiiiDiasLaborados : this.xiiiDiasLaborados;
        this.xiiiValorXiiiSueldo = data.xiiiValorXiiiSueldo ? data.xiiiValorXiiiSueldo : this.xiiiValorXiiiSueldo;
        this.xiiiDiasLaborados = data.xiiiDiasLaborados ? data.xiiiDiasLaborados : this.xiiiDiasLaborados;
        this.xiiiFormaPago = data.xiiiFormaPago ? data.xiiiFormaPago : this.xiiiFormaPago;
        this.xiiiDocumento = data.xiiiCodigoMinisterial ? data.xiiiDocumento : this.xiiiDocumento;
        this.xiiiCodigoMinisterial = data.xiiiCodigoMinisterial ? data.xiiiCodigoMinisterial : this.xiiiCodigoMinisterial;
        this.xiiiPeriodo = data.xiiiPeriodo ? data.xiiiPeriodo : this.xiiiPeriodo;
        this.xiiiTipo = data.xiiiTipo ? data.xiiiTipo : this.xiiiTipo;
        this.xiiiNumero = data.xiiiNumero ? data.xiiiNumero : this.xiiiNumero;
        this.xiiiObservaciones = data.xiiiObservaciones ? data.xiiiObservaciones : this.xiiiObservaciones;
    }

}