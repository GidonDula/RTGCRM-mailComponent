import { Component, OnInit } from '@angular/core';
import { MarketingService } from 'app/servises/marketing.service';
import { ServerApiService } from 'app/servises/server-api.service';
import { sentEmailsLeads,sentPhonesLeads } from 'app/app.component';
import {FormControl ,FormGroup, Validators} from '@angular/forms';


@Component({
  selector: 'app-dialog-mails',
  templateUrl: './dialog-mails.component.html',
  styleUrls: ['./dialog-mails.component.css']
})
export class DialogMailsComponent implements OnInit {

  constructor(private marketingService:MarketingService,private api:ServerApiService) { }

  deliveryOptions:string[]=["Email","SMS","Email&SMS"];//the relevant options for sending emails or SMS or emails&SMS
  availablePhones:string[]=[];//the available phones for sending them SMS
  availableEmails:string[]=[];//the available emails for sending them emails
  availableFullNames:string[]=[];//the available full names of checked leads
  sentEmailsAttach:sentEmailsLeads[]=[];//array of sucsess email attachment
  FailedEmailsAttach:sentEmailsLeads[]=[];//array of failed email attachment
  sentEmailsText:sentEmailsLeads[]=[];//array of sucsess email text
  FailedEmailsText:sentEmailsLeads[]=[];//aray of failed email text
  sentPhones:sentPhonesLeads[]=[];//array of sent SMS
  FailedPhones:sentPhonesLeads[]=[];//array of failed SMS
  myForm:any;//constructor of form for choseeing to send emails SMS  or emails and SMS
  smsForm:any;//constructor of SMS form 
  emailForm:any;//constructor for email form
  smsMailForm:any;//constructor of SMS&Email form
  selectedItem:string;//the selected delivery option (sending email SMS or email& SMS)
  smsSelected:boolean=false;//indication is sending SMS was selected
  mailSelected:boolean=false;//indication if sending email was selected
  smsMailsSelected:boolean=true;//indication if sending email&SMS was selected
  message:string="";//the message for sending SMS form
  phone:string="";//the phone of sending SMS
  TO:string="";//the address of sending emails
  subject:string="";//the subject for sending email form
  html:string="";//the html for sending email form
  PDF:any;//the PDF (file name) of sending email form
 fileInput:any//file Input
 fileInput2:any//second file input
  message2:string="";//the message of sending email&SMS form
  subject2:string="";//the subject of sending email&SMS form
  html2:string="";//the html of sending email&SMS form
  PDF2:any;//the PDF (filename) of sending email&SMS form
  smsSucsess:boolean=false;//true if there was a sucsess in sending SMS
  smsError:boolean=false;//true if there was an error in sending sms
  emailTextSucsess:boolean=false;//true if there was a sucsess in sending email text
  emailTextError:boolean=false;//true if there was an error in sending email text
  emailAttachSucsess:boolean=false;//true if there was a sucsess in sending email text
  emailAttachError:boolean=false;//true if there was an error in sending email atttachmennt
  smsSucsessIndex:number=0;//index of sucsess in sending SMs
  smsFailedIndex:number=0;//index of failures in sending sms
  emailAttachSucsessIndex:number=0;//index of sucsess in sending email arttachment
  emailAttachFailedIndex:number=0;//index of failure in sending email attachment
 emailTextSucsessIndex:number=0;//index of sucsess in sending email text
 emailTextFailedIndex:number=0;//index of failure in sending email text
sentFullName:String="";//the full name of the selected lead to send him email&SMS
uploadedFilesEmail:Array<File>;;//array of files to be uploaded   Email form
uploadedFilesEmailSMS:Array<File>;;//array of files to be uploaded Email&SMS Form
emailFileForm:any//email File Form builder
emailSMSFileForm:any//email&SMS File Form builder


