import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { LS } from '../../../../constantes/app-constants';
import { MenuItem } from 'primeng/api';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { BanComboBancoTO } from '../../../../entidadesTO/banco/BanComboBancoTO';
import { CambioChequeGeneraContableService } from './cambio-cheque-genera-contable.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { CuentaService } from '../../archivo/cuenta/cuenta.service';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';
import { TipoContableService } from '../../../contabilidad/archivo/tipo-contable/tipo-contable.service';
import { ConTipoTO } from '../../../../entidadesTO/contabilidad/ConTipoTO';

@Component({
  selector: 'app-cambio-cheque-genera-contable',
  templateUrl: './cambio-cheque-genera-contable.component.html',
  styleUrls: ['./cambio-cheque-genera-contable.component.css']
})
export class CambioChequeGeneraContableComponent implements OnInit {

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
  public fecha: Date = new Date();
  public es: object = {};
  public listadoBancoCuenta: Array<BanComboBancoTO> = [];
  public cuentaComboSeleccionado: BanComboBancoTO = new BanComboBancoTO();
  public cuentaComboSeleccionadoActual: BanComboBancoTO = new BanComboBancoTO();
  public listadoTipoContable: Array<ConTipoTO> = [];
  public tipoContableSeleccionado: ConTipoTO;
  public numeroChequeAnterior: string = "";
  public numeroChequeNuevo: string = "";
  public observaciones: string = "";
  public mostrarFormulario = true;
  @ViewChild("frmCheque") frmCheque: NgForm;
  public valoresIniciales: any;

  constructor(
    public activeModal: NgbActiveModal,
    private route: ActivatedRoute,
    private utilService: UtilService,
    private filasService: FilasResolve,
    private cuentaService: CuentaService,
    private atajoService: HotkeysService,
    private cambioChequeGeneraContableService: CambioChequeGeneraContableService,
    private tipoContableService: TipoContableService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.constantes = LS;
    this.es = this.utilService.setLocaleDate();
    this.listaEmpresas = this.route.snapshot.data['cambioChequeGeneraContable'];
    this.innerWidth = window.innerWidth;
    this.isScreamMd = this.innerWidth <= 576 ? false : true;
    this.listaEmpresas ? this.empresaSeleccionada = this.listaEmpresas[0] : null;
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    this.generarAtajosTeclado();
  }

  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.listarBancoCuenta();
    this.listarTiposContables();
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
    this.cuentaComboSeleccionado = this.listadoBancoCuenta ? this.listadoBancoCuenta[0] : null;
    this.cuentaComboSeleccionadoActual = this.listadoBancoCuenta ? this.listadoBancoCuenta[0] : null;
    this.cargando = false;
    this.extraerValoresIniciales();
  }

  //Metodo que lista los tipos contables
  listarTiposContables() {
    this.cargando = true;
    this.tipoContableService.listarTipoContable({ empresa: LS.KEY_EMPRESA_SELECT }, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarTipoContable(listaTipos) {
    this.cargando = false;
    this.listadoTipoContable = listaTipos;
    this.tipoContableSeleccionado = this.listadoTipoContable ? this.listadoTipoContable[0] : null;
  }

  cambiarContableCheque(form: NgForm) {
    if (this.cambioChequeGeneraContableService.verificarPermiso(LS.ACCION_EDITAR, true)) {
      this.cargando = true;
      let formularioTocado = this.utilService.establecerFormularioTocado(form);
      if (form && form.valid && formularioTocado) {
        if (!this.utilService.puedoCancelar(this.valoresIniciales, this.frmCheque)) {
          let parametro = {
            empresa: this.empresaSeleccionada.empCodigo,
            cuenta: this.cuentaComboSeleccionado.ctaContable,
            cuentaActual: this.cuentaComboSeleccionadoActual.ctaContable,
            chequeAnterior: this.numeroChequeAnterior,
            chequeNuevo: this.numeroChequeNuevo,
            observaciones: this.observaciones,
            fecha: this.fecha,
            con_tipo_cod: this.tipoContableSeleccionado.tipCodigo
          };
          this.cambioChequeGeneraContableService.cambioDeCheque(parametro, this, LS.KEY_EMPRESA_SELECT);
        } else {
          this.limpiarFormulario();
          this.utilService.generarSwal(LS.INVENTARIO_CAMBIO_CHEQUE_GENERA_CONTABLE, LS.SWAL_SUCCESS, LS.NO_REALIZO_NINGUN_CAMBIO);
        }
      } else {
        this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        this.cargando = false;
      }
    }
  }

  despuesCambioDeCheque(data) {
    this.cargando = false;
    if (data) {
      this.limpiarFormulario();
    }
  }

  limpiarFormulario() {
    this.tipoContableSeleccionado = this.listadoTipoContable ? this.listadoTipoContable[0] : null;
    this.fecha = new Date();
    this.cuentaComboSeleccionado = this.listadoBancoCuenta ? this.listadoBancoCuenta[0] : null;
    this.cuentaComboSeleccionadoActual = this.listadoBancoCuenta ? this.listadoBancoCuenta[0] : null;
    this.numeroChequeAnterior = "";
    this.numeroChequeNuevo = "";
    this.observaciones = "";
  }

  generarAtajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_NUEVO, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnNuevo') as HTMLElement;
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
