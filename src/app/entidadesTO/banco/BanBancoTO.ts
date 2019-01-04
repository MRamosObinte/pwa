

export class BanBancoTO {
    empCodigo: string = "";
    banCodigo: string = "";
    banNombre: string = "";
    usrInsertaBanco: string = "";
    usrFechaInsertaBanco: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.empCodigo = data.empCodigo ? data.empCodigo : this.empCodigo;
        this.banCodigo = data.banCodigo ? data.banCodigo : this.banCodigo;
        this.banNombre = data.banNombre ? data.banNombre : this.banNombre;
        this.usrInsertaBanco = data.usrInsertaBanco ? data.usrInsertaBanco : this.usrInsertaBanco;
        this.usrFechaInsertaBanco = data.usrFechaInsertaBanco ? data.usrFechaInsertaBanco : this.usrFechaInsertaBanco;
    }
}