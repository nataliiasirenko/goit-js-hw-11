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

const galleryMarkup = markupPictures(picture);

formEll.addEventListener('submit', onFormSubmit);
loadMoreButtonEll.addEventListener('click', onLoadMore);

function markupPictures(picture) {
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

galleryEll.insertAdjacentHTML('beforeend', markupPictures(picture));

function getImages(photo, page) {
  return axios.get(
    `https://pixabay.com/api/?key=32455258-b6b5e3b19a045052743e3591c&q=${photo}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${per_page}`
  );
}

async function onFormSubmit(e) {
  e.preventDefault();
  loadMoreButtonEll.classList.add('hidden');
  loadMoreButtonEll.classList.remove('load-more');

  page = 1;
  photo = e.currentTarget.elements.searchQuery.value;
  galleryEll.innerHTML = '';
  await getImages(photo, page).then(response => {
    if (photo === ' ' || photo === '') {
      Notiflix.Notify.failure('Please type search and try again.');
      return;
    }
    pagesLeft = response.data.totalHits;
    if (response.data.hits.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    } else {
      Notiflix.Notify.success(`Hooray! We found ${pagesLeft} images.`);
      galleryEll.insertAdjacentHTML(
        'beforeend',
        response.data.hits.galleryMarkup
      );
      pagesLeft -= per_page;
      loadMoreButtonEll.classList.remove('hidden');
      loadMoreButtonEll.classList.add('load-more');
    }
  });
  lightBox.refresh();
}

async function onLoadMore() {
  page += 1;
  if (pagesLeft <= 0) {
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  } else {
    await getImages(photo, page).then(response =>
      galleryEll.insertAdjacentHTML(
        'beforeend',
        response.data.hits.galleryMarkup
      )
    );
    pagesLeft -= per_page;
  }
  lightBox.refresh();
}

const lightBox = new SimpleLightBox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});
