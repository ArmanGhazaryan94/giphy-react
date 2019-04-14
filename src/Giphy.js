import React from "react";
import axios from "axios";
import {isEmptyObject} from "./helpers";
import PropTypes from 'prop-types';

const BASE_URL = 'http://api.giphy.com/v1/gifs';
const API_KEY = 'SsZBTCxQ2TaB6q8ixf35x6HC5aL6FWbu';

export default class Giphy extends React.PureComponent {
  static propTypes = {
    render: PropTypes.func.isRequired,
    id: PropTypes.string,
    offset: PropTypes.number,
    sortBy: PropTypes.string,
    searchTerm: PropTypes.string,
  };

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
    const { upload, id, offset, searchTerm } = nextProps;
    if (upload && !isEmptyObject(upload)) {
      this.uploadImage(upload);
    } else if (
      this.props.searchTerm !== searchTerm
      || this.props.id !== id
      || this.props.offset !== offset
    ) {
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
      .then(({ data }) => {
        this.setState({ data })
      })
      .catch(this.handleError);
  }

  uploadImage(data) {
    const { username, src } = data;
    axios
      .post(`https://upload.giphy.com/v1/gifs?api_key=${this.apiKey}&username=${username}&source_image_url=${src}`)
      .then(res => this.setState({ data: res.data.id }))
      .catch(this.handleError);
  }

  handleError = (err) => {
    console.error(err);
    this.setState({ data: null });
  };

  checkDataTypes = () => {
    const { data } = this.state;
    const { sortBy, id } = this.props;
    return sortBy && data && Array.isArray(data.data) && !id
  };

  render(){
    const { sortBy, render } = this.props;
    const { data } = this.state;

    if (this.checkDataTypes()) {
      const sortedData = [
        ...data.data.sort((prev, cur) => sortBy === 'DESC'
          ? new Date(prev.import_datetime).getTime() - new Date(cur.import_datetime).getTime()
          : new Date(cur.import_datetime).getTime() - new Date(prev.import_datetime).getTime())
      ];
      return this.props.render({data: sortedData, pagination: data.pagination})
    }

    return render && render(data);
  }
}
