import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { ContextMenu } from 'primeng/contextmenu';
import { MenuItem } from 'primeng/api';
import { GridApi } from 'ag-grid';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { InvClienteCategoriaTO } from '../../../../entidadesTO/inventario/InvClienteCategoriaTO';
import { ClienteCategoriaService } from '../cliente-categoria/cliente-categoria.service';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { LS } from '../../../../constantes/app-constants';
import { InvCategoriaClienteComboTO } from '../../../../entidadesTO/inventario/InvCategoriaClienteComboTO';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { NgForm } from '@angular/forms';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-tipo-contribuyente',
  templateUrl: './tipo-contribuyente.component.html',
  styleUrls: ['./tipo-contribuyente.component.css']
})
export class TipoContribuyenteComponent implements OnInit {

  @Input() empresaModal: PermisosEmpresaMenuTO;//Si se usara de modal, se debe pasar la empresa
  @Input() razonSocial: string;
  esModal: boolean = false;//Si es modal será true
  empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  listaEmpresas: Array<PermisosEmpresaMenuTO> = Array();
  constantes: any;
  invClienteCategoriaTO: InvClienteCategoriaTO = new InvClienteCategoriaTO();
  frmTitulo: string;
  classTitulo: string;
  vistaFormulario: boolean = false;
  accion: string = null;//Bandera
  cargando: boolean;
  activar: boolean;
  listaIncClienteCategoriaComboListado: Array<InvCategoriaClienteComboTO> = Array();
  tipoContribuyenteSeleccionado = new InvCategoriaClienteComboTO();
  tipoContribuyenteNuevoSeleccionado = new InvCategoriaClienteComboTO();
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
    private clienteCategoriaService: ClienteCategoriaService,
    private filasService: FilasResolve,
    private atajoService: HotkeysService,
    public api: ApiRequestService,
    private toastr: ToastrService,
    public utilService: UtilService,
    public activeModal: NgbActiveModal,
    private route: ActivatedRoute,
  ) {
    this.constantes = LS;
    this.frmTitulo = LS.TITULO_FILTROS;
    this.classTitulo = LS.ICON_FILTRAR;
    this.inicializarAtajos();
  }

  ngOnInit() {
    this.activar = true;
    if (this.empresaModal) {
      this.esModal = true;
      this.listaEmpresas.push(this.empresaModal);
      this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
      LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
      this.cambiarEmpresaSeleccionada();
      this.buscarTipoContribuyente();
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
      this.cerrarTipoContribuyente();
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscarTipoContribuyente') as HTMLElement;
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
      let element: HTMLElement = document.getElementById('btnNuevoTipoContribuyente') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_EDITAR, (event: KeyboardEvent): boolean => {
      if (!this.vistaFormulario && this.listaIncClienteCategoriaComboListado.length > 0) {
        this.editarTipoContribuyente(this.tipoContribuyenteSeleccionado);
      }
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_ELIMINAR, (event: KeyboardEvent): boolean => {
      if (!this.vistaFormulario && this.listaIncClienteCategoriaComboListado.length > 0) {
        this.eliminarTipoContribuyente(this.tipoContribuyenteSeleccionado);
      }
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_GUARDAR, (event: KeyboardEvent): boolean => {
      if (this.vistaFormulario) {
        let element: HTMLElement = document.getElementById('btnGuardarTipoContribuyente') as HTMLElement;
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
    this.invClienteCategoriaTO = new InvClienteCategoriaTO();
    this.limpiarListado();
    this.vistaFormulario = false;
    this.activar = true;
    this.accion = null;
  }

  buscarTipoContribuyente() {
    this.cargando = true;
    this.accion = null;
    this.limpiarListado();
    let parametro = { empresa: this.empresaSeleccionada.empCodigo };
    this.clienteCategoriaService.listarInvClienteCategoriaTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarInvClienteCategoriaTO(data) {
    this.listaIncClienteCategoriaComboListado = data ? data : [];
    this.cargando = false;
    // validando si no tiene datos que solo muestre el formulario
    if (this.listaIncClienteCategoriaComboListado.length == 0) {
      this.nuevoTipoContribuyente();
    }
  }

  limpiarListado() {
    this.listaIncClienteCategoriaComboListado = [];
    this.tipoContribuyenteSeleccionado = new InvCategoriaClienteComboTO();
    this.actualizarFilas();
  }

  private generarOpciones() {
    let perEditar = this.utilService.verificarPermiso(LS.ACCION_EDITAR, this) && !this.vistaFormulario;
    let perEliminar = this.utilService.verificarPermiso(LS.ACCION_ELIMINAR, this) && !this.vistaFormulario;
    this.opciones = [
      { label: LS.ACCION_EDITAR, icon: LS.ICON_EDITAR, disabled: !perEditar, command: (event) => perEditar ? this.editarTipoContribuyente(this.tipoContribuyenteSeleccionado) : null },
      { label: LS.ACCION_ELIMINAR, icon: LS.ICON_ELIMINAR, disabled: !perEliminar, command: (event) => perEliminar ? this.eliminarTipoContribuyente(this.tipoContribuyenteSeleccionado) : null }
    ];
  }

  nuevoTipoContribuyente() {
    if (this.utilService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
      this.cargando = true;
      this.accion = LS.ACCION_CREAR;
      this.frmTitulo = LS.TITULO_FORM_NUEVO_TIPO_CONTRIBUYENTE;
      this.classTitulo = LS.ICON_CREAR;
      this.invClienteCategoriaTO = new InvClienteCategoriaTO();
      this.vistaFormulario = true;
      this.cargando = false;
      this.activar = false;
    }
  }

  guardarTipoContribuyente(form: NgForm) {
    if (this.utilService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
      this.cargando = true;
      let formularioTocado = this.utilService.establecerFormularioTocado(form);
      if (form && form.valid && formularioTocado) {
        let invClienteCategoriaCopia = this.clienteCategoriaService.formatearInvClienteCategoria(this.invClienteCategoriaTO, this);
        let parametro = { invClienteCategoriaTO: invClienteCategoriaCopia, accion: 'I' };
        this.api.post("todocompuWS/inventarioWebController/accionInvClienteCategoria", parametro, LS.KEY_EMPRESA_SELECT)
          .then(respuesta => {
            if (respuesta && respuesta.extraInfo) {
              this.tipoContribuyenteNuevoSeleccionado = invClienteCategoriaCopia;
              this.resetearFormulario();
              this.refrescarTabla(invClienteCategoriaCopia, 'I');
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
    this.invClienteCategoriaTO = new InvClienteCategoriaTO();
    this.vistaFormulario = false;
    this.accion = null;
  }

  editarTipoContribuyente(tipoContribuyente: InvCategoriaClienteComboTO) {
    if (this.utilService.verificarPermiso(LS.ACCION_EDITAR, this, true)) {
      this.cargando = true;
      this.accion = LS.ACCION_EDITAR;
      this.frmTitulo = LS.TITULO_FORM_EDITAR_TIPO_CONTRIBUYENTE;
      this.classTitulo = LS.ICON_EDITAR;
      this.invClienteCategoriaTO = new InvClienteCategoriaTO(tipoContribuyente);
      this.vistaFormulario = true;
      this.cargando = false;
      this.activar = false;
    }
  }

  actualizarTipoContribuyente(form: NgForm) {
    if (this.utilService.verificarPermiso(LS.ACCION_EDITAR, this, true)) {
      this.cargando = true;
      let formularioTocado = this.utilService.establecerFormularioTocado(form);
      if (form && form.valid && formularioTocado) {
        let invClienteCategoriaCopia = this.clienteCategoriaService.formatearInvClienteCategoria(this.invClienteCategoriaTO, this);
        let parametro = { invClienteCategoriaTO: invClienteCategoriaCopia, accion: 'M' };
        this.api.post("todocompuWS/inventarioWebController/accionInvClienteCategoria", parametro, LS.KEY_EMPRESA_SELECT)
          .then(respuesta => {
            if (respuesta && respuesta.extraInfo) {
              this.tipoContribuyenteNuevoSeleccionado = invClienteCategoriaCopia;
              this.resetearFormulario();
              this.refrescarTabla(invClienteCategoriaCopia, 'U');
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

  eliminarTipoContribuyente(tipoContribuyente: InvCategoriaClienteComboTO) {
    if (this.utilService.verificarPermiso(LS.ACCION_ELIMINAR, this, true)) {
      let parametros = {
        title: LS.MSJ_TITULO_ELIMINAR,
        texto: LS.MSJ_PREGUNTA_ELIMINAR + "<br>" + "Código: " + tipoContribuyente.ccCodigo,
        type: LS.SWAL_QUESTION,
        confirmButtonText: LS.MSJ_SI_ACEPTAR,
        cancelButtonText: LS.MSJ_NO_CANCELAR
      };
      this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
        if (respuesta) {//Si presiona aceptar
          this.cargando = true;
          let parametro = { invClienteCategoriaTO: this.tipoContribuyenteSeleccionado, accion: 'E' };
          this.api.post("todocompuWS/inventarioWebController/accionInvClienteCategoria", parametro, LS.KEY_EMPRESA_SELECT)
            .then(respuesta => {
              if (respuesta && respuesta.extraInfo) {
                this.refrescarTabla(tipoContribuyente, 'D');
                this.toastr.success(respuesta.operacionMensaje, LS.TOAST_CORRECTO);
                if (this.listaIncClienteCategoriaComboListado.length == 0) {
                  this.nuevoTipoContribuyente();
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

  cerrarTipoContribuyente() {
    this.tipoContribuyenteNuevoSeleccionado = this.tipoContribuyenteNuevoSeleccionado && this.tipoContribuyenteNuevoSeleccionado.ccCodigo == "" ?
      null : this.tipoContribuyenteNuevoSeleccionado;
    let parametro = {
      listaTipoContribuyente: this.listaIncClienteCategoriaComboListado,
      tipoContribuyenteSeleccionado: this.tipoContribuyenteNuevoSeleccionado
    }
    this.activeModal.close(parametro);
  }

  //#region [R3] [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.clienteCategoriaService.generarColumnas();
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
    this.tipoContribuyenteSeleccionado = fila ? fila.data : null;
  }

  mostrarOpciones(event, dataSelected) {
    this.mostrarContextMenu(dataSelected, event);
  }

  mostrarContextMenu(data, event) {
    this.tipoContribuyenteSeleccionado = data;
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

  refrescarTabla(tipoContribuyente: InvCategoriaClienteComboTO, operacion: string) {
    switch (operacion) {
      case 'I': {//Insertar un elemento en la tabla
        //Si la lista tiene mas de un elemento lo guarda
        if (this.listaIncClienteCategoriaComboListado.length > 0) {
          let listaTemporal = [... this.listaIncClienteCategoriaComboListado];
          listaTemporal.unshift(tipoContribuyente);
          this.listaIncClienteCategoriaComboListado = listaTemporal;
          this.seleccionarFila(0);
        }
        break;
      }
      case 'U': {//Actualiza un elemento en la tabla
        //Se actualiza la lista
        var indexTemp = this.listaIncClienteCategoriaComboListado.findIndex(item => item.ccCodigo === tipoContribuyente.ccCodigo);
        let listaTemporal = [... this.listaIncClienteCategoriaComboListado];
        listaTemporal[indexTemp] = tipoContribuyente;
        this.listaIncClienteCategoriaComboListado = listaTemporal;
        this.seleccionarFila(indexTemp);
        break;
      }
      case 'D': {//Elimina un elemento en la tabla
        //Actualizan las listas 
        var indexTemp = this.listaIncClienteCategoriaComboListado.findIndex(item => item.ccCodigo === tipoContribuyente.ccCodigo);
        let listaTemporal = [...this.listaIncClienteCategoriaComboListado];
        listaTemporal.splice(indexTemp, 1);
        this.listaIncClienteCategoriaComboListado = listaTemporal;
        (this.listaIncClienteCategoriaComboListado.length > 0) ? this.seleccionarFila((indexTemp === 0) ? 0 : (indexTemp - 1)) : null;
        break;
      }
    }
    this.activar = true;
  }
  //#endregion
}
