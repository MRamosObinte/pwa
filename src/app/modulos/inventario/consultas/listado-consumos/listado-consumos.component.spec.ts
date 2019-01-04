import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadoConsumosComponent } from './listado-consumos.component';

describe('ListadoConsumosComponent', () => {
  let component: ListadoConsumosComponent;
  let fixture: ComponentFixture<ListadoConsumosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListadoConsumosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListadoConsumosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
