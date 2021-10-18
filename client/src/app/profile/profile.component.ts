import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
user$ : Observable<any>;

  constructor(private userS: UserService) { 
    this.user$ = this.userS.getUser();
  }

  ngOnInit(): void {
  }

}
