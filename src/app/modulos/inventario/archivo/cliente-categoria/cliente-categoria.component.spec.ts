import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClienteCategoriaComponent } from './cliente-categoria.component';

describe('ClienteCategoriaComponent', () => {
  let component: ClienteCategoriaComponent;
  let fixture: ComponentFixture<ClienteCategoriaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClienteCategoriaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClienteCategoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
