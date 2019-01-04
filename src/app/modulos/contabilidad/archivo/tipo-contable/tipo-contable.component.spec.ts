import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoContableComponent } from './tipo-contable.component';

describe('TipoContableComponent', () => {
  let component: TipoContableComponent;
  let fixture: ComponentFixture<TipoContableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipoContableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoContableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
