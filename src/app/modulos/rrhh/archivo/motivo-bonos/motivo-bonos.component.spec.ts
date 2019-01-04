import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MotivoBonosComponent } from './motivo-bonos.component';

describe('MotivoBonosComponent', () => {
  let component: MotivoBonosComponent;
  let fixture: ComponentFixture<MotivoBonosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MotivoBonosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MotivoBonosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
