import './css/styles.css';
import { Notify } from 'notiflix';
import axios from 'axios';

const API_KEY = '34757996-44fb61a2c5d4adca97d86e8d6';

const searchForm = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

let searchQuery = '';
let page = 1;
let totalHits = 0;

searchForm.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', onLoadMore);

function onSearch(event) {
  event.preventDefault();
  gallery.innerHTML = '';
  page = 1;
  searchQuery = event.currentTarget.elements.searchQuery.value.trim();

  if (!searchQuery) {
    return Notify.warning('Enter a search term!');
  }

  fetchImages();
}

function onLoadMore() {
  fetchImages();
}

function fetchImages() {
  axios
    .get(
      `https://pixabay.com/api/?key=${API_KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
    )
    .then(({ data }) => {
      const hits = data.hits;
      totalHits = data.totalHits;
      console.log(hits);
      if (hits.length === 0) {
        Notify.warning(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      }

      const imagesMarkup = createImagesMarkup(hits);
      gallery.insertAdjacentHTML('beforeend', imagesMarkup);

      if (hits.length < 40) {
        Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
        loadMoreBtn.style.display = 'none';
      } else {
        loadMoreBtn.style.display = 'block';
        page += 1;
      }
    })
    .catch(error => console.log(error));
}

function createImagesMarkup(images) {
  return images
    .map(
      ({
        webformatURL,
        largeImageURL,
        likes,
        views,
        comments,
        downloads,
        tags,
      }) => `
        <div class="photo-card">
          <img src="${webformatURL}" data-source="${largeImageURL}" alt="${tags}" loading="lazy" />
          <div class="info">
            <p class="info-item">
              <b>Likes:</b> ${likes}
            </p>
            <p class="info-item">
              <b>Views:</b> ${views}
            </p>
            <p class="info-item">
              <b>Comments:</b> ${comments}
            </p>
            <p class="info-item">
              <b>Downloads:</b> ${downloads}
            </p>
          </div>
        </div>
      `
    )
    .join('');
}
