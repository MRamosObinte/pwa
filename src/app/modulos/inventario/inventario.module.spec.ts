import { InventarioModule } from './inventario.module';

describe('InventarioModule', () => {
  let inventarioModule: InventarioModule;

  beforeEach(() => {
    inventarioModule = new InventarioModule();
  });

  it('should create an instance', () => {
    expect(inventarioModule).toBeTruthy();
  });
});
