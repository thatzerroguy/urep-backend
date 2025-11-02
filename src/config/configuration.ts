import * as process from 'node:process';

export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  database: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN,
  smtpHost: process.env.SMTP_HOST,
  smtpPort: parseInt(process.env.SMTP_PORT || '465', 10),
  smtpService: process.env.SMTP_SERVICE,
  qoreIdClientID: process.env.QOREID_CLIENT_ID,
  qoreIdSecret: process.env.QOREID_SECRET_KEY,
  termiiApiKey: process.env.TERMII_API_KEY,
  termiiApiSecret: process.env.TERMII_SECRET_KEY,
  termiiSenderId: process.env.TERMII_SENDER_ID,
});
