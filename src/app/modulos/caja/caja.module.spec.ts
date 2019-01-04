import { CajaModule } from './caja.module';

describe('CajaModule', () => {
  let cajaModule: CajaModule;

  beforeEach(() => {
    cajaModule = new CajaModule();
  });

  it('should create an instance', () => {
    expect(cajaModule).toBeTruthy();
  });
});
