import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XiiiSueldoComponent } from './xiii-sueldo.component';

describe('XiiiSueldoComponent', () => {
  let component: XiiiSueldoComponent;
  let fixture: ComponentFixture<XiiiSueldoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XiiiSueldoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XiiiSueldoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
