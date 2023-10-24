import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const searchForm = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const input = searchForm.elements.searchQuery;
let searchValue;
let page;
let count;
const loadMoreBtn = document.querySelector('.load-more');

const API_KEY = '40200855-3a192acac81e17bb872cbbb4e';
// const BASE_URL = 'https://pixabay.com/api/';
axios.defaults.baseURL = 'https://pixabay.com/api/';
// axios.defaults.headers.common['key'] = '40200855-3a192acac81e17bb872cbbb4e';
// axios.defaults.headers.common['image_type'] = 'horizontal';
// axios.defaults.headers.common['safesearch'] = 'true';
input.addEventListener('input', handleInput);
searchForm.addEventListener('submit', handleSubmit);
loadMoreBtn.addEventListener('click', handleClick);
const galleryBox = new SimpleLightbox('.gallery a');
function handleInput(event){
  searchValue = event.currentTarget.value;
}

async function handleSubmit(event) {
  event.preventDefault();
  if (!searchValue) {
    Notify.warning("Search mustn't be empty");
    return;
  }
  try {
    page = 1;
    const resp = await fetchPictures();
    if(!resp.data.hits.length){
      Notify.warning('Sorry, there are no images matching your search query. Please try again.');
          return;// console.log('Sorry, there are no images matching your search query. Please try again.');
      }
      Notify.success(`Hooray! We found ${resp.data.totalHits} images.`);
    gallery.innerHTML = '';
    renderPictureCard(resp.data.hits);
    console.log(resp.data.hits);
    count = 0;
    count += resp.data.hits.length;
    if (count < resp.data.totalHits) {
      loadMoreBtn.classList.remove('hidden');
    }
  }
  catch{
    Notify.failure('Oops! Something went wrong! Try reloading the page!');
  }
}

async function fetchPictures(){
    return await axios.get(`?key=${API_KEY}&q=${searchValue}&image_type=horizontal&safesearch=true&per_page=40&page=${page}`);
 
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
  // const markup = arr.map(item => `<div class="photo-card">
  //     <img src="${item.webformatURL}" alt="${item.tags}" loading="lazy" />
  //        <div class="info">
  //          <p class="info-item">
  //            <b>Likes</b>
  //            ${item.likes}
  //          </p>
  //          <p class="info-item">
  //            <b>Views</b>
  //            ${item.views}
  //          </p>
  //          <p class="info-item">
  //            <b>Comments</b>
  //            ${item.comments}
  //          </p>
  //          <p class="info-item">
  //            <b>Downloads</b>
  //            ${item.downloads}
  //          </p>
  //      </div>
  //      </div>`).join('')
  gallery.insertAdjacentHTML('beforeend', markup); 
  galleryBox.refresh();
}

async function handleClick() {
  page += 1;
  try {
    const resp = await fetchPictures();
    renderPictureCard(resp.data.hits);
    const { height: cardHeight } = document
  .querySelector(".gallery")
  .firstElementChild.getBoundingClientRect();

window.scrollBy({
  top: cardHeight * 3,
  behavior: "smooth",
});
    count += resp.data.hits.length;
    console.log(count);
    console.log(resp.data.totalHits);
    if (count >= resp.data.totalHits) {
      loadMoreBtn.classList.add('hidden');
    }
  }
  catch {
    Notify.failure('Oops! Something went wrong! Try reloading the page!');
  }
  
}
// const API_KEY = '40200855-3a192acac81e17bb872cbbb4e';
// const BASE_URL = 'https://pixabay.com/api/';

// function handleSubmit(event){
//     event.preventDefault();
//     fetch(`${BASE_URL}?key=${API_KEY}&q=${searchValue}&image_type=horizontal&safesearch=true`)
//     .then(resp => 
//        {if(!resp.ok){
//         throw new Error()}
//     return resp.json()} ).then(arr => {
//       console.log(arr);
//         if(!arr.hits.length){
//             Notify.warning('Sorry, there are no images matching your search query. Please try again.');
//             return;// console.log('Sorry, there are no images matching your search query. Please try again.');
//         }
//         Notify.success(`Hooray! We found ${arr.totalHits} images.`);
//        const markup = arr.hits.map(item => `<div class="photo-card">
//         <img src="${item.webformatURL}" alt="${item.tags}" loading="lazy" />
//         <div class="info">
//           <p class="info-item">
//             <b>Likes</b>
//             ${item.likes}
//           </p>
//           <p class="info-item">
//             <b>Views</b>
//             ${item.views}
//           </p>
//           <p class="info-item">
//             <b>Comments</b>
//             ${item.comments}
//           </p>
//           <p class="info-item">
//             <b>Downloads</b>
//             ${item.downloads}
//           </p>
//         </div>
//       </div>`).join('')
//       gallery.innerHTML = markup;
//     }).catch(() =>  Notify.failure('Oops! Something went wrong! Try reloading the page!'));
// }