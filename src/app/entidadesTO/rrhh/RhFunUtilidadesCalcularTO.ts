export class RhFunUtilidadesCalcularTO {
   id: number = 0;
	utiId: string = "";
	utiNombres: string = "";
	utiApellidos: string = "";
	utiGenero: string = "";
	utiFechaIngreso: string = "";
	utiFechaSalida: string = "";
	utiCargo: string = "";
	utiCargasFamiliares: number = 0;
	utiDiasLaborados: number = 0;
	utiValorPersonal: number = 0;
	utiValorCargas: number = 0;
	utiValorUtilidades: number = 0;
	utiValorSueldos: number = 0;
	utiValorBonos: number = 0;
	utiValorXiii: number = 0;
	utiValorXiv: number = 0;
	utiValorFondoReserva: number = 0;
	utiValorSalarioDigno: number = 0;
	utiValorUtilidadAnterior: number = 0;
	utiValorImpuesto: number = 0;
	utiCategoria: string = "";
	utiCuenta: string = "";
	utiSector: string = "";
	estado: boolean = false;

   constructor(data?) {
      data ? this.hydrate(data) : null;
   }

   hydrate(data) {
      this.id = data.id ? data.id : this.id;
      this.utiId = data.utiId ? data.utiId : this.utiId;
      this.utiNombres = data.utiNombres ? data.utiNombres : this.utiNombres;
      this.utiApellidos = data.utiApellidos ? data.utiApellidos : this.utiApellidos;
      this.utiGenero = data.utiGenero ? data.utiGenero : this.utiGenero;
      this.utiFechaIngreso = data.utiFechaIngreso ? data.utiFechaIngreso : this.utiFechaIngreso;
      this.utiFechaSalida = data.utiFechaSalida ? data.utiFechaSalida : this.utiFechaSalida;
      this.utiCargo = data.utiCargo ? data.utiCargo : this.utiCargo;
      this.utiCargasFamiliares = data.utiCargasFamiliares ? data.utiCargasFamiliares : this.utiCargasFamiliares;
      this.utiDiasLaborados = data.utiDiasLaborados ? data.utiDiasLaborados : this.utiDiasLaborados;
      this.utiValorPersonal = data.utiValorPersonal ? data.utiValorPersonal : this.utiValorPersonal
      this.utiValorCargas = data.utiValorCargas ? data.utiValorCargas : this.utiValorCargas
      this.utiValorUtilidades = data.utiValorUtilidades ? data.utiValorUtilidades : this.utiValorUtilidades
      this.utiValorSueldos = data.utiValorSueldos ? data.utiValorSueldos : this.utiValorSueldos
      this.utiValorBonos = data.utiValorBonos ? data.utiValorBonos : this.utiValorBonos
      this.utiValorXiii = data.utiValorXiii ? data.utiValorXiii : this.utiValorXiii
      this.utiValorXiv = data.utiValorXiv ? data.utiValorXiv : this.utiValorXiv
      this.utiValorFondoReserva = data.utiValorFondoReserva ? data.utiValorFondoReserva : this.utiValorFondoReserva
      this.utiValorSalarioDigno = data.utiValorSalarioDigno ? data.utiValorSalarioDigno : this.utiValorSalarioDigno
      this.utiValorUtilidadAnterior = data.utiValorUtilidadAnterior ? data.utiValorUtilidadAnterior : this.utiValorUtilidadAnterior
      this.utiValorImpuesto = data.utiValorImpuesto ? data.utiValorImpuesto : this.utiValorImpuesto
      this.utiCategoria = data.utiCategoria ? data.utiCategoria : this.utiCategoria
      this.utiCuenta = data.utiCuenta ? data.utiCuenta : this.utiCuenta
      this.utiSector = data.utiSector ? data.utiSector : this.utiSector
      this.estado = data.estado ? data.estado : this.estado
   }
}