import { BancoModule } from './banco.module';

describe('BancoModule', () => {
  let bancoModule: BancoModule;

  beforeEach(() => {
    bancoModule = new BancoModule();
  });

  it('should create an instance', () => {
    expect(bancoModule).toBeTruthy();
  });
});
