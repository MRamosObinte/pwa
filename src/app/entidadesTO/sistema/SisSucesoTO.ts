export class SisSucesoTO {

   susSecuencia: number = 0;
   susTabla: string = "";
   susClave: string = "";
   susSuceso: string = "";
   susDetalle: string = "";
   sus_mac: string = "";
   usrEmpresa: string = "";
   usrCodigo: string = "";
   susFecha: string = "";

   constructor(data?) {
       data ? this.hydrate(data) : null;
   }

   hydrate(data) {
       this.susSecuencia = data.susSecuencia ? data.susSecuencia : this.susSecuencia;
       this.susTabla = data.susTabla ? data.susTabla : this.susTabla;
       this.susClave = data.susClave ? data.susClave : this.susClave;
       this.susSuceso = data.susSuceso ? data.susSuceso : this.susSuceso;
       this.susDetalle = data.susDetalle ? data.susDetalle : this.susDetalle;
       this.sus_mac = data.sus_mac ? data.sus_mac : this.sus_mac;
       this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
       this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
       this.susFecha = data.susFecha ? data.susFecha : this.susFecha;
   }

}