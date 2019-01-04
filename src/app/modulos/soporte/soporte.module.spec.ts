import { SoporteModule } from './soporte.module';

describe('SoporteModule', () => {
  let soporteModule: SoporteModule;

  beforeEach(() => {
    soporteModule = new SoporteModule();
  });

  it('should create an instance', () => {
    expect(soporteModule).toBeTruthy();
  });
});
