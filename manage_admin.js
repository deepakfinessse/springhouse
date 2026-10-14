import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

const args = process.argv.slice(2);
const command = args[0];

const adminSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    resetOtp: { type: String, default: null },
    resetOtpExpiry: { type: Date, default: null },
  },
  { strict: false }
);

async function run() {
  if (!process.env.MONGODB_URI) {
    console.error("Error: MONGODB_URI is not set in .env");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);
  const Admin = mongoose.models.Admin || mongoose.model("Admin", adminSchema);

  if (command === "list") {
    const users = await Admin.find({}, "-password -resetOtp -resetOtpExpiry");
    console.log("Current Administrators:");
    console.table(users.map((u) => ({ username: u.username, email: u.email })));
  } else if (command === "create") {
    const [_, username, email, password] = args;
    if (!username || !email || !password) {
      console.log("Usage: node manage_admin.js create <username> <email> <password>");
      process.exit(1);
    }
    const exists = await Admin.findOne({ username });
    if (exists) {
      console.log(`User ${username} already exists! Use 'update' to edit them.`);
      process.exit(1);
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await Admin.create({ username, email, password: hashedPassword });
    console.log(`Success! Created new administrator: ${username} (${email})`);
  } else if (command === "update") {
    const [_, username, email, newPassword] = args;
    if (!username || !email || !newPassword) {
      console.log("Usage: node manage_admin.js update <username> <new_email> <new_password>");
      process.exit(1);
    }
    const admin = await Admin.findOne({ username });
    if (!admin) {
      console.log(`User ${username} not found! Use 'create' instead.`);
      process.exit(1);
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.email = email;
    admin.password = hashedPassword;
    await admin.save();
    console.log(`Success! Updated credentials for: ${username}`);
  } else if (command === "delete") {
    const [_, username] = args;
    if (!username) {
      console.log("Usage: node manage_admin.js delete <username>");
      process.exit(1);
    }
    const result = await Admin.deleteOne({ username });
    if (result.deletedCount > 0) {
      console.log(`Success! Deleted administrator: ${username}`);
    } else {
      console.log(`User ${username} not found!`);
    }
  } else {
    console.log("Welcome to CMS Admin CLI Manager");
    console.log("Available capabilities:");
    console.log("  node manage_admin.js list");
    console.log("  node manage_admin.js create <username> <email> <password>");
    console.log("  node manage_admin.js update <username> <new_email> <new_password>");
    console.log("  node manage_admin.js delete <username>");
  }

  process.exit(0);
}

run().catch((err) => {
  console.error("An error occurred:", err);
  process.exit(1);
});
