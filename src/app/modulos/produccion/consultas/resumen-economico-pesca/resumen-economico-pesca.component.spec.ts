import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumenEconomicoPescaComponent } from './resumen-economico-pesca.component';

describe('ResumenEconomicoPescaComponent', () => {
  let component: ResumenEconomicoPescaComponent;
  let fixture: ComponentFixture<ResumenEconomicoPescaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResumenEconomicoPescaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumenEconomicoPescaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
