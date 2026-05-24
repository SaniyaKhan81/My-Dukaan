import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Resource from './models/Resource.js';

dotenv.config();

const seedData = async () => {
  try {
    // Manually connecting for the script
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connection successful... seeding data...");

    // Remove existing empty collections
    await Resource.deleteMany();

    const sampleResources = [
      {
        title: "CS101 - Python Assignment Solutions",
        price: 15,
        category: "Computer Science",
        university: "Stanford",
        courseCode: "CS101",
        sellerName: "JohnDoe_99",
        description: "Step-by-step logic for loops and arrays."
      },
      {
        title: "Organic Chemistry Lab Manual",
        price: 25,
        category: "Chemistry",
        university: "MIT",
        courseCode: "CHEM202",
        sellerName: "StudyWizard",
        description: "Full diagrams and reaction observations."
      }
    ];

    await Resource.insertMany(sampleResources);
    console.log("🌱 Data Seeded Successfully!");
    
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
};

seedData();