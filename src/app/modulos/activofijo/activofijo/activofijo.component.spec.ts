import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivofijoComponent } from './activofijo.component';

describe('ActivofijoComponent', () => {
  let component: ActivofijoComponent;
  let fixture: ComponentFixture<ActivofijoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivofijoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivofijoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
