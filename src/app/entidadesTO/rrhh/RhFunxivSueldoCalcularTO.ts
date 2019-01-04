export class RhFunXivSueldoCalcularTO {
    public id: number = null;
    public xivId: string = null;
    public xivNombres: string = null;
    public xivApellidos: string = null;
    public xivGenero: string = null;
    public xivFechaIngreso: string = null;
    public xivCargo: string = null;
    public xivTotalIngresos: number = null;
    public xivDiasLaborados: number = null;
    public xivValorxivSueldo: number = null;
    public xivCategoria: string = null;
    public xivCuenta: string = null;
    public xivSector: string = null;
    public estado: boolean = false;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.id = data.id ? data.id : this.id;
        this.xivId = data.xivId ? data.xivId : this.xivId;
        this.xivNombres = data.xivNombres ? data.xivNombres : this.xivNombres;
        this.xivApellidos = data.xivApellidos ? data.xivApellidos : this.xivApellidos;
        this.xivDiasLaborados = data.xivDiasLaborados ? data.xivDiasLaborados : this.xivDiasLaborados;
        this.xivGenero = data.xivGenero ? data.xivGenero : this.xivGenero;
        this.xivFechaIngreso = data.xivFechaIngreso ? data.xivFechaIngreso : this.xivFechaIngreso;
        this.xivCargo = data.xivCargo ? data.xivCargo : this.xivCargo;
        this.xivTotalIngresos = data.xivTotalIngresos ? data.xivTotalIngresos : this.xivTotalIngresos;
        this.xivDiasLaborados = data.xivDiasLaborados ? data.xivDiasLaborados : this.xivDiasLaborados;
        this.xivValorxivSueldo = data.xivValorxivSueldo ? data.xivValorxivSueldo : this.xivValorxivSueldo;
        this.xivCategoria = data.xivCategoria ? data.xivCategoria : this.xivCategoria;
        this.xivCuenta = data.xivCuenta ? data.xivCuenta : this.xivCuenta;
        this.xivSector = data.xivSector ? data.xivSector : this.xivSector;
        this.estado = data.estado ? data.estado : this.estado;
    }
}