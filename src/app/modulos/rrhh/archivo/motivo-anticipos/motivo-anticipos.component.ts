import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { LS } from '../../../../constantes/app-constants';
import { ActivatedRoute } from '@angular/router';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { MenuItem } from 'primeng/api';
import { GridApi } from 'ag-grid';
import { ContextMenu } from 'primeng/contextmenu';
import { MotivoAnticiposService } from './motivo-anticipos.service';
import { RhAnticipoMotivo } from '../../../../entidades/rrhh/RhAnticipoMotivo';
import { ConTipo } from '../../../../entidades/contabilidad/ConTipo';
import { TipoContableService } from '../../../contabilidad/archivo/tipo-contable/tipo-contable.service';
import { NgForm } from '@angular/forms';
import { AuthService } from '../../../../serviciosgenerales/auth.service';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';

@Component({
  selector: 'app-motivo-anticipos',
  templateUrl: './motivo-anticipos.component.html'
})
export class MotivoAnticiposComponent implements OnInit {

  public listaEmpresas: Array<PermisosEmpresaMenuTO> = new Array();
  public empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  public parametrosFormulario: any = {};
  public constantes: any = LS;
  public isScreamMd: boolean = true;
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public filtroGlobal: string = "";
  public cargando: boolean = false;
  public vistaFormulario: boolean = false;
  public activar: boolean = false;
  public accion: string = null;
  public objetoSeleccionado: RhAnticipoMotivo = new RhAnticipoMotivo();
  public motivoAnticipo: RhAnticipoMotivo = new RhAnticipoMotivo();
  public listadoMotivoAnticipos: Array<RhAnticipoMotivo> = new Array();
  public tiposContables: Array<ConTipo> = new Array();
  public tipoSeleccionado: ConTipo = new ConTipo();

  //AG-GRID
  public opciones: MenuItem[];
  public gridApi: GridApi;
  public gridColumnApi: any;
  public columnDefs: Array<object> = [];
  public columnDefsSelected: Array<object> = [];
  public rowSelection: string;
  public context;
  @ViewChild("menuOpciones") menuOpciones: ContextMenu;
  //formulario validar cancelar
  @ViewChild("frmDatos") frmDatos: NgForm;
  public valoresIniciales: any;

  constructor(
    private route: ActivatedRoute,
    private filasService: FilasResolve,
    private toastr: ToastrService,
    private utilService: UtilService,
    public motivoAnticipoService: MotivoAnticiposService,
    private tipoContableService: TipoContableService,
    private auth: AuthService,
    private archivoService: ArchivoService
  ) { }

  ngOnInit() {
    this.listaEmpresas = this.route.snapshot.data['anticipoMotivo'];
    this.isScreamMd = window.innerWidth <= 576 ? false : true;
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.motivoAnticipoService.definirAtajosDeTeclado();
    this.iniciarAgGrid();
  }

