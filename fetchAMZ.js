const rp = require("request-promise");
const cheerio = require("cheerio");
const xl = require("excel4node");
const fs = require("fs");
// links to scrap
const urls = require("./links");

// WorkSheet Headings and Name
const wb = new xl.Workbook();
const ws = wb.addWorksheet("Data");
const headingColumnNames = [
  "Name",
  "WholeSalePrice",
  "OffPrice",
  "Rating",
  "Offer",
];
const AMZData = [];

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
          if (
            $(el).find("h2 > a > span").text() !== "" &&
            $(el).find("span.a-price-whole").text() !== "" &&
            $(el).find("span.a-price.a-text-price").text() !== "" &&
            $(el)
              .find(".a-row.s-align-children-center span:nth-child(2)")
              .text() !== ""
          ) {
            AMZData.push({
              Name: $(el).find("h2 > a > span").text(),
              WholeSalePrice: $(el).find("span.a-price-whole").text(),
              OffPrice: $(el).find("span.a-price.a-text-price").text(),
              Rating: $(el).find("a > i ").text(),
              Offer: $(el)
                .find(".a-row.s-align-children-center span:nth-child(2)")
                .text(),
            });
          }
        }
      );
      //   console.log(AMZData);
      try {
        let headingColumnIndex = 1;
        headingColumnNames.forEach((heading) => {
          ws.cell(1, headingColumnIndex++).string(heading);
        });
        //Write Data in Excel file
        let rowIndex = 2;
        AMZData.forEach((record) => {
          let columnIndex = 1;
          Object.keys(record).forEach((columnName) => {
            ws.cell(rowIndex, columnIndex++).string(record[columnName]);
          });
          rowIndex++;
        });
        wb.write("Data.xlsx");
      } catch (err) {
        console.error(err);
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

app();
