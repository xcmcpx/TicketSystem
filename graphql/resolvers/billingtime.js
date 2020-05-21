const Ticket = require('../../models/ticket');
const BillingTime = require('../../models/billingtime');

const { transformBillingTime } = require('./merge');

module.exports = {
    logTime: async (args, req) => {
        // if (!req.isAuth) {
        //     throw new Error('Unauthenticated!');
        //   }
        const billingTime = new BillingTime({
            user: args.billingTimeInput.userId,
            ticket: args.billingTimeInput.ticketId,
            time: args.billingTimeInput.time,
            note: args.billingTimeInput.noteId
        });
        let createdTime;
        try {
            const result = await billingTime.save();

            createdTime = transformBillingTime(result);
            
            const ticket = await Ticket.findById(args.billingTimeInput.ticketId);
            if(!ticket){
                throw new Error('Ticket not found.');
            }
            ticket.hours.push(billingTime);
            await ticket.save();
            
            return createdTime;
        }
        catch(err) {
            console.log(err);
            throw err;
        }
    },

}