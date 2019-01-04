import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KardexValorizadoComponent } from './kardex-valorizado.component';

describe('KardexValorizadoComponent', () => {
  let component: KardexValorizadoComponent;
  let fixture: ComponentFixture<KardexValorizadoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KardexValorizadoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KardexValorizadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
