import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MotivoXivSueldoComponent } from './motivo-xiv-sueldo.component';

describe('MotivoXivSueldoComponent', () => {
  let component: MotivoXivSueldoComponent;
  let fixture: ComponentFixture<MotivoXivSueldoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MotivoXivSueldoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MotivoXivSueldoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
