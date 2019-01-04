import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContabilizarMaterialIndirectoComponent } from './contabilizar-material-indirecto.component';

describe('ContabilizarMaterialIndirectoComponent', () => {
  let component: ContabilizarMaterialIndirectoComponent;
  let fixture: ComponentFixture<ContabilizarMaterialIndirectoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContabilizarMaterialIndirectoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContabilizarMaterialIndirectoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
