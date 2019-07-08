const {client, connectDb, droptTable, selectTable} = require("./dbHelper");

const createTable = async(tableName) => {   
    await droptTable(tableName);
    try {
      let query = `CREATE TABLE ${tableName} (
        master_circle text not null,
        parent_circle int not null,
        children_circle int not null,
        parent_size int not null,
        children_size int not null,
        parent_tooltip int not null,
        children_tooltip int not null
      )`;

      await client.query(query);      
    } catch (error) {     
      console.error("Error in create table");
    }
  }

const insert = async(obj, config) => {  
  try { 
    let newObj = {}
    for (key of Object.keys(config)) {      
      if(obj[config[key]])
        newObj[key] = obj[config[key]];      
    }

    let value="";
    for (let char=0;char < Object.keys(newObj).length;char++){
      value +="$"+(char+1)+",";
    }    

    let text = `INSERT INTO ${config.table}(${Object.keys(newObj).join(",")}) 
                    VALUES( ${value.slice(0, value.length-1)} ) RETURNING *`;

    await client.query(text, Object.values(newObj));
  } catch (err) {    
    console.log("Error while insert the record id ", err);
  }
}

const insertTable = async(config) => {
  try {    
    let result = await selectTable("shipments");    
    for(let record =0; record < result.length; record++){      
      await insert(result[record], config);
    }
  } catch(error){    
    console.log("Error in insert table");
  }
}

const upload = async(config) => {   
    console.log('hello',config);
    await connectDb();    
    await createTable(config.loadMaster[0].table);     
    await insertTable(config.loadMaster[0]);
    return await getData(config.loadMaster[0]);
}

const getData = async(config) => {      
  return await selectTable(config.table);
}

module.exports = {
  upload
}