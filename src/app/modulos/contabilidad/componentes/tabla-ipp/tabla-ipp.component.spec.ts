import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaIppComponent } from './tabla-ipp.component';

describe('TablaIppComponent', () => {
  let component: TablaIppComponent;
  let fixture: ComponentFixture<TablaIppComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TablaIppComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaIppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
