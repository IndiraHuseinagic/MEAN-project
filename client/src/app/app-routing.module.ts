import { ReservationSummaryComponent } from './reservation-summary/reservation-summary.component';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApartmentsComponent } from './apartments/apartments.component';
import { RegisterComponent } from './register/register.component';
import { ApartmentDetailsComponent } from './apartment-details/apartment-details.component';
import { AuthGuard } from './auth-guard.service';
import { ReservationComponent } from './reservation/reservation.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { MyReservationsComponent } from './my-reservations/my-reservations.component';
import { AdminApartmentsComponent } from './admin-apartments/admin-apartments.component';
import { AdminReservationsComponent } from './admin-reservations/admin-reservations.component';
import { ApartmentFormComponent } from './apartment-form/apartment-form.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'apartments/reservation/:id', component: ReservationComponent, canActivate: [AuthGuard] },
  { path: 'apartments/:id', component: ApartmentDetailsComponent},
  { path: 'apartments', component: ApartmentsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'my/profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'my/reservations', component: MyReservationsComponent },
  { path: 'admin/apartments/new', component: ApartmentFormComponent },
  { path: 'admin/apartments/:id', component: ApartmentFormComponent },
  { path: 'admin/apartments', component: AdminApartmentsComponent },
  { path: 'admin/reservations', component: AdminReservationsComponent },
  { path: 'reservation-summary/:id', component: ReservationSummaryComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
