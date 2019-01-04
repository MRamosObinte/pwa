import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProduccionComponent } from './produccion/produccion.component';
import { PermisosResolveService } from '../../serviciosgenerales/permisos-resolve.service';
import { ProduccionCaminoResolve } from '../../serviciosgenerales/caminos/produccion.camino.resolve';
import { KardexComponent } from '../inventario/componentes/kardex/kardex.component';
import { PiscinaComponent } from './archivos/piscina/piscina.component';
import { SectorComponent } from './archivos/sector/sector.component';
import { ConsumoComponent } from './transacciones/consumo/consumo.component';
import { SaldoBodegaComponent } from '../inventario/consultas/saldo-bodega/saldo-bodega.component';
import { SaldoBodegaGeneralComponent } from '../inventario/consultas/saldo-bodega-general/saldo-bodega-general.component';
import { ConsumosFechaDesglosadoComponent } from './consultas/consumos-fecha-desglosado/consumos-fecha-desglosado.component';
import { ConsumosFechaComponent } from './consultas/consumos-fecha/consumos-fecha.component';
import { ConsumosMensualesComponent } from './consultas/consumos-mensuales/consumos-mensuales.component';
import { ConsumosPiscinaComponent } from './consultas/consumos-piscina/consumos-piscina.component';
import { ConsumosPiscinaPeriodoComponent } from './consultas/consumos-piscina-periodo/consumos-piscina-periodo.component';
import { ConsumosPiscinaMultipleComponent } from './consultas/consumos-piscina-multiple/consumos-piscina-multiple.component';
import { CorridaComponent } from './archivos/corrida/corrida.component';
import { CostosProductosProcesosComponent } from './consultas/costos-productos-procesos/costos-productos-procesos.component';
import { ConsumosProductosProcesoComponent } from './consultas/consumos-productos-proceso/consumos-productos-proceso.component';
import { SaldoBodegaComprobacionMontosComponent } from '../inventario/consultas/saldo-bodega-comprobacion-montos/saldo-bodega-comprobacion-montos.component';
import { AnalisisPesosCrecimientoComponent } from './consultas/analisis-pesos-crecimiento/analisis-pesos-crecimiento.component';
import { GrameajeListadoComponent } from './consultas/grameaje-listado/grameaje-listado.component';
import { CostosPiscinaComponent } from './consultas/costos-piscina/costos-piscina.component';
import { UtilidadDiariaComponent } from './consultas/utilidad-diaria/utilidad-diaria.component';
import { CostosFechaSimpleComponent } from './consultas/costos-fecha-simple/costos-fecha-simple.component';
import { CostosFechaComponent } from './consultas/costos-fecha/costos-fecha.component';
import { GrameajePiscinaProcesosComponent } from './consultas/grameaje-piscina-procesos/grameaje-piscina-procesos.component';
import { ResumenPescasComponent } from './consultas/resumen-pescas/resumen-pescas.component';
import { ResumenSiembraComponent } from './consultas/resumen-siembra/resumen-siembra.component';
import { CostosMensualesComponent } from './consultas/costos-mensuales/costos-mensuales.component';
import { CostosPiscinaSemanalComponent } from './consultas/costos-piscina-semanal/costos-piscina-semanal.component';
import { CostosPiscinaMultipleComponent } from './consultas/costos-piscina-multiple/costos-piscina-multiple.component';
import { CostosFechasProrrateadoComponent } from './consultas/costos-fechas-prorrateado/costos-fechas-prorrateado.component';
import { PreliquidacionPescaComponent } from './transacciones/preliquidacion-pesca/preliquidacion-pesca.component';
import { LiquidacionPescaComponent } from './transacciones/liquidacion-pesca/liquidacion-pesca.component';
import { ResumenEconomicoSiembraComponent } from './consultas/resumen-economico-siembra/resumen-economico-siembra.component';
import { LiquidacionMotivoComponent } from './archivos/liquidacion-motivo/liquidacion-motivo.component';
import { ResumenEconomicoPescaComponent } from './consultas/resumen-economico-pesca/resumen-economico-pesca.component';
import { ProductosPescaComponent } from './archivos/productos-pesca/productos-pesca.component';
import { TallaPescaComponent } from './archivos/talla-pesca/talla-pesca.component';
import { SobrevivenciaComponent } from './archivos/sobrevivencia/sobrevivencia.component';
import { PresupuestoPescaMotivoComponent } from './archivos/presupuesto-pesca-motivo/presupuesto-pesca-motivo.component';
import { PreLiquidacionMotivoComponent } from './archivos/pre-liquidacion-motivo/pre-liquidacion-motivo.component';
import { GrameajeComponent } from './transacciones/grameaje/grameaje.component';

