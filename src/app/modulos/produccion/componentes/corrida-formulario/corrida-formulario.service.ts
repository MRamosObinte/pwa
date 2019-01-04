import { Injectable } from '@angular/core';
import { AuthService } from '../../../../serviciosgenerales/auth.service';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { LS } from '../../../../constantes/app-constants';
import { PrdCorrida } from '../../../../entidades/produccion/PrdCorrida';
import { PrdListaSectorTO } from '../../../../entidadesTO/Produccion/PrdListaSectorTO';
import { PrdListaPiscinaTO } from '../../../../entidadesTO/Produccion/PrdListaPiscinaTO';
import { PrdPiscina } from '../../../../entidades/produccion/PrdPiscina';
import { PrdCorridaDetalle } from '../../../../entidades/produccion/PrdCorridaDetalle';

@Injectable({
  providedIn: 'root'
})
export class CorridaFormularioService {

  constructor(
    private auth: AuthService,
    private atajoService: HotkeysService,
    private utilService: UtilService
  ) { }

  definirAtajosDeTeclado(): any {
    this.atajoService.add(new Hotkey(LS.ATAJO_GUARDAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnGuardarCorrida') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('btnActivar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_CANCELAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnCancelar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  autonumeric62() {
    return {
      decimalPlaces: 2,
      decimalPlacesRawValue: 2,
      decimalPlacesShownOnBlur: 2,
      decimalPlacesShownOnFocus: 2,
      maximumValue: '999999.99',
      minimumValue: '0',
    }
  }

  autonumeric92() {
    return {
      decimalPlaces: 2,
      decimalPlacesRawValue: 2,
      decimalPlacesShownOnBlur: 2,
      decimalPlacesShownOnFocus: 2,
      maximumValue: '999999999.99',
      minimumValue: '0',
    }
  }

  autonumeric90() {
    return {
      decimalPlaces: 0,
      decimalPlacesRawValue: 0,
      decimalPlacesShownOnBlur: 0,
      decimalPlacesShownOnFocus: 0,
      maximumValue: '999999999',
      minimumValue: '0',
    }
  }
  
  autonumeric30() {
    return {
      decimalPlaces: 0,
      decimalPlacesRawValue: 0,
      decimalPlacesShownOnBlur: 0,
      decimalPlacesShownOnFocus: 0,
      maximumValue: '999',
      minimumValue: '0',
    }
  }

  construirCorrida(corrida: PrdCorrida, piscina: PrdListaPiscinaTO, sector: PrdListaSectorTO): PrdCorrida {
    corrida.prdCorridaPK.corEmpresa = LS.KEY_EMPRESA_SELECT;
    corrida.prdCorridaPK.corPiscina = piscina.pisNumero;
    corrida.prdCorridaPK.corSector = sector.secCodigo;
    corrida.usrCodigo = this.auth.getCodigoUser();
    corrida.corHectareas = this.utilService.quitarComasNumero(corrida.corHectareas);
    corrida.corPellet = this.utilService.quitarComasNumero(corrida.corPellet);
    corrida.corCostoDirecto = this.utilService.quitarComasNumero(corrida.corCostoDirecto);
    corrida.corCostoIndirecto = this.utilService.quitarComasNumero(corrida.corCostoIndirecto);
    corrida.corCostoTransferencia = this.utilService.quitarComasNumero(corrida.corCostoTransferencia);
    corrida.corNumeroLarvas = corrida.corNumeroLarvas && corrida.corNumeroLarvas != 0 ? this.utilService.quitarComasNumero(corrida.corNumeroLarvas) : null;
    corrida.corBiomasa = corrida.corBiomasa && corrida.corBiomasa != 0 ? this.utilService.quitarComasNumero(corrida.corBiomasa) : null;
    corrida.corValorVenta = corrida.corValorVenta && corrida.corValorVenta != 0 ? this.utilService.quitarComasNumero(corrida.corValorVenta) : null;
    corrida.usrEmpresa = LS.KEY_EMPRESA_SELECT;
    if (piscina && sector) {
      corrida.prdPiscina = new PrdPiscina();
      corrida.prdPiscina.prdPiscinaPK.pisEmpresa = LS.KEY_EMPRESA_SELECT;
      corrida.prdPiscina.prdPiscinaPK.pisNumero = piscina.pisNumero;
      corrida.prdPiscina.prdPiscinaPK.pisSector = sector.secCodigo;
    } else {
      corrida.prdPiscina = null;
    }
    if (!corrida.conContable || !corrida.conContable.conContablePK.conNumero) {
      corrida.conContable = null;
    }
    /* Fechas se envian como time para evitar Zona horaria, el atributo se define como any*/
    corrida.corFechaDesde = new Date(corrida.corFechaDesde).getTime();
    corrida.corFechaSiembra = corrida.corFechaSiembra ? new Date(corrida.corFechaSiembra).getTime() : null;
    return corrida;
  }

  construirCorridaEdicion(corrida: PrdCorrida): PrdCorrida {
    corrida.corHectareas = this.utilService.quitarComasNumero(corrida.corHectareas);
    corrida.corPellet = this.utilService.quitarComasNumero(corrida.corPellet);
    corrida.corCostoDirecto = this.utilService.quitarComasNumero(corrida.corCostoDirecto);
    corrida.corCostoIndirecto = this.utilService.quitarComasNumero(corrida.corCostoIndirecto);
    corrida.corCostoTransferencia = this.utilService.quitarComasNumero(corrida.corCostoTransferencia);
    corrida.corNumeroLarvas = corrida.corNumeroLarvas && corrida.corNumeroLarvas != 0 ? this.utilService.quitarComasNumero(corrida.corNumeroLarvas) : null;
    corrida.corBiomasa = corrida.corBiomasa && corrida.corBiomasa != 0 ? this.utilService.quitarComasNumero(corrida.corBiomasa) : null;
    corrida.corValorVenta = corrida.corValorVenta && corrida.corValorVenta != 0 ? this.utilService.quitarComasNumero(corrida.corValorVenta) : null;
    if (!corrida.conContable || !corrida.conContable.conContablePK.conNumero) {
      corrida.conContable = null;
    }
    /* Fechas se envian como time para evitar Zona horaria, el atributo se define como any*/
    corrida.corFechaDesde = new Date(corrida.corFechaDesde).getTime();
    corrida.corFechaSiembra = corrida.corFechaSiembra ? new Date(corrida.corFechaSiembra).getTime() : null;
    return corrida;
  }

  construirListaDetalleDestino(listaCorridaDetalleDestino: Array<PrdCorridaDetalle>): Array<PrdCorridaDetalle> {
    let listaDestino: Array<PrdCorridaDetalle> = new Array();//tabla editable
    if (listaCorridaDetalleDestino && listaCorridaDetalleDestino.length > 0) {
      for (let i = 0; i < listaCorridaDetalleDestino.length; i++) {
        let corridaDetalle: PrdCorridaDetalle = new PrdCorridaDetalle();
        corridaDetalle.prdCorridaDestino = listaCorridaDetalleDestino[i]['corridaSeleccionada'];
        corridaDetalle.detPorcentaje = listaCorridaDetalleDestino[i].detPorcentaje;
        corridaDetalle.prdCorridaOrigen = listaCorridaDetalleDestino[i].prdCorridaOrigen;
        listaDestino.push(corridaDetalle);
      }
    }
    return listaDestino;
  }

}
