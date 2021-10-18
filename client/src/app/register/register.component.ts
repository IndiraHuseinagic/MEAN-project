import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user';
import { UserService } from '../user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  user = {
    name: "",
    email: "",
    password: "",
    phone: ""
  }; 
  
  constructor(private userS: UserService, private router: Router) { }

  ngOnInit(): void {
  }

  register(){
    this.userS.register(this.user).subscribe();
  
    //reset
    this.user = {
      name: "",
      email: "",
      password: "",
      phone: ""
    }; 

    //send to login page
    this.router.navigate(['/login']);
  }
}
