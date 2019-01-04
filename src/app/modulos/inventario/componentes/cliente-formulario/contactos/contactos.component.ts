import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { LS } from '../../../../../constantes/app-constants';
import { InvClienteTO } from '../../../../../entidadesTO/inventario/InvClienteTO';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { MenuItem } from 'primeng/api';
import { Contacto } from '../../../../../entidadesTO/inventario/Contacto';
import { PermisosEmpresaMenuTO } from '../../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { ContextMenu } from 'primeng/contextmenu';
import { GridApi } from 'ag-grid';
import { ClienteService } from '../../../archivo/cliente/cliente.service';
import { UtilService } from '../../../../../serviciosgenerales/util.service';
import { ToastrService } from 'ngx-toastr';
import { InputEstadoComponent } from '../../../../componentes/input-estado/input-estado.component';
import { NgForm } from '@angular/forms';
import { FilasTiempo } from '../../../../../enums/FilasTiempo';
import { FilasResolve } from '../../../../../serviciosgenerales/filas.resolve';

@Component({
  selector: 'app-contactos',
  templateUrl: './contactos.component.html',
  styleUrls: ['./contactos.component.css']
})
export class ContactosComponent implements OnInit {

  public constantes: any = LS;
  public cargando: boolean = false;
  public activar: boolean = false;
  public isScreamMd: boolean = true;
  public vistaFormulario: boolean = false;
  public innerWidth: number;
  public contacto: Contacto = new Contacto();
  public contactoSeleccionado: Contacto = new Contacto();
  public listaContactos: Array<Contacto> = new Array();
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = new Array();
  public accionContacto: string = null;
  public filtroGlobal: string = "";
  public correos: string[] = [];
  @Input() cliente: InvClienteTO;
  @Input() accion: string;
  @Input() empresaSeleccionada: PermisosEmpresaMenuTO;//Si se usara de modal, se debe pasar la empresa
  @Input() razonSocial: string;
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
    public activeModal: NgbActiveModal,
    private atajoService: HotkeysService,
    private clienteService: ClienteService,
    private utilService: UtilService,
    private filasService: FilasResolve,
    private toastr: ToastrService
  ) {
    this.definirAtajosDeTeclado();
  }

  ngOnInit() {
    this.innerWidth = window.innerWidth;
    this.isScreamMd = this.innerWidth <= 576 ? false : true;
    this.listaContactos = this.cliente.cliLugaresEntrega ? JSON.parse(this.cliente.cliLugaresEntrega) : new Array();
    this.listaEmpresas.push(this.empresaSeleccionada);
    if (this.listaContactos.length == 0) {
      this.nuevo();
    }
    this.separarEmail();
    this.contacto.transporte = LS.TAG_TERRESTRE;
    this.iniciarAgGrid(this.accion);
  }

  clickear() {
    let patt = new RegExp(LS.EXP_REGULAR_EMAIL);
    let cor = this.correos[this.correos.length - 1];
    cor = cor.toLowerCase();
    if (!patt.test(cor)) {
      this.toastr.warning(LS.MSJ_CORREO_NO_VALIDO);
      this.correos.splice(this.correos.length - 1);
    } else {
      this.correos[this.correos.length - 1] = cor;
    }
  }

  separarEmail() {
    if (this.contacto.email != "") {
      this.correos = this.contacto.email.split(";");
    }
  }

  agregarEmail() {
    this.contacto.email = "";
    for (let i = 0; i < this.correos.length; i++) {
      if (i < this.correos.length - 1) {
        this.contacto.email += this.correos[i] + ";";
      } else if (i == this.correos.length - 1) {
        this.contacto.email += this.correos[i];
      }
    }
  }

  definirAtajosDeTeclado(): any {
    this.atajoService.add(new Hotkey(LS.ATAJO_NUEVO, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnNuevoGrupoEmp') as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_GUARDAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnGuardarGrupoEmp') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_CANCELAR, (event: KeyboardEvent): boolean => {
      //this.activeModal.close();
      if (this.vistaFormulario) {
        this.resetear();
      }
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_ACEPTAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnAceptar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  aceptar() {
    this.cliente.cliLugaresEntrega = this.listaContactos && this.listaContactos.length > 0 ? JSON.stringify(this.listaContactos) : null;
  }

  soloNumeros(event) {
    return event.charCode >= 48 && event.charCode <= 57
  }

  generarOpciones(seleccionado: Contacto) {
    this.opciones = [
      { label: LS.ACCION_CONSULTAR, icon: LS.ICON_BUSCAR, disabled: this.vistaFormulario, command: (event) => this.consultar() },
      { label: LS.ACCION_EDITAR, icon: LS.ICON_EDITAR, disabled: this.accion === LS.ACCION_CONSULTAR || this.vistaFormulario, command: (event) => this.paraEdicion() },
      { label: LS.ACCION_ELIMINAR, icon: LS.ICON_ELIMINAR, disabled: this.accion === LS.ACCION_CONSULTAR || this.vistaFormulario, command: (event) => this.eliminar() },
      { label: LS.TAG_PREDETERMINAR, icon: LS.ICON_SELECCIONAR, disabled: this.accion === LS.ACCION_CONSULTAR || seleccionado.predeterminado || this.vistaFormulario, command: (event) => this.predeterminar() },
    ];
  }

  consultar() {
    this.contacto = this.contactoSeleccionado;
    this.separarEmail();
    this.vistaFormulario = true;
    this.accionContacto = LS.ACCION_CONSULTAR;
    this.iniciarAgGrid(this.accionContacto);
  }

  paraEdicion() {
    this.contacto = this.contactoSeleccionado;
    this.separarEmail();
    this.vistaFormulario = true;
    this.accionContacto = LS.ACCION_EDITAR;
    this.iniciarAgGrid(this.accionContacto);
  }

  eliminar() {
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
        this.gridApi ? this.gridApi.updateRowData({ remove: [this.contactoSeleccionado] }) : null;
        this.listaContactos = [];
        this.gridApi.forEachNode((rowNode) => {
          this.listaContactos.push(rowNode.data);
          this.contactoSeleccionado.predeterminado ? this.listaContactos[0].predeterminado = true : null;
        });
        this.aceptar();
        if (this.listaContactos.length == 0) {
          this.nuevo();
        }
      }
    });
  }

  predeterminar() {
    let parametros = {
      title: LS.MSJ_TITULO_ELIMINAR,
      texto: LS.MSJ_SOLO_UNO_PREDETERMINADO,
      type: LS.SWAL_WARNING,
      confirmButtonText: "<label style='color: #595959'>" + LS.MSJ_SI_PREDETERMINAR + "</label>",
      cancelButtonText: LS.MSJ_CANCELAR,
      confirmButtonColor: LS.COLOR_ADVERTENCIA
    };
    this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
      if (respuesta) {//Si presiona aceptar
        this.contactoSeleccionado.predeterminado = true;
        this.predeterminarSoloUno();
        this.contactoSeleccionado.predeterminado = true;
        this.gridApi ? this.gridApi.updateRowData({ update: [this.contactoSeleccionado] }) : null;
        this.aceptar();
      }
    });
  }

  nuevo() {
    this.vistaFormulario = true;
    this.accionContacto = LS.ACCION_CREAR;
    this.contacto = new Contacto();
    this.correos = [];
    this.contacto.transporte = this.constantes.TAG_TERRESTRE;
    this.contacto.predeterminado = true;
    this.iniciarAgGrid(this.accionContacto);
  }

  apilarContactos(form: NgForm) {
    let formularioTocado = this.utilService.establecerFormularioTocado(form);
    if (form && form.valid && formularioTocado) {
      if (!this.aRepetidoNombre(form.value.contacto)) {
        if (this.contacto.predeterminado && this.listaContactos && this.listaContactos.length > 0) {
          this.predeterminarSoloUno();
        }
        this.agregarEmail();
        this.listaContactos.push(this.contacto);
        this.gridApi ? this.gridApi.updateRowData({ add: [this.contacto] }) : null;
        this.aceptar();
        this.resetear();
      } else {
        this.focusContacto();
        this.toastr.warning(LS.MSJ_EXISTE_CONTACTO, LS.MSJ_TITULO_EXISTE_CONTACTO);
      }

    } else {
      this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
      this.cargando = false;
    }
  }

  focusContacto() {
    let element = document.getElementById('contacto');
    element ? element.focus() : null;
  }
  aRepetidoNombre(nombre) {
    let n = 0;
    let lista = this.cliente.cliLugaresEntrega ? JSON.parse(this.cliente.cliLugaresEntrega) : new Array();
    if (lista.length > 0) {
      if (this.accionContacto == LS.ACCION_EDITAR) {
        for (var i = 0; i < this.listaContactos.length; i++) {
          if (this.listaContactos[i].contacto == nombre) {
            if (this.listaContactos[i].contacto == nombre) {
              n++;
            }
          }
        }
        if (n == 1) {
          n = 0;
        }
      } else {
        for (var i = 0; i < lista.length; i++) {
          if (lista[i].contacto == nombre) {
            n++;
          }
        }
      }
    }
    return n > 0;
  }

  predeterminarSoloUno() {
    let listaContactos = [];
    this.gridApi.forEachNode(function (rowNode) {
      var data = rowNode.data;
      data.predeterminado = false;
      listaContactos.push(data);
    });
    this.listaContactos = listaContactos;
  }

  actualizarLista() {
    let listaContactos = [];
    this.gridApi.forEachNode(function (rowNode) {
      var data = rowNode.data;
      listaContactos.push(data);
    });
    this.listaContactos = listaContactos;
  }

  editarContactos(form: NgForm) {
    let formularioTocado = this.utilService.establecerFormularioTocado(form);
    if (form && form.valid && formularioTocado) {
      if (!this.aRepetidoNombre(form.value.contacto)) {
        this.agregarEmail();
        this.gridApi ? this.gridApi.updateRowData({ update: [this.contactoSeleccionado] }) : null;
        if (this.contactoSeleccionado.predeterminado && this.listaContactos && this.listaContactos.length > 0) {
          this.predeterminarSoloUno();
          this.contactoSeleccionado.predeterminado = true;
          this.gridApi ? this.gridApi.updateRowData({ update: [this.contactoSeleccionado] }) : null;
        } else {
          this.actualizarLista();
        }
        this.aceptar();
        this.resetear();
      } else {
        this.focusContacto();
        this.toastr.warning(LS.MSJ_EXISTE_CONTACTO, LS.MSJ_TITULO_EXISTE_CONTACTO);
      }
    } else {
      this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
      this.cargando = false;
    }
  }

  resetear() {
    if (this.listaContactos.length != 0) {
      this.listaContactos = this.cliente.cliLugaresEntrega ? JSON.parse(this.cliente.cliLugaresEntrega) : new Array();
      this.contacto = new Contacto();
      this.correos = [];
      this.vistaFormulario = false;
      this.accionContacto = null;
    } else {
      this.activeModal.dismiss('Cross click');
    }

  }

  //#region [R3] [AG-GRID] 
  iniciarAgGrid(accionContacto: string) {
    this.columnDefs = this.clienteService.generarColumnasContacto(accionContacto);
    this.columnDefsSelected = this.columnDefs.slice();
    this.rowSelection = "single";
    this.context = { componentParent: this };
    this.noDatos = LS.MSJ_NO_HAY_DATOS;
    this.frameworkComponents = {
      inputEstado: InputEstadoComponent
    };
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.gridApi.sizeColumnsToFit();
    this.seleccionarPrimerFila();
  }

  seleccionarPrimerFila() {
    if (this.gridApi) {
      var firstCol = this.gridColumnApi.getAllDisplayedColumns()[0];
      this.gridApi.setFocusedCell(0, firstCol);
    }
  }

  filaFocused(event) {
    let fila = this.gridApi ? this.gridApi.getRowNode(event.rowIndex) : null;
    this.contactoSeleccionado = fila ? fila.data : null;
  }

  mostrarOpciones(event, dataSelected) {
    this.mostrarContextMenu(dataSelected, event);
  }

  mostrarContextMenu(data, event) {
    this.contactoSeleccionado = data;
    this.generarOpciones(this.contactoSeleccionado);
    this.menuOpciones.show(event);
    event.stopPropagation();
  }

  ejecutarAccion() {
    this.consultar();
  }
  refreshGrid() {
    this.gridApi ? this.gridApi.refreshCells() : null;
  }

  redimensionarColumnas() {
    this.gridApi ? this.gridApi.sizeColumnsToFit() : null;
  }
  //#endregion
  filtrarRapido() {
    this.gridApi ? this.gridApi.setQuickFilter(this.filtroGlobal) : null
  }

  actualizarFilas() {
    this.filasTiempo.filas = this.gridApi ? this.gridApi.getDisplayedRowCount() : 0;
    this.filasService.actualizarFilas(this.filasTiempo.filas, this.filasTiempo.getTiempo());
  }

  tamanioChico() {
    (<HTMLInputElement>document.querySelector('#correocontacto input')).className = 'chico form-control form-control-sm';
  }

  tamanioGrande() {
    if (this.correos.length == 0) { // this.correos.length % 3 == 0
      (<HTMLInputElement>document.querySelector('#correocontacto input')).className = 'grande form-control form-control-sm';
    }
  }
}
