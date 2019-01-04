import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckCellComponent } from './check-cell.component';

describe('CheckCellComponent', () => {
  let component: CheckCellComponent;
  let fixture: ComponentFixture<CheckCellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckCellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
