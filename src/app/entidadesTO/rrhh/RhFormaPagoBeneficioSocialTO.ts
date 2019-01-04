export class RhFormaPagoBeneficioSocialTO {
   ctaCodigo: string = "";
   fpDetalle: string = "";
   secCodigo: string = "";
   fpCodigoMinisterial: string = "";
   fpSecuencial: number = 0;
   fpInactivo: boolean = false;

   usrEmpresa: string = "";
   usrCodigo: string = "";
   usrFechaInserta: string = "";

   constructor(data?) {
      data ? this.hydrate(data) : null;
   }

   hydrate(data) {
      this.ctaCodigo = data.ctaCodigo ? data.ctaCodigo : this.ctaCodigo;
      this.fpDetalle = data.fpDetalle ? data.fpDetalle : this.fpDetalle;
      this.secCodigo = data.secCodigo ? data.secCodigo : this.secCodigo;
      this.fpCodigoMinisterial = data.fpCodigoMinisterial ? data.fpCodigoMinisterial : this.fpCodigoMinisterial;
      this.fpSecuencial = data.fpSecuencial ? data.fpSecuencial : this.fpSecuencial;
      this.fpInactivo = data.fpInactivo ? data.fpInactivo : this.fpInactivo;
      this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
      this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
      this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
   }
}