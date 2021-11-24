const Cheerio = require("cheerio");
const rp = require("request-promise");

const potusParse = (url) => {
  return rp(url)
    .then((html) => {
      const $ = Cheerio.load(html);
      return {
        Name: $("#firstHeading").text(),
        OfficePeriod: $(
          "#mw-content-text > div.mw-parser-output > table.infobox.vcard > tbody > tr:nth-child(5)"
        ).text(),
      };
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports = potusParse;
