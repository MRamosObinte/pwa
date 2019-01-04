import { Component, OnInit, HostListener } from '@angular/core';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { LS } from '../../../../constantes/app-constants';
import { AfDepreciacionMotivoTO } from '../../../../entidadesTO/activoFijo/AfDepreciacionMotivoTO';
import { MenuItem } from '../../../../../../node_modules/primeng/api';
import { ActivatedRoute } from '../../../../../../node_modules/@angular/router';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from '../../../../../../node_modules/ngx-toastr';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { HotkeysService, Hotkey } from '../../../../../../node_modules/angular2-hotkeys';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { AuthService } from '../../../../serviciosgenerales/auth.service';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { MotivoDepreciacionService } from './motivo-depreciacion.service';
import { ConTipoTO } from '../../../../entidadesTO/contabilidad/ConTipoTO';
import { TipoContableService } from '../../../contabilidad/archivo/tipo-contable/tipo-contable.service';
import { AfUbicacionesTO } from '../../../../entidadesTO/activoFijo/AfUbicacionesTO';
import { UbicacionService } from '../ubicacion/ubicacion.service';
import { NgForm } from '../../../../../../node_modules/@angular/forms';

@Component({
  selector: 'app-motivo-depreciacion',
  templateUrl: './motivo-depreciacion.component.html',
  styleUrls: ['./motivo-depreciacion.component.css']
})
export class MotivoDepreciacionComponent implements OnInit {
  public constantes: any = LS;
  public cargando: boolean = false;
  public activar: boolean = false;
  public isScreamMd: boolean = true;
  public isSeleccionarPrimeraFila: boolean = true;
  public accion: string = null;
  public frmTitulo: string = LS.TITULO_FILTROS;
  public classTitulo: string = LS.ICON_FILTRAR;
  public filtroGlobal: string = "";
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public listadoResultado: Array<AfDepreciacionMotivoTO> = [];
  public listadoFiltrado: Array<AfDepreciacionMotivoTO> = [];
  public listaTipos: Array<ConTipoTO> = [];
  public listaUbicaciones: Array<AfUbicacionesTO> = [];
  public opciones: MenuItem[];
  public empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  public objetoSeleccionado: AfDepreciacionMotivoTO = new AfDepreciacionMotivoTO();
  public afDepreciacionMotivoTO: AfDepreciacionMotivoTO = new AfDepreciacionMotivoTO();
  public tipoSeleccionado: ConTipoTO = new ConTipoTO();
  public ubicacionSeleccionado: AfUbicacionesTO = new AfUbicacionesTO();
  public indexTable: number = 0;
  public columnas: Array<object> = [];
  public columnasSeleccionadas: Array<object> = [];
  public filasTiempo: FilasTiempo = new FilasTiempo();

  constructor(
    private route: ActivatedRoute,
    private api: ApiRequestService,
    private toastr: ToastrService,
    private filasService: FilasResolve,
    private atajoService: HotkeysService,
    private utilService: UtilService,
    private auth: AuthService,
    private archivoService: ArchivoService,
    private motivoDepreciacionService: MotivoDepreciacionService,
    private tipoContableService: TipoContableService,
    private ubicacionService: UbicacionService
  ) { }

  ngOnInit() {
    this.constantes = LS; //Hace referncia a los constantes
    this.listaEmpresas = this.route.snapshot.data['motivoDepreciacion'];
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo : null;
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.frmTitulo = LS.TITULO_FILTROS;
    this.classTitulo = LS.ICON_FILTRAR;
    this.isScreamMd = window.innerWidth <= 576 ? false : true;
    this.inicializarAtajos();
    this.inicializarTabla();
  }

