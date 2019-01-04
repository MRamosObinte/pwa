import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MotivoComprasComponent } from './motivo-compras.component';

describe('MotivoComprasComponent', () => {
  let component: MotivoComprasComponent;
  let fixture: ComponentFixture<MotivoComprasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MotivoComprasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MotivoComprasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
