import { DirectivasModule } from './directivas.module';

describe('DirectivasModule', () => {
  let directivasModule: DirectivasModule;

  beforeEach(() => {
    directivasModule = new DirectivasModule();
  });

  it('should create an instance', () => {
    expect(directivasModule).toBeTruthy();
  });
});
