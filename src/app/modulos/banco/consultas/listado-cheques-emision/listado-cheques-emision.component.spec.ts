import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoChequesEmisionComponent } from './listado-cheques-emision.component';

describe('ListadoChequesEmisionComponent', () => {
  let component: ListadoChequesEmisionComponent;
  let fixture: ComponentFixture<ListadoChequesEmisionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListadoChequesEmisionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoChequesEmisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
