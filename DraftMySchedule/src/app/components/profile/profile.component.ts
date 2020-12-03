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
  accountName: string;
  ngOnInit(): void {
    this.updateProfile();
    this.accountName = localStorage.getItem('username');
  }
  updateProfile() {
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
    if (
      this.newPassword != this.confirmedPassword ||
      (this.newPassword == null && this.confirmedPassword == null)
    ) {
      alert('Something went wrong');
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
  deactivate() {
    console.log(this.user.password);
    this.accountName = this.user.name.toString();
    this.authService
      .deactivate(this.accountName)
      .subscribe((data) => console.log(data));
  }
}
