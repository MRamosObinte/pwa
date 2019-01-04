import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipacionUtilidadesComponent } from './participacion-utilidades.component';

describe('ParticipacionUtilidadesComponent', () => {
  let component: ParticipacionUtilidadesComponent;
  let fixture: ComponentFixture<ParticipacionUtilidadesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParticipacionUtilidadesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParticipacionUtilidadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
