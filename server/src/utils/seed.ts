import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import bcrypt from 'bcryptjs';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

import User from '../models/User';
import Workspace from '../models/Workspace';

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mini-eraser';

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing
    await User.deleteMany({});
    await Workspace.deleteMany({});
    console.log('Cleared existing data');

    // Create demo user
    const hashedPassword = await bcrypt.hash('password123', 12);
    const user = await User.create({
      name: 'Demo Developer',
      email: 'demo@mini-eraser.dev',
      password: hashedPassword,
    });
    console.log(`✅ Created user: ${user.email}`);

    // Create sample workspaces
    const workspaces = await Workspace.create([
      {
        title: 'E-Commerce Microservices',
        description: 'Architecture diagram for an e-commerce platform',
        tags: ['microservices', 'ecommerce', 'kubernetes'],
        createdBy: user._id,
        markdownText: `# E-Commerce Microservices Architecture

## Overview
This workspace describes the microservices architecture for our e-commerce platform.

## Services

### User Service
- Handles authentication and user profiles
- JWT-based auth
- PostgreSQL database

### Product Service
- Product catalog management
- Elasticsearch for search
- Redis cache

### Order Service
- Order processing pipeline
- Event-driven with Kafka
- MongoDB for order history

### Payment Service
- Stripe integration
- Webhooks for payment events

## Infrastructure
- Kubernetes orchestration
- API Gateway (Kong)
- Service mesh (Istio)
- Monitoring (Prometheus + Grafana)
`,
        canvasData: {
          nodes: [
            { id: 'client', type: 'client', label: 'Web Client', x: 50, y: 50, width: 140, height: 60 },
            { id: 'gateway', type: 'gateway', label: 'API Gateway', x: 300, y: 50, width: 140, height: 60 },
            { id: 'user-svc', type: 'service', label: 'User Service', x: 100, y: 200, width: 140, height: 60 },
            { id: 'product-svc', type: 'service', label: 'Product Service', x: 300, y: 200, width: 140, height: 60 },
            { id: 'order-svc', type: 'service', label: 'Order Service', x: 500, y: 200, width: 140, height: 60 },
            { id: 'payment-svc', type: 'service', label: 'Payment Service', x: 700, y: 200, width: 140, height: 60 },
            { id: 'user-db', type: 'database', label: 'PostgreSQL', x: 100, y: 380, width: 140, height: 60 },
            { id: 'product-db', type: 'database', label: 'Elasticsearch', x: 300, y: 380, width: 140, height: 60 },
            { id: 'order-db', type: 'database', label: 'MongoDB', x: 500, y: 380, width: 140, height: 60 },
            { id: 'kafka', type: 'queue', label: 'Kafka', x: 350, y: 500, width: 140, height: 60 },
          ],
          edges: [
            { id: 'e1', source: 'client', target: 'gateway', label: 'HTTPS' },
            { id: 'e2', source: 'gateway', target: 'user-svc', label: 'REST' },
            { id: 'e3', source: 'gateway', target: 'product-svc', label: 'REST' },
            { id: 'e4', source: 'gateway', target: 'order-svc', label: 'REST' },
            { id: 'e5', source: 'gateway', target: 'payment-svc', label: 'REST' },
            { id: 'e6', source: 'user-svc', target: 'user-db', label: 'SQL' },
            { id: 'e7', source: 'product-svc', target: 'product-db', label: 'HTTP' },
            { id: 'e8', source: 'order-svc', target: 'order-db', label: 'NoSQL' },
            { id: 'e9', source: 'order-svc', target: 'kafka', label: 'publish', style: 'dashed' },
            { id: 'e10', source: 'payment-svc', target: 'kafka', label: 'subscribe', style: 'dashed' },
          ],
          tlDrawData: {},
        },
      },
      {
        title: 'Auth Flow Design',
        description: 'JWT authentication flow diagram',
        tags: ['auth', 'jwt', 'security'],
        createdBy: user._id,
        markdownText: `# JWT Authentication Flow

## Login Flow
1. User submits credentials
2. Server validates credentials
3. Server signs JWT with secret
4. Client stores token in memory
5. Client sends token in Authorization header

## Token Refresh
- Access token: 15 minutes
- Refresh token: 7 days
- Refresh endpoint: POST /api/auth/refresh

## Protected Routes
All protected routes require:
\`\`\`
Authorization: Bearer <token>
\`\`\`

## Security Notes
- Never store JWT in localStorage
- Use httpOnly cookies for refresh tokens
- Rate limit auth endpoints
`,
        canvasData: {
          nodes: [
            { id: 'browser', type: 'client', label: 'Browser', x: 50, y: 100, width: 140, height: 60 },
            { id: 'auth-svc', type: 'service', label: 'Auth Service', x: 300, y: 100, width: 140, height: 60 },
            { id: 'user-db', type: 'database', label: 'User DB', x: 300, y: 280, width: 140, height: 60 },
            { id: 'jwt', type: 'api', label: 'JWT Signer', x: 550, y: 100, width: 140, height: 60 },
            { id: 'protected', type: 'api', label: 'Protected API', x: 550, y: 280, width: 140, height: 60 },
          ],
          edges: [
            { id: 'e1', source: 'browser', target: 'auth-svc', label: 'POST /login' },
            { id: 'e2', source: 'auth-svc', target: 'user-db', label: 'verify credentials' },
            { id: 'e3', source: 'auth-svc', target: 'jwt', label: 'sign token' },
            { id: 'e4', source: 'jwt', target: 'browser', label: 'return JWT', style: 'dashed' },
            { id: 'e5', source: 'browser', target: 'protected', label: 'Bearer token' },
          ],
          tlDrawData: {},
        },
      },
    ]);

    console.log(`✅ Created ${workspaces.length} sample workspaces`);
    console.log('\n🎉 Seed completed!');
    console.log('─────────────────────────────');
    console.log('Demo credentials:');
    console.log('  Email:    demo@mini-eraser.dev');
    console.log('  Password: password123');
    console.log('─────────────────────────────\n');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();
