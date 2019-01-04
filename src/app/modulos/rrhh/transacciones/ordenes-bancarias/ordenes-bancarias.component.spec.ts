import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdenesBancariasComponent } from './ordenes-bancarias.component';

describe('OrdenesBancariasComponent', () => {
  let component: OrdenesBancariasComponent;
  let fixture: ComponentFixture<OrdenesBancariasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdenesBancariasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdenesBancariasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
