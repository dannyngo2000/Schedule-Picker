import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseDetailCardsComponent } from './course-detail-cards.component';

describe('CourseDetailCardsComponent', () => {
  let component: CourseDetailCardsComponent;
  let fixture: ComponentFixture<CourseDetailCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CourseDetailCardsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseDetailCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
