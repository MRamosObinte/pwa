import { Component, OnInit, ViewChild, HostListener, Input } from '@angular/core';
import { InvListaBodegasTO } from '../../../../entidadesTO/inventario/InvListaBodegasTO';
import { MenuItem } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../../serviciosgenerales/auth.service';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { LS } from '../../../../constantes/app-constants';
import { BodegaService } from './bodega.service';
import { SectorService } from '../../../produccion/archivos/sector/sector.service';
import { PrdListaSectorTO } from '../../../../entidadesTO/Produccion/PrdListaSectorTO';
import { InvBodegaTO } from '../../../../entidadesTO/inventario/InvBodegaTO';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { NgForm } from '@angular/forms';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { ContextMenu } from 'primeng/contextmenu';
import { GridApi } from 'ag-grid';
import { BotonOpcionesComponent } from '../../../componentes/boton-opciones/boton-opciones.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { InputEstadoComponent } from '../../../componentes/input-estado/input-estado.component';

@Component({
  selector: 'app-bodega',
  templateUrl: './bodega.component.html',
  styleUrls: ['./bodega.component.css']
})
export class BodegaComponent implements OnInit {

  @Input() isModal: boolean;
  @Input() parametrosBusqueda;
  @ViewChild("excelDownload") excelDownload;
  public listaResultado: Array<InvListaBodegasTO> = [];
  public listaSectores: Array<PrdListaSectorTO> = [];
  public objetoSeleccionado: InvListaBodegasTO = new InvListaBodegasTO();
  public invBodegaTO: InvBodegaTO = new InvBodegaTO();
  public sectorSeleccionado: PrdListaSectorTO = new PrdListaSectorTO();
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public constantes: any = {};
  public innerWidth: number;
  public accion: string = null;
  public tituloForm: string = LS.TITULO_FILTROS;
  public classIcon: string = LS.ICON_FILTRAR;
  @Input() empresaSeleccionada: PermisosEmpresaMenuTO;
  public opciones: MenuItem[];
  public cargando: boolean = false;
  public activar: boolean = false;
  public isScreamMd: boolean = true;
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public filtroGlobal: string = "";
  public mostrarNuevo: boolean = true;
  //AG-GRID
  @ViewChild("menuOpciones") menuOpciones: ContextMenu;
  public gridApi: GridApi;
  public gridColumnApi: any;
  public columnDefs: Array<object> = [];
  public columnDefsSelected: Array<object> = [];
  public rowSelection: string;
  public components: any = {};
  public context;
  public frameworkComponents;
  //
  public vistaFormulario: boolean = false;
  public parametrosFormulario: any = {};

  constructor(
    private auth: AuthService,
    public activeModal: NgbActiveModal,
    private route: ActivatedRoute,
    private api: ApiRequestService,
    private toastr: ToastrService,
    private filasService: FilasResolve,
    private sectorService: SectorService,
    private bodegaService: BodegaService,
    private atajoService: HotkeysService,
    private archivoService: ArchivoService,
    private utilService: UtilService) {
  }

  ngOnInit() {
    this.constantes = LS;
    this.listaEmpresas = this.route.snapshot.data['bodegaInv'];
    this.innerWidth = window.innerWidth;
    this.isScreamMd = this.innerWidth <= 576 ? false : true;
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.generarAtajosTeclado();
    if (this.isModal) {
      this.listaBodegasModalTO();
    }
    this.iniciarAgGrid();
  }

  //LISTADOS
  /** Metodo para listar las bodegas dependiendo de la empresa*/
  listaBodegasTO(inactivos) {
    this.cargando = true;
    this.filtroGlobal = "";
    this.filasTiempo.iniciarContador();
    let parametro = { empresa: this.empresaSeleccionada.empCodigo, inactivo: inactivos };
    this.bodegaService.listarInvListaBodegasTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }
  //LISTADOS SI ES MODAL
  /** Metodo para listar las bodegas dependiendo de la empresa y si es modal*/
  listaBodegasModalTO() {
    this.filtroGlobal = "";
    this.cargando = true;
    this.bodegaService.listarInvListaBodegasTO(this.parametrosBusqueda, this, LS.KEY_EMPRESA_SELECT);
  }

  /** Metodo que se ejecuta despues de haber ejecutado el metodo listaBodegasTO()*/
  despuesDeListarInvListaBodegasTO(data) {
    this.filasTiempo.finalizarContador();
    this.listaResultado = data;
    this.cargando = false;
    this.filtrarRapido();
    if (this.isModal && data.length == 1) {
      this.activeModal.close(data[0]);
    }
  }

