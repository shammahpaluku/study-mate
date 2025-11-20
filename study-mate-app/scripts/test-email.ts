import { ConfigService } from '@nestjs/config';
import { MailService } from '../src/mail/mail.service';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testEmail() {
  console.log('Starting email test...');
  
  // Create a mock config service
  const configService = new ConfigService();
  
  // Initialize mail service
  const mailService = new MailService(configService);
  
  // Test data
  const testEmail = 'test@example.com';
  const testName = 'Test User';
  const testToken = 'test-token-123';
  
  try {
    console.log('Sending test verification email...');
    await mailService.sendVerificationEmail(testEmail, testName, testToken);
    console.log('✅ Verification email sent successfully!');
    
    console.log('\nSending test password reset email...');
    await mailService.sendPasswordResetEmail(testEmail, testName, testToken);
    console.log('✅ Password reset email sent successfully!');
    
  } catch (error) {
    console.error('❌ Error sending test email:', error);
    process.exit(1);
  }
}

// Run the test
testEmail().catch(console.error);
