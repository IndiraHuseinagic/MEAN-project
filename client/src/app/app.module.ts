import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApartmentsComponent } from './apartments/apartments.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ApartmentDetailsComponent } from './apartment-details/apartment-details.component';
import { ReservationComponent } from './reservation/reservation.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { MatIconModule } from '@angular/material/icon';
import { ProfileComponent } from './profile/profile.component';
import { MyReservationsComponent } from './my-reservations/my-reservations.component';
import { AdminReservationsComponent } from './admin-reservations/admin-reservations.component';
import { AdminApartmentsComponent } from './admin-apartments/admin-apartments.component';
import { ReservationSummaryComponent } from './reservation-summary/reservation-summary.component';
import { ApartmentFormComponent } from './apartment-form/apartment-form.component';
import { InterceptorService } from './interceptor.service';
import { ForbiddenComponent } from './forbidden/forbidden.component';


@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    ApartmentsComponent,
    LoginComponent,
    RegisterComponent,
    ApartmentDetailsComponent,
    ReservationComponent,
    HomeComponent,
    FooterComponent,
    ProfileComponent,
    MyReservationsComponent,
    AdminReservationsComponent,
    AdminApartmentsComponent,
    ReservationSummaryComponent,
    ApartmentFormComponent,
    ForbiddenComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, 
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
