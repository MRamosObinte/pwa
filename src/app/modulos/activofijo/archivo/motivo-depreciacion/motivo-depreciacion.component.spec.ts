import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MotivoDepreciacionComponent } from './motivo-depreciacion.component';

describe('MotivoDepreciacionComponent', () => {
  let component: MotivoDepreciacionComponent;
  let fixture: ComponentFixture<MotivoDepreciacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MotivoDepreciacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MotivoDepreciacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
