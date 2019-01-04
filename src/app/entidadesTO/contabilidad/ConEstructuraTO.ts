export class ConEstructuraTO {

  public empCodigo: string = "";
  public estGrupo1: number = 0;
  public estGrupo2: number = 0;
  public estGrupo3: number = 0;
  public estGrupo4: number = 0;
  public estGrupo5: number = 0; 
  public estGrupo6: number = 0;

  constructor(data?) {
    data ? this.hydrate(data) : null;
  }

  hydrate(data) {
    this.empCodigo = data.empCodigo ? data.empCodigo : this.empCodigo;
    this.estGrupo1 = data.estGrupo1 ? data.estGrupo1 : this.estGrupo1;
    this.estGrupo2 = data.estGrupo2 ? data.estGrupo2 : this.estGrupo2;
    this.estGrupo3 = data.estGrupo3 ? data.estGrupo3 : this.estGrupo3;
    this.estGrupo4 = data.estGrupo4 ? data.estGrupo4 : this.estGrupo4;
    this.estGrupo5 = data.estGrupo5 ? data.estGrupo5 : this.estGrupo5;
    this.estGrupo6 = data.estGrupo6 ? data.estGrupo6 : this.estGrupo6;
  }

}
