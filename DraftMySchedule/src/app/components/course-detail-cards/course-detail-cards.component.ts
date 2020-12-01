import { Component, OnInit, Input } from '@angular/core';
import { TimeTableSlot } from '../../models/TimeTableSlot';
import { CoursesService } from '../../services/courses.service';
@Component({
  selector: 'app-course-detail-cards',
  templateUrl: './course-detail-cards.component.html',
  styleUrls: ['./course-detail-cards.component.css'],
})
export class CourseDetailCardsComponent implements OnInit {
  timetables: TimeTableSlot[];
  constructor(private courseService: CoursesService) {}

  ngOnInit(): void {}
  displayTimetableSlot(timetableSlot: TimeTableSlot[]): void {
    this.timetables = timetableSlot;
  }
  print(): void {
    console.log('hi');
  }
  addCourse(subject: string, courseCode: string): void {
    this.courseService.courseList.push({
      subject_code: subject,
      course_code: courseCode,
    });
  }
  getColor(component: string): string {
    switch (component) {
      case 'LEC':
        return '#ff9999';
      case 'TUT':
        return '#99e6ff';
      case 'LAB':
        return '#d580ff';
    }
  }
}
