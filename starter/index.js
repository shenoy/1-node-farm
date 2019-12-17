const fs = require('fs');
const http = require('http');
const url = require('url');

const replaceTemp = require('./modules/replaceTemp')
const slugify = require('slugify');


// const InputRead = fs.readFileSync('./txt/input.txt', 'utf-8');

// const outputWrite = fs.writeFileSync('./txt/output.txt', `This is the content of input file : ${InputRead}`);

// const outputRead = fs.readFileSync('./txt/output.txt', 'utf-8');

// console.log(outputRead);

// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {

//   fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//     console.log(data2);
//     fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {

//       console.log(data3);
//       fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, err => {

//         console.log("Your file has been written");
//       });

//     });
//   });

// });

// console.log("Will read file !")
//////////////////////////////////////////////////////////////////////////

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const slugs = dataObj.map(el => slugify(el.productName, { lower: true }));



const server = http.createServer((req, res) => {
  const { query, pathname } = url.parse(req.url, true);

  ////////////OVERVIEW


  if (pathname === '/' || pathname === '/overview') {

    const cardsHtml = dataObj.map(el => replaceTemp(tempCard, el)).join('');
    res.writeHead(200, { 'Content-type': 'text/html' });

    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
    res.end(output);

    ///////////////////////////PRODUCT

  } else if (pathname === '/product') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const product = dataObj[query.id];
    const output = replaceTemp(tempProduct, product);
    res.end(output);

    ////////////////////////////API
  } else if (pathname === '/api') {
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(data);

    ////////////////////////NOT FOUND
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'hello-world'
    });
    res.end('<h3> Page Not Found!</h3>');
  }
});


server.listen(8000, '127.0.0.1', () => {

  console.log("Listening to the server!");

});