import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrameajeComponent } from './grameaje.component';

describe('GrameajeComponent', () => {
  let component: GrameajeComponent;
  let fixture: ComponentFixture<GrameajeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrameajeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrameajeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
