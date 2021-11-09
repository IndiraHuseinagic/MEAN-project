import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';



@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  isCollapsed: boolean = true;
  user: any;

  constructor(private authS: AuthService, private router: Router) { }

  ngOnInit() {
    this.authS.user$.subscribe(user => this.user = user)
  }

  logout() {
    this.authS.logout();
    this.router.navigate(['/']);
  }

  get isLogged() {
    for (var x in this.user) { return true; }
    return false;
  }
}
