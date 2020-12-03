import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CoursesService } from '../../services/courses.service';
import { ScheduleList } from '../../models/ScheduleList';
import { CourseDetailCardsComponent } from '../course-detail-cards/course-detail-cards.component';
import { TimeTableSlot } from '../../models/TimeTableSlot';
import { ScheduleCourse } from '../../models/ScheduleCourse';
@Component({
  selector: 'app-current-schedule',
  templateUrl: './current-schedule.component.html',
  styleUrls: ['./current-schedule.component.css'],
})
export class CurrentScheduleComponent implements OnInit {
  @ViewChild(CourseDetailCardsComponent)
  courseDetail: CourseDetailCardsComponent;
  constructor(private courseService: CoursesService) {}
  scheduleListUpdate$ = this.courseService.scheduleUpdateStream$;
  scheduleCourses: ScheduleCourse[];
  scheduleLists: ScheduleList[];
  scheduleName: string = '';
  scheduleDropdown: string = '';
  timetables: TimeTableSlot[] = [];
  currentSlot: TimeTableSlot;
  currentSchedules: ScheduleCourse[];
  currentCourse: ScheduleCourse;
  review: string;
  ngOnInit(): void {}

  selectSchedule(): void {
    this.scheduleName = this.scheduleDropdown.split(' -')[0].slice(14);
    this.courseService.courseList = [];
    this.courseService.count = 1;
    console.log(this.scheduleName);
  }
  selectChangeHandlerSchedule(event: any) {
    this.scheduleDropdown = event.target.value;
    this.courseService.count = 0;
    this.scheduleName = '';
  }
  deleteCurrentSchedule() {
    console.log('Hi');
    this.courseService
      .deleteSelectedSchedule(this.scheduleName)
      .subscribe((data) => {
        console.log(data);
        this.courseService.updateScheduleList();
      });
    this.scheduleName = '';
  }

  display() {
    this.timetables = [];
    this.courseService
      .getCurrentSchedule(this.scheduleName)
      .subscribe((data) => {
        this.scheduleCourses = data;
        for (let scheduleCourse of this.scheduleCourses) {
          this.courseService
            .getTimetableSlot(
              scheduleCourse.subject_code,
              scheduleCourse.course_code,
              'ALL'
            )
            .subscribe((data) => {
              this.currentSlot = data[0];
              this.timetables.push(this.currentSlot);
            });
        }
      });

    this.courseDetail.displayTimetableSlot(this.timetables);
  }
  getTime = function () {
    var currentDate = new Date();
    var dateTime =
      currentDate.getDate() +
      '/' +
      (currentDate.getMonth() + 1) +
      '/' +
      currentDate.getFullYear() +
      ' @ ' +
      currentDate.getHours() +
      ':' +
      currentDate.getMinutes() +
      ':' +
      currentDate.getSeconds();
    return dateTime;
  };

  updateSchedule() {
    console.log(this.courseService.courseList);
    this.courseService
      .getCurrentSchedule(this.scheduleName)
      .subscribe(async (data) => {
        this.currentSchedules = data;
        {
          this.currentSchedules[2].time = this.getTime();
          for (let course of this.courseService.courseList) {
            this.currentSchedules.push(course);
          }
        }
        let length = this.courseService.courseList.length;
        console.log(length);
        /**    for (let i = 0; i < length - 3; i++) {
          this.courseService.courseList.push(
            this.courseService.courseList.shift()
          ); 
        } **/

        this.courseService
          .updateCourseInSchedule(this.scheduleName, this.currentSchedules)
          .subscribe(async (data) => {
            console.log(data);
            this.courseService.updateScheduleList();
            this.scheduleName = '';
          });
      });

    console.log(this.courseService.courseList);
  }
  addReview() {}
}
