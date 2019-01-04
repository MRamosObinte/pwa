import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LS } from '../../../../constantes/app-constants';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { SectorService } from '../../../produccion/archivos/sector/sector.service';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { InvPedidosOrdenCompraMotivo } from '../../../../entidades/inventario/InvPedidosOrdenCompraMotivo';
import { InvPedidosOrdenCompraMotivoTO } from '../../../../entidadesTO/inventario/InvPedidosOrdenCompraMotivoTO';
import { InvPedidosOrdenCompraMotivoPK } from '../../../../entidades/inventario/InvPedidosOrdenCompraMotivoPK';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { ContextMenu } from '../../../../../../node_modules/primeng/contextmenu';
import { GridApi } from '../../../../../../node_modules/ag-grid';
import { BotonOpcionesComponent } from '../../../componentes/boton-opciones/boton-opciones.component';
import { TooltipReaderComponent } from '../../../componentes/tooltip-reader/tooltip-reader.component';
import { InputEstadoComponent } from '../../../componentes/input-estado/input-estado.component';
import { ConfiguracionOrdenCompraService } from './configuracion-orden-compra.service';
import { SisListaUsuarioTO } from '../../../../entidadesTO/sistema/SisListaUsuarioTO';
import { SistemaService } from '../../../sistema/sistema/sistema.service';
import { InvOrdenCompraMotivoDetalleAprobadoresTO } from '../../../../entidadesTO/inventario/InvOrdenCompraMotivoDetalleAprobadoresTO';
import { PrdListaSectorTO } from '../../../../entidadesTO/Produccion/PrdListaSectorTO';

@Component({
  selector: 'app-configuracion-orden-compra',
  templateUrl: './configuracion-orden-compra.component.html'
})
export class ConfiguracionOrdenCompraComponent implements OnInit {

  public constantes: any;
  public cargando: boolean = false;
  public activar: boolean = false;
  public accion: string = null;//Bandera
  public isScreamMd: boolean = true;
  public mostrarDatosCrud: boolean = false;
  public frmTitulo: string;
  public classTitulo: string;
  public empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public listaSectores: Array<PrdListaSectorTO> = [];
  public sectorSeleccionado: PrdListaSectorTO = null;//Es un combo con x (opcion TODOS), por lo que puede ser nulo
  public sectorCopia: PrdListaSectorTO = null;//Almacena el valor del sector seleccionado antes de enviar a refrescar la listas
  public objetoSeleccionado: InvPedidosOrdenCompraMotivoTO = new InvPedidosOrdenCompraMotivoTO(); //Objeto actualmente seleccionado
  public listadoResultado: Array<InvPedidosOrdenCompraMotivoTO> = [];
  public invPedidosOrdenCompraMotivo: InvPedidosOrdenCompraMotivo = new InvPedidosOrdenCompraMotivo();
  public vistaFormulario: boolean;
  //Usuarios
  public listaUsuarios: Array<SisListaUsuarioTO> = []; //Lista de usuarios del sistema
  public listaUsuariosTodos: Array<SisListaUsuarioTO> = []; //Lista de usuarios del sistema
  public listaUsuariosFiltrada: Array<SisListaUsuarioTO> = []; // Lista de usuario sin Registrador, Ejecutor, Aprobador.
  public listUsuarioSeleccionado: Array<SisListaUsuarioTO> = []; // Usuarios seleccionados de
  public usuarioSeleccionado: any = {};
  public listadoAprobadores: Array<InvOrdenCompraMotivoDetalleAprobadoresTO> = new Array();
  //AG-GRID
  @ViewChild("menuOpciones") menuOpciones: ContextMenu;
  public opciones: MenuItem[]; //Listado de opciones que apareceran en la lista
  public gridApi: GridApi;
  public gridColumnApi: any;
  public columnDefs: Array<object> = [];
  public columnDefsSelected: Array<object> = [];
  public rowSelection: string;
  public components: any = {};
  public context;
  public frameworkComponents;
  public filtroGlobal: string = "";
  public filasTiempo: FilasTiempo = new FilasTiempo();
  //AG-GRID
  opcionesAprobador: any = [];
  @ViewChild("cma") cma: ContextMenu;//Context menu aprobador
  public gridAprobador: GridApi;//gria Aprobador
  public gridColumnApiAprobador: any;
  public columnAprobador: Array<object> = [];
  public noData: string = LS.MSJ_NO_HAY_DATOS;

