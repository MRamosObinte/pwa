import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PinnedCellComponent } from './pinned-cell.component';

describe('PinnedCellComponent', () => {
  let component: PinnedCellComponent;
  let fixture: ComponentFixture<PinnedCellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PinnedCellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PinnedCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
