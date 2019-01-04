import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoChequesNumeroComponent } from './listado-cheques-numero.component';

describe('ListadoChequesNumeroComponent', () => {
  let component: ListadoChequesNumeroComponent;
  let fixture: ComponentFixture<ListadoChequesNumeroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListadoChequesNumeroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoChequesNumeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
