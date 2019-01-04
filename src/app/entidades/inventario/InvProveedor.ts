
import { InvProveedorPK } from "./InvProveedorPK";
import { InvCompras } from "./InvCompras";
import { InvProveedorCategoria } from "./InvProveedorCategoria";

export class InvProveedor {

    provEmailOrdenCompra: string = "";
    provIdTipo: string = "";
    provRelacionado: boolean = false;
    provInactivo: boolean = false;
    invProveedorPK: InvProveedorPK = new InvProveedorPK();
    provIdNumero: string = "";
    provRazonSocial: string = "";//antes se llamaba nombre
    provNombreComercial: string = "";//antes era razon social
    provProvincia: string = "";
    provCiudad: string = "";
    provParroquia: string = "";
    provZona: string = "";
    provDireccion: string = "";
    provTelefono: string = "";
    provCelular: string = "";
    provEmail: string = "";
    provObservaciones: string = "";
    usrEmpresa: string = "";
    usrCodigo: string = "";
    usrFechaInserta: Date = null;
    invComprasList: Array<InvCompras> = new Array();
    invProveedorCategoria: InvProveedorCategoria = new InvProveedorCategoria();

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.provEmailOrdenCompra = data.provEmailOrdenCompra ? data.provEmailOrdenCompra : this.provEmailOrdenCompra;
        this.provIdTipo = data.provIdTipo ? data.provIdTipo : this.provIdTipo;
        this.provRelacionado = data.provRelacionado ? data.provRelacionado : this.provRelacionado;
        this.provInactivo = data.provInactivo ? data.provInactivo : this.provInactivo;
        this.invProveedorPK = data.invProveedorPK ? data.invProveedorPK : this.invProveedorPK;
        this.provIdNumero = data.provIdNumero ? data.provIdNumero : this.provIdNumero;
        this.provRazonSocial = data.provRazonSocial ? data.provRazonSocial : this.provRazonSocial;
        this.provNombreComercial = data.provNombreComercial ? data.provNombreComercial : this.provNombreComercial;
        this.provProvincia = data.provProvincia ? data.provProvincia : this.provProvincia;
        this.provCiudad = data.provCiudad ? data.provCiudad : this.provCiudad;
        this.provParroquia = data.provParroquia ? data.provParroquia : this.provParroquia;
        this.provZona = data.provZona ? data.provZona : this.provZona;
        this.provDireccion = data.provDireccion ? data.provDireccion : this.provDireccion;
        this.provTelefono = data.provTelefono ? data.provTelefono : this.provTelefono;
        this.provCelular = data.provCelular ? data.provCelular : this.provCelular;
        this.provEmail = data.provEmail ? data.provEmail : this.provEmail;
        this.provObservaciones = data.provObservaciones ? data.provObservaciones : this.provObservaciones;
        this.usrEmpresa = data.usrEmpresa ? data.usrEmpresa : this.usrEmpresa;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInserta = data.usrFechaInserta ? data.usrFechaInserta : this.usrFechaInserta;
        this.invComprasList = data.invComprasList ? data.invComprasList : this.invComprasList;
        this.invProveedorCategoria = data.invProveedorCategoria ? data.invProveedorCategoria : this.invProveedorCategoria;
    }
}