  cancelar() {
    switch (this.accion) {
      case LS.ACCION_EDITAR:
      case LS.ACCION_CREAR:
        if (this.utilService.puedoCancelar(this.valoresIniciales, this.frmDatos)) {
          this.resetearFormulario();
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
              this.resetearFormulario();
            }
          });
        }
        break;
      default:
        this.resetearFormulario();
    }
  }

  resetearFormulario() {
    this.accion = null;
    this.vistaFormulario = false;
    this.listadoMotivoAnticipos.length === 0 ? this.activar = false : null;
  }

  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.activar = false;
    this.listarConTipo();
    this.limpiarResultado();
    this.buscarMotivoAnticipo(false);
  }

  extraerValoresIniciales() {
    setTimeout(() => {
      this.valoresIniciales = JSON.parse(JSON.stringify(this.frmDatos ? this.frmDatos.value : null));
    }, 50);
  }

  limpiarResultado() {
    this.filasService.actualizarFilas("0", "0");
    this.filasTiempo.resetearContador();
    this.resetearFormulario();
    this.listadoMotivoAnticipos = [];
  }

  listarConTipo() {
    this.cargando = true;
    this.tipoContableService.listarConTipo({ empresa: LS.KEY_EMPRESA_SELECT, activo: true }, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarConTipo(data) {
    this.cargando = false;
    this.tiposContables = data;
    this.tipoSeleccionado = this.tiposContables[0] ? this.tiposContables[0] : null;
  }

  verificarPermiso(mostraMensaje): boolean {
    return this.motivoAnticipoService.verificarPermiso(this.accion, this.empresaSeleccionada, mostraMensaje);
  }

  //Operaciones
  buscarMotivoAnticipo(estado) {
    this.limpiarResultado();
    this.filasTiempo.iniciarContador();
    this.cargando = true;
    let parametro = { empresa: LS.KEY_EMPRESA_SELECT, estado: estado };
    this.motivoAnticipoService.listarMotivoAnticipos(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarMotivoAnticipos(data) {
    this.filasTiempo.finalizarContador();
    this.cargando = false;
    this.listadoMotivoAnticipos = data;
  }

  nuevaMotivoAnticipo() {
    this.motivoAnticipo = new RhAnticipoMotivo();
    this.vistaFormulario = true;
    this.accion = LS.ACCION_CREAR;
    this.focusDetalle();
    this.extraerValoresIniciales();
  }

  consultarMotivoAnticipo() {
    this.accion = LS.ACCION_CONSULTAR;
    this.motivoAnticipo = this.objetoSeleccionado;
    this.tipoSeleccionado = this.seleccionarConTipo();
    this.vistaFormulario = true;
  }

  insertarMotivo(frmDatos) {
    this.cargando = true;
    if (this.validarAntesDeEnviar(frmDatos)) {
      this.motivoAnticipo.rhAnticipoMotivoPK.motEmpresa = LS.KEY_EMPRESA_SELECT;
      this.motivoAnticipo.usrCodigo = this.auth.getCodigoUser();
      this.motivoAnticipo.usrEmpresa = LS.KEY_EMPRESA_SELECT;
      this.motivoAnticipo.conTipo = this.tipoSeleccionado;
      this.motivoAnticipoService.guardarMotivoAnticipos({ rhAnticipoMotivo: this.motivoAnticipo }, this, LS.KEY_EMPRESA_SELECT);
    }
  }

  despuesDeGuardarMotivoAnticipos(data) {
    this.motivoAnticipo = data.extraInfo ? data.extraInfo.motivo : this.motivoAnticipo;
    this.toastr.info(data.operacionMensaje, LS.TAG_AVISO);
    this.listadoMotivoAnticipos.unshift(this.motivoAnticipo);
    this.gridApi ? this.gridApi.updateRowData({ add: [this.motivoAnticipo], addIndex: 0 }) : null;
    this.cargando = false;
    this.resetearFormulario();
  }

  modificarMotivo(frmDatos) {
    this.cargando = true;
    if (this.validarAntesDeEnviar(frmDatos)) {
      if (!this.utilService.puedoCancelar(this.valoresIniciales, frmDatos)) {
        this.motivoAnticipo.conTipo = this.tipoSeleccionado;
        this.motivoAnticipoService.modificarMotivoAnticipos({ rhAnticipoMotivo: this.motivoAnticipo }, this, LS.KEY_EMPRESA_SELECT);
      } else {
        this.toastr.warning(LS.MSJ_NO_SE_REALIZO_NINGUN_CAMBIO, LS.TOAST_INFORMACION);
        this.cargando = false;
        this.resetearFormulario();
      }
    }
  }

  despuesDeModificarMotivoAnticipos(data) {
    this.toastr.info(data.operacionMensaje, LS.TAG_AVISO);
    var indexTemp = this.listadoMotivoAnticipos.findIndex(item => item.rhAnticipoMotivoPK.motDetalle === this.motivoAnticipo.rhAnticipoMotivoPK.motDetalle);
    this.listadoMotivoAnticipos[indexTemp] = this.motivoAnticipo;
    this.gridApi.updateRowData({ update: [this.objetoSeleccionado] });
    this.cargando = false;
    this.resetearFormulario();
  }

  eliminarMotivoAnticipo() {
    let parametros = {
      title: LS.MSJ_TITULO_ELIMINAR,
      texto: LS.MSJ_PREGUNTA_ELIMINAR,
      type: LS.SWAL_WARNING,
      confirmButtonText: LS.MSJ_SI_ELIMINAR,
      cancelButtonText: LS.MSJ_CANCELAR,
      confirmButtonColor: LS.COLOR_ELIMINAR
    }
    this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
      if (respuesta) {//Si presiona CONTABILIZAR
        this.cargando = true;
        let parametro = {
          rhAnticipoMotivo: this.objetoSeleccionado
        }
        this.motivoAnticipoService.eliminarMotivoAnticipos(parametro, this, LS.KEY_EMPRESA_SELECT);
      } else {//Cierra el formulario
        this.cargando = false;
      }
    });
  }

  despuesDeEliminarMotivoAnticipos(data) {
    this.toastr.info(data.operacionMensaje, LS.TAG_AVISO);
    var indexTemp = this.listadoMotivoAnticipos.findIndex(item => item.rhAnticipoMotivoPK.motDetalle === this.motivoAnticipo.rhAnticipoMotivoPK.motDetalle);
    this.listadoMotivoAnticipos.splice(indexTemp, 1);
    this.gridApi.updateRowData({ remove: [this.objetoSeleccionado] });
    this.cargando = false;
    this.resetearFormulario();
  }

  imprimirMotivoAnticipo() {
    if (this.motivoAnticipoService.verificarPermiso(LS.ACCION_EXPORTAR, this.empresaSeleccionada, true)) {
      this.cargando = true;
      let parametros = {
        lista: this.listadoMotivoAnticipos,
      };
      this.archivoService.postPDF("todocompuWS/rrhhWebController/generarReporteRhAnticipoMotivo", parametros, this.empresaSeleccionada)
        .then(data => {
          if (data && data._body && data._body.byteLength > 0) {
            this.utilService.descargarArchivoPDF("MotivoAnticipo_" + this.utilService.obtenerHorayFechaActual() + ".pdf", data);
          } else {
            this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
          }
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  exportarMotivoAnticipo() {
    if (this.motivoAnticipoService.verificarPermiso(LS.ACCION_EXPORTAR, this.empresaSeleccionada, true)) {
      this.cargando = true;
      let parametros = {
        lista: this.listadoMotivoAnticipos,
      };
      this.archivoService.postExcel("todocompuWS/rrhhWebController/exportarRhAnticipoMotivo", parametros, this.empresaSeleccionada)
        .then(data => {
          if (data && data._body && data._body.byteLength > 0) {
            this.utilService.descargarArchivoExcel(data._body, "MotivoAnticipo_");
          } else {
            this.toastr.warning(LS.MSJ_ERROR_EXPORTAR, LS.TAG_AVISO);
          }
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  //Otros
  generarOpciones() {
    let perConsultar = true;
    let perModificar = this.empresaSeleccionada.listaSisPermisoTO.gruModificar;
    let perEliminar = this.empresaSeleccionada.listaSisPermisoTO.gruEliminar;
    let perInactivar = this.empresaSeleccionada.listaSisPermisoTO.gruModificarEmpleados && !this.objetoSeleccionado.motInactivo;
    let perActivar = this.empresaSeleccionada.listaSisPermisoTO.gruModificarEmpleados && this.objetoSeleccionado.motInactivo;
    this.opciones = [
      {
        label: LS.ACCION_CONSULTAR,
        icon: LS.ICON_CONSULTAR,
        disabled: !perConsultar,
        command: () => perConsultar ? this.consultarMotivoAnticipo() : null
      },
      {
        label: LS.ACCION_EDITAR,
        icon: LS.ICON_EDITAR,
        disabled: !perModificar,
        command: () => perModificar ? this.paraModificarMotivoAnticipo() : null
      },
      {
        label: LS.ACCION_ACTIVAR,
        icon: LS.ICON_ACTIVAR,
        disabled: !perActivar,
        command: () => perActivar ? this.inactivar(false) : null
      },
      {
        label: LS.ACCION_INACTIVAR,
        icon: LS.ICON_INACTIVAR,
        disabled: !perInactivar,
        command: () => perModificar ? this.inactivar(true) : null
      },
      {
        label: LS.ACCION_ELIMINAR,
        icon: LS.ICON_ELIMINAR,
        disabled: !perEliminar,
        command: () => perEliminar ? this.eliminarMotivoAnticipo() : null
      }
    ];
  }

  focusDetalle() {
    setTimeout(() => {
      let element = document.getElementById('motDetalle');
      element ? element.focus() : null;
    }, 50);
  }

  paraModificarMotivoAnticipo() {
    this.accion = LS.ACCION_EDITAR;
    this.motivoAnticipo = this.objetoSeleccionado;
    this.tipoSeleccionado = this.seleccionarConTipo();
    this.vistaFormulario = true;
    this.extraerValoresIniciales();
  }

  seleccionarConTipo(): ConTipo {
    let tipo = this.tiposContables.find(item => item.conTipoPK.tipCodigo == this.objetoSeleccionado.conTipo.conTipoPK.tipCodigo);
    return tipo ? tipo : null;
  }

  validarAntesDeEnviar(form: NgForm): boolean {
    let validado = true;
    if (!this.verificarPermiso(true)) {
      this.cargando = false;
      return false;
    }
    let formTouched = this.utilService.establecerFormularioTocado(form);
    if (!(formTouched && form && form.valid)) {
      this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
      validado = false;
    }
    this.cargando = validado;
    return validado;
  }

  inactivar(estado) {
    let parametros;
    let accion;
    if (!estado) {
      accion = "A";
      parametros = {
        title: LS.ACCION_ACTIVAR,
        texto: LS.MSJ_PREGUNTA_ACTIVAR + "<br> " + LS.RRHH_MOTIVO_ANTICIPO + ": " + this.objetoSeleccionado.rhAnticipoMotivoPK.motDetalle,
        type: LS.SWAL_QUESTION,
        confirmButtonText: LS.LABEL_ACEPTAR,
        cancelButtonText: LS.LABEL_CANCELAR
      };
    } else {
      accion = "I";
      parametros = {
        title: LS.ACCION_INACTIVAR,
        texto: LS.MSJ_PREGUNTA_INACTIVAR + "<br> " + LS.RRHH_MOTIVO_ANTICIPO + ": " + this.objetoSeleccionado.rhAnticipoMotivoPK.motDetalle,
        type: LS.SWAL_QUESTION,
        confirmButtonText: LS.LABEL_ACEPTAR,
        cancelButtonText: LS.LABEL_CANCELAR
      };
    }
    this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
      if (respuesta) {//Si presiona CONTABILIZAR
        this.cargando = true;
        this.objetoSeleccionado.motInactivo = estado
        let parametro = {
          rhAnticipoMotivo: this.objetoSeleccionado,
          accion: accion
        }
        this.motivoAnticipoService.modificarMotivoAnticipos(parametro, this, LS.KEY_EMPRESA_SELECT);
      } else {//Cierra el formulario
        this.cargando = false;
      }
    });
  }

  //#region [R3] [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.motivoAnticipoService.generarColumnas();
    this.columnDefsSelected = this.columnDefs.slice();
    this.rowSelection = "single";
    this.context = { componentParent: this };
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.actualizarFilas();
    this.seleccionarPrimerFila();
    this.redimensionarColumnas();
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

  redimensionarColumnas() {
    this.gridApi ? this.gridApi.sizeColumnsToFit() : null;
  }

  seleccionarPrimerFila() {
    if (this.gridApi) {
      var firstCol = this.gridColumnApi.getAllDisplayedColumns()[0];
      this.gridApi.setFocusedCell(0, firstCol);
    }
  }

  filaFocused(event) {
    let fila = this.gridApi ? this.gridApi.getRowNode(event.rowIndex) : null;
    this.objetoSeleccionado = fila ? fila.data : null;
  }

  refreshGrid() {
    this.gridApi ? this.gridApi.refreshCells() : null;
    setTimeout(() => { this.actualizarFilas(); }, 50);
  }

  filtrarRapido() {
    this.gridApi ? this.gridApi.setQuickFilter(this.filtroGlobal) : null
  }

  actualizarFilas() {
    this.filasTiempo.filas = this.gridApi ? this.gridApi.getDisplayedRowCount() : 0;
    this.filasService.actualizarFilas(this.filasTiempo.filas, this.filasTiempo.getTiempo());
  }
  //#endregion

  //RELOAD
  @HostListener("window:beforeunload", ["$event"])
  unloadHandler(event: Event) {
    switch (this.accion) {
      case LS.ACCION_EDITAR:
      case LS.ACCION_NUEVO:
      case LS.ACCION_CREAR:
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
}
