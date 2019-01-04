import { Injectable } from '@angular/core';
import { InvConsumos } from '../../../../entidades/inventario/InvConsumos';
import { InvBodegaPK } from '../../../../entidades/inventario/InvBodegaPK';
import { LS } from '../../../../constantes/app-constants';
import { InvBodega } from '../../../../entidades/inventario/InvBodega';
import { AuthService } from '../../../../serviciosgenerales/auth.service';
import { InvConsumosDetalle } from '../../../../entidades/inventario/InvConsumosDetalle';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { InvListaConsultaConsumosTO } from '../../../../entidadesTO/inventario/InvListaConsultaConsumosTO';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { InvListaBodegasTO } from '../../../../entidadesTO/inventario/InvListaBodegasTO';
import { InvConsumosTO } from '../../../../entidadesTO/inventario/InvConsumosTO';

@Injectable({
  providedIn: 'root'
})
export class ConsumoFormularioService {

  constructor(
    private auth: AuthService,
    private atajoService: HotkeysService,
    private utilService: UtilService
  ) { }

  definirAtajosDeTeclado(): any {
    this.atajoService.add(new Hotkey(LS.ATAJO_GUARDAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnGuardarConsumo') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_DISTRIBUIR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnDistribuirConsumo') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_CANCELAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnCancelarConsumo') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirConsumo') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_ANULAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnAnularConsumo') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_RESTAURAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnRestaurarConsumo') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_ACEPTAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnAceptar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  construirConsumo(estado, invConsumos: InvConsumos, bodegaSeleccionado: InvListaBodegasTO, motivoSeleccionado): InvConsumos {
    let bodegaPK: InvBodegaPK = new InvBodegaPK();
    bodegaPK.bodCodigo = bodegaSeleccionado.bodCodigo;
    bodegaPK.bodEmpresa = LS.KEY_EMPRESA_SELECT;
    invConsumos.invBodega = new InvBodega();
    invConsumos.invBodega.invBodegaPK = bodegaPK;
    invConsumos.invConsumosPK.consEmpresa = LS.KEY_EMPRESA_SELECT;
    invConsumos.invConsumosPK.consMotivo = motivoSeleccionado.cmCodigo;
    invConsumos.consFecha = new Date(invConsumos.consFecha).getTime();
    invConsumos.consPendiente = estado;
    invConsumos.invConsumosMotivoAnulacionList = null;
    invConsumos.usrCodigo = this.auth.getCodigoUser();
    invConsumos.usrEmpresa = LS.KEY_EMPRESA_SELECT;
    return invConsumos;
  }

  contruirDetalleConsumo(invConsumos: InvConsumos, detalle: Array<InvConsumosDetalle>, bodegaSeleccionado: InvListaBodegasTO): Array<InvConsumosDetalle> {
    for (let i = 0; i < detalle.length; i++) {
      detalle[i].detOrden = i + 1;
      detalle[i].secEmpresa = detalle[i].secCodigo ? LS.KEY_EMPRESA_SELECT : null;
      detalle[i].pisEmpresa = detalle[i].pisNumero ? LS.KEY_EMPRESA_SELECT : null;
      delete detalle[i]['proCodigoPrincipal'];
      if (invConsumos.invBodega) {
        detalle[i].invBodega = invConsumos.invBodega;
        detalle[i].pisSector = bodegaSeleccionado.codigoCP;
        detalle[i].pisEmpresa = detalle[i].pisSector ? LS.KEY_EMPRESA_SELECT : null;
        detalle[i].secCodigo = bodegaSeleccionado.codigoCP;
        detalle[i].secEmpresa = detalle[i].secCodigo ? LS.KEY_EMPRESA_SELECT : null;
      }
    }
    return detalle;
  }

  construirObjetoParaPonerloEnLaLista(invConsumos: InvConsumos): InvListaConsultaConsumosTO {
    let objeto: InvListaConsultaConsumosTO = new InvListaConsultaConsumosTO();//Objeto seleccionado
    objeto.consNumero = invConsumos.invConsumosPK.consPeriodo + '|' + invConsumos.invConsumosPK.consMotivo + '|' + invConsumos.invConsumosPK.consNumero;
    if (invConsumos.consAnulado) {
      objeto.consStatus = "ANULADO";
    } else if (invConsumos.consPendiente) {
      objeto.consStatus = "PENDIENTE";
    } else {
      objeto.consStatus = "";
    }
    objeto.consObservaciones = invConsumos.consObservaciones;
    objeto.consFecha = this.utilService.formatearDateToStringYYYYMMDD(invConsumos.consFecha);
    return objeto;
  }

  seleccionarBodega(listadoBodegas, codigo) {
    return listadoBodegas.find(item => item.bodCodigo == codigo);
  }

  seleccionarMotivo(listadoMotivos, codigo) {
    return listadoMotivos.find(item => item.cmCodigo == codigo);
  }

  formatearResporteConsumos(consumos: Array<InvListaConsultaConsumosTO>, consEmpresa: string): Array<InvConsumosTO> {
    let consumosReporte: Array<InvConsumosTO> = new Array();
    for (let i = 0; i < consumos.length; i++) {
      let consumoTO = new InvConsumosTO();
      let comprobante: Array<string> = consumos[i].consNumero.split("|");
      consumoTO.consPeriodo = comprobante[0];
      consumoTO.consMotivo = comprobante[1];
      consumoTO.consNumero = comprobante[2];
      consumoTO.consEmpresa = consEmpresa;
      consumosReporte.push(consumoTO);
    }
    return consumosReporte;
  }

}
