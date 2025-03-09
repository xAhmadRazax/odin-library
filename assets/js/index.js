// const myLibrary = [];

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

class Library {
  static myLibrary = [];

  static addItemToLibrary(item) {
    if (!item instanceof LibraryItem) {
      throw new Error("invalid Library item");
    }

    this.myLibrary.push(item);
  }
  static updateItem(item, id) {
    if (!item && !item instanceof LibraryItem) {
      throw new Error("invalid Library item");
    }
    let itemIndex;
    const oldItem = this.myLibrary.find((itemEl, index) => {
      item.id === itemEl.id && (itemIndex = index);
      return +id === itemEl.id;
    });

    item.id = oldItem.id;
    this.myLibrary.splice(itemIndex, 1, item);
    return item;
  }
  static getLibraryItems = function () {
    return this.myLibrary.slice(0);
  };
  static getLibraryItem(id) {
    if (!id) {
      throw new Error("invalid Id");
    }

    return this.myLibrary.find((libraryItem) => +id === libraryItem.id);
  }

  static getItemsCategory() {
    return this.myLibrary.map((el) => el.category);
  }

  static deleteItem = (id) => {
    if (!id) {
      throw new Error("Id is not defined");
    }

    const itemIndex = this.getLibraryItems().findIndex(
      (item) => item.id === id
    );

    this.myLibrary.splice(itemIndex, 1);
  };
}

class LibrarySchema {
  static schemas = [];

  static getSchema = function (id) {
    // if (!schema instanceof SchemaType) {
    // throw new Error("invalid Schema type");
    // }
    return this.schemas.find((schemaEl) => schemaEl.id === +id);
  };
  static addToSchemas = function (schema) {
    if (!schema instanceof SchemaType) {
      throw new Error("invalid Schema type");
    }

    this.schemas.push(schema);
  };

  static getSchemas = function () {
    return this.schemas.slice();
  };

  static getLibrarySchemasCategory() {
    return this.schemas.map((schema) => ({
      category: schema.category,
      id: schema.id,
    }));
  }
}
class SchemaType {
  static validTypes = [
    { key: "text", label: "text" },
    { key: "textArea", label: "paragraph" },
    { key: "radio", label: "single choice" },
    { key: "select", label: "dropdown" },
    { key: "imgURL", label: "image URL" },
    { key: "number", label: "number" },
  ];

  constructor(category) {
    this.id = +Date.now() * +Math.random();
    this.category = category;
  }

  /**
   * Adds an attribute pair to the item.
   * @param {string} attributeName - The name of the attribute.
   * @param {string} type - The type (text, paragraph, single choice, dropdown, image url, number) of the attribute.
   * @param {Function} validator - A function to validate the attribute value.
   * @param {Object} options - Additional options.
   * @param {boolean} [options.isAlphaSpecial=false] - Whether the attribute has an alpha with Alphabetic characters
   * @param {boolean} [options.isAlphaNumSpecial=false] - Whether the attribute has an alpha with Spaces (\s),Hyphens (-), underscore (-), Apostrophes ('), Commas (,), Periods (.), Exclamation marks (!), Question marks (?).
   */
  addAttribute(attributeName, type = "text", validator = null, options) {
    const validType = SchemaType.validTypes.find(
      (typeEl) => typeEl.key === type
    );
    if (!validType) {
      throw new Error("invalid type");
    }
    this[attributeName] = {
      value: undefined,
      validator: null,
      type: validType.key ? validType.key : "string",
    };
    if (type === "imgURL") {
      this[attributeName] = { validator: this.isImgUrl };
      this.hasImage = true;
    }
    if (validator !== "_" || validator) {
      this[attributeName].validator = validator;
    }

    if (options?.isAlphaSpecial) {
      // if (!this.#isAlphaSpecial(attributeValue)) {
      //   throw new Error(
      //     "Input is not alpha with special char with Spaces (s),Hyphens (-), underscore (-), Apostrophes ('), Commas (,), Periods (.), Exclamation marks (!), Question marks (?)"
      //   );
      // }
      this[attributeName].validator = this.isAlphaSpecial;
    }
    if (options?.isAlphaNumSpecial) {
      // if (!this.#isAlphaNumSpecial(attributeValue)) {
      //   throw new Error(
      //     "Input is not alphanumeric with special char with Spaces (s),Hyphens (-), underscore (-), Apostrophes ('), Commas (,), Periods (.), Exclamation marks (!), Question marks (?)"
      //   );
      // }

      this[attributeName].validator = this.isAlphaNumSpecial;
    }
    if (validator !== "_" || validator) {
      this[attributeName].validator = validator;
    }
    this[attributeName].value = undefined;
  }
  // getAttribute(attributeName) {
  // return this[attributeName];
  // }

