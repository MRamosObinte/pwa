import { Component, OnInit, Input, Output, EventEmitter, ViewChild, HostListener } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { LS } from '../../../../constantes/app-constants';
import { NgForm } from '@angular/forms';
import { EmpleadosService } from '../../archivo/empleados/empleados.service';
import { AnxProvinciaCantonTO } from '../../../../entidadesTO/anexos/AnxProvinciaCantonTO';
import { ClaveValor } from '../../../../enums/ClaveValor';
import { ListaBanBancoTO } from '../../../../entidadesTO/banco/ListaBanBancoTO';
import { AnxPaisTO } from '../../../../entidadesTO/anexos/AnxPaisTO';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import * as moment from 'moment';
import { RhEmpleado } from '../../../../entidades/rrhh/RhEmpleado';
import { RhCategoria } from '../../../../entidades/rrhh/RhCategoria';
import { AppAutonumeric } from '../../../../directivas/autonumeric/AppAutonumeric';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { CantonService } from '../../../anexos/archivo/canton/canton.service';
import { PrdSector } from '../../../../entidades/produccion/PrdSector';
import { RhEmpleadoDescuentosFijos } from '../../../../entidades/rrhh/RhEmpleadoDescuentosFijos';
import { RhAnticipoMotivo } from '../../../../entidades/rrhh/RhAnticipoMotivo';
import { RhParametros } from '../../../../entidades/rrhh/RhParametros';
import { GridApi } from 'ag-grid';

@Component({
  selector: 'app-empleados-formulario',
  templateUrl: './empleados-formulario.component.html'
})
export class EmpleadosFormularioComponent implements OnInit {

  @Input() empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  @Input() parametrosFormulario: any;
  @Input() data: any;
  @Output() enviarAccion = new EventEmitter();

  public rptaCedula: string = null;
  public rptaRepetido: string = null;
  public fechaNacimientoValido: boolean = true;
  public cargaFamiliarValida: boolean = true;
  public sueldoValido: boolean = true;
  public archivoPerfilByte: any = null;
  visualizarImagen: boolean = false;

  public paisLocal: AnxPaisTO = new AnxPaisTO();
  public tipoIdentidadLocal: ClaveValor = new ClaveValor();

  public constantes: any = LS;
  public accion: string = null;
  public innerWidth: number;
  public isScreamMd: boolean = true;
  public cargando: boolean = false;
  public activar: boolean = false;
  public es: any = {}; //Locale Date (Obligatoria)
  public idOriginal: string = "";
  public correos: string[] = [];

  public autonumeric30: AppAutonumeric;//3,0
  public autonumeric30Cargas: AppAutonumeric;//3,0
  public autonumeric92: AppAutonumeric;//9,2

  public empleado: RhEmpleado = new RhEmpleado();
  public descuentos: Array<RhEmpleadoDescuentosFijos> = new Array();
  public motivosDeAnticipos: Array<RhAnticipoMotivo> = new Array();

  public provincias: Array<AnxProvinciaCantonTO> = new Array();
  public paises: Array<AnxPaisTO> = new Array();
  public residencias: Array<ClaveValor> = new Array();
  public tiposIdentidad: Array<ClaveValor> = new Array();
  public tiposIdentidadDiscapacidad: Array<ClaveValor> = new Array();
  public generos: Array<ClaveValor> = new Array();
  public estadosCivil: Array<ClaveValor> = new Array();
  public discapacidades: Array<ClaveValor> = new Array();
  public cuentasBancarias: Array<ClaveValor> = new Array();
  public fechaActual: Date = new Date();
  public formasDePago: Array<ClaveValor> = new Array();
  public sectores: Array<PrdSector> = new Array();
  public sectorSeleccionado: PrdSector = new PrdSector();
  public categorias: Array<RhCategoria> = new Array();
  public categoriaSeleccionada: RhCategoria = new RhCategoria();
  public cantones: Array<AnxProvinciaCantonTO> = new Array();
  public bancos: Array<ListaBanBancoTO> = new Array();
  public motivos: Array<ClaveValor> = new Array();

  public rhParametros: RhParametros = new RhParametros();
  public gridApi: GridApi;

  //formulario validar cancelar
  @ViewChild("frmDatos") frmDatos: NgForm;
  public valoresIniciales: any;
  public empleadoInicial: any;

