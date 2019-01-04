import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultarValoresComponent } from './consultar-valores.component';

describe('ConsultarValoresComponent', () => {
  let component: ConsultarValoresComponent;
  let fixture: ComponentFixture<ConsultarValoresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultarValoresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultarValoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
