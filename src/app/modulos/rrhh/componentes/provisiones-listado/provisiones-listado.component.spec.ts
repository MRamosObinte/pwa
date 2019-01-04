import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvisionesListadoComponent } from './provisiones-listado.component';

describe('ProvisionesListadoComponent', () => {
  let component: ProvisionesListadoComponent;
  let fixture: ComponentFixture<ProvisionesListadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProvisionesListadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProvisionesListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
