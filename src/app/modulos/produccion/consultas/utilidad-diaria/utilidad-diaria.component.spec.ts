import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UtilidadDiariaComponent } from './utilidad-diaria.component';

describe('UtilidadDiariaComponent', () => {
  let component: UtilidadDiariaComponent;
  let fixture: ComponentFixture<UtilidadDiariaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UtilidadDiariaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UtilidadDiariaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
