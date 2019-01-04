import { Component, OnInit } from '@angular/core';
import { OrdenesBancariasService } from './ordenes-bancarias.service';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { ActivatedRoute } from '@angular/router';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { LS } from '../../../../constantes/app-constants';
import { BanComboBancoTO } from '../../../../entidadesTO/banco/BanComboBancoTO';
import { CuentaService } from '../../../banco/archivo/cuenta/cuenta.service';
import { AppSistemaService } from '../../../../serviciosgenerales/app-sistema.service';
import { ToastrService } from 'ngx-toastr';
import { ClaveValor } from '../../../../enums/ClaveValor';
import { RhOrdenBancariaTO } from '../../../../entidades/rrhh/RhOrdenBancariaTO';
import { NgForm } from '@angular/forms';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';

@Component({
  selector: 'app-ordenes-bancarias',
  templateUrl: './ordenes-bancarias.component.html',
  styleUrls: ['./ordenes-bancarias.component.css']
})
export class OrdenesBancariasComponent implements OnInit {

  public listaEmpresas: Array<PermisosEmpresaMenuTO> = new Array();
  public empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  public constantes: any = LS;
  public innerWidth: number;
  public isScreamMd: boolean = true;
  public activar: boolean = false;
  public cargando: boolean = false;
  public vistaFormulario: boolean = false;
  public es: object = {};
  public parametrosListado: any;
  public mostrarListado: boolean = false;
  //
  public ordenBancariaTO: RhOrdenBancariaTO = new RhOrdenBancariaTO();
  public listadoBancoCuenta: Array<BanComboBancoTO> = new Array();
  public cuentaComboSeleccionado: BanComboBancoTO = new BanComboBancoTO();
  public listaTipoOrden: Array<ClaveValor> = new Array();
  public listaTipoServicio: Array<ClaveValor> = new Array();
  public fechaActual: Date = new Date();

  constructor(
    private ordenBancariaService: OrdenesBancariasService,
    private cuentaService: CuentaService,
    private route: ActivatedRoute,
    private utilService: UtilService,
    private sistemaService: AppSistemaService,
    private atajoService: HotkeysService,
    private toastr: ToastrService,
  ) { }

  ngOnInit() {
    this.listaEmpresas = this.route.snapshot.data['ordenesBancarias'];
    this.innerWidth = window.innerWidth;
    this.isScreamMd = this.innerWidth <= 576 ? false : true;
    this.es = this.utilService.setLocaleDate();
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.listaEmpresas ? this.cambiarEmpresaSeleccionada() : null;
    let parametro = { empresa: LS.KEY_EMPRESA_SELECT }
    this.ordenBancariaService.obtenerDatosParaCrudOrdenesBancarias(parametro, this, LS.KEY_EMPRESA_SELECT);
    this.generarAtajosTeclado();
    this.seleccionarFechas();
  }

  cambiarEmpresaSeleccionada() {
    LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
    this.ordenBancariaTO.empresa = LS.KEY_EMPRESA_SELECT;
    this.activar = false;
    this.listadoCuentaBancos();
    this.limpiarResultado();
  }

  despuesDeObtenerDatosParaCrudOrdenesBancarias(data) {
    this.listaTipoOrden = data.tiposOrden;
    this.listaTipoServicio = data.tiposServicios;
    this.ordenBancariaTO.orden = this.listaTipoOrden ? this.listaTipoOrden[0].clave : null;
    this.ordenBancariaTO.tipoServicio = this.listaTipoServicio ? this.listaTipoServicio[0].clave : null;
  }

  seleccionarFechas() {
    this.sistemaService.getFechaInicioActualMes(this, LS.KEY_EMPRESA_SELECT)
      .then(data => {
        this.ordenBancariaTO.fecha = data[1];
        this.fechaActual = data[1];
      }).catch(err => this.utilService.handleError(err, this));
  }

  limpiarResultado() {
    this.parametrosListado = null;
    this.vistaFormulario = false;
  }

  listadoCuentaBancos() {
    this.cargando = true;
    let parametro = {
      empresa: LS.KEY_EMPRESA_SELECT,
    };
    this.cuentaService.listarGetBanComboBancoTO(parametro, this, LS.KEY_EMPRESA_SELECT);
  }

  /** Metodo que se ejecuta despues de haber ejecutado el metodo listaCuentasTO()*/
  despuesDeGetBanComboBancoTO(data) {
    if (data.length > 0) {
      this.listadoBancoCuenta = data;
      this.cuentaComboSeleccionado = this.listadoBancoCuenta ? this.listadoBancoCuenta[0] : null;
    } else {
      this.listadoBancoCuenta = [];
      this.cuentaComboSeleccionado = null;
      this.toastr.warning(LS.MSJ_NO_SE_ENCONTRARON_CUENTAS, LS.TAG_AVISO);
    }
    this.cargando = false;
  }

  generarOrdenBancaria(form: NgForm) {
    if (this.utilService.verificarPermiso(LS.ACCION_CONSULTAR, this, true)) {
      let formularioTocado = this.utilService.establecerFormularioTocado(form);
      if (form && form.valid && formularioTocado) {
        this.ordenBancariaTO.banco = null;
        this.ordenBancariaTO.cuentabancaria = this.cuentaComboSeleccionado.ctaContable;
        this.ordenBancariaTO.nombreCuenta = this.cuentaComboSeleccionado.banNombre + " " + this.cuentaComboSeleccionado.ctaNumero;
        this.parametrosListado = {
          empresa: this.empresaSeleccionada.empCodigo,
          ordenBancariaTO: this.ordenBancariaTO,
        };
        this.mostrarListado = true;
      } else {
        this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
        this.cargando = false;
      }
    }
  }

  ejecutarAccion(event) {
    this.parametrosListado = null;
    this.mostrarListado = false;
  }

  generarAtajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }
}
