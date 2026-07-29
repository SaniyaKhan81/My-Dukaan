import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import Resource from './models/Resource.js';
import User from './models/User.js';
import Transaction from './models/Transaction.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected — seeding Pakistani university data...');

    await Transaction.deleteMany();
    await Resource.deleteMany();
    await User.deleteMany();

    const hashedPassword = await bcrypt.hash('password123', 10);

    const users = await User.insertMany([
      {
        name: 'Ahmed Khan',
        email: 'ahmed@ned.edu.pk',
        password: hashedPassword,
        studentId: '24SP-038-CS',
        university: 'NED University',
      },
      {
        name: 'Saniya Khan',
        email: 'saniya@uit.edu.pk',
        password: hashedPassword,
        studentId: '24SP-042-CS',
        university: 'UIT University',
      },
      {
        name: 'Bilal Hassan',
        email: 'bilal@ku.edu.pk',
        password: hashedPassword,
        studentId: '24SP-015-CS',
        university: 'Karachi University',
      },
      {
        name: 'Fatima Ali',
        email: 'fatima@fast.edu.pk',
        password: hashedPassword,
        studentId: '24SP-021-CS',
        university: 'FAST NUCES',
      },
    ]);

    const [ahmed, saniya, bilal, fatima] = users;

    const resources = await Resource.insertMany([
      {
        title: 'CSC-102 Programming Fundamentals — Lab 1 Solutions',
        description: 'Complete solutions for all PF lab assignments including loops, arrays, and functions.',
        price: 350,
        category: 'Programming Fundamentals',
        university: 'NED University',
        courseCode: 'CSC-102',
        seller: ahmed._id,
      },
      {
        title: 'CSC-103 OOP — Midterm Prep Notes',
        description: 'Class diagrams, inheritance examples, and past paper solutions for OOP midterm.',
        price: 500,
        category: 'Object Oriented Programming',
        university: 'UIT University',
        courseCode: 'CSC-103',
        seller: saniya._id,
      },
      {
        title: 'CSC-201 DSA — Sorting & Trees Cheat Sheet',
        description: 'Handwritten notes covering BST, AVL, heaps, and all major sorting algorithms with time complexity.',
        price: 450,
        category: 'Data Structures And Algorithms',
        university: 'Karachi University',
        courseCode: 'CSC-201',
        seller: bilal._id,
      },
      {
        title: 'CSC-204 Database System — ER Diagrams & SQL Queries',
        description: 'Normalized ER diagrams, SQL query bank, and normalization examples (1NF to BCNF).',
        price: 600,
        category: 'Database System',
        university: 'FAST NUCES',
        courseCode: 'CSC-204',
        seller: fatima._id,
      },
      {
        title: 'CSC-203 Operating Systems — Process Scheduling Notes',
        description: 'FCFS, SJF, Round Robin, and deadlock prevention notes with solved numericals.',
        price: 400,
        category: 'Operating Systems',
        university: 'NED University',
        courseCode: 'CSC-203',
        seller: ahmed._id,
      },
      {
        title: 'CSC-207 AI — Search Algorithms Assignment',
        description: 'BFS, DFS, A* search implementations with report for Artificial Intelligence course.',
        price: 550,
        category: 'Artificial Intelligence',
        university: 'Iqra University',
        courseCode: 'CSC-207',
        seller: saniya._id,
      },
    ]);

    await Transaction.insertMany([
      {
        orderId: 'MD-SEED001',
        buyer: bilal._id,
        seller: ahmed._id,
        resource: resources[0]._id,
        amount: 350,
        currency: 'PKR',
        paymentMethod: 'jazzcash',
        paymentRef: 'JC-482910',
        status: 'completed',
      },
      {
        orderId: 'MD-SEED002',
        buyer: fatima._id,
        seller: saniya._id,
        resource: resources[1]._id,
        amount: 500,
        currency: 'PKR',
        paymentMethod: 'easypaisa',
        paymentRef: 'EP-739201',
        status: 'completed',
      },
    ]);

    console.log('Data seeded successfully!');
    console.log('Test accounts (password: password123):');
    console.log('  ahmed@ned.edu.pk   — NED University');
    console.log('  saniya@uit.edu.pk  — UIT University');
    console.log('  bilal@ku.edu.pk    — Karachi University');
    console.log('  fatima@fast.edu.pk — FAST NUCES');

    mongoose.connection.close();
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
