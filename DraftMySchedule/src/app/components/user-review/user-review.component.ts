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

  ngOnInit(): void {}
  displayReviews(reviews: Reviews[]) {
    this.reviews = reviews;
    console.log(this.reviews);
  }
  hide() {
    console.log('nope');
  }
}
