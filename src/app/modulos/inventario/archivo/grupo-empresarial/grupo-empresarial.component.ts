import { Component, OnInit, Input, HostListener, ChangeDetectorRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { LS } from '../../../../constantes/app-constants';
import { ClienteService } from '../cliente/cliente.service';
import { NgForm } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { InvClienteGrupoEmpresarialTO } from '../../../../entidadesTO/inventario/InvClienteGrupoEmpresarialTO';
import { InvClienteGrupoEmpresarial } from '../../../../entidades/inventario/InvClienteGrupoEmpresarial';
import { AuthService } from '../../../../serviciosgenerales/auth.service';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { ContextMenu } from 'primeng/contextmenu';
import { GridApi } from 'ag-grid';

@Component({
  selector: 'app-grupo-empresarial',
  templateUrl: './grupo-empresarial.component.html',
  styleUrls: ['./grupo-empresarial.component.css']
})
export class GrupoEmpresarialComponent implements OnInit {
  public listaResultado: Array<InvClienteGrupoEmpresarialTO> = [];
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public accion: String = null;
  public tituloForm: String = LS.TITULO_FILTROS;
  public empresaSeleccionada: PermisosEmpresaMenuTO;
  public constantes: any = LS;
  public cargando: boolean = false;
  public activar: boolean = false;
  public isScreamMd: boolean = true;
  public innerWidth: number;
  filtroGlobal: string = "";
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public grupoEmpresarialSeleccionado: InvClienteGrupoEmpresarialTO;
  public grupoEmpresarialNuevoSeleccionado: InvClienteGrupoEmpresarialTO;
  public invGrupoEmpresarial: InvClienteGrupoEmpresarial;
  //  CUANDO ES MODAL
  public esModal: boolean = false;//Si es modal será true
  @Input() empresaModal: PermisosEmpresaMenuTO;//Si se usara de modal, se debe pasar la empresa
  @Input() listadoGrupos: Array<InvClienteGrupoEmpresarialTO>;//Si se usara de modal, se debe pasar la empresa
  @Input() razonSocial: string;
  //AG-GRID
  @ViewChild("menuOpciones") menuOpciones: ContextMenu;
  public opciones: MenuItem[]; //Listado de opciones que apareceran en la lista
  public gridApi: GridApi;
  public gridColumnApi: any;
  public columnDefs: Array<object> = [];
  public columnDefsSelected: Array<object> = [];
  public rowSelection: string;
  public context;
  public noDatos: string;
  public frameworkComponents: any;

  constructor(
    private api: ApiRequestService,
    private toastr: ToastrService,
    private auth: AuthService,
    private filasService: FilasResolve,
    private atajoService: HotkeysService,
    private utilService: UtilService,
    public activeModal: NgbActiveModal,
    private cdRef: ChangeDetectorRef,
    private clienteService: ClienteService
  ) { }

  ngOnInit() {
    this.constantes = LS;
    this.innerWidth = window.innerWidth;
    this.isScreamMd = this.innerWidth <= 576 ? false : true;
    this.generarAtajosTeclado();
    if (this.empresaModal) {
      this.esModal = true;
      this.listaEmpresas.push(this.empresaModal);
      this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
      LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
      this.cambiarEmpresaSeleccionada();
      this.listaResultado = this.listadoGrupos;

      if (this.listaResultado.length == 0) {
        this.operacionesGrupoEmpresarial(this.constantes.ACCION_CREAR);
      }
    }
    this.iniciarAgGrid();
    this.cdRef.detectChanges();
  }

  //OTROS METODOS
  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.grupoEmpresarialSeleccionado = new InvClienteGrupoEmpresarialTO();
    this.limpiarListado();
    this.activar = true;
    this.accion = null;
  }

  limpiarListado() {
    this.listaResultado = [];
  }

  resetear() {
    this.activar = true;
    this.accion = null;
    this.tituloForm = LS.TITULO_FILTROS;
    this.filasService.actualizarFilas(this.listaResultado.length, this.filasTiempo.getTiempo());
  }

  generarOpciones() {
    let perEditar = this.empresaSeleccionada.listaSisPermisoTO.gruModificar && !this.accion;
    let perEliminar = this.empresaSeleccionada.listaSisPermisoTO.gruEliminar && !this.accion;
    this.opciones = [
      { label: LS.ACCION_EDITAR, icon: LS.ICON_EDITAR, disabled: !perEditar, command: () => perEditar ? this.operacionesGrupoEmpresarial(LS.ACCION_EDITAR) : null },
      { label: LS.ACCION_ELIMINAR, icon: LS.ICON_ELIMINAR, disabled: !perEliminar, command: () => perEliminar ? this.operacionesGrupoEmpresarial(LS.ACCION_ELIMINAR) : null },
    ];
  }

  refrescarTabla(invClienteGrupoEmpresarialTO: InvClienteGrupoEmpresarialTO, operacion: string) {
    switch (operacion) {
      case 'I': {//Insertar un elemento en la tabla
        //Si la lista tiene mas de un elemento lo 
        if (this.listaResultado.length > 0) {
          let listaTemporal = [... this.listaResultado];
          listaTemporal.unshift(invClienteGrupoEmpresarialTO);
          this.listaResultado = listaTemporal;
          this.seleccionarFila(0);
        }

        break;
      }
      case 'U': {//Actualiza un elemento en la tabla
        //Se actualiza la lista
        var indexTemp = this.listaResultado.findIndex(item => item.geCodigo === invClienteGrupoEmpresarialTO.geCodigo);
        let listaTemporal = [... this.listaResultado];
        listaTemporal[indexTemp] = invClienteGrupoEmpresarialTO;
        this.listaResultado = listaTemporal;
        this.grupoEmpresarialSeleccionado = this.listaResultado[indexTemp];
        this.seleccionarFila(indexTemp);
        break;
      }
      case 'D': {//Elimina un elemento en la tabla
        //Actualizan las listas 
        var indexTemp = this.listaResultado.findIndex(item => item.geCodigo === invClienteGrupoEmpresarialTO.geCodigo);
        this.listaResultado = this.listaResultado.filter((val, i) => i != indexTemp);
        (this.listaResultado.length > 0) ? this.seleccionarFila((indexTemp === 0) ? 0 : (indexTemp - 1)) : null;
        break;
      }
    }
  }

  generarAtajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_ESC, (): boolean => {
      this.cerrarModal();
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscarGrupoEmp') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_NUEVO, (): boolean => {
      let element: HTMLElement = document.getElementById('btnNuevoGrupoEmp') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EDITAR, (): boolean => {
      if (this.listaResultado.length > 0) {
        this.operacionesGrupoEmpresarial(LS.ACCION_EDITAR);
      }
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_ELIMINAR, (): boolean => {
      if (this.listaResultado.length > 0) {
        this.operacionesGrupoEmpresarial(LS.ACCION_ELIMINAR);
      }
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_GUARDAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnGuardarGrupoEmp') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_CANCELAR, (event: KeyboardEvent): boolean => {
      this.resetear();
      return false;
    }))
  }

  setearValores(invGrupoEmpresarialCopia: InvClienteGrupoEmpresarial) {
    invGrupoEmpresarialCopia.invClienteGrupoEmpresarialPK.geEmpresa = LS.KEY_EMPRESA_SELECT;
    invGrupoEmpresarialCopia.invClienteGrupoEmpresarialPK.geCodigo = invGrupoEmpresarialCopia.invClienteGrupoEmpresarialPK.geCodigo.toUpperCase();
    invGrupoEmpresarialCopia.geNombre = invGrupoEmpresarialCopia.geNombre.toUpperCase();
    invGrupoEmpresarialCopia.usrCodigo = this.auth.getCodigoUser();
  }

  convertirGrupoEmpresarialTOAEntidad(invGrupoEmpresarialCopia: InvClienteGrupoEmpresarialTO): InvClienteGrupoEmpresarial {
    let invGrupoEmpresarial = new InvClienteGrupoEmpresarial();
    invGrupoEmpresarial.invClienteGrupoEmpresarialPK.geCodigo = invGrupoEmpresarialCopia.geCodigo;
    invGrupoEmpresarial.invClienteGrupoEmpresarialPK.geEmpresa = invGrupoEmpresarialCopia.geEmpresa;
    invGrupoEmpresarial.geNombre = invGrupoEmpresarialCopia.geNombre;

    return invGrupoEmpresarial;
  }

  convertirEntidadEnEnGrupoEmpresarialTO(invClienteGrupoEmpresarial: InvClienteGrupoEmpresarial): InvClienteGrupoEmpresarialTO {
    let invGrupoEmpresarialTO = new InvClienteGrupoEmpresarialTO();
    invGrupoEmpresarialTO.geCodigo = invClienteGrupoEmpresarial.invClienteGrupoEmpresarialPK.geCodigo;
    invGrupoEmpresarialTO.geEmpresa = invClienteGrupoEmpresarial.invClienteGrupoEmpresarialPK.geEmpresa;
    invGrupoEmpresarialTO.geNombre = invClienteGrupoEmpresarial.geNombre;

    return invGrupoEmpresarialTO;
  }

  //LISTADOS
  listarGruposEmpresariales() {
    this.cargando = true;
    this.accion = null;
    this.limpiarListado();
    let parametro = { empresa: this.empresaSeleccionada.empCodigo };
    this.clienteService.listarGrupoEmpresarial(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarInvClienteGrupoEmpresarial(data) {
    this.listaResultado = data ? data : [];
    this.cargando = false;
  }

  //OPERACIONES
  operacionesGrupoEmpresarial(opcion) {
    switch (opcion) {
      case LS.ACCION_ELIMINAR: {
        if (this.utilService.verificarPermiso(LS.ACCION_ELIMINAR, this, true)) {
          this.invGrupoEmpresarial = this.convertirGrupoEmpresarialTOAEntidad(this.grupoEmpresarialSeleccionado);
          this.eliminarGrupoEmpresarial();
        }
        break;
      }
      case LS.ACCION_CREAR: {
        if (this.utilService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
          this.invGrupoEmpresarial = new InvClienteGrupoEmpresarial();
          this.accion = LS.ACCION_CREAR;
          this.tituloForm = LS.TITULO_FORM_NUEVO_GRUPO_EMPRESARIAL;
          this.activar = false;
        }
        break;
      }
      case LS.ACCION_EDITAR: {
        if (this.utilService.verificarPermiso(LS.ACCION_EDITAR, this, true)) {
          this.invGrupoEmpresarial = this.convertirGrupoEmpresarialTOAEntidad(this.grupoEmpresarialSeleccionado);
          this.accion = LS.ACCION_EDITAR;
          this.tituloForm = LS.TITULO_FORM_EDITAR_GRUPO_EMPRESARIAL;
          this.activar = false;
        }
        break;
      }
    }
  }

  insertarGrupoEmpresarial(form: NgForm) {
    if (this.utilService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
      this.cargando = true;
      let formularioTocado = this.utilService.establecerFormularioTocado(form);
      if (form && form.valid && formularioTocado) {
        let invGrupoEmpresarialCopia = JSON.parse(JSON.stringify(this.invGrupoEmpresarial));
        this.setearValores(invGrupoEmpresarialCopia);
        this.api.post("todocompuWS/inventarioWebController/insertarInvClienteGrupoEmpresarial", { invClienteGrupoEmpresarial: invGrupoEmpresarialCopia }, LS.KEY_EMPRESA_SELECT)
          .then(respuesta => {
            this.cargando = false;
            if (respuesta && respuesta.extraInfo) {
              let invGrupoEmpresarialTOCopia = this.convertirEntidadEnEnGrupoEmpresarialTO(respuesta.extraInfo);
              this.grupoEmpresarialNuevoSeleccionado = invGrupoEmpresarialTOCopia;
              this.refrescarTabla(invGrupoEmpresarialTOCopia, 'I');
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

  actualizarGrupoEmpresarial(form: NgForm) {
    if (this.utilService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
      this.cargando = true;
      let formularioTocado = this.utilService.establecerFormularioTocado(form);
      if (form && form.valid && formularioTocado) {
        let invGrupoEmpresarialCopia = JSON.parse(JSON.stringify(this.invGrupoEmpresarial));
        this.setearValores(invGrupoEmpresarialCopia);
        this.api.post("todocompuWS/inventarioWebController/modificarInvClienteGrupoEmpresarial", { invClienteGrupoEmpresarial: invGrupoEmpresarialCopia }, LS.KEY_EMPRESA_SELECT)
          .then(respuesta => {
            this.cargando = false;
            if (respuesta && respuesta.extraInfo) {
              let invGrupoEmpresarialTOCopia = this.convertirEntidadEnEnGrupoEmpresarialTO(respuesta.extraInfo);
              this.grupoEmpresarialNuevoSeleccionado = invGrupoEmpresarialTOCopia;
              this.refrescarTabla(invGrupoEmpresarialTOCopia, 'U');
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

  eliminarGrupoEmpresarial() {
    if (this.utilService.verificarPermiso(LS.ACCION_ELIMINAR, this, true)) {
      let item = JSON.parse(JSON.stringify(this.invGrupoEmpresarial));
      let parametros = {
        title: LS.MSJ_TITULO_ELIMINAR,
        texto: LS.MSJ_PREGUNTA_ELIMINAR,
        type: LS.SWAL_WARNING,
        confirmButtonText: LS.MSJ_SI_ELIMINAR,
        cancelButtonText: LS.MSJ_NO_CANCELAR,
        confirmButtonColor: LS.COLOR_ELIMINAR
      }
      this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
        if (respuesta) {//Si presiona aceptar
          this.cargando = true;
          this.api.post("todocompuWS/inventarioWebController/eliminarInvClienteGrupoEmpresarial", { pk: item.invClienteGrupoEmpresarialPK }, LS.KEY_EMPRESA_SELECT)
            .then(respuesta => {
              this.cargando = false;
              if (respuesta && respuesta.extraInfo) {
                let invGrupoEmpresarialTOCopia = this.convertirEntidadEnEnGrupoEmpresarialTO(item);
                this.refrescarTabla(invGrupoEmpresarialTOCopia, 'D');
                this.toastr.success(respuesta.operacionMensaje, LS.TAG_AVISO);
                this.resetear();
                if (this.listaResultado.length == 0) {
                  this.operacionesGrupoEmpresarial(this.constantes.ACCION_CREAR);
                }
              } else {
                this.resetear();
                this.toastr.warning(respuesta.operacionMensaje, LS.TAG_AVISO);
              }
            }).catch(err => this.utilService.handleError(err, this));
        } else {
          this.resetear();
        }
      });
    }
  }

  cerrarModal() {
    this.grupoEmpresarialNuevoSeleccionado = this.grupoEmpresarialNuevoSeleccionado && this.grupoEmpresarialNuevoSeleccionado.geCodigo == "" ?
      null : this.grupoEmpresarialNuevoSeleccionado;

    let parametro = {
      listaResultado: this.listaResultado,
      grupoEmpresarialNuevoSeleccionado: this.grupoEmpresarialNuevoSeleccionado
    }
    this.activeModal.close(parametro);
  }

  //#region [R3] [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = [
      {
        headerName: LS.TAG_CODIGO,
        field: 'geCodigo',
        width: 100,
        minWidth: 100
      },
      {
        headerName: LS.TAG_DESCRIPCION,
        field: 'geNombre',
        width: 200,
        minWidth: 200
      },
      this.utilService.getColumnaOpciones()
    ]
    this.columnDefsSelected = this.columnDefs.slice();
    this.rowSelection = "single";
    this.context = { componentParent: this };
    this.noDatos = LS.MSJ_NO_HAY_DATOS;
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.sizeColumnsToFit();
    this.seleccionarFila(0);
  }

  seleccionarFila(index) {
    if (this.gridApi) {
      var firstCol = this.gridColumnApi.getAllDisplayedColumns()[0];
      this.gridApi.setFocusedCell(index, firstCol);
    }
  }

  filaFocused(event) {
    let fila = this.gridApi ? this.gridApi.getRowNode(event.rowIndex) : null;
    this.grupoEmpresarialSeleccionado = fila ? fila.data : null;
  }

  mostrarOpciones(event, dataSelected) {
    this.mostrarContextMenu(dataSelected, event);
  }

  mostrarContextMenu(data, event) {
    this.grupoEmpresarialSeleccionado = data;
    this.generarOpciones();
    this.menuOpciones.show(event);
    event.stopPropagation();
  }

  refreshGrid() {
    this.gridApi ? this.gridApi.refreshCells() : null;
  }

  redimensionarColumnas() {
    this.gridApi ? this.gridApi.sizeColumnsToFit() : null;
  }

  filtrarRapido() {
    this.gridApi ? this.gridApi.setQuickFilter(this.filtroGlobal) : null
  }

  actualizarFilas() {
    this.filasTiempo.filas = this.gridApi ? this.gridApi.getDisplayedRowCount() : 0;
    this.filasService.actualizarFilas(this.filasTiempo.filas, this.filasTiempo.getTiempo());
  }

  /** Actualiza el valor de la pantalla */
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerWidth = window.innerWidth;
    this.isScreamMd = this.innerWidth <= 576 ? false : true;
  }
}
