import { InvComprasDetalleTO } from './../../../../../entidadesTO/inventario/InvComprasDetalleTO';
import { Component, OnInit, Input } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { LS } from '../../../../../constantes/app-constants';
import { AppAutonumeric } from '../../../../../directivas/autonumeric/AppAutonumeric';
import { PrdListaPiscinaTO } from '../../../../../entidadesTO/Produccion/PrdListaPiscinaTO';
import { InvComprasTO } from '../../../../../entidadesTO/inventario/InvComprasTO';
import { ApiRequestService } from '../../../../../serviciosgenerales/api-request.service';
import { ToastrService } from 'ngx-toastr';
import { UtilService } from '../../../../../serviciosgenerales/util.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { InvProductoDAOTO } from '../../../../../entidadesTO/inventario/InvProductoDAOTO';
import { PiscinaService } from '../../../../produccion/archivos/piscina/piscina.service';

@Component({
  selector: 'app-modal-compra-detalle',
  templateUrl: './modal-compra-detalle.component.html',
  styleUrls: ['./modal-compra-detalle.component.css']
})
export class ModalCompraDetalleComponent implements OnInit {
  constantes: any = LS;
  @Input() item: InvComprasDetalleTO;
  @Input() compra: InvComprasTO;
  @Input() tipo: string;
  @Input() accion;
  @Input() configAutonumeric: AppAutonumeric;
  @Input() listadoPiscinaTO: Array<PrdListaPiscinaTO>
  @Input() empresaSeleccionada: PermisosEmpresaMenuTO;
  itemCopia: InvComprasDetalleTO;
  isScreamMd: boolean; //Bandera para indicar el tamaño de la pantalla
  cargando: boolean = false;
  autonumericCambios: AppAutonumeric;
  conversion: number = 0;
  bultos: number = 1;
  mostrarModal: boolean = false;

  constructor(
    public activeModal: NgbActiveModal,
    public utilService: UtilService,
    private piscinaService: PiscinaService,
    private toastr: ToastrService,
    private api: ApiRequestService,
  ) { }

  ngOnInit() {
    this.autonumericCambios = { ...this.configAutonumeric };
    this.autonumericCambios.maximumValue = '9999999999.99';
    this.isScreamMd = window.innerWidth <= 576 ? false : true;
    this.itemCopia = JSON.parse(JSON.stringify(this.item));
    (this.tipo === 'detCantidad') ? this.buscarConversion() : this.listarPiscinas();
  }

  buscarConversion() {
    this.cargando = true;
    let parametro = { empresa: LS.KEY_EMPRESA_SELECT, codigoProducto: this.item.proCodigoPrincipal }
    this.api.post("todocompuWS/inventarioWebController/buscarInvProductoDAOTO", parametro, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        if (data && data.extraInfo) {
          let producto = new InvProductoDAOTO(data.extraInfo);
          this.conversion = this.utilService.convertirNDecimale(producto.proFactorCajaSacoBulto, 6);
          this.mostrarModal = true;
        } else {
          this.toastr.warning(data.operacionMensaje, LS.TOAST_ADVERTENCIA);
          this.activeModal.dismiss();
        }
        this.cargando = false;
      }).catch(err => this.utilService.handleError(err, this))
  }

  aceptarDetalle() {
    this.activeModal.close(this.itemCopia);
  }

  aceptarCantidadBultos() {
    let cantBultos = this.conversion * this.bultos;
    this.itemCopia.detCantidad = cantBultos;
    this.activeModal.close(this.itemCopia);
  }

  //piscinas
  listarPiscinas() {
    if (this.accion === LS.ACCION_MAYORIZAR || this.accion === LS.ACCION_CREAR) {
      //Si tiene sector
      if (this.item.secCodigo) {
        if (this.listadoPiscinaTO.length === 0) {
          this.cargando = true;
          let parametro = {
            empresa: this.empresaSeleccionada.empCodigo,
            sector: this.item.secCodigo,
            mostrarInactivo: false,
          };
          this.piscinaService.listarPrdListaPiscinaTO(parametro, this, LS.KEY_EMPRESA_SELECT);
        } else {
          this.mostrarModal = true;
        }
      } else {
        this.mostrarModal = true;
      }
    } else {
      this.mostrarModal = true;
    }
  }

  despuesDeListarPiscina(data) {
    this.cargando = false;
    this.itemCopia.listadoPiscinaTO = data;
    this.listadoPiscinaTO = data;
    this.mostrarModal = true;
  }

}
