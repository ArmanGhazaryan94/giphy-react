import React from "react";
import axios from "axios";
import {isEmptyObject} from "./helpers";

const BASE_URL = 'http://api.giphy.com/v1/gifs';
const API_KEY = 'SsZBTCxQ2TaB6q8ixf35x6HC5aL6FWbu';

class Giphy extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: null
    };
    this.apiKey = this.props.apiKey || API_KEY;
  }

  componentDidMount() {
    const { upload } = this.props;
    if (upload && !isEmptyObject(upload)) {
      this.uploadImage(upload);
    } else {
      this.fetchData(this.props);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { upload } = nextProps;
    if (upload && !isEmptyObject(upload)) {
      this.uploadImage(upload);
    } else if (this.props.searchTerm !== nextProps.searchTerm || this.props.id !== nextProps.id) {
      this.fetchData(nextProps);
    }
  }

  getURL(props) {
    const { id, offset, searchTerm } = props;
    let url = '';
    if (id) {
      url = `${BASE_URL}/${id}`;
    } else if (searchTerm) {
      url = `${BASE_URL}/search`
    } else {
      url = `${BASE_URL}/trending`;
    }

    return `${url}?api_key=${this.apiKey}&offset=${offset}&q=${searchTerm}`;
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

  uploadImage(data) {
    const { username } = data;
    axios
      .post(`https://upload.giphy.com/v1/gifs?api_key=${this.apiKey}&username=${username}`)
      .then(res => this.setState({ data: res.data.id }))
      .catch(console.error);
  }

  checkDataTypes = () => {
    const { data } = this.state;
    const { sortBy, id } = this.props;
    return sortBy && data && Array.isArray(data.data) && !id
  };

  render(){
    const { sortBy } = this.props;
    const { data } = this.state;

    if (this.checkDataTypes()) {
      const sortedData = [
        ...data.data.sort((prev, cur) => sortBy === 'DESC'
          ? new Date(prev.import_datetime).getTime() - new Date(cur.import_datetime).getTime()
          : new Date(cur.import_datetime).getTime() - new Date(prev.import_datetime).getTime())
      ];
      return this.props.render({data: sortedData, pagination: data.pagination})
    }

    return this.props.render(data);
  }
}
export default Giphy;
