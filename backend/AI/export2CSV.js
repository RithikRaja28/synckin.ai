/* const fs = require("fs");
const { MongoClient } = require("mongodb");
const { parse } = require("json2csv");

// MongoDB connection string
const uri =
  "mongodb+srv://rithikraja28rr:RIsNpykSTBGDFuEt@synckin.hlqu4.mongodb.net/synckin";

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true, // Added for better MongoDB connection handling
});

const dbName = "synckin";
const collectionName = "Tasks";

async function exportToCSV() {
  try {
    // Connect to the MongoDB client
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Fetch all tasks from the collection
    const tasks = await collection.find({}).toArray();

    if (tasks.length === 0) {
      console.log("No tasks found in the collection.");
      return;
    }

    // Specify the fields you want to export to CSV
    const fields = [
      "_id",
      "taskName",
      "description",
      "status",
      "priority",
      "dueDate",
      "userId",
      "createdAt",
      "updatedAt",
    ];

    // Convert JSON data to CSV format
    const csv = parse(tasks, { fields });

    // Write the CSV data to a file
    fs.writeFileSync("tasks.csv", csv);

    console.log("Data exported successfully to tasks.csv");
  } catch (err) {
    console.error("Error exporting data:", err);
  } finally {
    // Ensure the client is closed
    await client.close();
  }
}

// Call the function to export data to CSV
exportToCSV();
 */