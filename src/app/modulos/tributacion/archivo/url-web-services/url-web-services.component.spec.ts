import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UrlWebServicesComponent } from './url-web-services.component';

describe('UrlWebServicesComponent', () => {
  let component: UrlWebServicesComponent;
  let fixture: ComponentFixture<UrlWebServicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UrlWebServicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UrlWebServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
