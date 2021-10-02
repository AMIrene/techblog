const sequelize = require('../config/connection');
const commentsSeed = require('./commentsSeed.json');
const postSeed = require('./postSeed.json');
const userSeed = require('./userSeed.json');


const seedAll = async () => {
    await sequelize.sync({ force: true });
  
    await commentsSeed();
  
    await postSeed();
    
    await userSeed();
  
    process.exit(0);
  };
  
  seedAll();
  
