import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnexosRoutingModule } from './anexos-routing-module';
import { AnexosComponent } from './anexos/anexos.component';
import { IdentificacionComponent } from './archivo/identificacion/identificacion.component';
import { CantonComponent } from './archivo/canton/canton.component';
import { SustentoComponent } from './archivo/sustento/sustento.component';
import { ConceptoComponent } from './archivo/concepto/concepto.component';
import { TipoDocumentoComponent } from './archivo/tipo-documento/tipo-documento.component';

@NgModule({
  imports: [
    CommonModule,
    AnexosRoutingModule
  ],
  declarations: [AnexosComponent, IdentificacionComponent, CantonComponent, SustentoComponent, ConceptoComponent, TipoDocumentoComponent]
})
export class AnexosModule { }
