import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContableListadoComponent } from './contable-listado.component';

describe('ContableListadoComponent', () => {
  let component: ContableListadoComponent;
  let fixture: ComponentFixture<ContableListadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContableListadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContableListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
