import { ActivofijoModule } from './activofijo.module';

describe('ActivofijoModule', () => {
  let activofijoModule: ActivofijoModule;

  beforeEach(() => {
    activofijoModule = new ActivofijoModule();
  });

  it('should create an instance', () => {
    expect(activofijoModule).toBeTruthy();
  });
});
