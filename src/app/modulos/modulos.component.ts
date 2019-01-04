import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { AuthService } from '../serviciosgenerales/auth.service';
import { Router } from '@angular/router';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { LS } from '../constantes/app-constants';
import { ClearMenuResolve } from '../serviciosgenerales/clearMenu.resolve';
import { FilasResolve } from '../serviciosgenerales/filas.resolve';
import { AppSistemaService } from '../serviciosgenerales/app-sistema.service';

@Component({
  selector: 'app-modulos',
  templateUrl: './modulos.component.html',
  styleUrls: ['./modulos.component.css']
})
export class ModulosComponent implements OnInit, OnDestroy {

  public cargando = false;
  public url = "";

  cargar(event, url) {
    if (!event.ctrlKey) {
      if (url != this.url) {
        this.cargando = true;
      }
      this.url = url;
      localStorage.setItem("urlNavegacion", this.url);
    }
  }

  onActivate(event) {
    this.cargando = false;
  }

  onDeactivate(event) {
    this.cargando = false;
  }

  ngOnDestroy() {
    this.cargando = false;
  }

  public filas = 0;
  public tiempo = 0;
  public mostrarTodo: boolean = true;
  public mostrarMenos: boolean = true;
  public mostrarMenu: boolean = false;
  public modulos: any = [];
  public notificaciones: any = [];
  public menues: Array<any> = [];
  public caminos: any = [];
  public isMovil: boolean = true;
  public innerWidth: number;

  constructor(
    public auth: AuthService,
    public router: Router,
    private atajoService: HotkeysService,
    private sistemaService: AppSistemaService,
    private menuClearService: ClearMenuResolve,
    private filasService: FilasResolve
  ) {
    //cambio de menu
    this.auth.getMenuCambio$().subscribe(() => {
      this.menues = JSON.parse(localStorage.getItem(LS.KEY_CURRENT_MENU));
    });
    this.menuClearService.getMenuCambio$().subscribe(() => {
      this.menues = JSON.parse(localStorage.getItem(LS.KEY_CURRENT_MENU));
      this.caminos = JSON.parse(localStorage.getItem(LS.KEY_CURRENT_BREADCRUM));
    });
    //cambio camino
    this.sistemaService.getCaminoCambio$().subscribe(() => {
      this.caminos = JSON.parse(localStorage.getItem(LS.KEY_CURRENT_BREADCRUM));
    });
    //cambio de filas
    this.filasService.getFilasCambio$().subscribe(() => {
      this.filas = JSON.parse(localStorage.getItem(LS.KEY_CURRENT_FILAS));
      this.tiempo = JSON.parse(localStorage.getItem(LS.KEY_CURRENT_TIEMPO));
    });
  }

  ngOnInit() {
    this.url = localStorage.getItem("urlNavegacion");
    this.modulos = this.auth.getModulos();
    this.notificaciones = JSON.parse(localStorage.getItem(LS.KEY_NOTIFICACIONES));
    this.menues = JSON.parse(localStorage.getItem(LS.KEY_CURRENT_MENU));
    this.caminos = JSON.parse(localStorage.getItem(LS.KEY_CURRENT_BREADCRUM));
    this.innerWidth = window.innerWidth;
    this.isMovil = this.innerWidth <= 576 ? true : false;
    if (this.isMovil) {
      this.mostrarTodo = false;
      this.mostrarMenu = false;
    } else {
      document.body.classList.remove('sidebar-show');
      this.mostrarTodo = true;
      this.mostrarMenos = false;
    }
    this.iniciarAtajosTeclado();
  }

  iniciarAtajosTeclado() {
    this.atajoService.add(new Hotkey(LS.ATAJO_OCULTAR_MENU, (): boolean => {
      this.mostrarTodo = !this.mostrarTodo;
      if (this.mostrarTodo) {
        document.body.classList.add('sidebar-lg-show');
      }
      else {
        document.body.classList.remove('sidebar-lg-show');
      }
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_MENU_ARCHIVO, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('navbarDropdown_' + this.obtenerIdMenues('Archivo')) as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_MENU_CONSULTA, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('navbarDropdown_' + this.obtenerIdMenues('Consultas')) as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
    this.atajoService.add(new Hotkey(LS.ATAJO_MENU_TRANSACCIONES, (event: KeyboardEvent): boolean => {
      let element: HTMLElement = document.getElementById('navbarDropdown_' + this.obtenerIdMenues('Transacciones')) as HTMLElement;
      element ? element.click() : null;
      return false;
    }));
  }

  obtenerIdMenues(labelMenu: string): string {
    let filtroMenu = this.menues.filter(menu => menu.label.indexOf(labelMenu) > -1);
    if (filtroMenu.length > 0) {
      return filtroMenu[0].id
    } else {
      return Math.random() + "";
    }
  }

  mostrarMenuConLetras() {
    this.mostrarTodo = !this.mostrarTodo;
    if (this.isMovil) {
      if (this.mostrarTodo) {
        document.body.classList.remove('sidebar-lg-show');
        document.body.classList.add('sidebar-show');
      } else {
        document.body.classList.remove('sidebar-show');
        document.body.classList.add('sidebar-lg-show');
      }
    } else {
      if (this.mostrarTodo) {
        document.body.classList.add('sidebar-lg-show');
      } else {
        document.body.classList.remove('sidebar-lg-show');
      }
    }
  }

  mostrarMenuConIconos() {
    this.mostrarMenos = !this.mostrarMenos;
    if (this.mostrarMenos) {
      document.body.classList.add('brand-minimized');
      document.body.classList.add('sidebar-minimized');
    } else {
      document.body.classList.remove('brand-minimized');
      document.body.classList.remove('sidebar-minimized');
    }
  }

  mostrarMenuMovil() {
    this.mostrarMenu = !this.mostrarMenu;
    if (this.mostrarMenu) {
      document.body.classList.add('aside-menu-show');
    } else {
      document.body.classList.remove('aside-menu-show');
    }
  }

  navegar(id) {
    let ruta = this.router.url.split('/');
    if (ruta.length > 3) {
      // let rutaNew = this.router.url.split(ruta[ruta.length - 1]);
      // this.router.navigate([rutaNew[0] + id]);
      let rutaFinal: any = "";
      ruta[ruta.length - 1] = id;
      for (let i = 1; i < ruta.length; i++) {
        rutaFinal = rutaFinal + "/" + ruta[i]
      }
      this.router.navigate([rutaFinal]);
    } else {
      this.router.navigate([this.router.url + "/" + id]);
    }
  }

  /**
* Actualiza el valor de la pantalla
* @param event 
*/
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.innerWidth = window.innerWidth;
    this.cambiarvalor();
  }

  cambiarvalor() {
    this.isMovil = this.innerWidth <= 576 ? true : false;
  }

}
