const { MarketingService } = require('../services/MarketingService');
const { SmsDataService } = require('../services/smsDataService');
const { MailDataService } = require('../services/mailDataService');
const fs = require('fs');
const uploadPath = './client/mail-attachments/';

class MarketingController {

    constructor() {
        this.MarketingService = new MarketingService();
        this.SmsDataSevice = new SmsDataService();
        this.MailDataService = new MailDataService();
    }

    getCategories(req, res) { //returning the categories to the client
        this.MarketingService.getCategories((data, error) => {
            return res.json(data);
        })
    }

    getLeadsSource(req, res) { //returning the leads source to the client
        this.MarketingService.getSourceLeads((data, error) => {
            return res.json(data);
        })
    }

    getPathsPerCategory(req, res, category) { //returning the paths per category to the client
        this.MarketingService.getPathsPerCategory(category, (data) => {
            return res.json(data);
        })
    }

    getLeadsPerProductCategory(req, res, productCategory) { //returning the leads that relevant to each product category(path number) to the client
        this.MarketingService.leadsPerProductCategory(productCategory, (data) => {
            console.log(productCategory);
            return res.json(data);
        })
    }

    leadsBetweenDates(req, res) { //returning the leads between dates that relevant to each product category(path number) to the client 
        let date1 = req.body.date1;
        let date2 = req.body.date2;
        let productCategory = req.body.productCategory;
        console.log(date1, date2, productCategory);
        this.MarketingService.leadsBetweenDates(date1, date2, productCategory, (data) => {
            return res.json(data);
        })
    }

    uploadFileAndUpdateItsName(req, res) { //upload fies to server
        console.log(req.files);
        var tmp_path = req.files.uploads[0].path;
        console.log(tmp_path);
        let userFileName = req.files.uploads[0].name;
        console.log(userFileName);
        var targetName = uploadPath + userFileName;
        fs.rename(tmp_path, targetName, function(err) {
            if (err) throw err;
            fs.unlink(tmp_path, function() {
                if (err) throw err;
                res.json({
                    'message': 'File uploaded succesfully.'
                });
            });
        })
    }

    smsText(req, res) { //sending sms to relevant numbers
        const { body: { sms } } = req;
        console.log('sms ', sms);
        console.log(sms.phone);
        console.log(sms.message);
        let message = {
            phone: sms.phone,
            message: sms.message,
            source: "RT_CRM"
        }
        this.SmsDataSevice.newSms(message, (answer) => {
            console.log(answer.data);
            return res.json(answer.data);
        });
    }


    mailAttachmentPDF(req, res) { //sending mail attachment to relevantik email addresses
        const { body: { mail } } = req;
        this.MailDataService.mailAttachmentPDF(mail, (data) => {
            return res.json(data);
        });
    }

    mailText(req, res) { //sending mail text to relevantik email addresses
        const { body: { mail } } = req;
        console.log('mail:', mail);
        this.MailDataService.mailText(mail, (data) => {
            console.log(data);
            return res.json(data);
        });
    }
}

module.exports = {
    MarketingController: new MarketingController()
}