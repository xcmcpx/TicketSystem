const Project = require('../../models/project');
const Company = require('../../models/company');
const Ticket = require('../../models/ticket');
const User = require('../../models/user');

const { transformTicket } = require('./merge');

module.exports = {
    tickets: async (args, req) => {
        // if (!req.isAuth) {
        //     throw new Error('Unauthenticated!');
        //   }
        try {
            const tickets = await Ticket.find();
            return tickets.map(ticket => {
                return transformTicket(ticket);
            });
        }
        catch(err) {
            throw err;
        }
    },
    createTicket: async (args, req) => {
        // if (!req.isAuth) {
        //     throw new Error('Unauthenticated!');
        //   }
        const ticket = new Ticket({
            title: args.ticketInput.title,
            description: args.ticketInput.description,
            project: args.ticketInput.project,
            company: args.ticketInput.company,
            creator: req.userId,
            assignedUser: args.ticketInput.assignedUser
        });
        let createdTicket;
        try {
            const result = await ticket.save();

            createdTicket = transformTicket(result);
            
            // const creator = await User.findById(req.userId);
            // if(!creator){
            //     throw new Error('User not found.');
            // }
            // creator.tickets.push(ticket);
            // await creator.save();

            const project = await Project.findById(args.ticketInput.project)
            if(!project){
                throw new Error('Project not found.');
            }
            project.tickets.push(ticket);
            await project.save();

            const company = await Company.findById(args.ticketInput.company)
            if(!company){
                throw new Error('Company not found.');
            }
            company.tickets.push(ticket);
            await company.save();
            
            const assignedUser = await User.findById(args.ticketInput.assignedUser)
            if(!assignedUser){
                throw new Error('User not found!');
            }

            return createdTicket;
        }
        catch(err) {
            console.log(err);
            throw err;
        }
    },
    closeTicket: async (args, req) => {
        const ticket = await Ticket.findById(args.closeInput.ticketId);
        if(!ticket){
            throw new Error('Ticket not found!');
        }
        let closedTicket;
        try{
            ticket.closed = true;
            await ticket.save();

            closedTicket = transformTicket(ticket);

        }catch(err){
            console.log(err);
            throw err;
        }

        return closedTicket;
    },
    openTickets: async (args, req) => {
        try {
            const tickets = await Ticket.find();
            return tickets.filter(ticket => ticket.closed !== true)
            .filter(t => t.assignedUser == req.userId)
            .map(ticket => transformTicket(ticket));
            // }).filter(ticket => {
            //     if(ticket.assignedUser === req.userId){
            //         return transformTicket(ticket);
            //     }
            // });
        }
        catch(err) {
            throw err;
        }
    },
    openTicket: async (args, req) => {
        const ticket = await Ticket.findById(args.openInput.ticketId);
        if(!ticket){
            throw new Error('Ticket not found!');
        }
        let openedTicket;
        try{
            ticket.closed = false;
            await ticket.save();

            openedTicket = transformTicket(ticket);

        }catch(err){
            console.log(err);
            throw err;
        }

        return openedTicket;
    },
    changeStatus: async(args, req) => {
        const ticket = await Ticket.findById(args.statusInput.ticketId);
        if(!ticket){
            throw new Error('Ticket not found!');
        }
        let updatedTicket;
        try{
            ticket.status = args.statusInput.newStatus;
            await ticket.save();

            updatedTicket = transformTicket(ticket);
        }catch(err){
            console.log(err);
            throw err;
        }
        return updatedTicket;
    }
}