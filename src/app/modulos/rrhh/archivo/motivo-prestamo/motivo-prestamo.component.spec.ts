import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MotivoPrestamoComponent } from './motivo-prestamo.component';

describe('MotivoPrestamoComponent', () => {
  let component: MotivoPrestamoComponent;
  let fixture: ComponentFixture<MotivoPrestamoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MotivoPrestamoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MotivoPrestamoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
