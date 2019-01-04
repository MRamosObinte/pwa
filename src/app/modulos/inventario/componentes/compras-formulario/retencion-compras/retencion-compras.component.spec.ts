import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetencionComprasComponent } from './retencion-compras.component';

describe('RetencionComprasComponent', () => {
  let component: RetencionComprasComponent;
  let fixture: ComponentFixture<RetencionComprasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetencionComprasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetencionComprasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
