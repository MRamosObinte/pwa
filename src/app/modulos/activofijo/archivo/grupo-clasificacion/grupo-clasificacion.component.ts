import { Component, OnInit, ViewChild } from '@angular/core';
import { LS } from '../../../../constantes/app-constants';
import { MenuItem } from '../../../../../../node_modules/primeng/api';
import { AfCategoriasTO } from '../../../../entidadesTO/activoFijo/AfCategoriasTO';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { GrupoClasificacionService } from './grupo-clasificacion.service';
import { ActivatedRoute } from '../../../../../../node_modules/@angular/router';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from '../../../../../../node_modules/ngx-toastr';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { HotkeysService, Hotkey } from '../../../../../../node_modules/angular2-hotkeys';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { AuthService } from '../../../../serviciosgenerales/auth.service';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { NgForm } from '../../../../../../node_modules/@angular/forms';
import { AppAutonumeric } from '../../../../directivas/autonumeric/AppAutonumeric';
import { PlanContableService } from '../../../contabilidad/archivo/plan-contable/plan-contable.service';
import { ListadoPlanCuentasComponent } from '../../../contabilidad/componentes/listado-plan-cuentas/listado-plan-cuentas.component';
import { NgbModal } from '../../../../../../node_modules/@ng-bootstrap/ng-bootstrap';
import { GridApi } from 'ag-grid';
import { BotonOpcionesComponent } from '../../../componentes/boton-opciones/boton-opciones.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { ContextMenu } from 'primeng/contextmenu';
import { DecimalPipe } from '@angular/common';
import { InputEstadoComponent } from '../../../componentes/input-estado/input-estado.component';

@Component({
  selector: 'app-grupo-clasificacion',
  templateUrl: './grupo-clasificacion.component.html',
  styleUrls: ['./grupo-clasificacion.component.css']
})
export class GrupoClasificacionComponent implements OnInit {
  @ViewChild("menuOpciones") menuOpciones: ContextMenu;
  public constantes: any = LS;
  public cargando: boolean = false;
  public activar: boolean = false;
  public isScreamMd: boolean = true;
  public accion: string = null;
  public frmTitulo: string = LS.TITULO_FILTROS;
  public classTitulo: string = LS.ICON_FILTRAR;
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public listadoResultado: Array<AfCategoriasTO> = [];
  public opciones: MenuItem[];
  public empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  public objetoSeleccionado: AfCategoriasTO = new AfCategoriasTO();
  public afCategoriasTO: AfCategoriasTO = new AfCategoriasTO();
  public tamanioEstructura: number = 0;
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public configAutonumeric: AppAutonumeric;
  public cuentaActivo: string = null;
  public cuentaDepreciacion: string = null;
  public cuentaDepreciacionAcum: string = null;
  public porcentajeValido: boolean = true;
  public vidaUtilValido: boolean = true;

  //AG-GRID
  public gridApi: GridApi;
  public gridColumnApi: any;
  public columnDefs: Array<object> = [];
  public columnDefsSelected: Array<object> = [];
  public rowSelection: string;
  public components: any = {};
  public context;
  public frameworkComponents;

  constructor(
    private grupoClasificacionService: GrupoClasificacionService,
    private route: ActivatedRoute,
    private api: ApiRequestService,
    private toastr: ToastrService,
    private filasService: FilasResolve,
    private atajoService: HotkeysService,
    private utilService: UtilService,
    private auth: AuthService,
    private planContableService: PlanContableService,
    private modalService: NgbModal,
    private archivoService: ArchivoService
  ) { }

  ngOnInit() {
    this.constantes = LS; //Hace referncia a los constantes
    this.listaEmpresas = this.route.snapshot.data['activoFijoGrupo'];
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo : null;
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.frmTitulo = LS.TITULO_FILTROS;
    this.classTitulo = LS.ICON_FILTRAR;
    this.isScreamMd = window.innerWidth <= 576 ? false : true;
    this.inicializarAtajos();
    this.iniciarAgGrid();
    this.configAutonumeric = {
      decimalPlaces: 2,
      decimalPlacesRawValue: 2,
      decimalPlacesShownOnBlur: 2,
      decimalPlacesShownOnFocus: 2,
      maximumValue: '100.00',
      minimumValue: '0',
    }
  }

