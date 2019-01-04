import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MotivoAnticiposComponent } from './motivo-anticipos.component';

describe('MotivoAnticiposComponent', () => {
  let component: MotivoAnticiposComponent;
  let fixture: ComponentFixture<MotivoAnticiposComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MotivoAnticiposComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MotivoAnticiposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
