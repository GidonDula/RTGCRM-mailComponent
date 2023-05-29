import { Component, OnInit } from '@angular/core';
import { MarketingService } from 'app/servises/marketing.service';
import {FormBuilder,FormControl ,FormGroup,Validators} from '@angular/forms';
import { formatDate } from '@angular/common';
import { LeadAndCheckbox } from 'app/app.component';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

constructor(public marketingService:MarketingService) { }
productCategory:number;//product category (path) number
leadsPerProductCategory:LeadAndCheckbox[]=[];//array (table) of all leads for product category (path) number
checkedLeads:LeadAndCheckbox[]=[];//array of all leads that were checked
checkedIndex:number=0;//the index of all checked leads
date1:string="";//the little date for leads between dates
date2:string="";//the big date for leads between dates
datesForm:any;//the form of dates for leads between dates
checkText:string="check All leads";//text for saying if we need to check all leads or uncheck all leads
filterForm:any;//the filter form constructor
filterSubmit:boolean=false;//tells if filter form was submited
sources:any[]=[];//array of all sources of the leads
searchFirstName:string="";//the first name to search
searchLastName:string="";//the last name to search
searchEmail="";//the email to search
ssearchPhone="";//the phone to search
searchSource="";//the source to search
btnMore:boolean=false;//indication for display btn more when all leads checked
moreLeadsSize:number;//the size of all leads for filling checked leads array when all leads checked wiith more button
arrayMorePlace:number;//the place for filling checked leads when all  leads checked with more button
allLeadsCheck:boolean=false;//indicattion if all leads were checked
displayColums:string[]=['cb','entry_timestamp','first_name','last_name','phone1','email','source','source_details','status','priority'];//the colums of leads array to display at table

  ngOnInit(): void {
    this.marketingService.showMailesDialog=false;
    this.productCategory=this.marketingService.productCategory;
    console.log(this.productCategory);   
    this.getLeadsPerProductCategory();
    this.getSources();
    this.datesForm=new FormGroup({
        date1:new FormControl('',Validators.required),
        date2:new FormControl('',Validators.required)
     })
    this.filterForm=new FormGroup({
        searchFirstName:new FormControl(''),
        searchLastName:new FormControl(''),
        searchEmail:new FormControl(''),
        searchPhone:new FormControl(''),
        searchSource:new FormControl('')
     })
    this.moreLeadsSize=24;
    this.arrayMorePlace=0;
  }

  hideDialog(){//things to do when hiding this component initialize relevant parameters
    this.marketingService.showLeadsDialog=false;
    this.marketingService.availableEmails=[];
    this.marketingService.availablePhones=[];
    for(let i=0; i<this.marketingService.leadsPerProductCategory.length; i++){
      this.marketingService.leadsPerProductCategory[i].ischecked=false;
      this.marketingService.leadsPerProductCategory[i].Approved=0;
    }
    this.marketingService.checkedLeadsSize=0;
  }

   getLeadsPerProductCategory(){//get the leads for product category (path number) from the DB
    if(this.filterSubmit===true){
      this.cleanForm();
      this.filterSubmit=false;
    }
    this.marketingService.getLeadsPerProductCategory(this.productCategory,()=>{})
    this.marketingService.newLLeadsPerProductCategory.subscribe(()=>{
       this.leadsPerProductCategory=this.marketingService.leadsPerProductCategory
    })
   }

    checkLeads(event:MatCheckboxChange){//function for check all leads checkbox for calling check all leads or uncheck all leads function
      console.log(event.checked);
      if(event.checked){ 
      this.allLeadsCheck=true;  
      this.checkAllLeads();
      this.checkText="Uncheck All Leads";
      }else{
        this.allLeadsCheck=false;
        this.btnMore=false;
        this.uncheckAllLeads();
        this.checkText="check All leads";
      }
    }

    removeLeadFromCheckedList(lead:any){//remove the unchecked lead from checked leads list
      let index1=this.checkedLeads.findIndex(ld=>ld.lead_id===lead.lead_id);
      if(index1!==-1){
       for(let i=0; i<index1; i++){this.checkedLeads[i]=this.checkedLeads[i];}
       for(let i =index1; i+1<this.checkedLeads.length; i++){
           this.checkedLeads[i]=this.checkedLeads[i+1];
      }
      this.checkedLeads.pop();
      if(this.checkedIndex>0) {
           this.checkedIndex--;
      }
      console.log(this.checkedIndex);
      if(this.checkedIndex===0){
        this.checkedLeads=[];
      }
     }
     let index2=this.leadsPerProductCategory.findIndex(ld=>ld.lead_id===lead.lead_id);
     console.log(index2);
     if(index2!==-1){
      this.leadsPerProductCategory[index2].ischecked=false;
     }
    }

    addLeadToCheckList(lead:any){//add a lead to the checked leads list
      let index=this.leadsPerProductCategory.findIndex(ld=>ld.lead_id===lead.lead_id);
      if(index!==-1){
        let tempLead:LeadAndCheckbox=this.leadsPerProductCategory[index];
        tempLead.ischecked=true;
        tempLead.lead_id=lead.lead_id;
        tempLead.entry_timestamp=lead.entry_timestamp;
        tempLead.first_name=lead.first_name;
        tempLead.last_name=lead.last_name;
        tempLead.email=lead.email;
        tempLead.phone_1=lead.phone_1;
        tempLead.source=lead.source;
        tempLead.source_details=lead.source_details;
        tempLead.status=lead.status;
        tempLead.priority=lead.priority;
        tempLead.product_id=lead.product_id;
        tempLead.person_id=lead.person_id;
        tempLead.Approved=lead.Approved;
        this.checkedLeads[this.checkedIndex]=tempLead;
        this.checkedIndex++;
        console.log(this.checkedLeads);
      }
    }

   showOptions(event:MatCheckboxChange,lead:any): void {//options for add lead to checked list when checking its row at the table or removing it from checked list when unchecking it at table
    console.log(event.checked);
    console.log(lead);  
    if(event.checked){
     this.addLeadToCheckList(lead);
    }else{
      this.removeLeadFromCheckedList(lead);
    }
    this.marketingService.updateCheckedLeadAtArray(event.checked,lead);
}

