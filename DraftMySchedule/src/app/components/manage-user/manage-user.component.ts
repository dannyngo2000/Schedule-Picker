import {
  Component,
  OnInit,
  Renderer2,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Clients } from '../../models/Client';
import { ClientDetailCardComponent } from '../client-detail-card/client-detail-card.component';
@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.css'],
})
export class ManageUserComponent implements OnInit {
  @ViewChild(ClientDetailCardComponent)
  clientDetail: ClientDetailCardComponent;
  constructor(public authService: AuthService) {}
  clients: Clients[];
  ngOnInit(): void {}
  displayUsers() {
    this.authService.getAllUsers().subscribe((data) => {
      this.clients = data;
      this.clientDetail.displayDetail(this.clients);
    });
  }
}
