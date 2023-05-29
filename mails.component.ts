import { Component, OnInit } from '@angular/core';
import { MarketingService } from 'app/servises/marketing.service';

@Component({
  selector: 'app-mails',
  templateUrl: './mails.component.html',
  styleUrls: ['./mails.component.css']
})

export class MailsComponent implements OnInit {

  constructor(public marketingService:MarketingService) { }

  categories:any[]=[];//categories arr
  categorySelected:boolean=false;//true if a category was seleced (choosed for showing its paths)
  pathsForCategory:any[]=[];//paths arr for the selected category

  ngOnInit(): void {//on component init load the categories
    this.loadCategories();
  }

  openButtonsByCategory(category:any){//showing the path buttons after a category was selected
    this.categorySelected=true;
    this.loadPathPerCategory(category);
  }

  backToCategories(){//back from paths per categories buttons to category buttons
    this.categorySelected=false;
  }

  openPopUpByPathCategory(pathCategory:any){//prepering for showing leads table (at dialog component) for the chosen path category
    this.marketingService.showLeadsDialog=true;
    console.log(pathCategory);
    this.marketingService.productCategory=pathCategory;
}

private loadCategories(){//load the categories from server side DB
  this.marketingService.getCategories(()=>{})
  this.marketingService.newCategories.subscribe(()=>{
    this.categories=this.marketingService.categories;
    console.log(this.categories)
  })
}

private loadPathPerCategory(category:any){//load the paths per category from server side DB
    this.marketingService.getPathsPerCategry(category,()=>{})
    this.marketingService.newPathsPerCategory.subscribe(()=>{
      this.pathsForCategory=this.marketingService.pathsPerCategory;
      console.log(this.pathsForCategory);
    })
}

}