moreLeadsClick(){//adding just 24 leads at each time when clkicking more leads button that is displayed when all leads are checked
  console.log(this.arrayMorePlace);  
  for(let i=this.arrayMorePlace; ((i<(this.moreLeadsSize+this.arrayMorePlace))&&(i<this.leadsPerProductCategory.length)); i++){
    this.checkedLeads[i]=this.leadsPerProductCategory[i];
  }
  this.arrayMorePlace=this.arrayMorePlace+this.moreLeadsSize;
  if(this.arrayMorePlace<this.leadsPerProductCategory.length){
    this.btnMore=true;
  }else{
    this.btnMore=false;
  }
}

checkAllLeads(){//cheking the check box of all the leads and updating it at the array
  for(let i=0; i<this.leadsPerProductCategory.length; i++){
    this.leadsPerProductCategory[i].ischecked=true; 
  }
  this.moreLeadsClick();
   this.checkedIndex=this.leadsPerProductCategory.length;
  this.marketingService.checkAllLeads(); 
}

uncheckAllLeads(){//cheking the check box of all the leads and updating it at the array
   for(let i=0; i<this.leadsPerProductCategory.length; i++){
    this.leadsPerProductCategory[i].ischecked=false;
  }
   this.checkedLeads=[];
   this.checkedIndex=0;
   this.arrayMorePlace=0;
   this.marketingService.uncheckAllLeads();
}

sendCheckedLeads(){//sending the checked leads to dialog mails component for sending them emails or SMS 
  this.marketingService.sendCheckedLeads();
}

getSources(){//getting the sources of the leads frmthe DB
  this.marketingService.getLeadsSource(()=>{})
  this.marketingService.newSourceLeads.subscribe(()=>{
    this.sources=this.marketingService.sourceLeads;    
  })
}
 
 searchSubmit(){//submitting the search filter for relevant parameters 
     let value=this.filterForm.value;
     console.log(value);
     this.filterSubmit=true;
     if(value.searchFirstName!==''){
         console.log(value.searchFirstName);
         this.leadsPerProductCategory=this.leadsPerProductCategory.filter((lead)=>{
          return lead.first_name===value.searchFirstName;
       })
     }else if(value.searchLastName!==''){
          console.log(value.searchLastName);
          this.leadsPerProductCategory=this.leadsPerProductCategory.filter((lead)=>{
            return lead.last_name===value.searchLastName;
         })
     }else if(value.searchEmail !== ''){
         console.log(value.searchEmail);
         this.leadsPerProductCategory=this.leadsPerProductCategory.filter((lead)=>{
          return lead.email===value.searchEmail;
       })
     }else if(value.searchPhone!== ''){
        console.log(value.searchPhone);
        this.leadsPerProductCategory=this.leadsPerProductCategory.filter((lead)=>{
          return lead.phone_1===value.searchPhone;
       })
     }else if(value.searchSource!== ''){
            console.log(value.searchSource);
            this.leadsPerProductCategory=this.leadsPerProductCategory.filter((lead)=>{
               return lead.source===value.searchSource;
            })           
     }
 }

 cleanForm(){//clean the search (filter ) form
  this.filterForm.controls["searchFirstName"].setValue('');
  this.filterForm.controls["searchLastName"].setValue('');
  this.filterForm.controls["searchEmail"].setValue('');
  this.filterForm.controls["searchPhone"].setValue('');
  this.filterForm.controls["searchSource"].setValue('');
 }

   twoDatesSubmit(data:any){//subming the http post for the form of leads between dates
      this.date1=formatDate(data.date1,'yyyy-MM-dd','en_US');
      this.date2=formatDate(data.date2,'yyyy-MM-dd','en_US');
      console.log(this.date1);
      console.log(this.date2);
      if(this.date1<this.date2){
        let datsObj={
          date1:this.date1,
          date2:this.date2,
          productCategory:this.productCategory
        }
        this.marketingService.leadsPerProductCategoryBetweenDates(datsObj,()=>{})
        this.marketingService.newLLeadsPerProductCategoryBetweenDates.subscribe(()=>{
         this.leadsPerProductCategory=this.marketingService.leadsPerProductCategoryAndDates;
         console.log(this.leadsPerProductCategory);
           this.datesForm.controls['date1'].setValue(' ');
           this.datesForm.controls['date2'].setValue(' ');
        })
        this.uncheckAllLeads();
        this.checkedLeads=[];
        this.btnMore=false;
        this.allLeadsCheck=false;
        this.checkText="check All leads";
      }else{
        console.log("the big date is before the small try again");
      }
   }
}
