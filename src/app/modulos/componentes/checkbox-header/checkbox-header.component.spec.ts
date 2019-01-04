import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckboxHeaderComponent } from './checkbox-header.component';

describe('CheckboxHeaderComponent', () => {
  let component: CheckboxHeaderComponent;
  let fixture: ComponentFixture<CheckboxHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckboxHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckboxHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
