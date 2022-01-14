const shoppingCart = document.querySelectorAll(".card__shopping");
const navBarCounter = document.querySelector("#nav__counter");
const productLabel = document.querySelectorAll(".card__product__label");
const productDetails = document.querySelector(".product__details");
let productList = document.querySelector(".product__list");
const totals = document.querySelector(".total");

// Creates CART object to store product information
const CART = {
    KEY: "thisisatestkey",
    // Array with products
    contents: [],
    
    // OBJECT METHODS
    // Object initialization: checks whether there are products stored in memory
    init() {
        let _contents = localStorage.getItem(CART.KEY);
        if (_contents) {
            CART.contents = JSON.parse(_contents);
        } else {
            CART.dumpItems();
        }
    },

    // dumpItems: saves products to browser memory (only strings)
    dumpItems () {
        let cartContentsString = JSON.stringify(CART.contents)
        localStorage.setItem(CART.KEY, cartContentsString)
    },

    // logContents: control method to check whether products are being saved
    logContents () {console.log(CART.contents)},
}


// Function that listens for clicks in any of the shopping cart icons
const addItem = () => {

    // Loops through shopping cart array
    for (let i=0; i < shoppingCart.length; i++) {

        // Function definition for shoppingCart event listener below
        // Makes counter visible, increments product counter in object, updates counter, saves counter in memory
        const logItem = () => {

            // Writes the number of items in the cart
            numberOfItems = CART.contents.length + 1
            navBarCounter.textContent = numberOfItems;

            // Makes cart counter visible if there are any items in it
            if (numberOfItems > 0) {
            navBarCounter.classList.remove("d-none");
            }
            
            // Creates new array by splitting the text in the productLabel elements
            products = productLabel[i].textContent.split("\n")
            
            // Appends content to CART.contents array
            CART.contents.push({
                productName: products[1].trim(),
                productPrice: parseFloat(products[2].trim().replace("$", "")),
            })
            
            // Saves data to memory
            CART.dumpItems()

        };

        // Listener function to check whether the cart icon is clicked and add the item to CART
        shoppingCart[i].addEventListener("click", logItem);
    }
}

// Function to add products to the cashout page
const buildProductsList = () => {

    const pageName = window.location.pathname.split("/").pop();

    // I need to check the page name to prevent JS errors when some element is not found
    if (pageName == "pay.html") {

        // We initialize our cart
        CART.init();

        let totalCounter = 0;

        for (let i=0; i < CART.contents.length; i++) {
            
            // Gets data from the cart contents JSON
            const productNameHTML = CART.contents[i]["productName"];
            const productPriceHTML = CART.contents[i]["productPrice"]

            // This adds a div with the products, I need to find an easier way to add this HTML code
            const div = document.createElement("div");
            div.innerHTML = `<ul class="d-flex flex-row product__row product__text"> \
            <li class="product__name mg-rt-50">${productNameHTML}</li> \
            <li class="product__price">$${productPriceHTML}</li><i class="fa fa-times"></i>\
            </ul>`

            // Inserts HTML under the productDetails element defined above
            productDetails.appendChild(div);
            
            totalCounter += parseFloat(productPriceHTML);
        }

        totals.textContent = parseFloat(totalCounter);
    }
}

// Function to remove a product
const removeProduct = () => {

    // Array with all the product objects on the payment page
    const productsCashOuts = document.querySelectorAll(".product__row");

    // Array with all the X buttons on the payment page
    const deleteIcon = document.querySelectorAll(".fa-times");


    // Loops the number of items in the cart
    for (let i=0; i < CART.contents.length; i++) {
        
        // Function definition for the X button event listener below
        const deleteItem = () => {

            // Remove HTML
            productsCashOuts[i].remove();            
            
            // We gather the products again after the removal of the HTML, dynamically
            const currentElements = document.querySelectorAll(".product__row");

            // We empty our cart, we'll later fill it in with the elements above
            CART.contents = [];

            // If all the HTML products on the page have been removed, leave the cart empty
            if (currentElements.length > 0) {

                // Loop through the number of items in the current HTML
                for (let a=0; a < currentElements.length; a++) {

                    // For each item in the currentElements array, extract text and create new array
                    const elementPropertiesList = currentElements[a].textContent.split("$")

                    // Create new object from the name and price items on the array above
                    // and append it to the CART.contents array
                    // The function will append as many objects as items in currentElements
                    CART.contents.push({
                        // There are blank spaces that we need to trim
                        productName: elementPropertiesList[0].trim(),
                        productPrice: parseFloat(elementPropertiesList[1].trim()),
                    });   
                }
            }

            // Save new CART.contents as string in browser memory
            CART.dumpItems();

            // End of daleteIcon event listener function
            
        }

        // Generate listener for each X button on the payment page, function definition above
        deleteIcon[i].addEventListener("click", deleteItem);
    }
}

// Listens for DOM content loads and initializes the CART object
document.addEventListener("DOMContentLoaded", ()=> {
    CART.init();
})

// Call function that listens for click in shopping cart icon
addItem();

// Call function that appends divs on "pay" page
buildProductsList();

// Call function that listens for click in X icon on "pay" page
removeProduct();
