export class RhOrdenBancariaTO {
    empresa: string;
    orden: string;
    banco: string;
    cuentabancaria: string;
    nombreCuenta: string;
    fecha: Date;
    tipoServicio: string;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }
    hydrate(data) {
        this.empresa = data.empresa ? data.empresa : this.empresa;
        this.orden = data.orden ? data.orden : this.orden;
        this.banco = data.banco ? data.banco : this.banco;
        this.cuentabancaria = data.cuentabancaria ? data.cuentabancaria : this.cuentabancaria;
        this.nombreCuenta = data.nombreCuenta ? data.nombreCuenta : this.nombreCuenta;
        this.fecha = data.fecha ? data.fecha : this.fecha;
        this.tipoServicio = data.tipoServicio ? data.tipoServicio : this.tipoServicio;
    }
}