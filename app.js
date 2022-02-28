$(() => {
// ----------------------GLOBAL VARIABLES----------------------
const navBarCounter = document.querySelector("#nav__counter");
let productList = document.querySelector(".product__list");

// ----------------------CREATES CART OBJECT----------------------
class CART {
    constructor (purchaseIcons, productData, productNameClass, productPriceClass, parentAppendProducts, totalClassName) {

    this.KEY = "thisisatestkey";
    // Array with products
    this.contents = [];
    this.purchaseIcons = document.querySelectorAll(purchaseIcons);
    this.productData = document.querySelectorAll(productData);
    this.productNameClass = productNameClass;
    this.productPriceClass = productPriceClass;
    this.parentAppendProducts = document.querySelector(parentAppendProducts);
    this.totalElement = document.querySelector(totalClassName);
    }
    
    // OBJECT METHODS
    // Object initialization: checks whether there are products stored in memory
    init() {
        let _contents = localStorage.getItem(this.KEY);
        if (_contents) {
            this.contents = JSON.parse(_contents);
        } else {
            this.dumpItems();
        }

        if (this.contents.length > 0) {
            navBarCounter.classList.remove("d-none");
            }

        navBarCounter.textContent = this.contents.length;

        this.purchaseIcons = document.querySelectorAll(purchaseIcons);
        this.productData = document.querySelectorAll(productData);

    }

    // dumpItems: saves products to browser memory (only strings)
    dumpItems () {
        let cartContentsString = JSON.stringify(this.contents)
        localStorage.setItem(this.KEY, cartContentsString)
    }

    // logContents: control method to check whether products are being saved
    logContents () {console.log(this.contents)}


    // Function that listens for clicks in any of the shopping cart icons
    addItem () {

        // Loops through shopping cart array
        for (let i=0; i < this.purchaseIcons.length; i++) {

            // Function definition for purchaseIcons event listener below
            // Makes counter visible, increments product counter in object, updates counter, saves counter in memory
            const logItem = () => {

                // Writes the number of items in the cart
                let numberOfItems = this.contents.length + 1
                navBarCounter.textContent = numberOfItems;

                // Makes cart counter visible if there are any items in it
                if (numberOfItems > 0) {
                navBarCounter.classList.remove("d-none");
                }
                
                // Variables with product name and price at this.productData index
                const productName = this.productData[i].querySelector(this.productNameClass).textContent;
                const productPrice = this.productData[i].querySelector(this.productPriceClass).textContent.replace("$", "")
                
                // Appends content to CART.contents array
                this.contents.push({
                    productName: productName,
                    productPrice: parseFloat(productPrice),
                })
                
                // Saves data to memory
                this.dumpItems()

                console.log(this.purchaseIcons[i]);

            };

            // Listener function to check whether the cart icon is clicked and add the item to CART
            this.purchaseIcons[i].addEventListener("click", logItem);
            
        }
    }

    // Function to add products to the cashout page
    buildProductsList () {

        const pageName = window.location.pathname.split("/").pop();

        // I need to check the page name to prevent JS errors when some element is not found
        if (pageName == "pay.html") {

            // We initialize our cart
            Cart.init();

            // Variable used to store the final price
            let totalCounter = 0;        

            // Iterates through cart contents to build the list
            for (let i=0; i < Cart.contents.length; i++) {
                
                // Gets data from the cart contents JSON
                const productNameHTML = Cart.contents[i]["productName"];
                const productPriceHTML = Cart.contents[i]["productPrice"]

                // This adds a div with the products, I need to find an easier way to add this HTML code
                const div = document.createElement("div");
                div.innerHTML = `<ul class="product__row product__text"> \
                <li class="product__name mg-rt-50">${productNameHTML}</li> \
                <li class="product__price">$${productPriceHTML}</li><i class="fa fa-trash"></i>\
                </ul>`

                // Inserts HTML under the productDetails element defined in the constructor
                this.parentAppendProducts.appendChild(div);
                
                // Add productPriceHTML to totalCounter
                totalCounter += parseFloat(productPriceHTML);
            }

            // Update price
            if (totalCounter > 0) {
                this.totalElement.textContent = `$${parseFloat(totalCounter).toFixed(2)}`;
            }

        }
    }

    // Function to remove a product
    removeProduct () {

        // Array with all the product objects on the payment page
        const productsCashOuts = document.querySelectorAll(".product__row");

        // Array with all the X buttons on the payment page
        const deleteIcon = document.querySelectorAll(".fa-trash");


        // Loops the number of items in the cart
        for (let i=0; i < Cart.contents.length; i++) {
            
            // Function definition for the X button event listener below
            const deleteItem = () => {

                // Remove HTML
                productsCashOuts[i].remove();            
                
                // We gather the products again after the removal of the HTML, dynamically
                const currentElements = document.querySelectorAll(".product__row");

                // We empty our cart, we'll later fill it in with the elements above
                Cart.contents = [];

                // Array that stores discounted prices <li class="discounted_price"> if any
                const discountedPrices = document.querySelectorAll(".discounted__price");

                // Variable to store the final price
                let totalCounter = 0;

                // If all the HTML products on the page have been removed, leave the cart empty
                if (currentElements.length > 0) {

                    // Loop through the number of items in the current HTML
                    for (let a=0; a < currentElements.length; a++) {

                        // For each item in the currentElements array, extract text and create new array
                        const elementPropertiesList = currentElements[a].textContent.split("$")

                        // Create new object from the name and price items on the array above
                        // and append it to the CART.contents array
                        // The function will append as many objects as items in currentElements
                        Cart.contents.push({
                            // There are blank spaces that we need to trim
                            productName: elementPropertiesList[0].trim(),
                            productPrice: parseFloat(elementPropertiesList[1].trim()),
                        });

                        // Flow control to decide which price to use to compute total
                        // If there are items in discountedPrices it'll use the discounted prices
                        if (discountedPrices.length > 0) {
                            totalCounter += parseFloat(discountedPrices[a].textContent)
                        } else {
                            totalCounter += parseFloat(elementPropertiesList[1].trim());
                        }
                        
                    }
                }

                // Update price
                if (currentElements.length > 0) {
                    this.totalElement.textContent = parseFloat(totalCounter).toFixed(2);
                } else {
                    this.totalElement.textContent = "Please add products to the cart to calculate the total.";
                }

                if (this.contents.length > 0) {
                    navBarCounter.classList.remove("d-none");
                    } else {
                        navBarCounter.classList.add("d-none");
                    }
        
                navBarCounter.textContent = this.contents.length;



                // Save new CART.contents as string in browser memory
                Cart.dumpItems();

                // End of daleteIcon event listener function
                
            }

            // Generate listener for each X button on the payment page, function definition above
            deleteIcon[i].addEventListener("click", deleteItem);
        }
    }

}

// ----------------------CREATES SLIDER OBJECT----------------------
class SLIDER {
    constructor (child_element, button_left, button_right) {
        // CSS class (string) of the card or element that will slide
        this.child = child_element,
        this.button_left = button_left,
        this.button_right = button_right,
        // Slide with offset
        this.offSetWidth = 0;
    }

        init() {
            // Fetches the two buttons
            const buttonLeft = document.querySelector(this.button_left);
            const buttonRight = document.querySelector(this.button_right);

            // Array with all the child elements
            const cardList = document.querySelectorAll(this.child);
            
            // Distance to move absolute-positioned objects from
            let leftDistance = 0;

            // Loop that assings each child element a distance from the starting position
            // The slide track is a horizontal sequence of child elements
            for (let i=0; i < cardList.length; i++) {
                
                const width = cardList[i].offsetWidth;
                cardList[i].style.left = leftDistance + "px";
                leftDistance += width;
            }

            buttonRight.addEventListener("click", () => {

                // Adds slide width to the current offset so that all slides are relocated
                // to the right of the current position
                this.offSetWidth += cardList[1].offsetWidth;

                // If the track reaches the end, updates the slide width offset to the last value
                if (this.offSetWidth >= ((cardList.length-1) * cardList[1].offsetWidth)) {
                    this.offSetWidth = (cardList.length-1) * cardList[1].offsetWidth;
                }
                
                // Moves all child elements in the amount specified in this.offSetWidth
                for (let a=0; a < cardList.length; a++) {
                    cardList[a].style.transform = "translateX(-" + this.offSetWidth + "px)";
                }
                
            })

            buttonLeft.addEventListener("click", () => {

                // Substracts one slide width to that all slides are relocated to the left
                // of the current position
                this.offSetWidth -= cardList[1].offsetWidth;

                // If it's the first slide, the offset is reset, this prevents moving slides to
                // the right when we are placed on the first slide
                if (this.offSetWidth <= 0) {
                    this.offSetWidth = 0;
                }
                
                // Moves all child elements in the amount specified in this.offSetWidth
                for (let a=0; a < cardList.length; a++) {
                    cardList[a].style.transform = "translateX(-" + this.offSetWidth + "px)";
                }
            })

        }
}

// ----------------------CREATES RECOMMENDATION ENGINE SLIDER----------------------
class RECOMMENDATION_ENGINE {
    constructor (child_element, startOver, optionToRight, confirmButton) {
        // CSS class (string) of the card or element that will slide
        this.child = child_element,
        this.button_left = startOver,
        this.optionToRight = optionToRight,
        this.confirm = confirmButton,
        // Slide with offset
        this.offSetWidth = 0;
        this.conditions = {
            "age": "",
            "size": "",
            "recovery": false,
            "specialDiet": false,
            "overweight": false};
        this.container = document.querySelector(".recommendation__container");
    }

        init() {
            // Fetches the two buttons
            const buttonLeft = document.querySelector(this.button_left);
            const optionToRight = document.querySelectorAll(this.optionToRight);

            // Array with all the child elements
            const cardList = document.querySelectorAll(this.child);
            
            // Distance to move absolute-positioned objects from
            let leftDistance = 0;

            // Loop that assings each child element a distance from the starting position
            // The slide track is a horizontal sequence of child elements
            for (let i=0; i < cardList.length; i++) {
                
                const width = cardList[i].offsetWidth;
                cardList[i].style.left = leftDistance + "px";
                leftDistance += width;
            }

            for (const option of optionToRight) {

                option.addEventListener("click", () => {

                    // Adds slide width to the current offset so that all slides are relocated
                    // to the right of the current position
                    this.offSetWidth += cardList[1].offsetWidth;
    
                    // If the track reaches the end, updates the slide width offset to the last value
                    if (this.offSetWidth >= ((cardList.length-1) * cardList[1].offsetWidth)) {
                        this.offSetWidth = (cardList.length-1) * cardList[1].offsetWidth;
                    }
                    
                    // Moves all child elements in the amount specified in this.offSetWidth
                    for (let a=0; a < cardList.length; a++) {
                        cardList[a].style.transform = "translateX(-" + this.offSetWidth + "px)";
                    }

                    option.classList.toggle("recommendation__selected")
         
                    switch (option.textContent) {
                        case "Puppy":
                            this.conditions.age = "puppy";
                            break;
                        case "Adult":
                            this.conditions.age = "adult";
                            break;
                        case "Senior":
                            this.conditions.age = "senior";
                            break;
                        case "Small":
                            this.conditions.size = "small";
                            break;
                        case "Medium":
                            this.conditions.size = "medium";
                            break;
                        case "Large":
                            this.conditions.size = "large";
                            break;
                        case "Recovering from desease":
                            this.conditions.recovery = true;
                            break;
                        case "Food allergies":
                            this.conditions.specialDiet = true;
                            break;
                        case "Overweight":
                            this.conditions.overweight = true;
                            break;
                    }
                    
                })
            }

            buttonLeft.addEventListener("click", () => {
    
                // Substracts one slide width so that all slides are relocated to the left
                // of the current position
                this.offSetWidth -= cardList[1].offsetWidth;

                // If it's the first slide, the offset is reset, this prevents moving slides to
                // the right when we are placed on the first slide
                if (this.offSetWidth <= 0) {
                    this.offSetWidth = 0;
                }
                
                // Moves all child elements in the amount specified in this.offSetWidth
                for (let a=0; a < cardList.length; a++) {
                    cardList[a].style.transform = "translateX(0px)";
                }

                for (const option of optionToRight) {
                    option.classList.remove("recommendation__selected");
                };

                this.offSetWidth = 0;

                this.conditions = {};
            })

            const showProducts = () => {

                const products = []
                
                // This block finds the object that match the criteria selected by the user
                for (const product of productsData) {
                    if (product.age.includes(this.conditions.age) && product.size.includes(this.conditions.size)) {
                        if (
                            (this.conditions.recovery && this.conditions.recovery == product.recovery) ||
                            (this.conditions.specialDiet && this.conditions.specialDiet == product["special diet"]) ||
                            (this.conditions.overweight && this.conditions.overweight == product.overweight)
                        ) {
                            products.push(product);
                        } else if (
                            this.conditions.recovery == false &&
                            this.conditions.specialDiet == false &&
                            this.conditions.overweight == false
                        ) {
                            products.push(product);
                        }
                    } 
                }

                const addSelectedProducts = () => {

                    $(".query-results").hide()

                    for (const product of products) {

                       const productId = products.findIndex((element) => element == product);

                        // This adds a div with the products, I need to find an easier way to add this HTML code
                        const div = document.createElement("div");
                        div.innerHTML = `<div class="card__product card__result">
                                            <div><img class="image__card" src=assets/${product.image} alt=""></div>
                                            <div id="result-product-${productId}" class="card__shopping purchase-icon">
                                            <ul>
                                                <li class="fa fa-shopping-cart"></li>
                                            </ul>
                                            </div>
                                            <div class="card__product__label">
                                                <p class="product__name__">${product.name}</p>
                                                <p class="product__price__">$${product.price}</p>
                                            </div>
                                        </div>`
                        
                        // We append the results to this empty div
                        document.querySelector(".query-results").appendChild(div);
                        
                        $(`#result-product-${productId}`).click( () => {
                            const ProductName = product.name;
                            const ProductPrice = product.price;
    
                            Cart.contents.push({
                                "productName": ProductName,
                                "productPrice": ProductPrice
                            });
    
                            Cart.dumpItems();

                            navBarCounter.classList.remove("d-none");
                            navBarCounter.textContent = Cart.contents.length;
                            
                        })
                    
                    }
                    $(".query-results").fadeIn(500)
                    
                }

                $(this.container).fadeOut(500, addSelectedProducts);
                
            }

            document.querySelector(this.confirm).addEventListener("click", showProducts);

        }
}

// ----------------------CREATES MODAL OBJECT----------------------
class MODALWINDOW {
    constructor(modal_, overlay_, closeButton, automatic) {
        this.modal = document.querySelector(modal_);
        this.overlay = document.querySelector(overlay_);
        this.closeButton = document.querySelector(closeButton);
        this.automatic = automatic;
    }

    init () {
        if (this.automatic == false) {
            this.modal.classList.add("d-none");
            this.overlay.classList.add("d-none");                        
        }

        this.closeButton.addEventListener("click", () => {
            this.modal.classList.add("d-none");
            this.overlay.classList.add("d-none");
        });

        
        this.overlay.addEventListener("click", () => {
            this.modal.classList.add("d-none");
            this.overlay.classList.add("d-none");
        });

        document.addEventListener("keydown", (e) => {
            if (e["key"] == "Escape") {
                this.modal.classList.add("d-none");
                this.overlay.classList.add("d-none");
            };
        });

        
    }

};

// ----------------------CREATES PRODUCT OBJECT----------------------

class PRODUCT {
    constructor (id, productName, price, brand, size=[], age=[], recovery=false, specialDiet=false, overweight=false, packageWeight=[]) {
        this.id=id,
        this.productName=productName,
        this.price=price,
        this.brand=brand,
        this.size=size,
        this.age=age,
        this.recovery=recovery,
        this.specialDiet=specialDiet,
        this.overweight=overweight,
        this.packageWeight=packageWeight
    }
}

// ----------------------DEFINES ASYNC FUNCTION TO RETRIEVE DOG BREED DATA----------------------

// Asyncronous function to use the thedogapi to retrieve breed information, returns json
async function dogAPIcall() {
    
    const result = await $.ajax({
        url: `https://api.thedogapi.com/v1/breeds/search?q=${$("#breed-search").val()}`,
        headers: {
            'x-api-key': 'b297c9f6-0abc-418e-a688-cefcde5027ed',
        },
        type: "GET",
        dataType: "json",
        data: {
        },
    });

    return result;
}

// ******************** END OF DEFINITIONS - OBJECT CREATIONS AND METHOD CALLING ********************

// Creates new CART object
const Cart = new CART(
    purchaseIcons=".purchase-icon", // Any clickable object that will trigger the action of adding the product to the cart
    productData=".card__product__label", // Class name that contains the product name and price
    productNameClass=".product__name__", // Class name of product names
    productPriceClass=".product__price__", // Class name of prices
    parentAppendProducts=".product__details", // Class name of div where product prices and names will be appended on payments page
    totalClassName=".total" // Class name of element showing the total on payments page
    );

// Listens for DOM content loads and initializes the CART object
document.addEventListener("DOMContentLoaded", ()=> {
    Cart.init();
})

// Call function that listens for click in shopping cart icon
Cart.addItem();

// Call function that appends divs on "pay" page
Cart.buildProductsList();

// Call function that listens for click in X icon on "pay" page
Cart.removeProduct();

// Creates new SLIDER object
const slider = new SLIDER(
    child_element=".card__slider",
    button_left=".arrow-prev",
    button_right=".arrow-next"
    );

slider.init();

// Creates new MODALWINDOW object
const modalWindow = new MODALWINDOW(
    modal_=".modal__internal",
    overlay_=".overlay",
    closeButton=".close-modal",
    automatic=true
);

modalWindow.init()

productsData.sort((a, b) => {
    return a.price - b.price;
});

const objString = JSON.stringify(productsData)

const recommendationEngine = new RECOMMENDATION_ENGINE(
    child_element=".recommendation__slider",
    startOver=".start-over",
    optionToRight=".recommendation__option",
    confirmButton=".confirm"
);

recommendationEngine.init();



// Listens for click on dog breed search button and inserts data as defined on line 553 async function
$("#breed-submit").click( ()=> {
    // Fades out previous result, if any
    $("#breed-result").fadeOut();

    // Creates a promise to retrieve the API response.
    dogAPIcall().then((result)=> { 
    
    // HTML element with the requested data
    const div = document.createElement("div");
                div.innerHTML = `<div id="breed-result">
                                    <h2>${result[0].name}</h2>
                                    <p>Your dog's ideal height should be ${result[0].height.metric}cm, and it should weight between ${result[0].weight.metric}kg.</p>
                                    <p>${result[0].name}s' behaviour is ${result[0].temperament.toLowerCase()}.</p>
                                    <p>Consider your dog's age when purchasing food. ${result[0].name}s live for about ${result[0].life_span}</p>
                                </div>`;

    // Data appended inside corresponding container
    $("#breed-container").append(div);

    // NOTE TO SELF: this function doesn't contain a catch block to account for
    // cases where no dog breed is found. The API will return an empty list. Either use
    // "catch" or result[0].length == 0.

    });
  
})

})