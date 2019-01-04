export class RhDetalleVacionesPagadasGozadasTO {
   id: number = 0;
   vacId: string = "";
   vacApellidosNombres: string = "";
   vacValor: number = 0;
   vacDesde: string = "";
   vacHasta: string = "";
   vacGozadasDesde: string = "";
   vacGozadasHasta: string = "";
   vacObservaciones: string = "";
   vacContables: string = "";

   constructor(data?) {
      data ? this.hydrate(data) : null;
   }

   hydrate(data) {
      this.id = data.id ? data.id : this.id;
      this.vacId = data.vacId ? data.vacId : this.vacId;
      this.vacApellidosNombres = data.vacApellidosNombres ? data.vacApellidosNombres : this.vacApellidosNombres;
      this.vacValor = data.vacValor ? data.vacValor : this.vacValor;
      this.vacDesde = data.vacDesde ? data.vacDesde : this.vacDesde;
      this.vacHasta = data.vacHasta ? data.vacHasta : this.vacHasta;
      this.vacGozadasDesde = data.vacGozadasDesde ? data.vacGozadasDesde : this.vacGozadasDesde;
      this.vacGozadasHasta = data.vacGozadasHasta ? data.vacGozadasHasta : this.vacGozadasHasta;
      this.vacObservaciones = data.vacObservaciones ? data.vacObservaciones : this.vacObservaciones;
      this.vacContables = data.vacContables ? data.vacContables : this.vacContables;
   }

}