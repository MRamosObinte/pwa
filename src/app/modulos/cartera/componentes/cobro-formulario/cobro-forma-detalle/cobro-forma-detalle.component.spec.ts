import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CobroFormaDetalleComponent } from './cobro-forma-detalle.component';

describe('CobroFormaDetalleComponent', () => {
  let component: CobroFormaDetalleComponent;
  let fixture: ComponentFixture<CobroFormaDetalleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CobroFormaDetalleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CobroFormaDetalleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
