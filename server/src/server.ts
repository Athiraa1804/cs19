import 'dotenv/config';
import app from './app.js';
import { connectMongo } from './db/mongoose.js';

const PORT = process.env.PORT ?? 3001;

async function start(): Promise<void> {
  try {
    await connectMongo();
    app.listen(PORT, () => {
      console.log(`Backend server running at http://localhost:${PORT}`);
      console.log(`Health: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown MongoDB connection error';
    console.error(`Backend startup failed: ${message}`);
    process.exit(1);
  }
}

void start();
