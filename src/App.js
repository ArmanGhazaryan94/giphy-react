import React, { Component } from 'react';
import Giphy from "./Giphy";

class App extends Component {
  renderContent(gifs) {
    if(typeof gifs === 'string') {
      return <img src={gifs}/>;
    }
    const { data, pagination } = gifs || {};
    if (data) {
      return Array.isArray(data)
        ? data.map(gif => <img key={gif.id} src={gif.images.preview_gif.url}/>)
        : <img src={data.images.original.url}/>;
    }

    return null;
  }

  render() {
    return (
      <div>
        <Giphy render={this.renderContent}/>
      </div>
    );
  }
}

export default App;
