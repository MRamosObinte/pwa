export class InvVentasFormaCobro {

   fcSecuencial: number = null;
   fcDetalle: string = "";
   fcTipoPrincipal: string = "";
   fcInactivo: boolean = false;
   secEmpresa: string = "";
   secCodigo: string = "";
   ctaEmpresa: string = "";
   ctaCodigo: string = "";
   usrEmpresa: string = "";
   usrCodigo: string = "";
   usrFechaInserta: Date = new Date();

   constructor(data?) {
      data ? this.hydrate(data) : null;
   }

   hydrate(data?) {
      this.fcSecuencial = data.fcSecuencial ? data.fcSecuencial : this.fcSecuencial;
      this.fcDetalle = data.fcDetalle ? data.fcDetalle : this.fcDetalle;
      this.fcTipoPrincipal = data.fcTipoPrincipal ? data.fcTipoPrincipal : this.fcTipoPrincipal;
      this.fcInactivo = data.fcInactivo ? data.fcInactivo : this.fcInactivo;
      this.secEmpresa = data.secEmpresa ? data.secEmpresa : this.secEmpresa;
      this.secCodigo = data.secCodigo ? data.secCodigo : this.secCodigo;
      this.ctaEmpresa = data.ctaEmpresa ? data.ctaEmpresa : this.ctaEmpresa;
      this.ctaCodigo = data.ctaCodigo ? data.ctaCodigo : this.ctaCodigo;
      this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
      this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
      this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
   }

}