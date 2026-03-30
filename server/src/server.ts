import app from './app';
import { connectDB } from './config/db';
import { env } from './config/env';

const startServer = async (): Promise<void> => {
  await connectDB();

  const server = app.listen(env.port, () => {
    console.log(`
🚀 Mini Eraser Server
━━━━━━━━━━━━━━━━━━━━
🌍 Environment: ${env.nodeEnv}
🔌 Port:        ${env.port}
📡 URL:         http://localhost:${env.port}
❤️  Health:      http://localhost:${env.port}/health
━━━━━━━━━━━━━━━━━━━━
    `);
  });

  // Graceful shutdown
  const shutdown = (signal: string) => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    server.close(() => {
      console.log('HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Promise Rejection:', reason);
    server.close(() => process.exit(1));
  });
};

startServer();
