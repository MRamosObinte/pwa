import { Component, OnInit, Input } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LS } from '../../../../constantes/app-constants';
import { PlanContableService } from '../plan-contable/plan-contable.service';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ConCuentasTO } from '../../../../entidadesTO/contabilidad/ConCuentasTO';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { ConEstructura } from '../../../../entidades/contabilidad/ConEstructura';

@Component({
  selector: 'app-cuentas-estructura',
  templateUrl: './cuentas-estructura.component.html',
  styleUrls: ['./cuentas-estructura.component.css']
})
export class CuentasEstructuraComponent implements OnInit {

  @Input() empresaSeleccionada: PermisosEmpresaMenuTO;//Si se usara de modal, se debe pasar la empresa
  @Input() accion: string = null;
  cargando: boolean = false;
  constantes: any = {};
  tamanioEstructura: number = 0;
  conEstructura: ConEstructura = new ConEstructura();
  listaEjemplo: Array<ConCuentasTO> = [];
  listaTamanioGrupos: Array<number> = [];

  constructor(
    private utilService: UtilService,
    public activeModal: NgbActiveModal,
    private toastr: ToastrService,
    private api: ApiRequestService,
    private planContableService: PlanContableService
  ) {
    this.constantes = LS;
  }

  ngOnInit() {
    if (this.empresaSeleccionada && this.accion) {
      switch (this.accion) {
        case LS.ACCION_CREAR: {
          break;
        }
        case LS.ACCION_EDITAR: {
          this.obtenerEstructura();
          break;
        }
        case LS.ACCION_CONSULTAR: {
          this.obtenerEstructura();
          break;
        }
      }
    }
  }

  obtenerEstructura() {
    this.cargando = true;
    let parametro = { empresa: this.empresaSeleccionada.empCodigo };
    this.planContableService.getTamanioListaConEstructura(parametro, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        if (data.empCodigo != "") {
          this.tamanioEstructura = data[0].estGrupo1 + data[0].estGrupo2 + data[0].estGrupo3 + data[0].estGrupo4 + data[0].estGrupo5 + data[0].estGrupo6;
          this.conEstructura = new ConEstructura(data[0]);
          this.conEstructura.estEmpresa = this.empresaSeleccionada.empCodigo;
          this.generarVistaPrevia();
        }
      }).catch(err => {
        this.utilService.handleError(err, this);
      })
  }

  generarVistaPrevia() {
    this.listaTamanioGrupos = [];
    this.listaTamanioGrupos.push(Number(this.conEstructura.estGrupo1));
    this.listaTamanioGrupos.push(Number(this.conEstructura.estGrupo2));
    this.listaTamanioGrupos.push(Number(this.conEstructura.estGrupo3));
    this.listaTamanioGrupos.push(Number(this.conEstructura.estGrupo4));
    if (this.conEstructura.estGrupo5 > 0) {
      this.listaTamanioGrupos.push(Number(this.conEstructura.estGrupo5));
      if (this.conEstructura.estGrupo6 > 0) {
        this.listaTamanioGrupos.push(Number(this.conEstructura.estGrupo6));
      }
    }
    this.tamanioEstructura = this.utilService.arraySum(this.listaTamanioGrupos);
    this.generarListadoDeEjemplo();
  }

  generarListadoDeEjemplo() {
    this.listaEjemplo = [];
    var codigoPadre = "";
    //Considerando que son seis grupos
    for (let index = 0; index < this.listaTamanioGrupos.length; index++) {
      let detalle = "grupo " + (index + 1);
      let codigo = this.generarCodigo(codigoPadre, this.listaTamanioGrupos[index], 0);
      let cuenta = new ConCuentasTO({
        cuentaCodigo: codigo,
        cuentaDetalle: this.planContableService.formatoCapitalizado(detalle, codigo, this.tamanioEstructura)
      });
      this.listaEjemplo.push(cuenta);
      codigoPadre = codigo;
    }
    this.cargando = false;
  }

  generarCodigo(codigoPadre: string, grupo: number, cantidadHermanos: number): string {
    let codigoSimple = "" + (cantidadHermanos + 1);
    if (grupo > codigoSimple.length) {
      let cantCerosFaltan = grupo - codigoSimple.length;
      codigoSimple = "0".repeat(cantCerosFaltan) + codigoSimple;
    }
    return codigoPadre + codigoSimple;
  }

  insertarEstructura(form: NgForm) {
    if (this.utilService.verificarPermiso(LS.ACCION_CREAR, this, true)) {
      this.cargando = true;
      if (this.conEstructura.estGrupo5 <= 0) {
        this.conEstructura.estGrupo6 = 0;
      }
      let formularioTocado = this.utilService.establecerFormularioTocado(form);
      if (formularioTocado && form && form.valid) {
        this.conEstructura.empCodigo = this.empresaSeleccionada.empCodigo;
        this.conEstructura.estEmpresa = this.empresaSeleccionada.empCodigo;
        let parametro = { 'conEstructura': this.conEstructura };
        this.api.post("todocompuWS/contabilidadWebController/insertarConEstructura", parametro, LS.KEY_EMPRESA_SELECT)
          .then(respuesta => {
            if (respuesta && respuesta.extraInfo) {
              this.toastr.success(respuesta.operacionMensaje, LS.TOAST_CORRECTO);
              this.cerrarModal(true);
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

  actualizarEstructura(form: NgForm) {
    if (this.utilService.verificarPermiso(LS.ACCION_EDITAR, this, true)) {
      this.cargando = true;
      if (this.conEstructura.estGrupo5 <= 0) {
        this.conEstructura.estGrupo6 = 0;
      }
      let formularioTocado = this.utilService.establecerFormularioTocado(form);
      if (formularioTocado && form && form.valid) {
        let parametro = { 'conEstructura': this.conEstructura };
        this.api.post("todocompuWS/contabilidadWebController/modificarConEstructura", parametro, LS.KEY_EMPRESA_SELECT)
          .then(respuesta => {
            if (respuesta && respuesta.extraInfo) {
              this.toastr.success(respuesta.operacionMensaje, LS.TOAST_CORRECTO);
              this.cerrarModal(true);
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

  cerrarModal(valor) {
    this.activeModal.close(valor);
  }
}
