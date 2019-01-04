import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallePrestamosComponent } from './detalle-prestamos.component';

describe('DetallePrestamosComponent', () => {
  let component: DetallePrestamosComponent;
  let fixture: ComponentFixture<DetallePrestamosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetallePrestamosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetallePrestamosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