  isImgUrl(url) {
    try {
      new URL(url);
      return true; // It's a valid URL
    } catch (error) {
      return false; // It's NOT a valid URL
    }
  }
  isAlphaSpecial(value) {
    const regex = /^[A-Za-z\s\-'_,.!]+$/;
    return regex.test(value);
  }
  isAlphaNumSpecial(value) {
    const regex = /^[A-Za-z0-9\s\-'_,.!]+$/;
    return regex.test(value);
  }
  isValidType(type) {
    return this.isValidType.find((typeEl) => typeEl.key === type);
  }
}
class LibraryItem {
  id;
  schemaId;
  constructor(schema) {
    if (!schema instanceof SchemaType) {
      throw new Error("invalid Schema type");
    }

    for (let key in schema) {
      this[key] = schema[key];
    }

    this.schemaId = schema.id;
    this.id = +Date.now() * +Math.random();

    console.log(this, "schema maa....");
  }

  setAttributeValue(attributeName, value) {
    console.log(this, "yea its p....a....i....n");
    if (!Object.hasOwn(this, attributeName)) {
      throw new Error("Property does not exist");
    }

    if (
      this[attributeName].validator &&
      !this[attributeName]?.validator(value)
    ) {
      throw new Error(
        `Validator failed for ${attributeName} bad value ${value}`
      );
    }
    this[attributeName].value = value;
    // .replace(/[-_]/g, " ")
    // .split(" ")
    // .map((el) => el[0].toUpperCase() + el.slice(1))
    // .join(" ");
  }

  changeAttributeValue(attributeName, value) {
    if (!Object.hasOwn(this, attributeName)) {
      throw new Error("Property does not exist");
    }
    if (
      this[attributeName].validator &&
      !this[attributeName]?.validator(value)
    ) {
      throw new Error(
        `Validator failed for ${attributeName} bad value ${value}`
      );
    }
    this[attributeName].value = value;
  }
  deleteAttribute(attributeName) {
    if (!Object.hasOwn(this, attributeName)) {
      throw new Error("Property does not exist");
    }

    delete this[attributeName];
  }

  // getAllAttributes()
}
const bookSchema = new SchemaType("Book");
bookSchema.addAttribute("title", "text");
bookSchema.addAttribute("pages", "text");
// book.addAttribute("imgURL", "image URL");

LibrarySchema.addToSchemas(bookSchema);

const bookItem = new LibraryItem(bookSchema);
bookItem.setAttributeValue("title", "A man on the run");
bookItem.setAttributeValue("pages", "What the dog doing");

Library.addItemToLibrary(bookItem);
class ViewController {
  static #modalEl = document.querySelector("[data-dialog]");
  static #template = document
    .querySelector("[data-template]")
    .content.cloneNode(true);
  static #confirmModalElTemplate = this.#template.querySelector(
    "[data-confirm-modal]"
  );
  static #templateCategoriesForm = this.#template.querySelector(
    "[data-categories-form]"
  );
  static #templateCategorySchemaForm = this.#template.querySelector(
    "[data-category-schema-form]"
  );
  static #templateLibraryItemForm = this.#template.querySelector(
    "[data-library-item-form]"
  );
  // static #templateLibraryItem = this.#template.querySelector(
  //   "[data-library-item]"
  // );
  static #showModal() {
    if (!this.#modalEl) {
      throw new Error("Modal dialog does not exist.");
    }
    this.#modalEl.showModal();
  }
  static #showPopUp(message) {
    const popUpElStr = `    
    <dialog data-popup class="popup">
      <div>${message}</div>
    </dialog>`;
    document.body.insertAdjacentHTML("afterbegin", popUpElStr);
    document.querySelector("[data-popup]").show();

    setTimeout(() => {
      document.querySelector("[data-popup]").close();
      document.querySelector("[data-popup]").remove();
    }, 3000);
  }
  static #closeModal() {
    if (!this.#modalEl) {
      throw new Error("Modal dialog does not exist.");
    }
    this.#modalEl.close();
  }
  static #addModalChildren(childElFrag) {
    if (!this.#modalEl || !childElFrag) {
      console.log("ERROR");
      throw new Error("Invalid modal or childElFrag element.");
    }
    this.#modalEl.replaceChildren();
    this.#modalEl.append(childElFrag);
  }
  static #removeModalChildren() {
    if (!this.#modalEl) {
      throw new Error("Invalid modal or childElFrag element.");
    }
    this.#modalEl.replaceChildren();
  }
  static #replaceModalChildren(childElFrag) {
    if (!this.#modalEl || !childElFrag) {
      console.log("ERROR");
      throw new Error("Invalid modal or childElFrag element.");
    }
    this.#modalEl.replaceChildren();
    this.#modalEl.append(childElFrag);
  }

  static #updateFilter(selectedCategory) {
    const filterSelectContainer = document.querySelector(
      "[data-filter-container]"
    );
    let filterSelect = filterSelectContainer.querySelector("[data-filter]");

    if (Library.getItemsCategory <= 1) {
      return;
    }
    if (!filterSelect) {
      filterSelectContainer.insertAdjacentHTML(
        "afterbegin",
        `           <label for="filter">Filter by:</label>
              <select data-filter name="filter" id="filter">
              </select>`
      );

      filterSelect = filterSelectContainer.querySelector("[data-filter]");
    }

    // Check if the option already exists
    let optionExists = Array.from(filterSelect.options).some(
      (option) => option.value === selectedCategory
    );

    // If it doesn't exist, add the new option
    if (!optionExists) {
      const newOption = document.createElement("option");
      newOption.value = selectedCategory;
      newOption.textContent = selectedCategory;
      filterSelect.appendChild(newOption);
    }

    // Set the selected value
    filterSelect.value = selectedCategory;
  }

  static #appendCardToDom(
    itemData,
    parentContainer = null,
    updateFilter = true
  ) {
    const cardContainerEl =
      parentContainer || document.querySelector("[data-library-list]");

    const libraryItemContainer = document.createElement("li");
    libraryItemContainer.classList.add("library__item");
    libraryItemContainer.setAttribute("data-item", itemData.id);

    const libraryItem = document.createElement("article");
    libraryItem.classList.add("library__item-container");

    libraryItem.insertAdjacentHTML(
      "afterbegin",
      ` 
    <div class="library__item-text-container">
       <header class="library__item-header">
         <h2 data-title class="library__item-heading text-clamp-2">
           Eclipse of the Moon
         </h2>
       </header>
       <div data-attributes class="attributesContainer">
       </div>           
       <footer class="header__item-footer">
          <button data-delete-item="" class="btn btn--del">Delete</button>
          <button data-edit-item="" class="btn header__item-btn-edit">Edit</button>
        </footer>
     </div>   
      `
    );
    const dataAttributes = libraryItem.querySelector("[data-attributes]");
    for (const [key, value] of Object.entries(itemData)) {
      if (
        key === "id" ||
        key === "category" ||
        key === "hasImage" ||
        key === "schemaId"
      ) {
        continue;
      }
      if (key === "hasImage" && itemData[key]) {
        libraryItem.classList.add("library__item--img");
        libraryItem.insertAdjacentHTML(
          "afterbegin",
          `
            <figure class="library__item-img">
              <img data-img="" src="${itemData[key].value}" alt="item__img" />
            </figure>
          `
        );
      }
      if (key === "title") {
        libraryItem.querySelector("[data-title]").textContent =
          itemData[key].value;
      } else {
        dataAttributes.insertAdjacentHTML(
          "afterbegin",
          `         
          <span class="attribute-name">${key}</span
         ><span class="attribute-value">${itemData[key].value}</span>`
        );
      }
    }

    updateFilter && this.#updateFilter(itemData.category.toLowerCase());

    libraryItemContainer.append(libraryItem);
    cardContainerEl.append(libraryItemContainer);

    // append card
  }
  // static appendChildrenToModal(children) {}

  static #renderItemsDOM = (category) => {
    const filterCategory = category || Library.getItemsCategory().at(-1);
    if (!filterCategory) {
      return;
    }
    // for initial rendering items
    // when we want to do is to check if the there is items on the library list get the last items category
    // and render all items based on that category
    const libraryItems = Library.getLibraryItems().filter(
      (item) => item.category === filterCategory
    );

    const libraryItemContainerFrag = document.createDocumentFragment();

    libraryItems.forEach((item) => {
      this.#appendCardToDom(item, libraryItemContainerFrag, false);
    });

    const libraryItemContainer = document.querySelector("[data-library-list]");
    libraryItemContainer.replaceChildren();
    libraryItemContainer.append(libraryItemContainerFrag);
    this.#updateFilter(filterCategory);
  };
  static init() {
    const addLibraryBtnClickHandler = (e) => {
      if (e.target.closest("[data-add-library-item]")) {
        this.#showModal();

        //  showing the category form
        const categoriesForm = this.#templateCategoriesForm.cloneNode(true);
        const schemas = LibrarySchema.getLibrarySchemasCategory();
        const categoriesFormFragment = document.createDocumentFragment();

        schemas.forEach((schema) => {
          const optionEl = document.createElement("option");
          optionEl.value = schema.id;
          optionEl.textContent = schema.category;
          categoriesFormFragment.append(optionEl);
        });
        const optionEl = document.createElement("option");
        optionEl.value = "create-new-schema";
        optionEl.textContent = "Create New Category";
        categoriesFormFragment.append(optionEl);
        categoriesForm
          .querySelector("[data-category-select-input]")
          .append(categoriesFormFragment);
        this.#addModalChildren(categoriesForm);
      }
    };

    const schemaFormAddAttributesHandler = (e) => {
      if (e.target.closest("[data-add-schema-attribute]")) {
        const schemaFormAttributeContainer = document.createElement("div");
        schemaFormAttributeContainer.classList.add(
          "form-control__group",
          "grid-col-2-70-30"
        );

        const id = +Date.now() + +Math.random();
        const fieldsHTMLString = `   
              <div class="form-control">
                <label class="form-control__label" for="attribute-name-${id}">
                  Field Name</label
                >
                <input
      [data-attribute-name-${id}]
                  type="text"
                  class="form-control__input"
                  id="attribute-name-${id}"
                  required
                  min="2"
                  name="attribute-name-${id}"

                />
              </div>
              <div class="form-control">
                <label class="form-control__label" for="attribute-type-${id}">
                  Field Type</label
                >
                <select data-attribute-type-${id} name="attribute-type-${id}" id="attribute-type-${id}" class="form-control__input">
                </select>
              </div>
        `;

        schemaFormAttributeContainer.insertAdjacentHTML(
          "afterbegin",
          fieldsHTMLString
        );
        const attributeOptionEls = SchemaType.validTypes.map((type) => {
          const optionEl = document.createElement("option");
          optionEl.value = type.key;
          optionEl.textContent = type.label
            .split(" ")
            .map((el) => el[0].toUpperCase() + el.slice(1))
            .join(" ");
          return optionEl;
        });

        schemaFormAttributeContainer
          .querySelector("select")
          .append(...attributeOptionEls);

        // adding attribute to dom

        console.log(schemaFormAttributeContainer);
        document
          .querySelector(
            "[data-category-schema-form] [data-form-field-container]"
          )
          .insertBefore(schemaFormAttributeContainer, e.target);
      }
    };
    const createNewCategorySelectionHandler = (e, category) => {
      if (category === "create-new-schema") {
        const dialog = e.target.closest("[data-dialog]");
        dialog.classList.add("ani_slideToLeftSlideInFromRight");

        setTimeout(() => {
          dialog.classList.remove("ani_slideToLeftSlideInFromRight");
        }, 1000);

        // adding the form after the dialog is out of scrren
        setTimeout(() => {
          const schemaFormAttributeContainer = document.createElement("div");
          schemaFormAttributeContainer.classList.add(
            "form-control__group",
            "grid-col-2-70-30"
          );

          schemaFormAttributeContainer.insertAdjacentHTML(
            "afterbegin",
            `       
    
              <div class="form-control">
                <label class="form-control__label" for="title">
                  Field Name</label
                >
                <input
                  type="text"
                  class="form-control__input"
                  id="title"
                  required
                  min="2"
                  name="attribute-name-1"
                  value="title"
                  readonly
                  disable
                />
              </div>
              <div class="form-control">
                <label class="form-control__label" for="attribute-type-1">
                  Field Type</label
                >
                <select name="attribute-type-1" id="attribute-type-1" class="form-control__input">
                  <option value="text">Text</option>
                </select>
              </div>
        `
          );

          const templateCategorySchemaForm =
            this.#templateCategorySchemaForm.cloneNode(true);

          const schemaFormFieldContainer =
            templateCategorySchemaForm.querySelector(
              "[data-form-field-container]"
            );
          schemaFormFieldContainer.replaceChildren();
          schemaFormFieldContainer.append(schemaFormAttributeContainer);
          schemaFormFieldContainer.insertAdjacentHTML(
            "beforeend",
            `            <button data-add-schema-attribute class="btn" type="button">
          Add another field
        </button>`
          );

          schemaFormFieldContainer.insertAdjacentHTML(
            "afterbegin",
            `              <div class="form-control">
            <label class="form-control__label" for="category">Category Name</label>
            <input
              type="text"
              class="form-control__input"
              id="category"
              required
              min="2"
              name="category"
            />
          </div>`
          );
          this.#replaceModalChildren(templateCategorySchemaForm);
        }, 500);
        // slide the form to the left and remove > add a new form > slide from right to middle
      }
    };

    const populatingLibraryItemForm = (id, item = null) => {
      const itemSchema = item || LibrarySchema.getSchema(id);
      const libraryItemForm = this.#templateLibraryItemForm.cloneNode(true);
      libraryItemForm.setAttribute("data-id", itemSchema.id);
      const formTitle = libraryItemForm.querySelector("[data-form-title]");
      const formFieldsContainer = libraryItemForm.querySelector(
        "[data-form-field-container]"
      );

      formFieldsContainer.replaceChildren();
      const textAreaFieldsFrag = document.createDocumentFragment();
      // note fields group are of 2 column
      const formControlGroup = document.createElement("div");
      formControlGroup.classList.add("form-control__group");
      for (const key in itemSchema) {
        if (key === "id" || key === "hasImage" || key === "schemaId") {
          continue;
        }

        if (key === "category") {
          formTitle.textContent = `${item ? "Editing" : ""} ${
            itemSchema[key]
          } Info`;
        } else if (itemSchema[key].type === "textArea") {
          const formControlEl = document.createElement("div");
          formControlEl.classList.add("form-control");

          formControlEl.insertAdjacentHTML(
            "afterbegin",

            `
              <label class="form-control__label" for="${key.toLowerCase()}">${key}</label>
              <textarea
              name="${key}"
              required
              class="form-control__input"
              id="${key.toLowerCase()}"
              rows="4"
              >${
                item
                  ? (itemSchema[key].value || "")
                      .replace(/</g, "&lt;")
                      .replace(/>/g, "&gt;")
                  : ""
              }</textarea>
              `
          );

          textAreaFieldsFrag.append(formControlEl);
        } else {
          formControlGroup.insertAdjacentHTML(
            "beforeend",
            `
            <div class="form-control">
            <label class="form-control__label" for="${key.toLowerCase()}">${key}</label>
            <input
              type="${itemSchema[key].type || "text"}"
              class="form-control__input"
              id="${key.toLowerCase()}"
              required
              min="2"
              name="${key}"
              value="${item ? itemSchema[key]?.value : ""}"
            />
          </div>`
          );
        }
      }

      formFieldsContainer.append(formControlGroup, textAreaFieldsFrag);

      if (item) {
        libraryItemForm.setAttribute("data-schema-id", itemSchema.schemaId);

        libraryItemForm.removeAttribute("data-library-item-form");
        libraryItemForm.setAttribute("data-library-item-update-form", "");
        const submissionBtn =
          libraryItemForm.querySelector("[data-form-submit]");

        submissionBtn.textContent = "Save";
      }
      return libraryItemForm;
    };
    const createNewLibraryItemFormHandler = (e, id) => {
      if (LibrarySchema.getSchema(id)) {
        const libraryItemFormEl = populatingLibraryItemForm(id);

        const dialog = e.target.closest("[data-dialog]");
        dialog.classList.add("ani_slideToLeftSlideInFromRight");
        setTimeout(() => {
          dialog.classList.remove("ani_slideToLeftSlideInFromRight");
        }, 1000);

        setTimeout(() => {
          this.#replaceModalChildren(libraryItemFormEl);
        }, 500);
      }
    };

    const categoryFormSubmissionHandler = (e) => {
      if (e.target.closest("[data-categories-form ]")) {
        e.preventDefault();

        const category = e.target.querySelector(
          "[data-category-select-input]"
        ).value;

        if (category === "") {
          window.location.replace(window.location.href);
        }

        // if user select create new category in the form
        // append create new category form in the dialog
        createNewCategorySelectionHandler(e, category);

        // showing add library item form
        createNewLibraryItemFormHandler(e, category);
        return;
      }
    };

    const categorySchemaFormSubmissionHandler = (e) => {
      if (e.target.closest("[data-category-schema-form]")) {
        const formData = new FormData(e.target);
        const data = {};

        let attributeName;
        formData.forEach((value, key) => {
          if (key === "category") data.categoryName = value;

          if (key.startsWith("attribute-name")) {
            attributeName = value;
            data[value] = { type: null };
          }
          if (key.startsWith("attribute-type")) {
            data[attributeName].type = value;
          }
        });

        const newSchema = new SchemaType(
          data.categoryName
            .replace(/[-_]/g, " ")
            .split(" ")
            .map((el) => el[0].toUpperCase() + el.slice(1))
            .join(" ")
        );
        delete data.categoryName;

        console.log(data);
        for (const key in data) {
          newSchema.addAttribute(key, data[key].type);
        }
        console.log(newSchema);
        LibrarySchema.addToSchemas(newSchema);

        this.#showPopUp(`${newSchema.category} Schema added to database `);
        // Log the data (or send it to a server)
        // console.log("Form Data:", data);
      }
    };

    const libraryItemFormSubmissionHandler = (e) => {
      if (e.target.closest("[data-library-item-form]")) {
        const formData = new FormData(e.target);
        const itemSchema = LibrarySchema.getSchema(e.target.dataset.id);
        const libraryItem = new LibraryItem(itemSchema);

        for (const [key, value] of formData.entries()) {
          libraryItem.setAttributeValue(key, value);
        }

        Library.addItemToLibrary(libraryItem);

        this.#showPopUp(`${libraryItem.category} item added to the database`);

        //  adding card to the Dom
        console.log(libraryItem);

        // this.#appendCardToDom(libraryItem);
        // rerendering all items on the same as dont
        // have  functional to add different items on differencet section
        // so we will rerender all items based on the item category that
        // we are adding
        this.#renderItemsDOM(libraryItem.category);
      }
    };
    const closeModalHandler = (e) => {
      if (
        e.target.matches("[data-dialog]") ||
        e.target.closest("[data-dialog-cancel]")
      ) {
        this.#modalEl.close();
      }
    };

    const confirmDeleteItemDialogBtnHandler = (e) => {
      if (e.target.matches("[data-dialog-confirm]")) {
        const itemID = e.target.closest("[data-delete-item-id]").dataset
          .deleteItemId;
        if (!itemID) return this.#closeModal();
        const item = document.querySelector(`[data-item="${itemID}"]`);

        console.log(item);
        Library.deleteItem(itemID);

        item.remove();

        this.#closeModal();
      }
    };
    const deleteItemBtnClickHandler = (e) => {
      if (e.target.closest("[data-delete-item]")) {
        const confirmModalEl = this.#confirmModalElTemplate.cloneNode(true);
        const itemID = e.target.closest("[data-item]").dataset.item;
        confirmModalEl.setAttribute("data-delete-item-id", itemID);
        this.#replaceModalChildren(confirmModalEl);
        this.#showModal();
      }
    };

    const editItemBtnClickHandler = (e) => {
      if (e.target.closest("[ data-edit-item]")) {
        const itemID = e.target.closest("[data-item]").dataset.item;
        console.log(itemID, e.target.closest("[data-item]"));
        const item = Library.getLibraryItem(itemID);
        const itemSchemaID = LibrarySchema.getSchema(item.schemaId);

        if (itemSchemaID) {
          const libraryItemFormEl = populatingLibraryItemForm(
            itemSchemaID,
            item
          );

          this.#replaceModalChildren(libraryItemFormEl);

          this.#showModal();
        }
      }
    };

    const editItemFormSubmissionHandler = (e) => {
      if (e.target.matches("[data-library-item-update-form]")) {
        const formData = new FormData(e.target);
        const itemID = e.target.dataset.id;
        const itemSchemaID = e.target.dataset.schemaId;
        const itemSchema = LibrarySchema.getSchema(itemSchemaID);
        const libraryItem = new LibraryItem(itemSchema);

        for (const [key, value] of formData.entries()) {
          libraryItem.setAttributeValue(key, value);
        }
        const updatedItem = Library.updateItem(libraryItem, itemID);

        this.#showPopUp(`${libraryItem.category} item has been updated`);

        console.log(libraryItem);

        const frag = document.createDocumentFragment();
        this.#appendCardToDom(updatedItem, frag);

        document.querySelector(`[data-item='${itemID}']`).replaceWith(frag);
      }
    };
    // add event delegation for most of events
    document.addEventListener("click", (e) => {
      // console.log(e.target);

      deleteItemBtnClickHandler(e);

      closeModalHandler(e);

      // handling add new item button
      addLibraryBtnClickHandler(e);

      // handling adding more attributes to the schema
      schemaFormAddAttributesHandler(e);

      editItemBtnClickHandler(e);

      confirmDeleteItemDialogBtnHandler(e);
      return;
    });

    // handling form delegation events
    document.addEventListener("submit", (e) => {
      categoryFormSubmissionHandler(e);
      // categoryFormSchema submission handling
      categorySchemaFormSubmissionHandler(e);
      // library item form submission handler
      libraryItemFormSubmissionHandler(e);

      // library edit form

      editItemFormSubmissionHandler(e);
      return;
    });

    this.#renderItemsDOM();
  }
}
document.addEventListener("DOMContentLoaded", (e) => {
  ViewController.init();
});
