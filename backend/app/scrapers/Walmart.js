// walmartSearch.js
const axios = require('axios');
const fs = require('fs');

const headers = {
  'accept': 'application/json',
  'accept-language': 'en-US',
  'cache-control': 'no-cache',
  'content-type': 'application/json',
  'user-agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Mobile Safari/537.36',
  'wm_mp': 'true',
  'wm_page_url': 'https://www.walmart.com/search?q=apples&facet=fulfillment_method%3APickup',
  'x-apollo-operation-name': 'Search',
  'x-enable-server-timing': '1',
  'x-latency-trace': '1',
  'x-o-bu': 'WALMART-US',
  'x-o-ccm': 'server',
  'x-o-correlation-id': '_NX-qM8r3_Zqeb0MfQ43QUf4qKXX4d74t4kw',
  'x-o-gql-query': 'query Search',
  'x-o-mart': 'B2C',
  'x-o-platform': 'rweb',
  'x-o-platform-version': 'usweb-1.206.0-541a5b6d495a44081b803da2ed173a36bcd39c28-6101554r',
  'x-o-segment': 'oaoh',
  'cookie': fs.readFileSync('./walmart_cookie.txt', 'utf-8') // save your fresh cookie in this file
};

async function searchWalmart(query) {
  const params = {
    variables: JSON.stringify({
      query: query,
      page: 1,
      prg: 'mWeb',
      facet: 'fulfillment_method:Pickup',
      sort: 'best_match',
      limit: 40,
      ps: 40,
      rawFacet: 'fulfillment_method:Pickup',
      searchArgs: {
        query: query,
        prg: 'mWeb',
        facet: 'fulfillment_method:Pickup'
      }
    })
  };

  try {
    const res = await axios.get(
      'https://www.walmart.com/orchestra/snb/graphql/Search/4ad87c0aaba7a647788bb467c81676850f552d532121da0c2355ee350cb597d3/search',
      { headers, params }
    );

    const items = res.data?.data?.search?.searchResult?.itemStacks?.flatMap(stack => stack.items) || [];
    items.forEach((item, i) => {
      console.log(`${i + 1}. ${item.title} - ${item.primaryOffer?.offerPrice?.priceDisplay || 'No Price'}`);
    });
  } catch (err) {
    console.error('❌ Failed:', err.response?.status, err.response?.data || err.message);
  }
}

const [_, __, ...args] = process.argv;
if (!args.length) {
  console.log('Usage: node walmartSearch.js <query>');
  process.exit(1);
}
searchWalmart(args.join(' '));
