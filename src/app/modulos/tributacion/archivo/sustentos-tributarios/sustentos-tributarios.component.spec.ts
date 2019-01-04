import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SustentosTributariosComponent } from './sustentos-tributarios.component';

describe('SustentosTributariosComponent', () => {
  let component: SustentosTributariosComponent;
  let fixture: ComponentFixture<SustentosTributariosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SustentosTributariosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SustentosTributariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
