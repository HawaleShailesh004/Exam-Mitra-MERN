import mongoose from "mongoose";

async function dbConnection() {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);
    console.log("Database Connected!");
    console.log("DB Name: ", connection.connection.name);
  } catch (err) {
    console.log("Error Occured ", err.message);
  }
}

export default dbConnection;
