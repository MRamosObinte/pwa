import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { LS } from '../../../../constantes/app-constants';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { CuentaService } from '../../archivo/cuenta/cuenta.service';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { ToastrService } from 'ngx-toastr';
import { MenuItem } from 'primeng/api';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import * as moment from 'moment';
import { BanComboBancoTO } from '../../../../entidadesTO/banco/BanComboBancoTO';
import { CambiarFechaVencimientoChequeService } from './cambiar-fecha-vencimiento-cheque.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-cambiar-fecha-vencimiento-cheque',
  templateUrl: './cambiar-fecha-vencimiento-cheque.component.html',
  styleUrls: ['./cambiar-fecha-vencimiento-cheque.component.css']
})
export class CambiarFechaVencimientoChequeComponent implements OnInit {

  @Input() isModal: boolean;
  @Input() parametrosBusqueda;
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
  public fechaNueva: Date = new Date();
  public es: object = {};
  public listadoBancoCuenta: Array<BanComboBancoTO> = [];
  public cuentaComboSeleccionado: BanComboBancoTO = new BanComboBancoTO();
  public numeroCheque: string = "";
  public mostrarFormulario = true;
  @ViewChild("frmCheque") frmCheque: NgForm;
  public valoresIniciales: any;

  constructor(
    public activeModal: NgbActiveModal,
    private route: ActivatedRoute,
    private utilService: UtilService,
    private filasService: FilasResolve,
    private cuentaService: CuentaService,
    private cambiarFechaVencimientoChequeService: CambiarFechaVencimientoChequeService,
    private atajoService: HotkeysService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.constantes = LS;
    moment.locale('es');
    this.es = this.utilService.setLocaleDate();
    this.listaEmpresas = this.route.snapshot.data['cambiarFechaVencimientoCheque'];
    this.innerWidth = window.innerWidth;
    this.isScreamMd = this.innerWidth <= 576 ? false : true;
    this.listaEmpresas ? this.empresaSeleccionada = this.listaEmpresas[0] : null;
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.generarAtajosTeclado();
  }

  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.listarBancoCuenta();
    this.filasService.actualizarFilas("0", "0");
  }

  extraerValoresIniciales() {
    setTimeout(() => {
      this.valoresIniciales = JSON.parse(JSON.stringify(this.frmCheque ? this.frmCheque.value : null));
    }, 50);
  }

  listarBancoCuenta() {
    this.cargando = true;
    let parametro = {
      empresa: this.empresaSeleccionada.empCodigo,
    };
    this.cuentaService.listarGetBanComboBancoTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  /** Metodo que se ejecuta despues de haber ejecutado el metodo listaCuentasTO()*/
  despuesDeGetBanComboBancoTO(data) {
    this.listadoBancoCuenta = data;
    this.cuentaComboSeleccionado = this.listadoBancoCuenta ? this.listadoBancoCuenta[0] : undefined;
    this.cargando = false;
    this.extraerValoresIniciales();
  }

  cambiarFechaVencimientoCheque(form: NgForm) {
    if (this.cambiarFechaVencimientoChequeService.verificarPermiso(LS.ACCION_EDITAR, true)) {
      this.cargando = true;
      let formularioTocado = this.utilService.establecerFormularioTocado(form);
      if (form && form.valid && formularioTocado) {
        if (!this.utilService.puedoCancelar(this.valoresIniciales, this.frmCheque)) {
          let parametro = {
            empresa: this.empresaSeleccionada.empCodigo,
            cuenta: this.cuentaComboSeleccionado.ctaContable,
            numero: this.numeroCheque,
            fecha: this.fechaNueva,
          };
          this.cambiarFechaVencimientoChequeService.modificarFechaBanChequeTO(parametro, this, LS.KEY_EMPRESA_SELECT);
        } else {
          this.limpiarFormulario();
          this.utilService.generarSwal(LS.INVENTARIO_CHEQUES_CAMBIAR_FECHA_VENCIMIENTO, LS.SWAL_SUCCESS, LS.NO_REALIZO_NINGUN_CAMBIO);
        }
      } else {
        this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        this.cargando = false;
      }
    }
  }

  despuesModificarFechaBanChequeTO(data) {
    this.cargando = false;
    if (data) {
      this.limpiarFormulario();
    }
  }

  limpiarFormulario() {
    this.numeroCheque = "";
    this.fechaNueva = new Date();
  }

  generarAtajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_GUARDAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnGuardar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_CANCELAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnCancelar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  cancelar() {
    if (this.utilService.puedoCancelar(this.valoresIniciales, this.frmCheque)) {
      this.mostrarFormulario = !this.mostrarFormulario;
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
          this.mostrarFormulario = !this.mostrarFormulario;
        }
      });
    }
  }

}
