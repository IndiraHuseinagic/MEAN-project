import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';



@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent  {
 isNavbarCollapsed: boolean = true;
 user: any;

  constructor(private authS: AuthService, private router: Router) {
    this.authS.user$.subscribe(user => {
      if(Object.keys(user).length > 0) this.user = user 
    })
      
  } 

  logout(){
    this.authS.logout();
    this.router.navigate(['/']);
  } 

}
