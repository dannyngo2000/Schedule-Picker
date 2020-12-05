import {
  Component,
  OnInit,
  Renderer2,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { CoursesService } from '../../services/courses.service';
import { UserReviewComponent } from '../user-review/user-review.component';
@Component({
  selector: 'app-manage-review',
  templateUrl: './manage-review.component.html',
  styleUrls: ['./manage-review.component.css'],
})
export class ManageReviewComponent implements OnInit {
  @ViewChild(UserReviewComponent)
  userReview: UserReviewComponent;
  courseID: string;
  constructor(public courseService: CoursesService) {}

  ngOnInit(): void {}
  displayReview() {
    let reviews: any = [];
    this.courseService.getReview(this.courseID).subscribe(
      (data) => {
        reviews = data;
        console.log('hello');
        this.userReview.displayReviews(reviews);
      },
      (err) => alert('This course number does not exist')
    );
  }
}
