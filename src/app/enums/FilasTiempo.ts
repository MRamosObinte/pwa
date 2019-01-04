export class FilasTiempo {

    public filas: number = 0;
    private tiempoInicio: number = 0;
    private tiempoFinal: number = 0;
    private tiempoDiferencia: number = 0;

    public setFilas(filas: number) {
        this.filas = filas;
    }

    public getFilas():number {
        return this.filas;
    }

    public iniciarContador() {
        this.tiempoInicio = new Date().getTime();
    }

    public finalizarContador() {
        this.tiempoFinal = new Date().getTime();
        this.tiempoDiferencia = (this.tiempoFinal - this.tiempoInicio) / 1000;
    }

    public getTiempo(): number {
        return this.tiempoDiferencia;
    }

    public resetearContador() {
        this.tiempoInicio = 0;
        this.tiempoFinal = 0;
        this.tiempoDiferencia = 0;
        this.filas = 0;
    }
}