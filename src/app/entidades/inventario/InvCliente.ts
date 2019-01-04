import { InvClientePK } from "./InvClientePK";
import { InvVendedor } from "./InvVendedor";
import { InvClienteCategoria } from "./InvClienteCategoria";
import { InvProformas } from "./InvProformas";
import { InvVentas } from "./InvVentas";
import { InvClienteDetalleVentaAutomatica } from "./InvClienteDetalleVentaAutomatica";
import { InvClienteGrupoEmpresarial } from "./InvClienteGrupoEmpresarial";

export class InvCliente {
    invClientePK: InvClientePK = new InvClientePK();
    cliIdTipo: CharacterData = null;
    cliIdNumero: string = null;
    cliExtranjeroTipo: string = null;
    cliNombreComercial: string = null;
    cliRazonSocial: string = null;
    cliProvincia: string = null;
    cliCiudad: string = null;
    cliParroquia: string = null;
    cliZona: string = null;
    cliDireccion: string = null;
    cliTelefono: string = null;
    cliCelular: string = null;
    cliEmail: string = null;
    cliPrecio: number = 0;
    cliDiasCredito: number = 0;
    cliCupoCredito: number = 0;
    cliObservaciones: number = 0;
    cliRelacionado: boolean = false;
    cliInactivo: boolean = false;
    usrEmpresa: string = null;
    usrCodigo: string = null;
    usrFechaInserta: Date = null;
    cliLugaresEntrega: string = null;
    invVendedor: InvVendedor = new InvVendedor();
    invClienteCategoria: InvClienteCategoria = new InvClienteCategoria();
    invProformasList: InvProformas[] = [];
    invVentasList: InvVentas[] = [];
    invClienteDetalleVentaAutomaticaList: InvClienteDetalleVentaAutomatica[] = [];
    invClienteGrupoEmpresarial: InvClienteGrupoEmpresarial = new InvClienteGrupoEmpresarial();

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.invClientePK = data.invClientePK ? data.invClientePK : this.invClientePK;
        this.cliIdTipo = data.cliIdTipo ? data.cliIdTipo : this.cliIdTipo;
        this.cliIdNumero = data.cliIdNumero ? data.cliIdNumero : this.cliIdNumero;
        this.cliExtranjeroTipo = data.cliExtranjeroTipo ? data.cliExtranjeroTipo : this.cliExtranjeroTipo;
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
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
        this.invVendedor = data.invVendedor ? data.invVendedor : this.invVendedor;
        this.invClienteCategoria = data.invClienteCategoria ? data.invVendedor : this.invClienteCategoria;
        this.invProformasList = data.invProformasList ? data.invProformasList : this.invProformasList;
        this.invVentasList = data.invVentasList ? data.invVentasList : this.invVentasList;
        this.invClienteDetalleVentaAutomaticaList = data.invClienteDetalleVentaAutomaticaList ? data.invClienteDetalleVentaAutomaticaList : this.invClienteDetalleVentaAutomaticaList;
        this.invClienteGrupoEmpresarial = data.invClienteGrupoEmpresarial ? data.invClienteGrupoEmpresarial : this.invClienteGrupoEmpresarial;
    }

}