export class AnexoTalonResumenComprasTO{

    retConcepto: string = "";
    retCantidad: number = 0;
    ret_baseimponible: number = 0;
    ret_porcentaje: number = 0;
    ret_valorretenido: number = 0;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.retConcepto = data.retConcepto ? data.retConcepto : this.retConcepto;
        this.retCantidad = data.retCantidad ? data.retCantidad : this.retCantidad;
        this.ret_baseimponible = data.ret_baseimponible ? data.ret_baseimponible : this.ret_baseimponible;
        this.ret_porcentaje = data.ret_porcentaje ? data.ret_porcentaje : this.ret_porcentaje;
        this.ret_valorretenido = data.ret_valorretenido ? data.ret_valorretenido : this.ret_valorretenido;
    }
}