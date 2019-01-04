import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnticiposFormularioComponent } from './anticipos-formulario.component';

describe('AnticiposFormularioComponent', () => {
  let component: AnticiposFormularioComponent;
  let fixture: ComponentFixture<AnticiposFormularioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnticiposFormularioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnticiposFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
