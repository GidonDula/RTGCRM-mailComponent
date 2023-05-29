import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IsLoggedService } from '../components/admin/is-logged.service';
 
@Injectable()
export class ServerApiService {
  constructor(
    private http: HttpClient,
    private isLoggedService: IsLoggedService,
  ) { }

  private localURL="http://localhost:3083";

  private devUrl="https://rt-dev.xyz:3083";

 /******************** new gidon**************************** */

 getCategories(){  //getting the categories from DB and returning to client
    let token: string = 'Token ' + this.isLoggedService.getToken();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token
      })
    };
    return this.http.get(this.devUrl+'/api/Marketing/getCategories',httpOptions);
  }
  
  getSourceLeads(){ //getting the sources of leads from DB to client
    let token: string = 'Token ' + this.isLoggedService.getToken();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token
      })
    };
    return this.http.get(this.devUrl+'/api/Marketing/getLeadsSource',httpOptions);
  }
  
  getPathsPerCategory(category:any){//getting the paths that relevant to each caegory
    let token: string = 'Token ' + this.isLoggedService.getToken();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token
      })
    };
    return this.http.get(this.devUrl+'/api/Marketing/getPathsPerCategory/'+category,httpOptions);
  }
  
  getLeadsPerProductCategory(productCategory:any){//getting the leads that relevant to each product category(path number)
    let token: string = 'Token ' + this.isLoggedService.getToken();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token
      })
    };
     return this.http.get(this.devUrl+'/api/Marketing/getLeadsPerProductCategory/'+productCategory,httpOptions);
  }
  
  leadsPerProductCategoryAndBetweenDates(data){//getting the leads between dates that relevant to each product category (path number)
    let token: string = 'Token ' + this.isLoggedService.getToken();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token
      })
    };
    return this.http.post(this.devUrl+'/api/Marketing/leadsPerProductCategoryBetweenDates',data,httpOptions);
  }
  
   uploadFileToServer(data):Observable<any>{//upload the given files to server
     let token: string = 'Token ' + this.isLoggedService.getToken();
     const httpOptions = {
       headers: new HttpHeaders({
         'Content-Type': 'application/json',
         'Authorization': token
       })
     };
     return this.http.post(this.devUrl+"/api/Marketing/uploadPDF",data);
  }
  
  
  marketingMailText(data){//sending email text to relevantik email addresses
    let token: string = 'Token ' + this.isLoggedService.getToken();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token
      })
    };
     return this.http.post(this.devUrl+"/api/Marketing/emailText",data,httpOptions);
  }
  
  marketingMailPDF(data){ //sending mail attachment to relevantik email addresses
    let token: string = 'Token ' + this.isLoggedService.getToken();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token
      })
    };
     return this.http.post(this.devUrl+"/api/Marketing/emailPDF",data,httpOptions);
  }
  
  marketingSMS(data){ //sending sms text to relevantik phones
    let token: string = 'Token ' + this.isLoggedService.getToken();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token
      })
    };
    return this.http.post(this.devUrl+'/api/Marketing/sms',data,httpOptions);
}
}