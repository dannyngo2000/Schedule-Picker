import { Component, OnInit } from '@angular/core';
import { Clients } from '../../models/Client';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-client-detail-card',
  templateUrl: './client-detail-card.component.html',
  styleUrls: ['./client-detail-card.component.css'],
})
export class ClientDetailCardComponent implements OnInit {
  clients: Clients[];
  constructor(public authService: AuthService) {}

  ngOnInit(): void {}
  displayDetail(clients: Clients[]) {
    this.clients = clients;
    console.log(clients);
  }
  grantAdmin(username: string) {
    console.log(username);
  }
  deactivate(username: string) {
    this.authService
      .deactivate(username)
      .subscribe((data) => alert(`Deactivated ${username}`));
  }
  activate(username: string) {
    console.log(username);
    this.authService
      .activate(username)
      .subscribe((data) => alert(`Activated ${username}`));
  }
}
