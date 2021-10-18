import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate{

  constructor(private userS: UserService, private router: Router) { }

  canActivate(route: any, state: RouterStateSnapshot) {
  let token = localStorage.getItem('token');

  if(token) return true;
  
  else {
      this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
      return false;
      }
  
  }
}
