export class SisGrupoTO {

    gruCodigo: string = "";
    gruEmpresa: string = "";
    gruNombre: string = "";

    gruCrear: boolean;
    gruCrearClientes: boolean;
    gruCrearProveedores: boolean;
    gruCrearProductos: boolean;
    gruCrearCuentasContables: boolean;
    gruCrearEmpleados: boolean;
    gruCrearCentrosProduccion: boolean;
    gruCrearCentrosCosto: boolean;
    gruCrearPeriodosSistema: boolean;
    gruCrearPeriodosProduccion: boolean;

    gruModificar: boolean;
    gruModificarClientes: boolean;
    gruModificarProveedores: boolean;
    gruModificarProductos: boolean;
    gruModificarCuentasContables: boolean;
    gruModificarEmpleados: boolean;
    gruModificarCentrosProduccion: boolean;
    gruModificarCentrosCosto: boolean;
    gruModificarPeriodosSistema: boolean;
    gruModificarPeriodosProduccion: boolean;

    gruEliminar: boolean;
    gruEliminarCompras: boolean;
    gruEliminarVentas: boolean;
    gruEliminarConsumos: boolean;
    gruEliminarTransferencias: boolean;
    gruEliminarContables: boolean;
    gruEliminarContablesTalentoHumano: boolean;
    gruEliminarPresupuestos: boolean;
    gruEliminarPreliquidaciones: boolean;
    gruEliminarLiquidaciones: boolean;
    gruEliminarProformas: boolean;

    gruMayorizarCompras: boolean;
    gruMayorizarVentas: boolean;
    gruMayorizarConsumos: boolean;
    gruMayorizarTransferencias: boolean;
    gruMayorizarContables: boolean;
    gruMayorizarContablesTalentoHumano: boolean;
    gruMayorizarPresupuestos: boolean;
    gruMayorizarPreliquidaciones: boolean;
    gruMayorizarLiquidaciones: boolean;
    gruMayorizarProformas: boolean;

    gruDesmayorizarCompras: boolean;
    gruDesmayorizarVentas: boolean;
    gruDesmayorizarConsumos: boolean;
    gruDesmayorizarTransferencias: boolean;
    gruDesmayorizarContables: boolean;
    gruDesmayorizarContablesTalentoHumano: boolean;
    gruDesmayorizarPresupuestos: boolean;
    gruDesmayorizarPreliquidaciones: boolean;
    gruDesmayorizarLiquidaciones: boolean;
    gruDesmayorizarProformas: boolean;

    gruAnularCompras: boolean;
    gruAnularVentas: boolean;
    gruAnularConsumos: boolean;
    gruAnularTransferencias: boolean;
    gruAnularContables: boolean;
    gruAnularContablesTalentoHumano: boolean;
    gruAnularPresupuestos: boolean;
    gruAnularPreliquidaciones: boolean;
    gruAnularLiquidaciones: boolean;
    gruAnularProformas: boolean;

    gruConfigurar: boolean;
    gruImprimir: boolean;
    gruExportar: boolean;

    empCodigo: string = "";
    usrInsertaGrupo: string = "";
    usrFechaInsertaGrupo: Date = new Date();


    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.gruCodigo = data.gruCodigo ? data.gruCodigo : this.gruCodigo;
        this.gruEmpresa = data.gruEmpresa ? data.gruEmpresa : this.gruEmpresa;
        this.gruNombre = data.gruNombre ? data.gruNombre : this.gruNombre;

        this.gruCrear = data.gruCrear ? data.gruCrear : this.gruCrear;
        this.gruCrearClientes = data.gruCrearClientes ? data.gruCrearClientes : this.gruCrearClientes;
        this.gruCrearProveedores = data.gruCrearProveedores ? data.gruCrearProveedores : this.gruCrearProveedores;
        this.gruCrearProductos = data.gruCrearProductos ? data.gruCrearProductos : this.gruCrearProductos;
        this.gruCrearCuentasContables = data.gruCrearCuentasContables ? data.gruCrearCuentasContables : this.gruCrearCuentasContables;
        this.gruCrearEmpleados = data.gruCrearEmpleados ? data.gruCrearEmpleados : this.gruCrearEmpleados;
        this.gruCrearCentrosProduccion = data.gruCrearCentrosProduccion ? data.gruCrearCentrosProduccion : this.gruCrearCentrosProduccion;
        this.gruCrearCentrosCosto = data.gruCrearCentrosCosto ? data.gruCrearCentrosCosto : this.gruCrearCentrosCosto;
        this.gruCrearPeriodosSistema = data.gruCrearPeriodosSistema ? data.gruCrearPeriodosSistema : this.gruCrearPeriodosSistema;
        this.gruCrearPeriodosProduccion = data.gruCrearPeriodosProduccion ? data.gruCrearPeriodosProduccion : this.gruCrearPeriodosProduccion;

