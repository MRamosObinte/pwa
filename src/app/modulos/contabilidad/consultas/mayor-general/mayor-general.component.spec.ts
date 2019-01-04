import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MayorGeneralComponent } from './mayor-general.component';

describe('MayorGeneralComponent', () => {
  let component: MayorGeneralComponent;
  let fixture: ComponentFixture<MayorGeneralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MayorGeneralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MayorGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
