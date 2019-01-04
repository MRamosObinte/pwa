import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvisionesComponent } from './provisiones.component';

describe('ProvisionesComponent', () => {
  let component: ProvisionesComponent;
  let fixture: ComponentFixture<ProvisionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProvisionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProvisionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