  //formulario
  @ViewChild("frmMotivoOC") frmMotivoOC: NgForm;
  public valoresIniciales: any;
  public listadoInicial: any;

  constructor(
    private motivoService: ConfiguracionOrdenCompraService,
    private sectorService: SectorService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private filasService: FilasResolve,
    private sistemaService: SistemaService,
    private utilService: UtilService
  ) {
    this.constantes = LS; //Hace referncia a los constantes
    this.listaEmpresas = this.route.snapshot.data['configuracionOrdenCompra'];
    if (this.listaEmpresas) {
      this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
      LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
      this.cambiarEmpresaSelect();
    }
    this.frmTitulo = LS.TITULO_FILTROS;
    this.classTitulo = LS.ICON_FILTRAR;
    this.motivoService.inicializarAtajos(this);
  }

  ngOnInit() {
    this.isScreamMd = window.innerWidth <= LS.WINDOW_WIDTH_XS ? false : true;
    this.iniciarAgGrid();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isScreamMd = window.innerWidth <= LS.WINDOW_WIDTH_XS ? false : true;
  }

  cambiarEmpresaSelect() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.invPedidosOrdenCompraMotivo = new InvPedidosOrdenCompraMotivo();
    this.objetoSeleccionado = null;
    this.vistaFormulario = false;
    this.activar = false;
    this.accion = null;
    this.limpiarResultado();
    //Actualiza el listado de sectores y categorias
    let parametro = { empresa: LS.KEY_EMPRESA_SELECT, incluirInactivos: false }
    this.sistemaService.getListaSisUsuario(parametro, this, LS.KEY_EMPRESA_SELECT);
    this.listarSectores();
  }

  limpiarResultado() {
    this.gridApi = null;
    this.gridColumnApi = null;
    this.filtroGlobal = "";
    this.listadoResultado = [];
    this.objetoSeleccionado = null;
    this.filasTiempo.resetearContador();
    this.accion = null;
    this.actualizarFilas();
  }

  listarSectores() {
    this.cargando = true;
    this.listaSectores = [];
    this.sectorCopia = this.sectorSeleccionado;//Guarda el seleccionado
    this.sectorSeleccionado = null;
    let parametro = { empresa: LS.KEY_EMPRESA_SELECT, mostrarInactivo: false };
    this.sectorService.listarPrdListaSectorTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarSectores(data) {
    this.listaSectores = data;
    this.sectorSeleccionado = this.utilService.getObjetoSeleccionadoComboObligatorio(this.listaSectores, this.sectorCopia, 'secCodigo');
    this.cargando = false;
  }

  despuesDeListarUsuario(listaUsuario) {
    this.listaUsuarios = listaUsuario ? listaUsuario : [];
    this.listaUsuariosTodos = listaUsuario ? listaUsuario : [];
  }

  buscarOrdenCompraMotivo() {
    this.cargando = true;
    this.limpiarResultado();
    let sector = this.sectorSeleccionado ? this.sectorSeleccionado.secCodigo : null;
    let parametro = { empresa: LS.KEY_EMPRESA_SELECT, sector: sector };
    this.filasTiempo.iniciarContador();
    this.motivoService.listarInvPedidosOrdenCompraMotivoTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarInvPedidosOrdenCompraMotivoTO(data) {
    this.filasTiempo.finalizarContador();
    this.listadoResultado = data ? data : [];
    this.cargando = false;
  }

  nuevoOrdenCompraMotivo() {
    if (this.utilService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
      this.accion = LS.ACCION_CREAR;
      this.frmTitulo = LS.PEDIDOS_COMPRA_MOTIVO_NUEVO;
      this.classTitulo = LS.ICON_CREAR;
      this.listaUsuarios = [...this.listaUsuariosTodos];
      this.columnAprobador = this.motivoService.generarColumnasAprobador(this);
      this.invPedidosOrdenCompraMotivo = new InvPedidosOrdenCompraMotivo();
      this.vistaFormulario = true;
      this.extraerValoresIniciales();
    }
  }

  editarOrdenCompraMotivo(objetoSeleccionado: InvPedidosOrdenCompraMotivoTO) {
    if (this.utilService.verificarPermiso(LS.ACCION_EDITAR, this, true)) {
      this.cargando = true;
      this.accion = LS.ACCION_EDITAR;
      this.columnAprobador = this.motivoService.generarColumnasAprobador(this);
      this.obtenerOrdenCompraMotivo(objetoSeleccionado);      
    }
  }

  consultarOrdenCompraMotivo(objetoSeleccionado: InvPedidosOrdenCompraMotivoTO) {
    if (this.utilService.verificarPermiso(LS.ACCION_CONSULTAR, this, true)) {
      this.cargando = true;
      this.accion = LS.ACCION_CONSULTAR;
      this.columnAprobador = this.motivoService.generarColumnasAprobador(this);
      this.obtenerOrdenCompraMotivo(objetoSeleccionado);
    }
  }

  extraerValoresIniciales() {
    setTimeout(() => {
      this.valoresIniciales = JSON.parse(JSON.stringify(this.frmMotivoOC ? this.frmMotivoOC.value : null));
      this.listadoInicial = JSON.parse(JSON.stringify(this.listadoAprobadores ? this.listadoAprobadores : null));
    }, 50);
  }

  obtenerOrdenCompraMotivo(objetoSeleccionado: InvPedidosOrdenCompraMotivoTO) {
    this.invPedidosOrdenCompraMotivo = new InvPedidosOrdenCompraMotivo();
    let parametro = { invPedidosOrdenCompraMotivoPK: new InvPedidosOrdenCompraMotivoPK(objetoSeleccionado) };
    this.motivoService.obtenerInvPedidosOrdenCompraMotivo(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeObtenerInvPedidosOrdenCompraMotivo(data) {
    this.invPedidosOrdenCompraMotivo = new InvPedidosOrdenCompraMotivo(data.motivo);
    if (data.aprobadores) {
      this.listadoAprobadores = data.aprobadores;
      this.reestablecerListadoUsuarios();
    } else {
      this.listaUsuarios = [...this.listaUsuariosTodos];
    }
    let sectorMotivo = this.listaSectores.filter(item => item.secCodigo === this.invPedidosOrdenCompraMotivo.invPedidosOrdenCompraMotivoPK.ocmSector);
    this.sectorSeleccionado = sectorMotivo.length > 0 ? sectorMotivo[0] : null;//Si no encuentra el sector se marcara la opcion TODOS
    if (this.accion === LS.ACCION_EDITAR) {//Si va a editar
      this.frmTitulo = LS.PEDIDOS_COMPRA_MOTIVO_EDITAR;
      this.classTitulo = LS.ICON_EDITAR;
    }
    this.activar = false;
    this.vistaFormulario = true;
    this.cargando = false;
    this.extraerValoresIniciales();
  }

  activarInactivarOrdenCompraMotivo() {
    if (this.utilService.verificarPermiso(LS.ACCION_EDITAR, this, true)) {
      let parametros = {
        title: this.objetoSeleccionado.ocmInactivo ? LS.MSJ_TITULO_ACTIVAR : LS.MSJ_TITULO_INACTIVAR,
        texto: (this.objetoSeleccionado.ocmInactivo ? LS.MSJ_PREGUNTA_ACTIVAR : LS.MSJ_PREGUNTA_INACTIVAR) + "<br>" + "Motivo: " + this.objetoSeleccionado.ocmDetalle,
        type: LS.SWAL_QUESTION,
        confirmButtonText: LS.MSJ_SI_ACEPTAR,
        cancelButtonText: LS.MSJ_NO_CANCELAR
      }
      this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
        if (respuesta) {//Si presiona aceptar
          this.cargando = true;
          let parametros = {
            invPedidosOrdenCompraMotivoPK: new InvPedidosOrdenCompraMotivoPK({ ocmEmpresa: this.empresaSeleccionada.empCodigo, ocmCodigo: this.objetoSeleccionado.ocmCodigo, ocmSector: this.sectorSeleccionado.secCodigo }),
            estado: !this.objetoSeleccionado.ocmInactivo
          };
          this.motivoService.actualizarEstadoInvPedidosOrdenCompraMotivo(parametros, this, LS.KEY_EMPRESA_SELECT);
        }
      });
    }
  }

  despuesDeActualizarEstadoInvPedidosOrdenCompraMotivo(respuesta) {
    this.cargando = false;
    this.resetearFormulario();
    this.objetoSeleccionado.ocmInactivo = !this.objetoSeleccionado.ocmInactivo;
    this.toastr.success(respuesta.operacionMensaje, LS.TOAST_CORRECTO);
    this.refrescarTabla(this.objetoSeleccionado, 'U');
  }

  eliminarOrdenCompraMotivo(objetoSeleccionado: InvPedidosOrdenCompraMotivoTO) {
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
          let parametro = { invPedidosOrdenCompraMotivoPK: new InvPedidosOrdenCompraMotivoPK(objetoSeleccionado) };
          this.motivoService.eliminarInvPedidosOrdenCompraMotivo(parametro, this, LS.KEY_EMPRESA_SELECT);
        }
      });
    }
  }

  guardar(form: NgForm) {
    if (this.utilService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
      this.cargando = true;
      let formTocado = this.utilService.establecerFormularioTocado(form);
      if (formTocado && form && form.valid) {
        let invPedidosOrdenCompraMotivoCopia = this.motivoService.formatearInvPedidosOrdenCompraMotivo(this.invPedidosOrdenCompraMotivo, this);
        let parametro = {
          invPedidosOrdenCompraMotivo: invPedidosOrdenCompraMotivoCopia,
          aprobadores: this.listadoAprobadores
        };
        this.motivoService.guardarInvPedidosOrdenCompraMotivo(parametro, this, LS.KEY_EMPRESA_SELECT);
      } else {
        this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        this.cargando = false;
      }
    }
  }

  actualizar(form: NgForm) {

    if (this.utilService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
      if (!this.sePuedeCancelar()) {
        this.cargando = true;
        let formTocado = this.utilService.establecerFormularioTocado(form);
        if (formTocado && form && form.valid) {
          let invPedidosOrdenCompraMotivoCopia = this.motivoService.formatearInvPedidosOrdenCompraMotivo(this.invPedidosOrdenCompraMotivo, this);
          let parametro = {
            invPedidosOrdenCompraMotivo: invPedidosOrdenCompraMotivoCopia,
            aprobadores: this.listadoAprobadores
          };
          this.motivoService.actualizarInvPedidosOrdenCompraMotivo(parametro, this, LS.KEY_EMPRESA_SELECT);
        } else {
          this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
          this.cargando = false;
        }
      } else {
        this.resetearFormulario();
        this.toastr.warning(LS.NO_REALIZO_NINGUN_CAMBIO, LS.TAG_AVISO);
      }
    }
  }

  imprimir() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = { listaInvPedidosOrdenCompraMotivoTO: this.listadoResultado };
      this.motivoService.imprimirInvPedidosOrdenCompraMotivo(parametros, this, this.empresaSeleccionada);
    }
  }

  exportar() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = { listaInvPedidosOrdenCompraMotivoTO: this.listadoResultado };
      this.motivoService.exportarInvPedidosOrdenCompraMotivo(parametros, this, this.empresaSeleccionada);
    }
  }

  mostrarAgregarUsuario() {
    if (this.empresaSeleccionada.listaSisPermisoTO.gruCrear) {
      this.classTitulo = LS.ICON_CREAR;
      this.activar = false;
      this.listaUsuarios = [...this.listaUsuariosTodos];
      this.listUsuarioSeleccionado = [];
      this.generarListaUsuarios();
      this.mostrarDatosCrud = true;
      // this.accionAgregarUsuario = true;
    } else {
      this.toastr.warning(LS.ERROR_403_TEXTO, LS.ERROR_403_TITULO);
    }
  }

  generarListaUsuarios() {
    //Eliminar usuarios ya ingresados de la lista general de usuarios
    this.reestablecerListadoUsuarios();
  }

  cancelarAgregarUsuario() {
    this.classTitulo = LS.ICON_FILTRAR;
    this.listUsuarioSeleccionado = [];
    this.listaUsuariosFiltrada = [];
    // this.accionAgregarUsuario = false;
    this.mostrarDatosCrud = false;
  }

  filtrarUsuarioEmpresa(event) {
    let query = event.query;
    let filtered: any[] = [];
    this.listaUsuarios.forEach(usuario => {
      if (usuario.usrNombre.toLowerCase().indexOf(query.toLowerCase()) == 0 || usuario.usrApellido.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(usuario);
      }
    });
    this.listaUsuariosFiltrada = filtered;
  }

  //Agregar los usuarios a las listas respectivas
  agregarUsuario() {
    if (this.listUsuarioSeleccionado.length == 0) {
      this.toastr.info(LS.MSJ_SELECCIONE_USUARIO, "");
    } else if (!this.empresaSeleccionada.listaSisPermisoTO.gruCrear) {
      this.toastr.warning(LS.ERROR_403_TEXTO, LS.ERROR_403_TITULO);
    } else {
      this.listUsuarioSeleccionado.forEach(sisListaUsuarioTO => {
        let usuarioAux = new InvOrdenCompraMotivoDetalleAprobadoresTO({ activo: true, detSecuencial: 0, invPedidosMotivoTO: this.invPedidosOrdenCompraMotivo });
        usuarioAux.usuario = sisListaUsuarioTO;
        let index = this.listadoAprobadores.findIndex(sisUsuario => sisUsuario.usuario.usrCodigo === sisListaUsuarioTO.usrCodigo);
        index < 0 ? this.listadoAprobadores.push(usuarioAux) : this.listadoAprobadores[index].activo = true;
        this.gridAprobador ? this.gridAprobador.updateRowData({ add: [usuarioAux] }) : null;
      });
      this.actualizarListaUsuario();
    }
  }

  //Permite Agregar de la lista de filtrados a los usuarios que sean eliminados de Registrador,Ejecutor,
  eliminarUsuarioLista() {
    if (this.empresaSeleccionada.listaSisPermisoTO.gruEliminar) {
      let parametros = {
        title: LS.MSJ_TITULO_ELIMINAR,
        texto: LS.MSJ_PREGUNTA_ELIMINAR,
        type: LS.SWAL_WARNING,
        confirmButtonText: LS.MSJ_SI_ELIMINAR,
        cancelButtonText: LS.MSJ_CANCELAR,
        confirmButtonColor: LS.COLOR_ELIMINAR
      };
      this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
        if (respuesta) {//Si presiona aceptar
          var index = 0;
          index = this.listadoAprobadores.findIndex(item => item.usuario.usrCodigo === this.usuarioSeleccionado.usuario.usrCodigo);
          index > -1 ? this.listadoAprobadores[index].activo = false : null;//Retorna el valor actualizado
          this.listadoAprobadores[index].activo = false;
          if (this.invPedidosOrdenCompraMotivo.ocmAprobacionAutomatica) {
            let index2 = this.listadoAprobadores.findIndex(item => item.usuario.usrCodigo === this.usuarioSeleccionado.usuario.usrCodigo);
            index2 > -1 ? this.listadoAprobadores[index2].activo = false : null;
          }
          this.gridAprobador ? this.gridAprobador.updateRowData({ remove: [this.listadoAprobadores[index]] }) : null;
          if (index > -1) {
            let fIndex = this.listaUsuarios.findIndex(item => item.usrCodigo === this.usuarioSeleccionado.usuario.usrCodigo);
            fIndex === -1 ? this.listaUsuarios.push(this.usuarioSeleccionado.usuario) : null;
          }
        }
      });
    } else {
      this.toastr.warning(LS.ERROR_403_TEXTO, LS.ERROR_403_TITULO);
    }

  }

  //Permite eliminar de la lista de filtrados a los usuarios que sean eliminados de Registrador, Ejecutor, Aprobar
  actualizarListaUsuario() {
    this.listUsuarioSeleccionado.forEach(usuario => {
      this.listaUsuarios.splice(this.listaUsuarios.findIndex(item => item.usrCodigo === usuario.usrCodigo), 1);
    });
    this.cancelarAgregarUsuario();
  }

  reestablecerListadoUsuarios() {
    this.listadoAprobadores.forEach(usuario => {
      this.listaUsuarios.splice(this.listaUsuarios.findIndex(item => item.usrCodigo === usuario.usuario.usrCodigo && usuario.activo), 1);
    });
  }

  resetearFormulario() {
    this.frmTitulo = LS.TITULO_FILTROS;
    this.classTitulo = LS.ICON_FILTRAR;
    this.invPedidosOrdenCompraMotivo = new InvPedidosOrdenCompraMotivo();
    this.listadoAprobadores = [];
    this.mostrarDatosCrud = false;
    this.vistaFormulario = false;
    this.accion = null;
  }

  cancelarAccion() {
    if (this.sePuedeCancelar()) {
      this.resetearFormulario();
    } else {
      let parametros = {
        title: LS.MSJ_TITULO_CANCELAR,
        texto: LS.MSJ_PREGUNTA_CANCELAR,
        type: LS.SWAL_QUESTION,
        confirmButtonText: LS.MSJ_ACEPTAR,
        cancelButtonText: LS.MSJ_CANCELAR
      };
      this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
        if (respuesta) {//Si presiona aceptar
          this.resetearFormulario();
        }
      });
    }
  }

  sePuedeCancelar() {
    return this.utilService.puedoCancelar(this.valoresIniciales, this.frmMotivoOC) && this.utilService.compararObjetos(this.listadoInicial, this.listadoAprobadores);
  }

  //#region [R3] [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.motivoService.generarColumnasMotivoPedidoOrdenCompra();
    this.columnAprobador = this.motivoService.generarColumnasAprobador(this);
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
    this.seleccionarPrimerFila();
    this.redimensionarColumnas();
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

  filtrarRapido() {
    this.gridApi ? this.gridApi.setQuickFilter(this.filtroGlobal) : null
  }

  filaFocused(event) {
    let fila = this.gridApi ? this.gridApi.getRowNode(event.rowIndex) : null;
    this.objetoSeleccionado = fila ? fila.data : null;
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

  private generarOpciones() {
    let perEditar = this.utilService.verificarPermiso(LS.ACCION_EDITAR, this) && !this.vistaFormulario;
    let perConsultar = this.utilService.verificarPermiso(LS.ACCION_CONSULTAR, this) && !this.vistaFormulario;
    let perEliminar = this.utilService.verificarPermiso(LS.ACCION_ELIMINAR, this) && !this.vistaFormulario;
    let perActivar = this.empresaSeleccionada.listaSisPermisoTO.gruModificar && this.objetoSeleccionado.ocmInactivo;
    let perInactivar = this.empresaSeleccionada.listaSisPermisoTO.gruModificar && !this.objetoSeleccionado.ocmInactivo;

    this.opciones = [
      { label: LS.ACCION_CONSULTAR, icon: LS.ICON_CONSULTAR, disabled: !perConsultar, command: (event) => perConsultar ? this.consultarOrdenCompraMotivo(this.objetoSeleccionado) : null },
      { label: LS.ACCION_EDITAR, icon: LS.ICON_EDITAR, disabled: !perEditar, command: (event) => perEditar ? this.editarOrdenCompraMotivo(this.objetoSeleccionado) : null },
      { label: LS.ACCION_ELIMINAR, icon: LS.ICON_ELIMINAR, disabled: !perEliminar, command: (event) => perEliminar ? this.eliminarOrdenCompraMotivo(this.objetoSeleccionado) : null },
      this.objetoSeleccionado.ocmInactivo ?
        {
          label: LS.ACCION_ACTIVAR,
          icon: LS.ICON_ACTIVAR,
          disabled: !perActivar,
          command: () => perActivar ? this.activarInactivarOrdenCompraMotivo() : null
        }
        :
        {
          label: LS.ACCION_INACTIVAR,
          icon: LS.ICON_INACTIVAR,
          disabled: !perInactivar,
          command: () => perInactivar ? this.activarInactivarOrdenCompraMotivo() : null
        }
    ];
  }

  refreshGrid() {
    this.gridApi ? this.gridApi.refreshCells() : null;
    setTimeout(() => { this.actualizarFilas(); }, 50);
  }

  actualizarFilas() {
    this.filasTiempo.filas = this.gridApi ? this.gridApi.getDisplayedRowCount() : 0;
    this.filasService.actualizarFilas(this.filasTiempo.filas, this.filasTiempo.getTiempo());
  }

  refrescarTabla(objetoAccion: InvPedidosOrdenCompraMotivoTO, operacion: string) {
    switch (operacion) {
      case 'I': {//Insertar un elemento en la tabla
        //Si la lista tiene mas de un elemento lo guarda
        if (this.listadoResultado.length > 0) {
          let listaTemporal = [... this.listadoResultado];
          listaTemporal.unshift(objetoAccion);
          this.listadoResultado = listaTemporal;
        }
        break;
      }
      case 'U': {//Actualiza un elemento en la tabla
        //Se actualiza la lista
        var indexTemp = this.listadoResultado.findIndex(item => item.ocmCodigo === objetoAccion.ocmCodigo);
        let listaTemporal = [... this.listadoResultado];
        listaTemporal[indexTemp] = objetoAccion;
        this.listadoResultado = listaTemporal;
        break;
      }
      case 'D': {//Elimina un elemento en la tabla
        var indexTemp = this.listadoResultado.findIndex(item => item.ocmCodigo === objetoAccion.ocmCodigo);
        let listaTemporal = [...this.listadoResultado];
        listaTemporal.splice(indexTemp, 1);
        this.listadoResultado = listaTemporal;
        break;
      }
    }
    this.refreshGrid();
  }
  //#endregion

  //#region [AG-GRID] 
  ejecutarAccion(data) {
    if (this.accion !== LS.ACCION_CONSULTAR) {
      this.eliminarUsuarioLista();
    }
  }

  onGridReadyAprobador(params) {
    this.gridAprobador = params.api;
    this.gridColumnApiAprobador = params.columnApi;
    this.redimencionarColumnas(this.gridAprobador);
    this.actualizarFilas();
  }

  mostrarOpcionesAprobador(event, dataSelected) {
    this.mostrarContextMenuAprobador(dataSelected, event);
  }

  mostrarContextMenuAprobador(data, event) {
    this.usuarioSeleccionado = data;
    this.generarOpcionesAprobador();
    this.cma.show(event);
    event.stopPropagation();
  }

  generarOpcionesAprobador() {
    let canDelete = this.empresaSeleccionada.listaSisPermisoTO.gruEliminar;
    this.opcionesAprobador = [
      { label: LS.ACCION_ELIMINAR, icon: LS.ICON_ELIMINAR, disabled: !canDelete, command: canDelete ? event => this.eliminarUsuarioLista() : null }
    ];
  }

  redimencionarColumnas(gridApi) {
    gridApi ? gridApi.sizeColumnsToFit() : null;
  }
  //#endregion

  @HostListener("window:beforeunload", ["$event"])
  unloadHandler(event: Event) {
    if (this.accion != LS.ACCION_CONSULTAR && !this.utilService.puedoCancelar(this.valoresIniciales, this.frmMotivoOC) && !this.utilService.compararObjetos(this.listadoInicial, this.listadoAprobadores)) {
      event.returnValue = false;
    } else {
      return true;
    }
  }
}
