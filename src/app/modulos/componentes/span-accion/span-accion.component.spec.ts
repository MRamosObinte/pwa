import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpanAccionComponent } from './span-accion.component';

describe('SpanAccionComponent', () => {
  let component: SpanAccionComponent;
  let fixture: ComponentFixture<SpanAccionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpanAccionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpanAccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
