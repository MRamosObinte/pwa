import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpModule } from '@angular/http';
import { LoginComponent } from './componentesgenerales/login/login.component';
import { AppConfig } from './serviciosgenerales/app-config';
import { ApiRequestService } from './serviciosgenerales/api-request.service';
import { AuthService } from './serviciosgenerales/auth.service';
import { AuthGuardService } from './serviciosgenerales/auth-guard.service';
import { ToastrModule } from 'ngx-toastr';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModulosComponent } from './modulos/modulos.component';
import { MenuResolve } from './serviciosgenerales/menu.resolve';
import { PedidosCaminoResolve } from './serviciosgenerales/caminos/pedidos.camino.resolve';
import { HotkeyModule } from 'angular2-hotkeys';
import { HotkeysService } from 'angular2-hotkeys';
import { ClearMenuResolve } from './serviciosgenerales/clearMenu.resolve';
import { FilasResolve } from './serviciosgenerales/filas.resolve';
import { ChatComponent } from './componentesgenerales/chat/chat.component';
import { Error404Component } from './componentesgenerales/error404/error404.component';
import { Error403Component } from './componentesgenerales/error403/error403.component';
import { Error500Component } from './componentesgenerales/error500/error500.component';
import { Error501Component } from './componentesgenerales/error501/error501.component';
import { ArchivoService } from './serviciosgenerales/archivo.service';
import { Error0Component } from './componentesgenerales/error0/error0.component';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { InventarioCaminoResolve } from './serviciosgenerales/caminos/inventario.camino.resolve';
import { TraducirResolve } from './serviciosgenerales/traducir.resolve';
import { ContabilidadCaminoResolve } from './serviciosgenerales/caminos/contabilidad.camino.resolve';
import { ProduccionCaminoResolve } from './serviciosgenerales/caminos/produccion.camino.resolve';
import { EstamosTrabajandoComponent } from './componentesgenerales/estamos-trabajando/estamos-trabajando.component';
import { ActivosFijosCaminoResolve } from './serviciosgenerales/caminos/activosFijos.camino.resolve';
import { SistemaCaminoResolve } from './serviciosgenerales/caminos/sistema.camino.resolve';
import { TributacionCaminoResolve } from './serviciosgenerales/caminos/tributacion.camino.resolve';
import { BancoCaminoResolve } from './serviciosgenerales/caminos/banco.camino.resolve';
import { SoporteCaminoResolve } from './serviciosgenerales/caminos/soporte.camino.resolve';
import { RrhhCaminoResolve } from './serviciosgenerales/caminos/rrhh.camino.resolve';
import { CarteraCaminoResolve } from './serviciosgenerales/caminos/cartera.camino.resolve';
import { CambiarClaveComponent } from './componentesgenerales/cambiar-clave/cambiar-clave.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
  imports: [
    NgbModule.forRoot(),
    BrowserModule,
    FormsModule,
    HttpModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    HotkeyModule.forRoot(),
    AppRoutingModule,
    SweetAlert2Module.forRoot(),
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })
  ],
  declarations: [
    AppComponent,
    LoginComponent,
    ModulosComponent,
    ChatComponent,
    Error404Component,
    Error403Component,
    Error500Component,
    Error501Component,
    Error0Component,
    EstamosTrabajandoComponent,
    CambiarClaveComponent
  ],
  exports: [
    EstamosTrabajandoComponent
  ],
  providers: [
    AppConfig,
    ApiRequestService,
    AuthService,
    AuthGuardService,
    MenuResolve,
    PedidosCaminoResolve,
    BancoCaminoResolve,
    InventarioCaminoResolve,
    ContabilidadCaminoResolve,
    ProduccionCaminoResolve,
    ActivosFijosCaminoResolve,
    SistemaCaminoResolve,
    RrhhCaminoResolve,
    TributacionCaminoResolve,
    SoporteCaminoResolve,
    ClearMenuResolve,
    TraducirResolve,
    HotkeysService,
    FilasResolve,
    ArchivoService,
    CarteraCaminoResolve
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
