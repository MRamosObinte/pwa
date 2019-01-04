import { SisPermisoPK } from "./SisPermisoPK";
import { SisEmpresa } from "./SisEmpresa";

export class SisPermiso {

    sisPermisoPK: SisPermisoPK = new SisPermisoPK();
    perItemEtiqueta: string = "";
    perURL: string = "";
    perIcono: string = "";
    perSecuencia: number = 0;
    perUsuarios: string = "";
    empCodigo: SisEmpresa = new SisEmpresa();

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.sisPermisoPK = data.sisPermisoPK ? new SisPermisoPK(data.sisPermisoPK) : this.sisPermisoPK;
        this.perItemEtiqueta = data.perItemEtiqueta ? data.perItemEtiqueta : this.perItemEtiqueta;
        this.perURL = data.perURL ? data.perURL : this.perURL;
        this.perIcono = data.perIcono ? data.perIcono : this.perIcono;
        this.perSecuencia = data.perSecuencia ? data.perSecuencia : this.perSecuencia;
        this.perUsuarios = data.perUsuarios ? data.perUsuarios : this.perUsuarios;
        this.empCodigo = data.empCodigo ? new SisEmpresa(data.empCodigo) : this.empCodigo;
    }

}