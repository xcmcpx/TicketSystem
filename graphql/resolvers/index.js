const ticketResolver = require('./ticket');
const projectResolver = require('./project');
const companyResolver = require('./company');
const authResolver = require('./auth');
const billingTimeResolver = require('./billingtime');
const noteResolver = require('./note');

const rootResolver = {
    ...authResolver,
    ...ticketResolver,
    ...projectResolver,
    ...companyResolver,
    ...billingTimeResolver,
    ...noteResolver,
};

module.exports = rootResolver;