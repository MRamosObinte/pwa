import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SectorFormularioComponent } from './sector-formulario.component';

describe('SectorFormularioComponent', () => {
  let component: SectorFormularioComponent;
  let fixture: ComponentFixture<SectorFormularioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SectorFormularioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SectorFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
