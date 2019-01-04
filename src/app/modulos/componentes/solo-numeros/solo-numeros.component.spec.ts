import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoloNumerosComponent } from './solo-numeros.component';

describe('SoloNumerosComponent', () => {
  let component: SoloNumerosComponent;
  let fixture: ComponentFixture<SoloNumerosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SoloNumerosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoloNumerosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
