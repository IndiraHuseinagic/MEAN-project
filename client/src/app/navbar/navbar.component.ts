import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent  {
 user: any;
 isNavbarCollapsed: boolean = true;

  constructor(
    private authS: AuthService, 
    private userS: UserService,
    private router: Router) {  
      
      if(this.authS.isLoggedIn())
       this.userS.getUser().subscribe(user =>this.user = user);
  }

  logout(){
    this.authS.logout();
    this.router.navigate(['/']);
  }

  get isLoggedIn() {
    return this.authS.isLoggedIn();
  }
    
}
