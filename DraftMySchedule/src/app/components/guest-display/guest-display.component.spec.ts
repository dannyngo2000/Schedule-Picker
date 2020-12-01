import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestDisplayComponent } from './guest-display.component';

describe('GuestDisplayComponent', () => {
  let component: GuestDisplayComponent;
  let fixture: ComponentFixture<GuestDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuestDisplayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GuestDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
