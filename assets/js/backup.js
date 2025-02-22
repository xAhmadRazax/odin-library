const myLibrary = [new Book("Qq", "qq", "qq", 3, "aa", "Reading", 133)];

function Book(
  title,
  author,
  genre,
  ratings = 0,
  desc,
  status = "reading",
  totalPages,
  pagesRead = 0,
  imgURL
) {
  this.title = title;
  this.author = author;
  this.genre = genre;
  this.ratings = ratings;
  this.desc = desc;
  this.status = status;
  this.totalPages = totalPages;
  this.pagesRead = pagesRead;
  this.imgURL = imgURL;
}

Book.prototype.updateBook = function (
  title,
  author,
  genre,
  ratings = 0,
  desc,
  status = "reading",
  totalPages,
  pagesRead = 0,
  imgURL
) {
  this.title = title;
  this.author = author;
  this.genre = genre;
  this.ratings = ratings;
  this.desc = desc;
  this.status = status;
  this.totalPages = totalPages;
  this.pagesRead = pagesRead;
  this.imgURL = imgURL;
};

function isValidURL(url) {
  try {
    new URL(url);
    return true; // It's a valid URL
  } catch (error) {
    return false; // It's NOT a valid URL
  }
}
const addItemToLibrary = (book) => {
  myLibrary.push(book);
};
const removeItemFromLibrary = (index) => {
  myLibrary.splice(index, 1);
};
function showDialog(dialogEl) {
  return dialogEl.showModal();
}
function closeDialog(dialogEl) {
  return dialogEl.close();
}
function addChildToParent(parent, child, resetChildren = false) {
  console.log(parent, child);
  if (resetChildren) {
    parent.replaceChildren();
  }
  parent.prepend(child);
}

function removeChildren(parent) {
  parent.replaceChildren();
}
function handleAddItemToLibrary(e, dialogEl, formEl) {
  if (e.target.closest("[data-add-item]")) {
    showDialog(dialogEl);
    addChildToParent(dialogEl, formEl, true);
  }
}

function handleCancelBtn(e, dialogEl) {
  if (e.target.closest("[data-dialog-cancel]")) {
    closeDialog(dialogEl);
    removeChildren(dialogEl);
  }
}