        this.gruModificar = data.gruModificar ? data.gruModificar : this.gruModificar;
        this.gruModificarClientes = data.gruModificarClientes ? data.gruModificarClientes : this.gruModificarClientes;
        this.gruModificarProveedores = data.gruModificarProveedores ? data.gruModificarProveedores : this.gruModificarProveedores;
        this.gruModificarProductos = data.gruModificarProductos ? data.gruModificarProductos : this.gruModificarProductos;
        this.gruModificarCuentasContables = data.gruModificarCuentasContables ? data.gruModificarCuentasContables : this.gruModificarCuentasContables;
        this.gruModificarEmpleados = data.gruModificarEmpleados ? data.gruModificarEmpleados : this.gruModificarEmpleados;
        this.gruModificarCentrosProduccion = data.gruModificarCentrosProduccion ? data.gruModificarCentrosProduccion : this.gruModificarCentrosProduccion;
        this.gruModificarCentrosCosto = data.gruModificarCentrosCosto ? data.gruModificarCentrosCosto : this.gruModificarCentrosCosto;
        this.gruModificarPeriodosSistema = data.gruModificarPeriodosSistema ? data.gruModificarPeriodosSistema : this.gruModificarPeriodosSistema;
        this.gruModificarPeriodosProduccion = data.gruModificarPeriodosProduccion ? data.gruModificarPeriodosProduccion : this.gruModificarPeriodosProduccion;

        this.gruEliminar = data.gruEliminar ? data.gruEliminar : this.gruEliminar;
        this.gruEliminarCompras = data.gruEliminarCompras ? data.gruEliminarCompras : this.gruEliminarCompras;
        this.gruEliminarVentas = data.gruEliminarVentas ? data.gruEliminarVentas : this.gruEliminarVentas;
        this.gruEliminarConsumos = data.gruEliminarConsumos ? data.gruEliminarConsumos : this.gruEliminarConsumos;
        this.gruEliminarTransferencias = data.gruEliminarTransferencias ? data.gruEliminarTransferencias : this.gruEliminarTransferencias;
        this.gruEliminarContables = data.gruEliminarContables ? data.gruEliminarContables : this.gruEliminarContables;
        this.gruEliminarContablesTalentoHumano = data.gruEliminarContablesTalentoHumano ? data.gruEliminarContablesTalentoHumano : this.gruEliminarContablesTalentoHumano;
        this.gruEliminarPresupuestos = data.gruEliminarPresupuestos ? data.gruEliminarPresupuestos : this.gruEliminarPresupuestos;
        this.gruEliminarPreliquidaciones = data.gruEliminarPreliquidaciones ? data.gruEliminarPreliquidaciones : this.gruEliminarPreliquidaciones;
        this.gruEliminarLiquidaciones = data.gruEliminarLiquidaciones ? data.gruEliminarLiquidaciones : this.gruEliminarLiquidaciones;
        this.gruEliminarProformas = data.gruEliminarProformas ? data.gruEliminarProformas : this.gruEliminarProformas;

        this.gruMayorizarCompras = data.gruMayorizarCompras ? data.gruMayorizarCompras : this.gruMayorizarCompras;
        this.gruMayorizarVentas = data.gruMayorizarVentas ? data.gruMayorizarVentas : this.gruMayorizarVentas;
        this.gruMayorizarConsumos = data.gruMayorizarConsumos ? data.gruMayorizarConsumos : this.gruMayorizarConsumos;
        this.gruMayorizarTransferencias = data.gruMayorizarTransferencias ? data.gruMayorizarTransferencias : this.gruMayorizarTransferencias;
        this.gruMayorizarContables = data.gruMayorizarContables ? data.gruMayorizarContables : this.gruMayorizarContables;
        this.gruMayorizarContablesTalentoHumano = data.gruMayorizarContablesTalentoHumano ? data.gruMayorizarContablesTalentoHumano : this.gruMayorizarContablesTalentoHumano;
        this.gruMayorizarPresupuestos = data.gruMayorizarPresupuestos ? data.gruMayorizarPresupuestos : this.gruMayorizarPresupuestos;
        this.gruMayorizarPreliquidaciones = data.gruMayorizarPreliquidaciones ? data.gruMayorizarPreliquidaciones : this.gruMayorizarPreliquidaciones;
        this.gruMayorizarLiquidaciones = data.gruMayorizarLiquidaciones ? data.gruMayorizarLiquidaciones : this.gruMayorizarLiquidaciones;
        this.gruMayorizarProformas = data.gruMayorizarProformas ? data.gruMayorizarProformas : this.gruMayorizarProformas;


