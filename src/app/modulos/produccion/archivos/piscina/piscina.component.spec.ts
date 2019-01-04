import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PiscinaComponent } from './piscina.component';

describe('PiscinaComponent', () => {
  let component: PiscinaComponent;
  let fixture: ComponentFixture<PiscinaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PiscinaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PiscinaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
