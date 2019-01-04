import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubirImagenesComponent } from './subir-imagenes.component';

describe('SubirImagenesComponent', () => {
  let component: SubirImagenesComponent;
  let fixture: ComponentFixture<SubirImagenesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubirImagenesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubirImagenesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
