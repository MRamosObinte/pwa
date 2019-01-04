import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MotivoXiiiSueldoComponent } from './motivo-xiii-sueldo.component';

describe('MotivoXiiiSueldoComponent', () => {
  let component: MotivoXiiiSueldoComponent;
  let fixture: ComponentFixture<MotivoXiiiSueldoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MotivoXiiiSueldoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MotivoXiiiSueldoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
