import { Component, OnInit } from '@angular/core';
import { PermisosEmpresaMenuTO } from '../../../../entidadesTO/web/PermisosEmpresaMenuTO';
import { FilasTiempo } from '../../../../enums/FilasTiempo';
import { LS } from '../../../../constantes/app-constants';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FilasResolve } from '../../../../serviciosgenerales/filas.resolve';
import { AnxValidezComprobanteElectronico } from '../../../../entidadesTO/anexos/AnxValidezComprobanteElectronico';
import { NgForm } from '@angular/forms';
import { UtilService } from '../../../../serviciosgenerales/util.service';
import { ValidezComprobanteElectronicoService } from './validez-comprobante-electronico.service';
import { ArchivoService } from '../../../../serviciosgenerales/archivo.service';
import { ApiRequestService } from '../../../../serviciosgenerales/api-request.service';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';

@Component({
  selector: 'app-validez-comprobante-electronico',
  templateUrl: './validez-comprobante-electronico.component.html',
  styleUrls: ['./validez-comprobante-electronico.component.css']
})
export class ValidezComprobanteElectronicoComponent implements OnInit {

  public constantes: any;
  public cargando: boolean = false;
  public validezComprobante: AnxValidezComprobanteElectronico = new AnxValidezComprobanteElectronico();
  public listaEmpresas: Array<PermisosEmpresaMenuTO> = [];
  public empresaSeleccionada: PermisosEmpresaMenuTO;
  public filasTiempo: FilasTiempo = new FilasTiempo();
  public accion: String = null;
  public activar: boolean = false;
  public classIcon: string = LS.ICON_FILTRAR;
  public screamXS: boolean = true;
  public codigoAcceso = null;
  public vistaFormulario = false;

  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private utilService: UtilService,
    private filasService: FilasResolve,
    private comprobanteElectronicoService: ValidezComprobanteElectronicoService,
    private api: ApiRequestService,
    private archivoService: ArchivoService,
    private atajoService: HotkeysService
  ) {
    this.validezComprobante = new AnxValidezComprobanteElectronico();
  }

  ngOnInit() {
    this.constantes = LS;
    this.listaEmpresas = this.route.snapshot.data['consultarValidezComprobanteElectronico'];
    this.screamXS = window.innerWidth < LS.WINDOW_WIDTH_XS ? true : false;
    this.empresaSeleccionada = this.utilService.seleccionarEmpresa(this.listaEmpresas);
    this.generarAtajosTeclado();
  }

  generarAtajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_MOSTRAR_OCULTAR_FILTROS, (): boolean => {
      let element: HTMLElement = document.getElementById('') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_BUSCAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnBuscar') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_IMPRIMIR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnImprimirXmlAutorizacionElectronica') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_EXPORTAR, (): boolean => {
      let element: HTMLElement = document.getElementById('btnExportarXmlAutorizacionElectronica') as HTMLElement;
      element ? element.click() : null;
      return false;
    }))
  }

  limpiarResultado() {
    this.validezComprobante = null;
    this.filasService.actualizarFilas("0", "0");
    this.vistaFormulario = false;
  }

  buscaValidezComprobanteElectronico(form?: NgForm) {
    if (form && form.valid) {
      this.limpiarResultado();
      let parametro = {
        tipoAmbiente: '2',
        claveAcceso: this.codigoAcceso
      }
      this.cargando = true;
      this.filasTiempo.iniciarContador();
      this.comprobanteElectronicoService.obtenerAutorizadocionComprobantesE(parametro, this, LS.KEY_EMPRESA_SELECT);
    } else {
      this.toastr.error(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
      this.cargando = false;
    }
  }

  despuesDeListarAutorizadocionComprobantes(data) {
    this.filasTiempo.finalizarContador();
    this.cargando = false;
    if (this.codigoAcceso.length != 49) {
      this.vistaFormulario = false;
    } else {
      this.vistaFormulario = true;
      this.validezComprobante = data;
    }
  }

  imprimirXmlAutorizacionElectronica() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      LS.KEY_EMPRESA_SELECT = this.empresaSeleccionada.empCodigo;
      this.cargando = true;
      let parametros = {
        empresa: 'ANG',
        tipoAmbiente: '2',
        claveAcceso: this.codigoAcceso
      };
      this.archivoService.postPDF("todocompuWS/anexosWebController/generarXmlAutorizacionComprobantes", parametros, LS.KEY_EMPRESA_SELECT)
        .then(data => {
          if (data._body.byteLength > 0) {
            this.utilService.descargarArchivoPDF('XmlAutorizacionElectronica.pdf', data);
          } else {
            this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.MSJ_TITULO_REPORTE);
          }
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  }

  exportarXmlAutorizacionElectronica() {
    if (this.utilService.verificarPermiso(LS.ACCION_EXPORTAR, this, true)) {
      this.cargando = true;
      let parametros = {
        tipoAmbiente: '2',
        claveAcceso: this.codigoAcceso
      };
      this.api.post("todocompuWS/anexosWebController/exportarXmlAutorizacionComprobantes", parametros, LS.KEY_EMPRESA_SELECT)
        .then(data => {
          if (data && data.extraInfo) {
            this.utilService.descargarArchivoXml(data.extraInfo, "XmlAutorizacionElectronica_");
          } else {
            this.toastr.warning("No se encontraron resultados");
          }
          this.cargando = false;
        }
        ).catch(err => this.utilService.handleError(err, this));
    }
  }

  cancelarAccion() {
    this.limpiarResultado();
    this.codigoAcceso = null;
  }
}
