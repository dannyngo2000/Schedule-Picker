import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from '../models/Subject';
import { CourseCode } from '../models/CourseCode';
import { BehaviorSubject, Observable } from 'rxjs';
import { ScheduleList } from '../models/ScheduleList';
import { TimeTableSlot } from '../models/TimeTableSlot';
import { ScheduleCourse } from '../models/ScheduleCourse';
import { map, switchMap } from 'rxjs/operators';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  courseList: ScheduleCourse[] = [];
  count: number = 0;
  private scheduleListUpdate = new BehaviorSubject('');
  schedule$ = this.scheduleListUpdate.asObservable();
  scheduleUpdateStream$ = this.schedule$.pipe(
    map((res) => res),
    switchMap((res) => {
      return this.http.get<ScheduleList[]>(`${this.url}schedule`).pipe(
        map((res) => {
          let mapped: string[] = [];
          res.forEach((val) => {
            return mapped.push('Name:' + val.scheduleName + ' - ' + val.length);
          });

          return mapped;
        })
      );
    })
  );

  constructor(private http: HttpClient) {}

  url: string = 'http://localhost:3000/api/open/';

  updateScheduleList(): void {
    this.scheduleListUpdate.next('');
  }
  //Getting all subjects
  getAllSubjects(): Observable<Subject[]> {
    return this.http.get<Subject[]>(this.url + 'subjects');
  }
  //Getting all course codes given a subject
  getCourseCode(subjectCode: string): Observable<CourseCode[]> {
    return this.http.get<CourseCode[]>(`${this.url}courseCode/${subjectCode}`);
  }
  //Creating new schedule
  createNewSchedule(scheduleName: string) {
    return this.http.post(`${this.url}schedule/${scheduleName}`, httpOptions);
  }
  //Getting all schedules and number of courses in it
  getAllSchedules() {
    return this.http.get<ScheduleList[]>(`${this.url}schedule`);
  }
  //Delete selected schedule
  deleteSelectedSchedule(scheduleName: string) {
    return this.http.delete(`${this.url}schedule/${scheduleName}`);
  }

  //Delete all schedule
  deleteAllSchedule() {
    return this.http.delete(`${this.url}schedule`);
  }

  //Get timetable slot for selected subject,course code and component
  getTimetableSlot(subjectCode, courseCode, componentCode) {
    if (componentCode === ' ' || componentCode == 'ALL') {
      return this.http.get<TimeTableSlot[]>(
        `${this.url}timetable/${subjectCode}/${courseCode}`
      );
    } else {
      return this.http.get<TimeTableSlot[]>(
        `${this.url}timetable/${subjectCode}/${courseCode}/${componentCode}`
      );
    }
  }
  getCourseCodeForSelectedSubject(subjectCode: string) {
    return this.http.get<TimeTableSlot[]>(
      `${this.url}getAllCourseCodes/${subjectCode}`
    );
  }
  getCurrentSchedule(scheduleName: string) {
    return this.http.get<ScheduleCourse[]>(
      `${this.url}getSchedule/${scheduleName}`
    );
  }

  updateCourseInSchedule(scheduleName: string, courseList: ScheduleCourse[]) {
    console.log('updating');
    return this.http.put(
      `${this.url}update/${scheduleName}`,
      JSON.stringify(courseList),
      httpOptions
    );
  }
}
