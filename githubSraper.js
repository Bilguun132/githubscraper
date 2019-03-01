const rp = require('request-promise');
const url = 'https://github.com/trending';
var cheerio = require('cheerio');
var cheerioAdv = require('cheerio-advanced-selectors')
var fs = require('fs');

const Json2csvParser = require('json2csv').Parser;
const fields = ['author', 'repoName', 'totalStars'];

cheerio = cheerioAdv.wrap(cheerio)

rp(url)
    .then(function (html) {

        //Load HTML body into cheerio
        const $ = cheerio.load(html);
        const repoList = $('li > div > h3 > a');
        console.log(repoList.text());
        const starsDiv = $('a.muted-link.d-inline-block.mr-3');

        let authors = [];
        let repoNames = [];
        repoList.each(function (i, value) {
            authors.push(value.children[1].children[0].data);
            repoNames.push(value.children[2].data);
        })

        let stars = [];
        starsDiv.each(function (i, value) {
            if (i % 2 == 0) {
                stars.push(value.children[2].data);
            }
        })
        // console.log(authors);
        // console.log(repoNames);
        // console.log(stars);

        let jsonData = [];

        for (let i = 0; i < authors.length; i++) {
            jsonData.push({
                author: authors[i],
                repoName: repoNames[i],
                totalStars: stars[i]
            })
        }

        const json2csvParser = new Json2csvParser({ fields });
        const csv = json2csvParser.parse(jsonData);


        console.log(csv);

        fs.writeFile('githubTrending.csv', csv, 'utf8', function (err) {
            if (err) {
              console.log('Some error occured - file either not saved or corrupted file saved.');
            } else{
              console.log('It\'s saved!');
            }
          });

    })
    .catch(function (err) {
        //handle error
    });