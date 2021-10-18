import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { ApartmentService } from '../apartment.service';
import { CategoryService } from '../category.service';
import { Category } from '../models/category';

@Component({
  selector: 'app-apartment-form',
  templateUrl: './apartment-form.component.html',
  styleUrls: ['./apartment-form.component.css']
})
export class ApartmentFormComponent {

  categories!: Category[];
  apartment: any = {};
  apartmentId: string | null; 


  constructor(
    private categoryS: CategoryService, 
    private apartmentS: ApartmentService, 
    private router: Router, 
    private route: ActivatedRoute) { 

    this.categoryS.getAllCategories().subscribe(categories => this.categories = categories);
    this.apartmentId=this.route.snapshot.paramMap.get('id');
    
    this.apartment.unavailable= [];

   if(this.apartmentId){
     this.apartmentS.getApartment(this.apartmentId).pipe(take(1)).subscribe(apartment=> {
      const {category, _id, ...other} = apartment; //remove category and _id
      this.apartment = other;
      this.apartment.categoryId = apartment.category._id //add categoryId 
     });
   }
}

  save(){

    if(this.apartmentId)
    this.apartmentS.updateApartment(this.apartmentId, this.apartment).subscribe();

    else
    this.apartmentS.addApartment(this.apartment).subscribe();

    this.router.navigate(['admin/apartments']);
  }

  delete(){
    if(!confirm('Are you sure you want to delete this apartment?')) return;

      this.apartmentS.deleteApartment(this.apartmentId).subscribe();
      this.router.navigate(['admin/apartments']);
  }

}
