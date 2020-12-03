import {
  Component,
  OnInit,
  Renderer2,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { Reviews } from '../../models/Reviews';
@Component({
  selector: 'app-user-review',
  templateUrl: './user-review.component.html',
  styleUrls: ['./user-review.component.css'],
})
export class UserReviewComponent implements OnInit {
  reviews: Reviews[];
  constructor() {}
  role: string = localStorage.getItem('role');
  ngOnInit(): void {}
  displayReviews(reviews: Reviews[]) {
    reviews = reviews.filter((review) => {
      if (review.hidden == false) {
        return true;
      }
    });

    this.reviews = reviews;
  }
  hide() {
    console.log('nope');
  }
}
