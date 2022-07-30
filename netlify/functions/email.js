const moment = require('moment');
const { createHmac } = require('crypto');
const Commerce = require('@chec/commerce.js');
const { loginEmail, orderReceiptEmail, orderShippedEmail } = require('../../email/index.js');

const checAPIKey = process.env.NEXT_PUBLIC_CHEC_PUBLIC_KEY;
const devEnvironment = process.env.NODE_ENV === 'development';

const commerceConfig = {
  axiosConfig: {
    headers: {
      'X-Chec-Agent': 'commerce.js/v2',
      'Chec-Version': '2021-03-10',
    },
  },
};

if (devEnvironment && !checAPIKey) {
    throw Error('Your public API key must be provided as an environment variable named NEXT_PUBLIC_CHEC_PUBLIC_KEY. Obtain your Chec public key by logging into your Chec account and navigate to Setup > Developer, or can be obtained with the Chec CLI via with the command chec whoami');
}

if (!devEnvironment && !process.env.LIBERO_MAIL) {
    throw Error('LIBERO_MAIL is not set as env variable');
}

if (!devEnvironment && !process.env.LIBERO_PASSWORD) {
    throw Error('LIBERO_PASSWORD is not set as env variable');
}

const commerce = new Commerce(
  checAPIKey,
  devEnvironment,
  commerceConfig,
);

/**
 * @typedef ShippedItem 
 * @type {{
 *   product_name: string;
 *   fulfilled_quantity: number;
 * }}  
 */

/**
 * @typedef Customer 
 * @type {{
 *   firstname: string;
 *   lastname: string;
 *   email: string;
 * }}  
 */

/**
 * @typedef Order 
 * @type {{
 *   line_items: {
 *     product_name: string;
 *     quantity: number; 
 *     line_total: Price;
 *   }[];
 *   subtotal: Price;
 *   total: Price;
 *   shipping: {
 *     description: string;
 *     price: Price;
 *   };
 * }}  
 */

/**
 * @typedef Address 
 * @type {{
 *   name: string;
 *   street: string;
 *   town_city: string;
 *   county_state: string;
 *   country: string;
 *   postal_zip_code: string;
 * }} 
 */

/**
 * @typedef Transaction 
 * @type {{
 *   gateway_name: string;
 * }}
 */

/**
 * @typedef Price 
 * @type {{
 *   formatted_with_code: string;
 *   formatted_with_symbol: string;
 * }}
 */

/**
 * @typedef NetlifyEvent
 * @type {{
 *   path: string;
 *   httpMethod: 'POST';
 *   body: string;
 *   isBase64Encoded?: boolean,
 *   queryStringParameters?: {
 *     [key: string]: any;
 *   };
 *   headers?: {
 *     [key: string]: any;
 *   };
 * }} 
 */

/**
 * @typedef NetlifyResponse
 * @type {{
 *   statusCode: number,
 *   body: any;
 *   isBase64Encoded?: boolean,
 *   headers?: {
 *     [key: string]: any;
 *   };
 * }} 
 */

/**
 * @typedef CommerceEvent
 * @type {'customers.login.token' | 'orders.create' | 'orders.physical.shipment'} 
 */

/**
 * @typedef SenderInfo
 * @type {{
 *   name: string;
 *   email: string;
 *   logo: string;
 * }}
 */

/**
 * @param {string} message
 * @returns {NetlifyResponse}
 */
function getError(message, statusCode = 400) {
    console.error('Email function returns error:', message);

    return {
        statusCode,
        body: JSON.stringify({ message })
    };
}

/**
 * @param {string | object} message
 * @returns {NetlifyResponse}
 */
function getSuccess(message, statusCode = 200) {
    console.log('Email function successfully completed:', message);

    return {
        statusCode,
        body: JSON.stringify(typeof message === 'string' ? { message } : message)
    };
}

/**
 * Gets info about the sender, such as email, name and logo
 * @returns {Promise<SenderInfo>}
 */
async function getSenderInfo() {
    /**
     * @type {{
     *   business_name: string;
     *   support_email: string;
     *   logo: string;
     * }} merchant
     */
    // @ts-ignore
    const merchant = await commerce.merchants.about();

    return { 
        name: merchant.business_name, 
        email: merchant.support_email,
        logo: merchant.logo,
    };
}

/**
 * @param {NetlifyEvent} event 
 * @param {*} _context 
 * @returns {Promise<NetlifyResponse>}
 */
