export class ConCuentasTO {

  cuentaCodigo: string = null;
  empCodigo: string = null;
  cuentaDetalle: string = null;
  cuentaActivo: boolean = true;
  usrInsertaCuenta: string = "";
  usrFechaInsertaCuenta: string = "";

  constructor(data?) {
    data ? this.hydrate(data) : null;
  }

  hydrate(data) {
    this.cuentaCodigo = data.cuentaCodigo ? data.cuentaCodigo : this.cuentaCodigo;
    this.empCodigo = data.empCodigo ? data.empCodigo : this.empCodigo;
    this.cuentaDetalle = data.cuentaDetalle ? data.cuentaDetalle : this.cuentaDetalle;
    this.cuentaActivo = data.cuentaActivo ? data.cuentaActivo : this.cuentaActivo;
    this.usrInsertaCuenta = data.usrInsertaCuenta ? data.usrInsertaCuenta : this.usrInsertaCuenta;
    this.usrFechaInsertaCuenta = data.usrFechaInsertaCuenta ? data.usrFechaInsertaCuenta : this.usrFechaInsertaCuenta;
    }

  }

