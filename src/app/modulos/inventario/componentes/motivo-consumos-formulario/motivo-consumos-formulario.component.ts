import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { InvConsumosMotivoTO } from '../../../../entidadesTO/inventario/InvConsumosMotivoTO';
import { LS } from '../../../../constantes/app-constants';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { AuthService } from '../../../../serviciosgenerales/auth.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { SectorService } from '../../../produccion/archivos/sector/sector.service';
import { PrdListaSectorTO } from '../../../../entidadesTO/Produccion/PrdListaSectorTO';
import { MotivoConsumosService } from '../../archivo/motivo-consumos/motivo-consumos.service';
import { InvComboBodegaTO } from '../../../../entidadesTO/inventario/InvComboBodegaTO';
import { NgForm } from '@angular/forms';
import { BodegaService } from '../../archivo/bodega/bodega.service';

@Component({
  selector: 'app-motivo-consumos-formulario',
  templateUrl: './motivo-consumos-formulario.component.html',
  styleUrls: ['./motivo-consumos-formulario.component.css']
})
export class MotivoConsumosFormularioComponent implements OnInit {

  @Input() empresaSeleccionada: PermisosEmpresaMenuTO;
  @Output() enviarCancelar = new EventEmitter();
  @Output() enviarActivar = new EventEmitter();
  @Output() enviarAccion = new EventEmitter();
  @Input() parametros;
  //
  public accion: string = null;
  public innerWidth: number;
  public isScreamMd: boolean = true;
  public cargando: boolean = false;
  public activar: boolean = false;
  public tituloForm: string = "";
  public constantes: any = LS;
  //
  public invConsumosMotivoTO: InvConsumosMotivoTO = new InvConsumosMotivoTO();
  //
  public listaFormaContabilizar: Array<string> = LS.LISTA_MOTIVOS_CONSUMOS_FORMA_CONTABILIZAR;
  public listaSectores: Array<PrdListaSectorTO> = [];
  public sectorSeleccionado: PrdListaSectorTO = new PrdListaSectorTO();
  public listadoBodegas: Array<InvComboBodegaTO> = new Array();
  public bodegaSeleccionada: InvComboBodegaTO = new InvComboBodegaTO();
  //
  public listadoBodegasCopia: Array<InvComboBodegaTO> = new Array();
  @ViewChild("frmMotivoProformaDatos") frmMotivoProformaDatos: NgForm;
  public valoresIniciales: any;
  public motivoConsumoInicial: any;

  constructor(
    private utilService: UtilService,
    private toastr: ToastrService,
    private auth: AuthService,
    private atajoService: HotkeysService,
    private motivoConsumoService: MotivoConsumosService,
    private sectorService: SectorService,
    private bodegaService: BodegaService,
  ) { }

  ngOnInit() {
    this.innerWidth = window.innerWidth;
    this.isScreamMd = this.innerWidth <= 576 ? false : true;
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.accion = this.parametros.accion;
    this.invConsumosMotivoTO = { ...this.parametros.invConsumosMotivoTO };
    this.obtenerDatosParaMotivoConsumos();
    this.extraerValoresIniciales();
    this.generarAtajosTeclado();
  }

  extraerValoresIniciales() {
    setTimeout(() => {
      this.valoresIniciales = JSON.parse(JSON.stringify(this.frmMotivoProformaDatos ? this.frmMotivoProformaDatos.value : null));
      this.motivoConsumoInicial = JSON.parse(JSON.stringify(this.invConsumosMotivoTO ? this.invConsumosMotivoTO : null));
    }, 60);
  }

