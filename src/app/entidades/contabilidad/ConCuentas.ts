import { ConCuentasPK } from "./ConCuentasPK";
import { ConCuentasFlujoDetalle } from "./ConCuentasFlujoDetalle";
import { ConDetalle } from "./ConDetalle";

export class ConCuentas {

  conCuentasPK: ConCuentasPK = new ConCuentasPK();
  ctaDetalle: string = null;
  ctaActivo: Boolean = false;
  usrEmpresa: string = null;
  usrCodigo: string = null;
  usrFechaInserta: Date = null;
  conCuentasFlujoDetalleList: Array<ConCuentasFlujoDetalle> = new Array();
  conDetalleList: Array<ConDetalle> = new Array();

  constructor(data?) {
    data ? this.hydrate(data) : null;
  }

  hydrate(data) {
    this.conCuentasPK = data ? data.conCuentasPK : this.conCuentasPK;
    this.usrEmpresa = data ? data.usrEmpresa : this.usrEmpresa;
    this.ctaDetalle = data ? data.ctaDetalle : this.ctaDetalle;
    this.ctaActivo = data ? data.ctaActivo : this.ctaActivo;
    this.usrCodigo = data ? data.usrCodigo : this.usrCodigo;
  }

}
