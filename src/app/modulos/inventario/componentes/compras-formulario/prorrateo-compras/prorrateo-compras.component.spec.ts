import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProrrateoComprasComponent } from './prorrateo-compras.component';

describe('ProrrateoComprasComponent', () => {
  let component: ProrrateoComprasComponent;
  let fixture: ComponentFixture<ProrrateoComprasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProrrateoComprasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProrrateoComprasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
