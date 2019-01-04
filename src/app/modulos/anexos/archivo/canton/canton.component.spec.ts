import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CantonComponent } from './canton.component';

describe('CantonComponent', () => {
  let component: CantonComponent;
  let fixture: ComponentFixture<CantonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CantonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CantonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
