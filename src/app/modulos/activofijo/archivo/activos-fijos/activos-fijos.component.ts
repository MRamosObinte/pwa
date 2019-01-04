import { Component, OnInit, HostListener } from '@angular/core';
import { LS } from '../../../../constantes/app-constants';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { AfActivoTO } from '../../../../entidadesTO/activoFijo/AfActivoTO';
import { MenuItem } from '../../../../../../node_modules/primeng/api';
import { AfCategoriasTO } from '../../../../entidadesTO/activoFijo/AfCategoriasTO';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { AppAutonumeric } from '../../../../directivas/autonumeric/AppAutonumeric';
import { GrupoClasificacionService } from '../grupo-clasificacion/grupo-clasificacion.service';
import { AfUbicacionesTO } from '../../../../entidadesTO/activoFijo/AfUbicacionesTO';
import { UbicacionService } from '../ubicacion/ubicacion.service';
import { SectorService } from '../../../produccion/archivos/sector/sector.service';
import { ActivosFijosService } from './activos-fijos.service';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { ActivatedRoute } from '../../../../../../node_modules/@angular/router';
import { Hotkey, HotkeysService } from '../../../../../../node_modules/angular2-hotkeys';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { AuthService } from '../../../../serviciosgenerales/auth.service';
import * as moment from 'moment';
import { NgForm } from '../../../../../../node_modules/@angular/forms';
import { ToastrService } from '../../../../../../node_modules/ngx-toastr';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { PrdListaSectorTO } from '../../../../entidadesTO/Produccion/PrdListaSectorTO';
import { NgbModal } from '../../../../../../node_modules/@ng-bootstrap/ng-bootstrap';
import { ListadoProductosComponent } from '../../../inventario/componentes/listado-productos/listado-productos.component';
import { InvListaProductosGeneralTO } from '../../../../entidadesTO/inventario/InvListaProductosGeneralTO';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';

@Component({
  selector: 'app-activos-fijos',
  templateUrl: './activos-fijos.component.html',
  styleUrls: ['./activos-fijos.component.css']
})
export class ActivosFijosComponent implements OnInit {
  public constantes: any = LS;
  public cargando: boolean = false;
  public activar: boolean = false;
  public isScreamMd: boolean = true;
  public isSeleccionarPrimeraFila: boolean = true;
  public accion: string = null;
  public frmTitulo: string = LS.TITULO_FILTROS;
  public classTitulo: string = LS.ICON_FILTRAR;
  public filtroGlobal: string = "";
  public codigoProducto: string = "";

  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public listadoResultado: Array<AfActivoTO> = [];
  public listadoFiltrado: Array<AfActivoTO> = [];
  public listadoCategorias: Array<AfCategoriasTO> = [];
  public listadoUbicaciones: Array<AfUbicacionesTO> = [];
  public listadoSectores: Array<PrdListaSectorTO> = [];

  public opciones: MenuItem[];
  public empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  public objetoSeleccionado: AfActivoTO = new AfActivoTO();
  public afActivoTO: AfActivoTO = new AfActivoTO();

  public categoriaSeleccionada: AfCategoriasTO = new AfCategoriasTO();
  public ubicacionSeleccionado: AfUbicacionesTO = new AfUbicacionesTO();
  public sectorSeleccionado: PrdListaSectorTO = new PrdListaSectorTO();

  public indexTable: number = 0;
  public tamanioEstructura: number = 0;
  public columnas: Array<object> = [];
  public columnasSeleccionadas: Array<object> = [];
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public configAutonumeric: AppAutonumeric;
  public es: object = {};
  public valorResidualValido: boolean = true;
  public valorDepreciacionMesesValido: boolean = true;
  public valorDepreciacionMontoValido: boolean = true;

