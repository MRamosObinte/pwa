import { NgModule } from '@angular/core';
import { ProduccionRoutingModule } from './produccion-routing-module';
import { ProduccionComponent } from './produccion/produccion.component';
import { SectorComponent } from './archivos/sector/sector.component';
import { PiscinaComponent } from './archivos/piscina/piscina.component';
import { ComponentesModule } from '../componentes/componentes.module';
import { ConsumoListadoComponent } from './componentes/consumo-listado/consumo-listado.component';
import { PiscinaListadoComponent } from './componentes/piscina-listado/piscina-listado.component';
import { PiscinaFormularioComponent } from './componentes/piscina-formulario/piscina-formulario.component';
import { SectorListadoComponent } from './componentes/sector-listado/sector-listado.component';
import { SectorFormularioComponent } from './componentes/sector-formulario/sector-formulario.component';
import { ConsumoComponent } from './transacciones/consumo/consumo.component';
import { ConsumosFechaDesglosadoComponent } from './consultas/consumos-fecha-desglosado/consumos-fecha-desglosado.component';
import { ConsumosFechaComponent } from './consultas/consumos-fecha/consumos-fecha.component';
import { ConsumosMensualesComponent } from './consultas/consumos-mensuales/consumos-mensuales.component';
import { ConsumosPiscinaComponent } from './consultas/consumos-piscina/consumos-piscina.component';
import { ConsumosPiscinaPeriodoComponent } from './consultas/consumos-piscina-periodo/consumos-piscina-periodo.component';
import { ConsumosPiscinaMultipleComponent } from './consultas/consumos-piscina-multiple/consumos-piscina-multiple.component';
import { CorridaComponent } from './archivos/corrida/corrida.component';
import { CorridaFormularioComponent } from './componentes/corrida-formulario/corrida-formulario.component';
import { CorridaListadoComponent } from './componentes/corrida-listado/corrida-listado.component';
import { CostosProductosProcesosComponent } from './consultas/costos-productos-procesos/costos-productos-procesos.component';
import { TranferenciaPescaComponent } from './componentes/corrida-formulario/tranferencia-pesca/tranferencia-pesca.component';
import { ConsumosProductosProcesoComponent } from './consultas/consumos-productos-proceso/consumos-productos-proceso.component';
import { AnalisisPesosCrecimientoComponent } from './consultas/analisis-pesos-crecimiento/analisis-pesos-crecimiento.component';
import { GrameajeListadoComponent } from './consultas/grameaje-listado/grameaje-listado.component';
import { CostosPiscinaComponent } from './consultas/costos-piscina/costos-piscina.component';
import { UtilidadDiariaComponent } from './consultas/utilidad-diaria/utilidad-diaria.component';
import { GrameajePiscinaProcesosComponent } from './consultas/grameaje-piscina-procesos/grameaje-piscina-procesos.component';
import { ResumenSiembraComponent } from './consultas/resumen-siembra/resumen-siembra.component';
import { ResumenPescasComponent } from './consultas/resumen-pescas/resumen-pescas.component';
import { AgmCoreModule } from '@agm/core';
import { UtilidadDiariaResumenBiologicoComponent } from './componentes/utilidad-diaria-resumen-biologico/utilidad-diaria-resumen-biologico.component';
import { UtilidadDiariaResumenFinancieroComponent } from './componentes/utilidad-diaria-resumen-financiero/utilidad-diaria-resumen-financiero.component';
import { UtilidadDiariaConsumoBalanceadoComponent } from './componentes/utilidad-diaria-consumo-balanceado/utilidad-diaria-consumo-balanceado.component';
import { CostosPiscinaListadoComponent } from './componentes/costos-piscina-listado/costos-piscina-listado.component';
import { CostosFechaSimpleComponent } from './consultas/costos-fecha-simple/costos-fecha-simple.component';
import { CostosFechaComponent } from './consultas/costos-fecha/costos-fecha.component';
import { LiquidacionPescaComponent } from './transacciones/liquidacion-pesca/liquidacion-pesca.component';
import { PreliquidacionPescaComponent } from './transacciones/preliquidacion-pesca/preliquidacion-pesca.component';
import { CostosMensualesComponent } from './consultas/costos-mensuales/costos-mensuales.component';
import { CostosPiscinaSemanalComponent } from './consultas/costos-piscina-semanal/costos-piscina-semanal.component';
import { CostosPiscinaMultipleComponent } from './consultas/costos-piscina-multiple/costos-piscina-multiple.component';
import { CostosFechasProrrateadoComponent } from './consultas/costos-fechas-prorrateado/costos-fechas-prorrateado.component';
import { LiquidacionFormularioComponent } from './componentes/liquidacion-formulario/liquidacion-formulario.component';
import { ResumenEconomicoSiembraComponent } from './consultas/resumen-economico-siembra/resumen-economico-siembra.component';
import { LiquidacionMotivoComponent } from './archivos/liquidacion-motivo/liquidacion-motivo.component';
import { ResumenEconomicoPescaComponent } from './consultas/resumen-economico-pesca/resumen-economico-pesca.component';
import { ProductosPescaComponent } from './archivos/productos-pesca/productos-pesca.component';
import { TallaPescaComponent } from './archivos/talla-pesca/talla-pesca.component';
import { SobrevivenciaComponent } from './archivos/sobrevivencia/sobrevivencia.component';
import { ProductosPescaListadoComponent } from './componentes/productos-pesca-listado/productos-pesca-listado.component';
import { ProductosPescaFormularioComponent } from './componentes/productos-pesca-formulario/productos-pesca-formulario.component';
import { TallaPescaListadoComponent } from './componentes/talla-pesca-listado/talla-pesca-listado.component';
import { TallaPescaFormularioComponent } from './componentes/talla-pesca-formulario/talla-pesca-formulario.component';
import { PresupuestoPescaMotivoComponent } from './archivos/presupuesto-pesca-motivo/presupuesto-pesca-motivo.component';
import { PreLiquidacionMotivoComponent } from './archivos/pre-liquidacion-motivo/pre-liquidacion-motivo.component';
import { PreLiquidacionMotivoFormularioComponent } from './componentes/pre-liquidacion-motivo-formulario/pre-liquidacion-motivo-formulario.component';
import { LiquidacionMotivoFormularioComponent } from './componentes/liquidacion-motivo-formulario/liquidacion-motivo-formulario.component';
import { SobrevivenciaListadoComponent } from './componentes/sobrevivencia-listado/sobrevivencia-listado.component';
import { SobrevivenciaFormularioComponent } from './componentes/sobrevivencia-formulario/sobrevivencia-formulario.component';
import { PresupuestoPescaMotivoFormularioComponent } from './componentes/presupuesto-pesca-motivo-formulario/presupuesto-pesca-motivo-formulario.component';
import { GrameajeListadoGrafBiomasaComponent } from './componentes/grameaje-listado-graf-biomasa/grameaje-listado-graf-biomasa.component';
import { GrameajeListadoGrafTallaComponent } from './componentes/grameaje-listado-graf-talla/grameaje-listado-graf-talla.component';
import { GrameajeListadoGrafBiomasaTallaComponent } from './componentes/grameaje-listado-graf-biomasa-talla/grameaje-listado-graf-biomasa-talla.component';
import { GrameajeComponent } from './transacciones/grameaje/grameaje.component';
import { GrameajeListadoFormularioComponent } from './componentes/grameaje-listado-formulario/grameaje-listado-formulario.component';
import { PreLiquidacionFormularioComponent } from './componentes/pre-liquidacion-formulario/pre-liquidacion-formulario.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@NgModule({
  imports: [
    ComponentesModule,
    ProduccionRoutingModule,
    NgxChartsModule,
    AgmCoreModule.forRoot({ apiKey: 'AIzaSyAx7YF8A1ZvaHTx3PA0fcHLtedx_PLVxtY' })
  ],
  declarations: [
    ProduccionComponent,
    SectorComponent,
    PiscinaComponent,
    ConsumoComponent,
    ConsumoListadoComponent,
    ConsumosFechaDesglosadoComponent,
    PiscinaListadoComponent,
    PiscinaFormularioComponent,
    SectorListadoComponent,
    SectorFormularioComponent,
    ConsumosFechaComponent,
    ConsumosMensualesComponent,
    ConsumosPiscinaComponent,
    ConsumosPiscinaPeriodoComponent,
    ConsumosPiscinaMultipleComponent,
    CorridaComponent,
    CorridaFormularioComponent,
    CorridaListadoComponent,
    CostosProductosProcesosComponent,
    TranferenciaPescaComponent,
    ConsumosProductosProcesoComponent,
    AnalisisPesosCrecimientoComponent,
    GrameajeListadoComponent,
    CostosPiscinaComponent,
    UtilidadDiariaComponent,
    GrameajePiscinaProcesosComponent,
    ResumenSiembraComponent,
    ResumenPescasComponent,
    UtilidadDiariaResumenBiologicoComponent,
    UtilidadDiariaResumenFinancieroComponent,
    UtilidadDiariaConsumoBalanceadoComponent,
    CostosPiscinaListadoComponent,
    CostosFechaSimpleComponent,
    CostosFechaComponent,
    LiquidacionPescaComponent,
    PreliquidacionPescaComponent,
    CostosMensualesComponent,
    CostosPiscinaSemanalComponent,
    CostosPiscinaMultipleComponent,
    CostosFechasProrrateadoComponent,
    ResumenEconomicoPescaComponent,
    ProductosPescaComponent,
    TallaPescaComponent,
    SobrevivenciaComponent,
    ProductosPescaListadoComponent,
    ProductosPescaFormularioComponent,
    TallaPescaListadoComponent,
    TallaPescaFormularioComponent,
    LiquidacionFormularioComponent,
    ResumenEconomicoSiembraComponent,
    LiquidacionMotivoComponent,
    PresupuestoPescaMotivoComponent,
    PreLiquidacionMotivoComponent,
    PreLiquidacionMotivoFormularioComponent,
    LiquidacionMotivoFormularioComponent,
    SobrevivenciaListadoComponent,
    SobrevivenciaFormularioComponent,
    PresupuestoPescaMotivoFormularioComponent,
    GrameajeListadoGrafBiomasaComponent,
    GrameajeListadoGrafTallaComponent,
    GrameajeListadoGrafBiomasaTallaComponent,
    GrameajeComponent,
    GrameajeListadoFormularioComponent,
    PreLiquidacionFormularioComponent
  ],
  providers: [

  ]
})
export class ProduccionModule { }
