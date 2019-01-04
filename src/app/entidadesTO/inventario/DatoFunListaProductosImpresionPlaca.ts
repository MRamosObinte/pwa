export class DatoFunListaProductosImpresionPlaca {
    public lpspCodigoPrincipal: string = "";
    public lpspCodigoBarra: string = "";
    public lpspNombre: string = "";
    public proEmpaque: string = "";
    public lpspPrecio1: number = 0;
    public lpspPrecio2: number = 0;
    public lpspPrecio3: number = 0;
    public estado: boolean = true;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.lpspCodigoPrincipal = data.lpspCodigoPrincipal ? data.lpspCodigoPrincipal : this.lpspCodigoPrincipal;
        this.lpspCodigoBarra = data.lpspCodigoBarra ? data.lpspCodigoBarra : this.lpspCodigoBarra;
        this.lpspNombre = data.lpspNombre ? data.lpspNombre : this.lpspNombre;
        this.proEmpaque = data.proEmpaque ? data.proEmpaque : this.proEmpaque;
        this.lpspPrecio1 = data.lpspPrecio1 ? data.lpspPrecio1 : this.lpspPrecio1;
        this.lpspPrecio2 = data.lpspPrecio2 ? data.lpspPrecio2 : this.lpspPrecio2;
        this.lpspPrecio3 = data.lpspPrecio3 ? data.lpspPrecio3 : this.lpspPrecio3;
        this.estado = data.estado ? data.estado : this.estado;
    }

}