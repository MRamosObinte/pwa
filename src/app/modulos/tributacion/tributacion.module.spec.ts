import { TributacionModule } from './tributacion.module';

describe('TributacionModule', () => {
  let tributacionModule: TributacionModule;

  beforeEach(() => {
    tributacionModule = new TributacionModule();
  });

  it('should create an instance', () => {
    expect(tributacionModule).toBeTruthy();
  });
});
