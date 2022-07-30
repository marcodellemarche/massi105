'use strict';
const nodemailer = require('nodemailer');
const { readFileSync } = require('fs');
const { resolve } = require('path');
const Handlebars = require('handlebars');
const dotenv = require('dotenv');

/**
 * @typedef SenderInfo
 * @type {{
 *   name: string;
 *   email: string;
 *   logo: string;
 * }}
 */

dotenv.config();

const prodAuth = {
    user: process.env.LIBERO_MAIL,
    pass: process.env.LIBERO_PASSWORD,
};

const prodAccount = {
    host: 'smtp.libero.it',
    port: 465,
    secure: true,
};

const devAccount = {
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
};

const headerFile = 'common/header.html';
const titleFile = 'common/title.html';
const footerFile = 'common/footer.html';

const isProduction = process.env.NODE_ENV === 'production';

/**
 * Sends an email using nodemailer
 * @param {SenderInfo} sender
 * @param {{
 *   subject: string;
 *   bodyFile: string;
 *   plainText: string;
 *   static: {
 *     [key: string]: any;
 *   };
 *   dynamic: {
 *     receiver: string;
 *     [key: string]: any;
 *   };
 * }} email 
 */
async function sendEmail(sender, email) {
    let account = isProduction
        ? { ...prodAccount, auth: prodAuth } 
        : { ...devAccount, auth: await nodemailer.createTestAccount() };

    const templateSubject = Handlebars.compile(email.subject);

    const headerTemplate = Handlebars.compile(readFileSync(resolve(__dirname, headerFile)).toString());
    const titleTemplate = Handlebars.compile(readFileSync(resolve(__dirname, titleFile)).toString());
    const footerTemplate = Handlebars.compile(readFileSync(resolve(__dirname, footerFile)).toString());

    const bodyTemplate = Handlebars.compile(readFileSync(resolve(__dirname, email.bodyFile)).toString());
    
    const subject = templateSubject(email.dynamic);

    const header = headerTemplate();
    const title = titleTemplate({ title: subject, sender });
    const footer = footerTemplate({
        sender,
        replyTo: 'Per qualsiasi domanda, rispondere a questa email o contattarci all\'indirizzo',
    });

    const body = bodyTemplate({
        static: email.static,
        dynamic: email.dynamic,
        sender,
        subject,
    });

    let transporter = nodemailer.createTransport(account);

    let info = await transporter.sendMail({
        from: `"${sender.name}" <${sender.email}>`, // sender address
        to: email.dynamic.receiver,
        subject,
        text: email.plainText,
        html: header + title + body + footer,
    });

    console.log('isProduction?', isProduction);
    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
}

/**
 * Sends an email after a login request
 * @param {{
 *   sender: SenderInfo;
 *   receiver: string;
 *   loginLink: string;
 * }} data 
 */
async function loginEmail({ sender, receiver, loginLink }) {
    const email = {
        subject: 'Login al tuo account',
        bodyFile: 'login.html',
        plainText: '',
        static: {
            clickButton: 'Si prega di cliccare il pulsante qui sotto per continuare col login:',
            login: 'Login',
            cannotOpenLink: 'Non riesci ad aprire il link? Prova a copiare e incollare il seguente URL nel tuo browser:',
        },
        dynamic: {
            receiver,
            loginLink,
            loginLinkEncoded: `https://www.google.com/url?q=${encodeURIComponent(loginLink)}`,
        },
    };

    await sendEmail(sender, email);
}

/**
 * Sends an email after a successful order
 * @param {{
 *   sender: SenderInfo;
 *   receiver: string;
 *   reference: string;
 *   created: string;
 *   status: {
 *     text: string;
 *     color: string;
 *   };
 *   buyer: {
 *     firstname: string;
 *     lastname: string;
 *     email: string;
 *   };
 *   shipping: {
 *     name: string;
 *     address: string;
 *     city: string;
 *     state: string;
 *     country: string;
 *     zip: string;
 *     method: string;
 *   };
 *   order: {
 *     items: {
 *       name: string;
 *       quantity: number;
 *       price: string;
 *     }[];
 *     subtotal: string;
 *     shipping: string;
 *     total: string;
 *   };
 *   payment: {
 *     method: string;
 *   };
 * }} data 
 */
async function orderReceiptEmail({ sender, receiver, reference, created, status, buyer, shipping, order, payment }) {
    const email = {
        subject: 'Il tuo ordine {{reference}}',
        bodyFile: 'order-receipt.html',
        plainText: '',
        static: {
            date: 'Data',
            status: 'Stato',
            reference: 'Rif.',
            customerDetails: 'Dettagli sul cliente',
            buyer: 'Cliente',
            shippingAddress: 'Indirizzo di spedizione',
            billingAddress: 'Indirizzo di fatturazione',
            orderSummary: 'Dettagli sull\'ordine',
            subtotal: 'Subtotale',
            shipping: 'Spedizione',
            total: 'Totale',
            payment: 'Pagamento',
            shippingMethod: 'Tipo di spedizione',
        },
        dynamic: {
            receiver,
            sender,
            reference, 
            created, 
            status,
            buyer, 
            shipping, 
            order,
            payment,
        },
    };

    await sendEmail(sender, email);
}

/**
 * Sends an email after an order has beens shipped
 * @param {{
 *   sender: SenderInfo;
 *   receiver: string;
 *   reference: string;
 *   created: string;
 *   buyer: {
 *     firstname: string;
 *     lastname: string;
 *     email: string;
 *   };
 *   items: {
 *     name: string;
 *     quantity: number;
 *   }[];
 *   carrier: string;
 *   trackingNumber: string;
 * }} data 
 */
async function orderShippedEmail({ sender, receiver, reference, created, buyer, items, carrier, trackingNumber }) {
    const email = {
        subject: 'Il tuo ordine è stato spedito!',
        bodyFile: 'order-shipped.html',
        plainText: '',
        static: {
            yourOrder: 'Il tuo ordine',
            from: 'da',
            hasShipped: 'è stato spedito!',
            carrier: 'Corriere',
            trackingNumber: 'Numero di tracciamento',
            items: 'Oggetti spediti',
            quantity: 'Quantità',
        },
        dynamic: {
            receiver,
            sender, 
            reference, 
            created, 
            buyer, 
            items, 
            carrier, 
            trackingNumber,
        },
    };

    await sendEmail(sender, email);
}

module.exports = {
    sendEmail,
    loginEmail,
    orderReceiptEmail,
    orderShippedEmail,
};
