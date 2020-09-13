const fetch = require("node-fetch");
const cheerio = require("cheerio");

exports.handler = async function (event) {
  try {
    const response = await fetch(event.queryStringParameters.website);
    if (!response.ok) {
      return { statusCode: response.status, body: response.statusText };
    }
    const data = await response.text();
    const $ = cheerio.load(data);

    return {
      statusCode: 200,
      body: JSON.stringify({
        data: {
          title: $(`meta[property='og:title']`).attr(`content`),
          description: $(`meta[property='og:description']`).attr(`content`),
          imageUrl: $(`meta[property='og:image']`).attr(`content`),
        },
      }),
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ data: err.message }),
    };
  }
};
