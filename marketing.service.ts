import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ServerApiService } from './server-api.service';
import { LeadAndCheckbox } from 'app/app.component';
import { SERVER_URL } from 'app/app.component';

@Injectable({
  providedIn: 'root'
})
export class MarketingService {

  constructor(private api:ServerApiService) { }
  showLeadsDialog:boolean=false;//showing leads dialog (dialog component)
  showMailesDialog:boolean=false;//showing mails dialog (dialog-mailes component)
  datesSelected:boolean=false;//are we after dates filter (which leads array to use)
  checkedLeadsSize=0; //how many leads were checked
  productCategory:number;//product category of the leads (path number)
  categories:any[]=[];//categories Arr
  sourceLeads:any[]=[];//sourceLeadsArr
  pathsPerCategory:any[]=[];//paths for category arr
  leadsPerProductCategory:LeadAndCheckbox[]=[];//the leads for each product category
  leadsPerProductCategoryAndDates:LeadAndCheckbox[]=[];//leads for product category after dates filter
  newCategories=new Subject<void>();//subject for categories arr
  newSourceLeads=new Subject<void>();//subject for source leads arr
  newPathsPerCategory=new Subject<void>();//subject for paths per category arr
  newLLeadsPerProductCategory=new Subject<void>();//sbjuect for leads per category arr
  newLLeadsPerProductCategoryBetweenDates=new Subject<void>();//subject for leads per product category after dates selected
  availablePhones:string[]=[];//array for phones to send SMS
  availableEmails:string[]=[];//array for emails tosend
  availableFullNames:string[]=[];//the full names of selected leads

  setProductCategoryName(category:number){//setting te category(path number)
    this.productCategory=category;
  }

  getCategories(callback:any){//getting categories from server
  this.api.getCategories().subscribe((res:any)=>{
     console.log(res); 
    this.categories=res;
      this.newCategories.next();
      callback(false,res)
  }),(err)=>{
    callback(err,null)
  }
}

getLeadsSource(callback:any){//getting leads source from server
  this.api.getSourceLeads().subscribe((res:any)=>{
    console.log(res); 
   this.sourceLeads=res;
     this.newSourceLeads.next();
     callback(false,res)
 }),(err)=>{
   callback(err,null)
 }
}

getPathsPerCategry(category:any,callback:any){//getting the paths per category
this.api.getPathsPerCategory(category).subscribe((res:any)=>{
  console.log(res);
  this.pathsPerCategory=res;
  this.newPathsPerCategory.next();
  callback(false,res);
}),(err)=>{
  callback(err,null);
}
}

getLeadsPerProductCategory(productCategory:any,callback:any){//getting the leads for each product category (path number)
  this.api.getLeadsPerProductCategory(productCategory).subscribe((res:any)=>{
    console.log(res); 
    for(let i=0; i<res.length; i++){
        let tempLead:LeadAndCheckbox={
          ischecked:false,
          lead_id:Number (res[i].lead_id),
          entry_timestamp:new Date(String(res[i].entry_timestamp)),
          first_name:String(res[i].first_name),
          last_name:String(res[i].last_name),
          phone_1:String(res[i].phone_1),
          email:String(res[i].email),
          source:String(res[i].source),
          source_details:String(res[i].source_details),
          status:String(res[i].status),
          priority:Number(res[i].priority),
          product_id:Number(res[i].product_id),
          person_id:Number(res[i].person_id),
          Approved:0
        }
        this.leadsPerProductCategory[i]=tempLead; 
     }
     this.newLLeadsPerProductCategory.next();
     callback(false,res)
  }),(err)=>{
    callback(err,null)
  }
}

updateCheckedLeadAtArray(checked:boolean,lead:any){//updating if te given lead was checked or unchecked at relevant leads array
  console.log(lead);
  console.log(checked);
  if(!this.datesSelected){
    const index = this.leadsPerProductCategory.findIndex(Lead => Lead.lead_id === lead.lead_id);
    console.log(index);
  if(index!==-1){  
    if(checked){
      this.leadsPerProductCategory[index].Approved=1;
      this.leadsPerProductCategory[index].ischecked=true;
      this.checkedLeadsSize++;
    }else{
      this.leadsPerProductCategory[index].Approved=0;
      this.leadsPerProductCategory[index].ischecked=false;
      this.checkedLeadsSize--;
    }
  }
}
else{
  const index = this.leadsPerProductCategoryAndDates.findIndex(Lead => Lead.lead_id === lead.lead_id);
  console.log(index);
  if(index!==-1){
  if(checked){
    this.leadsPerProductCategoryAndDates[index].Approved=1;
    this.checkedLeadsSize++;
  }else{
     this.leadsPerProductCategoryAndDates[index].Approved=0;
     this.checkedLeadsSize--;
  }
}  
}
console.log(this.checkedLeadsSize);
}

