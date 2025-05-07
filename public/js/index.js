import '@babel/polyfill';
import { login, logout } from './login.js';
import { displayMap } from './mapbox.js';

mapboxgl.accessToken =
  'pk.eyJ1IjoiamlnYXJjZTAwNyIsImEiOiJjbTlqYWQyam4wOWtxMmpzZzdvcmtsMWVzIn0.A0egDu9561KGf-I1autMbA';

const mapbox = document.getElementById('map');
const loginform = document.querySelector('.form');
const logoutBtn = document.querySelector('.nav__el--logout');

if (mapbox) {
  const locations = JSON.parse(mapbox.dataset.locations);
  console.log(` Locations : ${JSON.stringify(locations)}`);
  displayMap(locations);
}

if (loginform) {
  loginform.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (logoutBtn) {
  console.log('Logout button:', logoutBtn);
  logoutBtn.addEventListener('click', logout);
}
