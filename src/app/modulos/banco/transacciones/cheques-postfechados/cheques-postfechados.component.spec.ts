import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChequesPostfechadosComponent } from './cheques-postfechados.component';

describe('ChequesPostfechadosComponent', () => {
  let component: ChequesPostfechadosComponent;
  let fixture: ComponentFixture<ChequesPostfechadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChequesPostfechadosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChequesPostfechadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
