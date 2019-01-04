import { ProduccionModule } from './produccion.module';

describe('ProduccionModule', () => {
  let produccionModule: ProduccionModule;

  beforeEach(() => {
    produccionModule = new ProduccionModule();
  });

  it('should create an instance', () => {
    expect(produccionModule).toBeTruthy();
  });
});
