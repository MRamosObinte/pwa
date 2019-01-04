export class ItemRetencionVenta {

   fecha: string = "";
   retencionNumero: string = "";
   retencionAutorizacion: string = "";
   retencionIR: number = 0;
   retencionIVA: number = 0;

   constructor(data?) {
      data ? this.hydrate(data) : null;
   }

   hydrate(data) {
      this.fecha = data.fecha ? data.fecha : this.fecha;
      this.retencionNumero = data.retencionNumero ? data.retencionNumero : this.retencionNumero;
      this.retencionAutorizacion = data.retencionAutorizacion ? data.retencionAutorizacion : this.retencionAutorizacion;
      this.retencionIR = data.retencionIR ? data.retencionIR : this.retencionIR;
      this.retencionIVA = data.retencionIVA ? data.retencionIVA : this.retencionIVA;
   }

}