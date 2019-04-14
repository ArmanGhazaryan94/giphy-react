import React, { Component } from 'react';
import Giphy from "./Giphy";

import './styles.css';

class App extends Component {

  state = {
    searchText: '',
    id: '',
    value: '',
    sortBy: ''
  };

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

  renderTrending = (data) => {
    if(!data){
      return 'something went wrong'
    }
    return Array.isArray(data.data)
      ? data.data.length
        ?(<ul className='trending'>
          {data.data.map(gif =>
            <li key={gif.id} onClick={() => this.onGifClick(gif.id)}>
              <p>{this.getGifTitle(gif)}</p>
              <img alt={gif.title} key={gif.id} src={gif.images.preview_gif.url}/>
            </li>)
          }
        </ul>)
        : 'there are no items'
      :  <div className='center'>
      <img alt={data.data.title} src={data.data.images.original.url}/>
    </div>
  };

  getGifTitle = (gif) => gif.title.slice(0, gif.title.indexOf('GIF'));

  onGifClick = (id) => {
    this.setState({ id })
  };

  handleSearch = (e) => {
    if(this.timeoutID){
      clearTimeout(this.timeoutID)
    }
    const searchText = e.target.value;
    this.setState({ value: searchText});
    this.timeoutID = setTimeout(() => this.setState({ searchText }), 400);
  };

  onSortChange = (e) => {
    this.setState({ sortBy: e.target.value })
  };

  onBackClick = () => this.setState({ id: '' });

  render() {
    return (
      <div className='container'>
        {
          !this.state.id
            ? <header>
              <h1>{
                this.state.searchText
                  ? `Searched items by '${this.state.searchText}'`
                  : 'Trending'
              }</h1>
              <div className='center'>
                <label>
                  Search <input type="text" onChange={this.handleSearch} value={this.state.value}/>
                </label>
              </div>
              <div className='center sort'>
                Sort by <select name="sort" onChange={this.onSortChange} value={this.state.sortBy}>
                <option value="">None</option>
                <option value="DESC">Newest</option>
                <option value="ASC">Oldest</option>
              </select>
              </div>
            </header>
            : <button onClick={this.onBackClick}>Back</button>
        }
        <Giphy
          sortBy={this.state.sortBy}
          id={this.state.id}
          searchTerm={this.state.searchText}
          render={this.renderTrending}
        />
      </div>
    );
  }
}

export default App;
