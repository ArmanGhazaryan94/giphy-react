import React, { Component } from 'react';
import Giphy from "./Giphy";

import './styles.css';

class App extends Component {

  state = {
    searchText: '',
    id: '',
    value: '',
    sorted: ''
  };

  renderContent(gifs) {
    if(typeof gifs === 'string') {
      return <img src={gifs}/>;
    }
    const { data, pagination } = gifs || {};
    if (data) {
      return Array.isArray(data)
        ? data.map(gif => <img key  ={gif.id} src={gif.images.preview_gif.url}/>)
        : <img src={data.images.original.url}/>;
    }

    return null;
  }

  renderTrending = (data) => {
    console.log(data)
    if(!data){
      return 'something went wrong'
    }
    return Array.isArray(data.data)
      ? data.data.length
        ?(<ul className='trending'>
          {data.data.map(gif =>
            <li key={gif.id} onClick={() => this.setState({ id: gif.id })}>
              <p>{gif.title.slice(0, gif.title.indexOf('GIF'))}</p>
              <img key={gif.id} src={gif.images.preview_gif.url}/>
            </li>)
          }
        </ul>)
        : 'there are no items'
      :  <img src={data.data.images.original.url}/>
  };

  onGifClick = (id) => {
    this.setState({ id })
  }

  handleSearch = (e) => {
    if(this.timeoutID){
      clearTimeout(this.timeoutID)
    }
    const searchText = e.target.value;
    this.searchText = searchText;
    this.setState({ value: searchText})
    this.timeoutID = setTimeout(() => this.setState({ n: searchText, searchText  }), 400);
  };

  onSortChange = (e) => {
    this.setState({ sorted: e.target.value })
  };

  render() {
    console.log(this.state)
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
              <div className='search'>
                <label>
                  Search <input type="text" onChange={this.handleSearch} value={this.state.value}/>
                </label>
              </div>
              <div className='search sort'>
                Sort by <select name="sort" onChange={this.onSortChange}>
                <option value="">none</option>
                <option value="ASC">ASC</option>
                <option value="DESC">DESC</option>
              </select>
              </div>
            </header>
            : <button onClick={() => this.setState({ id: '' })}>Back</button>
        }
        <Giphy
          sorted={this.state.sorted}
          id={this.state.id}
          searchTerm={this.state.searchText}
          render={this.renderTrending}
        />
      </div>
    );
  }
}

export default App;
