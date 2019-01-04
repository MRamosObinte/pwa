import { PedidosModule } from './pedidos.module';

describe('PedidosModule', () => {
  let pedidosModule: PedidosModule;

  beforeEach(() => {
    pedidosModule = new PedidosModule();
  });

  it('should create an instance', () => {
    expect(pedidosModule).toBeTruthy();
  });
});
