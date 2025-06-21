
const axios = require('axios');

const keyword = process.argv[2];
const zipCode = process.argv[3];

async function getNearestStore(zip) {
  const res = await axios.post(
    "https://www.99ranch.com/be-api/store/web/nearby/stores",
    {
      zipCode: zip,
      pageSize: 1,
      pageNum: 1,
      type: 1,
      source: "WEB",
      within: null
    },
    {
      headers: {
        "accept": "application/json",
        "content-type": "application/json",
        "lang": "en_US",
        "time-zone": "America/Los_Angeles"
      }
    }
  );
  const stores = res.data.data.records || [];

  return stores.length > 0 ? stores[0].id : null;
}

async function searchProducts(storeId, keyword) {
  const res = await axios.post(
    "https://www.99ranch.com/be-api/search/web/products",
    {
      page: 1,
      pageSize: 5,
      keyword,
      availability: 1,
      sortBy: "salePrice",
      sortOrder: "ASC"
    },
    {
      headers: {
        "accept": "application/json",
        "content-type": "application/json",
        "storeid": storeId,
        "time-zone": "America/Los_Angeles",
        "lang": "en_US"
      }
    }
  );
  console.log("Search response:", res.data.data);
  return res.data.data?.products || [];
}

async function main() {
  const storeId = await getNearestStore(zipCode);
  if (!storeId) {
    console.error("No nearby 99 Ranch store found.");
    return;
  }

  const products = await searchProducts(storeId, keyword);
  const cleaned = products.map(p => ({
    id: p.productId,
    title: p.name,
    brand: p.brandName,
    price: p.salePrice,
    image_url: p.imageUrl,
    location: "99 Ranch"
  }));

  console.log(JSON.stringify(cleaned));
}

main().catch(console.error);
