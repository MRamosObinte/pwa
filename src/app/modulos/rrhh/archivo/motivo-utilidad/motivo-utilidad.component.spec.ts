import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MotivoUtilidadComponent } from './motivo-utilidad.component';

describe('MotivoUtilidadComponent', () => {
  let component: MotivoUtilidadComponent;
  let fixture: ComponentFixture<MotivoUtilidadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MotivoUtilidadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MotivoUtilidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
