import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CostosPiscinaMultipleComponent } from './costos-piscina-multiple.component';

describe('CostosPiscinaMultipleComponent', () => {
  let component: CostosPiscinaMultipleComponent;
  let fixture: ComponentFixture<CostosPiscinaMultipleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CostosPiscinaMultipleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CostosPiscinaMultipleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
