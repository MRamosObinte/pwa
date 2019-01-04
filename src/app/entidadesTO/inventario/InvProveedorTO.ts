export class InvProveedorTO {
    public provCodigo: string = null;
    public empCodigo: string = null;
    public provTipoId: string = null;
    public provId: string = null;
    public provNombreComercial: string = null;
    public provRazonSocial: string = null;
    public provProvincia: string = null;
    public provCiudad: string = null;
    public provParroquia: string = null;
    public provZona: string = null;
    public provDireccion: string = null;
    public provTelefono: string = null;
    public provCelular: string = null;
    public provEmail: string = null;
    public provEmailOrdenCompra: string = null;
    public provObservaciones: string = null;
    public provRelacionado: boolean = false;
    public provInactivo: boolean = false;
    public provEmpresa: string = null;
    public provCategoria: string = null;
    public usrInsertaProveedor: string = null;
    public usrFechaInsertaProveedor: string = null;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.provCodigo = data.provCodigo ? data.provCodigo : this.provCodigo;
        this.empCodigo = data.empCodigo ? data.empCodigo : this.empCodigo;
        this.provTipoId = data.provTipoId ? data.provTipoId : this.provTipoId;
        this.provId = data.provId ? data.provId : this.provId;
        this.provNombreComercial = data.provNombreComercial ? data.provNombreComercial : this.provNombreComercial;
        this.provRazonSocial = data.provRazonSocial ? data.provRazonSocial : this.provRazonSocial;
        this.provProvincia = data.provProvincia ? data.provProvincia : this.provProvincia;
        this.provCiudad = data.provCiudad ? data.provCiudad : this.provCiudad;
        this.provParroquia = data.provParroquia ? data.provParroquia : this.provParroquia;
        this.provZona = data.provZona ? data.provZona : this.provZona;
        this.provDireccion = data.provDireccion ? data.provDireccion : this.provDireccion;
        this.provTelefono = data.provTelefono ? data.provTelefono : this.provTelefono;
        this.provCelular = data.provCelular ? data.provCelular : this.provCelular;
        this.provEmail = data.provEmail ? data.provEmail : this.provEmail;
        this.provEmailOrdenCompra = data.provEmailOrdenCompra ? data.provEmailOrdenCompra : this.provEmailOrdenCompra;
        this.provObservaciones = data.provObservaciones ? data.provObservaciones : this.provObservaciones;
        this.provRelacionado = data.provRelacionado ? data.provRelacionado : this.provRelacionado;
        this.provInactivo = data.provInactivo ? data.provInactivo : this.provInactivo;
        this.provEmpresa = data.provEmpresa ? data.provEmpresa : this.provEmpresa;
        this.provCategoria = data.provCategoria ? data.provCategoria : this.provCategoria;
        this.usrInsertaProveedor = data.usrInsertaProveedor ? data.usrInsertaProveedor : this.usrInsertaProveedor;
        this.usrFechaInsertaProveedor = data.usrFechaInsertaProveedor ? data.usrFechaInsertaProveedor : this.usrFechaInsertaProveedor;
    }
}