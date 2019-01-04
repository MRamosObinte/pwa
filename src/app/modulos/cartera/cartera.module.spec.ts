import { CarteraModule } from './cartera.module';

describe('CarteraModule', () => {
  let carteraModule: CarteraModule;

  beforeEach(() => {
    carteraModule = new CarteraModule();
  });

  it('should create an instance', () => {
    expect(carteraModule).toBeTruthy();
  });
});
