import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CobroAnticiposFormularioComponent } from './cobro-anticipos-formulario.component';

describe('CobroAnticiposFormularioComponent', () => {
  let component: CobroAnticiposFormularioComponent;
  let fixture: ComponentFixture<CobroAnticiposFormularioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CobroAnticiposFormularioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CobroAnticiposFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
