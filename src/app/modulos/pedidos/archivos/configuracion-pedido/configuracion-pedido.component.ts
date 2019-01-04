import { Component, OnInit, ChangeDetectorRef, HostListener, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { HotkeysService, Hotkey } from "angular2-hotkeys";
import { SectorService } from "../../../produccion/archivos/sector/sector.service";
import { SisListaUsuarioTO } from "../../../../entidadesTO/sistema/SisListaUsuarioTO";
import { InvPedidosMotivoTO } from "../../../../entidadesTO/inventario/InvPedidosMotivoTO";
import { ConfiguracionPedidoService } from "./configuracion-pedido.service";
import { InvPedidosConfiguracionTO } from "../../../../entidadesTO/inventario/InvPedidosConfiguracionTO";
import { InvPedidosMotivoDetalleRegistradoresTO } from "../../../../entidadesTO/inventario/InvPedidosMotivoDetalleRegistradoresTO";
import { InvPedidosMotivoDetalleEjecutoresTO } from "../../../../entidadesTO/inventario/InvPedidosMotivoDetalleEjecutoresTO";
import { InvPedidosMotivoDetalleAprobadoresTO } from "../../../../entidadesTO/inventario/InvPedidosMotivoDetalleAprobadoresTO";
import { PrdSectorPK } from "../../../../entidades/produccion/PrdSectorPK";
import { UtilService } from "../../../../serviciosgenerales/util.service";
import { PermisosEmpresaMenuTO } from "../../../../entidadesTO/web/PermisosEmpresaMenuTO";
import { LS } from "../../../../constantes/app-constants";
import { SistemaService } from "../../../sistema/sistema/sistema.service";
import { InvPedidosMotivoPK } from "../../../../entidades/inventario/InvPedidosMotivoPK";
import { FilasTiempo } from "../../../../enums/FilasTiempo";
import { FilasResolve } from "../../../../serviciosgenerales/filas.resolve";
import { PrdListaSectorTO } from "../../../../entidadesTO/Produccion/PrdListaSectorTO";
import { GridApi } from "ag-grid";
import { ContextMenu } from "primeng/contextmenu";
import { InvProductoCategoriaTO } from "../../../../entidadesTO/inventario/InvProductoCategoriaTO";
import { ProductoCategoriaService } from "../../../inventario/componentes/producto-categoria/producto-categoria.service";
import { BotonOpcionesComponent } from "../../../componentes/boton-opciones/boton-opciones.component";
import { TooltipReaderComponent } from "../../../componentes/tooltip-reader/tooltip-reader.component";
import { MenuItem } from 'primeng/api';
import { NgForm } from "@angular/forms";
import { ArchivoService } from "../../../../serviciosgenerales/archivo.service";
import { InvPedidosMotivo } from "../../../../entidades/inventario/InvPedidosMotivo";
import { InputEstadoComponent } from "../../../componentes/input-estado/input-estado.component";

@Component({
  selector: "app-configuracion-pedido",
  templateUrl: "./configuracion-pedido.component.html"
})
export class ConfiguracionPedidoComponent implements OnInit {
  vistaFormulario: boolean = false;
  //Opciones generales
  public opciones: MenuItem[];
  public empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public activar: boolean = false;
  public constantes: any;
  public invPedidosConfiguracionTO: InvPedidosConfiguracionTO = new InvPedidosConfiguracionTO();
  public listaUsuarios: Array<SisListaUsuarioTO> = []; //Lista de usuarios del sistema
  public listaUsuariosTodos: Array<SisListaUsuarioTO> = []; //Lista de usuarios del sistema
  public listaUsuariosFiltrada: Array<SisListaUsuarioTO> = []; // Lista de usuario sin Registrador, Ejecutor, Aprobador.
  public listUsuarioSeleccionado: Array<SisListaUsuarioTO> = []; // Usuarios seleccionados de
  public listaCategorias: Array<InvProductoCategoriaTO> = [];
  public usuarioSeleccionado: any = {};
  public motivoSeleccionado: InvPedidosMotivoTO = new InvPedidosMotivoTO();
  public invPedidosMotivo: InvPedidosMotivo = new InvPedidosMotivo();
  public categoriaSeleccionada: InvProductoCategoriaTO = new InvProductoCategoriaTO();
  public sectorSeleccionado: PrdListaSectorTO = new PrdListaSectorTO();
  public listaSectores: Array<PrdListaSectorTO> = [];
  public accionAgregarUsuario: boolean = false; //Variable para cambiar estado de botones de las listas
  public tipoUsuario: string = "";
  public cargando: boolean = false;
  public isScreamMd: boolean = true;
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public accion: string = null;
  public listadoResultado: Array<InvPedidosMotivoTO> = [];
  public gridApi: GridApi;
  public gridColumnApi: any;
  public filtroGlobal: string = "";
  public tituloFormulario: string = LS.TITULO_CONFIGURACION_PEDIDOS;
  //Tablas
  opcionesRegistrador: any = [];
  opcionesEjecutor: any = [];
  opcionesAprobador: any = [];
  public objetoSeleccionado: InvPedidosMotivoTO = new InvPedidosMotivoTO(); //Objeto actualmente seleccionado
  //AG-GRID
  @ViewChild("menuOpciones") menuOpciones: ContextMenu;
  @ViewChild("cma") cma: ContextMenu;//Context menu aprobador
  public gridAprobador: GridApi;//gria Aprobador
  public gridColumnApiAprobador: any;
  public columnAprobador: Array<object> = [];
  //AG-GRID BUSCAR
  public columnDefs: Array<object> = [];
  public columnDefsSelected: Array<object> = [];
  @ViewChild("cmr") cmr: ContextMenu;//Context menu registrador
  public gridRegistrador: GridApi;//grid registrador
  public gridColumnApiRegistrador: any;
  public columnRegistrador: Array<object> = [];
  @ViewChild("cme") cme: ContextMenu;//Context menu ejecutor
  public gridEjecutor: GridApi;//grid ejecutor
  public gridColumnApiEjecutor: any;
  public columnEjecutor: Array<object> = [];
  public overlayNoRowsTemplate;
  public rowSelection: string;
  public components: any = {};
  public context;
  public frameworkComponents;
  public listRegistradores: Array<InvPedidosMotivoDetalleRegistradoresTO> = new Array();
  public rowIndexTabla: number = 0;

  //formulario
  @ViewChild("frmConfiguracionOP") frmConfiguracionOP: NgForm;
  public valoresIniciales: any;
  public aprobadoresIniciales: any;
  public registradoresIniciales: any;
  public ejecutoresIniciales: any;

  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private configuracionPedidoService: ConfiguracionPedidoService,
    private sistemaService: SistemaService,
    private atajoService: HotkeysService,
    private sectorService: SectorService,
    private utilService: UtilService,
    private filasService: FilasResolve,
    private cdRef: ChangeDetectorRef,
    private categoriaService: ProductoCategoriaService,
    private archivoService: ArchivoService
  ) {
    this.constantes = LS; //Hace referncia a los constantes
  }

  ngOnInit() {
    this.listaEmpresas = this.route.snapshot.data["configuracionPedido"];
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSelect() : null;
    this.isScreamMd = window.innerWidth <= 576 ? false : true;
    this.iniciarAgGrid();
    this.inicializarAtajos();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.isScreamMd = window.innerWidth <= 576 ? false : true;
  }

  inicializarAtajos() {
    this.atajoService.add(new Hotkey(LS.ATAJO_AYUDA, (): boolean => {
      window.open('http://google.com', '_blank');
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById("btnActivarConfiguracionPedidos") as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscarConfiguracionPedidos') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_NUEVO, (): boolean => {
      let element: HTMLElement = document.getElementById('btnNuevoConfiguracionPedidos') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_GUARDAR, (): boolean => {
      let element: HTMLElement = document.getElementById("btnGuardarConfiguracionPedidos") as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_CANCELAR, (): boolean => {
      let element: HTMLElement = document.getElementById("btnCancelarConfiguracionPedidos") as HTMLElement;
      element ? element.click() : null;
      return false;
    }));

    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimir') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnExportar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_CONSULTAR, (): boolean => {
      if (!this.vistaFormulario && this.objetoSeleccionado && this.listadoResultado.length > 0) {
        this.consultarInvPedidoMotivo();
      }
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_EDITAR, (): boolean => {
      if (!this.vistaFormulario && this.objetoSeleccionado && this.listadoResultado.length > 0) {
        this.editarInvPedidoMotivo();
      }
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_ELIMINAR, (): boolean => {
      if (!this.vistaFormulario && this.objetoSeleccionado && this.listadoResultado.length > 0) {
        this.eliminarInvPedidoMotivo();
      }
      return false;
    }));
  }

  //LISTADOS
  listarSectores() {
    this.cargando = true;
    this.listaSectores = [];
    let parametro = { empresa: LS.KEY_EMPRESA_SELECT, mostrarInactivo: false };
    this.sectorService.listarPrdListaSectorTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarSectores(data) {
    this.listaSectores = data;
    if (this.listaSectores.length > 0) {
      let sectorSeleccionado = this.sectorSeleccionado && this.sectorSeleccionado.secCodigo ? this.listaSectores.find(item => item.secCodigo === this.sectorSeleccionado.secCodigo) : this.listaSectores[0];
      this.sectorSeleccionado = sectorSeleccionado ? sectorSeleccionado : this.listaSectores[0];
    } else {
      this.sectorSeleccionado = null;
    }
    this.cargando = false;
  }

  listarCategorias() {
    this.cargando = true;
    this.listaCategorias = [];
    let parametro = { empresa: this.empresaSeleccionada.empCodigo };
    this.categoriaService.listarInvProductoCategoriaTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarInvProductoCategoriaTO(data) {
    this.listaCategorias = data;
    if (this.listaCategorias.length > 0) {
      this.categoriaSeleccionada = this.categoriaSeleccionada && this.categoriaSeleccionada.catCodigo ? this.listaCategorias.find(item => item.catCodigo === this.categoriaSeleccionada.catCodigo) : this.listaCategorias[0];
    } else {
      this.categoriaSeleccionada = null;
    }
    this.cargando = false;
  }

  //OTROS METODOS
  limpiarResultado() {
    this.listadoResultado = [];
    this.invPedidosConfiguracionTO = new InvPedidosConfiguracionTO();
    this.rowIndexTabla = 0;
    this.vistaFormulario = false;
    this.accion = null;
    this.filasTiempo.resetearContador();
    this.actualizarFilas();
  }

  cambiarEmpresaSelect() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.listaUsuarios = [];
    this.listaUsuariosTodos = [];
    this.listaSectores = [];
    this.sectorSeleccionado = null;
    let parametro = { empresa: LS.KEY_EMPRESA_SELECT, incluirInactivos: false }
    this.sistemaService.getListaSisUsuario(parametro, this, LS.KEY_EMPRESA_SELECT);
    this.listarSectores();
    this.listarCategorias();
    this.limpiarResultado();
  }

  despuesDeListarUsuario(listaUsuario) {
    this.listaUsuarios = listaUsuario ? listaUsuario : [];
    this.listaUsuariosTodos = listaUsuario ? listaUsuario : [];
  }

  //#region [R3] Formulario de ingreso
  mostrarAgregarUsuario(tipoUsuario: string) {
    if (this.empresaSeleccionada.listaSisPermisoTO.gruCrear) {
      this.tipoUsuario = tipoUsuario;
      this.activar = false;
      this.listaUsuarios = [...this.listaUsuariosTodos];
      this.listUsuarioSeleccionado = [];
      this.accionAgregarUsuario = true;
      this.cdRef.detectChanges();
    } else {
      this.toastr.warning(LS.ERROR_403_TEXTO, LS.ERROR_403_TITULO);
    }
  }

  //Agregar los usuarios a las listas respectivas
  agregarUsuario() {
    if (this.listUsuarioSeleccionado.length == 0) {
      this.toastr.info(LS.MSJ_SELECCIONE_USUARIO, "");
    } else if (!this.empresaSeleccionada.listaSisPermisoTO.gruCrear) {
      this.toastr.warning(LS.ERROR_403_TEXTO, LS.ERROR_403_TITULO);
    } else {
      var invPedidosConfiguracionTOCopia = Object.assign({}, this.invPedidosConfiguracionTO);
      switch (this.tipoUsuario) {
        case LS.TAG_REGISTRADOR: {
          this.listUsuarioSeleccionado.forEach(sisListaUsuarioTO => {
            let registrador = invPedidosConfiguracionTOCopia.listRegistradores ? invPedidosConfiguracionTOCopia.listRegistradores.find(item => item.usuario.usrCodigo === sisListaUsuarioTO.usrCodigo) : null;
            if (registrador) {
              if (registrador.activo) {
                this.toastr.warning(LS.MSJ_REGISTRADOR_MISMA_IDENTIFICACION, LS.PEDIDOS_CONFIGURACION_NUEVO);
              } else {
                registrador.activo = true;
                this.gridRegistrador ? this.gridRegistrador.updateRowData({ add: [registrador] }) : null;
              }
            } else {
              let usuarioAux = new InvPedidosMotivoDetalleRegistradoresTO({ activo: true, detSecuencial: 0, invPedidosMotivoTO: this.motivoSeleccionado });
              usuarioAux.usuario = sisListaUsuarioTO;
              invPedidosConfiguracionTOCopia.listRegistradores.push(usuarioAux);
              this.gridRegistrador ? this.gridRegistrador.updateRowData({ add: [usuarioAux] }) : null;
            }
          });
          break;
        }
        case LS.TAG_EJECUTOR: {
          this.listUsuarioSeleccionado.forEach(sisListaUsuarioTO => {
            let ejecutor = invPedidosConfiguracionTOCopia.listEjecutores ? invPedidosConfiguracionTOCopia.listEjecutores.find(item => item.usuario.usrCodigo === sisListaUsuarioTO.usrCodigo) : null;
            if (ejecutor) {
              if (ejecutor.activo) {
                this.toastr.warning(LS.MSJ_REGISTRADOR_MISMA_IDENTIFICACION, LS.PEDIDOS_CONFIGURACION_NUEVO);
              } else {
                ejecutor.activo = true;
                this.gridEjecutor ? this.gridEjecutor.updateRowData({ add: [ejecutor] }) : null;
              }
            } else {
              let usuarioAux = new InvPedidosMotivoDetalleEjecutoresTO({ activo: true, detSecuencial: 0, invPedidosMotivoTO: this.motivoSeleccionado });
              usuarioAux.usuario = sisListaUsuarioTO;
              invPedidosConfiguracionTOCopia.listEjecutores.push(usuarioAux);
              this.gridEjecutor ? this.gridEjecutor.updateRowData({ add: [usuarioAux] }) : null;
            }
          });
          break;
        }
        case LS.TAG_APROBADOR: {
          this.listUsuarioSeleccionado.forEach(sisListaUsuarioTO => {
            let aprobador = invPedidosConfiguracionTOCopia.listAprobadores ? invPedidosConfiguracionTOCopia.listAprobadores.find(item => item.usuario.usrCodigo === sisListaUsuarioTO.usrCodigo) : null;
            if (aprobador) {
              if (aprobador.activo) {
                this.toastr.warning(LS.MSJ_REGISTRADOR_MISMA_IDENTIFICACION, LS.PEDIDOS_CONFIGURACION_NUEVO);
              } else {
                aprobador.activo = true;
                this.gridAprobador ? this.gridAprobador.updateRowData({ add: [aprobador] }) : null;
              }
            } else {
              let usuarioAux = new InvPedidosMotivoDetalleAprobadoresTO({ activo: true, detSecuencial: 0, invPedidosMotivoTO: this.motivoSeleccionado });
              usuarioAux.usuario = sisListaUsuarioTO;
              invPedidosConfiguracionTOCopia.listAprobadores.push(usuarioAux);
              this.gridAprobador ? this.gridAprobador.updateRowData({ add: [usuarioAux] }) : null;
            }
          });
          break;
        }
      }
      this.invPedidosConfiguracionTO = invPedidosConfiguracionTOCopia;
      this.actualizarListaUsuario();
    }
  }

  //Permite eliminar de la lista de filtrados a los usuarios que sean eliminados de Registrador, Ejecutor, Aprobar
  actualizarListaUsuario() {
    this.listUsuarioSeleccionado.forEach(usuario => {
      this.listaUsuarios.splice(this.listaUsuarios.findIndex(item => item.usrCodigo === usuario.usrCodigo), 1);
    });
    this.cancelarAgregarUsuario();
  }

  /** Filtra la lista de usuarios por el nombre y el apellido*/
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

  //Permite Agregar de la lista de filtrados a los usuarios que sean eliminados de Registrador,Ejecutor,
  eliminarUsuarioLista(tipoUsuario: string) {
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
          switch (tipoUsuario) {
            case LS.TAG_REGISTRADOR: {
              index = this.invPedidosConfiguracionTO.listRegistradores.findIndex(item => item.usuario.usrCodigo === this.usuarioSeleccionado.usuario.usrCodigo);
              index > -1 ? this.invPedidosConfiguracionTO.listRegistradores[index].activo = false : null;//Retorna el valor actualizado
              this.gridRegistrador ? this.gridRegistrador.updateRowData({ remove: [this.invPedidosConfiguracionTO.listRegistradores[index]] }) : null;
              break;
            }
            case LS.TAG_EJECUTOR: {
              index = this.invPedidosConfiguracionTO.listEjecutores.findIndex(item => item.usuario.usrCodigo === this.usuarioSeleccionado.usuario.usrCodigo);
              index > -1 ? this.invPedidosConfiguracionTO.listEjecutores[index].activo = false : null;//Retorna el valor actualizado
              this.gridEjecutor ? this.gridEjecutor.updateRowData({ remove: [this.invPedidosConfiguracionTO.listEjecutores[index]] }) : null;
              break;
            }
            case LS.TAG_APROBADOR: {
              index = this.invPedidosConfiguracionTO.listAprobadores.findIndex(item => item.usuario.usrCodigo === this.usuarioSeleccionado.usuario.usrCodigo);
              index > -1 ? this.invPedidosConfiguracionTO.listAprobadores[index].activo = false : null;//Retorna el valor actualizado
              this.invPedidosConfiguracionTO.listAprobadores[index].activo = false;
              if (this.invPedidosMotivo.pmAprobacionAutomatica) {
                let index2 = this.invPedidosConfiguracionTO.listRegistradores.findIndex(item => item.usuario.usrCodigo === this.usuarioSeleccionado.usuario.usrCodigo);
                index2 > -1 ? this.invPedidosConfiguracionTO.listRegistradores[index2].activo = false : null;
              }
              this.gridAprobador ? this.gridAprobador.updateRowData({ remove: [this.invPedidosConfiguracionTO.listAprobadores[index]] }) : null;
              break;
            }
          }
          //
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

  cancelarAgregarUsuario() {
    this.listUsuarioSeleccionado = [];
    this.listaUsuariosFiltrada = [];
    this.accionAgregarUsuario = false;
  }

  cancelarConfiguracionPedido() {
    this.usuarioSeleccionado = null;
    this.invPedidosConfiguracionTO = new InvPedidosConfiguracionTO();
    this.invPedidosMotivo = new InvPedidosMotivo();
    this.vistaFormulario = false;
    this.accion = null;
    this.tituloFormulario = null;
    this.accionAgregarUsuario = false;
    this.activar = false;
    this.listaUsuarios = [];
  }

  cancelarAccion() {
    if (this.sePuedeCancelar()) {
      this.cancelarConfiguracionPedido();
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
          this.cancelarConfiguracionPedido();
        }
      });
    }
  }

  sePuedeCancelar() {
    return this.utilService.puedoCancelar(this.valoresIniciales, this.frmConfiguracionOP) && this.utilService.compararObjetos(this.registradoresIniciales, this.invPedidosConfiguracionTO.listRegistradores)
      && this.utilService.compararObjetos(this.ejecutoresIniciales, this.invPedidosConfiguracionTO.listEjecutores) && this.utilService.compararObjetos(this.aprobadoresIniciales, this.invPedidosConfiguracionTO.listAprobadores);
  }

  aprobacionAutomatica() {
    if (this.invPedidosMotivo.pmAprobacionAutomatica) {
      this.invPedidosConfiguracionTO.listAprobadores = this.invPedidosConfiguracionTO.listRegistradores;
    }
  }

  //#region [R1] Opciones generales
  refrescarTabla(objetoInvPedidoMotivo: InvPedidosMotivoTO, operacion: string) {
    switch (operacion) {
      case 'I': {//Insertar un elemento en la tabla
        //Si la lista tiene mas de un elemento lo guarda
        if (this.listadoResultado.length > 0) {
          let listaTemporal = [... this.listadoResultado];
          listaTemporal.unshift(objetoInvPedidoMotivo);
          this.listadoResultado = listaTemporal;
          this.rowIndexTabla = 0;
        }
        break;
      }
      case 'U': {//Actualiza un elemento en la tabla
        //Se actualiza la lista
        var indexTemp = this.listadoResultado.findIndex(item => item.pmCodigo === objetoInvPedidoMotivo.pmCodigo);
        let listaTemporal = [... this.listadoResultado];
        listaTemporal[indexTemp] = objetoInvPedidoMotivo;
        this.listadoResultado = listaTemporal;
        this.rowIndexTabla = indexTemp;
        this.refreshGrid();
        break;
      }
      case 'D': {//Elimina un elemento en la tabla
        var indexTemp = this.listadoResultado.findIndex(item => item.pmCodigo === objetoInvPedidoMotivo.pmCodigo);
        let listaTemporal = [...this.listadoResultado];
        listaTemporal.splice(indexTemp, 1);
        this.listadoResultado = listaTemporal;
        this.rowIndexTabla = 0;
        break;
      }
    }
    //  this.refreshGrid();
  }

  ejecutarAccion(data) {
    this.tipoUsuario = data;
    if (this.accion != LS.ACCION_CONSULTAR)
      this.eliminarUsuarioLista(this.tipoUsuario);
  }

  //Menu GENERAL
  generarOpciones() {
    let perConsultar = this.objetoSeleccionado && this.utilService.verificarPermiso(LS.ACCION_CONSULTAR, this) && !this.vistaFormulario && this.sectorSeleccionado && this.sectorSeleccionado.secActivo;
    let perEditar = this.objetoSeleccionado && this.utilService.verificarPermiso(LS.ACCION_EDITAR, this) && !this.vistaFormulario;
    let perEliminar = this.objetoSeleccionado && this.utilService.verificarPermiso(LS.ACCION_ELIMINAR, this) && !this.vistaFormulario;
    let perActivar = this.empresaSeleccionada.listaSisPermisoTO.gruModificar && this.objetoSeleccionado.pmInactivo;
    let perInactivar = this.empresaSeleccionada.listaSisPermisoTO.gruModificar && !this.objetoSeleccionado.pmInactivo;

    this.opciones = [
      { label: LS.ACCION_CONSULTAR, icon: LS.ICON_CONSULTAR, disabled: !perConsultar, command: () => perConsultar ? this.consultarInvPedidoMotivo() : null },
      { label: LS.ACCION_EDITAR, icon: LS.ICON_EDITAR, disabled: !perEditar, command: () => perEditar ? this.editarInvPedidoMotivo() : null },
      { label: LS.ACCION_ELIMINAR, icon: LS.ICON_ELIMINAR, disabled: !perEliminar, command: () => perEliminar ? this.eliminarInvPedidoMotivo() : null },
      this.objetoSeleccionado.pmInactivo ?
        {
          label: LS.ACCION_ACTIVAR,
          icon: LS.ICON_ACTIVAR,
          disabled: !perActivar,
          command: () => perActivar ? this.activarInactivarInvPedidoMotivo() : null
        }
        :
        {
          label: LS.ACCION_INACTIVAR,
          icon: LS.ICON_INACTIVAR,
          disabled: !perInactivar,
          command: () => perInactivar ? this.activarInactivarInvPedidoMotivo() : null
        }

    ];
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

  //MENU USUARIOS
  generarOpcionesConfiguracion() {
    let canDelete = this.empresaSeleccionada.listaSisPermisoTO.gruEliminar && !this.accionAgregarUsuario;
    this.opcionesRegistrador = [
      { label: LS.ACCION_ELIMINAR, icon: LS.ICON_ELIMINAR, disabled: !canDelete, command: canDelete ? () => this.eliminarUsuarioLista(LS.TAG_REGISTRADOR) : null }
    ];
    this.opcionesEjecutor = [
      { label: LS.ACCION_ELIMINAR, icon: LS.ICON_ELIMINAR, disabled: !canDelete, command: canDelete ? () => this.eliminarUsuarioLista(LS.TAG_EJECUTOR) : null }
    ];
    this.opcionesAprobador = [
      { label: LS.ACCION_ELIMINAR, icon: LS.ICON_ELIMINAR, disabled: !canDelete, command: canDelete ? () => this.eliminarUsuarioLista(LS.TAG_APROBADOR) : null }
    ];
  }

  mostrarOpcionesConfiguracion(event, dataSelected, cm) {
    this.mostrarContextMenuConfiguracion(dataSelected, event, cm);
  }

  mostrarContextMenuConfiguracion(data, event, cm) {
    this.usuarioSeleccionado = data;
    this.tipoUsuario = cm === "cmr" ? LS.TAG_REGISTRADOR : (cm === "cma" ? LS.TAG_APROBADOR : LS.TAG_EJECUTOR);
    this.accion !== LS.ACCION_CONSULTAR ? this.generarOpcionesConfiguracion() : null;
    this.accion !== LS.ACCION_CONSULTAR ? cm.show(event) : null;
    this.accion !== LS.ACCION_CONSULTAR ? event.stopPropagation() : null;
  }

  //Tabla GENERAL
  iniciarAgGrid() {
    this.columnRegistrador = this.configuracionPedidoService.generarColumnas(LS.TAG_REGISTRADOR, this);
    this.columnAprobador = this.configuracionPedidoService.generarColumnas(LS.TAG_APROBADOR, this);
    this.columnEjecutor = this.configuracionPedidoService.generarColumnas(LS.TAG_EJECUTOR, this);
    this.components = {};
    this.overlayNoRowsTemplate = LS.MSJ_NO_HAY_DATOS;
    //AGRID BUSCADOR
    this.columnDefs = this.configuracionPedidoService.generarColumnasMotivoPedido();
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
    this.redimencionarColumnas();
  }

  filaFocused(event) {
    let fila = this.gridApi ? this.gridApi.getRowNode(event.rowIndex) : null;
    this.objetoSeleccionado = fila ? fila.data : null;
    // this.rowIndexTabla = this.gridApi ? event.rowIndex : 0;
  }

  redimencionarColumnas() {
    this.gridApi ? this.gridApi.sizeColumnsToFit() : null;
  }

  seleccionarPrimerFila() {
    if (this.gridApi) {
      var firstCol = this.gridColumnApi.getAllDisplayedColumns()[0];
      this.gridApi.setFocusedCell(this.rowIndexTabla, firstCol);
    }
  }

  refreshGrid() {
    this.gridApi ? this.gridApi.refreshCells() : null;
    setTimeout(() => { this.actualizarFilas(); }, 50);
  }

  actualizarFilas() {
    this.filasTiempo.filas = this.gridApi ? this.gridApi.getDisplayedRowCount() : 0;
    this.filasService.actualizarFilas(this.filasTiempo.filas, this.filasTiempo.getTiempo());
  }

  filtrarRapido() {
    this.gridApi ? this.gridApi.setQuickFilter(this.filtroGlobal) : null
  }

  //Tabla de usuarios
  onGridReadyConfiguracion(params, tag) {
    switch (tag) {
      case LS.TAG_REGISTRADOR:
        this.gridRegistrador = params.api;
        this.gridColumnApiRegistrador = params.columnApi;
        this.redimencionarColumnasConfiguracion(this.gridRegistrador);
        this.actualizarFilasConfiguracion(this.gridEjecutor);
        break;
      case LS.TAG_APROBADOR:
        this.gridAprobador = params.api;
        this.gridColumnApiAprobador = params.columnApi;
        this.redimencionarColumnasConfiguracion(this.gridAprobador);
        this.actualizarFilasConfiguracion(this.gridEjecutor);
        break;
      case LS.TAG_EJECUTOR:
        this.gridEjecutor = params.api;
        this.gridColumnApiEjecutor = params.columnApi;
        this.redimencionarColumnasConfiguracion(this.gridEjecutor);
        this.actualizarFilasConfiguracion(this.gridEjecutor);
        break;

    }
  }

  redimencionarColumnasConfiguracion(gridApi) {
    gridApi ? gridApi.sizeColumnsToFit() : null;
  }

  actualizarFilasConfiguracion(gridApi) {
    this.filasTiempo.filas = gridApi ? gridApi.getDisplayedRowCount() : 0;
    this.filasService.actualizarFilas(this.filasTiempo.filas, this.filasTiempo.getTiempo());
  }

  //Operaciones
  nuevoConfiguracionPedido() {
    if (this.utilService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
      this.invPedidosConfiguracionTO = new InvPedidosConfiguracionTO();
      this.categoriaSeleccionada = this.listaCategorias.length > 0 ? this.listaCategorias[0] : null;
      this.accion = LS.ACCION_CREAR;
      this.tituloFormulario = LS.TITULO_FORM_NUEVO_CONFIGURACION_PEDIDOS;
      this.vistaFormulario = true;
      this.iniciarAgGrid();
      this.extraerValoresIniciales();
    }
  }

  consultarInvPedidoMotivo() {
    if (this.utilService.verificarPermiso(LS.ACCION_CONSULTAR, this, true)) {
      this.cargando = true;
      this.accion = LS.ACCION_CONSULTAR;
      this.tituloFormulario = LS.TITULO_FORM_CONSULTAR_CONFIGURACION_PEDIDOS;
      this.obtenerInvPedidoMotivo();
      this.iniciarAgGrid();
    }
  }

  editarInvPedidoMotivo() {
    if (this.utilService.verificarPermiso(LS.ACCION_EDITAR, this, true)) {
      this.cargando = true;
      this.accion = LS.ACCION_EDITAR;
      this.tituloFormulario = LS.TITULO_FORM_EDITAR_CONFIGURACION_PEDIDOS;
      this.obtenerInvPedidoMotivo();
      this.iniciarAgGrid();
    }
  }

  extraerValoresIniciales() {
    setTimeout(() => {
      this.valoresIniciales = JSON.parse(JSON.stringify(this.frmConfiguracionOP ? this.frmConfiguracionOP.value : null));
      this.ejecutoresIniciales = JSON.parse(JSON.stringify(this.invPedidosConfiguracionTO && this.invPedidosConfiguracionTO.listEjecutores ? this.invPedidosConfiguracionTO.listEjecutores : null));
      this.aprobadoresIniciales = JSON.parse(JSON.stringify(this.invPedidosConfiguracionTO && this.invPedidosConfiguracionTO.listAprobadores ? this.invPedidosConfiguracionTO.listAprobadores : null));
      this.registradoresIniciales = JSON.parse(JSON.stringify(this.invPedidosConfiguracionTO && this.invPedidosConfiguracionTO.listRegistradores ? this.invPedidosConfiguracionTO.listRegistradores : null));
    }, 50);
  }

  activarInactivarInvPedidoMotivo() {
    if (this.utilService.verificarPermiso(LS.ACCION_EDITAR, this, true)) {
      let parametros = {
        title: this.objetoSeleccionado.pmInactivo ? LS.MSJ_TITULO_ACTIVAR : LS.MSJ_TITULO_INACTIVAR,
        texto: (this.objetoSeleccionado.pmInactivo ? LS.MSJ_PREGUNTA_ACTIVAR : LS.MSJ_PREGUNTA_INACTIVAR) + "<br>" + "Motivo: " + this.objetoSeleccionado.pmDetalle,
        type: LS.SWAL_QUESTION,
        confirmButtonText: LS.MSJ_SI_ACEPTAR,
        cancelButtonText: LS.MSJ_NO_CANCELAR
      }
      this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
        if (respuesta) {//Si presiona aceptar
          this.cargando = true;
          let parametros = {
            invPedidosMotivoPK: new InvPedidosMotivoPK({ pmEmpresa: this.empresaSeleccionada.empCodigo, pmCodigo: this.objetoSeleccionado.pmCodigo, pmSector: this.sectorSeleccionado.secCodigo }),
            estado: !this.objetoSeleccionado.pmInactivo
          };
          this.configuracionPedidoService.actualizarEstadoInvPedidosConfiguracion(parametros, this, LS.KEY_EMPRESA_SELECT);
        }
      });
    }
  }

  despuesDeActualizarEstadoInvPedidosConfiguracion(respuesta) {
    this.cargando = false;
    this.cancelarConfiguracionPedido();
    this.objetoSeleccionado.pmInactivo = !this.objetoSeleccionado.pmInactivo;
    this.toastr.success(respuesta.operacionMensaje, LS.TOAST_CORRECTO);
    this.refrescarTabla(this.objetoSeleccionado, 'U');
  }

  obtenerInvPedidoMotivo() {
    this.invPedidosMotivo = new InvPedidosMotivo();
    let parametro = { invPedidosMotivoPK: new InvPedidosMotivoPK(this.objetoSeleccionado) };
    this.configuracionPedidoService.obtenerInvPedidosMotivo(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeObtenerInvPedidosMotivo(data) {
    this.invPedidosMotivo = new InvPedidosMotivo(data.motivo);
    this.invPedidosConfiguracionTO = data.configuracion;
    let indiceCategoria = this.invPedidosMotivo.invProductoCategoria ? this.listaCategorias.findIndex(item => item.catCodigo === this.invPedidosMotivo.invProductoCategoria.invProductoCategoriaPK.catCodigo) : -1;
    if (this.listaCategorias.length > 0) {
      this.categoriaSeleccionada = indiceCategoria > -1 ? this.listaCategorias[indiceCategoria] : null;
    }
    this.activar = false;
    this.vistaFormulario = true;
    this.cargando = false;
    this.extraerValoresIniciales();
  }

  listarConfiguracionPedidos(incluirInactivos: boolean) {
    this.cargando = true;
    this.limpiarResultado();
    let sectorpk = this.sectorSeleccionado ? new PrdSectorPK({ secEmpresa: this.empresaSeleccionada.empCodigo, secCodigo: this.sectorSeleccionado.secCodigo }) : null;
    let parametro = { empresa: this.empresaSeleccionada.empCodigo, incluirInactivos: incluirInactivos, prdSectorPK: sectorpk };
    this.filasTiempo.iniciarContador();
    this.configuracionPedidoService.listarInvPedidosMotivoTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarInvPedidosMotivoTO(data) {
    this.filasTiempo.finalizarContador();
    this.listadoResultado = data ? data : [];
    this.cargando = false;
  }

  guardarConfiguracionPedido(form: NgForm) {
    this.accion = LS.ACCION_CREAR;
    if (this.empresaSeleccionada.listaSisPermisoTO.gruCrear && this.utilService.verificarPermiso(this.accion, this, true)) {
      this.cargando = true;
      let formTocado = this.utilService.establecerFormularioTocado(form);
      if (!this.configuracionPedidoService.validarDiasSemana(this.invPedidosMotivo)) {
        this.toastr.warning(LS.MSJ_SELECCIONE_DIA, LS.TOAST_ADVERTENCIA);
        this.cargando = false;
      } else if (!this.configuracionPedidoService.validarUnoEnCadaTabla(this.invPedidosConfiguracionTO, this.invPedidosMotivo.pmAprobacionAutomatica)) {
        this.toastr.warning(LS.MSJ_DEBE_COMPLETAR_UN_REGISTRO_POR_TABLA, LS.TOAST_ADVERTENCIA);
        this.cargando = false;
      } else if (formTocado && form && form.valid) {
        this.aprobacionAutomatica();
        let invPedidosMotivoCopia = this.configuracionPedidoService.formatearInvPedidosMotivo(this.invPedidosMotivo, this);
        let parametro = { invPedidosMotivo: invPedidosMotivoCopia, invPedidosConfiguracionTO: this.invPedidosConfiguracionTO };
        this.configuracionPedidoService.insertarInvPedidosConfiguracion(parametro, this, LS.KEY_EMPRESA_SELECT);
      } else {
        this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        this.cargando = false;
      }
    }
  }

  despuesDeInsertarInvPedidosConfiguracion(respuesta) {
    this.cargando = true;
    this.cancelarConfiguracionPedido();
    let invPedidoMotivoRespuesta = this.configuracionPedidoService.convertirInvPedidosMotivoAInvPedidosMotivoTO(respuesta.extraInfo);
    this.toastr.success(respuesta.operacionMensaje, LS.TOAST_CORRECTO);
    if (this.listadoResultado.length > 0) {
      this.refrescarTabla(invPedidoMotivoRespuesta, 'I');
    } else {
      this.listarConfiguracionPedidos(false);
    }
  }

  actualizarConfiguracionPedido(form: NgForm) {
    if (this.empresaSeleccionada.listaSisPermisoTO.gruModificar && this.utilService.verificarPermiso(this.accion, this, true)) {
      if (!this.sePuedeCancelar()) {
        this.cargando = true;
        let formTocado = this.utilService.establecerFormularioTocado(form);
        if (!this.configuracionPedidoService.validarDiasSemana(this.invPedidosMotivo)) {
          this.toastr.warning(LS.MSJ_SELECCIONE_DIA, LS.TOAST_ADVERTENCIA);
          this.cargando = false;
        } else if (!this.configuracionPedidoService.validarUnoEnCadaTabla(this.invPedidosConfiguracionTO, this.invPedidosMotivo.pmAprobacionAutomatica)) {
          this.toastr.warning(LS.MSJ_DEBE_COMPLETAR_UN_REGISTRO_POR_TABLA, LS.TOAST_ADVERTENCIA);
          this.cargando = false;
        } else if (formTocado && form && form.valid) {
          let invPedidosMotivoCopia = this.configuracionPedidoService.formatearInvPedidosMotivo(this.invPedidosMotivo, this);
          let parametro = { invPedidosMotivo: invPedidosMotivoCopia, invPedidosConfiguracionTO: this.invPedidosConfiguracionTO };
          this.configuracionPedidoService.actualizarInvPedidosConfiguracion(parametro, this, LS.KEY_EMPRESA_SELECT);
        } else {
          this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
          this.cargando = false;
        }
      } else {
        this.cancelarConfiguracionPedido();
        this.utilService.generarSwal(LS.TITULO_CONFIGURACION_PEDIDOS, LS.SWAL_SUCCESS, LS.NO_REALIZO_NINGUN_CAMBIO);
      }
    }
  }

  despuesDeActualizarInvPedidosConfiguracion(respuesta) {
    this.cargando = false;
    this.cancelarConfiguracionPedido();
    let invPedidosMotivoResult = this.configuracionPedidoService.convertirInvPedidosMotivoAInvPedidosMotivoTO(respuesta.extraInfo);
    this.toastr.success(respuesta.operacionMensaje, LS.TOAST_CORRECTO);
    this.refrescarTabla(invPedidosMotivoResult, 'U');
  }

  eliminarInvPedidoMotivo() {
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
          let parametros = { invPedidosMotivoPK: new InvPedidosMotivoPK({ pmEmpresa: this.empresaSeleccionada.empCodigo, pmCodigo: this.objetoSeleccionado.pmCodigo, pmSector: this.sectorSeleccionado.secCodigo }) };
          this.configuracionPedidoService.eliminarInvPedidosConfiguracion(parametros, this, LS.KEY_EMPRESA_SELECT);
        }
      });
    }
  }

  despuesEliminarInvPedidosConfiguracion(respuesta) {
    this.cargando = false;
    this.cancelarConfiguracionPedido();
    this.toastr.success(respuesta.operacionMensaje, LS.TOAST_CORRECTO);
    this.refrescarTabla(this.objetoSeleccionado, 'D');
  }

  imprimir() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      let parametros = { listadoInvPedidosMotivo: this.listadoResultado };
      this.archivoService.postPDF("todocompuWS/pedidosWebController/generarReporteInvPedidosMotivo", parametros, this.empresaSeleccionada)
        .then(data => {
          if (data._body.byteLength > 0) {
            this.utilService.descargarArchivoPDF('listaMotivoPedido' + this.utilService.obtenerHorayFechaActual() + '.pdf', data);
          } else {
            this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR);
          }
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  exportar() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = { listadoInvPedidosMotivo: this.listadoResultado };
      this.archivoService.postExcel("todocompuWS/pedidosWebController/exportarReporteInvPedidosMotivo", parametros, this.empresaSeleccionada)
        .then(data => {
          if (data) {
            this.utilService.descargarArchivoExcel(data._body, 'ListadoMotivosPedido_');
          } else {
            this.toastr.warning(LS.MSJ_NO_DATA);
          }
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  @HostListener("window:beforeunload", ["$event"])
  unloadHandler(event: Event) {
    if (this.accion != LS.ACCION_CONSULTAR && !this.utilService.puedoCancelar(this.valoresIniciales, this.frmConfiguracionOP) && !this.configuracionPedidoService.validarListados(this)) {
      event.returnValue = false;
    } else {
      return true;
    }
  }

}