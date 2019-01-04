export class CuentasPorCobrarDetalladoTO {

    id:number=0;
    cxcdPeriodo:string="";
    cxcdMotivo:string="";
    cxcdNumero:string="";
    cxcdCliente:string="";
    cxcdFechaEmision:string="";
    cxcdFechaVencimiento:string="";
    cxcdSaldo:number=0;
    cxcdClienteId:string="";
    cxcdClienteRazonSocial:string="";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.id = data.id ? data.id : this.id;
        this.cxcdPeriodo = data.cxcdPeriodo ? data.cxcdPeriodo : this.cxcdPeriodo;
        this.cxcdMotivo = data.cxcdMotivo ? data.cxcdMotivo : this.cxcdMotivo;
        this.cxcdNumero = data.cxcdNumero ? data.cxcdNumero : this.cxcdNumero;
        this.cxcdCliente = data.cxcdCliente ? data.cxcdCliente : this.cxcdCliente;
        this.cxcdFechaEmision = data.cxcdFechaEmision ? data.cxcdFechaEmision : this.cxcdFechaEmision;
        this.cxcdFechaVencimiento = data.cxcdFechaVencimiento ? data.cxcdFechaVencimiento : this.cxcdFechaVencimiento;
        this.cxcdSaldo = data.cxcdSaldo ? data.cxcdSaldo : this.cxcdSaldo;
        this.cxcdClienteId = data.cxcdClienteId ? data.cxcdClienteId : this.cxcdClienteId;
        this.cxcdClienteRazonSocial = data.cxcdClienteRazonSocial ? data.cxcdClienteRazonSocial : this.cxcdClienteRazonSocial;
    }

}
