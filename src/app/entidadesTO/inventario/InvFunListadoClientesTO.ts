export class InvFunListadoClientesTO {

    id: number = 0;
    cliCodigo: string = "";
    cliTipoId: string = "";
    cliId: string = "";
    cliNombre: string = "";
    cliRazonSocial: string = "";
    cliCategoria: string = "";
    cliProvincia: string = "";
    cliCiudad: string = "";
    cliZona: string = "";
    cliDireccion: string = "";
    cliTelefono: string = "";
    cliCelular: string = "";
    cliEmail: string = "";
    cliObservaciones: string = "";
    cliInactivo: boolean = false;
    cliDiasCredito: number = null;
    cliLugaresEntrega: string = null;
    cliGrupoEmpresarialNombre: string = null;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.id = data.id ? data.id : this.id;
        this.cliCodigo = data.cliCodigo ? data.cliCodigo : this.cliCodigo;
        this.cliTipoId = data.cliTipoId ? data.cliTipoId : this.cliTipoId;
        this.cliId = data.cliId ? data.cliId : this.cliId;
        this.cliNombre = data.cliNombre ? data.cliNombre : this.cliNombre;
        this.cliRazonSocial = data.cliRazonSocial ? data.cliRazonSocial : this.cliRazonSocial;
        this.cliCategoria = data.cliCategoria ? data.cliCategoria : this.cliCategoria;
        this.cliProvincia = data.cliProvincia ? data.cliProvincia : this.cliProvincia;
        this.cliCiudad = data.cliCiudad ? data.cliCiudad : this.cliCiudad;
        this.cliZona = data.cliZona ? data.cliZona : this.cliZona;
        this.cliDireccion = data.cliDireccion ? data.cliDireccion : this.cliDireccion;
        this.cliTelefono = data.cliTelefono ? data.cliTelefono : this.cliTelefono;
        this.cliCelular = data.cliCelular ? data.cliCelular : this.cliCelular;
        this.cliEmail = data.cliEmail ? data.cliEmail : this.cliEmail;
        this.cliObservaciones = data.cliObservaciones ? data.cliObservaciones : this.cliObservaciones;
        this.cliInactivo = data.cliInactivo ? data.cliInactivo : this.cliInactivo;
        this.cliDiasCredito = data.cliDiasCredito ? data.cliDiasCredito : this.cliDiasCredito;
        this.cliLugaresEntrega = data.cliLugaresEntrega ? data.cliLugaresEntrega : this.cliLugaresEntrega;
        this.cliGrupoEmpresarialNombre = data.cliGrupoEmpresarialNombre ? data.cliGrupoEmpresarialNombre : this.cliGrupoEmpresarialNombre;
    }
}