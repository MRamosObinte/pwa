import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizadorImagenesComponent } from './visualizador-imagenes.component';

describe('VisualizadorImagenesComponent', () => {
  let component: VisualizadorImagenesComponent;
  let fixture: ComponentFixture<VisualizadorImagenesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisualizadorImagenesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualizadorImagenesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
