import { Component, OnInit, Input } from '@angular/core';
import { LS } from '../../../../constantes/app-constants';
import { BanListaChequesNoImpresosTO } from '../../../../entidadesTO/banco/BanListaChequesNoImpresosTO';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { BanComboBancoTO } from '../../../../entidadesTO/banco/BanComboBancoTO';
import { ChequeImpresionService } from './cheque-impresion.service';
import * as moment from 'moment';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ChequeNoImpresoTO } from '../../../../entidadesTO/banco/ChequeNoImpresoTO';
import { BanChequeTO } from '../../../../entidadesTO/banco/BanChequeTO';

@Component({
  selector: 'app-cheque-impresion',
  templateUrl: './cheque-impresion.component.html',
  styleUrls: ['./cheque-impresion.component.css']
})
export class ChequeImpresionComponent implements OnInit {

  public constantes: any = LS;
  public cargando: boolean = false;
  @Input() chequeSeleccionado: BanListaChequesNoImpresosTO;
  @Input() empresaSeleccionada: PermisosEmpresaMenuTO;//Si se usara de modal, se debe pasar la empresa
  @Input() cuentaComboSeleccionado: BanComboBancoTO;
  public chequeNoImpresion: ChequeNoImpresoTO;
  public banChequeTO: BanChequeTO;
  public valor: string;
  public fechaActual: Date = new Date();
  public es: object = {};

  constructor(
    public activeModal: NgbActiveModal,
    private utilService: UtilService,
    public chequeImpresionService: ChequeImpresionService,
  ) { }

  ngOnInit() {
    moment.locale('es');
    this.es = this.utilService.setLocaleDate();
    this.chequeNoImpresion = new ChequeNoImpresoTO();
    this.banChequeTO = new BanChequeTO();
    this.visualizarCheque();
  }

  visualizarCheque() {
    this.cargando = true;
    let parametro = {
      empresa: this.empresaSeleccionada.empCodigo,
      banListaChequesNoImpresosTO: this.chequeSeleccionado,
    }
    this.chequeImpresionService.visualizarChequeNoImpreso(parametro, this, this.empresaSeleccionada.empCodigo);
  }

  despuesDeVisualizarChequeNoImpreso(data) {
    this.chequeNoImpresion = data;
    this.cargando = false;
  }

  compararFechas(signo: string) {
    let bandera: boolean = false;
    switch (signo) {
      case '>=':
        bandera = new Date(this.chequeSeleccionado.chqFechaEmision) >= this.fechaActual;
        break;
      case '<':
        bandera = new Date(this.chequeSeleccionado.chqFechaEmision) < this.fechaActual;
        break;
    }
    return bandera;
  }

  imprimirChequeCruzado() {
    this.banChequeTO.chqCruzado = true;
    this.imprimirCheque();
  }

  imprimirCheque() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      this.setearValoresABanChequeTO();
      let parametros = {
        banChequeTO: this.banChequeTO,
        valorLetra1: this.chequeNoImpresion.valorChequeLetras + " *  *  *  *  *  *  *  *  *  *  *",
        valorLetra2: "----------------------------------------------------------------------",
        cheqDiferente: this.chequeNoImpresion.isChequeDiferente ? 'S': 'N',
        nombreReporteCheque: "reportChequeInternacionalAngarshrimp",
        secuencia: String(this.chequeNoImpresion.chqSecuencia),
        cuentaCodigo: this.chequeNoImpresion.chqCuentaCodigo,
        fechaActual: new Date().toDateString()
      };
      this.chequeImpresionService.imprimirCheque(parametros, this, this.empresaSeleccionada);
    }
  }

  imprimirNoCheque() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      this.setearValoresABanChequeTO();
      let parametros = {
        banChequeTO: this.banChequeTO,
        cheqDiferente: this.chequeNoImpresion.isChequeDiferente ? 'S': 'N',
        secuencia: String(this.chequeNoImpresion.chqSecuencia),
        fechaActual: new Date().toDateString(),
        empresa: this.empresaSeleccionada.empCodigo,
        numeroCheque: this.chequeNoImpresion.chqNumero,
      };
      this.chequeImpresionService.imprimirNoCheque(parametros, this, LS.KEY_EMPRESA_SELECT);
    }
  }

  despuesGenerarNoChequeChequesNoImpresos(data) {
    if (data) {
      this.activeModal.close(data);
    }
  }

  setearValoresABanChequeTO() {
    this.banChequeTO.chqBeneficiario = this.chequeNoImpresion.chqBeneficiario;
    this.banChequeTO.chqCantidad = this.chequeNoImpresion.chqValor + "";
    this.banChequeTO.chqCiudad = this.empresaSeleccionada.empCiudad;
    this.banChequeTO.chqFecha = this.fechaActual.toDateString();
    this.banChequeTO.detSecuencia = this.chequeNoImpresion.chqSecuencia;
    this.banChequeTO.chqSecuencia = this.chequeNoImpresion.chqSecuencia;
    this.banChequeTO.chqCruzado = this.chequeNoImpresion.isChequeCruzado;
    this.banChequeTO.chqNoCheque = false;

    if (this.chequeNoImpresion.isChequeDiferente) {
      // seguro que quiere cambiar el numero de cheque
      this.banChequeTO.chqImpreso = true;
      this.banChequeTO.chqRevisado = false;
      this.banChequeTO.chqRevisadoObservacion = null;
      this.banChequeTO.chqEntregado = false;
      this.banChequeTO.chqEntregadoObservacion = null;
      this.banChequeTO.concEmpresa = "";
      this.banChequeTO.concCuentaContable = "";
      this.banChequeTO.concCodigo = "";
    } else {
      this.banChequeTO.chqImpreso = true;
      this.banChequeTO.chqEntregado = false;
      this.banChequeTO.concEmpresa = "";
      this.banChequeTO.concCuentaContable = "";
      this.banChequeTO.concCodigo = "";
    }
  }
}
