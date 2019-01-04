import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectCellAtributoComponent } from './select-cell-atributo.component';

describe('SelectCellAtributoComponent', () => {
  let component: SelectCellAtributoComponent;
  let fixture: ComponentFixture<SelectCellAtributoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectCellAtributoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectCellAtributoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
