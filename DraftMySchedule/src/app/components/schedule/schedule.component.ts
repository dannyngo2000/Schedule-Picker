import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { from } from 'rxjs';
import { CoursesService } from '../../services/courses.service';
import { CurrentScheduleComponent } from '../current-schedule/current-schedule.component';
import { AuthService } from '../../services/auth.service';
import { ScheduleList } from 'src/app/models/ScheduleList';
@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css'],
})
export class ScheduleComponent implements OnInit {
  @ViewChild(CurrentScheduleComponent)
  selectedScheduleComponent: CurrentScheduleComponent;
  constructor(
    private courseService: CoursesService,
    public authService: AuthService
  ) {}
  scheduleName: string = '';
  numberOfSchedule: ScheduleList[];
  token: string;
  ngOnInit(): void {
    this.token = localStorage.getItem('id_token');
  }
  createSchedule() {
    let status = 'private';
    let num = 0;
    let move = 0;
    this.courseService
      .getAllFromAuthorSchedules(localStorage.getItem('username'))
      .subscribe((data) => {
        num = data.length;
        console.log(num);
        if (num > 19) alert('You can only have 20 schedules');
        else {
          console.log(this.scheduleName);
          this.courseService
            .createNewSchedule(
              this.scheduleName,
              localStorage.getItem('username').toString(),
              this.authService.authToken,
              'Private'
            )
            .subscribe(
              (data) => {
                alert(`Added ` + this.scheduleName);
                this.courseService.updateScheduleList();
                this.scheduleName = '';
              },
              (err) => console.log(err)
            );
        }
      });

    if (this.scheduleName == '') alert('Please enter a schedule name');
  }
}
