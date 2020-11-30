import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../models/User';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}
  user: User;
  newPassword: string;
  confirmedPassword: string;
  ngOnInit(): void {
    this.authService.getProfile().subscribe((profile) => {
      this.user = profile;

      console.log(this.user);
    }),
      (err) => {
        console.log(err);
      };
  }
  onSubmit() {
    console.log(this.user.username);
    if (this.newPassword != this.confirmedPassword) {
      alert('The password does not match');
      this.newPassword = '';
      this.confirmedPassword = '';
      return false;
    } else {
      this.authService
        .changePassword(this.user.username, this.confirmedPassword)
        .subscribe((data) => console.log(data));
      alert('Successfully changed your password');
      this.newPassword = '';
      this.confirmedPassword = '';
    }
  }
}
