const pgconfig = require("../../postgress.config");
const { Client } = require("pg");

const getClient = () => {
  const { user, host, database, password, port } = pgconfig;
  return new Client({
    user, host, database, password, port
  });
}

const client = getClient();

const connectDb = async () => {
  try {
    await client.connect();
  } catch (error) {
    console.error("Error : check the database config or follow read me", error);
    // return 0;
    // throw error
  }
}

const selectTable = async(tableName) => {  
  try {
    let result = await client.query(`select * from ${tableName}`);    
    return result.rows;
  } catch(error){
    console.log("Table not exist");
  }
}

const droptTable = async(tableName) => {
  try {
    await client.query(`Drop table ${tableName}`);
  } catch(error){    
    // console.log("Table not exist");
  }
}

module.exports = {
  client,
  connectDb,
  selectTable,
  droptTable
}