  /** Metodo para listar los sectores dependiendo de la empresa*/
  obtenerDatosParaMotivoConsumos() {
    this.cargando = true;
    let parametro = { empresa: LS.KEY_EMPRESA_SELECT, inactivo: false, activo: true };
    this.motivoConsumoService.obtenerDatosParaMotivoConsumos(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeObtenerDatosParaMotivoConsumos(data) {
    this.listaSectores = data ? data.listaSector : [];
    this.sectorSeleccionado = this.listaSectores[0];
    this.listadoBodegas = data ? data.listaBodega : [];
    this.listadoBodegasCopia = [...this.listadoBodegas]
    this.bodegaSeleccionada = this.listadoBodegas[0];
    this.operaciones();
  }

  /** Metodo para listar los sectores dependiendo de la empresa*/
  listarSectores() {
    this.cargando = true;
    let parametro = { empresa: LS.KEY_EMPRESA_SELECT, mostrarInactivo: false };
    this.sectorService.listarPrdListaSectorTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  /** Metodo que se ejecuta despues de haber ejecutado el metodo listarSectores()*/
  despuesDeListarSectores(listaSectores) {
    this.listaSectores = listaSectores;
    if (this.listaSectores.length > 0) {
      this.sectorSeleccionado = this.sectorSeleccionado ? this.listaSectores.find(item => item.secCodigo === this.sectorSeleccionado.secCodigo) : this.listarSectores[0];
    } else {
      this.sectorSeleccionado = null;
    }
    this.cargando = false;
  }

  listarInvBodegaComboTO() {
    let parametro = {
      empresa: LS.KEY_EMPRESA_SELECT,
    }
    this.cargando = true;
    this.bodegaService.listarInvComboBodegaTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeListarInvComboBodegaTO(listadoBodegas) {
    this.listadoBodegas = listadoBodegas ? listadoBodegas : [];
    this.bodegaSeleccionada = this.listadoBodegas[0];
    this.cargando = false;
  }

  verificarAntesDeGuardar() {
    if (!this.sectorSeleccionado) {
      this.bodegaSeleccionada = null;
      this.listadoBodegas = null;
    } else {
      this.listadoBodegas = this.listadoBodegasCopia;
      this.bodegaSeleccionada = this.listadoBodegas[0];
    }
  }

  operaciones() {
    switch (this.accion) {
      case LS.ACCION_CREAR:
        this.tituloForm = LS.ACCION_NUEVO + " " + LS.INVENTARIO_MOTIVO_CONSUMO;
        this.obtenerDatosNuevoMotivo();
        break;
      case LS.ACCION_CONSULTAR:
        this.obtenerDatosConsultarEditarMotivo();
        this.tituloForm = LS.ACCION_CONSULTAR + " " + LS.INVENTARIO_MOTIVO_CONSUMO + " : Código: " + this.invConsumosMotivoTO.cmCodigo;
        break;
      case LS.ACCION_EDITAR:
        this.obtenerDatosConsultarEditarMotivo();
        this.tituloForm = LS.ACCION_EDITAR + " " + LS.INVENTARIO_MOTIVO_CONSUMO + " : Código: " + this.invConsumosMotivoTO.cmCodigo;
        break;
    }
  }

  obtenerDatosNuevoMotivo() {
    this.cargando = true;
    this.invConsumosMotivoTO = new InvConsumosMotivoTO();
    this.invConsumosMotivoTO.cmFormaContabilizar = this.listaFormaContabilizar[0];
    this.cargando = false;
  }

  insertarInvConsumoMotivo(form: NgForm) {
    if (this.utilService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
      this.cargando = true;
      let formularioTocado = this.utilService.establecerFormularioTocado(form);
      if (form && form.valid && formularioTocado) {
        let invConsumoMotivoCopia = JSON.parse(JSON.stringify(this.invConsumosMotivoTO));
        this.setearValoresInvConsumoMotivo(invConsumoMotivoCopia);
        let parametro = {
          accionChar: 'I',
          invConsumoMotivoCopia: invConsumoMotivoCopia
        };
        this.cargando = false;
        this.enviarAccion.emit(parametro);
      } else {
        this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        this.cargando = false;
      }
    }
  }

  obtenerDatosConsultarEditarMotivo() {
    this.cargando = true;
    this.invConsumosMotivoTO = this.parametros.invConsumosMotivoTO;
    this.llenarCombos();
    this.cargando = false;
  }

  actualizarInvConsumoMotivo(form: NgForm) {
    if (this.utilService.verificarPermiso(LS.ACCION_EDITAR, this, true)) {
      if (this.utilService.puedoCancelar(this.valoresIniciales, this.frmMotivoProformaDatos)) {
        this.toastr.warning(LS.MSJ_NO_SE_REALIZO_NINGUN_CAMBIO, LS.TOAST_INFORMACION);
        this.enviarCancelar.emit();
      } else {
        this.cargando = true;
        let formularioTocado = this.utilService.establecerFormularioTocado(form);
        if (form && form.valid && formularioTocado) {
          let invConsumoMotivoCopia = JSON.parse(JSON.stringify(this.invConsumosMotivoTO));
          this.setearValoresInvConsumoMotivo(invConsumoMotivoCopia);
          let parametro = {
            accionChar: 'M',
            invConsumoMotivoCopia: invConsumoMotivoCopia
          };
          this.cargando = false;
          this.enviarAccion.emit(parametro);
        } else {
          this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
          this.cargando = false;
        }
      }
    }
  }

  //Otros metodos
  setearValoresInvConsumoMotivo(invConsumosMotivoTO: InvConsumosMotivoTO) {
    invConsumosMotivoTO.usrEmpresa = LS.KEY_EMPRESA_SELECT.trim();
    invConsumosMotivoTO.usrCodigo = this.auth.getCodigoUser().trim();
    invConsumosMotivoTO.cmBodega = this.bodegaSeleccionada && this.bodegaSeleccionada.bodCodigo ? this.bodegaSeleccionada.bodCodigo : null;
    invConsumosMotivoTO.cmSector = this.sectorSeleccionado && this.sectorSeleccionado.secCodigo ? this.sectorSeleccionado.secCodigo : null;
  }

  llenarCombos() {
    this.bodegaSeleccionada = this.motivoConsumoService.seleccionarBodega(this.listadoBodegas, this.invConsumosMotivoTO.cmBodega);
    this.sectorSeleccionado = this.motivoConsumoService.seleccionarSector(this.listaSectores, this.invConsumosMotivoTO.cmSector);
  }

  generarAtajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  cancelar() {
    if (this.utilService.puedoCancelar(this.valoresIniciales, this.frmMotivoProformaDatos)) {
      this.enviarCancelar.emit();
    } else {
      switch (this.accion) {
        case LS.ACCION_EDITAR:
        case LS.ACCION_CREAR:
          let parametros = {
            title: LS.MSJ_TITULO_CANCELAR,
            texto: LS.MSJ_PREGUNTA_CANCELAR,
            type: LS.SWAL_QUESTION,
            confirmButtonText: LS.MSJ_SI,
            cancelButtonText: LS.MSJ_NO
          };
          this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
            if (respuesta) {//Si presiona aceptar
              this.enviarCancelar.emit();
            }
          });
          break;
        default:
          this.enviarCancelar.emit();
      }
    }
  }

  cambiarActivar(activar) {
    this.activar = !activar;
    this.enviarActivar.emit(activar);
  }
}