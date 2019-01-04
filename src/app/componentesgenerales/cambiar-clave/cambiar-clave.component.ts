import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { LS } from '../../constantes/app-constants';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../serviciosgenerales/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { ApiRequestService } from '../../serviciosgenerales/api-request.service';
import { UtilService } from '../../serviciosgenerales/util.service';

@Component({
  selector: 'app-cambiar-clave',
  templateUrl: './cambiar-clave.component.html'
})
export class CambiarClaveComponent implements OnInit {

  @Output() cambio = new EventEmitter();
  cargando: boolean = false;
  constantes: any = LS;
  usuario: any = {};
  isLogged: boolean;
  isLogged$: Observable<boolean>;

  constructor(
    private router: Router,
    private authService: AuthService,
    private toastr: ToastrService,
    private api: ApiRequestService,
    private utilService: UtilService
  ) { }

  ngOnInit() {
  }

  cambiarClave() {
    if (this.usuario.nueva && this.usuario.confirmar && this.usuario.nueva == this.usuario.confirmar) {
      this.cargando = true;
      let parametros = {
        codigoUser: this.authService.getCodigoUser(),
        clave: this.usuario.nueva

      }
      this.api.post("todocompuWS/sistemaWebController/modificarPasswordSisUsuario", parametros, '')
        .then(respuesta => {
          if (respuesta && respuesta.extraInfo) {
            this.usuario.usuario = this.authService.getUserName();
            this.usuario.contrasena = this.usuario.nueva;
            this.ingresar();
          } else {
            this.toastr.warning(respuesta.operacionMensaje, 'Aviso');
            this.cargando = false;
          }
        }).catch(err => this.utilService.handleError(err, this));
    } else {
      if (!this.usuario.nueva && !this.usuario.confirmar) {
        this.toastr.warning(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
      } else {
        this.toastr.warning(LS.MSJ_CONTRASENAS_NO_COINCIDEN, LS.TOAST_ADVERTENCIA);
      }
    }
  }

  ingresar() {
    if (this.usuario.usuario && this.usuario.contrasena) {
      this.cargando = true;
      this.authService.ingresar(this.usuario.usuario, this.usuario.contrasena);
      this.authService.getIsLogged$().subscribe(respuesta => {
        this.isLogged = respuesta;
        this.cargando = false;
        if (this.isLogged) {
          this.router.navigate(["modulos"]).then(() => {
            location.reload();
          });
        }
      });
    } else {
      this.toastr.warning(LS.MSJ_USUARIO_CLAVE_NO_INGRESADA, LS.TOAST_ADVERTENCIA);
    }
  }

}
