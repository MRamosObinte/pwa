import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumenSiembraComponent } from './resumen-siembra.component';

describe('ResumenSiembraComponent', () => {
  let component: ResumenSiembraComponent;
  let fixture: ComponentFixture<ResumenSiembraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResumenSiembraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumenSiembraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
