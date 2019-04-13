import React from "react";
import axios from "axios";
import {isEmptyObject} from "./helpers";

const BASE_URL = 'http://api.giphy.com/v1/gifs';
const API_KEY = 'SsZBTCxQ2TaB6q8ixf35x6HC5aL6FWbu';

class Giphy extends React.PureComponent {
  state = {
    data: null
  };

  constructor(props) {
    super(props);
    this.apiKey = this.props.apiKey || API_KEY;
  }

  fetchData() {
    axios
      .get(this.getURL())
      .then(({ data }) => this.setState({ data }))
      .catch(console.error);
  }

  getURL() {
    const { src, id, offset, searchTerm } = this.props;
    let url = '';

    if (src) {
      url = src;
    } else if (id) {
      url = `${BASE_URL}/${id}`;
    } else if (searchTerm) {
      url = `${BASE_URL}/search`
    } else {
      url = `${BASE_URL}/trending`;
    }

    return `${url}?api_key=${this.apiKey}&offset=${offset}&q=${searchTerm}`;
  }


  componentDidMount() {
    const { src, upload } = this.props;
    if (src) {
      this.setState({ data: src })
    } else if (upload && !isEmptyObject(upload)) {
      this.uploadImage(upload);
    } else {
      this.fetchData();
    }
  }

  uploadImage(data) {
    const { username, src } = data;
    axios
      .post(`https://upload.giphy.com/v1/gifs?api_key=${this.apiKey}&username=${username}&source_image_url=${src}`)
      .then(res => this.setState({ data: res.data.id }))
      .catch(console.error);
  }

  render(){
    const { sorted, order = 'DESC', src, id } = this.props;
    const { data } = this.state;

    if (sorted && data && !src && !id) {
      const sortedData = [
        ...data.data.sort((prev, cur) => order === 'DESC'
          ? Date(prev.import_datetime) - Date(cur.import_datetime)
          : Date(cur.import_datetime) - Date(prev.import_datetime))
      ];
      return this.props.render({data: sortedData})
    }

    return this.props.render(data);
  }
}
export default Giphy;