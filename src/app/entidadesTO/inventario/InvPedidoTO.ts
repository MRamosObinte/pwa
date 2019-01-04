export class InvPedidoTO {

  index: number = 0;
  pedidonumero: String = "";
  codigoempresa: String = "";
  codigomotivo: String = "";
  detallemotivo: String = "";
  codigosector: String = "";
  pedfecha: Date = null;
  pedpendiente: boolean = false;
  pedaprobado: boolean = false;
  pedejecutado: boolean = false;
  pedanulado: boolean = false;
  pedmontototal: Number = 0;
  usrfechainserta: Date = null;
  obsregistra: String = "";
  obsaprueba: String = "";
  obsejecuta: String = "";
  aprobador: String = "";
  ejecutor: String = "";
  registrador: String = "";
  estado: String = "";

  constructor(data?) {
    data ? this.hydrate(data) : null;
  }

  hydrate(data) {
    this.index = data.index ? data.index : this.index;
    this.pedidonumero = data.pedidonumero ? data.pedidonumero : this.pedidonumero;
    this.codigoempresa = data.codigoempresa ? data.codigoempresa : this.codigoempresa;
    this.codigosector = data.codigosector ? data.codigosector : this.codigosector;
    this.codigomotivo = data.codigomotivo ? data.codigomotivo : this.codigomotivo;
    this.detallemotivo = data.detallemotivo ? data.detallemotivo : this.detallemotivo;
    this.pedfecha = data.pedfecha ? data.pedfecha : this.pedfecha;
    this.pedpendiente = data.pedpendiente ? data.pedpendiente : this.pedpendiente;
    this.pedaprobado = data.pedaprobado ? data.pedaprobado : this.pedaprobado;
    this.pedejecutado = data.pedejecutado ? data.pedejecutado : this.pedejecutado;
    this.pedanulado = data.pedanulado ? data.pedanulado : this.pedanulado;
    this.pedmontototal = data.pedmontototal ? data.pedmontototal : this.pedmontototal;
    this.usrfechainserta = data.usrfechainserta ? data.usrfechainserta : this.usrfechainserta;
    this.obsregistra = data.obsregistra ? data.obsregistra : this.obsregistra;
    this.obsaprueba = data.obsaprueba ? data.obsaprueba : this.obsaprueba;
    this.obsejecuta = data.obsejecuta ? data.obsejecuta : this.obsejecuta;
    this.aprobador = data.aprobador ? data.aprobador : this.aprobador;
    this.ejecutor = data.ejecutor ? data.ejecutor : this.ejecutor;
    this.registrador = data.registrador ? data.registrador : this.registrador;
    this.estado = data.estado ? data.estado : this.estado;
  }
}