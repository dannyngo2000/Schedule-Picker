import { Component, OnInit } from '@angular/core';
import { thistle } from 'color-name';
import { ValidateService } from '../../services/validate.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  name: String;
  username: String;
  email: String;
  password: String;
  constructor(
    private validateService: ValidateService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  onRegisterSubmit() {
    const user = {
      name: this.name,
      username: this.username,
      email: this.email,
      password: this.password,
      activate: true,
    };
    //Require Fields
    if (!this.validateService.validateRegister(user)) {
      alert('Please fill in all field');
      return false;
    }
    //Validate Email
    if (!this.validateService.validateEmail(user.email)) {
      alert('Please enter a valid email');
      this.email = '';
      this.password = '';

      return false;
    }

    //In order to re-direct, bring in router
    //Register
    this.authService.registerUser(user).subscribe((data) => {
      console.log(data);
      if (data.success) {
        alert('Successfully register');
        this.router.navigate(['/login']);
      } else {
        alert('Failed to register');
        this.router.navigate(['/register']);
      }
    });
  }
}
