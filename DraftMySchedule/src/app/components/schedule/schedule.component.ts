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
  ngOnInit(): void {
    console.log(this.authService.authToken);
  }
  createSchedule() {
    if (this.scheduleName == '') alert('Please enter a schedule name');
    this.courseService.createNewSchedule(this.scheduleName).subscribe(
      (data) => {
        alert(`Added ` + this.scheduleName);
        this.courseService.updateScheduleList();
      },
      (err) => alert('This schedule name is already existed')
    );

    this.scheduleName = '';
  }
}
