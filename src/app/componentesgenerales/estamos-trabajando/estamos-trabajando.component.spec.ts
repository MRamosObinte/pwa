import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EstamosTrabajandoComponent } from './estamos-trabajando.component';

describe('EstamosTrabajandoComponent', () => {
  let component: EstamosTrabajandoComponent;
  let fixture: ComponentFixture<EstamosTrabajandoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EstamosTrabajandoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstamosTrabajandoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
