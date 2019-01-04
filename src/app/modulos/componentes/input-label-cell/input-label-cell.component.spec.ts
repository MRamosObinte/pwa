import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputLabelCellComponent } from './input-label-cell.component';

describe('InputLabelCellComponent', () => {
  let component: InputLabelCellComponent;
  let fixture: ComponentFixture<InputLabelCellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputLabelCellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputLabelCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
