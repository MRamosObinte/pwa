
export class RhListaEmpleadoLoteTO {
    id: number = null;
    prEmpresa: string = null;
    prCategoria: string = null;
    prSector: string = null;
    prId: string = null;
    prNombres: string = null;
    prCargo: string = null;
    prSueldo: number = 0;
    prSaldoAnterior: number = 0;
    prSaldoAnticipos: number = 0;
    prSaldoBonos: number = 0;
    prSaldoPrestamos: number = 0;
    prSaldoCuotas: number = 0;
    prFechaIngreso: Date;
    prFechaUltimoSueldo: Date;
    prValor: number = 0;
    prAfiliado: boolean = false;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.id = data.id ? data.id : this.id;
        this.prEmpresa = data.prEmpresa ? data.prEmpresa : this.prEmpresa;
        this.prCategoria = data.prCategoria ? data.prCategoria : this.prCategoria;
        this.prSector = data.prSector ? data.prSector : this.prSector;
        this.prId = data.prId ? data.prId : this.prId;
        this.prNombres = data.prNombres ? data.prNombres : this.prNombres;
        this.prCargo = data.prCargo ? data.prCargo : this.prCargo;
        this.prSueldo = data.prSueldo ? data.prSueldo : this.prSueldo;
        this.prSaldoAnterior = data.prSaldoAnterior ? data.prSaldoAnterior : this.prSaldoAnterior;
        this.prSaldoAnticipos = data.prSaldoAnticipos ? data.prSaldoAnticipos : this.prSaldoAnticipos;
        this.prSaldoBonos = data.prSaldoBonos ? data.prSaldoBonos : this.prSaldoBonos;
        this.prSaldoPrestamos = data.prSaldoPrestamos ? data.prSaldoPrestamos : this.prSaldoPrestamos;
        this.prSaldoCuotas = data.prSaldoCuotas ? data.prSaldoCuotas : this.prSaldoCuotas;
        this.prFechaIngreso = data.prFechaIngreso ? data.prFechaIngreso : this.prFechaIngreso;
        this.prFechaUltimoSueldo = data.prFechaUltimoSueldo ? data.prFechaUltimoSueldo : this.prFechaUltimoSueldo;
        this.prValor = data.prValor ? data.prValor : this.prValor;
        this.prAfiliado = data.prAfiliado ? data.prAfiliado : this.prAfiliado;
    }
}