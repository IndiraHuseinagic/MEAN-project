import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent{
  user = {email: "", password: ""}; 
  errorMessage: string ="";
  hide: boolean = true;


  constructor(
    private authS: AuthService, 
    private router: Router, 
    private route: ActivatedRoute) {}

  login(){
    this.authS.login(this.user).pipe(first()).subscribe(
        data => {
           alert('Log in successful!');
            let returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
            this.router.navigateByUrl(returnUrl);
          },      
        error =>{
         this.errorMessage = error;
       }); 
  }


}
