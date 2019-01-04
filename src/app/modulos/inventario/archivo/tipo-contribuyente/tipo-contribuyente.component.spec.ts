import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoContribuyenteComponent } from './tipo-contribuyente.component';

describe('TipoContribuyenteComponent', () => {
  let component: TipoContribuyenteComponent;
  let fixture: ComponentFixture<TipoContribuyenteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipoContribuyenteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoContribuyenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