        this.gruDesmayorizarCompras = data.gruDesmayorizarCompras ? data.gruDesmayorizarCompras : this.gruDesmayorizarCompras;
        this.gruDesmayorizarVentas = data.gruDesmayorizarVentas ? data.gruDesmayorizarVentas : this.gruDesmayorizarVentas;
        this.gruDesmayorizarConsumos = data.gruDesmayorizarConsumos ? data.gruDesmayorizarConsumos : this.gruDesmayorizarConsumos;
        this.gruDesmayorizarTransferencias = data.gruDesmayorizarTransferencias ? data.gruDesmayorizarTransferencias : this.gruDesmayorizarTransferencias;
        this.gruDesmayorizarContables = data.gruDesmayorizarContables ? data.gruDesmayorizarContables : this.gruDesmayorizarContables;
        this.gruDesmayorizarContablesTalentoHumano = data.gruDesmayorizarContablesTalentoHumano ? data.gruDesmayorizarContablesTalentoHumano : this.gruDesmayorizarContablesTalentoHumano;
        this.gruDesmayorizarPresupuestos = data.gruDesmayorizarPresupuestos ? data.gruDesmayorizarPresupuestos : this.gruDesmayorizarPresupuestos;
        this.gruDesmayorizarPreliquidaciones = data.gruDesmayorizarPreliquidaciones ? data.gruDesmayorizarPreliquidaciones : this.gruDesmayorizarPreliquidaciones;
        this.gruDesmayorizarLiquidaciones = data.gruDesmayorizarLiquidaciones ? data.gruDesmayorizarLiquidaciones : this.gruDesmayorizarLiquidaciones;
        this.gruDesmayorizarProformas = data.gruDesmayorizarProformas ? data.gruDesmayorizarProformas : this.gruDesmayorizarProformas;

        this.gruAnularCompras = data.gruAnularCompras ? data.gruAnularCompras : this.gruAnularCompras;
        this.gruAnularVentas = data.gruAnularVentas ? data.gruAnularVentas : this.gruAnularVentas;
        this.gruAnularConsumos = data.gruAnularConsumos ? data.gruAnularConsumos : this.gruAnularConsumos;
        this.gruAnularTransferencias = data.gruAnularTransferencias ? data.gruAnularTransferencias : this.gruAnularTransferencias;
        this.gruAnularContables = data.gruAnularContables ? data.gruAnularContables : this.gruAnularContables;
        this.gruAnularContablesTalentoHumano = data.gruAnularContablesTalentoHumano ? data.gruAnularContablesTalentoHumano : this.gruAnularContablesTalentoHumano;
        this.gruAnularPresupuestos = data.gruAnularPresupuestos ? data.gruAnularPresupuestos : this.gruAnularPresupuestos;
        this.gruAnularPreliquidaciones = data.gruAnularPreliquidaciones ? data.gruAnularPreliquidaciones : this.gruAnularPreliquidaciones;
        this.gruAnularLiquidaciones = data.gruAnularLiquidaciones ? data.gruAnularLiquidaciones : this.gruAnularLiquidaciones;
        this.gruAnularProformas = data.gruAnularProformas ? data.gruAnularProformas : this.gruAnularProformas;

        this.gruConfigurar = data.gruConfigurar ? data.gruConfigurar : this.gruConfigurar;
        this.gruImprimir = data.gruImprimir ? data.gruImprimir : this.gruImprimir;
        this.gruExportar = data.gruExportar ? data.gruExportar : this.gruExportar;

        this.empCodigo = data.empCodigo ? data.empCodigo : this.empCodigo;
        this.usrInsertaGrupo = data.usrInsertaGrupo ? data.usrInsertaGrupo : this.usrInsertaGrupo;
        this.usrFechaInsertaGrupo = data.usrFechaInsertaGrupo ? data.usrFechaInsertaGrupo : this.usrFechaInsertaGrupo;
    }

}