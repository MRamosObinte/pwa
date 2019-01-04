import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CodigoBarrasComponent } from './codigo-barras.component';

describe('CodigoBarrasComponent', () => {
  let component: CodigoBarrasComponent;
  let fixture: ComponentFixture<CodigoBarrasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CodigoBarrasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodigoBarrasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
