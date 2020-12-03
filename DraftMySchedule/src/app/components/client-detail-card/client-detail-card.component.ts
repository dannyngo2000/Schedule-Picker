import { Component, OnInit } from '@angular/core';
import { Clients } from '../../models/Client';
@Component({
  selector: 'app-client-detail-card',
  templateUrl: './client-detail-card.component.html',
  styleUrls: ['./client-detail-card.component.css'],
})
export class ClientDetailCardComponent implements OnInit {
  clients: Clients[];
  constructor() {}

  ngOnInit(): void {}
  displayDetail(clients: Clients[]) {
    this.clients = clients;
  }
  grantAdmin(username: string) {
    console.log(username);
  }
  deactivate(username: string) {
    console.log(username);
  }
  activate(username: string) {
    console.log(username);
  }
}
