import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AtajosComponent } from './atajos.component';

describe('AtajosComponent', () => {
  let component: AtajosComponent;
  let fixture: ComponentFixture<AtajosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AtajosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtajosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
