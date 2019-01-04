export class ConMayorAuxiliarTO {
  id: number = 0;
  maContable: String = "";
  maFecha: String = "";
  maSecuencia: number = 0;
  maCuenta: String = "";
  maCuentaDetalle: String = "";
  maCP: String = "";
  maCC: String = "";
  maDocumento: String = "";
  maDebe: number = 0;
  maHaber: number = 0;
  maSaldo: number = 0;
  maObservaciones: String = "";
  maGenerado: boolean = false;
  maReferencia: String = "";
  maOrden: number = 0;

  constructor(data?) {
    data ? this.hydrate(data) : null;
  }

  hydrate(data) {
    this.id = data ? data.id : this.id;
    this.maContable = data.maContable ? data.maContable : this.maContable;
    this.maFecha = data.maFecha ? data.maFecha : this.maFecha;
    this.maSecuencia = data.maSecuencia ? data.maSecuencia : this.maSecuencia;
    this.maCuenta = data.maCuenta ? data.maCuenta : this.maCuenta;
    this.maCuentaDetalle = data.maCuentaDetalle ? data.maCuentaDetalle : this.maCuentaDetalle;
    this.maCP = data.maCP ? data.maCP : this.maCP;
    this.maCC = data.maCC ? data.maCC : this.maCC;
    this.maDocumento = data.maDocumento ? data.maDocumento : this.maDocumento;
    this.maDebe = data.maDebe ? data.maDebe : this.maDebe;
    this.maHaber = data.maHaber ? data.maHaber : this.maHaber;
    this.maSaldo = data.maSaldo ? data.maSaldo : this.maSaldo;
    this.maObservaciones = data.maObservaciones ? data.maObservaciones : this.maObservaciones;
    this.maGenerado = data.maGenerado ? data.maGenerado : this.maGenerado;
    this.maReferencia = data.maReferencia ? data.maReferencia : this.maReferencia;
    this.maOrden = data.maOrden ? data.maOrden : this.maOrden;

  }
}
