import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RolPagosComponent } from './rol-pagos.component';

describe('RolPagosComponent', () => {
  let component: RolPagosComponent;
  let fixture: ComponentFixture<RolPagosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RolPagosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RolPagosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
