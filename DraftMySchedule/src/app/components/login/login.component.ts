import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  username: String;
  password: String;
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  onLoginSubmit() {
    const user = {
      username: this.username,
      password: this.password,
    };
    this.authService.authenticateUser(user).subscribe(
      (data) => {
        console.log(data);
        if (data.success) {
          //this.authService.storeUserData(data.token, data.user);
          this.router.navigate(['dashboard']);
          console.log(data);
          this.authService.storeUserData(data.token, data.user);
        } else {
          alert('Something went wrong');
          this.router.navigate(['login']);
        }
      },
      (err) => console.log(err)
    );
  }
}
