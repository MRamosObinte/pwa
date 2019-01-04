import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumenEconomicoSiembraComponent } from './resumen-economico-siembra.component';

describe('ResumenEconomicoSiembraComponent', () => {
  let component: ResumenEconomicoSiembraComponent;
  let fixture: ComponentFixture<ResumenEconomicoSiembraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResumenEconomicoSiembraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumenEconomicoSiembraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
