const rp = require("request-promise");
const cheerio = require("cheerio");
const { parse } = require("json2csv");
const fs = require("fs");
const urls = [
  "https://www.amazon.in/s?k=keyboard&tag=amdot-21&ref=nb_sb_noss",
  "https://www.amazon.in/s?k=keyboard&page=2&qid=1637742743&ref=sr_pg_2",
  "https://www.amazon.in/s?k=keyboard&page=3&qid=1637772867&ref=sr_pg_3",
  "https://www.amazon.in/s?k=keyboard&page=4&qid=1637775042&ref=sr_pg_4",
  "https://www.amazon.in/s?k=keyboard&page=5&qid=1637775046&ref=sr_pg_5",
  "https://www.amazon.in/s?k=keyboard&page=6&qid=1637775062&ref=sr_pg_6",
  "https://www.amazon.in/s?k=keyboard&page=7&qid=1637775082&ref=sr_pg_7",
];

const AMZData = [];
const fields = [
  "Name",
  "Link",
  "WholeSalePrice",
  "OffPrice",
  "Rating",
  "Offer",
];
const opts = { fields };

async function app() {
  for await (url of urls) {
    await YoManScrapIt(url);
  }
}

async function YoManScrapIt(url) {
  rp(url)
    .then((html) => {
      const $ = cheerio.load(html);

      $(`.sg-col-inner .s-result-item.s-asin.sg-col-0-of-12.sg-col-16-of-20.AdHolder.sg-col.s-widget-spacing-small.sg-col-12-of-16 .a-section .sg-row:nth-child(2) div:nth-child(2) > .sg-col-inner,
    .sg-col-inner .s-result-item.s-asin.sg-col-0-of-12.sg-col-16-of-20.sg-col.s-widget-spacing-small.sg-col-12-of-16 .a-section .sg-row:nth-child(2) div:nth-child(2) > .sg-col-inner`).each(
        (i, el) => {
          AMZData.push({
            Name: $(el).find("h2 > a > span").text(),
            Link: $(el).find("h2 > a").attr("href"),
            WholeSalePrice: $(el).find("span.a-price-whole").text(),
            OffPrice: $(el).find("span.a-price.a-text-price").text(),
            Rating: $(el).find("a > i ").text(),
            Offer: $(el)
              .find(".a-row.s-align-children-center span:nth-child(2)")
              .text(),
          });
        }
      );
      //   console.log(AMZData);
      try {
        const csv = parse(AMZData, opts);
        // console.log(csv);
        fs.writeFileSync("test.txt", csv, { flag: "a+" });
      } catch (err) {
        console.error(err);
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

app();
