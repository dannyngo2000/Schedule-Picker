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
import { UserReviewComponent } from '../user-review/user-review.component';
import { Reviews } from '../../models/Reviews';
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
  @ViewChild(UserReviewComponent)
  userReview: UserReviewComponent;
  review: string;
  reviews: Reviews[];
  courseID: string;
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
  keyword: string;
  token: string;
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
    this.token = localStorage.getItem('id_token');
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
        console.log(data);
        this.currentSchedule.courseDetail.displayTimetableSlot(
          this.timetableSlot
        );
      });
  }
  searchByClassName() {
    if (this.keyword.length < 4) {
      alert('The keyword has to be longer than 4 characters');
    } else {
      this.courseService.getByClassNameKeyword(this.keyword).subscribe(
        (data) => {
          if (data.length == 0) alert('There is no matching');
          else {
            this.timetableSlot = data;
            this.currentSchedule.courseDetail.displayTimetableSlot(
              this.timetableSlot
            );
          }
        },
        (err) => alert('The keyword does not match')
      );
    }
  }
  searchByCourseCode() {
    console.log(this.keyword);
    if (this.keyword.length < 4) {
      alert('The keyword has to be longer than 4 characters');
    } else {
      this.courseService.getByClassNumKeyword(this.keyword).subscribe(
        (data) => {
          this.timetableSlot = data;
          this.currentSchedule.courseDetail.displayTimetableSlot(
            this.timetableSlot
          );
        },
        (err) => alert('The keyword does not match')
      );
    }
  }
  addReview() {
    this.courseService
      .postReview(this.review, localStorage.getItem('username'), this.courseID)
      .subscribe((data) => alert('Added comment'));
  }
  showReview() {
    this.courseService.getReview(this.courseID).subscribe((data) => {
      console.log(data);
      this.reviews = data;
      console.log(data);
      this.userReview.displayReviews(this.reviews);
    });
  }
}
