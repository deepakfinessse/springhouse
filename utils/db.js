import mongoose from "mongoose";
import dns from "node:dns";

// Local DNS (127.0.0.1) refuses SRV lookups, so use public DNS in dev.
// dns.promises is set separately: Next preloads it, so dns.setServers alone
// doesn't reach it (and the MongoDB driver resolves SRV via dns.promises).
if (process.env.NODE_ENV !== "production") {
  const servers = ["8.8.8.8", "1.1.1.1"];
  dns.setServers(servers);
  dns.promises.setServers(servers);
}


const connectDB = async () => {
  try {
    // Agar pehle se connected hai toh wapas connect mat or
    if (mongoose.connections[0].readyState) {
      return;
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Database Connected Successfully");
  } catch (error) {
    console.error("Database connection failed:", error);
  }
};

export default connectDB;
