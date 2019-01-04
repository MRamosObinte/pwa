import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagosAnticiposComponent } from './pagos-anticipos.component';

describe('PagosAnticiposComponent', () => {
  let component: PagosAnticiposComponent;
  let fixture: ComponentFixture<PagosAnticiposComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PagosAnticiposComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagosAnticiposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