const produccionRoutes: Routes = [
  {
    path: '',
    component: ProduccionComponent,
    children: [
      {
        path: 'sector',
        component: SectorComponent,
        resolve: {
          sector: PermisosResolveService,
          breadcrumb: ProduccionCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'sobrevivencia',
        component: SobrevivenciaComponent,
        resolve: {
          sobrevivencia: PermisosResolveService,
          breadcrumb: ProduccionCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'piscina',
        component: PiscinaComponent,
        resolve: {
          piscina: PermisosResolveService,
          breadcrumb: ProduccionCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'corrida',
        component: CorridaComponent,
        resolve: {
          corrida: PermisosResolveService,
          breadcrumb: ProduccionCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'talla',
        component: TallaPescaComponent,
        resolve: {
          talla: PermisosResolveService,
          breadcrumb: ProduccionCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'presupuestoPescaMotivo',
        component: PresupuestoPescaMotivoComponent,
        resolve: {
          presupuestoPescaMotivo: PermisosResolveService,
          breadcrumb: ProduccionCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'preLiquidacionMotivo',
        component: PreLiquidacionMotivoComponent,
        resolve: {
          preLiquidacionMotivo: PermisosResolveService,
          breadcrumb: ProduccionCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'liquidacionMotivo',
        component: LiquidacionMotivoComponent,
        resolve: {
          liquidacionMotivo: PermisosResolveService,
          breadcrumb: ProduccionCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'producto',
        component: ProductosPescaComponent,
        resolve: {
          producto: PermisosResolveService,
          breadcrumb: ProduccionCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      // consultas
      {
        path: 'kardex',
        component: KardexComponent,
        resolve: {
          kardex: PermisosResolveService,
          tipoKardex: 'kSimple',
          breadcrumb: ProduccionCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'saldoBodegaProd',
        component: SaldoBodegaComponent,
        resolve: {
          saldoBodegaInv: PermisosResolveService,
          tipoKardex: 'kSimple',
          breadcrumb: ProduccionCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'saldoBodegaGeneralProd',
        component: SaldoBodegaGeneralComponent,
        resolve: {
          saldoBodegaGeneral: PermisosResolveService,
          tipoKardex: 'kSimple',
          breadcrumb: ProduccionCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'saldoBodegaComprobacionMontosProd',
        component: SaldoBodegaComprobacionMontosComponent,
        resolve: {
          saldoBodegaComprobacionMontos: PermisosResolveService,
          tipoKardex: 'kSimple',
          breadcrumb: ProduccionCaminoResolve,
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'grameajeListado',
        component: GrameajeListadoComponent,
        resolve: {
          grameajeListado: PermisosResolveService,
          breadcrumb: ProduccionCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'analisisPesosCrecimiento',
        component: AnalisisPesosCrecimientoComponent,
        resolve: {
          analisisPesosCrecimiento: PermisosResolveService,
          breadcrumb: ProduccionCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'resumenEconomicoPesca',
        component: ResumenEconomicoPescaComponent,
        resolve: {
          resumenEconomicoPesca: PermisosResolveService,
          tipoKardex: 'kSimple',
          breadcrumb: ProduccionCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'utilidadDiaria',
        component: UtilidadDiariaComponent,
        resolve: {
          utilidadDiaria: PermisosResolveService,
          breadcrumb: ProduccionCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'costosPiscina',
        component: CostosPiscinaComponent,
        resolve: {
          costosPiscina: PermisosResolveService,
          breadcrumb: ProduccionCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'costosPiscinaSemanal',
        component: CostosPiscinaSemanalComponent,
        resolve: {
          costosPiscinaSemanal: PermisosResolveService,
          tipoKardex: 'kSimple',
          breadcrumb: ProduccionCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'costosPiscinaMultiple',
        component: CostosPiscinaMultipleComponent,
        resolve: {
          costosPiscinaMultiple: PermisosResolveService,
          tipoKardex: 'kSimple',
          breadcrumb: ProduccionCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'costosFechaProrrateado',
        component: CostosFechasProrrateadoComponent,
        resolve: {
          costosFechaProrrateado: PermisosResolveService,
          tipoKardex: 'kSimple',
          breadcrumb: ProduccionCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'costosFecha',
        component: CostosFechaComponent,
        resolve: {
          costosFecha: PermisosResolveService,
          breadcrumb: ProduccionCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'costosMensuales',
        component: CostosMensualesComponent,
        resolve: {
          costosMensuales: PermisosResolveService,
          breadcrumb: ProduccionCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'costosFechaSimple',
        component: CostosFechaSimpleComponent,
        resolve: {
          costosFechaSimple: PermisosResolveService,
          breadcrumb: ProduccionCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'costosProductosProcesos',
        component: CostosProductosProcesosComponent,
        resolve: {
          costosProductosProcesos: PermisosResolveService,
          tipoKardex: 'kSimple',
          breadcrumb: ProduccionCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'consumosPiscina',
        component: ConsumosPiscinaComponent,
        resolve: {
          consumosPiscina: PermisosResolveService,
          tipoKardex: 'kSimple',
          breadcrumb: ProduccionCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'consumosPiscinaPeriodo',
        component: ConsumosPiscinaPeriodoComponent,
        resolve: {
          consumosPiscinaPeriodo: PermisosResolveService,
          tipoKardex: 'kSimple',
          breadcrumb: ProduccionCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'consumosPiscinaMultiple',
        component: ConsumosPiscinaMultipleComponent,
        resolve: {
          consumosPiscinaMultiple: PermisosResolveService,
          tipoKardex: 'kSimple',
          breadcrumb: ProduccionCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'consumosFecha',
        component: ConsumosFechaComponent,
        resolve: {
          consumosFecha: PermisosResolveService,
          tipoKardex: 'kSimple',
          breadcrumb: ProduccionCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'consumosMensuales',
        component: ConsumosMensualesComponent,
        resolve: {
          consumosMensuales: PermisosResolveService,
          tipoKardex: 'kSimple',
          breadcrumb: ProduccionCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'consumosFechaDesglosado',
        component: ConsumosFechaDesglosadoComponent,
        resolve: {
          consumosFechaDesglosado: PermisosResolveService,
          tipoKardex: 'kSimple',
          breadcrumb: ProduccionCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'consumosProductoProceso',
        component: ConsumosProductosProcesoComponent,
        resolve: {
          consumosProductoProceso: PermisosResolveService,
          tipoKardex: 'kSimple',
          breadcrumb: ProduccionCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'consumosListado',
        component: ConsumoComponent,
        resolve: {
          consumosListado: PermisosResolveService,
          breadcrumb: ProduccionCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'grameajePiscinaProcesos',
        component: GrameajePiscinaProcesosComponent,
        resolve: {
          grameajePiscinaProcesos: PermisosResolveService,
          breadcrumb: ProduccionCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'resumenEconomicoSiembra',
        component: ResumenEconomicoSiembraComponent,
        resolve: {
          resumenEconomicoSiembra: PermisosResolveService,
          breadcrumb: ProduccionCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'resumenSiembra',
        component: ResumenSiembraComponent,
        resolve: {
          resumenSiembra: PermisosResolveService,
          breadcrumb: ProduccionCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'resumenPesca',
        component: ResumenPescasComponent,
        resolve: {
          resumenPesca: PermisosResolveService,
          breadcrumb: ProduccionCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      //Transacciones
      {
        path: 'grameaje',
        component: GrameajeComponent,
        resolve: {
          grameaje: PermisosResolveService,
          breadcrumb: ProduccionCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'liquidacionPescaListado',
        component: LiquidacionPescaComponent,
        resolve: {
          liquidacionPescaListado: PermisosResolveService,
          breadcrumb: ProduccionCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
      {
        path: 'preLiquidacionPescaListado',
        component: PreliquidacionPescaComponent,
        resolve: {
          preLiquidacionPescaListado: PermisosResolveService,
          breadcrumb: ProduccionCaminoResolve
        },
        runGuardsAndResolvers: 'always'
      },
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(produccionRoutes)
  ],
  exports: [
    RouterModule
  ],
  providers: [
    {
      provide: 'kSimple',
      useValue: () => 'kSimple'
    }
  ]
})
export class ProduccionRoutingModule { }
