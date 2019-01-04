export class SisListaSusTablaTO {

   susTabla: string = "";

   constructor(data?) {
       data ? this.hydrate(data) : null;
   }

   hydrate(data) {
       this.susTabla = data.susTabla ? data.susTabla : this.susTabla;
   }

}