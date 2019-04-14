# reactjs-giphy

> React component to work with GIFs (Giphy API)

## Install

```bash
npm install reactjs-giphy
```

## Usage


### Trending
```jsx
import React, { Component } from 'react'

import Giphy from 'reactjs-giphy'

class Example extends Component {
  renderContent({ data }) {
    return data.map(gif => <img key={gif.id} src={gif.images.preview.url} />)
  } 

  render () {
    return (
      <Giphy render={this.renderContent} />
    )
  }
}
```

### By GIF ID
```jsx
import React, { Component } from 'react'

import Giphy from 'reactjs-giphy'

class Example extends Component {
  renderContent({ data }) {
    return (<img src={gif.images.preview.url} />)
  } 

  render () {
    return (
      <Giphy id={someId} render={this.renderContent} />
    )
  }
}
```

# Props

### render 
handler returns gifs from Giphy API (required, function)

### id
gif ID that should be fetched from Giphy API (string)

### searchTerm 
search gifs by title (string)

### offset
skip some count gifs from start (number)

### apiKey
Giphy API api key (string)

### upload
upload provided Gif (object ex. {username: 'John', src: 'Some gif source'})

### sortBy
Sort by Gif's uploaded time (string ex. 'ASC', 'DESC')


## License

MIT © [ArmanGhazaryan94](https://github.com/ArmanGhazaryan94)
