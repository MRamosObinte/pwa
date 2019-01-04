export class RhComboFormaPagoTO {
   fpDetalle: string = null;
   ctaCodigo: string = null;
   validar: boolean = false;

   constructor(data?) {
      data ? this.hydrate(data) : null;
   }

   hydrate(data) {
      this.fpDetalle = data.fpDetalle ? data.fpDetalle : this.fpDetalle;
      this.ctaCodigo = data.ctaCodigo ? data.ctaCodigo : this.ctaCodigo;
      this.validar = data.validar ? data.validar : this.validar;
   }
}