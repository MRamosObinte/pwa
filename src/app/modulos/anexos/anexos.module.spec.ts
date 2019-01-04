import { AnexosModule } from './anexos.module';

describe('AnexosModule', () => {
  let anexosModule: AnexosModule;

  beforeEach(() => {
    anexosModule = new AnexosModule();
  });

  it('should create an instance', () => {
    expect(anexosModule).toBeTruthy();
  });
});
