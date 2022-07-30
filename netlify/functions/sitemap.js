
const { SitemapStream, streamToPromise } = require('sitemap');
const Commerce = require('@chec/commerce.js');

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

const commerce = new Commerce(
    checAPIKey,
    devEnvironment,
    commerceConfig,
);

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
 * @param {NetlifyEvent} event 
 * @param {*} _context 
 * @returns {Promise<NetlifyResponse>}
 */
exports.handler = async function ({ headers }, _context) {
    const smStream = new SitemapStream({
        hostname: `https://${headers.host}`,
    });

    console.log('hostname', `https://${headers.host}`);

    const { data: products } = await commerce.products.list();

    smStream.write({
        url: '/',
        changefreq: 'daily',
        priority: 0.9
    });

    smStream.write({
        url: '/collection',
        changefreq: 'daily',
        priority: 0.9
    });

    products.forEach(product => {
        smStream.write({
            url: `/collection/${product.permalink}`,
            changefreq: 'daily',
            priority: 0.9
        });
    });

    smStream.write({
        url: '/about',
        changefreq: 'monthly',
        priority: 0.7
    });

    smStream.end();

    const sitemapOutput = await streamToPromise(smStream);

    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/xml'
        },
        body: sitemapOutput.toString(),
    };
}
