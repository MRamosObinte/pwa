import { SisGrupoTO } from "../sistema/SisGrupoTO";
import { SisEmpresa } from "../../entidades/sistema/SisEmpresa";
import { SisEmpresaParametros } from "../../entidades/sistema/SisEmpresaParametros";

export class PermisosEmpresaMenuTO extends SisEmpresa {
    listaSisPermisoTO: SisGrupoTO = new SisGrupoTO();
    parametros: Array<SisEmpresaParametros> = new Array();

    constructor(data?) {
        super(data);
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.listaSisPermisoTO = data.sisGrupoTO ? new SisGrupoTO(data.listaSisPermisoTO) : this.listaSisPermisoTO;
        this.parametros = data.parametros ? data.parametros : this.parametros;
    }

}
