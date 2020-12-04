import {
  Component,
  OnInit,
  Renderer2,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { Reviews } from '../../models/Reviews';
import { CoursesService } from '../../services/courses.service';
@Component({
  selector: 'app-user-review',
  templateUrl: './user-review.component.html',
  styleUrls: ['./user-review.component.css'],
})
export class UserReviewComponent implements OnInit {
  token: string;
  reviews: Reviews[];
  constructor(public courseService: CoursesService) {}
  role: string = localStorage.getItem('role');
  ngOnInit(): void {
    this.token = localStorage.getItem('id_token');
  }
  displayReviews(reviews: Reviews[]) {
    console.log('working');
    if (this.role != 'admin') {
      reviews = reviews.filter((review) => {
        if (review.hidden == false) {
          return true;
        }
      });
      this.reviews = reviews;
    }

    this.reviews = reviews;
  }
  hide(review: string, courseID: string) {
    this.courseService.hideReview(review, courseID).subscribe(
      (data) => alert('Flagged'),
      (err) => alert('Something went wrong')
    );
  }
}
