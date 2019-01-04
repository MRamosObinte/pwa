export class RhFunFormulario107_2013TO {
    id: number;
    f107Id: string;
    f107Tipo: string;
    f107Apellidos: string;
    f107Nombres: string;
    f107Establecimiento: string;
    f107ResidenciaTipo: string;
    f107ResidenciaPais: string;
    f107Convenio: string;
    f107DiscapacidadTipo: string;
    f107DiscapacidadPorcentaje: number;
    f107DiscapacidadIdTipo: string;
    f107DiscapacidadIdNumero: string;
    f107Sueldo: number;
    f107Bonos: number;
    f107Utilidades: number;
    f107SueldoOtrosEmpleadores: number;
    f107ImpuestoAsumido: number;
    f107XiiiSueldo: number;
    f107XivSueldo: number;
    f107FondoReserva: number;
    f107SalarioDigno: number;
    f107Desahucio: number;
    f107Subtotal: number;
    f107SalarioNeto: string;
    f107Iess: number;
    f107IessOtrosEmpleadores: number;
    f107Vivienda: number;
    f107Salud: number;
    f107Educacion: number;
    f107Alimentacion: number;
    f107Vestuario: number;
    f107RebajaDiscapacitado: number;
    f107RebajaTerceraEdad: number;
    f107BaseImponible: number;
    f107ImpuestoCausado: number;
    f107ImpuestoAsumidoOtrosEmpleadores: number;
    f107ImpuestoAsumidoEsteEmpleador: number;
    f107ValorRetenido: number;
    f107EmpleadoInactivo: boolean;
 
    constructor(data?) {
       data ? this.hydrate(data) : null;
    }
 
    hydrate(data) {
       this.f107Id = data.f107Id ? data.f107Id : this.f107Id;
       this.f107Tipo = data.f107Tipo ? data.f107Tipo : this.f107Tipo;
       this.f107Apellidos = data.f107Apellidos ? data.f107Apellidos : this.f107Apellidos;
       this.f107Nombres = data.f107Nombres ? data.f107Nombres : this.f107Nombres;
       this.f107Establecimiento = data.f107Establecimiento ? data.f107Establecimiento : this.f107Establecimiento;
       this.f107ResidenciaTipo = data.f107ResidenciaTipo ? data.f107ResidenciaTipo : this.f107ResidenciaTipo;
       this.f107ResidenciaPais = data.f107ResidenciaPais ? data.f107ResidenciaPais : this.f107ResidenciaPais;
       this.f107Convenio = data.f107Convenio ? data.f107Convenio : this.f107Convenio;
       this.f107DiscapacidadTipo = data.f107DiscapacidadTipo ? data.f107DiscapacidadTipo : this.f107DiscapacidadTipo;
       this.f107DiscapacidadPorcentaje = data.f107DiscapacidadPorcentaje ? data.f107DiscapacidadPorcentaje : this.f107DiscapacidadPorcentaje;
       this.f107DiscapacidadIdTipo = data.f107DiscapacidadIdTipo ? data.f107DiscapacidadIdTipo : this.f107DiscapacidadIdTipo;
       this.f107DiscapacidadIdNumero = data.f107DiscapacidadIdNumero ? data.f107DiscapacidadIdNumero : this.f107DiscapacidadIdNumero;
       this.f107Sueldo = data.f107Sueldo ? data.f107Sueldo : this.f107Sueldo;
       this.f107Bonos = data.f107Bonos ? data.f107Bonos : this.f107Bonos;
       this.f107Utilidades = data.f107Utilidades ? data.f107Utilidades : this.f107Utilidades;
       this.f107SueldoOtrosEmpleadores = data.f107SueldoOtrosEmpleadores ? data.f107SueldoOtrosEmpleadores : this.f107SueldoOtrosEmpleadores;
       this.f107ImpuestoAsumido = data.f107ImpuestoAsumido ? data.f107ImpuestoAsumido : this.f107ImpuestoAsumido;
       this.f107XiiiSueldo = data.f107XiiiSueldo ? data.f107XiiiSueldo : this.f107XiiiSueldo;
       this.f107XivSueldo = data.f107XivSueldo ? data.f107XivSueldo : this.f107XivSueldo;
       this.f107FondoReserva = data.f107FondoReserva ? data.f107FondoReserva : this.f107FondoReserva;
       this.f107SalarioDigno = data.f107SalarioDigno ? data.f107SalarioDigno : this.f107SalarioDigno;
       this.f107Desahucio = data.f107Desahucio ? data.f107Desahucio : this.f107Desahucio;
       this.f107Subtotal = data.f107Subtotal ? data.f107Subtotal : this.f107Subtotal;
       this.f107SalarioNeto = data.f107SalarioNeto ? data.f107SalarioNeto : this.f107SalarioNeto;
       this.f107Iess = data.f107Iess ? data.f107Iess : this.f107Iess;
       this.f107IessOtrosEmpleadores = data.f107IessOtrosEmpleadores ? data.f107IessOtrosEmpleadores : this.f107IessOtrosEmpleadores;
       this.f107Vivienda = data.f107Vivienda ? data.f107Vivienda : this.f107Vivienda;
       this.f107Salud = data.f107Salud ? data.f107Salud : this.f107Salud;
       this.f107Educacion = data.f107Educacion ? data.f107Educacion : this.f107Educacion;
       this.f107Alimentacion = data.f107Alimentacion ? data.f107Alimentacion : this.f107Alimentacion;
       this.f107Vestuario = data.f107Vestuario ? data.f107Vestuario : this.f107Vestuario;
       this.f107RebajaDiscapacitado = data.f107RebajaDiscapacitado ? data.f107RebajaDiscapacitado : this.f107RebajaDiscapacitado;
       this.f107RebajaTerceraEdad = data.f107RebajaTerceraEdad ? data.f107RebajaTerceraEdad : this.f107RebajaTerceraEdad;
       this.f107BaseImponible = data.f107BaseImponible ? data.f107BaseImponible : this.f107BaseImponible;
       this.f107ImpuestoCausado = data.f107ImpuestoCausado ? data.f107ImpuestoCausado : this.f107ImpuestoCausado;
       this.f107ImpuestoAsumidoOtrosEmpleadores = data.f107ImpuestoAsumidoOtrosEmpleadores ? data.f107ImpuestoAsumidoOtrosEmpleadores : this.f107ImpuestoAsumidoOtrosEmpleadores;
       this.f107ImpuestoAsumidoEsteEmpleador = data.f107ImpuestoAsumidoEsteEmpleador ? data.f107ImpuestoAsumidoEsteEmpleador : this.f107ImpuestoAsumidoEsteEmpleador;
       this.f107Vestuario = data.f107ValorRetenido ? data.f107ValorRetenido : this.f107ValorRetenido;
       this.f107EmpleadoInactivo = data.f107EmpleadoInactivo ? data.f107EmpleadoInactivo : this.f107EmpleadoInactivo;
    }
 }