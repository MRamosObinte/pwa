import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteListadoComponent } from './cliente-listado.component';

describe('ClienteListadoComponent', () => {
  let component: ClienteListadoComponent;
  let fixture: ComponentFixture<ClienteListadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClienteListadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClienteListadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
