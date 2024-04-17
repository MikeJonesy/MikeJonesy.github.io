import "../assets/css/reset.css";
import "../assets/css/style.css";

const currentBooks = [];
let searchQuery = ''
//let totalBooksFound;

//for infinite scroll
const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

let observer = new IntersectionObserver(handleIntersect, options);


const body = document.body;
const booksFoundContainer = body.querySelector(".books-found");
const searchForm = document.forms.searchForm;
//const pageNav = body.querySelector('.page-nav')

function renderDescription(bookTitle, index, cardCount) {
  const bookDescription =
    "description" in currentBooks[index].volumeInfo
      ? currentBooks[index].volumeInfo.description
      : "Description not found";
  const descriptionModal = `<button data-id=${cardCount} type="button" class="description btn btn-primary" data-bs-toggle="modal" data-bs-target="#Modal-${index}">
Read Description
</button>
<!-- Modal -->
<div class="modal fade" id="Modal-${cardCount}" tabindex="-1" aria-labelledby="Modal-${cardCount}Label" aria-hidden="true">
<div class="modal-dialog">
  <div class="modal-content">
    <div class="modal-header">
      <h1 class="modal-title fs-5">${bookTitle}</h1>
    </div>
    <div class="modal-body">
     ${bookDescription}
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
    </div>
  </div>
</div>
</div>
    </div>
    </div>`;
  // end of books-found container;
  return descriptionModal;
}

function renderSearchResults(json, startIndex, cardCount) {
    if(startIndex === 0 ){
    currentBooks.length = 0;
    booksFoundContainer.innerHTML = "";
  }  
  
  let booksFoundContainerHTML = "";

  
  const booksFound = json.items;

  booksFound.forEach(function (book, index) {
    cardCount += 1
    currentBooks.push({ ...book, cardCount });
    // check if book keys are available in obj, return true or false
    const bookImageAvailbale =
      "imageLinks" in book.volumeInfo
        ? book.volumeInfo.imageLinks.smallThumbnail
        : "https://png.pngtree.com/png-vector/20190820/ourmid/pngtree-no-image-vector-illustration-isolated-png-image_1694547.jpg";
    const bookTitle =
      "title" in book.volumeInfo ? book.volumeInfo.title : "Title not found";
    const bookAuthor =
      "authors" in book.volumeInfo
        ? book.volumeInfo.authors[0]
        : "Author not found";

    let bookCard = `<div class="card">
      <img src='${bookImageAvailbale}' class="card-img-top">
      <div class="card-body">
        <h5 class="card-title">${bookTitle}</h5>
        <p class="card-text">${bookAuthor}</p>
        </div>
    `;
    const description = renderDescription(bookTitle, index, cardCount);
    bookCard += description;

    booksFoundContainerHTML += bookCard;
  });
  console.log(booksFoundContainerHTML)
  booksFoundContainer.innerHTML += booksFoundContainerHTML;
}

function getSearchResults(searchQuery, startIndex = 0, cardCount) {
  const searchString = new URLSearchParams(searchQuery).toString();
  fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${searchString}&startIndex=${startIndex}&maxResults=12`
  )
    .then((res) => res.json())
    .then((json) => {
        renderSearchResults(json, startIndex, cardCount);
        //totalBooksFound = json.totalItems

        const targets = [...document.querySelectorAll('.card')].slice(-1, document.querySelectorAll('.card').length)
        console.log(targets)
            targets.forEach(target => {
                observer.observe(target);
        })
        
    });
}

function handleIntersect (entries, observer){
    entries.forEach(entry => {
        if(entry.isIntersecting){
            const cardCount = [...document.querySelectorAll('.card')].length
            const startIndex = document.querySelectorAll('.card').length / 12
            getSearchResults(searchQuery, startIndex,cardCount )
            observer.unobserve(entry.target)//maybe this is where add logic for updating what will be observed next
        }
    })
    

}

function handleSearch(event) {
  event.preventDefault();
  searchQuery = ''
  searchQuery = searchForm.elements.searchInput.value;
  getSearchResults(searchQuery);
  
}

function init() {
  searchForm.addEventListener('submit', handleSearch);

}

init();
