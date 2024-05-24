import axios, { Axios } from 'axios';

// Set default XSRF settings for Axios
axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

// Function to extract a cookie value by name
function getCookie(name:string) {
  const cookieValue = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
  return cookieValue ? cookieValue.pop() : '';
}

// Function to set XSRF token in request headers
function setCSRFToken(client:Axios) {
  const csrftoken = getCookie('csrftoken');
  client.defaults.headers.post['X-CSRFToken'] = csrftoken;
}

// Create an Axios instance with predefined settings
const client = axios.create({
  baseURL: "http://127.0.0.1:8000/"
});

// Set XSRF token in the created client
setCSRFToken(client);

export default client;