  constructor(
    private empleadoService: EmpleadosService,
    private utilService: UtilService,
    private api: ApiRequestService,
    private toastr: ToastrService,
    private cantonService: CantonService,
  ) {
    moment.locale('es'); // para la fecha
    this.es = this.utilService.setLocaleDate();
    this.autonumeric92 = this.empleadoService.autonumeric92();
    this.autonumeric30 = this.empleadoService.autonumeric30();
    this.autonumeric30Cargas = this.empleadoService.autonumeric30();
  }

  ngOnInit() {
    this.isScreamMd = window.innerWidth <= LS.WINDOW_WIDTH_XS ? false : true;
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.accion = this.parametrosFormulario.accion;
    this.empleado = { ...this.parametrosFormulario.objetoSeleccionado };
    this.fechasDateSinZonaHoraria();
    if (this.data) {
      let data = { ...this.data };
      this.despuesDeObtenerDatosParaCrudEmpleados(data);
    } else {
      this.cargando = true;
      let parametro = { empresa: LS.KEY_EMPRESA_SELECT }
      this.empleadoService.obtenerDatosParaCrudEmpleados(parametro, this, LS.KEY_EMPRESA_SELECT);
    }
    if (this.empleado && this.empleado.empCorreoElectronico != "") {
      this.correos = this.empleado.empCorreoElectronico.split(";");
      this.tamanioChico();
    }
    this.empleadoService.definirAtajosDeTeclado(this);
  }

  cambiarActivar(estado) {
    this.activar = !estado;
    this.enviarAccion.emit(
      {
        accion: LS.ACCION_ACTIVAR,
        estado: !estado
      }
    )
  }

  fechasDateSinZonaHoraria() {
    this.empleado.empFechaNacimiento = this.utilService.formatoDateSinZonaHorariaYYYMMDD(this.empleado.empFechaNacimiento);
    this.empleado.empFechaPrimerIngreso = this.utilService.formatoDateSinZonaHorariaYYYMMDD(this.empleado.empFechaPrimerIngreso);
    this.empleado.empFechaPrimeraSalida = this.utilService.formatoDateSinZonaHorariaYYYMMDD(this.empleado.empFechaPrimeraSalida);
    this.empleado.empFechaAfiliacionIess = this.utilService.formatoDateSinZonaHorariaYYYMMDD(this.empleado.empFechaAfiliacionIess);
    this.empleado.empFechaUltimoSueldo = this.utilService.formatoDateSinZonaHorariaYYYMMDD(this.empleado.empFechaUltimoSueldo);
  }

