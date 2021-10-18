import { Observable } from 'rxjs';
import { Component } from '@angular/core';
import { CategoryService } from '../category.service';

@Component({
  selector: 'categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.css']
})
export class CategoriesComponent  {
  categories$: Observable<any>; 

  constructor(private categoryS: CategoryService) { 
   this.categories$ = this.categoryS.getAllCategories();  
  };
 
}
