import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(public router: Router, public authService: AuthService) {}
  token: string;

  ngOnInit(): void {
    this.token = localStorage.getItem('id_token');
    console.log(this.token);
  }
  try() {
    this.router.navigate(['/guest']);
  }
}