  listarDepreciacionMotivo() {
    this.cargando = true;
    this.filasTiempo.iniciarContador();
    this.motivoDepreciacionService.listarAfDepreciacionMotivoTO({ empresa: LS.KEY_EMPRESA_SELECT }, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarAfDepreciacionMotivoTO(data) {
    this.listadoResultado = data;
    this.listadoFiltrado = this.listadoResultado.slice();
    this.cargando = false;
    this.filasTiempo.finalizarContador();
    this.seleccionarPrimeraFila();
    this.actualizarFilas();
  }

  listarTipos() {
    this.listaTipos = [];
    this.cargando = true;
    let parametro = { empresa: LS.KEY_EMPRESA_SELECT };
    this.tipoContableService.listarTipoContable(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarTipoContable(listaTipos) {
    this.listaTipos = listaTipos;
    if (this.listaTipos.length > 0) {
      this.tipoSeleccionado = this.tipoSeleccionado && this.tipoSeleccionado.tipCodigo ? this.listaTipos.find(item => item.tipCodigo === this.tipoSeleccionado.tipCodigo) : this.listaTipos[0];
    } else {
      this.tipoSeleccionado = null;
    }
    this.cargando = false;
  }

  listarUbicaciones() {
    this.cargando = true;
    this.ubicacionService.listarAfUbicacionesTO({ empresa: LS.KEY_EMPRESA_SELECT }, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarAfUbicacionesTO(data) {
    this.listaUbicaciones = data;
    if (this.listaUbicaciones.length > 0) {
      this.ubicacionSeleccionado = this.ubicacionSeleccionado && this.ubicacionSeleccionado.ubiCodigo ? this.listaUbicaciones.find(item => item.ubiCodigo === this.ubicacionSeleccionado.ubiCodigo) : this.listaUbicaciones[0];
    } else {
      this.ubicacionSeleccionado = null;
    }
    this.cargando = false;
  }

  operacionesMotivoDepreciacion(opcion) {
    switch (opcion) {
      case LS.ACCION_ELIMINAR: {
        if (this.utilService.verificarPermiso(LS.ACCION_ELIMINAR, this, true)) {
          this.afDepreciacionMotivoTO = new AfDepreciacionMotivoTO(this.objetoSeleccionado);
          this.accion = LS.ACCION_ELIMINAR;
          this.frmTitulo = LS.TITULO_FILTROS;
          this.classTitulo = LS.ICON_FILTRAR;
          this.eliminarDepreciacionMotivo();
        }
        break;
      }
      case LS.ACCION_CREAR: {
        if (this.utilService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
          this.afDepreciacionMotivoTO = new AfDepreciacionMotivoTO();
          this.accion = LS.ACCION_CREAR;
          this.activar = false;
          this.frmTitulo = LS.TITULO_FORM_NUEVO_MOTIVO_DEPRECIACION;
          this.classTitulo = LS.ICON_FILTRO_NUEVO;
        }
        break;
      }
      case LS.ACCION_EDITAR: {
        if (this.utilService.verificarPermiso(LS.ACCION_EDITAR, this, true)) {
          this.afDepreciacionMotivoTO = new AfDepreciacionMotivoTO(this.objetoSeleccionado);
          this.accion = LS.ACCION_EDITAR;
          this.activar = false;
          this.frmTitulo = LS.TITULO_FORM_EDITAR_MOTIVO_DEPRECIACION;
          this.classTitulo = LS.ICON_FILTRO_EDITAR;
        }
        break;
      }
    }
  }

  insertarDepreciacionMotivo(form: NgForm) {
    if (this.utilService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
      this.cargando = true;
      let formularioTocado = this.utilService.establecerFormularioTocado(form);
      if (formularioTocado && form && form.valid) {
        let motivoCopia = JSON.parse(JSON.stringify(this.afDepreciacionMotivoTO));
        this.setearValoresAObjetoAfDepreciacionMotivoTO(motivoCopia);
        this.api.post("todocompuWS/activosFijosWebController/insertarAfDepreciacionMotivoTO", { afDepreciacionMotivoTO: motivoCopia }, LS.KEY_EMPRESA_SELECT)
          .then(respuesta => {
            this.cargando = false;
            if (respuesta && respuesta.extraInfo) {
              motivoCopia.motSecuencial = respuesta.extraInfo;
              this.resetearFormulario();
              this.refrescarTabla(motivoCopia, 'I');
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

  actualizarDepreciacionMotivo(form: NgForm) {
    if (this.utilService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
      this.cargando = true;
      let formularioTocado = this.utilService.establecerFormularioTocado(form);
      if (form && form.valid && formularioTocado) {
        let motivoCopia = JSON.parse(JSON.stringify(this.afDepreciacionMotivoTO));
        this.setearValoresAObjetoAfDepreciacionMotivoTO(motivoCopia);
        this.api.post("todocompuWS/activosFijosWebController/modificarAfDepreciacionMotivoTO", { afDepreciacionMotivoTO: motivoCopia }, LS.KEY_EMPRESA_SELECT)
          .then(respuesta => {
            if (respuesta && respuesta.extraInfo) {
              this.refrescarTabla(motivoCopia, 'U');
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

  eliminarDepreciacionMotivo() {
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
          let parametro = { afDepreciacionMotivoTO: this.afDepreciacionMotivoTO };
          this.api.post("todocompuWS/activosFijosWebController/eliminarAfDepreciacionMotivoTO", parametro, LS.KEY_EMPRESA_SELECT)
            .then(respuesta => {
              if (respuesta && respuesta.extraInfo) {
                this.toastr.success(respuesta.operacionMensaje, LS.TOAST_CORRECTO);
                this.refrescarTabla(this.afDepreciacionMotivoTO, 'D');
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

  imprimirDepreciacionMotivo() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = { listadoAfDepreciacionMotivoTO: this.listadoResultado };
      this.archivoService.postPDF("todocompuWS/activosFijosWebController/generarReporteAfDepreciacionMotivoTO", parametros, this.empresaSeleccionada)
        .then(data => {
          if (data) {
            this.utilService.descargarArchivoPDF('ListadoDepreciacionMotivo' + this.utilService.obtenerHorayFechaActual() + '.pdf', data);
          } else {
            this.toastr.warning(LS.MSJ_NO_DATA, LS.TAG_AVISO);
          }
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  exportarDepreciacionMotivo() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = { listadoAfDepreciacionMotivoTO: this.listadoResultado };
      this.archivoService.postExcel("todocompuWS/activosFijosWebController/exportarReporteAfDepreciacionMotivoTO", parametros, this.empresaSeleccionada)
        .then(data => {
          if (data) {
            this.utilService.descargarArchivoExcel(data._body, 'ListadoDepreciacionMotivo_');
          } else {
            this.toastr.warning(LS.MSJ_NO_DATA, LS.TAG_AVISO);
          }
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  resetearFormulario() {
    this.accion = null;
    this.frmTitulo = LS.TITULO_FILTROS;
    this.classTitulo = LS.ICON_FILTRAR;
    this.afDepreciacionMotivoTO = new AfDepreciacionMotivoTO();
    this.actualizarFilas()
  }

  setearValoresAObjetoAfDepreciacionMotivoTO(objeto: AfDepreciacionMotivoTO) {
    objeto.usrEmpresa = LS.KEY_EMPRESA_SELECT;
    objeto.afUbicaciones.ubiEmpresa = LS.KEY_EMPRESA_SELECT;
    objeto.afUbicaciones.usrEmpresa = LS.KEY_EMPRESA_SELECT;
    objeto.conTipo.empCodigo = LS.KEY_EMPRESA_SELECT;
    objeto.afUbicaciones = this.ubicacionSeleccionado;
    objeto.afUbicacionDescripcion = this.ubicacionSeleccionado.ubiDescripcion;
    objeto.conTipo = this.tipoSeleccionado;
    objeto.conTipoDescripcion = this.tipoSeleccionado.tipDetalle;
    objeto.usrCodigo = this.auth.getCodigoUser();
  }

  refrescarTabla(afDepreciacionMotivoTO: AfDepreciacionMotivoTO, operacion: string) {
    switch (operacion) {
      case 'I': {//Insertar un elemento en la tabla
        //Si la lista tiene mas de un elemento lo guarda
        if (this.listadoResultado.length > 0) {
          let listaTemporal = [... this.listadoResultado];
          listaTemporal.unshift(afDepreciacionMotivoTO);
          this.listadoResultado = listaTemporal;
        }
        break;
      }
      case 'U': {//Actualiza un elemento en la tabla
        //Se actualiza la lista
        var indexTemp = this.listadoResultado.findIndex(item => item.motSecuencial === afDepreciacionMotivoTO.motSecuencial);
        let listaTemporal = [... this.listadoResultado];
        listaTemporal[indexTemp] = afDepreciacionMotivoTO;
        this.listadoResultado = listaTemporal;
        this.objetoSeleccionado = this.listadoResultado[indexTemp];
        this.indexTable = indexTemp;
        this.isSeleccionarPrimeraFila = false;
        break;
      }
      case 'D': {//Elimina un elemento en la tabla
        //Actualizan las listas 
        var indexTemp = this.listadoResultado.findIndex(item => item.motSecuencial === afDepreciacionMotivoTO.motSecuencial);
        this.listadoResultado = this.listadoResultado.filter((val, i) => i != indexTemp);
        this.indexTable = indexTemp;
        this.isSeleccionarPrimeraFila = false;
        break;
      }
    }
  }

  inicializarAtajos() {
    this.atajoService.add(new Hotkey(LS.ATAJO_AYUDA, (event: KeyboardEvent): boolean => {
      window.open('http://google.com', '_blank');
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnActivarDepreciacionMotivo') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscarDepreciacionMotivo') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirDepreciacionMotivo') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnExportarDepreciacionMotivo') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_NUEVO, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnNuevoDepreciacionMotivo') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_EDITAR, (event: KeyboardEvent): boolean => {
      if (this.listadoResultado.length > 0) {
        this.operacionesMotivoDepreciacion(LS.ACCION_EDITAR);
      }
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_ELIMINAR, (event: KeyboardEvent): boolean => {
      if (this.listadoResultado.length > 0) {
        this.operacionesMotivoDepreciacion(LS.ACCION_ELIMINAR);
      }
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_GUARDAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnGuardarDepreciacionMotivo') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_CANCELAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnCancelarDepreciacionMotivo') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
  }

  inicializarTabla() {
    this.columnas = [
      { field: 'conTipoDescripcion', header: LS.TAG_TIPO, width: '30%' },
      { field: 'afUbicacionDescripcion', header: LS.TAG_UBICACION, width: '30%' }
    ];
    this.columnasSeleccionadas = this.columnas;
  }

  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.tipoSeleccionado = null;
    this.ubicacionSeleccionado = null;
    this.limpiarResultado();
    this.listarTipos();
    this.listarUbicaciones();
  }

  limpiarResultado() {
    this.listadoFiltrado = [];
    this.listadoResultado = [];
    this.actualizarFilas();
  }

  generarOpciones() {
    this.indexTable = this.listadoFiltrado.indexOf(this.objetoSeleccionado);
    let perEditar = this.empresaSeleccionada.listaSisPermisoTO.gruModificar;
    let perEliminar = this.empresaSeleccionada.listaSisPermisoTO.gruEliminar;
    this.opciones = [
      { label: LS.ACCION_EDITAR, icon: LS.ICON_EDITAR, disabled: !perEditar, command: () => perEditar ? this.operacionesMotivoDepreciacion(LS.ACCION_EDITAR) : null },
      { label: LS.ACCION_ELIMINAR, icon: LS.ICON_ELIMINAR, disabled: !perEliminar, command: () => perEliminar ? this.operacionesMotivoDepreciacion(LS.ACCION_ELIMINAR) : null },
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
