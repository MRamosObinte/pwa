import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrupoEmpresarialComponent } from './grupo-empresarial.component';

describe('GrupoEmpresarialComponent', () => {
  let component: GrupoEmpresarialComponent;
  let fixture: ComponentFixture<GrupoEmpresarialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrupoEmpresarialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrupoEmpresarialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
