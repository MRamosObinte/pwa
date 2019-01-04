import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SustentoComponent } from './sustento.component';

describe('SustentoComponent', () => {
  let component: SustentoComponent;
  let fixture: ComponentFixture<SustentoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SustentoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SustentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
