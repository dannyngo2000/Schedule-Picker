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
  ngOnInit(): void {
    this.courseService
      .getAllSchedules()
      .subscribe((data) => (this.scheduleLists = data));
    console.log('Hi');
  }

  selectSchedule(): void {
    this.scheduleName = this.scheduleDropdown.split(' -')[0].slice(5);
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
  deleteAllSchedule() {
    this.courseService.deleteAllSchedule().subscribe((data) => {
      alert('All schedules are deleted');
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
  updateSchedule() {
    this.courseService
      .getCurrentSchedule(this.scheduleName)
      .subscribe((data) => {
        this.currentSchedules = data;
        for (let currentSchedule of this.currentSchedules) {
          this.courseService.courseList.push(currentSchedule);
        }
        this.courseService
          .updateCourseInSchedule(
            this.scheduleName,
            this.courseService.courseList
          )
          .subscribe((data) => {
            console.log(data);
            this.courseService.updateScheduleList();
            this.scheduleName = '';
          });
      });

    console.log(this.courseService.courseList);
  }
}
