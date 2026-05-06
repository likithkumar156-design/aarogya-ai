const ngrok = require('ngrok');
const fs = require('fs');
const path = require('path');

(async function() {
  try {
    console.log('\n🚀 Starting ngrok tunnel...\n');
    
    const url = await ngrok.connect({
      addr: 3000,
      proto: 'http'
    });

    const endpoints = {
      ngrokUrl: url,
      ivrsWelcome: `${url}/ivrs/welcome`,
      ivrsApi: `${url}/api/ivrs/route`,
      whatsappWebhook: `${url}/api/whatsapp/webhook`,
      timestamp: new Date().toISOString()
    };

    // Save to file
    const content = `
========================================
   AAROGYA AI - NGROK TUNNEL ACTIVE
========================================

Base URL: ${url}

IVRS Endpoints:
   Welcome Page: ${endpoints.ivrsWelcome}
   API Webhook:  ${endpoints.ivrsApi}

WhatsApp Webhook:
   ${endpoints.whatsappWebhook}

Started: ${new Date().toLocaleString()}

========================================

TWILIO CONFIGURATION:

For IVRS (Voice Calls):
1. Go to: https://console.twilio.com/us1/develop/phone-numbers/manage/incoming
2. Click your number: +17542400466
3. Under "Voice Configuration":
   - A CALL COMES IN: Webhook
   - URL: ${endpoints.ivrsApi}
   - HTTP: POST

For WhatsApp:
1. Go to: https://console.twilio.com/us1/develop/sms/try-it-out/whatsapp-learn
2. Set webhook URL to: ${endpoints.whatsappWebhook}

========================================

Keep this terminal open! Closing it will stop the tunnel.
This URL will change when you restart ngrok.

Press Ctrl+C to stop
    `.trim();

    fs.writeFileSync(path.join(__dirname, 'CURRENT_NGROK_URL.txt'), content);

    // Display in console
    console.log('\n========================================');
    console.log('   ✅ NGROK TUNNEL ACTIVE');
    console.log('========================================\n');
    console.log('🌐 Base URL:', url);
    console.log('\n📍 IVRS Endpoints:');
    console.log('   Welcome:', endpoints.ivrsWelcome);
    console.log('   API:    ', endpoints.ivrsApi);
    console.log('\n📱 WhatsApp:', endpoints.whatsappWebhook);
    console.log('\n💾 URLs saved to: CURRENT_NGROK_URL.txt');
    console.log('\n⚠️  Keep this terminal open!\n');

    // Keep process alive
    process.on('SIGINT', async () => {
      console.log('\n\n🛑 Stopping ngrok...');
      await ngrok.disconnect();
      await ngrok.kill();
      if (fs.existsSync(path.join(__dirname, 'CURRENT_NGROK_URL.txt'))) {
        fs.unlinkSync(path.join(__dirname, 'CURRENT_NGROK_URL.txt'));
      }
      console.log('✅ Tunnel closed\n');
      process.exit();
    });

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    
    if (error.message.includes('authtoken') || error.message.includes('authentication')) {
      console.log('\n📝 You need to setup ngrok authtoken:\n');
      console.log('   1. Sign up FREE: https://dashboard.ngrok.com/signup');
      console.log('   2. Get your token: https://dashboard.ngrok.com/get-started/your-authtoken');
      console.log('   3. Run this command:\n');
      console.log('      npx ngrok config add-authtoken YOUR_TOKEN_HERE\n');
      console.log('   4. Then run: npm run tunnel\n');
    } else {
      console.log('\nMake sure:');
      console.log('   - Your app is running on port 3000 (npm run dev)');
      console.log('   - ngrok authtoken is configured\n');
    }
    
    process.exit(1);
  }
})();
