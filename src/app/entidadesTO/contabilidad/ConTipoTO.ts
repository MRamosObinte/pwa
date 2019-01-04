
export class ConTipoTO {
    public tipCodigo: string = null;
    public tipDetalle: string = null;
    public tipInactivo: boolean = false;
    public empCodigo: string = null;
    public usrInsertaTipo: string = null;
    public fechaInsertaTipo: string = null;
    public tipModulo: string = null;
    public tipTipoPrincipal: string = null;
    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.tipCodigo = data ? data.tipCodigo : this.tipCodigo;
        this.tipDetalle = data ? data.tipDetalle : this.tipDetalle;
        this.tipInactivo = data ? data.tipInactivo : this.tipInactivo;
        this.empCodigo = data ? data.empCodigo : this.empCodigo;
        this.usrInsertaTipo = data ? data.usrInsertaTipo : this.usrInsertaTipo;
        this.fechaInsertaTipo = data ? data.fechaInsertaTipo : this.fechaInsertaTipo;
        this.tipModulo = data ? data.tipModulo : this.tipModulo;
        this.tipTipoPrincipal = data ? data.tipTipoPrincipal : this.tipTipoPrincipal;
    }
}