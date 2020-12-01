import {
  Component,
  OnInit,
  Renderer2,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CoursesService } from '../../services/courses.service';
import { Subject } from '../../models/Subject';
import { CourseCode } from '../../models/CourseCode';
import { TimeTableSlot } from '../../models/TimeTableSlot';
import { CourseDetailCardsComponent } from '../course-detail-cards/course-detail-cards.component';
import { CurrentScheduleComponent } from '../current-schedule/current-schedule.component';
@Component({
  selector: 'app-subject-component',
  templateUrl: './subject-component.component.html',
  styleUrls: ['./subject-component.component.css'],
})
export class SubjectComponentComponent implements OnInit {
  @ViewChild(CourseDetailCardsComponent)
  courseDetail: CourseDetailCardsComponent;
  @ViewChild(CurrentScheduleComponent)
  currentSchedule: CurrentScheduleComponent;
  hideElement: true;
  subjects: Subject[];
  subjectCodes: Subject[];
  courseCodes: CourseCode[];
  selectedSubject: string = '';
  selectedCourseCode: string = '';
  components: string[] = ['LEC', 'TUT', 'LAB', 'ALL'];
  selectedComponent: string = '';
  timetableSlot: TimeTableSlot[];
  constructor(
    private courseService: CoursesService,
    private renderer: Renderer2,
    private element: ElementRef
  ) {}

  ngOnInit(): void {
    this.courseService.getAllSubjects().subscribe((data) => {
      this.subjects = data;
      this.subjectCodes = data;
      var seen = {};
      this.subjectCodes = this.subjectCodes.filter(function (currentObject) {
        if (currentObject.subject in seen) {
          return false;
        } else {
          seen[currentObject.subject] = true;

          return true;
        }
      });
    });
  }
  //on change event for subject code
  selectChangeHandler(event: any) {
    this.selectedSubject = event.target.value;
    console.log(this.selectedSubject);
    this.courseService.getCourseCode(this.selectedSubject).subscribe((data) => {
      this.courseCodes = data;
    });
  }
  //on change event for course_code dropdown
  selectChangeHandlerCourseCode(event: any) {
    this.selectedCourseCode = event.target.value;
    console.log(this.selectedCourseCode);
  }
  selectChangeHandlerComponent(event: any) {
    this.selectedComponent = event.target.value;
    console.log(this.selectedComponent);
  }
  searchClick() {
    console.log(this.selectedCourseCode);
    console.log(this.selectedSubject);
    console.log(this.selectedComponent);

    this.courseService
      .getTimetableSlot(
        this.selectedSubject,
        this.selectedCourseCode,
        this.selectedComponent
      )
      .subscribe((data) => {
        this.timetableSlot = data;
        this.currentSchedule.courseDetail.displayTimetableSlot(
          this.timetableSlot
        );
      });
  }
  searchAll() {
    this.courseService
      .getCourseCodeForSelectedSubject(this.selectedSubject)
      .subscribe((data) => {
        this.timetableSlot = data;
        this.currentSchedule.courseDetail.displayTimetableSlot(
          this.timetableSlot
        );
      });
  }
}
