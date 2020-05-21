const Project = require('../../models/project');
const Company = require('../../models/company');
const Ticket = require('../../models/ticket');
const User = require('../../models/user');

const { transformProject } = require('./merge');

module.exports = {
    
    projects: async (args, req) => {
        // if (!req.isAuth) {
        //     throw new Error('Unauthenticated!');
        //   }
        try {
            const projects = await Project.find();
            return projects.map(p => {
                return transformProject(p);
            });
        }
        catch(err){
            console.log(err);
            throw err;
        }
    },
    createProject: async (args, req) => {
        // if (!req.isAuth) {
        //     throw new Error('Unauthenticated!');
        //   }
        const project = new Project({
            title: args.projectInput.title,
            description: args.projectInput.description,
            company: args.projectInput.company,
            creator: req.userId,
            associatedUsers: args.projectInput.associatedUsers
        });
        let createdProject;
        try{
            const result = await project.save();
            createdProject = transformProject(result);
            const company = await Company.findById(args.projectInput.company)
            if(!company){
                throw new Error('Company not found.');
            }
            company.projects.push(project);
            await company.save();

            const creator = await User.findById(req.userId);
            if(!creator){
                throw new Error('User not found.');
            }
            creator.projects.push(project);
            await creator.save();

            return createdProject;
        }
        catch(err){
            console.log(err);
            throw err;
        }
    }
};