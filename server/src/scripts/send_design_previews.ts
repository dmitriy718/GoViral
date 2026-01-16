import { emailService } from '../services/email.service';
import dotenv from 'dotenv';
import path from 'path';

// Load env from server root
dotenv.config({ path: path.join(__dirname, '../../.env') });

const TARGET_EMAIL = 'dmitriynyc718@gmail.com';

async function main() {
  console.log(`🚀 Sending redesigned email previews to ${TARGET_EMAIL}...`);
  
  try {
    console.log('1/3: Sending Welcome Email...');
    await emailService.sendWelcomeEmail(TARGET_EMAIL, 'Dmitriy');
    
    console.log('2/3: Sending Verification Email...');
    await emailService.sendVerificationEmail(TARGET_EMAIL, 'sample-token-123');
    
    console.log('3/3: Sending Access Granted Email...');
    await emailService.sendAccessGrantedEmail(TARGET_EMAIL, 'Dmitriy');
    
    console.log('✅ All previews sent successfully!');
  } catch (error) {
    console.error('❌ Error sending previews:', error);
  }
}

main();
