const { loginEmail, orderReceiptEmail, orderShippedEmail } = require('../email/index.js');

const sender = { email: 'utensilimakita@libero.it', name: 'Massimiliano Vaccarini', logo: 'https://massi105.it/images/massi105.png' };
const receiver = 'mferretti93@gmail.com';
const loginLink = 'http://localhost:3000/login?token=67c055da-0166-48d3-b8b9-3bdc26009b90';
const reference = '#MSSMLNVCC-204895';

// loginEmail({ receiver, loginLink }).catch(console.error);

// orderReceiptEmail({ receiver, reference }).catch(console.error);

orderShippedEmail({ sender, receiver, reference }).catch(console.error);
