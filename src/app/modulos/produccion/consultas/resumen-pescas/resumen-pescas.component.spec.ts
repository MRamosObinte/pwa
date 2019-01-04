import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumenPescasComponent } from './resumen-pescas.component';

describe('ResumenPescasComponent', () => {
  let component: ResumenPescasComponent;
  let fixture: ComponentFixture<ResumenPescasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResumenPescasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumenPescasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
