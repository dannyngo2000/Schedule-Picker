import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from '../models/Subject';
import { CourseCode } from '../models/CourseCode';
import { BehaviorSubject, Observable } from 'rxjs';
import { ScheduleList } from '../models/ScheduleList';
import { TimeTableSlot } from '../models/TimeTableSlot';
import { ScheduleCourse } from '../models/ScheduleCourse';
import { Reviews } from '../models/Reviews';
import { map, switchMap } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: localStorage.getItem('id_token'),
  }),
};

@Injectable({
  providedIn: 'root',
})
export class CoursesService {
  courseList: any = [];
  counter: number = 0;
  count: number = 0;
  private scheduleListUpdate = new BehaviorSubject('');
  schedule$ = this.scheduleListUpdate.asObservable();
  scheduleUpdateStream$ = this.schedule$.pipe(
    map((res) => res),
    switchMap((res) => {
      return this.http
        .get<ScheduleList[]>(
          `${this.authorizeURL}getAuthorSchedule/${localStorage.getItem(
            'username'
          )}`
        )
        .pipe(
          map((res) => {
            let mapped: string[] = [];
            res.forEach((val) => {
              return mapped.push(
                'Schedule Name:' +
                  val.scheduleName +
                  ' - ' +
                  'Items: ' +
                  val.length +
                  ' - ' +
                  'Status: ' +
                  val.status +
                  ' - ' +
                  'Time: ' +
                  val.time
              );
            });

            return mapped;
          })
        );
    })
  );

  constructor(private http: HttpClient) {}

  url: string = 'http://localhost:3000/api/open/';
  authorizeURL: string = 'http://localhost:3000/api/private/';
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
  createNewSchedule(
    scheduleName: string,
    author: string,
    token: string,
    status: string
  ) {
    let headers = new HttpHeaders().set('Authorization', token);
    let body = {
      status: status,
    };
    return this.http.post(
      `${this.authorizeURL}schedule/${scheduleName}/${author}`,
      body,
      httpOptions
    );
  }
  //Getting all schedules and number of courses in it
  getAllFromAuthorSchedules(author: string) {
    return this.http.get<ScheduleList[]>(
      `${this.authorizeURL}getAuthorSchedule/${author}`
    );
  }
  //Delete selected schedule
  deleteSelectedSchedule(scheduleName: string) {
    return this.http.delete(`${this.authorizeURL}schedule/${scheduleName}`);
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
    let headers = new HttpHeaders().set(
      'Authorization',
      localStorage.getItem('id_token')
    );
    return this.http.get<ScheduleCourse[]>(
      `${this.authorizeURL}getSchedule/${scheduleName}`,

      { headers: headers }
    );
  }

  updateCourseInSchedule(scheduleName: string, courseList: any) {
    console.log('updating');
    console.log(courseList);
    this.courseList = [];
    return this.http.put(
      `${this.authorizeURL}updateSchedule/${scheduleName}`,
      JSON.stringify(courseList),
      httpOptions
    );
  }
  getByClassNameKeyword(keyword: string) {
    return this.http.get<TimeTableSlot[]>(
      `${this.url}getKeywordClassName/${keyword}`
    );
  }
  getByClassNumKeyword(keyword: string) {
    return this.http.get<TimeTableSlot[]>(
      `${this.url}getKeywordClassNum/${keyword}`
    );
  }
  postReview(review: string, username: string, courseID: string) {
    console.log('posting');
    let body = [
      {
        review: review,
        username: username,
        time: getTime(),
        hidden: false,
        courseID: courseID,
      },
    ];
    return this.http.post(
      `${this.authorizeURL}addReview/${courseID}`,
      body,
      httpOptions
    );
  }
  getReview(courseID: string) {
    return this.http.get<Reviews[]>(
      `${this.authorizeURL}getReview/${courseID}`
    );
  }
  hideReview(review: string, courseID: string) {
    let body = [
      {
        description: review,
      },
    ];
    return this.http.put(
      `${this.authorizeURL}updateReview/${courseID}`,
      body,
      httpOptions
    );
  }

  changeStatus(scheduleName: string) {
    return this.http.put(
      `${this.authorizeURL}setScheduleStatus/${scheduleName}`,
      [],
      httpOptions
    );
  }
}
let getTime = function () {
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