  constructor(
    private grupoClasificacionService: GrupoClasificacionService,
    private ubicacionService: UbicacionService,
    private sectorService: SectorService,
    private activoFijoService: ActivosFijosService,
    private filasService: FilasResolve,
    private route: ActivatedRoute,
    private atajoService: HotkeysService,
    private utilService: UtilService,
    private toastr: ToastrService,
    private auth: AuthService,
    private modalService: NgbModal,
    private api: ApiRequestService,
    private archivoService: ArchivoService
  ) { }

  ngOnInit() {
    moment.locale('es');
    this.es = this.utilService.setLocaleDate();
    this.constantes = LS; //Hace referncia a los constantes
    this.listaEmpresas = this.route.snapshot.data['activoFijo'];
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo : null;
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.frmTitulo = LS.TITULO_FILTROS;
    this.classTitulo = LS.ICON_FILTRAR;
    this.isScreamMd = window.innerWidth <= 576 ? false : true;
    this.inicializarAtajos();
    this.inicializarTabla();
    this.configAutonumeric = {
      decimalPlaces: 2,
      decimalPlacesRawValue: 2,
      decimalPlacesShownOnBlur: 2,
      decimalPlacesShownOnFocus: 2,
      maximumValue: '100.00',
      minimumValue: '0',
    }
  }

  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.sectorSeleccionado = null;
    this.categoriaSeleccionada = null;
    this.ubicacionSeleccionado = null;
    this.limpiarResultado();
    this.listarSectores();
    this.listarGrupoClasificacion();
    this.listarUbicaciones();
  }

  operacionesActivoFijo(opcion) {
    switch (opcion) {
      case LS.ACCION_ELIMINAR: {
        if (this.utilService.verificarPermiso(LS.ACCION_ELIMINAR, this, true)) {
          this.afActivoTO = new AfActivoTO(this.objetoSeleccionado);
          this.accion = LS.ACCION_ELIMINAR;
          this.frmTitulo = LS.TITULO_FILTROS;
          this.classTitulo = LS.ICON_FILTRAR;
          this.eliminarActivosFijos();
        }
        break;
      }
      case LS.ACCION_CREAR: {
        if (this.utilService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
          this.afActivoTO = new AfActivoTO();
          this.afActivoTO.afUbicaciones = this.ubicacionSeleccionado && this.ubicacionSeleccionado.ubiCodigo ? this.ubicacionSeleccionado : this.listadoUbicaciones[0];
          this.afActivoTO.afCategorias = this.categoriaSeleccionada && this.categoriaSeleccionada.catCodigo ? this.categoriaSeleccionada : this.listadoCategorias[0];
          this.afActivoTO.prdListaSectorTO = this.sectorSeleccionado && this.sectorSeleccionado.secCodigo ? this.sectorSeleccionado : this.listadoSectores[0];
          this.accion = LS.ACCION_CREAR;
          this.activar = false;
          this.frmTitulo = LS.TITULO_FORM_NUEVO_ACTIVO_FIJO;
          this.classTitulo = LS.ICON_FILTRO_NUEVO;
        }
        break;
      }
      case LS.ACCION_EDITAR: {
        if (this.utilService.verificarPermiso(LS.ACCION_EDITAR, this, true)) {
          this.afActivoTO = new AfActivoTO(this.objetoSeleccionado);
          this.afActivoTO.afFechaAdquisicion = this.utilService.fomatearFechaString(this.afActivoTO.afFechaAdquisicion, 'AAAA-MM-DD');
          this.codigoProducto = this.afActivoTO.afCodigo;
          this.accion = LS.ACCION_EDITAR;
          this.activar = false;
          this.frmTitulo = LS.TITULO_FORM_EDITAR_ACTIVO_FIJO;
          this.classTitulo = LS.ICON_FILTRO_EDITAR;
        }
        break;
      }
      case LS.ACCION_CONSULTAR: {
        if (this.utilService.verificarPermiso(LS.ACCION_CONSULTAR, this, true)) {
          this.afActivoTO = new AfActivoTO(this.objetoSeleccionado);
          this.afActivoTO.afFechaAdquisicion = this.utilService.fomatearFechaString(this.afActivoTO.afFechaAdquisicion, 'AAAA-MM-DD');
          this.accion = LS.ACCION_CONSULTAR;
          this.activar = false;
          this.frmTitulo = LS.TITULO_FORM_CONSULTAR_ACTIVO_FIJO;
          this.classTitulo = LS.ICON_FILTRO_CONSULTAR;
        }
        break;
      }
    }
  }

  inicializarAtajos() {
    this.atajoService.add(new Hotkey(LS.ATAJO_AYUDA, (): boolean => {
      window.open('http://google.com', '_blank');
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivarActivoFijo') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscarActivoFijo') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirActivoFijo') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnExportarActivoFijo') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_NUEVO, (): boolean => {
      let element: HTMLElement = document.getElementById('btnNuevoActivoFijo') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_EDITAR, (): boolean => {
      if (this.listadoResultado.length > 0) {
        this.operacionesActivoFijo(LS.ACCION_EDITAR);
      }
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_ELIMINAR, (): boolean => {
      if (this.listadoResultado.length > 0) {
        this.operacionesActivoFijo(LS.ACCION_ELIMINAR);
      }
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_GUARDAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnGuardarActivoFijo') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_CANCELAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnCancelarActivoFijo') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
  }

  inicializarTabla() {
    this.columnas = [
      { field: 'afCodigo', header: LS.TAG_CODIGO, width: '20%' },
      { field: 'afDescripcion', header: LS.TAG_DESCRIPCION, width: '30%' },
      { field: 'categoriaDescripcion', header: LS.TAG_GRUPO_CLASIFICACION, width: '30%' },
      { field: 'ubicacionDescripcion', header: LS.TAG_UBICACION, width: '30%' },
      { field: 'sectorDescripcion', header: LS.TAG_SECTOR, width: '30%' }
    ];
    this.columnasSeleccionadas = this.columnas;
  }

  inicializarSectores(o1: PrdListaSectorTO, o2: PrdListaSectorTO) {
    if (o1 && o2) {
      return o1.secCodigo === o2.secCodigo;
    }
  }

  inicializarCategorias(c1: AfCategoriasTO, c2: AfCategoriasTO) {
    if (c1 && c2) {
      return c1.catCodigo === c2.catCodigo;
    }
  }

  inicializarUbicaciones(u1: AfUbicacionesTO, u2: AfUbicacionesTO) {
    if (u1 && u2) {
      return u1.ubiCodigo === u2.ubiCodigo;
    }
  }

  soloNumeros(event) {
    return this.utilService.soloNumeros(event);
  }

  limpiarResultado() {
    this.listadoFiltrado = [];
    this.listadoResultado = [];
    this.actualizarFilas();
  }

  listarActivosFijos() {
    this.cargando = true;
    let parametros = {
      empresa: LS.KEY_EMPRESA_SELECT,
      sector: this.sectorSeleccionado && this.sectorSeleccionado.secCodigo ? this.sectorSeleccionado.secCodigo : '',
      ubicacion: this.ubicacionSeleccionado && this.ubicacionSeleccionado.ubiCodigo ? this.ubicacionSeleccionado.ubiCodigo : ''
    };
    this.filasTiempo.iniciarContador();
    this.activoFijoService.listarAfActivoTO(parametros, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarAfActivoTO(data) {
    this.listadoResultado = data;
    this.listadoFiltrado = this.listadoResultado.slice();
    this.cargando = false;
    this.filasTiempo.finalizarContador();
    this.seleccionarPrimeraFila();
    this.actualizarFilas();
  }

  listarGrupoClasificacion() {
    this.cargando = true;
    this.grupoClasificacionService.listarAfCategoriasTO({ empresa: LS.KEY_EMPRESA_SELECT, filtrarInactivos: true }, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarAfCategoriasTO(data) {
    this.listadoCategorias = data;
    if (this.listadoCategorias.length > 0) {
      this.categoriaSeleccionada = this.categoriaSeleccionada && this.categoriaSeleccionada.catCodigo ? this.listadoCategorias.find(item => item.catCodigo === this.categoriaSeleccionada.catCodigo) : this.listadoCategorias[0];
    } else {
      this.categoriaSeleccionada = null;
    }
    this.cargando = false;
  }

  listarUbicaciones() {
    this.cargando = true;
    this.ubicacionService.listarAfUbicacionesTO({ empresa: LS.KEY_EMPRESA_SELECT }, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarAfUbicacionesTO(data) {
    this.listadoUbicaciones = data;
    if (this.listadoUbicaciones.length > 0) {
      this.ubicacionSeleccionado = this.ubicacionSeleccionado && this.ubicacionSeleccionado.ubiCodigo ? this.listadoUbicaciones.find(item => item.ubiCodigo === this.ubicacionSeleccionado.ubiCodigo) : this.listadoUbicaciones[0];
    } else {
      this.ubicacionSeleccionado = null;
    }
    this.cargando = false;
  }

  listarSectores() {
    this.cargando = true;
    this.sectorService.listarPrdListaSectorTO({ empresa: LS.KEY_EMPRESA_SELECT, mostrarInactivo: false }, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarSectores(data) {
    this.listadoSectores = data;
    if (this.listadoSectores.length > 0) {
      this.sectorSeleccionado = this.sectorSeleccionado && this.sectorSeleccionado.secCodigo ? this.listadoSectores.find(item => item.secCodigo === this.sectorSeleccionado.secCodigo) : this.listadoSectores[0];
    } else {
      this.sectorSeleccionado = null;
    }
    this.cargando = false;
  }

  insertarActivosFijos(form: NgForm) {
    if (this.utilService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
      this.cargando = true;
      this.validarValorResidual();
      this.validarDepreciacionMeses();
      let formularioTocado = this.utilService.establecerFormularioTocado(form);
      if (formularioTocado && form && form.valid && this.valorResidualValido && this.valorDepreciacionMesesValido && this.valorDepreciacionMontoValido) {
        let activoFijoCopia = JSON.parse(JSON.stringify(this.afActivoTO));
        this.setearValoresAObjetoAfActivoTO(activoFijoCopia);
        this.api.post("todocompuWS/activosFijosWebController/insertarAfActivoTO", { afActivoTO: activoFijoCopia }, LS.KEY_EMPRESA_SELECT)
          .then(respuesta => {
            this.cargando = false;
            if (respuesta && respuesta.extraInfo) {
              this.resetearFormulario();
              this.refrescarTabla(activoFijoCopia, 'I');
              this.toastr.success(respuesta.operacionMensaje, 'Aviso');
            } else {
              this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
            }
          }).catch(err => this.utilService.handleError(err, this));
      } else {
        this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        this.cargando = false;
      }
    }
  }

  actualizarActivosFijos(form: NgForm) {
    if (this.utilService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
      this.cargando = true;
      this.validarValorResidual();
      this.validarDepreciacionMeses();
      let formularioTocado = this.utilService.establecerFormularioTocado(form);
      if (formularioTocado && form && form.valid && this.valorResidualValido && this.valorDepreciacionMesesValido && this.valorDepreciacionMontoValido) {
        let activoFijoCopia = JSON.parse(JSON.stringify(this.afActivoTO));
        this.setearValoresAObjetoAfActivoTO(activoFijoCopia);
        this.api.post("todocompuWS/activosFijosWebController/modificarAfActivoTO", { afActivoTO: activoFijoCopia }, LS.KEY_EMPRESA_SELECT)
          .then(respuesta => {
            if (respuesta && respuesta.extraInfo) {
              this.refrescarTabla(activoFijoCopia, 'U');
              this.toastr.success(respuesta.operacionMensaje, 'Aviso');
              this.resetearFormulario();
            } else {
              this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
            }
            this.cargando = false;
          }).catch(err => this.utilService.handleError(err, this));
      } else {
        this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        this.cargando = false;
      }
    }
  }

  eliminarActivosFijos() {
    if (this.utilService.verificarPermiso(LS.ACCION_ELIMINAR, this, true)) {
      let parametros = {
        title: LS.MSJ_TITULO_ELIMINAR,
        texto: LS.MSJ_PREGUNTA_ELIMINAR,
        type: LS.SWAL_WARNING,
        confirmButtonText: LS.MSJ_SI_ELIMINAR,
        cancelButtonText: LS.MSJ_CANCELAR,
        confirmButtonColor: LS.COLOR_ELIMINAR
      }
      this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
        if (respuesta) {//Si presiona aceptar
          this.cargando = true;
          let parametro = { afActivoTO: this.afActivoTO };
          this.api.post("todocompuWS/activosFijosWebController/eliminarAfActivoTO", parametro, LS.KEY_EMPRESA_SELECT)
            .then(respuesta => {
              if (respuesta && respuesta.extraInfo) {
                this.toastr.success(respuesta.operacionMensaje, LS.TOAST_CORRECTO);
                this.refrescarTabla(this.afActivoTO, 'D');
              } else {
                this.toastr.warning(respuesta.operacionMensaje);
              }
              this.resetearFormulario();
              this.cargando = false;
            }).catch(err => this.utilService.handleError(err, this));
        } else {
          this.resetearFormulario();
        }
      });
    }
  }

  exportarActivosFijos() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = { listadoAfActivoTO: this.listadoResultado };
      this.archivoService.postExcel("todocompuWS/activosFijosWebController/exportarReporteAfActivoTO", parametros, this.empresaSeleccionada)
        .then(data => {
          if (data) {
            this.utilService.descargarArchivoExcel(data._body, 'ListadoActivosFijos_');
          } else {
            this.toastr.warning(LS.MSJ_NO_DATA, LS.TAG_AVISO);
          }
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  imprimirActivosFijos() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = { listadoAfActivoTO: this.listadoResultado };
      this.archivoService.postPDF("todocompuWS/activosFijosWebController/generarReporteAfActivoTO", parametros, this.empresaSeleccionada)
        .then(data => {
          if (data) {
            this.utilService.descargarArchivoPDF('ListadoActivosFijos' + this.utilService.obtenerHorayFechaActual() + '.pdf', data);
          } else {
            this.toastr.warning(LS.MSJ_NO_DATA, LS.TAG_AVISO);
          }
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  setearValoresAObjetoAfActivoTO(objeto: AfActivoTO) {
    objeto.usrEmpresa = LS.KEY_EMPRESA_SELECT;
    objeto.afEmpresa = LS.KEY_EMPRESA_SELECT;
    objeto.sectorDescripcion = objeto.prdListaSectorTO.nomSector;
    objeto.ubicacionDescripcion = objeto.afUbicaciones.ubiDescripcion;
    objeto.categoriaDescripcion = objeto.afCategorias.catDescripcion;
    objeto.usrCodigo = this.auth.getCodigoUser();
  }

  resetearFormulario() {
    this.accion = null;
    this.frmTitulo = LS.TITULO_FILTROS;
    this.classTitulo = LS.ICON_FILTRAR;
    this.valorResidualValido = true;
    this.valorDepreciacionMesesValido = true;
    this.valorDepreciacionMontoValido = true;
    this.afActivoTO = new AfActivoTO();
    this.actualizarFilas()
  }

  refrescarTabla(afActivoTO: AfActivoTO, operacion: string) {
    switch (operacion) {
      case 'I': {//Insertar un elemento en la tabla
        //Si la lista tiene mas de un elemento lo guarda
        if (this.listadoResultado.length > 0) {
          let listaTemporal = [... this.listadoResultado];
          listaTemporal.unshift(afActivoTO);
          this.listadoResultado = listaTemporal;
        }
        break;
      }
      case 'U': {//Actualiza un elemento en la tabla
        //Se actualiza la lista
        var indexTemp = this.listadoResultado.findIndex(item => item.afCodigo === afActivoTO.afCodigo);
        let listaTemporal = [... this.listadoResultado];
        listaTemporal[indexTemp] = afActivoTO;
        this.listadoResultado = listaTemporal;
        this.objetoSeleccionado = this.listadoResultado[indexTemp];
        this.indexTable = indexTemp;
        this.isSeleccionarPrimeraFila = false;
        break;
      }
      case 'D': {//Elimina un elemento en la tabla
        //Actualizan las listas 
        var indexTemp = this.listadoResultado.findIndex(item => item.afCodigo === afActivoTO.afCodigo);
        this.listadoResultado = this.listadoResultado.filter((val, i) => i != indexTemp);
        this.indexTable = indexTemp;
        this.isSeleccionarPrimeraFila = false;
        break;
      }
    }
  }

  buscarProducto(event) {
    if (this.utilService.validarKeyBuscar(event.keyCode)) {
      if (!(this.afActivoTO.afCodigo && this.afActivoTO.afCodigo === this.codigoProducto)) {
        let parametroBusquedaProducto = { empresa: this.empresaSeleccionada.empCodigo, busqueda: this.afActivoTO.afCodigo, categoria: null, incluirInactivos: false, limite: false };
        event.srcElement.blur();
        event.preventDefault();
        const modalRef = this.modalService.open(ListadoProductosComponent, { size: 'lg', backdrop: 'static' });
        modalRef.componentInstance.parametrosBusqueda = parametroBusquedaProducto;
        modalRef.componentInstance.empresaSeleccionada = this.empresaSeleccionada;
        modalRef.componentInstance.isModal = true;
        modalRef.result.then((result) => {
          let resultado = new InvListaProductosGeneralTO(result);
          this.afActivoTO.afCodigo = resultado.proCodigoPrincipal;
          this.afActivoTO.afDescripcion = resultado.proNombre;
          this.codigoProducto = resultado.proCodigoPrincipal;
        }, () => {
          this.afActivoTO.afCodigo = null;
          this.codigoProducto = null;
          this.focusProducto();
        });
      } else {
        this.toastr.info(LS.MSJ_ENTERTOMODAL, LS.TAG_AVISO);
      }
    }
  }

  focusProducto() {
    let element = document.getElementById('codigoProducto');
    element ? element.focus() : null;
  }

  validarProducto() {
    if (this.codigoProducto !== this.afActivoTO.afCodigo) {
      this.codigoProducto = null;
      this.afActivoTO.afCodigo = null;
      this.afActivoTO.afDescripcion = null;
    }
  }

  validarValorResidual(): boolean {
    this.afActivoTO.afValorResidual = this.afActivoTO.afValorResidual ? this.afActivoTO.afValorResidual : 0;
    this.afActivoTO.afValorAdquision = this.afActivoTO.afValorAdquision ? this.afActivoTO.afValorAdquision : 0;
    let activoCopia = JSON.parse(JSON.stringify(this.afActivoTO));
    let isMayorCero = this.utilService.convertirDecimaleFloat(activoCopia.afValorResidual) > 0 && this.utilService.convertirDecimaleFloat(activoCopia.afValorAdquision) > 0;
    let isMenorIgual = this.utilService.convertirDecimaleFloat(activoCopia.afValorResidual) <= this.utilService.convertirDecimaleFloat(activoCopia.afValorAdquision);
    this.valorResidualValido = isMayorCero && isMenorIgual;
    this.validarDepreciacionMonto();
    return this.valorResidualValido;
  }

  validarDepreciacionMeses(): boolean {
    this.afActivoTO.afDepreciacionInicialMeses = this.afActivoTO.afDepreciacionInicialMeses ? this.afActivoTO.afDepreciacionInicialMeses : 0;
    let activoCopia = JSON.parse(JSON.stringify(this.afActivoTO));
    let isMayorCero = activoCopia.afDepreciacionInicialMeses > 0;
    let isMenorIgual = activoCopia.afDepreciacionInicialMeses <= activoCopia.afCategorias.catVidaUtil * 12
    this.valorDepreciacionMesesValido = isMayorCero && isMenorIgual;
    this.validarDepreciacionMonto();
    return this.valorDepreciacionMesesValido;
  }

  validarDepreciacionMonto(): boolean {
    this.afActivoTO.afDepreciacionInicialMonto = this.afActivoTO.afDepreciacionInicialMonto ? this.afActivoTO.afDepreciacionInicialMonto : 0;
    let activoCopia = JSON.parse(JSON.stringify(this.afActivoTO));
    let diferencia = Math.abs(activoCopia.afValorAdquision - activoCopia.afValorResidual);
    let isMayorCero = activoCopia.afDepreciacionInicialMonto > 0;
    let isMenorIgual = activoCopia.afDepreciacionInicialMonto <= diferencia;
    this.valorDepreciacionMontoValido = isMayorCero && isMenorIgual;
    return this.valorDepreciacionMontoValido;
  }

  generarOpciones() {
    this.indexTable = this.listadoFiltrado.indexOf(this.objetoSeleccionado);
    let perConsultar = true;
    let perEditar = this.empresaSeleccionada.listaSisPermisoTO.gruModificar;
    let perEliminar = this.empresaSeleccionada.listaSisPermisoTO.gruEliminar;
    this.opciones = [
      { label: LS.ACCION_CONSULTAR, icon: LS.ICON_CONSULTAR, disabled: !perConsultar, command: () => perConsultar ? this.operacionesActivoFijo(LS.ACCION_CONSULTAR) : null },
      { label: LS.ACCION_EDITAR, icon: LS.ICON_EDITAR, disabled: !perEditar, command: () => perEditar ? this.operacionesActivoFijo(LS.ACCION_EDITAR) : null },
      { label: LS.ACCION_ELIMINAR, icon: LS.ICON_ELIMINAR, disabled: !perEliminar, command: () => perEliminar ? this.operacionesActivoFijo(LS.ACCION_ELIMINAR) : null },
    ];
  }

  onFilterTabla(event) {
    this.listadoFiltrado = event.filteredValue.slice();
    this.isSeleccionarPrimeraFila ? this.seleccionarPrimeraFila() : null;
    this.isSeleccionarPrimeraFila = true;
    this.actualizarFilas();
  }

  verificarFiltros(event, dt, tipo) {
    switch (tipo) {
      case 'TECLAS': {
        if (this.utilService.validarKeyBuscar(event.keyCode)) {
          this.filtrarGlobalmente(dt);
        }
        break;
      }
      case 'CLICK': {
        this.filtrarGlobalmente(dt);
        break;
      }
      case 'BLUR': {
        if (!this.filtroGlobal) {
          this.filtrarGlobalmente(dt);
        }
        break;
      }
    }
  }

  seleccionarPrimeraFila() {
    if (this.listadoFiltrado.length > 0) {
      this.objetoSeleccionado = this.listadoFiltrado[0];
      this.indexTable = 0;
    }
  }

  filtrarGlobalmente(dt, filtrar?) {
    if (filtrar && this.filtroGlobal !== "") {
      return;
    }
    dt.filterGlobal(this.filtroGlobal.toUpperCase(), 'contains');
  }

  actualizarFilas() {
    this.filasService.actualizarFilas(this.listadoFiltrado.length, this.filasTiempo.getTiempo());
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isScreamMd = window.innerWidth <= 576 ? false : true;
  }
}
