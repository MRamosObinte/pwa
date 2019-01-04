import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NumeracionComponent } from './numeracion.component';

describe('NumeracionComponent', () => {
  let component: NumeracionComponent;
  let fixture: ComponentFixture<NumeracionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NumeracionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NumeracionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
