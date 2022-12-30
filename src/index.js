const axios = require('axios').default;
import Notiflix from 'notiflix';
import SimpleLightBox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const formEll = document.querySelector('.search-form');
const galleryEll = document.querySelector('.gallery');
const loadMoreButtonEll = document.querySelector('#load-more');

let page = 1;
let photo = undefined;
let pagesLeft = 0;
const per_page = 40;

const galleryMarkup = renderpicture(picture);
console.log(galleryMarkup);

formEll.addEventListener('submit', handleSubmit);
loadMoreButtonEll.addEventListener('click', handleLoadMore);

function renderpicture(picture) {
  return picture
    .map(
      ({
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
          <a href=${largeImageURL}><img src=${webformatURL} alt=${tags} loading="lazy" width=270px height=180px/>
    <div class="info">
      <p class="info-item">
          <b>Likes: ${likes}</b>
      </p>
      <p class="info-item">
          <b>Views: ${views}</b>
      </p>
      <p class="info-item">
          <b>Comments: ${comments}</b>
      </p>
      <p class="info-item">
           <b>Downloads: ${downloads}</b>
      </p>
    </div></a>
  </div>`;
      }
    )
    .join(``);
}

function getImg(photo, page) {
  return axios.get(
    `https://pixabay.com/api/?key=32455258-b6b5e3b19a045052743e3591c&q=${photo}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${per_page}`
  );
}

function handleSubmit(params) {}

function handleLoadMore(params) {}