  /** Metodo para listar los sectores dependiendo de la empresa*/
  listarSectores() {
    this.cargando = true;
    let parametro = { empresa: LS.KEY_EMPRESA_SELECT, mostrarInactivo: false };
    this.sectorService.listarPrdListaSectorTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  /** Metodo que se ejecuta despues de haber ejecutado el metodo listarSectores()*/
  despuesDeListarSectores(listaSectores) {
    this.listaSectores = listaSectores ? listaSectores : [];
    if (this.listaSectores.length > 0) {
      this.sectorSeleccionado = this.sectorSeleccionado ? this.listaSectores.find(item => item.secCodigo === this.sectorSeleccionado.secCodigo) : this.listarSectores[0];
    } else {
      this.sectorSeleccionado = null;
    }
    this.cargando = false;
  }

  //OPERACIONES
  /** Metodo general, este metodo se ejecuta cada vez que se de clic en las opciones (Nuevo,editar o eliminar) para poder setear sus valores correspondientes*/
  operacionesBodega(opcion) {
    switch (opcion) {
      case LS.ACCION_ELIMINAR: {
        if (this.bodegaService.verificarPermiso(LS.ACCION_ELIMINAR, this, true)) {
          this.obtenerInvBodegaTO(this.objetoSeleccionado);
          this.accion = LS.ACCION_ELIMINAR;
          this.tituloForm = LS.TITULO_FILTROS;
          this.classIcon = LS.ICON_FILTRAR;
          this.mostrarNuevo = true;
        }
        break;
      }
      case LS.ACCION_CREAR: {
        if (this.bodegaService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
          this.vistaFormulario = true;
          this.parametrosFormulario = {
            accion: LS.ACCION_CREAR,
            invBodegaTO: new InvBodegaTO(),
            listaSectores: this.listaSectores
          }
        }
        break;
      }
      case LS.ACCION_CONSULTAR: {
        this.vistaFormulario = true;
        this.parametrosFormulario = {
          accion: LS.ACCION_CONSULTAR,
          invBodegaTO: this.objetoSeleccionado,
          listaSectores: this.listaSectores
        }
        break;
      }
      case LS.ACCION_EDITAR: {
        if (this.bodegaService.verificarPermiso(LS.ACCION_EDITAR, this, true)) {
          this.vistaFormulario = true;
          this.parametrosFormulario = {
            accion: LS.ACCION_EDITAR,
            invBodegaTO: this.objetoSeleccionado,
            listaSectores: this.listaSectores
          }
        }
        break;
      }
      case LS.ACCION_EDITAR_ESTADO: {
        if (this.bodegaService.verificarPermiso(LS.ACCION_EDITAR, this, true)) {
          this.obtenerInvBodegaTO(this.objetoSeleccionado);
          this.accion = LS.ACCION_EDITAR_ESTADO;
          this.tituloForm = LS.TITULO_FILTROS;
          this.classIcon = LS.ICON_FILTRAR;
          this.mostrarNuevo = true;
        }
        break;
      }
    }
  }

  /** Setear valores */
  setearValoresAObjetoInvBodegaTO(objeto) {
    objeto.empCodigo = LS.KEY_EMPRESA_SELECT;
    objeto.secEmpresa = LS.KEY_EMPRESA_SELECT;
    objeto.detEmpresa = LS.KEY_EMPRESA_SELECT;
    objeto.usrEmpresa = LS.KEY_EMPRESA_SELECT;
    objeto.detUsuario = this.auth.getCodigoUser();
    objeto.usrInsertaBodega = this.auth.getCodigoUser();
    objeto.secCodigo = this.sectorSeleccionado.secCodigo;
  }

  /** Obtener InvBodegaTO */
  obtenerInvBodegaTO(bodega) {
    this.cargando = true;
    this.bodegaService.getBodegaTO({ empresa: LS.KEY_EMPRESA_SELECT, codigo: bodega.bodCodigo }, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeGetBodegaTO(invBodegaTO) {
    this.invBodegaTO = invBodegaTO;
    this.cargando = false;
    let listaSectorFiltrado = this.listaSectores.filter(sector => sector.secCodigo === invBodegaTO.secCodigo);
    this.sectorSeleccionado = listaSectorFiltrado.length > 0 ? listaSectorFiltrado[0] : null;
    if (this.accion === LS.ACCION_ELIMINAR) {
      this.eliminarBodega();
    }
    if (this.accion === LS.ACCION_EDITAR_ESTADO) {
      this.actualizarEstadoBodega();
    }
  }

  convertirInvBodegaToAInvListaBodegasTO(InvBodegaTO): InvListaBodegasTO {
    let invListaBodegasTO = new InvListaBodegasTO(InvBodegaTO);
    invListaBodegasTO.codigoCP = InvBodegaTO.secCodigo;
    return invListaBodegasTO;
  }

  /**
   *Enviar Item seleccionado
   */
  enviarItem(item) {
    this.activeModal.close(item);
  }

  /** Metodo para crear una nueva bodega */
  insertarBodega(form: NgForm) {
    if (this.bodegaService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
      this.cargando = true;
      let formularioTocado = this.utilService.establecerFormularioTocado(form);
      if (form && form.valid && formularioTocado) {
        let bodegaCopia = JSON.parse(JSON.stringify(this.invBodegaTO));
        this.setearValoresAObjetoInvBodegaTO(bodegaCopia);
        this.api.post("todocompuWS/inventarioWebController/insertarBodegaTO", { invBodegaTO: bodegaCopia }, LS.KEY_EMPRESA_SELECT)
          .then(respuesta => {
            this.cargando = false;
            if (respuesta && respuesta.extraInfo) {
              this.refrescarTabla(this.convertirInvBodegaToAInvListaBodegasTO(bodegaCopia), 'I');
              this.toastr.success(respuesta.operacionMensaje, LS.TAG_AVISO);
              this.resetear();
            } else {
              this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
            }
          }).catch(err => this.utilService.handleError(err, this));

      } else {
        this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        this.cargando = false;
      }
    }
  }

  /** Metodo para guardar la edición de la bodega seleccionado*/
  actualizarBodega(form: NgForm) {
    if (this.bodegaService.verificarPermiso(LS.ACCION_EDITAR, this, true)) {
      this.cargando = true;
      let formularioTocado = this.utilService.establecerFormularioTocado(form);
      if (form && form.valid && formularioTocado) {
        let bodegaCopia = JSON.parse(JSON.stringify(this.invBodegaTO));
        this.setearValoresAObjetoInvBodegaTO(bodegaCopia);
        this.api.post("todocompuWS/inventarioWebController/modificarBodegaTO", { invBodegaTO: bodegaCopia }, LS.KEY_EMPRESA_SELECT)
          .then(respuesta => {
            this.cargando = false;
            if (respuesta && respuesta.extraInfo) {
              this.refrescarTabla(this.convertirInvBodegaToAInvListaBodegasTO(bodegaCopia), 'U');
              this.toastr.success(respuesta.operacionMensaje, LS.TAG_AVISO);
              this.resetear();
            } else {
              this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
            }
          }).catch(err => this.utilService.handleError(err, this));

      } else {
        this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        this.cargando = false;
      }
    }
  }

  /** Metodo para actualizar el estado inactivo de la bodega seleccionada*/
  actualizarEstadoBodega() {
    if (this.bodegaService.verificarPermiso(LS.ACCION_EDITAR, this, true)) {
      let bodegaCopia = JSON.parse(JSON.stringify(this.invBodegaTO));
      this.setearValoresAObjetoInvBodegaTO(bodegaCopia);
      let parametros = {
        title: bodegaCopia.bodInactiva ? LS.MSJ_TITULO_ACTIVAR : LS.MSJ_TITULO_INACTIVAR,
        texto: (bodegaCopia.bodInactiva ? LS.MSJ_PREGUNTA_ACTIVAR : LS.MSJ_PREGUNTA_INACTIVAR) + "<br>" + "Bodega: " + bodegaCopia.bodNombre,
        type: LS.SWAL_QUESTION,
        confirmButtonText: LS.MSJ_SI_ACEPTAR,
        cancelButtonText: LS.MSJ_NO_CANCELAR
      }
      this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
        if (respuesta) {//Si presiona aceptar
          this.cargando = true;
          bodegaCopia.bodInactiva = !bodegaCopia.bodInactiva;
          this.api.post("todocompuWS/inventarioWebController/modificarEstadoBodegaTO", { invBodegaTO: bodegaCopia, estado: bodegaCopia.bodInactiva }, LS.KEY_EMPRESA_SELECT)
            .then(respuesta => {
              this.cargando = false;
              if (respuesta && respuesta.extraInfo) {
                this.refrescarTabla(this.convertirInvBodegaToAInvListaBodegasTO(bodegaCopia), 'U');
                this.toastr.success(respuesta.operacionMensaje, LS.TAG_AVISO);
                this.resetear();
              } else {
                this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
              }
            }).catch(err => this.utilService.handleError(err, this));
        } else {
          this.resetear();
        }
      });
    } else {
      this.resetear();
    }
  }

  /** Metodo para eliminar la bodega seleccionada, se mostrará un dialogo de confirmacion para poder eliminar*/
  eliminarBodega() {
    if (this.bodegaService.verificarPermiso(LS.ACCION_ELIMINAR, this, true)) {
      let item = JSON.parse(JSON.stringify(this.invBodegaTO));
      let parametros = {
        title: LS.MSJ_TITULO_ELIMINAR,
        texto: LS.MSJ_PREGUNTA_ELIMINAR + "<br/>" + LS.TAG_BODEGA + ": " + this.invBodegaTO.bodNombre,
        type: LS.SWAL_WARNING,
        confirmButtonText: LS.MSJ_SI_ELIMINAR,
        cancelButtonText: LS.MSJ_NO_CANCELAR,
        confirmButtonColor: LS.COLOR_ELIMINAR
      }
      this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
        if (respuesta) {//Si presiona aceptar
          this.cargando = true;
          this.api.post("todocompuWS/inventarioWebController/eliminarBodegaTO", { invBodegaTO: item }, LS.KEY_EMPRESA_SELECT)
            .then(respuesta => {
              this.cargando = false;
              if (respuesta && respuesta.extraInfo) {
                this.refrescarTabla(this.objetoSeleccionado, 'D');
                this.toastr.success(respuesta.operacionMensaje, LS.TAG_AVISO);
              } else {
                this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
              }
              this.resetear();
            }).catch(err => this.utilService.handleError(err, this));
        } else {
          this.resetear();
        }
      });
    } else {
      this.resetear();
    }
  }

  imprimirBodegas() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = { ListadoBodegas: this.listaResultado };
      this.archivoService.postPDF("todocompuWS/inventarioWebController/imprimirReporteBodegas", parametros, this.empresaSeleccionada)
        .then(data => {
          (data._body.byteLength > 0) ? this.utilService.descargarArchivoPDF('ListadoBodegas_' + this.utilService.obtenerHorayFechaActual() + '.pdf', data) :
            this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  exportarBodegas() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = { ListadoBodegas: this.listaResultado };
      this.archivoService.postExcel("todocompuWS/inventarioWebController/exportarReporteBodegas", parametros, this.empresaSeleccionada)
        .then(data => {
          (data) ? this.utilService.descargarArchivoExcel(data._body, "ListadoBodegas_") : this.toastr.warning(LS.MSJ_ERROR_EXPORTAR, LS.TAG_AVISO);
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  /** Metodo que se ejecuta cada vez que se cambia de empresa, limpia la tabla y reinicia valores de accion ,título de formulario y los listaEmpresas de opciones de menú */
  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.listaResultado = [];
    this.sectorSeleccionado = null;
    this.listarSectores();
    this.filasService.actualizarFilas("0", "0");
  }

  /** Metodo que reinicia los valores de las variables accion,filas y los listaEmpresas de opciones de menú*/
  resetear() {
    this.accion = null;
    this.tituloForm = LS.TITULO_FILTROS;
    this.classIcon = LS.ICON_FILTRAR;
    this.actualizarFilas();
    this.mostrarNuevo = true;
  }

  /** Metodo para generar opciones de menú para la tabla al dar clic derecho*/
  generarOpciones() {
    let perEditar = this.empresaSeleccionada.listaSisPermisoTO.gruModificar;
    let perInactivar = this.empresaSeleccionada.listaSisPermisoTO.gruModificar && !this.objetoSeleccionado.bodInactiva;
    let perActivar = this.empresaSeleccionada.listaSisPermisoTO.gruModificar && this.objetoSeleccionado.bodInactiva;
    let perEliminar = this.empresaSeleccionada.listaSisPermisoTO.gruEliminar;
    this.opciones = [
      { label: LS.ACCION_CONSULTAR, icon: LS.ICON_CONSULTAR, disabled: false, command: () => this.operacionesBodega(LS.ACCION_CONSULTAR) },
      { label: LS.ACCION_EDITAR, icon: LS.ICON_EDITAR, disabled: !perEditar, command: () => perEditar ? this.operacionesBodega(LS.ACCION_EDITAR) : null },
      { label: LS.ACCION_ELIMINAR, icon: LS.ICON_ELIMINAR, disabled: !perEliminar, command: () => perEliminar ? this.operacionesBodega(LS.ACCION_ELIMINAR) : null },
      { label: LS.ACCION_ACTIVAR, icon: LS.ICON_ACTIVAR, disabled: !perActivar, command: () => perActivar ? this.operacionesBodega(LS.ACCION_EDITAR_ESTADO) : null },
      { label: LS.ACCION_INACTIVAR, icon: LS.ICON_INACTIVAR, disabled: !perInactivar, command: () => perInactivar ? this.operacionesBodega(LS.ACCION_EDITAR_ESTADO) : null }
    ];
  }

  generarAtajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivarBodega') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_NUEVO, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnNuevo') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_CONSULTAR, (event: KeyboardEvent): boolean => {
      if (this.listaResultado.length > 0) {
        this.operacionesBodega(LS.ACCION_CONSULTAR);
      }
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EDITAR, (event: KeyboardEvent): boolean => {
      if (this.listaResultado.length > 0) {
        this.operacionesBodega(LS.ACCION_EDITAR);
      }
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_ELIMINAR, (event: KeyboardEvent): boolean => {
      if (this.listaResultado.length > 0) {
        this.operacionesBodega(LS.ACCION_ELIMINAR);
      }
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_GUARDAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnGuardar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirBodega') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnExportarBodega') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_CANCELAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnCancelarBodega') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  ejecutarAccion(event) {
    switch (event.accion) {
      case LS.ACCION_CREAR:
        this.refrescarTabla(this.convertirInvBodegaToAInvListaBodegasTO(event.bodegaCopia), 'I');
        break;
      case LS.ACCION_EDITAR:
        this.refrescarTabla(this.convertirInvBodegaToAInvListaBodegasTO(event.bodegaCopia), 'U');
    }
  }

  refrescarTabla(invListaBodegasTO: InvListaBodegasTO, operacion: string) {
    switch (operacion) {
      case 'I': {//Insertar un elemento en la tabla
        //Si la lista tiene mas de un elemento lo guarda
        if (this.listaResultado.length > 0) {
          let listaTemporal = [... this.listaResultado];
          listaTemporal.unshift(invListaBodegasTO);
          this.listaResultado = listaTemporal;
          this.seleccionarFila(0);
        }
        break;
      }
      case 'U': {//Actualiza un elemento en la tabla
        //Se actualiza la lista
        var indexTemp = this.listaResultado.findIndex(item => item.bodCodigo === invListaBodegasTO.bodCodigo);
        let listaTemporal = [... this.listaResultado];
        listaTemporal[indexTemp] = invListaBodegasTO;
        this.listaResultado = listaTemporal;
        this.objetoSeleccionado = this.listaResultado[indexTemp];
        this.seleccionarFila(indexTemp);
        break;
      }
      case 'D': {//Elimina un elemento en la tabla
        //Actualizan las listas 
        var indexTemp = this.listaResultado.findIndex(item => item.bodCodigo === invListaBodegasTO.bodCodigo);
        this.listaResultado = this.listaResultado.filter((val, i) => i != indexTemp);
        (this.listaResultado.length > 0) ? this.seleccionarFila((indexTemp === 0) ? 0 : (indexTemp - 1)) : null;
        break;
      }
    }
    this.vistaFormulario = false;
  }

  /** Actualiza el valor de la pantalla */
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerWidth = window.innerWidth;
    this.isScreamMd = this.innerWidth <= 576 ? false : true;
  }

  cancelar(event) {
    this.vistaFormulario = false;
    this.activar = false;
  }

  //#region [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.bodegaService.generarColumnas(this.isModal);
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

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.actualizarFilas();
    this.redimencionarColumnas();
    this.seleccionarFila(0);
  }

  filaFocused(event) {
    let fila = this.gridApi ? this.gridApi.getRowNode(event.rowIndex) : null;
    this.objetoSeleccionado = fila ? fila.data : null;
  }

  filaSeleccionar() {
    this.enviarItem(this.objetoSeleccionado);
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

  seleccionarFila(index) {
    if (this.gridApi) {
      var firstCol = this.gridColumnApi.getAllDisplayedColumns()[0];
      this.gridApi.setFocusedCell(index, firstCol);
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

  filtrarRapido() {
    this.gridApi ? this.gridApi.setQuickFilter(this.filtroGlobal) : null
  }

  actualizarFilas() {
    this.filasTiempo.filas = this.gridApi ? this.gridApi.getDisplayedRowCount() : 0;
    this.filasService.actualizarFilas(this.filasTiempo.filas, this.filasTiempo.getTiempo());
  }
  //#endregion
}
