import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CobrosAnticiposComponent } from './cobros-anticipos.component';

describe('CobrosAnticiposComponent', () => {
  let component: CobrosAnticiposComponent;
  let fixture: ComponentFixture<CobrosAnticiposComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CobrosAnticiposComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CobrosAnticiposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
