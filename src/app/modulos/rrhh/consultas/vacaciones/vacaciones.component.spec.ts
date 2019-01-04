import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VacacionesComponent } from './vacaciones.component';

describe('VacacionesComponent', () => {
  let component: VacacionesComponent;
  let fixture: ComponentFixture<VacacionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VacacionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VacacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
