import { createApp } from './app';
import { connectDatabase } from './config/db';
import { config } from './config';

const startServer = async () => {
  try {
    await connectDatabase();

    const app = createApp();

    app.listen(config.port, () => {
      console.log(`=========================================`);
      console.log(`Comp!lo Learn API Server Live`);
      console.log(`Port: ${config.port}`);
      console.log(`Environment: ${config.nodeEnv}`);
      console.log(`CORS Origin: ${config.frontendUrl}`);
      console.log(`Go Binary: ${config.go.binaryPath}`);
      console.log(`=========================================`);
    });
  } catch (error) {
    console.error('Fatal error starting server:', error);
    process.exit(1);
  }
};

startServer();
