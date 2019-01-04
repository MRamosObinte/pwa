import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { HotkeysService, Hotkey } from 'angular2-hotkeys';
import { ToastrService } from 'ngx-toastr';
import { SisUsuario } from '../../../entidades/sistema/SisUsuario';
import { LS } from '../../../constantes/app-constants';
import { UtilService } from '../../../serviciosgenerales/util.service';
import { PerfilUsuarioService } from './perfil-usuario.service';
import { AuthService } from '../../../serviciosgenerales/auth.service';

@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.component.html'
})
export class PerfilUsuarioComponent implements OnInit {
  public usuario: SisUsuario;
  public constantes: any = LS;
  public activar: boolean = false;
  public cargando: boolean = false;
  public archivoPerfilByte: any = null;

  accion: string = null;
  innerWidth: number;
  isScreamMd: boolean = true;
  visualizarImagen: boolean = false;
  usrNuevaContrasena: string;
  usrContrasenaActual: string;
  esValidaContraseniaActual: boolean = true;
  usrConfirmarContrasena: string;

  //formulario validar cancelar
  @ViewChild("frm") frm: NgForm;
  public valoresIniciales: any;

  constructor(
    private utilService: UtilService,
    private perfilUsuarioService: PerfilUsuarioService,
    private auth: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private atajoService: HotkeysService,
  ) {
    this.usuario = new SisUsuario();
  }

  ngOnInit() {
    this.innerWidth = window.innerWidth;
    this.isScreamMd = this.innerWidth <= 576 ? false : true;
    this.definirAtajosDeTeclado();
    this.buscarUsuarioPorNick();
  }

  definirAtajosDeTeclado(): any {
    this.atajoService.add(new Hotkey(LS.ATAJO_GUARDAR, (): boolean => {
      let element = document.getElementById("btnGuardar");
      element ? element.click() : null;
      return false;
    }))
    this.atajoService.add(new Hotkey(LS.ATAJO_CANCELAR, (): boolean => {
      let element = document.getElementById("btnCancelar");
      element ? element.click() : null;
      return false;
    }))
  }

  extraerValoresIniciales() {
    setTimeout(() => {
      this.valoresIniciales = JSON.parse(JSON.stringify(this.frm ? this.frm.value : null));
    }, 50);
  }

  buscarUsuarioPorNick() {
    this.cargando = true;
    let parametro = { usrNick: this.auth.getCodigoUser() }
    this.perfilUsuarioService.buscarUsuarioPorNick(parametro, this)
  }

  despuesDeBuscarUsuarioPorNick(data) {
    this.usuario = data.usuario;
    this.archivoPerfilByte = data.foto ? "data:image/jpeg;base64," + data.foto : "assets/images/user.png";
    this.extraerValoresIniciales();
    this.cargando = false;
  }

  cancelar() {
    if (this.utilService.puedoCancelar(this.valoresIniciales, this.frm)) {
      this.router.navigate(['/modulos']);
    } else {
      let parametros = {
        title: LS.MSJ_TITULO_CANCELAR,
        texto: LS.MSJ_PREGUNTA_CANCELAR,
        type: LS.SWAL_QUESTION,
        confirmButtonText: LS.MSJ_SI_ACEPTAR,
        cancelButtonText: LS.MSJ_NO_CANCELAR
      };
      this.utilService.generarSwallConfirmacionHtml(parametros).then(respuesta => {
        if (respuesta) {//Si presiona aceptar
          this.router.navigate(['/modulos']);
        }
      });
    }
  };

  validarContraseniaActual() {
    !this.usrContrasenaActual || this.usrContrasenaActual == '' ? this.usrContrasenaActual = null : null;
    if (this.usrContrasenaActual) {
      this.esValidaContraseniaActual = false;
      let parametros = {
        codigo: this.usuario.usrCodigo,
        clave: this.usrContrasenaActual
      }
      this.perfilUsuarioService.validarClaveActual(parametros, this);
    } else {
      this.esValidaContraseniaActual = true;
    }
  }

  despuesDeValidarClaveActual(data) {
    this.esValidaContraseniaActual = data;
  }

  insertar(frmDatos: NgForm) {
    if (this.validarAntesDeEnviar(frmDatos)) {
      this.cargando = true;
      this.usrNuevaContrasena ? this.usuario.usrPassword = this.usrNuevaContrasena : null;
      let parametro = {
        sisUsuario: this.usuario,
        imagen: this.archivoPerfilByte ? this.archivoPerfilByte.split("base64,")[1] : null
      }
      this.perfilUsuarioService.modificarSisUsuarioWebTO(parametro, this);
    }
  }

  despuesDeModificarSisUsuarioWebTO(data) {
    this.cargando = false;
    localStorage.setItem(LS.KEY_FOTO_PERFIL, JSON.stringify(this.archivoPerfilByte && this.archivoPerfilByte.split("base64,")[1] ? this.archivoPerfilByte.split("base64,")[1] : ""));
    this.router.navigate(['/modulos']);
  }

  validarAntesDeEnviar(form: NgForm): boolean {
    let validado = true;
    let formTouched = this.utilService.establecerFormularioTocado(form);
    if (!(formTouched && form && form.valid) || !this.esValidaContraseniaActual) {
      this.toastr.warning(LS.MSJ_CAMPOS_INVALIDOS, LS.MSJ_TITULO_INVALIDOS);
      validado = false;
      return validado;
    }
    if (this.usrNuevaContrasena != this.usrConfirmarContrasena) {
      this.toastr.warning(LS.MSJ_CONTRASENAS_NO_COINCIDEN, LS.MSJ_TITULO_INVALIDOS);
      validado = false;
      return validado;
    }
    this.cargando = validado;
    return validado;
  }

  verContrasena(idInput, idSpan) {
    let element = document.getElementById(idInput);
    let span = document.getElementById(idSpan);
    if (element) {
      if (element['type'] === 'password') {
        element['type'] = 'text';
        span ? span['className'] = LS.ICON_EYE_SLASH : null;
      } else {
        element['type'] = 'password';
        span ? span['className'] = LS.ICON_EYE : null;
      }
    }
  }

  seleccionarImagenes(event) {
    if (event && event.files) {
      for (let i = 0; i < event.files.length; i++) {
        this.convertirFiles(event.files[i]);
      }
    }
  }

  convertirFiles(file) {
    if (file.size <= 1000000) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        if (reader && reader.result) {
          this.archivoPerfilByte = reader.result;
        }
      }
    }
  }

  eliminarItem() {
    this.archivoPerfilByte = null;
  }

  visualizar(imagen) {
    this.archivoPerfilByte = imagen;
    this.visualizarImagen = true;
  }

};