exports.handler = async function({ httpMethod, body }, _context) {
    if (httpMethod !== 'POST') {
        return getError('Invalid HTTP method', 405);
    }

    if (!body) {
        return getError('Missing HTTP body', 405);
    }

    const parsedBody = JSON.parse(body);
    console.log('Body parsed data:', JSON.stringify(parsedBody, null, 4));

    /**
     * @type {{
     *   signature: string;
     *   event: CommerceEvent;
     *   payload: any;
     *   created: number;
     * }} commerceEvent
     */
    const { signature, event: commerceEvent, payload, created } = parsedBody;

    delete parsedBody.signature;

    // Verify the signature
    const expectedSignature = createHmac('sha256', process.env.CHEC_EMAIL_WEBHOOK_KEY)
        .update(JSON.stringify(parsedBody))
        .digest('hex');

    if (expectedSignature !== signature) {
        return getError('Signature mismatched, skipping.', 403)
    }

    // Verify the age of the request to make sure it isn't more than 5 minutes old.
    if (new Date(created * 1000).getTime() < new Date().getTime() - 5 * 60 * 1000) {
        return getError('Webhook was sent too long ago, could potentially be fake, ignoring', 403);
    }

    const sender = await getSenderInfo();
    console.log('Sender info', sender);
    
    switch (commerceEvent) {
    case 'customers.login.token':
        return customersLoginToken(
            sender, 
            payload.email, 
            payload.url
        );

    case 'orders.create':
        return ordersCreate(
            sender, 
            payload.customer, 
            payload.customer_reference, 
            payload.created, 
            payload.status_fulfillment, 
            payload.order, 
            payload.shipping,
            payload.transactions,
        );

    case 'orders.physical.shipment':
        return ordersPhysicalShipment(
            sender,
            payload.customer, 
            payload.order_customer_reference,
            payload.created,
            payload.line_items,
            payload.carrier_name,
            payload.tracking_number,
        );

    default:
        return getError(`Event is not supported: ${commerceEvent}`);
    }
}

/**
 * @param {SenderInfo} sender 
 * @param {string} email 
 * @param {string} url 
 * @returns {Promise<NetlifyResponse>}
 */
async function customersLoginToken(sender, email, url) {
    if (!email) {
        return getError('Email is undefined');
    }

    if (!url) {
        return getSuccess(`Skipping email ${email}: not yet registered`);
    }

    await loginEmail({ sender, receiver: email, loginLink: url });

    return getSuccess(`Login email sent successfully to ${email}`);
}


/**
 * @param {SenderInfo} sender 
 * @param {Customer} customer 
 * @param {string} reference 
 * @param {number} created 
 * @param {string} status_fulfillment 
 * @param {Order} order 
 * @param {Address} shipping 
 * @param {Transaction[]} transactions 
 * @returns {Promise<NetlifyResponse>}
 */
async function ordersCreate(sender, customer, reference, created, status_fulfillment, order, shipping, transactions) {
    if (!customer?.email) {
        return getError('Customer email is undefined');
    }

    const items = order.line_items.map((lineItem) => ({
        name: lineItem.product_name,
        quantity: lineItem.quantity,
        price: lineItem.line_total.formatted_with_symbol,
    }));

    /**
     * @param {string} code 
     */
    const getStatus = (code) => {
        switch (code) {
        case 'not_fulfilled':
            return { text: 'In corso', color: '#fbb45e' };

        case 'fulfilled':
            return { text: 'Completato', color: '#0069d9' };
    
        default:
            return { text: 'In corso', color: '#fbb45e' };
        }
    }

    await orderReceiptEmail({ 
        sender,
        receiver: customer.email,
        reference: `#${reference}`,
        created: moment.unix(created).format('DD/MM/YYYY'),
        status: getStatus(status_fulfillment),
        buyer: {
            firstname: customer.firstname,
            lastname: customer.lastname,
            email: customer.email,
        },
        shipping: {
            name: shipping.name,
            address: shipping.street,
            city: shipping.town_city,
            state: shipping.county_state,
            country: shipping.country,
            zip: shipping.postal_zip_code,
            method: order.shipping.description,
        },
        order: {
            items,
            subtotal: order.subtotal.formatted_with_symbol,
            shipping: order.shipping.price.formatted_with_symbol,
            total: order.total.formatted_with_symbol,
        },
        payment: {
            method: transactions?.length ? transactions[0].gateway_name : '',
        },
    });

    return getSuccess(`Order Receipt email sent successfully to ${customer.email}`);
}

/**
 * @param {SenderInfo} sender 
 * @param {Customer} customer 
 * @param {string} reference 
 * @param {number} created 
 * @param {ShippedItem[]} items 
 * @param {string} carrier
 * @param {string} trackingNumber 
 */
async function ordersPhysicalShipment(sender, customer, reference, created, items, carrier, trackingNumber) {
    if (!customer?.email) {
        return getError('Customer email is undefined');
    }

    await orderShippedEmail({ 
        sender,
        receiver: customer.email,
        reference: `#${reference}`,
        created: moment.unix(created).format('DD/MM/YYYY'),
        buyer: {
            firstname: customer.firstname,
            lastname: customer.lastname,
            email: customer.email,
        },
        items: items.map(item => ({
            name: item.product_name,
            quantity: item.fulfilled_quantity,
        })),
        carrier,
        trackingNumber
    });

    return getSuccess(`Order Receipt email sent successfully to ${customer.email}`);
}
