#!/usr/bin/env node

/**
 * Create Admin User Script
 * Creates admin user in the database
 * Usage: node scripts/create-admin.js [email] [password]
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Admin model (inline to avoid import issues)
const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);

async function createAdmin(email, password) {
  try {
    console.log(' Connecting to database...');

    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(' Connected to database');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: email.toLowerCase() });
    if (existingAdmin) {
      console.log(' Admin user already exists with this email');
      return;
    }

    // Hash password
    console.log(' Hashing password...');
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create admin
    console.log(' Creating admin user...');
    const admin = new Admin({
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    await admin.save();

    console.log(' Admin user created successfully!');
    console.log(` Email: ${email}`);
    console.log(' Password: [HIDDEN]');

  } catch (error) {
    console.error(' Error creating admin:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log(' Database connection closed');
  }
}

// Get arguments from command line or use defaults
const args = process.argv.slice(2);
const email = args[0] || 'admin@sexorism123';
const password = args[1] || 'admin@12345';

console.log(' Creating admin user...');
console.log(` Email: ${email}`);
console.log(` Password: ${password}`);
console.log('');

createAdmin(email, password).then(() => {
  console.log('');
  console.log(' Admin creation complete!');
  process.exit(0);
}).catch((error) => {
  console.error(' Script failed:', error);
  process.exit(1);
});