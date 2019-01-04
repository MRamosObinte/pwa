import { InvClienteGrupoEmpresarialPK } from "./InvClienteGrupoEmpresarialPK";

export class InvClienteGrupoEmpresarial {
    public invClienteGrupoEmpresarialPK: InvClienteGrupoEmpresarialPK = new InvClienteGrupoEmpresarialPK();
    public geNombre: string = "";
    public usrCodigo: string = "";
    public usrFechaInserta: Date = new Date();
    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.invClienteGrupoEmpresarialPK = data.invClienteGrupoEmpresarialPK ? data.invClienteGrupoEmpresarialPK : this.invClienteGrupoEmpresarialPK;
        this.geNombre = data.geNombre ? data.geNombre : this.geNombre;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
    }

}
