import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnticipoClienteSaldoGeneralComponent } from './anticipo-cliente-saldo-general.component';

describe('AnticipoClienteSaldoGeneralComponent', () => {
  let component: AnticipoClienteSaldoGeneralComponent;
  let fixture: ComponentFixture<AnticipoClienteSaldoGeneralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnticipoClienteSaldoGeneralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnticipoClienteSaldoGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
