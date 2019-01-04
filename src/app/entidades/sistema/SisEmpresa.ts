import { SisGrupo } from "./SisGrupo";
import { SisEmpresaParametros } from "./SisEmpresaParametros";
import { SisPermiso } from "./SisPermiso";
import { SisPeriodo } from "./SisPeriodo";

export class SisEmpresa {

    public empCodigo: string = "";
    public empRuc: string = "";
    public empNombre: string = "";
    public empRazonSocial: string = "";
    public empDireccion: string = "";
    public empCiudad: string = "";
    public empTelefono: string = "";
    public empFax: string = "";
    public empEmail: string = "";
    public empClave: string = "";
    public empEmailNotificaciones: string = "";
    public empClaveNotificaciones: string = "";
    public empSmtpHost: string = "";
    public empPais: string = "";
    public empSmtpPort: string = "";
    public empSmtpUserName: string = "";
    public empSmtpPassword: string = "";
    public empActiva: boolean = true;
    public usrCodigo: string = "";
    public usrFechaInsertaEmpresa: Date = new Date();
    public sisGrupoList: Array<SisGrupo> = [];
    public sisEmpresaParametrosList: Array<SisEmpresaParametros> = [];
    public sisPermisoList: Array<SisPermiso> = [];
    public sisPeriodoList: Array<SisPeriodo> = [];

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.empCodigo = data.empCodigo ? data.empCodigo : this.empCodigo;
        this.empRuc = data.empRuc ? data.empRuc : this.empRuc;
        this.empNombre = data.empNombre ? data.empNombre : this.empNombre;
        this.empRazonSocial = data.empRazonSocial ? data.empRazonSocial : this.empRazonSocial;
        this.empDireccion = data.empDireccion ? data.empDireccion : this.empDireccion;
        this.empCiudad = data.empCiudad ? data.empCiudad : this.empCiudad;
        this.empTelefono = data.empTelefono ? data.empTelefono : this.empTelefono;
        this.empFax = data.empFax ? data.empFax : this.empFax;
        this.empEmail = data.empEmail ? data.empEmail : this.empEmail;
        this.empClave = data.empClave ? data.empClave : this.empClave;
        this.empEmailNotificaciones = data.empEmailNotificaciones ? data.empEmailNotificaciones : this.empEmailNotificaciones;
        this.empClaveNotificaciones = data.empClaveNotificaciones ? data.empClaveNotificaciones : this.empClaveNotificaciones;
        this.empSmtpHost = data.empSmtpHost ? data.empSmtpHost : this.empSmtpHost;
        this.empSmtpUserName = data.empSmtpUserName ? data.empSmtpUserName : this.empSmtpUserName;
        this.empSmtpPassword = data.empSmtpPassword ? data.empSmtpPassword : this.empSmtpPassword;
        this.empActiva = data.empActiva ? data.empActiva : this.empActiva;
        this.usrCodigo = data.usrCodigo ? data.usrCodigo : this.usrCodigo;
        this.usrFechaInsertaEmpresa = data.usrFechaInsertaEmpresa ? data.usrFechaInsertaEmpresa : this.usrFechaInsertaEmpresa;
        this.sisGrupoList = data.sisGrupoList ? data.sisGrupoList : this.sisGrupoList;
        this.sisEmpresaParametrosList = data.sisEmpresaParametrosList ? data.sisEmpresaParametrosList : this.sisEmpresaParametrosList;
        this.sisPermisoList = data.sisPermisoList ? data.sisPermisoList : this.sisPermisoList;
        this.sisPeriodoList = data.sisPeriodoList ? data.sisPeriodoList : this.sisPeriodoList;
        this.empPais = data.empPais ? data.empPais : this.empPais;
    }
}