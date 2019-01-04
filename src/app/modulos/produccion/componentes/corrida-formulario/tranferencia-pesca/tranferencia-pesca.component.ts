import { Component, OnInit, Input } from '@angular/core';
import { PrdCorridaDetalle } from '../../../../../entidades/produccion/PrdCorridaDetalle';
import { GridApi } from 'ag-grid';
import { LS } from '../../../../../constantes/app-constants';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-tranferencia-pesca',
  templateUrl: './tranferencia-pesca.component.html'
})
export class TranferenciaPescaComponent implements OnInit {

  @Input() listaCorridaDetalleOrigen: Array<PrdCorridaDetalle>;
  @Input() tipo: string = "O";
  //AG-GRID
  public gridApi: GridApi;
  public gridColumnApi: any;
  public columnDefs: Array<object> = [];
  public rowSelection: string;
  public components: any = {};
  public context;

  constructor() { }

  ngOnInit() {
    this.iniciarAgGrid();
  }

  //#region [R3] [AG-GRID] 
  iniciarAgGrid() {
    this.columnDefs = this.tipo === 'O' ? this.generarColumnasOrigen() : this.generarColumnasDestino();
    this.rowSelection = "single";
    this.context = { componentParent: this };
    this.components = {};
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.redimensionarColumnas();
    this.gridApi.sizeColumnsToFit();
  }

  redimensionarColumnas() {
    this.gridApi ? this.gridApi.sizeColumnsToFit() : null;
  }

  refreshGrid() {
    this.gridApi ? this.gridApi.refreshCells() : null;
  }

  generarColumnasOrigen(): Array<any> {
    let columnas: Array<any> = [];
    columnas.push(
      {
        headerName: LS.TAG_SECTOR,
        field: 'corSector',
        valueGetter: (params) => {
          let piscina = params.data.prdCorridaOrigen.prdPiscina;
          let sector = piscina ? piscina.prdSector : null;
          return params.data.prdCorridaOrigen.prdCorridaPK.corSector + (sector ? " - " + sector.secNombre : "");
        },
        width: 200,
        minWidth: 200
      },
      {
        headerName: LS.TAG_PISCINA,
        field: 'corPiscina',
        valueGetter: (params) => {
          let piscina = params.data.prdCorridaOrigen.prdPiscina;
          return params.data.prdCorridaOrigen.prdCorridaPK.corPiscina + (piscina ? " - " + piscina.pisNombre : "");
        },
        width: 205,
        minWidth: 205
      },
      {
        headerName: LS.TAG_CORRIDA_MAY,
        field: 'corNumero',
        valueGetter: (params) => { return params.data.prdCorridaOrigen.prdCorridaPK.corNumero; },
        width: 150,
        minWidth: 150
      },
      {
        headerName: LS.TAG_PORCENTAJE,
        field: 'detPorcentaje',
        valueFormatter: this.formatearA2Decimales,
        cellClass: 'text-right',
        width: 100,
        minWidth: 100
      }
    );
    return columnas;
  }

  generarColumnasDestino(): Array<any> {
    let columnas: Array<any> = [];
    columnas.push(
      {
        headerName: LS.TAG_SECTOR,
        field: 'corSector',
        valueGetter: (params) => {
          let piscina = params.data.prdCorridaDestino.prdPiscina;
          let sector = piscina ? piscina.prdSector : null;
          return params.data.prdCorridaDestino.prdCorridaPK.corSector + (sector ? " - " + sector.secNombre : "");
        },
        width: 200,
        minWidth: 200
      },
      {
        headerName: LS.TAG_PISCINA,
        field: 'corPiscina',
        valueGetter: (params) => {
          let piscina = params.data.prdCorridaDestino.prdPiscina;
          return params.data.prdCorridaDestino.prdCorridaPK.corPiscina + (piscina ? " - " + piscina.pisNombre : "");
        },
        width: 200,
        minWidth: 200
      },
      {
        headerName: LS.TAG_CORRIDA,
        field: 'corNumero',
        valueGetter: (params) => { return params.data.prdCorridaDestino.prdCorridaPK.corNumero; },
        width: 150,
        minWidth: 150
      },
      {
        headerName: LS.TAG_PORCENTAJE,
        field: 'detPorcentaje',
        valueFormatter: this.formatearA2Decimales,
        cellClass: 'text-right',
        width: 100,
        minWidth: 100
      }
    );
    return columnas;
  }

  formatearA2Decimales(params) {
    return new DecimalPipe('en-US').transform(params.value, '1.2-2');
  }

}
