import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuard implements CanActivate{

  constructor(private authS: AuthService, private router: Router) { }

  canActivate() {
    const user = this.authS.userValue;

    if (user.isAdmin) return true;
    
    this.router.navigate(['/forbidden']);
    return false;
  }
}
