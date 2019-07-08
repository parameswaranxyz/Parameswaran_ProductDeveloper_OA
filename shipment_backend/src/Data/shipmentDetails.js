const path = require('path');
const csv = require('csvtojson');
const csvFilePath = path.resolve(__filename, "../../../", "ShipmentData.csv");
const moment = require('moment');
const {client, connectDb} = require("./dbHelper");
const tableName = "shipments";

const loadData = async() => {
  try {    
    let query = `SELECT * FROM ${tableName}`;
    let res = await client.query(query)
    return res.rows;
  } catch (err) {      
      await loadFormCsv();
  }
}

const createTable = async() => {
  try {
    let query = `CREATE  TABLE ${tableName} (
            shipment_id int not null PRIMARY KEY,
            source_id text not null,
            destination_id text not null,
            date date,
            weight int not null,
            cost int not null,
            new_shipment_id int not null,
            new_weight int not null,
            new_cost int not null,
            total_tls int not null
        )`;

    await client.query(query);
  } catch (error) {
    console.error("Error in create table");
  }
}

const insertRecords = async(recordObj) => {
  try {
    const { shipment_id, source_id, destination_id, date, weight,
      cost, new_shipment_id, new_weight, new_cost, total_tls } = recordObj;

    let text = `INSERT INTO ${tableName}(shipment_id,source_id,destination_id,date,weight,
                    cost,new_shipment_id,new_weight,new_cost,total_tls) 
                    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`;

    let values = [
      Number(shipment_id),
      source_id,
      destination_id,
      moment(date, "DD-MM-YY").format(),
      Number(weight),
      Number(cost),
      Number(new_shipment_id),
      Number(new_weight),
      Number(new_cost),
      Number(total_tls)];

    let res = await client.query(text, values);
  } catch (err) {    
    console.log("Error while insert the record id ", Number(shipment_id));
  }
}

const loadFormCsv = async() => {
  console.log("Table not available.. Load form csv...");
  await createTable();
  try {
    const jsonArray = await csv().fromFile(csvFilePath); 
    for (let record = 0; record < jsonArray.length; record++) {
      await insertRecords(jsonArray[record]);          
      await loadData();
    }
  } catch (error) {
    console.error("Error in insert record ", error);
  }

}

const getShipmentDetails = async() => {    
  try {
    await connectDb();
    let data = await loadData();  
    return data;  
  } catch (error) {
    console.log("Error:",error);
  }
}

module.exports = {
  getShipmentDetails
}
