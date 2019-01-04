import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { ConContable } from '../../../../../entidades/contabilidad/ConContable';
import { PermisosEmpresaMenuTO } from '../../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { SisPeriodo } from '../../../../../entidades/sistema/SisPeriodo';
import { LS } from '../../../../../constantes/app-constants';
import { ConTipoTO } from '../../../../../entidadesTO/contabilidad/ConTipoTO';
import { UtilService } from '../../../../../serviciosgenerales/util.service';
import { NgForm } from '@angular/forms';
import * as moment from 'moment';

@Component({
  selector: 'app-contable-cabecera',
  templateUrl: './contable-cabecera.component.html'
})
export class ContableCabeceraComponent implements OnInit {

  @Input() data;
  @Input() conContable: ConContable = new ConContable();
  @Input() empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  @Input() tipoSeleccionado: ConTipoTO = new ConTipoTO();
  @Output() accionFechaValido = new EventEmitter();

  public listaPeriodos: Array<SisPeriodo> = [];
  public periodoSeleccionado: SisPeriodo = new SisPeriodo();
  public tipoConcepto: string = "";
  public fechaMin: any = null;
  public fechaMax: any = null;
  public constantes: any = LS;
  public es: object = {};
  //VALIDACIONES
  public formularioCorrecto: boolean = false;
  public fechaValido: boolean = true;
  //
  public listaTipos: Array<ConTipoTO> = [];
  //AG-GRID
  public isCollapsed: boolean = false;
  public estilos: any = {};
  @ViewChild("frmContableDetalle") frmContableDetalle: NgForm;
  public valoresIniciales: any;

  constructor(
    private utilService: UtilService
  ) {
  }

  ngOnInit() {
    this.constantes = LS;
    this.empresaSeleccionada = this.data.empresaSeleccionada;
    moment.locale('es');
    this.es = this.utilService.setLocaleDate();
    this.estilos = {
      'width': '100%',
      'height': 'calc(100vh - 365px)'
    }
    if (this.conContable && this.conContable.conContablePK) {
      let fecha = moment(this.conContable.conContablePK.conPeriodo.trim() + '-01');
      this.fechaMin = fecha.startOf('month').toDate();
      this.fechaMax = fecha.endOf('month').toDate();
    }
  }

  extraerValoresIniciales() {
    setTimeout(() => {
      this.valoresIniciales = JSON.parse(JSON.stringify(this.frmContableDetalle ? this.frmContableDetalle.value : null));
    }, 50);
  }

  //INICIALIZACIONES
  collpase() {
    this.isCollapsed = !this.isCollapsed;
    let tamanio = !this.isCollapsed ? '405px' : '260px';
    this.estilos = {
      'width': '100%',
      'height': 'calc(100vh - ' + tamanio + ')'
    }
  }

  /**Metodo para saber si se puede visualizar el contable, si es true, se visualiza caso contrario no se mostrará, para visualizar cuando se se quiere MAYORIZAR, debe estar pendiente. Para visualizar cuando (REVERSAR,ANULAR) no se debe estar anulado,bloqueado,pendiente o reversado */
  sePuedeVisualizarContable(contable): boolean {
    return this.data.accion === LS.ACCION_MAYORIZAR ? contable.conPendiente :
      (!contable.conAnulado && !contable.conBloqueado && !contable.conPendiente && !contable.conReversado);
  }

  /**Metodo para verificar que la fecha del contable este en el rango del periodo seleccionado,variable en html:fechaValido */
  verificarFechaValida() {
    let formTocado = this.utilService.establecerFormularioTocado(this.frmContableDetalle);
    let formularioValido = (formTocado && this.frmContableDetalle.valid);
    this.fechaValido = false;
    this.accionFechaValido.emit(this.fechaValido && formularioValido);
    if (this.conContable.conFecha) {
      let fechaContable = this.conContable.conFecha.getTime();
      this.utilService.validarPeriodo({ fecha: fechaContable }, this, LS.KEY_EMPRESA_SELECT);
    }
  }

  despuesDeValidarPeriodo(periodo) {
    let formTocado = this.utilService.establecerFormularioTocado(this.frmContableDetalle);
    let formularioValido = (formTocado && this.frmContableDetalle.valid);
    if (periodo == null) {
      this.fechaValido = false;
    } else {
      this.fechaValido = !periodo.perCerrado;
    }
    this.accionFechaValido.emit(this.fechaValido && formularioValido);
  }

}
