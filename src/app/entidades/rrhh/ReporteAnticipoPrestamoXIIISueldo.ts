export class ReporteAnticipoPrestamoXIIISueldo {
    comprobante: string = "";
    fecha: string = "";
    cedula: string = "";
    nombres: string = "";
    cargo: string = "";
    nombreSector: string = "";
    valor: number = 0;
    formaPago: string = "";
    referencia: string = "";
    observaciones: string = "";
    sueldo: number = 0;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.comprobante = data.comprobante ? data.comprobante : this.comprobante;
        this.fecha = data.fecha ? data.fecha : this.fecha;
        this.cedula = data.cedula ? data.cedula : this.cedula;
        this.nombres = data.nombres ? data.nombres : this.nombres;
        this.cargo = data.cargo ? data.cargo : this.cargo;
        this.nombreSector = data.nombreSector ? data.nombreSector : this.nombreSector;
        this.valor = data.valor ? data.valor : this.valor;
        this.formaPago = data.formaPago ? data.formaPago : this.formaPago;
        this.referencia = data.referencia ? data.referencia : this.referencia;
        this.observaciones = data.observaciones ? data.observaciones : this.observaciones;
        this.sueldo = data.sueldo ? data.sueldo : this.sueldo;
    }
}