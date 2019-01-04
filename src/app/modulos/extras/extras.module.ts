import { NgModule } from '@angular/core';
import { ExtrasRoutingModule } from './extras-routing.module';
import { CompartidosModule } from '../compartidos/compartidos.module';
import { PerfilUsuarioComponent } from './perfil-usuario/perfil-usuario.component';
import { AtajosComponent } from './atajos/atajos.component';

@NgModule({
  imports: [
    CompartidosModule,
    ExtrasRoutingModule
  ],
  declarations: [
    PerfilUsuarioComponent,
    AtajosComponent
  ]
})
export class ExtrasModule { }
