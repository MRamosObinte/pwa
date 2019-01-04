import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TributacionComponent } from './tributacion.component';

describe('TributacionComponent', () => {
  let component: TributacionComponent;
  let fixture: ComponentFixture<TributacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TributacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TributacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
