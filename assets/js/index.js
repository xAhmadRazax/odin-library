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
    if (!item instanceof libraryItem) {
      throw new Error("invalid Library item");
    }

    this.myLibrary.push(item);
  }

  static getLibraryItems = function () {
    return this.myLibrary;
  };
  static getLibraryItem(item) {
    if (!item instanceof libraryItem) {
      throw new Error("invalid Library item");
    }

    return this.myLibrary.find((libraryItem) => item.id === libraryItem.id);
  }
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
    this.id = Date.now();
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
    if (type.key === "imgURL") {
      this[attributeName] = { validator: this.isImgUrl };
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
class libraryItem {
  id;
  constructor(schema) {
    if (!schema instanceof SchemaType) {
      throw new Error("invalid Schema type");
    }

    for (let key in schema) {
      this[key] = schema[key];
    }

    this.id = Date.now();
  }

  setAttributeValue(attributeName, value) {
    if (!Object.hasOwn(this, attributeName)) {
      throw new Error("Property does not exist");
    }

    if (!this[attributeName]?.validate(value)) {
      throw new Error(
        `Validator failed for ${attributeName} bad value ${value}`
      );
    }
    this[attributeName] = value;
  }

  changeAttributeValue(attributeName, value) {
    if (!Object.hasOwn(this, attributeName)) {
      throw new Error("Property does not exist");
    }
    this[attributeName] = value;
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

const bookItem = new libraryItem(bookSchema);

console.log(bookItem);

console.log(bookItem);
class ViewController {
  static #modalEl = document.querySelector("[data-dialog]");
  static #template = document
    .querySelector("[data-template]")
    .content.cloneNode(true);
  static #templateCategoriesForm = this.#template.querySelector(
    "[data-categories-form]"
  );
  static #templateCategorySchemaForm = this.#template.querySelector(
    "[data-category-schema-form]"
  );
  static #templateLibraryItemForm = this.#template.querySelector(
    "[data-library-item-form]"
  );
  static #templateLibraryItem = this.#template.querySelector(
    "[data-library-item]"
  );
  static #showModal() {
    if (!this.#modalEl) {
      throw new Error("Modal dialog does not exist.");
    }
    this.#modalEl.showModal();
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
  // static appendChildrenToModal(children) {}
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

    // add event delegation for most of events
    document.addEventListener("click", (e) => {
      // handling add new item button
      addLibraryBtnClickHandler(e);

      // handling adding more attributes to the schema
      schemaFormAddAttributesHandler(e);
      return;
    });

    // handling form delegation events
    document.addEventListener("submit", (e) => {
      if (e.target.closest("[data-categories-form ]")) {
        e.preventDefault();

        const category = e.target.querySelector(
          "[data-category-select-input]"
        ).value;

        if (category === "") {
          window.location.replace(window.location.href);
        }

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

        if (LibrarySchema.getSchema(category)) {
          const itemSchema = LibrarySchema.getSchema(category);
          console.log(Object.keys(itemSchema));
          const libraryItemForm = this.#templateLibraryItemForm.cloneNode(true);
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
            if (key === "id") {
              continue;
            }

            if (key === "category") {
              formTitle.textContent = `${itemSchema[key]} Info`;
            } else if (itemSchema[key].type === "textArea") {
              const formControlEl = document.createElement("div");
              formControlEl.classList.add("form-control");

              formControlEl.insertAdjacentHTML(
                "afterbegin",

                `
                  <label class="form-control__label" for="${key.toLowerCase()}">${key}</label>
                  <textarea
                  name="${key.toLowerCase()}"
                  required
                  class="form-control__input"
                  id="${key.toLowerCase()}"
                  rows="4"
                  ></textarea>
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
                  name="${key.toLowerCase()}"
                />
              </div>`
              );
            }
          }

          formFieldsContainer.append(formControlGroup, textAreaFieldsFrag);

          const dialog = e.target.closest("[data-dialog]");
          dialog.classList.add("ani_slideToLeftSlideInFromRight");
          setTimeout(() => {
            dialog.classList.remove("ani_slideToLeftSlideInFromRight");
          }, 1000);

          setTimeout(() => {
            this.#replaceModalChildren(libraryItemForm);
          }, 500);
        }
      }

      // categoryFormSchema submission handling

      if (e.target.closest("[data-category-schema-form]")) {
        const formData = new FormData(e.target);
        console.log(formData);
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

        // Log the data (or send it to a server)
        // console.log("Form Data:", data);
      }

      // library item form subbmission handler

      console.log(e.target);
      if (e.target.closest("[data-library-item-form]")) {
        const formData = new FormData(e.target);

        for (const [key, value] of formData.entries()) console.log(key, value);
      }

      return;
    });

    // form submission handlers
    // this.templateCategoriesForm.addEventListener("submit", (e) => {
    //   e.preventDefault();

    //   console.log("Wtf is going on");

    //   console.log(e);
    // });
  }
}
document.addEventListener("DOMContentLoaded", (e) => {
  //   const addAttributeItem = document.querySelector("[data-add-attribute]");
  //   addAttributeItem.addEventListener("click", function (e) {
  //     const attributesEl = document.createElement("div");
  //     attributesEl.innerHTML = `<div class="form-control__group grid-col-2-70-30">
  //   <div class="form-control">
  //     <label class="form-control__label" for="title">
  //       field Name</label
  //     >
  //     <input
  //       type="text"
  //       class="form-control__input"
  //       id="title"
  //       required
  //       min="2"
  //       name="title"
  //       value="title"
  //       readonly
  //     />
  //   </div>
  //   <div class="form-control">
  //     <label class="form-control__label" for="title">
  //       field type</label
  //     >
  //     <select name="" id="" class="form-control__input">
  //       <option value="">text</option>
  //       <option value="">long Text</option>
  //       <option value="">singleValue</option>
  //       <option value="">multiValues</option>
  //       <option value="">image url</option>
  //     </select>
  //   </div>
  // </div>`;
  //     console.log(
  //       attributesEl,
  //       document.querySelector("[data-form-container]"),
  //       document.querySelector("[data-add-attribute]")
  //     );
  //     const parentEl = document.querySelector("[data-form-container]");
  //     const childEl = document.querySelector("[data-add-attribute]");
  //     parentEl.insertBefore(attributesEl, childEl);
  //   });
  ViewController.init();
});
console.log(
  document
    .querySelector("[data-template]")
    .content.cloneNode(true)
    .querySelector("[data-library-item ]")
);
