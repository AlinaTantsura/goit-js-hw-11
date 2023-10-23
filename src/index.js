import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const API_KEY = '40200855-3a192acac81e17bb872cbbb4e';
const BASE_URL = 'https://pixabay.com/api/';

const searchForm = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const input = searchForm.elements.searchQuery;
let searchValue;

input.addEventListener('input', handleInput);
searchForm.addEventListener('submit', handleSubmit);


function handleInput(event){
    searchValue = event.currentTarget.value;
}

function handleSubmit(event){
    event.preventDefault();
    fetch(`${BASE_URL}?key=${API_KEY}&q=${searchValue}&image_type=horizontal&safesearch=true`)
    .then(resp => 
       {if(!resp.ok){
        throw new Error()}
    return resp.json()} ).then(arr => {
      console.log(arr);
        if(!arr.hits.length){
            Notify.warning('Sorry, there are no images matching your search query. Please try again.');
            return;// console.log('Sorry, there are no images matching your search query. Please try again.');
        }
        Notify.success(`Hooray! We found ${arr.totalHits} images.`);
       const markup = arr.hits.map(item => `<div class="photo-card">
        <img src="${item.webformatURL}" alt="${item.tags}" loading="lazy" />
        <div class="info">
          <p class="info-item">
            <b>Likes</b>
            ${item.likes}
          </p>
          <p class="info-item">
            <b>Views</b>
            ${item.views}
          </p>
          <p class="info-item">
            <b>Comments</b>
            ${item.comments}
          </p>
          <p class="info-item">
            <b>Downloads</b>
            ${item.downloads}
          </p>
        </div>
      </div>`).join('')
      gallery.innerHTML = markup;
    }).catch(() =>  Notify.failure('Oops! Something went wrong! Try reloading the page!'));
}