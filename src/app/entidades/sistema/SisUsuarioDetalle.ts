import { SisUsuarioDetallePK } from "./SisUsuarioDetallePK";
import { SisSuceso } from "./SisSuceso";
import { SisUsuario } from "./SisUsuario";
import { SisGrupo } from "./SisGrupo";

export class SisUsuarioDetalle {

    sisUsuarioDetallePK: SisUsuarioDetallePK = new SisUsuarioDetallePK();
    detEquipo: string = "";
    detActivo: boolean = true;
    usrFechaInsertaUsuario: Date = new Date();
    sisSucesoList: Array<SisSuceso> = [];
    sisUsuario: SisUsuario = new SisUsuario();
    sisGrupo: SisGrupo = new SisGrupo();

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }
    
    hydrate(data) {

    }
}