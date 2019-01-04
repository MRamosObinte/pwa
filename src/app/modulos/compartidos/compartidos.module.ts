import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContextMenuModule } from 'primeng/contextmenu';
import { MultiSelectModule } from 'primeng/multiselect';
import { CalendarModule } from 'primeng/calendar';
import { NgbModule, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AgGridModule } from 'ag-grid-angular';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { KeyFilterModule } from 'primeng/keyfilter';
import { DialogModule } from 'primeng/dialog';
import { FileUploadModule } from 'primeng/fileupload';
import { ChipsModule } from 'primeng/chips';
import { InputMaskModule } from 'primeng/inputmask';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { CargandoComponent } from '../../componentesgenerales/cargando/cargando.component';
import { RadioButtonModule } from 'primeng/radiobutton';
import { GalleriaModule } from 'primeng/galleria';
import { TooltipReaderComponent } from '../componentes/tooltip-reader/tooltip-reader.component';
import { IconoEstadoComponent } from '../componentes/icono-estado/icono-estado.component';
import { BotonOpcionesComponent } from '../componentes/boton-opciones/boton-opciones.component';
import { NumericCellComponent } from '../componentes/numeric-cell/numeric-cell.component';
import { InputCellComponent } from '../componentes/input-cell/input-cell.component';
import { PinnedCellComponent } from '../componentes/pinned-cell/pinned-cell.component';
import { CheckCellComponent } from '../componentes/check-cell/check-cell.component';
import { BotonAccionComponent } from '../componentes/boton-accion/boton-accion.component';
import { SpanAccionComponent } from '../componentes/span-accion/span-accion.component';
import { CheckboxHeaderComponent } from '../componentes/checkbox-header/checkbox-header.component';
import { CheckboxCellComponent } from '../componentes/checkbox-cell/checkbox-cell.component';
import { InputLabelCellComponent } from '../componentes/input-label-cell/input-label-cell.component';
import { PopOverInformacionComponent } from '../componentes/pop-over-informacion/pop-over-informacion.component';
import { SelectCellComponent } from '../componentes/select-cell/select-cell.component';
import { InputNumericConBotonComponent } from '../componentes/input-numeric-con-boton/input-numeric-con-boton.component';
import { InputEstadoComponent } from '../componentes/input-estado/input-estado.component';
import { LabelNumericConBotonComponent } from '../componentes/label-numeric-con-boton/label-numeric-con-boton.component';
import { SelectCellAtributoComponent } from '../componentes/select-cell-atributo/select-cell-atributo.component';
import { DirectivasModule } from '../directivas/directivas.module';
import { VisualizadorImagenesComponent } from '../../componentesgenerales/visualizador-imagenes/visualizador-imagenes.component';
import { ImprimirComponent } from '../../componentesgenerales/imprimir/imprimir.component';
import { BotonesAccionComponent } from '../rrhh/componentes/contable-rrhh-formulario/botones-accion/botones-accion.component';
import { SoloNumerosComponent } from '../componentes/solo-numeros/solo-numeros.component';
import { MaskCalendarComponent } from '../componentes/mask-calendar/mask-calendar.component';
import { NumeracionComponent } from '../componentes/numeracion/numeracion.component';

@NgModule({
  imports: [
    //Modulo del core de angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    //modulo de directivas
    DirectivasModule,
    //Modulos adicionales
    NgbModule.forRoot(),
    AgGridModule.withComponents([]),
    //Modulos de primeng
    ContextMenuModule,
    MultiSelectModule,
    CalendarModule,
    DropdownModule,
    TableModule,
    KeyFilterModule,
    DialogModule,
    FileUploadModule,
    InputMaskModule,
    ChipsModule,
    AutoCompleteModule,
    ToggleButtonModule,
    GalleriaModule,
    RadioButtonModule
  ],
  exports: [
    //Modulo del core de angular
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    //modulo de directivas
    DirectivasModule,
    //Modulos adicionales
    NgbModule,
    AgGridModule,
    //Modulos de primeng
    ContextMenuModule,
    MultiSelectModule,
    CalendarModule,
    DropdownModule,
    TableModule,
    KeyFilterModule,
    DialogModule,
    FileUploadModule,
    InputMaskModule,
    ChipsModule,
    AutoCompleteModule,
    ToggleButtonModule,
    GalleriaModule,
    RadioButtonModule,
    //Componentes considerados repetitivos
    CargandoComponent,
    VisualizadorImagenesComponent,
    ImprimirComponent,
    BotonesAccionComponent,

    TooltipReaderComponent,
    IconoEstadoComponent,
    BotonOpcionesComponent,
    NumericCellComponent,
    InputCellComponent,
    PinnedCellComponent,
    CheckCellComponent,
    BotonAccionComponent,
    SpanAccionComponent,
    CheckboxCellComponent,
    CheckboxHeaderComponent,
    SelectCellComponent,
    PopOverInformacionComponent,
    InputLabelCellComponent,
    SelectCellAtributoComponent,
    InputNumericConBotonComponent,
    LabelNumericConBotonComponent,
    InputEstadoComponent,
    SoloNumerosComponent,
    MaskCalendarComponent,
    NumeracionComponent
  ],
  declarations: [
    CargandoComponent,
    VisualizadorImagenesComponent,
    ImprimirComponent,
    BotonesAccionComponent,

    TooltipReaderComponent,
    IconoEstadoComponent,
    BotonOpcionesComponent,
    NumericCellComponent,
    InputCellComponent,
    PinnedCellComponent,
    CheckCellComponent,
    BotonAccionComponent,
    SpanAccionComponent,
    CheckboxCellComponent,
    CheckboxHeaderComponent,
    SelectCellComponent,
    PopOverInformacionComponent,
    InputLabelCellComponent,
    SelectCellAtributoComponent,
    InputNumericConBotonComponent,
    LabelNumericConBotonComponent,
    InputEstadoComponent,
    SoloNumerosComponent,
    MaskCalendarComponent,
    NumeracionComponent
  ],
  providers: [
    NgbActiveModal
  ],
  entryComponents: [
    VisualizadorImagenesComponent,
    ImprimirComponent,
    TooltipReaderComponent,
    IconoEstadoComponent,
    BotonOpcionesComponent,
    NumericCellComponent,
    InputCellComponent,
    PinnedCellComponent,
    CheckCellComponent,
    BotonAccionComponent,
    SpanAccionComponent,
    CheckboxCellComponent,
    CheckboxHeaderComponent,
    SelectCellComponent,
    PopOverInformacionComponent,
    InputLabelCellComponent,
    SelectCellAtributoComponent,
    InputNumericConBotonComponent,
    LabelNumericConBotonComponent,
    InputEstadoComponent,
    SoloNumerosComponent,
    MaskCalendarComponent,
    NumeracionComponent
  ]
})
export class CompartidosModule { }
