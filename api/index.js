import serverless from "serverless-http";
import app from "../src/app.js";

// ✅ Vercel entry point
export default serverless(app);
