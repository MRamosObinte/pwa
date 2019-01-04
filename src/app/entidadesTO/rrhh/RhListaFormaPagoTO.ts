export class RhListaFormaPagoTO {
   ctaCodigo: string = null;
   fpDetalle: string = null;
   secCodigo: string = null;
   fpSecuencial: number = 0;
   fpInactivo: boolean = false;

   constructor(data?) {
      data ? this.hydrate(data) : null;
   }

   hydrate(data) {
      this.ctaCodigo = data.ctaCodigo ? data.ctaCodigo : this.ctaCodigo;
      this.fpDetalle = data.fpDetalle ? data.fpDetalle : this.fpDetalle;
      this.secCodigo = data.secCodigo ? data.secCodigo : this.secCodigo;
      this.fpSecuencial = data.fpSecuencial ? data.fpSecuencial : this.fpSecuencial;
      this.fpInactivo = data.fpInactivo ? data.fpInactivo : this.fpInactivo;
   }
}