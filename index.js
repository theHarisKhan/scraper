const rp = require("request-promise");
const cheerio = require("cheerio");
const potusParse = require("./potusParse");
const url =
  "https://en.wikipedia.org/wiki/List_of_presidents_of_the_United_States";

rp(url)
  .then((html) => {
    // success
    const $ = cheerio.load(html);
    const title = $(".wikitable td b a");
    const wikis = [];

    for (let i = 0; i < title.length; i++) {
      const Name = title[i].attribs.title;
      const Link = title[i].attribs.href;
      wikis.push({ Name, Link });
    }

    return Promise.all(
      wikis.map((url) => {
        return potusParse(`https://en.wikipedia.org${url.Link}`);
      })
    );

    // console.log(wikis);
  })
  .then((president) => {
    console.log(president);
  })
  .catch((err) => {
    // failed
    console.log(err);
  });
