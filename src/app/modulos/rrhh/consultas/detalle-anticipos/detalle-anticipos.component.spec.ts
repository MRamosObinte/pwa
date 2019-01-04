import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleAnticiposComponent } from './detalle-anticipos.component';

describe('DetalleAnticiposComponent', () => {
  let component: DetalleAnticiposComponent;
  let fixture: ComponentFixture<DetalleAnticiposComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetalleAnticiposComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleAnticiposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
