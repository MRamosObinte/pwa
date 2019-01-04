import { SisUsuarioDetalle } from "./SisUsuarioDetalle";

export class SisSuceso {
    susSecuencia: number = 0;
    susTabla: string = "";
    susClave: string = "";
    susSuceso: string = "";
    susDetalle: string = "";
    susMac: string = "";
    susFecha: Date = new Date();
    sisUsuarioDetalle: SisUsuarioDetalle = new SisUsuarioDetalle();

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.susSecuencia = data.susSecuencia ? data.susSecuencia : this.susSecuencia;
        this.susTabla = data.susTabla ? data.susTabla : this.susTabla;
        this.susClave = data.susClave ? data.susClave : this.susClave;
        this.susSuceso = data.susSuceso ? data.susSuceso : this.susSuceso;
        this.susDetalle = data.susDetalle ? data.susDetalle : this.susDetalle;
        this.susMac = data.susMac ? data.susMac : this.susMac;
        this.susFecha = data.susFecha ? data.susFecha : this.susFecha;
        this.sisUsuarioDetalle = data.sisUsuarioDetalle ? new SisUsuarioDetalle(data.sisUsuarioDetalle) : this.sisUsuarioDetalle;
    }

}