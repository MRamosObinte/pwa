import { Component, OnInit } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { LS } from '../../../../constantes/app-constants';
import { AuthService } from '../../../../serviciosgenerales/auth.service';
import { ClienteService } from '../../archivo/cliente/cliente.service';
import { CajCajaTO } from '../../../../entidadesTO/caja/CajCajaTO';
import { ActivatedRoute } from '@angular/router';
import { VentaService } from './venta.service';

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html'
})
export class VentaComponent implements OnInit {

  ruta: string = "";
  tipoDocumento: string = "";
  cargando: boolean = false;
  activar: boolean = false;
  vistaFormulario: boolean = false;
  permisoVenta: boolean = false;

  caja: CajCajaTO = new CajCajaTO();

  empresaSeleccionada: PermisosEmpresaMenuTO;
  parametrosFormulario: any = {};
  parametrosLista: any = {};

  constructor(
    private clienteService: ClienteService,
    private auth: AuthService,
    private ventaService: VentaService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.ruta = this.route.snapshot.data['ruta'];
    this.tipoDocumento = this.route.snapshot.data['tipoDocumento'];
  }

  nuevaVenta(event) {
    if (this.permisoVenta) {
      this.vistaFormulario = true;
      this.empresaSeleccionada = event.empresa;
      this.parametrosFormulario.accion = LS.ACCION_CREAR;
      this.activar = true;
    } else {
      this.cancelar();
      this.ventaService.mostrarSwalNoPermiso();
    }
  }

  cancelar() {
    this.vistaFormulario = false;
    this.activar = false;
  }

  actualizarTabla(event) {
    this.vistaFormulario = false;
    this.empresaSeleccionada = event.empresa;
    let parametro = { ...this.parametrosLista };
    parametro.vtaResultante = event.vtaResultante;
    parametro.listar = false;
    this.parametrosLista = parametro;
    this.activar = false;
  }

  listarVentas(event) {
    this.empresaSeleccionada = event.empresaSeleccionada;
    this.parametrosLista = event;
    this.parametrosLista.listar = true;
    this.vistaFormulario = false;
    if(this.ruta === 'ventaNotaCredito'){
      this.parametrosLista.titulo = LS.INVENTARIO_NOTA_CREDITO_LISTADO;
    }else{
      this.parametrosLista.titulo = LS.INVENTARIO_VENTA_LISTADO;
    }
  }

  /**
   * event contiene la empresa seleccionada, la accion que se envia y otro parametro que se ajuste a la accion
   * @param {*} event
   */
  ejecutarAccion(event) {
    switch (event.accion) {
      case LS.ACCION_CREAR:
        this.nuevaVenta(event);
        break;
      case LS.ACCION_LISTAR:
        this.listarVentas(event);
        break;
      case LS.ACCION_CAMBIAR_EMPRESA:
        this.cambiarEmpresaSeleccionada(event);
        break;
      case LS.ACCION_ACTIVAR:
        this.activar = event.estado;
        break;
      case LS.ACCION_CANCELAR:
        this.cancelar();
        break;
      case LS.ACCION_CREADO://Se creo un objeto nuevo desde el hijo
        this.actualizarTabla(event);
        break;
      case LS.ACCION_CONSULTAR:
      case LS.ACCION_ANULAR:
      case LS.ACCION_MAYORIZAR:
      case LS.ACCION_RESTAURAR:
        this.irAlHijo(event);
        break;
    }
  }

  cambiarEmpresaSeleccionada(event) {
    this.empresaSeleccionada = event.empresa;
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.permisoVenta = false;
    this.obtenerPermisosDeCaja();
    this.parametrosLista = {};
    this.parametrosLista.listar = false;
    this.parametrosFormulario.accion = LS.ACCION_CREAR;
    this.vistaFormulario = false;
  }

  irAlHijo(event) {
    this.parametrosFormulario.accion = event.accion;
    this.parametrosFormulario.seleccionado = event.objetoSeleccionado;
    this.vistaFormulario = true;
    this.activar = true;
  }

  obtenerPermisosDeCaja() {
    let parametro = {
      empresa: LS.KEY_EMPRESA_SELECT,
      usuarioCodigo: this.auth.getCodigoUser()
    }
    this.cargando = true;
    this.clienteService.obtenerPermisosDeCaja(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  despuesDeObtenerPermisosDeCaja(data) {
    this.caja = data;
    switch (this.tipoDocumento) {
      case "18": {
        if (this.caja.permisoSecuencialFacturas) {
          this.permisoVenta = true;
        }
        break;
      }
      case "04": {
        if (this.caja.permisoSecuencialNotasCredito) {
          this.permisoVenta = true;
        }
        break;
      }
      case "05": {
        if (this.caja.permisoSecuencialNotasDebito) {
          this.permisoVenta = true;
        }
        break;
      }
      case "00": {
        this.permisoVenta = true;
        break;
      }
    }
    this.cargando = false;
  }

}
