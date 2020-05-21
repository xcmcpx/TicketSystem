const DataLoader = require('dataloader');

const Ticket = require('../../models/ticket');
const Company = require('../../models/company');
const Project = require('../../models/project');
const User = require('../../models/user');
const BillingTime = require('../../models/billingtime');
const Note = require('../../models/note');

const ticketsLoader = new DataLoader(ticketIds => {
    return tickets(ticketIds);
});

const ticketLoader = new DataLoader(id => {
    return Ticket.find({ _id: {$in: id} });
})

const companyLoader = new DataLoader(companyIds => {
    return Company.find({ _id: {$in: companyIds} });
});

const projectsLoader = new DataLoader(projectIds =>{
    return projects(projectIds);
});

const projectLoader = new DataLoader(projectIds => {
    return Project.find({ _id: {$in: projectIds} });
});
const userLoader = new DataLoader(userIds => {
    return User.find({ _id: { $in: userIds } });
});
const billingTimeLoader = new DataLoader(bTimeIds => {
    return BillingTime.find({ _id: { $in: bTimeIds } });
});
const billingTimesLoader = new DataLoader(bTimeIds => {
    return billingTimes(bTimeIds);
});
const noteLoader = new DataLoader(noteIds => {
    return Note.find({ _id: { $in: noteIds } });
});
const notesLoader = new DataLoader(noteIds => {
    return notes(noteIds);
});

const dateToString = date => new Date(date).toISOString();

const tickets = async ticketIds => {
    try {
        const tickets = await Ticket.find({ _id: { $in: ticketIds } });
        tickets.sort((a, b) => {
            return (
                ticketIds.indexOf(a._id.toString()) - ticketIds.indexOf(b._id.toString())
            );
        });
        return tickets.map(ticket => {
            return transformTicket(ticket);
        });
    }
    catch(err){
        throw err;
    }
};
const ticket = async ticketId => {
    try{
        const ticket = await ticketLoader.load(ticketId.toString());
        return {
            ...ticket._doc,
            _id: ticket.id,
            creator: () => userLoader.load(ticket._doc.creator),
            project: () => projectLoader.load(ticket._doc.project),
            company: () => companyLoader.load(ticket._doc.company),
            assignedUser: () => userLoader.load(ticket._doc.assignedUser),
        }
    }
    catch(err){
        throw(err);
    }
}

const company = async companyId => {
    try {
        const company = await companyLoader.load(companyId.toString());
        return {
            ...company._doc,
            _id: company.id,
            creator: () => userLoader.load(company._doc.creator),
            users: () => userLoader.loadMany(company._doc.users),
            tickets: () => ticketsLoader.loadMany(company._doc.tickets),
            projects: () => projectsLoader.loadMany(company._doc.projects)
        };
    } 
    catch(err){
        throw err;
    }
};

const user = async userId => {
    try {
        const user = await userLoader.load(userId.toString());
        return {
            ...user._doc,
            _id: user.id,
            company: () => companyLoader.load(user._doc.company),
            tickets: () => ticketsLoader.loadMany(user._doc.tickets),
            projects: () => projectsLoader.loadMany(user._doc.projects)
        };
    }
    catch (err){
        throw err;
    }
};

const users = async userIds => {
    try {
        const users = await User.find({ _id: { $in: userIds } });
        users.sort((a, b) => {
            return (
                userIds.indexOf(a._id.toString()) - userIds.indexOf(b._id.toString())
            );
        });
        return users.map(user => {
            return transformUser(user);
        });
    }
    catch(err){
        throw err;
    }
};

const projects = async projectIds => {
    try {
        const projects = await Project.find({ _id: { $in: projectIds } });
        projects.sort((a, b) => {
            return (
                projectIds.indexOf(a._id.toString()) - projectIds.indexOf(b._id.toString())
            );
        });
        return projects.map(project => {
            return transformProject(project);
        });
    }
    catch(err){
        throw err;
    }
};

