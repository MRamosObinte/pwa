export class RhFunXiiiSueldoCalcularTO {
    public id: number = null;
    public xiiiId: string = null;
    public xiiiNombres: string = null;
    public xiiiGenero: string = null;
    public xiiiFechaIngreso: string = null;
    public xiiiCargo: string = null;
    public xiiiTotalIngresos: number = null;
    public xiiiDiasLaborados: number = null;
    public xiiiValorXiiiSueldo: number = null;
    public xiiiCategoria: string = null;
    public xiiiCuenta: string = null;
    public xiiiSector: string = null;
    public estado: boolean = false;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.id = data.id ? data.id : this.id;
        this.xiiiId = data.xiiiId ? data.xiiiId : this.xiiiId;
        this.xiiiNombres = data.xiiiNombres ? data.xiiiNombres : this.xiiiNombres;
        this.xiiiDiasLaborados = data.xiiiDiasLaborados ? data.xiiiDiasLaborados : this.xiiiDiasLaborados;
        this.xiiiGenero = data.xiiiGenero ? data.xiiiGenero : this.xiiiGenero;
        this.xiiiFechaIngreso = data.xiiiFechaIngreso ? data.xiiiFechaIngreso : this.xiiiFechaIngreso;
        this.xiiiCargo = data.xiiiCargo ? data.xiiiCargo : this.xiiiCargo;
        this.xiiiTotalIngresos = data.xiiiTotalIngresos ? data.xiiiTotalIngresos : this.xiiiTotalIngresos;
        this.xiiiDiasLaborados = data.xiiiDiasLaborados ? data.xiiiDiasLaborados : this.xiiiDiasLaborados;
        this.xiiiValorXiiiSueldo = data.xiiiValorXiiiSueldo ? data.xiiiValorXiiiSueldo : this.xiiiValorXiiiSueldo;
        this.xiiiCategoria = data.xiiiCategoria ? data.xiiiCategoria : this.xiiiCategoria;
        this.xiiiCuenta = data.xiiiCuenta ? data.xiiiCuenta : this.xiiiCuenta;
        this.xiiiSector = data.xiiiSector ? data.xiiiSector : this.xiiiSector;
        this.estado = data.estado ? data.estado : this.estado;
    }
}