  operacionesGrupoClasificacion(opcion) {
    switch (opcion) {
      case LS.ACCION_ELIMINAR: {
        if (this.utilService.verificarPermiso(LS.ACCION_ELIMINAR, this, true)) {
          this.afCategoriasTO = new AfCategoriasTO(this.objetoSeleccionado);
          this.accion = LS.ACCION_ELIMINAR;
          this.frmTitulo = LS.TITULO_FILTROS;
          this.classTitulo = LS.ICON_FILTRAR;
          this.eliminarGrupoClasificacion();
        }
        break;
      }
      case LS.ACCION_CREAR: {
        if (this.utilService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
          this.afCategoriasTO = new AfCategoriasTO();
          this.accion = LS.ACCION_CREAR;
          this.activar = false;
          this.frmTitulo = LS.TITULO_FORM_NUEVO_GRUPO_CLASIFICACION;
          this.classTitulo = LS.ICON_FILTRO_NUEVO;
        }
        break;
      }
      case LS.ACCION_EDITAR: {
        if (this.utilService.verificarPermiso(LS.ACCION_EDITAR, this, true)) {
          this.afCategoriasTO = new AfCategoriasTO(this.objetoSeleccionado);
          this.cuentaActivo = this.afCategoriasTO.catCuentaActivo;
          this.cuentaDepreciacion = this.afCategoriasTO.catCuentaDepreciacion;
          this.cuentaDepreciacionAcum = this.afCategoriasTO.catCuentaDepreciacionAcumulada;
          this.accion = LS.ACCION_EDITAR;
          this.activar = false;
          this.frmTitulo = LS.TITULO_FORM_EDITAR_GRUPO_CLASIFICACION;
          this.classTitulo = LS.ICON_FILTRO_EDITAR;
        }
        break;
      }
      case LS.ACCION_EDITAR_ESTADO: {
        if (this.utilService.verificarPermiso(LS.ACCION_EDITAR, this, true)) {
          this.afCategoriasTO = new AfCategoriasTO(this.objetoSeleccionado);
          this.accion = LS.ACCION_EDITAR_ESTADO;
          this.frmTitulo = LS.TITULO_FILTROS;
          this.classTitulo = LS.ICON_FILTRAR;
          this.actualizarEstadoGrupoClasificacion();
        }
        break;
      }
      case LS.ACCION_CONSULTAR: {
        if (this.utilService.verificarPermiso(LS.ACCION_CONSULTAR, this, true)) {
          this.afCategoriasTO = new AfCategoriasTO(this.objetoSeleccionado);
          this.accion = LS.ACCION_CONSULTAR;
          this.activar = false;
          this.frmTitulo = LS.TITULO_FORM_CONSULTAR_GRUPO_CLASIFICACION;
          this.classTitulo = LS.ICON_FILTRO_CONSULTAR;
        }
        break;
      }
    }
  }

