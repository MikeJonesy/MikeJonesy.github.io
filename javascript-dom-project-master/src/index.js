import "../assets/css/reset.css";
import "../assets/css/style.css";

let currentBooks = 0;
let searchQuery;

//for infinite scroll
const options = {
    root: null,
    rootMargin: '0px',
    threshold: .1
};

let observer = new IntersectionObserver(handleIntersect, options);

const body = document.body;
const booksFoundContainer = body.querySelector(".books-found");
const searchForm = document.forms.searchForm;


//Function Delcaration

function handleIntersect (entries, observer){ //function for infinite scoll
    entries.forEach(entry => {
        if(entry.isIntersecting && currentBooks > 0){
            
                getSearchResults(searchQuery, /*startIndex,*/ currentBooks )
            observer.unobserve(entry.target)//maybe this is where add logic for updating what will be observed next
            
        }
    })
    

}

function renderDescription(bookTitle, bookDescription) {
  const descriptionModal = `<button data-id=${currentBooks} type="button" class="description btn btn-primary" data-bs-toggle="modal" data-bs-target="#Modal-${currentBooks}">
Read Description
</button>
<!-- Modal -->
<div class="modal fade" id="Modal-${currentBooks}" tabindex="-1" aria-labelledby="Modal-${currentBooks}Label" aria-hidden="true">
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

async function renderSearchResults(json) {
  //booksFoundContainer.innerHTML = ""; need it?
  let booksFoundContainerHTML = "";

  const booksFound = json.items;

  booksFound.forEach(function (book) {
    currentBooks += 1;
    const bookDescription =
      "description" in book.volumeInfo
        ? book.volumeInfo.description
        : "Description not found";
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
    const description = renderDescription(bookTitle, bookDescription);
    bookCard += description;

    booksFoundContainerHTML += bookCard;
  });
  console.log(currentBooks);
  booksFoundContainer.insertAdjacentHTML('beforeend',booksFoundContainerHTML)
  //booksFoundContainer.innerHTML += booksFoundContainerHTML;
}

function getSearchResults(searchQuery, startIndex = 0) {
  const searchString = new URLSearchParams(searchQuery).toString();
  fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${searchString}&startIndex=${startIndex}&maxResults=30`
  )
    .then((res) => res.json())
    .then((json) => {
      renderSearchResults(json);

      //target for infinite scroll
      const target = document.getElementsByClassName('card')[document.getElementsByClassName('card').length -15]
      console.log(target)
      observer.observe(target)
    });
}

function handleSearch(event) {
  event.preventDefault();
  booksFoundContainer.innerHTML = ''
  currentBooks = 0
  searchQuery = searchForm.elements.searchInput.value;
  getSearchResults(searchQuery);
}

function init() {
  searchForm.addEventListener("submit", handleSearch);
}

//End of Function Delcaration

init();