import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TallaPescaComponent } from './talla-pesca.component';

describe('TallaPescaComponent', () => {
  let component: TallaPescaComponent;
  let fixture: ComponentFixture<TallaPescaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TallaPescaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TallaPescaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
