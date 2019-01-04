import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContabilizarTodoProcesoComponent } from './contabilizar-todo-proceso.component';

describe('ContabilizarTodoProcesoComponent', () => {
  let component: ContabilizarTodoProcesoComponent;
  let fixture: ComponentFixture<ContabilizarTodoProcesoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContabilizarTodoProcesoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContabilizarTodoProcesoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
