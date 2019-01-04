import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BodegaComponent } from './bodega.component';

describe('BodegaComponent', () => {
  let component: BodegaComponent;
  let fixture: ComponentFixture<BodegaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BodegaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BodegaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
