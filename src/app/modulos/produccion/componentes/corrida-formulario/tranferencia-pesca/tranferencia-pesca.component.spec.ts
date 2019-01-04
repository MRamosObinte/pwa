import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TranferenciaPescaComponent } from './tranferencia-pesca.component';

describe('TranferenciaPescaComponent', () => {
  let component: TranferenciaPescaComponent;
  let fixture: ComponentFixture<TranferenciaPescaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TranferenciaPescaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TranferenciaPescaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