  ngOnInit(): void {//init getting arays of available leads (phones & SMS) and initialize forms
    this.availablePhones=this.marketingService.availablePhones;
    this.availableEmails=this.marketingService.availableEmails;
    this.availableFullNames=this.marketingService.availableFullNames;
      this.myForm=new FormGroup({
        selectedItem:new FormControl("",Validators.required)
      })
      this.smsForm=new FormGroup({
        message:new FormControl("",Validators.required),
      })
      this.emailForm=new FormGroup({
        selectedEmail:new FormControl(),
        subject:new FormControl(),
        html:new FormControl('', Validators.required),
      })
      this.smsMailForm=new FormGroup({
        message2:new FormControl("",Validators.required),
       subject2:new FormControl(),
        html2:new FormControl("",Validators.required),
        PDF2:new FormControl()
      })
      this.emailFileForm=new FormGroup({
        fileInput:new FormControl()
      })
      this.emailSMSFileForm=new FormGroup({
        fileInput2:new FormControl()
      })
      this.PDF2="";
      this.PDF="";
  }

  onChange(newValue:any){//changeing the value of delivery option (sending SMS or email or email&SMS)
    console.log(newValue)
    if(newValue==="SMS"){
      this.smsSelected=true;
      this.mailSelected=false;
      this.smsMailsSelected=false;
    }
    if(newValue==="Email"){
      this.mailSelected=true;
      this.smsSelected=false;
      this.smsMailsSelected=false;
      this.PDF="";
     }
     if(newValue==="Email&SMS"){
        this.smsMailsSelected=true;
        this.mailSelected=false;
        this.smsSelected=false;
        this.PDF2="";
     }

  }

  hideDialog(){//close dialog initialize selected leads carrays and go back to mails componet
    this.marketingService.showMailesDialog=false;
    this.marketingService.availableEmails=[];
    this.marketingService.availablePhones=[];
    for(let i=0; i<this.marketingService.leadsPerProductCategory.length; i++){
      this.marketingService.leadsPerProductCategory[i].Approved=0;
      this.marketingService.leadsPerProductCategory[i].ischecked=false;
    }
    this.marketingService.checkedLeadsSize=0;
  }

  backToLeadsTable(){//back to the leads table dialog component
    this.marketingService.backToLeadsTable();
  }

  fileChangeEmailForm(element:any){//upload the file to the array for uploading it to server
    this.uploadedFilesEmail = element.target.files;
    console.log(element.target.files);
    console.log(this.uploadedFilesEmail);
  }

  fileChangeEmailSMSForm(element:any){//upload the file to the array for uploading it to server
    this.uploadedFilesEmailSMS = element.target.files;
    console.log(element.target.files);
    console.log(this.uploadedFilesEmail);
  }

  onSMSSubmit(data:any){//sending SMS to all available numbers
    this.smsSucsess=false;
    this.smsError=false;
    console.log(data);
    this.smsSucsessIndex=0;
    this.smsFailedIndex=0;
    this.FailedPhones=[];
    this.sentPhones=[];
    this.message=data.message;
    for(let i=0; i<this.availablePhones.length; i++){
    let SMSSelectedPhone={
      sms:{
      phone:this.availablePhones[i],
      message:this.message
      }
    }
    console.log(SMSSelectedPhone);
    this.sentFullName=this.availableFullNames[i];
    this.marketingService.marketingSMS(SMSSelectedPhone,(err:any,res:any)=>{
     if(err){
      let tempFailedPhone:sentPhonesLeads={
        fullName:this.availableFullNames[i],
        phone:this.availablePhones[i]
      }
      this.FailedPhones[this.smsFailedIndex]=tempFailedPhone;
      this.smsFailedIndex++;
       console.log(err);
       this.smsError=true;
     }else{
      let tempSucsessPhone:sentPhonesLeads={
        fullName:this.availableFullNames[i],
        phone:this.availablePhones[i]
      }
      this.sentPhones[this.smsSucsessIndex]=tempSucsessPhone;
      this.smsSucsessIndex++;
       console.log(res);
       this.smsSucsess=true;
     }
    })
  }
  this.smsForm.controls['message'].setValue(' ');
  }

  uploadFileEmailFormToServer(){//uploading files to server for email form
    let formData = new FormData();
    for (var i = 0; i < this.uploadedFilesEmail.length; i++) {
        formData.append("uploads[]", this.uploadedFilesEmail[i], this.uploadedFilesEmail[i].name);
    }
    this.PDF=this.uploadedFilesEmail[0].name;
    this.fileInput=this.uploadedFilesEmail[0].name;
    this.api.uploadFileToServer(formData)
            .subscribe((response) => {
                console.log('response received is ', response);
            })
  }

