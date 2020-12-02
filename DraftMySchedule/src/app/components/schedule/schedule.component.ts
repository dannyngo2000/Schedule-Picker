import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { from } from 'rxjs';
import { CoursesService } from '../../services/courses.service';
import { CurrentScheduleComponent } from '../current-schedule/current-schedule.component';
import { AuthService } from '../../services/auth.service';
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
  token: string;
  ngOnInit(): void {
    this.token = localStorage.getItem('id_token');
  }
  createSchedule() {
    let status = 'private';
    if (this.scheduleName == '') alert('Please enter a schedule name');
    else {
      this.courseService
        .createNewSchedule(
          this.scheduleName,
          localStorage.getItem('username').toString(),
          this.authService.authToken,
          status
        )
        .subscribe(
          (data) => {
            alert(`Added ` + this.scheduleName);
            this.courseService.updateScheduleList();
          },
          (err) => alert('This schedule name is already existed')
        );

      this.scheduleName = '';
    }
  }
}
