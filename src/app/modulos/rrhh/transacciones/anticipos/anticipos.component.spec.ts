import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnticiposComponent } from './anticipos.component';

describe('AnticiposComponent', () => {
  let component: AnticiposComponent;
  let fixture: ComponentFixture<AnticiposComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnticiposComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnticiposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
