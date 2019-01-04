import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoChequesCobrarComponent } from './listado-cheques-cobrar.component';

describe('ListadoChequesCobrarComponent', () => {
  let component: ListadoChequesCobrarComponent;
  let fixture: ComponentFixture<ListadoChequesCobrarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListadoChequesCobrarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoChequesCobrarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
