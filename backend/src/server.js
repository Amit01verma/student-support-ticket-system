import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/db.js";

const port = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(port, () => {
      console.log(`Backend listening on port ${port}`);
    });
  } catch (error) {
    console.error(`Server startup aborted: ${error.message}`);
    process.exitCode = 1;
  }
};

startServer();
