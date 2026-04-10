import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import process from 'process';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const url = process.env.MONGO_URI
const dbName = 'jobboard';

async function createAdmin() {
    const client = new MongoClient(url);
    try {
        await client.connect();
        console.log('Connected to database');
        
        const db = client.db(dbName);
        const admins = db.collection('admins');

        const email = 'admin@example.com';
        const password = 'adminpassword123';
        
        const existingAdmin = await admins.findOne({ email });
        if (existingAdmin) {
            console.log('Admin already exists!');
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        await admins.insertOne({
            name: 'Super Admin',
            email: email,
            password: hashedPassword,
            createdAt: new Date()
        });

        console.log(`Admin created successfully! Email: ${email}, Password: ${password}`);

    } catch (err) {
        console.error('Error creating admin:', err);
    } finally {
        await client.close();
    }
}

createAdmin();
