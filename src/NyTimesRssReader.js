import React, { Component } from 'react';

class NewsFeed extends Component {
  constructor() {
    super();
    this.state = {
      section: '',
      feedData: [],
    };
  }

  formatDate = (pubDate) => {
    const date = new Date(pubDate);
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'
    ];
    const formattedDate = `${monthNames[date.getMonth()]}, ${date.getDate()}, ${date.getFullYear()}`;
    return formattedDate;
  };

  fetchNews = () => {
    const { section } = this.state;
    const apiKey = 'MgSm5d1ATxJxXvJj2NimsAQlyVgd8Upl'; // Replace with your NY Times API key

    if (section) {
      const apiUrl = `https://api.nytimes.com/services/xml/rss/nyt/${section}.xml?api-key=${apiKey}`;

      fetch(apiUrl)
        .then((response) => response.text())
        .then((data) => {
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(data, 'text/xml');
          const items = xmlDoc.querySelectorAll('item');

          const feedData = [];
          items.forEach((item) => {
            const title = item.querySelector('title').textContent;
            const link = item.querySelector('link').textContent;
            const mediaContent = item.querySelector('media\\:content, content');
            const imageUrl = mediaContent ? mediaContent.getAttribute('url') : '';
            const description = item.querySelector('description').textContent;
            const author = item.querySelector('dc\\:creator, creator').textContent;
            const pubDate = this.formatDate(item.querySelector('pubDate').textContent);

            feedData.push({
              title,
              link,
              imageUrl,
              description,
              author,
              pubDate,
            });
          });

          this.setState({ feedData });
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
        });
    }
  };

  render() {
    const { section, feedData } = this.state;

    return (
      <div>
        <h1>NY Times News Feed</h1>
        <div>
          <select
            value={section}
            onChange={(e) => this.setState({ section: e.target.value })}
          >
            <option value="">Select a Section</option>
            <option value="Europe">Europe</option>
            <option value="Africa">Africa</option>
            <option value="Middle East">Middle East</option>
            <option value="America">America</option>
            <option value="Canada">Canada</option>
          </select>
          <button onClick={this.fetchNews}>Fetch News</button>
        </div>
        <ul>
          {feedData.map((item, index) => (
            <li key={index}>
              <a href={item.link} target="_blank" rel="noopener noreferrer">
                <img src={item.imageUrl} alt={item.title} />
                <h2>{item.title}</h2>
                <p>{item.description}</p>
                <p>Author: {item.author}</p>
                <p>Publication Date: {item.pubDate}</p>
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default NewsFeed;
