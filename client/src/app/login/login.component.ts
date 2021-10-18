import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  user = {
    email: "",
    password: ""
  }; 

  constructor(private authS: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  login(){
    this.authS.login(this.user)
    .subscribe(token => {
      this.user = {
        email: "",
        password: ""
      }; 

    localStorage.setItem('token', token);
    let returnUrl=localStorage.getItem('returnUrl') || '/';
    localStorage.removeItem('returnUrl');
    
    alert('Log in successful!');
    
    this.router.navigateByUrl(returnUrl);     
    
    });



  }
}
