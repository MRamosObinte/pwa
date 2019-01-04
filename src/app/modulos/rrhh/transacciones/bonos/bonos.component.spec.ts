import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BonosComponent } from './bonos.component';

describe('BonosComponent', () => {
  let component: BonosComponent;
  let fixture: ComponentFixture<BonosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BonosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BonosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
