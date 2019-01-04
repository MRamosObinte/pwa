import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CorridaListadoComponent } from './corrida-listado.component';

describe('CorridaListadoComponent', () => {
  let component: CorridaListadoComponent;
  let fixture: ComponentFixture<CorridaListadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CorridaListadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorridaListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
