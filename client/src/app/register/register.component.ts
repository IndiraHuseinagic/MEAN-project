import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  user = { name: "", email: "", password: "", phone: "" };
  errorMessage: string = "";
  hide: boolean = true;

  constructor(private userS: UserService, private router: Router) { }

  register() {
    this.userS.register(this.user).pipe(first()).subscribe(
      () => {
        alert("Registration successful");
        this.router.navigate(['/login']);
      },
      (error) => {
        this.errorMessage = error;
      });
  }

}
