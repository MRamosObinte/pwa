import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivoBancoComponent } from './banco.component';

describe('ArchivoBancoComponent', () => {
  let component: ArchivoBancoComponent;
  let fixture: ComponentFixture<ArchivoBancoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArchivoBancoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchivoBancoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
