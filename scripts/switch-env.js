#!/usr/bin/env node

/**
 * Environment Switcher Script for SpaFort
 * Usage: node scripts/switch-env.js [dev|prod]
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const args = process.argv.slice(2);
const environment = args[0];

if (!environment || !['dev', 'prod', 'production'].includes(environment)) {
  console.log('❌ Usage: node scripts/switch-env.js [dev|prod]');
  console.log('📖 dev = development environment');
  console.log('📖 prod/production = production environment');
  process.exit(1);
}

const isProduction = environment === 'prod' || environment === 'production';
const envFile = isProduction ? '.env.production' : 'backend/.env';
const targetFile = 'backend/.env';

console.log(`🔄 Switching to ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'} environment...`);

try {
  // Check if source file exists
  if (!existsSync(join(rootDir, envFile))) {
    console.log(`❌ Environment file not found: ${envFile}`);
    console.log('📝 Please ensure the environment file exists.');
    process.exit(1);
  }

  // Read the source environment file
  const envContent = readFileSync(join(rootDir, envFile), 'utf8');

  // Write to the target .env file
  writeFileSync(join(rootDir, targetFile), envContent);

  console.log(`✅ Successfully switched to ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'} environment`);
  console.log(`📄 Copied ${envFile} → ${targetFile}`);

  // Show key configuration
  const lines = envContent.split('\n');
  const keyConfigs = lines.filter(line =>
    line.includes('MONGODB_URI=') ||
    line.includes('CLOUDINARY_CLOUD_NAME=') ||
    line.includes('BREVO_API_KEY=')
  );

  console.log('\n🔧 Key Configuration:');
  keyConfigs.forEach(config => {
    const [key] = config.split('=');
    console.log(`   ✅ ${key}: Configured`);
  });

  console.log('\n🚀 Ready to run the application!');
  console.log(`   Development: npm run dev`);
  console.log(`   Production:  npm run build && npm start`);

} catch (error) {
  console.error('❌ Error switching environment:', error.message);
  process.exit(1);
}