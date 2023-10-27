import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const searchForm = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const input = searchForm.elements.searchQuery;
const loader = document.querySelector('.loader');
const guard = document.querySelector('.js-guard');
let searchValue;
let page;
const options = {
  root: null,
  rootMargin: "300px",
};
const optionsAxios = {
  baseURL: 'https://pixabay.com/api/',
  params: {
    key: '40200855-3a192acac81e17bb872cbbb4e',
    image_type: 'horizontal',
    safesearch: 'true',
    per_page: 40,
  },
};
const observer = new IntersectionObserver(handlerObzerve, options);

input.addEventListener('input', handleInput);
searchForm.addEventListener('submit', handleSubmit);
const galleryBox = new SimpleLightbox('.gallery a');

function handleInput(event){
  searchValue = event.currentTarget.value;
  observer.unobserve(guard);
}

async function handleSubmit(event) {
  event.preventDefault();
  if (!searchValue) {
    Notify.warning("Search mustn't be empty");
    return;
  }
  try {
    gallery.innerHTML = '';
    page = 1;
    loader.classList.remove('hidden');
    const resp = await fetchPictures();
    loader.classList.add('hidden');
    if(!resp.data.hits.length){
      Notify.warning('Sorry, there are no images matching your search query. Please try again.');
      return;}
      Notify.success(`Hooray! We found ${resp.data.totalHits} images.`);
    renderPictureCard(resp.data.hits);
    // count = 0;
    // count += resp.data.hits.length;
    console.log(gallery.children.length)
    if (gallery.children.length < resp.data.totalHits) {
      observer.observe(guard);
    }
  }
  catch{
    Notify.failure('Oops! Something went wrong! Try reloading the page!');
    loader.classList.add('hidden');
  }
}

async function fetchPictures(){
    return await axios.get(`?q=${searchValue}&page=${page}`, optionsAxios);
  }

function renderPictureCard(arr) {
  const markup = arr.map(item => `<div class="photo-card">
  <a class="img-link" href="${item.largeImageURL}"><img src="${item.webformatURL}" alt="${item.tags}" loading="lazy" /></a>
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
  gallery.insertAdjacentHTML('beforeend', markup); 
  galleryBox.refresh();
}

function handlerObzerve(entries){
  entries.forEach(async (entry) => {
    if(entry.isIntersecting){
      page +=1
    try {
      const resp = await fetchPictures();
      renderPictureCard(resp.data.hits);
      const { height: cardHeight } = document
        .querySelector(".gallery")
        .firstElementChild.getBoundingClientRect();
      
      window.scrollBy({
        top: cardHeight * 2,
        behavior: "smooth",
      });
    if (gallery.children.length >= resp.data.totalHits) {
      observer.unobserve(guard);
      return;
    }
    }
    catch{
      Notify.failure('Oops! Something went wrong! Try reloading the page!');
    }
    }
  })
}
