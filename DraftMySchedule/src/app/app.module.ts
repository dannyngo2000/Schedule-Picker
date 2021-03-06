import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ValidateService } from '../app/services/validate.service';
import { AuthService } from '../app/services/auth.service';
import { JwtModule, JwtHelperService } from '@auth0/angular-jwt';
import { AuthGuard } from './guard/auth.guard';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { CourseDetailCardsComponent } from './components/course-detail-cards/course-detail-cards.component';
import { SubjectComponentComponent } from './components/subject-component/subject-component.component';
import { ScheduleComponent } from './components/schedule/schedule.component';
import { CurrentScheduleComponent } from './components/current-schedule/current-schedule.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { GuestDisplayComponent } from './components/guest-display/guest-display.component';
import { AuthorizedUserComponent } from './components/authorized-user/authorized-user.component';
import { UserReviewComponent } from './components/user-review/user-review.component';
import { ManageUserComponent } from './components/manage-user/manage-user.component';
import { ClientDetailCardComponent } from './components/client-detail-card/client-detail-card.component';
import { ManageReviewComponent } from './components/manage-review/manage-review.component';

const appRoutes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },

  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'guest',
    component: GuestDisplayComponent,
  },
  {
    path: 'authorizeUser',
    component: AuthorizedUserComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'manage',
    component: ManageUserComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'manageReview',
    component: ManageReviewComponent,
  },
];
export function tokenGetter() {
  return localStorage.getItem('id_token');
}
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    DashboardComponent,
    ProfileComponent,

    CourseDetailCardsComponent,

    SubjectComponentComponent,

    ScheduleComponent,

    CurrentScheduleComponent,

    GuestDisplayComponent,

    AuthorizedUserComponent,

    UserReviewComponent,

    ClientDetailCardComponent,
    ManageUserComponent,
    ManageReviewComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(appRoutes),
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ['example.com'],
        disallowedRoutes: ['http://locahost:4200/dashboard/'],
      },
    }),
    NoopAnimationsModule,
    MatCardModule,
    MatToolbarModule,
    MatButtonModule,
    MatSelectModule,
  ],
  providers: [ValidateService, AuthService, AuthGuard],
  bootstrap: [AppComponent],
})
export class AppModule {}
