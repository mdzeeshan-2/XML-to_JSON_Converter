const express = require('express');
const cors = require('cors');
const app = express();
const request = require('request');
const xml2js = require('xml2js');

const port = process.env.PORT || 5000;

app.use(cors());

app.get('/fetch-nytimes-data/:section', (req, res) => {
  const section = req.params.section;
  const apiKey = 'YOUR_NYTIMES_API_KEY'; // Replace with your NY Times API key

  const nytimesApiUrl = `https://api.nytimes.com/services/xml/rss/nyt/${section}.xml`;

  const options = {
    url: nytimesApiUrl,
    method: "GET",
    headers: {
      Accept: "application/xml",
    },
  };

  request(options, function (err, response, body) {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Error fetching data from NY Times API" });
    } else {
      xml2js.parseString(body, { explicitArray: false }, function (parseErr, result) {
        if (parseErr) {
          console.error(parseErr);
          res.status(500).json({ error: "Error parsing XML data" });
        } else {
          const jsonData = result;
          res.json(jsonData);
        }
      });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
