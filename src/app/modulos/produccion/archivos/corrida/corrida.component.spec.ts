import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CorridaComponent } from './corrida.component';

describe('CorridaComponent', () => {
  let component: CorridaComponent;
  let fixture: ComponentFixture<CorridaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CorridaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CorridaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
