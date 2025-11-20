import { ConfigService } from '@nestjs/config';
import { MailService } from '../src/main/mail/mail.service';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs/promises';
import * as handlebars from 'handlebars';

// Load environment variables
dotenv.config();

async function testEmailSending() {
  console.log('🚀 Starting email test...');
  
  // Create a mock config service with environment variables
  const configService = {
    get: (key: string, defaultValue?: any) => {
      return process.env[key] || defaultValue;
    }
  } as unknown as ConfigService;
  
  // Initialize mail service
  const mailService = new MailService(configService);
  
  // Test data
  const testEmail = 'test@example.com';
  const testName = 'Test User';
  const testToken = 'test-verification-token-123';
  
  try {
    // Test sending a simple email with a test template
    console.log('\n📧 Sending test email...');
    
    const testTemplatePath = path.join(__dirname, 'test-template.hbs');
    const templateContent = await fs.readFile(testTemplatePath, 'utf-8');
    const template = handlebars.compile(templateContent);
    
    const emailHtml = template({
      subject: 'Test Email from Study Mate',
      appName: 'Study Mate',
      name: testName,
      now: new Date().toLocaleString(),
      currentYear: new Date().getFullYear()
    });
    
    // Send the test email using the transporter directly
    await mailService['transporter'].sendMail({
      from: configService.get('SMTP_FROM'),
      to: testEmail,
      subject: 'Test Email from Study Mate',
      html: emailHtml,
    });
    
    console.log('✅ Test email sent successfully!');
    console.log('\n🎉 Email service is working correctly!');
  } catch (error) {
    console.error('\n❌ Error sending test email:', error);
    process.exit(1);
  }
}

// Run the test
testEmailSending().catch(console.error);
