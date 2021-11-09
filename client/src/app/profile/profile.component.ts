import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from '../user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user$!: Observable<any>;

  constructor(private userS: UserService) { }

  ngOnInit() {
    this.user$ = this.userS.getUser();
  }

}
