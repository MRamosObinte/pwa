import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormaCobroComponent } from './forma-cobro.component';

describe('FormaCobroComponent', () => {
  let component: FormaCobroComponent;
  let fixture: ComponentFixture<FormaCobroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormaCobroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormaCobroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
