import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContabilizarMaterialDirectoComponent } from './contabilizar-material-directo.component';

describe('ContabilizarMaterialDirectoComponent', () => {
  let component: ContabilizarMaterialDirectoComponent;
  let fixture: ComponentFixture<ContabilizarMaterialDirectoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContabilizarMaterialDirectoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContabilizarMaterialDirectoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