  uploadFileEmaiSMSlFormToServer(){//uploading files to server for email&SMS form
    let formData = new FormData();
    for (var i = 0; i < this.uploadedFilesEmailSMS.length; i++) {
        formData.append("uploads[]", this.uploadedFilesEmailSMS[i], this.uploadedFilesEmailSMS[i].name);
    }
    this.PDF2=this.uploadedFilesEmailSMS[0].name;
    this.fileInput2=this.uploadedFilesEmailSMS[0].name;
    this.api.uploadFileToServer(formData)
            .subscribe((response) => {
                console.log('response received is ', response);
            })
  }

  onEmailSubmit(data:any){//sending an email to all avaible email addresses
    console.log(this.fileInput);
    this.emailAttachError=false;
    this.emailAttachSucsess=false;
    this.emailTextError=false;
    this.emailTextSucsess=false;
     console.log(data);
     this.emailAttachSucsessIndex=0;
     this.emailAttachFailedIndex=0;
     this.emailTextSucsessIndex=0;
     this.emailTextFailedIndex=0;
     this.FailedEmailsAttach=[];
     this.sentEmailsAttach=[];
     this.FailedEmailsText=[];
     this.sentEmailsText=[];
    for(let i=0; i<this.availableEmails.length; i++){ 
      this.subject=data.subject;
      this.html=data.html;
      console.log(this.PDF)
      console.log(this.PDF.length)
      if((this.PDF!==null)&&(this.PDF!=="")&&(this.fileInput!==null)){//if there is an attachment add the file name to email object
       let Email={
         mail: { 
         email:this.availableEmails[i],
         subject:this.subject,
         message:this.html,
         attachment:this.PDF
         }
       }
       console.log(Email);
       this.sentFullName=this.availableFullNames[i];
        this.marketingService.marketingEmailPDF(Email,(err:any,res:any)=>{
            if(err){
             console.log(err);
             this.emailAttachError=true;
             let tempFailedEmail:sentEmailsLeads={
              fullName:this.availableFullNames[i],
              email:this.availableEmails[i]
             }
             this.FailedEmailsAttach[this.emailAttachFailedIndex]=tempFailedEmail;
             this.emailAttachFailedIndex++;
            } else {
             console.log(res);
             this.emailAttachSucsess=true;
             let tempSucsessEmail:sentEmailsLeads={
              fullName:this.availableFullNames[i],
              email:this.availableEmails[i]
             }
             this.sentEmailsAttach[this.emailAttachSucsessIndex]=tempSucsessEmail;
             this.emailAttachSucsessIndex++;
            }
        }) 
     }else{//else sending email text
       let Email={
         mail: { 
         email:this.availableEmails[i],
         subject:this.subject,
         message:this.html,
         }
       }
       console.log(Email);
       this.sentFullName=this.availableFullNames[i];
       this.marketingService.marketingEmailText(Email,(err:any,res:any)=>{
         if(err){
            console.log(err);
            let tempFailedEmail:sentEmailsLeads={
              fullName:this.availableFullNames[i],
              email:this.availableEmails[i]
             }
            this.emailTextError=true;
            this.FailedEmailsText[this.emailTextFailedIndex]=tempFailedEmail;
            this.emailTextFailedIndex++;
         }else{
            console.log(res);
            this.emailTextSucsess=true;
            let tempSucsessEmail:sentEmailsLeads={
              fullName:this.availableFullNames[i],
              email:this.availableEmails[i]
            }
            this.sentEmailsText[this.emailTextSucsessIndex]=tempSucsessEmail;
            this.emailTextSucsessIndex++;
         }
       })
     }
    }
    this.emailForm.controls['subject'].setValue(' ');
    this.emailForm.controls['html'].setValue(' ');
  }


