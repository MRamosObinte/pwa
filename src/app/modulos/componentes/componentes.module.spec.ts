import { ComponentesModule } from './componentes.module';

describe('ComponentesModule', () => {
  let componentesModule: ComponentesModule;

  beforeEach(() => {
    componentesModule = new ComponentesModule();
  });

  it('should create an instance', () => {
    expect(componentesModule).toBeTruthy();
  });
});
