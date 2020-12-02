import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../models/User';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}
  user: User;
  ngOnInit(): void {
    this.authService.getProfile().subscribe((profile) => {
      this.user = profile;
      if (this.user.activate === false) {
        this.router.navigate(['/login']);
        this.authService.logout();
        alert('Please contact admin to reactivate your account');
      }
      console.log(this.user);
    }),
      (err) => {
        console.log(err);
      };
  }
  goToSchedule() {
    this.router.navigate(['/authorizeUser']);
  }
}
