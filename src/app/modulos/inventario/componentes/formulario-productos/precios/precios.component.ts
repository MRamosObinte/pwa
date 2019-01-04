import { Component, OnInit, Input } from '@angular/core';
import { AppAutonumeric } from '../../../../../directivas/autonumeric/AppAutonumeric';
import { InvProductoTO } from '../../../../../entidadesTO/inventario/InvProductoTO';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LS } from '../../../../../constantes/app-constants';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { ProductoService } from '../../producto/producto.service';
import { VentaService } from '../../../transacciones/venta/venta.service';

@Component({
  selector: 'app-precios',
  templateUrl: './precios.component.html'
})
export class PreciosComponent implements OnInit {

  congeladasCol: any[];
  scrollableCols: any[];
  inputs: any[];
  congeladasColCostos: any[];
  scrollableColsCostos: any[];
  inputsCostos: any[];
  constantes: any = LS;

  @Input() producto: InvProductoTO;
  @Input() accion: string;
  @Input() etiquetas: any = [];
  @Input() etiquetasCostos: any = [];

  configAutonumeric: AppAutonumeric;

  constructor(
    public activeModal: NgbActiveModal,
    private productoService: ProductoService,
    private atajoService: HotkeysService,
    private ventaService: VentaService
  ) {
    this.definirAtajosDeTeclado();
    this.configAutonumeric = {
      decimalPlaces: 6,
      decimalPlacesRawValue: 6,
      decimalPlacesShownOnBlur: 2,
      decimalPlacesShownOnFocus: 6,
      maximumValue: '99999999999.99',
      minimumValue: '0'
    };
  }

  definirAtajosDeTeclado(): any {
    this.atajoService.add(new Hotkey(LS.ATAJO_GUARDAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnGuardar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_CANCELAR, (event: KeyboardEvent): boolean => {
      this.activeModal.close();
      return false;
    }))
  }

  ngOnInit() {
    if (this.accion === LS.ACCION_CONSULTAR) {
      this.configAutonumeric.readOnly = true;
    }
    this.tablaPrecios();
    this.tablaCostos();
    setTimeout(() => {
      let element = document.getElementById("Precio_0");
      element ? element['autofocus'] = true : null
      element ? element.focus() : null
    }, 50);
  }

  verificarPermiso(accion, mostraMensaje) {
    return this.productoService.verificarPermiso(accion, this, mostraMensaje);
  }

  tablaPrecios() {
    this.congeladasCol = [
      { field: 'tag', header: LS.TAG_OPCIONES }
    ];
    this.scrollableCols = [];
    this.inputs = [
      {
        "tag": LS.TAG_PRECIO
      },
      {
        "tag": LS.TAG_DESCUENTO
      },
      {
        "tag": LS.TAG_CANTIDAD
      },
      {
        "tag": LS.TAG_UTILIDAD
      }
    ]
    for (let i = 0; i < this.etiquetas.length; i++) {
      let campoCostoRerefencia = this.ventaService.obtenerCampoDesdeReferencia(this.etiquetas[i].field);
      this.scrollableCols.push({ field: campoCostoRerefencia, header: this.etiquetas[i].value });
      this.inputs[0][campoCostoRerefencia] = this.producto[campoCostoRerefencia];
      this.inputs[1][campoCostoRerefencia] = this.producto['proDescuento' + (i + 1)];
      this.inputs[2][campoCostoRerefencia] = this.producto['proCantidad' + (i + 1)];
      this.inputs[3][campoCostoRerefencia] = this.producto['proMargenUtilidad' + (i + 1)];
    }
  }

  tablaCostos() {
    this.congeladasColCostos = [
      { field: 'tag', header: LS.TAG_PRECIOS }
    ];
    this.scrollableColsCostos = [];
    this.inputsCostos = [
      {
        "tag": "Costo"
      }
    ]
    for (let i = 0; i < this.etiquetasCostos.length; i++) {
      let campoCostoRerefencia = this.ventaService.obtenerCampoDesdeReferencia(this.etiquetasCostos[i].field);
      this.scrollableColsCostos.push({ field: campoCostoRerefencia, header: this.etiquetasCostos[i].value });
      this.inputsCostos[0][campoCostoRerefencia] = this.producto[campoCostoRerefencia];
    }
  }

  aceptar() {
    this.activeModal.close();
  }

  cambiarValor(valor, header, index) {
    switch (header) {
      case 'Precio':
        this.producto['proPrecio' + (index + 1)] = valor;
        break;
      case 'Descuento':
        this.producto['proDescuento' + (index + 1)] = valor;
        break;
      case 'Cantidad':
        this.producto['proCantidad' + (index + 1)] = valor;
        break;
      case 'Utilidad':
        this.producto['proMargenUtilidad' + (index + 1)] = valor;
        break;
      case 'Costo':
        this.producto['proCostoReferencial' + (index + 1)] = valor;
        break;
    }
  }

}
