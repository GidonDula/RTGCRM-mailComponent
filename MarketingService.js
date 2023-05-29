let db = require('./sqlConnection');
const mysql2 = require("mysql2");


class MarketingService {
    constructor() {
        this.persons = db.client;
        this.students = db.clientStudents;
        this.SELECT_CATEGORIES = "select distinct category from path;"
        this.SELECT_PATHS = "select pathCode, pathName from path where category=?"
        this.LEADS_PER_PRODUCT_CATEGORY = "select lead_id,leads.entry_timestamp,leads.first_name,leads.last_name,leads.phone_1,leads.email,leads.source,leads.source_details,leads.status,leads.priority,leads.product_id,leads.person_id from leads join person on leads.person_id=person.person_id   where leads.product_id=? and person.no_call=0 order by entry_timestamp desc";
        this.SOURCE_LEADS = "select distinct source from leads"
        this.LEADS_BETWEEN_DATES = "select lead_id,leads.entry_timestamp,leads.first_name,leads.last_name,leads.phone_1,leads.email,leads.source,leads.source_details,leads.status,leads.priority,leads.product_id,leads.person_id from leads join person on leads.person_id=person.person_id   where leads.entry_timestamp>=? and leads.entry_timestamp<=?  and leads.product_id=? and person.no_call=0 order by entry_timestamp desc;"
        this.GET_API_KEY = 'select api_key from api_config where name ="SEND_EMAIL"'
    }

    leadsPerProductCategory(productCategory, callback) { //get thye leads that relevant to each product category(path number)
        let query = this.LEADS_PER_PRODUCT_CATEGORY;
        this.persons.query(query, [productCategory], (err, results) => {
            if (err) console.log(err.message)
            else callback(results);
        })
    }

    leadsBetweenDates(date1, date2, productCategory, callback) { //get leads between dates to each product category(path number)
        let query = this.LEADS_BETWEEN_DATES;
        this.persons.query(query, [date1, date2, productCategory], (err, results) => {
            if (err) console.log(err.message)
            else callback(results)
        })
    }

    getPathsPerCategory(category, callback) { //getting the paths for each category
        let query = this.SELECT_PATHS;
        this.students.query(query, [category], (err, results) => {
            if (err) console.log(err.message)
            callback(results);
        })
    }

    getCategories(callback) { //getting the categories from DB
        let query = this.SELECT_CATEGORIES;
        this.students.query(query, (err, results) => {
            if (err) console.log(err.message)
            callback(results);
        })
    }

    getSourceLeads(callback) { //getting the sources of leads from DB
        let query = this.SOURCE_LEADS;
        this.persons.query(query, (err, results) => {
            if (err) console.log(err.message)
            callback(results);
        })
    }

    getApiKey(callback) { //getting the apikey from DB
        let query = this.GET_API_KEY
        this.students.query(query, (err, results) => {
            if (err) console.log(err.message)
            callback(results);
        })
    }
}

module.exports = {
    MarketingService: MarketingService
}