import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopOverInformacionComponent } from './pop-over-informacion.component';

describe('PopOverInformacionComponent', () => {
  let component: PopOverInformacionComponent;
  let fixture: ComponentFixture<PopOverInformacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopOverInformacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopOverInformacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
