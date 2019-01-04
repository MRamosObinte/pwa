import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UbicacionComponent } from './ubicacion.component';

describe('UbicacionComponent', () => {
  let component: UbicacionComponent;
  let fixture: ComponentFixture<UbicacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UbicacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UbicacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
