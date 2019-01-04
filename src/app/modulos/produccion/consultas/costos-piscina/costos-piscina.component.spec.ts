import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CostosPiscinaComponent } from './costos-piscina.component';

describe('CostosPiscinaComponent', () => {
  let component: CostosPiscinaComponent;
  let fixture: ComponentFixture<CostosPiscinaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CostosPiscinaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CostosPiscinaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
