import { Component, OnInit, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PermisosEmpresaMenuTO } from '../../entidadesTO/web/PermisosEmpresaMenuTO';
import { UtilService } from '../../serviciosgenerales/util.service';
import { LS } from '../../constantes/app-constants';
import { ArchivoService } from '../../serviciosgenerales/archivo.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';

@Component({
  selector: 'app-imprimir',
  templateUrl: './imprimir.component.html'
})
export class ImprimirComponent implements OnInit {

  public constantes: any = LS;
  @Input() empresaSeleccionada: PermisosEmpresaMenuTO = new PermisosEmpresaMenuTO();
  @Input() parametrosImprimir: string = null;
  @Input() nombreRutaImprimir: string = null;
  @Input() nombreArchivoPDFImprimir: string = null;

  @Input() parametrosImprimirCombo: string = null;
  @Input() nombrerutaImprimirCombo: string = null;
  @Input() nombreArchivoPDFImprimirCombo: string = null;
  @Input() textoImprimirCombo: string = null;

  @Input() mensaje: any = null;
  @Input() mostrarCombo: boolean = false;

  public cargando: boolean = false;

  constructor(
    private toastr: ToastrService,
    private utilService: UtilService,
    private archivoService: ArchivoService,
    public activeModal: NgbActiveModal,
    private atajoService: HotkeysService
  ) { }

  ngOnInit() {
    this.atajoService.add(new Hotkey(LS.ATAJO_CANCELAR, (event: KeyboardEvent): boolean => {
      return false;
    }))
  }

  imprimirCombo() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      this.archivoService.postPDF(this.nombrerutaImprimirCombo, this.parametrosImprimirCombo, this.empresaSeleccionada)
        .then(data => {
          if (data._body.byteLength > 0) {
            this.utilService.descargarArchivoPDF(this.nombreArchivoPDFImprimirCombo, data);
          } else {
            this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
          }
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  };

  imprimirContable() {
    if (this.utilService.verificarPermiso(LS.ACCION_IMPRIMIR, this, true)) {
      this.cargando = true;
      this.archivoService.postPDF(this.nombreRutaImprimir, this.parametrosImprimir, this.empresaSeleccionada)
        .then(data => {
          if (data._body.byteLength > 0) {
            this.utilService.descargarArchivoPDF(this.nombreArchivoPDFImprimir, data);
          } else {
            this.toastr.warning(LS.MSJ_ERROR_IMPRIMIR, LS.TAG_AVISO);
          }
          this.cargando = false;
        }).catch(err => this.utilService.handleError(err, this));
    }
  };


}
