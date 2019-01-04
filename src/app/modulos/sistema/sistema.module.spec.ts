import { SistemaModule } from './sistema.module';

describe('SistemaModule', () => {
  let sistemaModule: SistemaModule;

  beforeEach(() => {
    sistemaModule = new SistemaModule();
  });

  it('should create an instance', () => {
    expect(sistemaModule).toBeTruthy();
  });
});
