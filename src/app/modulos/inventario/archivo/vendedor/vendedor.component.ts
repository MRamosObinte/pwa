import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { InvVendedorComboListadoTO } from '../../../../entidadesTO/inventario/InvVendedorComboListadoTO';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { VendedorService } from './vendedor.service';
import { MenuItem } from 'primeng/api';
import { NgForm } from '@angular/forms';
import { InvVendedorTO } from '../../../../entidadesTO/inventario/InvVendedorTO';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { InvVendedorPK } from '../../../../entidades/inventario/InvVendedorPK';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { ActivatedRoute } from '@angular/router';
import { LS } from '../../../../constantes/app-constants';
import { ContextMenu } from 'primeng/contextmenu';
import { GridApi } from 'ag-grid';
import { FilasTiempo } from '../../../../enums/FilasTiempo';

@Component({
  selector: 'app-vendedor',
  templateUrl: './vendedor.component.html',
  styleUrls: ['./vendedor.component.css']
})
export class VendedorComponent implements OnInit {

  @Input() empresaModal: PermisosEmpresaMenuTO;//Si se usara de modal, se debe pasar la empresa
  @Input() razonSocial: string;
  esModal: boolean = false;//Si es modal será true
  empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  listaEmpresas: Array<PermisosEmpresaMenuTO> = Array();
  constantes: any;
  invVendedorTO: InvVendedorTO = new InvVendedorTO();
  frmTitulo: string;
  classTitulo: string;
  vistaFormulario: boolean = false;
  accion: string = null;//Bandera
  cargando: boolean;
  activar: boolean;
  listaInvVendedorComboListadoTO: Array<InvVendedorComboListadoTO> = Array();
  @Input() vendedorSeleccionado = new InvVendedorComboListadoTO();
  vendedorNuevoSeleccionado = new InvVendedorComboListadoTO();
  isScreamMd: boolean = true;
  filtroGlobal: string = "";
  public filasTiempo: FilasTiempo = new FilasTiempo();
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
    private route: ActivatedRoute,
    public api: ApiRequestService,
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    public utilService: UtilService,
    private filasService: FilasResolve,
    private atajoService: HotkeysService,
    private vendedorService: VendedorService
  ) {
    this.constantes = LS;
    this.frmTitulo = LS.TITULO_FILTROS;
    this.classTitulo = LS.ICON_FILTRAR;
    this.inicializarAtajos();
  }

  ngOnInit() {
    if (this.empresaModal) {
      this.esModal = true;
      this.activar = true;
      this.listaEmpresas.push(this.empresaModal);
      this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
      LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
      this.cambiarEmpresaSeleccionada();
      this.buscarVendedores();
    } else {
      this.listaEmpresas = this.route.snapshot.data['vendedor'];
      if (this.listaEmpresas) {
        this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
        LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
        this.cambiarEmpresaSeleccionada();
      }
    }
    this.iniciarAgGrid();
    this.isScreamMd = window.innerWidth <= 576 ? false : true;
  }

  inicializarAtajos() {
    //ATAJOS DE TECLADO
    this.atajoService.add(new Hotkey(LS.ATAJO_ESC, (): boolean => {
      this.cerrarVendedor();
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscarVendedor') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirVendedor') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnExportarVendedor') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_NUEVO, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnNuevoVendedor') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_EDITAR, (event: KeyboardEvent): boolean => {
      if (!this.vistaFormulario && this.listaInvVendedorComboListadoTO.length > 0) {
        this.editarVendedor(this.vendedorSeleccionado);
      }
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_ELIMINAR, (event: KeyboardEvent): boolean => {
      if (!this.vistaFormulario && this.listaInvVendedorComboListadoTO.length > 0) {
        this.eliminarVendedor(this.vendedorSeleccionado);
      }
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_GUARDAR, (event: KeyboardEvent): boolean => {
      if (this.vistaFormulario) {
        let element: HTMLElement = document.getElementById('btnGuardarVendedor') as HTMLElement;
        element ? element.click() : null;
        return false;
      }
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_CANCELAR, (event: KeyboardEvent): boolean => {
      if (this.vistaFormulario) {
        this.resetearFormulario();
      }
      return false;
    }));
  }

  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.invVendedorTO = new InvVendedorTO();
    this.limpiarListado();
    this.vistaFormulario = false;
    this.activar = true;
    this.accion = null;
  }

  buscarVendedores() {
    this.cargando = true;
    this.accion = null;
    this.limpiarListado();
    let parametro = { empresa: this.empresaSeleccionada.empCodigo };
    this.vendedorService.listarComboinvListaVendedorTOs(this, parametro, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarVendedorTOs(data) {
    this.listaInvVendedorComboListadoTO = data ? data : [];
    this.cargando = false;
    // validando si no tiene datos que solo muestre el formulario
    if (this.listaInvVendedorComboListadoTO.length == 0) {
      this.nuevoVendedor();
    }
  }

  limpiarListado() {
    this.listaInvVendedorComboListadoTO = [];
    this.actualizarFilas();
  }

  private generarOpciones() {
    let perEditar = this.utilService.verificarPermiso(LS.ACCION_EDITAR, this) && !this.vistaFormulario;
    let perEliminar = this.utilService.verificarPermiso(LS.ACCION_ELIMINAR, this) && !this.vistaFormulario;
    this.opciones = [
      { label: LS.ACCION_EDITAR, icon: LS.ICON_EDITAR, disabled: !perEditar, command: (event) => perEditar ? this.editarVendedor(this.vendedorSeleccionado) : null },
      { label: LS.ACCION_ELIMINAR, icon: LS.ICON_ELIMINAR, disabled: !perEliminar, command: (event) => perEliminar ? this.eliminarVendedor(this.vendedorSeleccionado) : null }
    ];
  }

  nuevoVendedor() {
    if (this.utilService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
      this.cargando = true;
      this.accion = LS.ACCION_CREAR;
      this.frmTitulo = LS.TITULO_FORM_NUEVO_VENDEDOR;
      this.classTitulo = LS.ICON_CREAR;
      this.invVendedorTO = new InvVendedorTO();
      this.vistaFormulario = true;
      this.cargando = false;
      this.activar = false;
    }
  }

  guardarVendedor(form: NgForm) {
    if (this.utilService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
      this.cargando = true;
      let formularioTocado = this.utilService.establecerFormularioTocado(form);
      if (form && form.valid && formularioTocado) {
        let invVendedorCopia = this.vendedorService.formatearInvVendedor(this.invVendedorTO, this);
        let parametro = { invVendedorTO: invVendedorCopia, accion: 'I' };
        this.api.post("todocompuWS/inventarioWebController/accionInvVendedorTO", parametro, LS.KEY_EMPRESA_SELECT)
          .then(respuesta => {
            if (respuesta && respuesta.extraInfo) {
              this.vendedorNuevoSeleccionado = invVendedorCopia;
              this.resetearFormulario();
              this.refrescarTabla(invVendedorCopia, 'I');
              this.toastr.success(respuesta.operacionMensaje, LS.TOAST_CORRECTO);
            } else {
              this.toastr.warning(respuesta.operacionMensaje, LS.TOAST_ERROR);
            }
            this.cargando = false;
          }).catch(err => this.utilService.handleError(err, this));
      } else {
        this.toastr.warning(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        this.cargando = false;
      }
    }
  }

  resetearFormulario() {
    this.activar = true;
    this.frmTitulo = LS.TITULO_FILTROS
    this.classTitulo = LS.ICON_FILTRAR;
    this.invVendedorTO = new InvVendedorTO();
    this.vistaFormulario = false;
    this.accion = null;
  }

  editarVendedor(vendedor: InvVendedorComboListadoTO) {
    if (this.utilService.verificarPermiso(LS.ACCION_EDITAR, this, true)) {
      this.cargando = true;
      this.accion = LS.ACCION_EDITAR;
      this.frmTitulo = LS.TITULO_FORM_EDITAR_VENDEDOR;
      this.classTitulo = LS.ICON_EDITAR;
      this.invVendedorTO = new InvVendedorTO(vendedor);
      this.vistaFormulario = true;
      this.cargando = false;
      this.activar = false;
    }
  }

  actualizarVendedor(form: NgForm) {
    if (this.utilService.verificarPermiso(LS.ACCION_EDITAR, this, true)) {
      this.cargando = true;
      let formularioTocado = this.utilService.establecerFormularioTocado(form);
      if (form && form.valid && formularioTocado) {
        let invVendedorCopia = this.vendedorService.formatearInvVendedor(this.invVendedorTO, this);
        let parametro = { invVendedorTO: invVendedorCopia, accion: 'M' };
        this.api.post("todocompuWS/inventarioWebController/accionInvVendedorTO", parametro, LS.KEY_EMPRESA_SELECT)
          .then(respuesta => {
            if (respuesta && respuesta.extraInfo) {
              this.vendedorNuevoSeleccionado = invVendedorCopia;
              this.resetearFormulario();
              this.refrescarTabla(invVendedorCopia, 'U');
              this.toastr.success(respuesta.operacionMensaje, LS.TOAST_CORRECTO);
            } else {
              this.toastr.warning(respuesta.operacionMensaje, LS.TOAST_ERROR);
            }
            this.cargando = false;
          }).catch(err => this.utilService.handleError(err, this));
      } else {
        this.toastr.warning(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        this.cargando = false;
      }
    }
  }

  eliminarVendedor(vendedor: InvVendedorComboListadoTO) {
    if (this.utilService.verificarPermiso(LS.ACCION_ELIMINAR, this, true)) {
      let parametros = {
        title: LS.MSJ_TITULO_ELIMINAR,
        texto: LS.MSJ_PREGUNTA_ELIMINAR + "<br>" + LS.TAG_CODIGO + ": " + vendedor.vendCodigo,
        type: LS.SWAL_QUESTION,
        confirmButtonText: LS.MSJ_SI_ACEPTAR,
        cancelButtonText: LS.MSJ_NO_CANCELAR
      };
      this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
        if (respuesta) {//Si presiona aceptar
          this.cargando = true;
          let parametro = { invVendedorPK: new InvVendedorPK({ vendEmpresa: vendedor.vendEmpresa, vendCodigo: vendedor.vendCodigo }) };
          this.api.post("todocompuWS/inventarioWebController/eliminarInvVendedor", parametro, LS.KEY_EMPRESA_SELECT)
            .then(respuesta => {
              if (respuesta && respuesta.extraInfo) {
                this.refrescarTabla(vendedor, 'D');
                this.toastr.success(respuesta.operacionMensaje, LS.TOAST_CORRECTO);
                if (this.listaInvVendedorComboListadoTO.length == 0) {
                  this.nuevoVendedor();
                }
              } else {
                this.toastr.warning(respuesta.operacionMensaje, LS.TOAST_ADVERTENCIA);
              }
              this.cargando = false;
            }).catch(err => this.utilService.handleError(err, this));
        }
      });
    }
  }

  cerrarVendedor() {
    this.vendedorNuevoSeleccionado = this.vendedorNuevoSeleccionado && this.vendedorNuevoSeleccionado.vendCodigo == "" ?
      null : this.vendedorNuevoSeleccionado;
    let parametro = {
      vendedorSeleccionado: this.vendedorNuevoSeleccionado
    }
    this.activeModal.close(parametro);
  }

  //#region [R3] [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.vendedorService.generarColumnas();
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
    this.vendedorSeleccionado = fila ? fila.data : null;
  }

  mostrarOpciones(event, dataSelected) {
    this.mostrarContextMenu(dataSelected, event);
  }

  mostrarContextMenu(data, event) {
    this.vendedorSeleccionado = data;
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

  refrescarTabla(vendedorComboTO: InvVendedorComboListadoTO, operacion: string) {
    switch (operacion) {
      case 'I': {//Insertar un elemento en la tabla
        //Si la lista tiene mas de un elemento lo guarda
        if (this.listaInvVendedorComboListadoTO.length > 0) {
          let listaTemporal = [... this.listaInvVendedorComboListadoTO];
          listaTemporal.unshift(vendedorComboTO);
          this.listaInvVendedorComboListadoTO = listaTemporal;
          this.seleccionarFila(0);
        }
        break;
      }
      case 'U': {//Actualiza un elemento en la tabla
        //Se actualiza la lista
        var indexTemp = this.listaInvVendedorComboListadoTO.findIndex(item => item.vendCodigo === vendedorComboTO.vendCodigo);
        let listaTemporal = [... this.listaInvVendedorComboListadoTO];
        listaTemporal[indexTemp] = vendedorComboTO;
        this.listaInvVendedorComboListadoTO = listaTemporal;
        this.seleccionarFila(indexTemp);
        break;
      }
      case 'D': {//Elimina un elemento en la tabla
        //Actualizan las listas 
        var indexTemp = this.listaInvVendedorComboListadoTO.findIndex(item => item.vendCodigo === vendedorComboTO.vendCodigo);
        let listaTemporal = [...this.listaInvVendedorComboListadoTO];
        listaTemporal.splice(indexTemp, 1);
        this.listaInvVendedorComboListadoTO = listaTemporal;
        (this.listaInvVendedorComboListadoTO.length > 0) ? this.seleccionarFila((indexTemp === 0) ? 0 : (indexTemp - 1)) : null;
        break;
      }
    }
    this.activar = true;
  }
  //#endregion
}
