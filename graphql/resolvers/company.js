const Company = require('../../models/company');

const { transformCompany } = require('./merge');

module.exports = {
    companies: async (args, req) => {
        // if (!req.isAuth) {
        //     throw new Error('Unauthenticated!');
        //   }
        try {
            const companies = await Company.find();
            return companies.map(c => {
                return transformCompany(c);
            });
        }
        catch(err){
            console.log(err);
            throw err;
        }
    },
    createCompany: async (args, req) => {
        // if (!req.isAuth) {
        //     throw new Error('Unauthenticated!');
        //   }
        const company = new Company({
            name: args.companyInput.name,
            users: args.companyInput.users
        });
        let createdCompany;
        try{
            const result = await company.save();
            createdCompany = transformCompany(result);

            const creator = await User.findById(req.userId);
            if(!creator){
                throw new Error('User not found.');
            }
            await creator.save();

            return createdCompany;
        }
        catch(err){
            console.log(err);
            throw err;
        }
    }
};