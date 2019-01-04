import { ContabilidadModule } from './contabilidad.module';

describe('ContabilidadModule', () => {
  let contabilidadModule: ContabilidadModule;

  beforeEach(() => {
    contabilidadModule = new ContabilidadModule();
  });

  it('should create an instance', () => {
    expect(contabilidadModule).toBeTruthy();
  });
});
