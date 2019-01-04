export class ConFunContablesVerificacionesTO {
    public id: number = 0;
    public vcPeriodo: string = "";
    public vcTipo: string = "";
    public vcNumero: string = "";
    public vcFecha: string = "";
    public vcPendiente: boolean = false;
    public vcBloqueado: boolean = false;
    public vcAnulado: boolean = false;
    public vcDebitos: number = 0;
    public vcCreditos: number = 0;
    public vcObservaciones: string = "";

    constructor(data?) {
        data ? this.hydrate(data) : null;
    }

    hydrate(data) {
        this.id = data.id ? data.id : this.id;
        this.vcPeriodo = data.vcPeriodo ? data.vcPeriodo : this.vcPeriodo;
        this.vcTipo = data.vcTipo ? data.vcTipo : this.vcTipo;
        this.vcNumero = data.vcNumero ? data.vcNumero : this.vcNumero;
        this.vcFecha = data.vcFecha ? data.vcFecha : this.vcFecha;
        this.vcPendiente = data.vcPendiente ? data.vcPendiente : this.vcPendiente;
        this.vcBloqueado = data.vcBloqueado ? data.vcBloqueado : this.vcBloqueado;
        this.vcAnulado = data.vcAnulado ? data.vcAnulado : this.vcAnulado;
        this.vcDebitos = data.vcDebitos ? data.vcDebitos : this.vcDebitos;
        this.vcCreditos = data.vcCreditos ? data.vcCreditos : this.vcCreditos;
        this.vcObservaciones = data.vcObservaciones ? data.vcObservaciones : this.vcObservaciones;
    }

}

