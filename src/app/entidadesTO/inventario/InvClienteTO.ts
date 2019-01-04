export class InvClienteTO {
    empCodigo: string = "";
    cliCodigo: string = "";
    cliTipoId: string = "";
    cliExtranjeroTipo: string = null;
    cliId: string = "";
    cliNombreComercial: string = "";
    cliRazonSocial: string = "";
    cliProvincia: string = "";
    cliCiudad: string = "";
    cliParroquia: string = "";
    cliZona: string = "";
    cliDireccion: string = "";
    cliTelefono: string = "";
    cliCelular: string = "";
    cliEmail: string = "";
    cliPrecio: number = 0;
    cliDiasCredito: number = 0;
    cliCupoCredito: number = 0;
    cliObservaciones: string = "";
    cliRelacionado: boolean = false;
    cliInactivo: boolean = false;
    vendEmpresa: string = "";
    vendCodigo: string = "";
    cliCategoria: string = "";
    usrInsertaCliente: string = "";
    usrFechaInsertaCliente: string = "";
    geEmpresa: string = "";
    geCodigo: string = "";
    cliLugaresEntrega: string = null;

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.empCodigo = data.empCodigo ? data.empCodigo : this.empCodigo;
        this.cliCodigo = data.cliCodigo ? data.cliCodigo : this.cliCodigo;
        this.cliTipoId = data.cliTipoId ? data.cliTipoId : this.cliTipoId;
        this.cliExtranjeroTipo = data.cliExtranjeroTipo ? data.cliExtranjeroTipo : this.cliExtranjeroTipo;
        this.cliId = data.cliId ? data.cliId : this.cliId;
        this.cliNombreComercial = data.cliNombreComercial ? data.cliNombreComercial : this.cliNombreComercial;
        this.cliRazonSocial = data.cliRazonSocial ? data.cliRazonSocial : this.cliRazonSocial;
        this.cliProvincia = data.cliProvincia ? data.cliProvincia : this.cliProvincia;
        this.cliCiudad = data.cliCiudad ? data.cliCiudad : this.cliCiudad;
        this.cliParroquia = data.cliParroquia ? data.cliParroquia : this.cliParroquia;
        this.cliZona = data.cliZona ? data.cliZona : this.cliZona;
        this.cliDireccion = data.cliDireccion ? data.cliDireccion : this.cliDireccion;
        this.cliTelefono = data.cliTelefono ? data.cliTelefono : this.cliTelefono;
        this.cliCelular = data.cliCelular ? data.cliCelular : this.cliCelular;
        this.cliEmail = data.cliEmail ? data.cliEmail : this.cliEmail;
        this.cliPrecio = data.cliPrecio ? data.cliPrecio : this.cliPrecio;
        this.cliDiasCredito = data.cliDiasCredito ? data.cliDiasCredito : this.cliDiasCredito;
        this.cliCupoCredito = data.cliCupoCredito ? data.cliCupoCredito : this.cliCupoCredito;
        this.cliObservaciones = data.cliObservaciones ? data.cliObservaciones : this.cliObservaciones;
        this.cliRelacionado = data.cliRelacionado ? data.cliRelacionado : this.cliRelacionado;
        this.cliInactivo = data.cliInactivo ? data.cliInactivo : this.cliInactivo;
        this.vendEmpresa = data.vendEmpresa ? data.vendEmpresa : this.vendEmpresa;
        this.vendCodigo = data.vendCodigo ? data.vendCodigo : this.vendCodigo;
        this.cliCategoria = data.cliCategoria ? data.cliCategoria : this.cliCategoria;
        this.usrInsertaCliente = data.usrInsertaCliente ? data.usrInsertaCliente : this.usrInsertaCliente;
        this.usrFechaInsertaCliente = data.usrFechaInsertaCliente ? data.usrFechaInsertaCliente : this.usrFechaInsertaCliente;
        this.geEmpresa = data.geEmpresa ? data.geEmpresa : this.geEmpresa;
        this.geCodigo = data.geCodigo ? data.geCodigo : this.geCodigo;
        this.cliLugaresEntrega = data.cliLugaresEntrega ? data.cliLugaresEntrega : this.cliLugaresEntrega;
    }

}