  listarGrupoClasificacion(filtrarInactivos) {
    this.cargando = true;
    this.filasTiempo.iniciarContador();
    this.grupoClasificacionService.listarAfCategoriasTO({ empresa: LS.KEY_EMPRESA_SELECT, filtrarInactivos: filtrarInactivos }, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarAfCategoriasTO(data) {
    this.listadoResultado = data;
    this.cargando = false;
    this.filasTiempo.finalizarContador();
  }

  insertarGrupoClasificacion(form: NgForm) {
    if (this.utilService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
      this.cargando = true;
      this.validarVidaUtil();
      this.validarPorcentaje();
      let formularioTocado = this.utilService.establecerFormularioTocado(form);
      if (formularioTocado && form && form.valid && this.afCategoriasTO.catVidaUtil > 0 && this.afCategoriasTO.catPorcentajeDepreciacion > 0) {
        let grupoClasificacionCopia = JSON.parse(JSON.stringify(this.afCategoriasTO));
        this.setearValoresAObjetoAfCategoriasTO(grupoClasificacionCopia);
        this.api.post("todocompuWS/activosFijosWebController/insertarAfCategoriasTO", { afCategoriasTO: grupoClasificacionCopia }, LS.KEY_EMPRESA_SELECT)
          .then(respuesta => {
            this.cargando = false;
            if (respuesta && respuesta.extraInfo) {
              this.resetearFormulario();
              this.refrescarTabla(grupoClasificacionCopia, 'I');
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

  modificarGrupoClasificacion(grupoClasificacionCopia) {
    this.api.post("todocompuWS/activosFijosWebController/modificarAfCategoriasTO", { afCategoriasTO: grupoClasificacionCopia }, LS.KEY_EMPRESA_SELECT)
      .then(respuesta => {
        if (respuesta && respuesta.extraInfo) {
          this.refrescarTabla(grupoClasificacionCopia, 'U');
          this.toastr.success(respuesta.operacionMensaje, 'Aviso');
          this.resetearFormulario();
        } else {
          this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
        }
        this.cargando = false;
      }).catch(err => this.utilService.handleError(err, this));
  }

  actualizarGrupoClasificacion(form: NgForm) {
    if (this.utilService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
      this.cargando = true;
      this.validarVidaUtil();
      this.validarPorcentaje();
      let formularioTocado = this.utilService.establecerFormularioTocado(form);
      if (formularioTocado && form && form.valid && this.afCategoriasTO.catVidaUtil > 0 && this.afCategoriasTO.catPorcentajeDepreciacion > 0) {
        let grupoClasificacionCopia = JSON.parse(JSON.stringify(this.afCategoriasTO));
        this.setearValoresAObjetoAfCategoriasTO(grupoClasificacionCopia);
        this.modificarGrupoClasificacion(grupoClasificacionCopia);
      } else {
        this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        this.cargando = false;
      }
    }
  }

  actualizarEstadoGrupoClasificacion() {
    if (this.utilService.verificarPermiso(LS.ACCION_EDITAR, this, true)) {
      let grupoClasificacionCopia = JSON.parse(JSON.stringify(this.afCategoriasTO));
      let parametros = {
        title: grupoClasificacionCopia.catInactivo ? LS.MSJ_TITULO_ACTIVAR : LS.MSJ_TITULO_INACTIVAR,
        texto: (grupoClasificacionCopia.catInactivo ? LS.MSJ_PREGUNTA_ACTIVAR : LS.MSJ_PREGUNTA_INACTIVAR) + "<br>" + "Grupo y clasificación: " + grupoClasificacionCopia.catDescripcion,
        type: LS.SWAL_QUESTION,
        confirmButtonText: LS.MSJ_SI_ACEPTAR,
        cancelButtonText: LS.MSJ_NO_CANCELAR
      }
      this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
        if (respuesta) {//Si presiona aceptar
          this.cargando = true;
          grupoClasificacionCopia.catInactivo = !grupoClasificacionCopia.catInactivo;
          this.modificarGrupoClasificacion(grupoClasificacionCopia);
        } else {
          this.resetearFormulario();
        }
      });
    } else {
      this.resetearFormulario();
    }
  }

  eliminarGrupoClasificacion() {
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
          let parametro = { afCategoriasTO: this.afCategoriasTO };
          this.api.post("todocompuWS/activosFijosWebController/eliminarAfCategoriasTO", parametro, LS.KEY_EMPRESA_SELECT)
            .then(respuesta => {
              if (respuesta && respuesta.extraInfo) {
                this.toastr.success(respuesta.operacionMensaje, LS.TOAST_CORRECTO);
                this.refrescarTabla(this.afCategoriasTO, 'D');
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

  imprimirGrupoClasificacion() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = { listadoAfCategoriasTO: this.listadoResultado };
      this.archivoService.postPDF("todocompuWS/activosFijosWebController/generarReporteAfCategoriasTO", parametros, this.empresaSeleccionada)
        .then(data => {
          if (data) {
            this.utilService.descargarArchivoPDF('ListadoGrupoClasificacion' + this.utilService.obtenerHorayFechaActual() + '.pdf', data);
          } else {
            this.toastr.warning(LS.MSJ_NO_DATA, LS.TAG_AVISO);
          }
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  exportarGrupoClasificacion() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = { listadoAfCategoriasTO: this.listadoResultado };
      this.archivoService.postExcel("todocompuWS/activosFijosWebController/exportarReporteAfCategoriasTO", parametros, this.empresaSeleccionada)
        .then(data => {
          if (data) {
            this.utilService.descargarArchivoExcel(data._body, 'ListadoGrupoClasificacion_');
          } else {
            this.toastr.warning(LS.MSJ_NO_DATA, LS.TAG_AVISO);
          }
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  setearValoresAObjetoAfCategoriasTO(objeto: AfCategoriasTO) {
    objeto.usrEmpresa = LS.KEY_EMPRESA_SELECT;
    objeto.catEmpresa = LS.KEY_EMPRESA_SELECT;
    objeto.usrCodigo = this.auth.getCodigoUser();
  }

  resetearFormulario() {
    this.accion = null;
    this.frmTitulo = LS.TITULO_FILTROS;
    this.classTitulo = LS.ICON_FILTRAR;
    this.vidaUtilValido = true;
    this.porcentajeValido = true;
    this.afCategoriasTO = new AfCategoriasTO();
    this.actualizarFilas()
  }

  refrescarTabla(afCategoriasTO: AfCategoriasTO, operacion: string) {
    switch (operacion) {
      case 'I': {//Insertar un elemento en la tabla
        //Si la lista tiene mas de un elemento lo guarda
        if (this.listadoResultado.length > 0) {
          let listaTemporal = [... this.listadoResultado];
          listaTemporal.unshift(afCategoriasTO);
          this.listadoResultado = listaTemporal;
        }
        break;
      }
      case 'U': {//Actualiza un elemento en la tabla
        //Se actualiza la lista
        var indexTemp = this.listadoResultado.findIndex(item => item.catCodigo === afCategoriasTO.catCodigo);
        let listaTemporal = [... this.listadoResultado];
        listaTemporal[indexTemp] = afCategoriasTO;
        this.listadoResultado = listaTemporal;
        break;
      }
      case 'D': {//Elimina un elemento en la tabla
        //Actualizan las listas 
        var indexTemp = this.listadoResultado.findIndex(item => item.catCodigo === afCategoriasTO.catCodigo);
        let listaTemporal = [...this.listadoResultado];
        listaTemporal.splice(indexTemp, 1);
        this.listadoResultado = listaTemporal;
        break;
      }
    }
  }

  generarOpciones() {
    let perConsultar = true;
    let perInactivar = this.utilService.verificarPermiso(LS.ACCION_EDITAR, this) && !this.objetoSeleccionado.catInactivo;
    let perActivar = this.utilService.verificarPermiso(LS.ACCION_EDITAR, this) && this.objetoSeleccionado.catInactivo;
    let perEditar = this.utilService.verificarPermiso(LS.ACCION_EDITAR, this);
    let perEliminar = this.utilService.verificarPermiso(LS.ACCION_ELIMINAR, this);
    this.opciones = [
      { label: LS.ACCION_CONSULTAR, icon: LS.ICON_CONSULTAR, disabled: !perConsultar, command: () => perConsultar ? this.operacionesGrupoClasificacion(LS.ACCION_CONSULTAR) : null },
      { label: LS.ACCION_EDITAR, icon: LS.ICON_EDITAR, disabled: !perEditar, command: () => perEditar ? this.operacionesGrupoClasificacion(LS.ACCION_EDITAR) : null },
      { label: LS.ACCION_ELIMINAR, icon: LS.ICON_ELIMINAR, disabled: !perEliminar, command: () => perEliminar ? this.operacionesGrupoClasificacion(LS.ACCION_ELIMINAR) : null },
      this.objetoSeleccionado.catInactivo ?
        {
          label: LS.ACCION_ACTIVAR,
          icon: LS.ICON_ACTIVAR,
          disabled: !perActivar,
          command: () => perActivar ? this.operacionesGrupoClasificacion(LS.ACCION_EDITAR_ESTADO) : null
        }
        :
        {
          label: LS.ACCION_INACTIVAR,
          icon: LS.ICON_INACTIVAR,
          disabled: !perInactivar,
          command: () => perInactivar ? this.operacionesGrupoClasificacion(LS.ACCION_EDITAR_ESTADO) : null
        }
    ];
  }

  inicializarAtajos() {
    this.atajoService.add(new Hotkey(LS.ATAJO_AYUDA, (event: KeyboardEvent): boolean => {
      window.open('http://google.com', '_blank');
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnActivarGrupoClasificacion') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscarGrupoClasificacion') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirGrupoClasificacion') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnExportarGrupoClasificacion') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_NUEVO, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnNuevoGrupoClasificacion') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_EDITAR, (event: KeyboardEvent): boolean => {
      if (this.listadoResultado.length > 0) {
        this.operacionesGrupoClasificacion(LS.ACCION_EDITAR);
      }
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_ELIMINAR, (event: KeyboardEvent): boolean => {
      if (this.listadoResultado.length > 0) {
        this.operacionesGrupoClasificacion(LS.ACCION_ELIMINAR);
      }
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_GUARDAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnGuardarGrupoClasificacion') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_CANCELAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnCancelarGrupoClasificacion') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
  }

  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.limpiarResultado();
    this.obtenerEstructura();
  }

  limpiarResultado() {
    this.gridApi = null;
    this.gridColumnApi = null;
    this.listadoResultado = [];
    this.filasTiempo.resetearContador();
    this.actualizarFilas();
  }

  obtenerEstructura() {
    this.planContableService.getTamanioListaConEstructura({ empresa: this.empresaSeleccionada.empCodigo }, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        this.tamanioEstructura = data[0].estGrupo1 + data[0].estGrupo2 + data[0].estGrupo3 + data[0].estGrupo4 + data[0].estGrupo5 + data[0].estGrupo6;
      }).catch(err => {
        this.utilService.handleError(err, this);
      })
  }

  validarCuentaActivo() {
    if (this.cuentaActivo !== this.afCategoriasTO.catCuentaActivo) {
      this.cuentaActivo = null;
      this.afCategoriasTO.catCuentaActivo = null;
    }
  }

  validarCuentaDepreciacion() {
    if (this.cuentaDepreciacion !== this.afCategoriasTO.catCuentaDepreciacion) {
      this.cuentaDepreciacion = null;
      this.afCategoriasTO.catCuentaDepreciacion = null;
    }
  }

  validarCuentaDepreciacionAcumulado() {
    if (this.cuentaDepreciacionAcum !== this.afCategoriasTO.catCuentaDepreciacionAcumulada) {
      this.cuentaDepreciacionAcum = null;
      this.afCategoriasTO.catCuentaDepreciacionAcumulada = null;
    }
  }

  soloNumeros(event) {
    return this.utilService.soloNumeros(event);
  }

  validarPorcentaje(): boolean {
    this.porcentajeValido = this.afCategoriasTO.catPorcentajeDepreciacion > 0;
    return this.porcentajeValido;
  }

  validarVidaUtil(): boolean {
    this.vidaUtilValido = this.afCategoriasTO.catVidaUtil > 0;
    return this.vidaUtilValido;
  }

  //BUSQUEDAS
  buscarCuentaActivo(event) {
    if (this.utilService.validarKeyBuscar(event.keyCode)) {
      if (!(this.afCategoriasTO.catCuentaActivo && this.afCategoriasTO.catCuentaActivo === this.cuentaActivo)) {
        this.afCategoriasTO.catCuentaActivo = this.afCategoriasTO.catCuentaActivo === '' ? null : this.afCategoriasTO.catCuentaActivo;
        if (this.afCategoriasTO.catCuentaActivo) {
          let parametroBusquedaConCuentas = { empresa: this.empresaSeleccionada.empCodigo, buscar: this.afCategoriasTO.catCuentaActivo, ctaGrupo: null };
          event.srcElement.blur();
          event.preventDefault();
          const modalRef = this.modalService.open(ListadoPlanCuentasComponent, { size: 'lg', backdrop: 'static' });
          modalRef.componentInstance.filtrosBusquedaPlanCuenta = parametroBusquedaConCuentas;
          modalRef.componentInstance.tamanioEstructura = this.tamanioEstructura;
          modalRef.result.then((result) => {
            this.cuentaActivo = result ? result.cuentaCodigo : null;
            this.afCategoriasTO.catCuentaActivo = result ? result.cuentaCodigo : null;
            document.getElementById('cuentaActivo').focus();
          }, (reason) => {//Cuando se cierra sin un dato
            let element: HTMLElement = document.getElementById('cuentaActivo') as HTMLElement;
            element ? element.focus() : null;
          });
        }
      }
    }
  }

  buscarCuentaDepreciacion(event) {
    if (this.utilService.validarKeyBuscar(event.keyCode)) {
      if (!(this.afCategoriasTO.catCuentaDepreciacion && this.afCategoriasTO.catCuentaDepreciacion === this.cuentaDepreciacion)) {
        this.afCategoriasTO.catCuentaDepreciacion = this.afCategoriasTO.catCuentaDepreciacion === '' ? null : this.afCategoriasTO.catCuentaDepreciacion;
        if (this.afCategoriasTO.catCuentaDepreciacion) {
          let parametroBusquedaConCuentas = { empresa: this.empresaSeleccionada.empCodigo, buscar: this.afCategoriasTO.catCuentaDepreciacion, ctaGrupo: null };
          event.srcElement.blur();
          event.preventDefault();
          const modalRef = this.modalService.open(ListadoPlanCuentasComponent, { size: 'lg', backdrop: 'static' });
          modalRef.componentInstance.filtrosBusquedaPlanCuenta = parametroBusquedaConCuentas;
          modalRef.componentInstance.tamanioEstructura = this.tamanioEstructura;
          modalRef.result.then((result) => {
            this.cuentaDepreciacion = result ? result.cuentaCodigo : null;
            this.afCategoriasTO.catCuentaDepreciacion = result ? result.cuentaCodigo : null;
            document.getElementById('cuentaDepreciacion').focus();
          }, (reason) => {//Cuando se cierra sin un dato
            let element: HTMLElement = document.getElementById('cuentaDepreciacion') as HTMLElement;
            element ? element.focus() : null;
          });
        }
      }
    }
  }

  buscarCuentaDepreciacionAcum(event) {
    if (this.utilService.validarKeyBuscar(event.keyCode)) {
      if (!(this.afCategoriasTO.catCuentaDepreciacionAcumulada && this.afCategoriasTO.catCuentaDepreciacionAcumulada === this.cuentaDepreciacionAcum)) {
        this.afCategoriasTO.catCuentaDepreciacionAcumulada = this.afCategoriasTO.catCuentaDepreciacionAcumulada === '' ? null : this.afCategoriasTO.catCuentaDepreciacionAcumulada;
        if (this.afCategoriasTO.catCuentaDepreciacionAcumulada) {
          let parametroBusquedaConCuentas = { empresa: this.empresaSeleccionada.empCodigo, buscar: this.afCategoriasTO.catCuentaDepreciacionAcumulada, ctaGrupo: null };
          event.srcElement.blur();
          event.preventDefault();
          const modalRef = this.modalService.open(ListadoPlanCuentasComponent, { size: 'lg', backdrop: 'static' });
          modalRef.componentInstance.filtrosBusquedaPlanCuenta = parametroBusquedaConCuentas;
          modalRef.componentInstance.tamanioEstructura = this.tamanioEstructura;
          modalRef.result.then((result) => {
            this.cuentaDepreciacionAcum = result ? result.cuentaCodigo : null;
            this.afCategoriasTO.catCuentaDepreciacionAcumulada = result ? result.cuentaCodigo : null;
            document.getElementById('cuentaDepreciacionAcumulado').focus();
          }, (reason) => {//Cuando se cierra sin un dato
            let element: HTMLElement = document.getElementById('cuentaDepreciacionAcumulado') as HTMLElement;
            element ? element.focus() : null;
          });
        }
      }
    }
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = [
      {
        headerName: LS.TAG_CODIGO,
        field: 'catCodigo',
        width: 50
      },
      {
        headerName: LS.TAG_DESCRIPCION,
        field: 'catDescripcion',
        width: 100
      },
      {
        headerName: LS.TAG_VIDA_UTIL,
        field: 'catVidaUtil',
        width: 80,
        cellClass: 'text-sm-right'
      },
      {
        headerName: LS.TAG_PORCENTAJE_DEPRECIACION,
        field: 'catPorcentajeDepreciacion',
        width: 80,
        cellClass: 'text-sm-right',
        valueFormatter: this.numberFormatter
      },
      {
        headerName: LS.TAG_INACTIVO,
        headerClass: 'text-md-center',//Clase a nivel de th
        field: 'catInactivo',
        width: LS.WIDTH_OPCIONES,
        cellRenderer: "inputEstado",
        cellClass: 'text-md-center'
      },
      {
        headerName: LS.TAG_OPCIONES,
        headerClass: 'text-md-center',//Clase a nivel de th
        field: '',
        width: LS.WIDTH_OPCIONES,
        cellRenderer: "botonOpciones",
        cellClass: 'text-md-center',
        headerComponent: 'toolTip',
        headerComponentParams: {
          class: LS.ICON_OPCIONES,
          tooltip: LS.TAG_OPCIONES,
          text: ''
        }
      },
    ];
    this.columnDefsSelected = this.columnDefs.slice();
    this.rowSelection = "single";
    this.context = { componentParent: this };
    this.frameworkComponents = {
      botonOpciones: BotonOpcionesComponent,
      toolTip: TooltipReaderComponent,
      inputEstado: InputEstadoComponent
    };
    this.components = {};
  }

  numberFormatter(params) {
    return new DecimalPipe('en-US').transform(params.value, '1.2-2');
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.actualizarFilas();
    this.redimencionarColumnas();
    this.seleccionarPrimerFila();
  }

  redimencionarColumnas() {
    this.gridApi ? this.gridApi.sizeColumnsToFit() : null;
  }

  autoSizeAll() {
    var allColumnIds = [];
    this.gridColumnApi.getAllColumns().forEach(function (column) {
      allColumnIds.push(column.colId);
    });
    this.gridColumnApi.autoSizeColumns(allColumnIds);
  }

  seleccionarPrimerFila() {
    if (this.gridApi) {
      // scrolls to the first column
      var firstCol = this.gridColumnApi.getAllDisplayedColumns()[0];
      // sets focus into the first grid cell
      this.gridApi.setFocusedCell(0, firstCol);
    }
  }

  mostrarOpciones(event, dataSelected) {
    this.mostrarContextMenu(dataSelected, event);
  }

  mostrarContextMenu(data, event) {
    this.objetoSeleccionado = data;
    this.generarOpciones();
    this.menuOpciones.show(event);
    event.stopPropagation();
  }

  refreshGrid() {
    this.gridApi ? this.gridApi.refreshCells() : null;
    setTimeout(() => { this.actualizarFilas(); }, 50);
  }

  actualizarFilas() {
    this.filasTiempo.filas = this.gridApi ? this.gridApi.getDisplayedRowCount() : 0;
    this.filasService.actualizarFilas(this.filasTiempo.filas, this.filasTiempo.getTiempo());
  }
  //#endregion

}
