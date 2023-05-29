const router = require('express').Router();
const auth = require('../auth');
const uploadPath = './client/mail-attachments/';
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart({ uploadDir: uploadPath });

const { MarketingController } = require('../../controllers/MarketingController');

router.get('/getCategories', auth.required, (req, res) => MarketingController.getCategories(req, res)); //getting the categories from DB and returning to client

router.get('/getPathsPerCategory/:category', auth.required, (req, res) => { //getting the paths that relevant to each caegory
    let { category } = req.params;
    console.log(category)
    MarketingController.getPathsPerCategory(req, res, category);
})

router.get('/getLeadsPerProductCategory/:ProductCategory', auth.required, (req, res) => { //getting the leads that relevant to each product category
    let { ProductCategory } = req.params;
    console.log(ProductCategory)
    MarketingController.getLeadsPerProductCategory(req, res, ProductCategory);
})

router.get('/getLeadsSource', auth.required, (req, res) => { //getting the sources of leads from DB to clent
    MarketingController.getLeadsSource(req, res);
})

router.post('/leadsPerProductCategoryBetweenDates', auth.required, (req, res) => MarketingController.leadsBetweenDates(req, res)); //getting the leads between dates that relevant to each product category (path number)

router.post('/emailText', auth.required, (req, res) => { //sending email text to relevantik email addresses
    const { body: { mail } } = req;
    console.log(mail);
    console.log(req.body);
    MarketingController.mailText(req, res)
});

router.post('/emailPDF', auth.required, (req, res) => {
    const { body: { mail } } = req;
    console.log(mail);
    console.log(req.body);
    console.log(mail.attachment);
    if ((mail.attachment === null) || (mail.attachment === "") || (mail.attachment === undefined)) {
        MarketingController.mailText(req, res)
    } else { MarketingController.mailAttachmentPDF(req, res) }

}); //sending mail attachment to relevantik email addresses

router.post('/uploadPDF', multipartMiddleware, (req, res) => { //uploading files to server
    MarketingController.uploadFileAndUpdateItsName(req, res);
})
router.post('/sms', auth.required, (req, res) => { //sending sms text to relevantik phones
    const { body: { sms } } = req;
    console.log('sms ', sms);
    MarketingController.smsText(req, res)
});

module.exports = router;