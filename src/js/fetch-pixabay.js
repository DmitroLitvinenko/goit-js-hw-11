export { fetchGallery };

const BASE_URL =
  'https://pixabay.com/api/?key=34757996-44fb61a2c5d4adca97d86e8d6&q=';

function fetchGallery() {
  fetch(
    `${BASE_URL}cat&image_type=photo&orientation=horizontal&safesearch=true`
  )
    .then(response => response.json)
    .then(photo => console.log(photo));
}
