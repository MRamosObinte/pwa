export class InvTransferenciasTO {

    public transEmpresa:string = null
    public transPeriodo: string = null;
    public transMotivo: string = null;
    public transNumero: string = null;
   

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.transEmpresa = data.transEmpresa ? data.transEmpresa : this.transEmpresa;
        this.transPeriodo = data.transPeriodo ? data.transPeriodo : this.transPeriodo;
        this.transMotivo = data.transMotivo ? data.transMotivo : this.transMotivo;
        this.transNumero = data.transNumero ? data.transNumero : this.transNumero;
    }
}