const project = async projectId => {
    try {
        const project = await projectLoader.load(projectId.toString());
        return {
            ...project._doc,
            _id: project.id,
            creator: () => userLoader.load(project._doc.creator),
            associatedUsers: () => userLoader.loadMany(project._doc.associatedUsers),
            tickets: () => ticketsLoader.loadMany(project._doc.tickets),
            company: () => companyLoader.load(project._doc.company)
        };
    }
    catch(err){
        throw err;
    }
};

const billingTime = async bTimeId => {
    try{
        const billingTime = await billingTimeLoader.load(bTimeId.toString());
        return {
            ...billingTime._doc,
            _id: billingTime.id,
            user: () => userLoader.load(billingTime._doc.user),
            ticket: () => ticketLoader.load(billingTime._doc.ticket),
            note: () => noteLoader.load(billingTime._doc.note)
        };
    }
    catch(err){
        throw err;
    }
}
const billingTimes = async bTimeIds => {
    try {
        const billingTimes = await BillingTime.find({ _id: { $in: bTimeIds } });
        billingTimes.sort((a, b) => {
            return (
                bTimeIds.indexOf(a._id.toString()) - bTimeIds.indexOf(b._id.toString())
            );
        });
        return billingTimes.map(bTime => {
            return transformBillingTime(bTime);
        });
    }
    catch(err){
        throw err;
    }
};
const note = async noteId => {
    try{
        const note = await noteLoader.load(noteId.toString());
        return {
            ...note._doc,
            _id: note.id,
            user: () => userLoader.load(note._doc.user),
            ticket: () => ticketLoader.load(note._doc.ticket)
        };
    }
    catch(err){
        throw err;
    }
}
const notes = async noteIds => {
    try {
        const notes = await Note.find({ _id: { $in: noteIds } });
        notes.sort((a, b) => {
            return (
                noteIds.indexOf(a._id.toString()) - noteIds.indexOf(b._id.toString())
            );
        });
        return notes.map(note => {
            return transformNote(note);
        });
    }
    catch(err){
        throw err;
    }
};


const transformTicket = tkt => {
    return {
        ...tkt._doc,
        _id: tkt.id,
        project: project.bind(this, tkt.project),
        company: company.bind(this, tkt.company),
        assignedUser: user.bind(this, tkt.assignedUser),
        creator: user.bind(this, tkt.creator),
        createdAt: dateToString(tkt._doc.createdAt),
        updatedAt: dateToString(tkt._doc.updatedAt)
    }
};

const transformCompany = cmp => {
    return {
        ...cmp._doc,
        _id: cmp.id,
        users: users.bind(this, cmp.users),
        projects: projects.bind(this, cmp.projects),
        tickets: tickets.bind(this, cmp.tickets)
    };
};

const transformProject = proj => {
    return {
        ...proj._doc,
        _id: proj.id,
        creator: user.bind(this, proj.creator),
        associatedUsers: users.bind(this, proj.associatedUsers),
        company: company.bind(this, proj.company),
        tickets: tickets.bind(this, proj.tickets)
    };
};

const transformUser = u => {
    return {
        ...u._doc,
        _id: u.id,
        company: company.bind(this, u.company),
        projects: projects.bind(this, u.projects),
        tickets: tickets.bind(this, u.tickets)
    };
};

const transformBillingTime = bt => {
    return {
        ...bt._doc,
        _id: bt.id,
        user: user.bind(this, bt.user),
        ticket: ticket.bind(this, bt.ticket),
        note: note.bind(this, bt.note)
    }
}
const transformNote = n => {
    return {
        ...n._doc,
        _id: n.id,
        user: user.bind(this, n.user),
        ticket: ticket.bind(this, n.ticket),
    }
}

exports.transformUser = transformUser;
exports.transformCompany = transformCompany;
exports.transformProject = transformProject;
exports.transformTicket = transformTicket;
exports.transformBillingTime = transformBillingTime;
exports.transformNote = transformNote;