function removeLibraryItemFromDom(item) {
  item.remove();
}
function replaceLibraryItem(itemEl, id, template) {
  const card = populateLibraryCard(itemEl, id, template);
  const oldCard = document.querySelector(`[data-item='${id}']`);
  console.log(card, oldCard);
  oldCard.replaceWith(card);
}
function populateLibraryCard(itemEl, index, template) {
  const card = template.querySelector("[data-item]").cloneNode(true);
  card.setAttribute("data-item", index);
  // console.log(card.querySelector("[data-title]"), itemEl);
  card.querySelector("[data-title]").textContent = itemEl.title.toUpperCase();
  card.querySelector("[data-author]").textContent =
    "By " + itemEl.author.toUpperCase();
  card.querySelector("[data-reading-status] span").textContent = itemEl.status;
  if (itemEl.status !== "reading") {
    card
      .querySelector("[data-reading-status]")
      .classList.add(`library__item-status--${itemEl.status}`);
  }
  card.querySelector("[data-genre]").textContent = itemEl.genre.toUpperCase();
  card.querySelector("[data-desc]").textContent = itemEl.desc;
  card.querySelector("[data-total-pages]").textContent = itemEl.totalPages;
  card.querySelector("[data-pages-read]").textContent = itemEl.pagesRead;
  if (itemEl.ratings > 0) {
    const ratingsStars = card.querySelectorAll("[data-item-ratings-star]");
    ratingsStars.forEach((item, index) => {
      if (item.dataset.itemRatingsStar <= itemEl.ratings) {
        item.classList.add("highlighted");
      }
    });
  }
  card.querySelector("[data-img]").src = itemEl.imgURL;
  return card;
}
function renderLibraryItem(itemEl, index, template, fragment) {
  const card = populateLibraryCard(itemEl, index, template);
  addChildToParent(fragment, card);
}
function renderLibraryItems(items, template, parentEl) {
  const fragment = document.createDocumentFragment();
  items.forEach((itemEl, index) => {
    renderLibraryItem(itemEl, index, template, fragment);
  });
  //   removing list all element so each time we add a new item it wont repeat other
  // this is kind of a hack and is bad because we are reading all child
  addChildToParent(parentEl, fragment, true);
}
function handleDeleteItemBtn(e, dialogEl, templateConfirmModal) {
  const targetEl = e.target.closest("[data-item] [data-delete-item]");
  if (targetEl) {
    const cardItem = e.target.closest("[data-item]");
    const deleteItemIndex = cardItem.dataset.item;
    if (!myLibrary[deleteItemIndex]) {
      return dialogEl.close();
    }

    addChildToParent(dialogEl, templateConfirmModal, true);
    showDialog(dialogEl);

    dialogEl.querySelector("[data-dialog-confirm]").addEventListener(
      "click",
      (e) => {
        removeChildren(dialogEl);
        closeDialog(dialogEl);

        removeItemFromLibrary(deleteItemIndex);
        removeLibraryItemFromDom(cardItem);
      },
      { once: true }
    );
  }
  return;
}
function populatingForm(item, formEl) {
  formEl.querySelector("[data-form-title]").textContent =
    "Update Book Information";

  formEl.querySelector("[data-form-submit]").textContent = "Update";

  formEl.querySelector("#title").value = item.title;
  formEl.querySelector("#author").value = item.author;
  formEl.querySelector("#genre").value = item.genre;
  formEl.querySelector("#status").checked = item.status.toLowerCase();
  formEl.querySelector("#rating").value = item.ratings;
  formEl.querySelector("#duration").value = item.totalPages;
  formEl.querySelector("#pages-read").value = item.pagesRead;
  formEl.querySelector("#desc").value = item.desc;
  if (isValidURL(item.imgURL)) {
    formEl.querySelector("#img-url").value = item.imgURL;
  }
}
function handleEditLibraryItem(e, dialogEl, formEl) {
  const targetEl = e.target.closest("[data-edit-item]");
  if (!targetEl) {
    return;
  }
  const formElCopy = formEl.cloneNode(true);
  const itemToUpdateID = e.target.closest("[data-item]").dataset.item;
  formEl.setAttribute("data-item-update", itemToUpdateID);

  populatingForm(myLibrary[itemToUpdateID], formEl);
  addChildToParent(dialogEl, formEl, true);
  showDialog(dialogEl);
}
document.addEventListener("DOMContentLoaded", (e) => {
  const template = document.querySelector("[data-template]").content;
  const templateFormEl = template
    .querySelector("[data-item-form]")
    .cloneNode(true);
  const templateConfirmModal = template
    .querySelector("[data-confirm-modal]")
    .cloneNode(true);
  const dialogEl = document.querySelector("[data-dialog]");
  const libraryList = document.querySelector("[data-library-list]");

  templateFormEl?.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = e.target.querySelector("#title").value;
    const author = e.target.querySelector("#author").value;
    const genre = e.target.querySelector("#genre").value;
    const imgURL =
      e.target.querySelector("#img-url").value.trim() ||
      "./assets/imgs/default.avif";
    const status = e.target.querySelector("#status").value;
    const ratings = e.target.querySelector("#rating").value || 0;
    const duration = e.target.querySelector("#duration").value;
    const pagesRead = e.target.querySelector("#pages-read").value || 1;
    const desc = e.target.querySelector("#desc").value;

    if (title.trim().length === 0) {
      e.target.querySelector("#title").focus();
    }
    if (author.trim().author === 0) {
      e.target.querySelector("#author").focus();
    }
    if (genre.trim().length === 0) {
      e.target.querySelector("#genre").focus();
    }
    if (!duration) {
      e.target.querySelector("#duration").focus();
    }
    if (pagesRead > duration) {
      e.target.querySelector("#pages-read").focus();
    }
    // check if the form has form-item-update attribute than update the item else create new item
    console.log("hello");
    console.log(
      templateFormEl,
      "tempF",
      e.target.getAttribute("data-item-update")
    );
    if (e.target.getAttribute("data-item-update") !== null) {
      const itemToUpdateID = e.target.getAttribute("data-item-update");
      myLibrary[itemToUpdateID].updateBook(
        title,
        author,
        genre,
        ratings,
        desc,
        status,
        duration,
        pagesRead,
        imgURL
      );
      replaceLibraryItem(myLibrary[itemToUpdateID], itemToUpdateID, template);
      closeDialog(dialogEl);
      console.log(templateFormEl);

      return;
    }
    const newBook = new Book(
      title,
      author,
      genre,
      ratings,
      desc,
      status,
      duration,
      pagesRead,
      imgURL
    );

    const newLibraryItemId = myLibrary.length;
    addItemToLibrary(newBook);

    renderLibraryItem(newBook, newLibraryItemId, template, libraryList);
    closeDialog(dialogEl);
  });
  renderLibraryItems(myLibrary, template, libraryList);
  document.body.addEventListener("click", (e) => {
    // console.log(templateFormEl, template);
    // handling add new item to collection button
    handleAddItemToLibrary(e, dialogEl, templateFormEl);
    handleCancelBtn(e, dialogEl);
    handleDeleteItemBtn(e, dialogEl, templateConfirmModal);
    handleEditLibraryItem(e, dialogEl, templateFormEl);
    return;
  });
});
