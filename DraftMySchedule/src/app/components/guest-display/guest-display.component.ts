import { Component, OnInit, ViewChild } from '@angular/core';
import { SubjectComponentComponent } from '../subject-component/subject-component.component';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-guest-display',
  templateUrl: './guest-display.component.html',
  styleUrls: ['./guest-display.component.css'],
})
export class GuestDisplayComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.logout();
  }
}