  cancelar() {
    this.gridApi ? this.gridApi.stopEditing() : null;
    switch (this.accion) {
      case LS.ACCION_EDITAR:
      case LS.ACCION_NUEVO:
      case LS.ACCION_CREAR:
        if (this.sePuedeCancelar()) {
          this.enviarAccion.emit({ accion: LS.ACCION_CANCELAR });
        } else {
          let parametros = {
            title: LS.MSJ_TITULO_CANCELAR,
            texto: LS.MSJ_PREGUNTA_CANCELAR,
            type: LS.SWAL_QUESTION,
            confirmButtonText: LS.MSJ_SI_ACEPTAR,
            cancelButtonText: LS.MSJ_NO_CANCELAR
          };
          this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
            if (respuesta) {//Si presiona aceptar
              this.enviarAccion.emit({ accion: LS.ACCION_CANCELAR });
            }
          });
        }
        break;
      default:
        this.enviarAccion.emit({ accion: LS.ACCION_CANCELAR });
    }
  }

  sePuedeCancelar() {
    return this.utilService.puedoCancelar(this.valoresIniciales, this.frmDatos) && this.utilService.compararObjetos(this.empleadoInicial, this.empleado);
  }

  extraerValoresIniciales() {
    setTimeout(() => {
      this.valoresIniciales = JSON.parse(JSON.stringify(this.frmDatos ? this.frmDatos.value : null));
      this.empleadoInicial = JSON.parse(JSON.stringify(this.empleado ? this.empleado : null));
    }, 50);
  }

  clickear() {
    let patt = new RegExp(LS.EXP_REGULAR_EMAIL);
    let cor = this.correos[this.correos.length - 1];
    cor = cor.toLowerCase();
    if (!patt.test(cor)) {
      this.toastr.warning(LS.MSJ_CORREO_NO_VALIDO);
      this.correos.splice(this.correos.length - 1);
    } else {
      this.correos[this.correos.length - 1] = cor;
    }
  }

  agregarEmail() {
    this.empleado.empCorreoElectronico = "";
    for (let i = 0; i < this.correos.length; i++) {
      if (i < this.correos.length - 1) {
        this.empleado.empCorreoElectronico += this.correos[i] + ";";
      } else if (i == this.correos.length - 1) {
        this.empleado.empCorreoElectronico += this.correos[i];
      }
    }
  }

  tamanioChico() {
    (<HTMLInputElement>document.querySelector('#correosolo input')).className = 'chico form-control form-control-sm';
  }

  tamanioGrande() {
    if (this.correos.length == 0) { // this.correos.length % 3 == 0
      (<HTMLInputElement>document.querySelector('#correosolo input')).className = 'grande form-control form-control-sm';
    }
  }

  cambioAvisoDeEntrada() {
    let empFechaAfiliacionIess = this.utilService.formatoDateSinZonaHorariaYYYMMDD(this.empleado.empFechaAfiliacionIess);
    let fechaActual = this.utilService.formatoDateSinZonaHorariaYYYMMDD(this.fechaActual);
    if (empFechaAfiliacionIess && fechaActual && empFechaAfiliacionIess.getTime() <= fechaActual.getTime()) {
      this.obtenerParametros(empFechaAfiliacionIess);
    }
  }

  obtenerParametros(empFechaAfiliacionIess) {
    let parametros = {
      fechaHasta: empFechaAfiliacionIess
    }
    this.empleadoService.getRhParametros(parametros, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeGetRhParametros(data) {
    this.rhParametros = data;
  }

  despuesDeObtenerDatosParaCrudEmpleados(data) {
    this.rhParametros = data.rhParametros;
    this.motivos = data.motivos;
    this.motivosDeAnticipos = data.motivosAnticipos;
    this.provincias = data.provincias;
    this.tiposIdentidadDiscapacidad = data.tiposIdentidaddiscapacidad;
    this.tiposIdentidad = data.tiposIdentidad;
    this.tipoIdentidadLocal = data.identidadLocal;
    this.paises = data.paises;
    this.paisLocal = data.paisLocal;
    this.residencias = data.residencias;
    this.generos = data.generos;
    this.estadosCivil = data.estadosCivil;
    this.discapacidades = data.discapacidades;
    this.cuentasBancarias = data.cuentasBancarias;
    this.fechaActual = data.fechaActual;
    this.formasDePago = data.formasDePago;
    this.sectores = data.sectores;
    this.categorias = data.categorias;
    this.bancos = data.bancos;
    this.fechaActual = this.utilService.formatoDateSinZonaHorariaYYYMMDD(data.fechaActual);
    this.definirDatosLocales();
    if (this.accion == LS.ACCION_CREAR) {
      this.empleado.empProvincia = this.provincias ? this.provincias[0].codigo : "";
      this.empleado.empTipoId = this.tiposIdentidad ? this.tiposIdentidad[0].clave : null;
      this.empleado.empResidenciaPais = this.paises ? this.paises[0].paisCodigo : "";
      this.empleado.empResidenciaTipo = this.residencias ? this.residencias[0].clave : "";
      this.cambioResidencia();
      this.cambioProvincia();
      this.empleado.empGenero = this.generos ? this.generos[0].clave : "";
      this.empleado.empEstadoCivil = this.estadosCivil[0] ? this.estadosCivil[0].clave : null;
      this.empleado.empDiscapacidadTipo = this.discapacidades[0] ? this.discapacidades[0].clave : null;
      this.empleado.empFormaPago = this.formasDePago ? "MENSUAL" : null;
      this.sectorSeleccionado = this.sectores[0];
      this.categoriaSeleccionada = this.categorias[0];
      this.empleado.empFechaAfiliacionIess = this.fechaActual;
      this.empleado.empRetencion = true;
    } else {
      this.sectorSeleccionado = this.empleado.prdSector;
      this.categoriaSeleccionada = this.empleado.rhCategoria;
      this.cambioProvincia();
    }
    this.empleado.empBanco = this.empleado.empBanco ? this.empleado.empBanco : "";
    this.cargando = false;
    //empleado
    this.idOriginal = this.empleado.rhEmpleadoPK.empId;
    if (this.accion != LS.ACCION_CREAR) {
      this.cargando = true;
      let parametro = {
        empresa: LS.KEY_EMPRESA_SELECT,
        empleado: this.empleado.rhEmpleadoPK.empId,
        apellidos: this.empleado.empApellidos,
        nombres: this.empleado.empNombres
      }
      this.empleadoService.obtenerComplementosEmpleado(parametro, this, LS.KEY_EMPRESA_SELECT);
    } else {
      this.extraerValoresIniciales();
    }
  }

  despuesDeObtenerComplementosEmpleado(data) {
    this.cargando = false;
    this.descuentos = data.descuentos;
    this.archivoPerfilByte = data.foto ? "data:image/jpeg;base64," + data.foto : null;
    this.extraerValoresIniciales();
  }

  validarSueldo() {
    this.sueldoValido = this.utilService.quitarComasNumero(this.empleado.empSueldoIess) > this.rhParametros.parSalarioMinimoVital;
  }

  definirDatosLocales() {
    if (this.paises) {
      let paisLocal = this.paises.find(item => item.paisCodigo == '593');
      if (paisLocal) {
        var indexPais = this.paises.findIndex(item => item.paisCodigo === '593');
        this.paises.splice(indexPais, 1);
      }
    }
  }

  cambioResidencia() {
    if (this.empleado.empResidenciaTipo == "01") {
      this.empleado.empResidenciaPais = '593';
      this.empleado.empTipoId = 'C';
    } else {
      this.empleado.empResidenciaPais = null;
      this.empleado.empTipoId = null;
    }
    this.validarIdentificacion(this.empleado.empTipoId);
  }

  cambioProvincia() {
    this.cantones = new Array();
    let parametro = {
      provincia: this.empleado.empProvincia
    }
    this.cantonService.listarComboAnxCantonTO(parametro, this, this.empresaSeleccionada.empCodigo);
  }

  despuesDeListarComboAnxCantonTO(data) {
    this.cantones = data;
    this.cargando = false;
  }

  cambioCargasFamiliares() {
    if (this.empleado.empEstadoCivil === 'CASADO' && this.empleado.empCargasFamiliares <= 0) {
      this.cargaFamiliarValida = false;
    } else {
      this.cargaFamiliarValida = true;
    }
  }

  compareSectores(o1: PrdSector, o2: PrdSector): boolean {
    return o1 && o2 ? o1.prdSectorPK.secCodigo === o2.prdSectorPK.secCodigo : o1 === o2;
  }

  compareCategorias(o1: RhCategoria, o2: RhCategoria): boolean {
    return o1 && o2 ? o1.rhCategoriaPK.catNombre === o2.rhCategoriaPK.catNombre : o1 === o2;
  }

  validarFechaDeNacimiento() {
    this.fechaNacimientoValido = this.utilService.calcularEdad(this.empleado.empFechaNacimiento);
  }

  soloNumeros(event) {
    return event.charCode >= 48 && event.charCode <= 57
  }

  validarIdentificacion(codigo) {
    this.rptaRepetido = null;
    this.rptaCedula = null;
    if (this.empleado.rhEmpleadoPK.empId) {
      switch (codigo) {
        case "C":
          this.validarCedula();
          break;
        default:
          this.validarRepetido();
          break;
      }
    }
  }

  validarRepetido() {
    if (this.idOriginal != this.empleado.rhEmpleadoPK.empId) {
      let parametros = {
        empresa: LS.KEY_EMPRESA_SELECT,
        buscar: this.empleado.rhEmpleadoPK.empId,
        estado: false
      }
      this.api.post("todocompuWS/rrhhWebController/getListaEmpleado", parametros, LS.KEY_EMPRESA_SELECT)
        .then(data => {
          if (data && data.extraInfo) {
            this.rptaRepetido = "EMPLEADO YA EXISTE";
          }
        }
        ).catch(err => this.utilService.handleError(err, this));
    }
  }

  validarCedula() {
    if (this.empleado.rhEmpleadoPK.empId.length > 9) {
      let parametro = {
        cedula: this.empleado.rhEmpleadoPK.empId
      }
      this.api.post("todocompuWS/appWebController/validarCedula", parametro, LS.KEY_EMPRESA_SELECT)
        .then(respuesta => {
          if (respuesta && respuesta.extraInfo) {
            if (respuesta.extraInfo != "T") {
              this.rptaCedula = respuesta.extraInfo;
              this.toastr.warning(respuesta.extraInfo, LS.TAG_CEDULA);
            }
          }
        })
        .catch(err => this.utilService.handleError(err, this));
    } else {
      this.rptaCedula = LS.MSJ_CEDULA_NO_VALIDA;
    }
  }

  insertar(form: NgForm) {
    this.gridApi ? this.gridApi.stopEditing() : null;
    this.cargando = true;
    if (this.validarAntesDeEnviar(form)) {
      this.continuarInsersion();
    }
  }

  validarAntesDeEnviar(form: NgForm): boolean {
    if (this.rptaCedula) {
      this.toastr.warning(this.rptaCedula, LS.TAG_CEDULA);
      this.cargando = false;
      return false;
    }
    if (!form.valid) {
      this.utilService.establecerFormularioTocado(form);
      this.toastr.warning(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_CAMPOS_INVALIDOS);
      this.cargando = false;
      return false;
    }
    if (!this.fechaNacimientoValido) {
      this.toastr.warning(LS.TAG_FECHA_NACIMIENTO_INVALIDO, LS.TAG_AVISO);
      this.cargando = false;
      return false;
    }
    if (this.empleado.empSueldoIess < this.rhParametros.parSalarioMinimoVital) {
      this.toastr.warning(LS.TAG_SUELDO_MINIMO_INVALIDO, LS.TAG_AVISO);
      this.cargando = false;
      return false;
    }
    if (this.empleado.empEstadoCivil == 'CASADO' && this.empleado.empCargasFamiliares <= 0) {
      this.toastr.warning(LS.TAG_CARGAS_FAMILIARES_INVALIDO, LS.TAG_AVISO);
      this.cargando = false;
      return false;
    }
    if (this.empleado.empDiscapacidadTipo == "03" || this.empleado.empDiscapacidadTipo == "04") {
      if (this.empleado.rhEmpleadoPK.empId == this.empleado.empDiscapacidadIdNumero) {
        this.toastr.warning(LS.TAG_EMPLEADO_ES_DISCAPACITADO, LS.TAG_AVISO);
        this.cargando = false;
        return false;
      }
    }
    if (this.empleado.empDiscapacidadTipo != '01' && this.empleado.empDiscapacidadPorcentaje <= 0) {
      this.toastr.warning(LS.TAG_PORCENTAJE_DISCAPACIDAD_INVALIDO, LS.TAG_AVISO);
      this.cargando = false;
      return false;
    }
    if (this.descuentos) {
      for (let i = 0; i < this.descuentos.length; i++) {
        if (this.descuentos[i].descValor && this.descuentos[i].descValor > this.utilService.quitarComasNumero(this.empleado.empSueldoIess)) {
          this.toastr.warning(LS.TAG_VALOR_DESCUENTO_NO_SUPERARA_SUELDO, LS.TAG_AVISO);
          this.cargando = false;
          return false;
        }
      }
    }
    this.agregarEmail();
    return true;
  }

  continuarInsersion() {
    this.completarDatos();
    let parametro = {
      rhEmpleado: this.empleado,
      listEmpleadoDescuentosFijos: this.descuentos,
      imagen: this.archivoPerfilByte ? this.archivoPerfilByte.split("base64,")[1] : null
    }
    this.empleadoService.insertarModificarRhEmpleado(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeInsertarModificarRhEmpleado(data) {
    this.cargando = false;
    this.enviarAccion.emit(
      {
        accion: LS.ACCION_CREADO,
        objetoSeleccionado: this.empleado,
        empresa: this.empresaSeleccionada
      }
    )
  }

  completarDatos() {
    this.empleado.prdSector = this.sectorSeleccionado;
    this.empleado.rhCategoria = this.categoriaSeleccionada;
    this.empleado.rhEmpleadoPK.empEmpresa = LS.KEY_EMPRESA_SELECT;
    if (this.empleado.empDiscapacidadTipo == "01") {
      this.empleado.empDiscapacidadIdTipo = 'N';
      this.empleado.empDiscapacidadIdNumero = "999";
      this.empleado.empDiscapacidadPorcentaje = 0;
    }
    if (!this.empleado.empBanco) {
      this.empleado.empCuentaTipo = "";
      this.empleado.empCuentaNumero = "";
    }
  }

  //RELOAD
  @HostListener("window:beforeunload", ["$event"])
  unloadHandler(event: Event) {
    switch (this.accion) {
      case LS.ACCION_EDITAR:
      case LS.ACCION_NUEVO:
        event.returnValue = false;
        break;
      default:
        return true;
    }
  }

  /** Actualiza el valor de la pantalla */
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isScreamMd = window.innerWidth <= LS.WINDOW_WIDTH_XS ? false : true;
  }

  /*Foto */
  seleccionarImagenes(event) {
    if (event && event.files) {
      for (let i = 0; i < event.files.length; i++) {
        this.convertirFiles(event.files[i]);
      }
    }
  }

  convertirFiles(file) {
    if (file.size <= 1000000) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (reader && reader.result) {
          this.archivoPerfilByte = reader.result;
        }
      }
    }
  }

  eliminarItem() {
    this.archivoPerfilByte = null;
  }

  visualizar(imagen) {
    this.archivoPerfilByte = imagen;
    this.visualizarImagen = true;
  }

}
