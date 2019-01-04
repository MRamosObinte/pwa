import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DistribucionesComponent } from './distribuciones.component';

describe('DistribucionesComponent', () => {
  let component: DistribucionesComponent;
  let fixture: ComponentFixture<DistribucionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DistribucionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DistribucionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
