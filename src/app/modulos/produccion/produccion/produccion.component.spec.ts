import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProduccionComponent } from './produccion.component';

describe('ProduccionComponent', () => {
  let component: ProduccionComponent;
  let fixture: ComponentFixture<ProduccionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProduccionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProduccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
