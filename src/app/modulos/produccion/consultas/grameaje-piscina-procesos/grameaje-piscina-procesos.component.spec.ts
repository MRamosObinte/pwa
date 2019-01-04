import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrameajePiscinaProcesosComponent } from './grameaje-piscina-procesos.component';

describe('GrameajePiscinaProcesosComponent', () => {
  let component: GrameajePiscinaProcesosComponent;
  let fixture: ComponentFixture<GrameajePiscinaProcesosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrameajePiscinaProcesosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrameajePiscinaProcesosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
