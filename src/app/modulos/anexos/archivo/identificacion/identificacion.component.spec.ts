import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdentificacionComponent } from './identificacion.component';

describe('IdentificacionComponent', () => {
  let component: IdentificacionComponent;
  let fixture: ComponentFixture<IdentificacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IdentificacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdentificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
