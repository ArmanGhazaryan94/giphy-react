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

  fetchData(props) {
    axios
      .get(this.getURL(props))
      .then(({ data }) => this.setState({ data }))
      .catch((err) => {
        console.error(err);
        this.setState({ data: null })
      });
  }

  getURL(props) {
    const { src, id, offset, searchTerm } = props;
    let url = '';
    console.log('a11111',searchTerm)
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
    console.log(11)
    const { src, upload } = this.props;
    if (src) {
      this.setState({ data: src })
    } else if (upload && !isEmptyObject(upload)) {
      this.uploadImage(upload);
    } else {
      this.fetchData(this.props);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { src, upload } = nextProps;
    console.log('next', nextProps, this.props)
    if (src) {
      this.setState({ data: src })
    } else if (upload && !isEmptyObject(upload)) {
      this.uploadImage(upload);
    } else {
      this.fetchData(nextProps);
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
    console.log('rendered')
    const { sorted, src, id } = this.props;
    const { data } = this.state;

    if (sorted && data && data.data && !src && !id) {
      console.log(this.props)
      const sortedData = [
        ...data.data.sort((prev, cur) => sorted === 'DESC'
          ? new Date(prev.import_datetime).getTime() - new Date(cur.import_datetime).getTime()
          : new Date(cur.import_datetime).getTime() - new Date(prev.import_datetime).getTime())
      ];
      return this.props.render({data: sortedData, pagination: data.pagination})
    }

    return this.props.render(data);
  }
}
export default Giphy;
