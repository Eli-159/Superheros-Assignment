const Database = require('./database.js');

const database = new Database();

// database.createUser({
//     firstName: 'Eli',
//     lastName: 'Gearing',
//     email: 'eli.gearing@gmail.com',
//     password: 'Password',
//     joinDate: '2023-07-11'
// }).then(console.log);

// database.getUser(3).then(console.log).catch(console.error);

database.getForumPosts(1).then(console.log);