 checkAllLeads(){//updating all the leads to be checked at relevantik array
   if(!this.datesSelected){
     for(let i=0; i<this.leadsPerProductCategory.length; i++){
      this.leadsPerProductCategory[i].ischecked=true;
      this.leadsPerProductCategory[i].Approved=1;
     }
   }else{
    for(let i=0; i<this.leadsPerProductCategoryAndDates.length; i++){
      this.leadsPerProductCategoryAndDates[i].ischecked=true;
      this.leadsPerProductCategoryAndDates[i].Approved=1;
     }
   }
 }

 uncheckAllLeads(){//updating all the leads to be unchecked at relevantik array
  if(!this.datesSelected){
    for(let i=0; i<this.leadsPerProductCategory.length; i++){
       this.leadsPerProductCategory[i].ischecked=false;
      this.leadsPerProductCategory[i].Approved=0;
    }
  }else{
   for(let i=0; i<this.leadsPerProductCategoryAndDates.length; i++){
    this.leadsPerProductCategoryAndDates[i].ischecked=false; 
    this.leadsPerProductCategoryAndDates[i].Approved=0;
    }
  }
 }

sendCheckedLeads(){//preperation for sending the checked leads emails and SMS
  let  checkIndex=0;
  if(!this.datesSelected){
     for(let i=0; i<this.leadsPerProductCategory.length; i++){
      if(this.leadsPerProductCategory[i].Approved===1) {
        let AvailableFullName=this.leadsPerProductCategory[i].first_name+"   "+this.leadsPerProductCategory[i].last_name;
         this.availablePhones[checkIndex]=this.leadsPerProductCategory[i].phone_1;
          this.availableEmails[checkIndex]=this.leadsPerProductCategory[i].email;
          this.availableFullNames[checkIndex]=AvailableFullName;
          checkIndex++;
        }
     }
  }else{
    for(let i=0; i<this.leadsPerProductCategoryAndDates.length; i++){
      if(this.leadsPerProductCategoryAndDates[i].Approved===1){ 
        let AvailableFullName=this.leadsPerProductCategory[i].first_name+"   "+this.leadsPerProductCategory[i].last_name;
        this.availablePhones[checkIndex]=this.leadsPerProductCategoryAndDates[i].phone_1;
        this.availableEmails[checkIndex]=this.leadsPerProductCategoryAndDates[i].email;
        this.availableFullNames[checkIndex]=AvailableFullName;
        checkIndex++;
      }
     }
  }
  console.log(checkIndex);
  console.log(this.availablePhones);
  console.log(this.availableEmails);
  this.showLeadsDialog=false;
  this.showMailesDialog=true;
}

leadsPerProductCategoryBetweenDates(data:any,callback:any){//getting leads for product category (path number) after selecting betweeen dates
  this.datesSelected=true;
  console.log("dates has been selected");
  this.api.leadsPerProductCategoryAndBetweenDates(JSON.stringify(data)).subscribe((res:any)=>{
    console.log(res); 
    for(let i=0; i<res.length; i++){
        let tempLead:LeadAndCheckbox=
        {
          ischecked:false,
          lead_id:Number(res[i].lead_id),
          entry_timestamp:new Date(res[i].entry_timestamp),
          first_name:String(res[i].first_name),
          last_name:String(res[i].last_name),
          phone_1:String(res[i].phone_1),
          email:String(res[i].email),
          source:String(res[i].source),
          source_details:String(res[i].source_details),
          status:String(res[i].status),
          priority:Number(res[i].priority),
          product_id:Number(res[i].product_id),
          person_id:Number(res[i].person_id),
          Approved:0
        }
        this.leadsPerProductCategoryAndDates[i]=tempLead; 
     }
     this.newLLeadsPerProductCategoryBetweenDates.next();
     callback(false,res);
  }),(err)=>{
    callback(err,null);
  }
}

backToLeadsTable(){//getting back to leads table gowing back from dialog mails component to dialog component
  this.showMailesDialog=false;
  this.showLeadsDialog=true;
  this.availableEmails=[];
  this.availablePhones=[];
  for(let i=0; i<this.leadsPerProductCategory.length; i++){
    this.leadsPerProductCategory[i].Approved=0;
    this.leadsPerProductCategory[i].ischecked=false;
  }
  this.checkedLeadsSize=0;
}

// uploadFileToServer(file:any,callback:any){
//   this.api.uploadFileToServer(file).subscribe((res:any)=>{
//     console.log('response receved is ', res);
//     callback(false,res)
//   })
// }

marketingEmailText(email:any,callback:any){//sending text mail to  checked Leads
  this.api.marketingMailText(JSON.stringify(email)).subscribe((res:any)=>{
    callback(false,res)
  }),(err)=>{
    callback(err,null)
  }
}

marketingEmailPDF(email:any,callback:any){//sending attachment mail to checked leads
   this.api.marketingMailPDF(JSON.stringify(email)).subscribe((res:any)=>{
      callback(false,res)
   }),(err)=>{
    callback(err,null);
   }
}

marketingSMS(SMS:any,callback:any){//sending sms to checked leads
  this.api.marketingSMS(JSON.stringify (SMS)).subscribe((res:any)=>{
    callback(false,res)
  }),(err)=>{
    callback(err,null)
  }
}
}