  onSMSMailSubmit(data:any){//submitting the form for sending email&SMS
    this.smsSucsess=false;
    this.smsError=false;
    this.emailAttachError=false;
    this.emailAttachSucsess=false;
    this.emailTextError=false;
    this.emailTextSucsess=false;
    this.FailedPhones=[];
    this.sentPhones=[];
    this.FailedEmailsAttach=[];
    this.sentEmailsAttach=[];
    this.FailedEmailsText=[];
    this.sentEmailsText=[];
    console.log(this.fileInput2);
    console.log(data);
    this.message2=data.message2;
    this.html2=data.html2;
    this.subject2=data.subject2;
    for(let i=0; i<this.availableEmails.length;i++){
      let SMSSelectedPhone={//send SMS to available numbers
        sms:{
        phone:this.availablePhones[i],
        message:this.message2
        }
      }
      console.log(SMSSelectedPhone);
      this.sentFullName=this.availableFullNames[i];
      this.marketingService.marketingSMS(SMSSelectedPhone,(err:any,res:any)=>{
       if(err){
        let tempFailedPhone:sentPhonesLeads={
          fullName:this.availableFullNames[i],
          phone:this.availablePhones[i]
        }
        this.FailedPhones[this.smsFailedIndex]=tempFailedPhone;
        this.smsFailedIndex++;
         console.log(err);
         this.smsError=true;
       }else{
        let tempSucsessPhone:sentPhonesLeads={
          fullName:this.availableFullNames[i],
          phone:this.availablePhones[i]
        }
        this.sentPhones[this.smsSucsessIndex]=tempSucsessPhone;
        this.smsSucsessIndex++;
         console.log(res);
         this.smsSucsess=true;
       }
      })
      console.log(this.PDF2)
      console.log(this.PDF2.length)
      if((this.PDF2!==null)&&(this.PDF2!=="")&&(this.fileInput2!==null)){//if there is an attachment send email attachment to available email addresses
        let Email={
          mail: { 
          email:this.availableEmails[i],
          subject:this.subject2,
          message:this.html2,
          attachment:this.PDF2
          }
        }
        console.log(Email)
        this.sentFullName=this.availableFullNames[i];
         this.marketingService.marketingEmailPDF(Email,(err:any,res:any)=>{
             if(err){
              console.log(err);
              this.emailAttachError=true;
             let tempFailedEmail:sentEmailsLeads={
              fullName:this.availableFullNames[i],
              email:this.availableEmails[i]
             }
             this.FailedEmailsAttach[this.emailAttachFailedIndex]=tempFailedEmail;
             this.emailAttachFailedIndex++;
             }else{
              console.log(res);
              this.emailAttachSucsess=true;
              let tempSucsessEmail:sentEmailsLeads={
                fullName:this.availableFullNames[i],
                email:this.availableEmails[i]
               }
               this.sentEmailsAttach[this.emailAttachSucsessIndex]=tempSucsessEmail;
               this.emailAttachSucsessIndex++;
             }
         }) 
      }else{//else send email text to available email addresses
        let Email={
          mail: { 
          email:this.availableEmails[i],
          subject:this.subject2,
          message:this.html2,
          }
        }
        console.log(Email);
        this.sentFullName=this.availableFullNames[i];
        this.marketingService.marketingEmailText(Email,(err:any,res:any)=>{
          if(err){
             console.log(err);
             let tempFailedEmail:sentEmailsLeads={
              fullName:this.availableFullNames[i],
              email:this.availableEmails[i]
             }
            this.FailedEmailsText[this.emailTextFailedIndex]=tempFailedEmail;
            this.emailTextFailedIndex++;
             this.emailTextError=true;
          }else{
             console.log(res);
             this.emailTextSucsess=true;
             let tempSucsessEmail:sentEmailsLeads={
              fullName:this.availableFullNames[i],
              email:this.availableEmails[i]
            }
            this.sentEmailsText[this.emailTextSucsessIndex]=tempSucsessEmail;
            this.emailTextSucsessIndex++;
          }
        })
      }
    }
    this.smsMailForm.controls['message2'].setValue(' ');
    this.smsMailForm.controls['subject2'].setValue(' ');
    this.smsMailForm.controls['html2'].setValue(' ');
  }
}
