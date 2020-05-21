const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { transformUser } = require('./merge');

const User = require('../../models/user');
const Company = require('../../models/company');

module.exports = {
  users: async (args, req) => {
    // if (!req.isAuth) {
    //     throw new Error('Unauthenticated!');
    //   }
    try {
        const users = await User.find();
        return users.map(u => {
            return transformUser(u);
        });
    }
    catch(err) {
        throw err;
    }
},
  user: async(args, req) => {
    try {
      const user = await User.findById(req.userId);
      return transformUser(user);
    }
    catch(err){
      throw err;
    }
  },
  createUser: async args => {
    try {
      const existingUser = await User.findOne({ email: args.userInput.email });
      if (existingUser) {
        throw new Error('User exists already.');
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

      const user = new User({
        email: args.userInput.email,
        password: hashedPassword,
        company: args.userInput.company
      });

      const result = await user.save();

      const company = await Company.findById(args.userInput.company)
      if(!company){
          throw new Error('Company not found.');
      }
      company.users.push(user);
      await company.save();

      return { ...result._doc, password: null, _id: result.id };
    } catch (err) {
      throw err;
    }
  },
  login: async ({ email, password }) => {
    const user = await User.findOne({ email: email });
    if (!user) {
      throw new Error('User does not exist!');
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      throw new Error('Password is incorrect!');
    }
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      'theblackbirdsleepsatdawn',
      {
        expiresIn: '1h'
      }
    );
    return { userId: user.id, token: token, tokenExpiration: 1 };
  }
};