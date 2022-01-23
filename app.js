// ----------------------GLOBAL VARIABLES----------------------
const shoppingCart = document.querySelectorAll(".card__shopping");
const navBarCounter = document.querySelector("#nav__counter");
const productLabel = document.querySelectorAll(".card__product__label");
const productDetails = document.querySelector(".product__details");
let productList = document.querySelector(".product__list");
const totals = document.querySelector(".total");


// ----------------------CREATES CART OBJECT----------------------
class CART {
    constructor (KEY, contents) {

    this.KEY = "thisisatestkey";
    // Array with products
    this.contents = [];
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

        // Loops through shopping cart array
        for (let i=0; i < shoppingCart.length; i++) {

            // Function definition for shoppingCart event listener below
            // Makes counter visible, increments product counter in object, updates counter, saves counter in memory
            const logItem = () => {

                // Writes the number of items in the cart
                let numberOfItems = this.contents.length + 1
                navBarCounter.textContent = numberOfItems;

                // Makes cart counter visible if there are any items in it
                if (numberOfItems > 0) {
                navBarCounter.classList.remove("d-none");
                }
            };
        };

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
        for (let i=0; i < shoppingCart.length; i++) {

            // Function definition for shoppingCart event listener below
            // Makes counter visible, increments product counter in object, updates counter, saves counter in memory
            const logItem = () => {

                // Writes the number of items in the cart
                let numberOfItems = this.contents.length + 1
                navBarCounter.textContent = numberOfItems;

                // Makes cart counter visible if there are any items in it
                if (numberOfItems > 0) {
                navBarCounter.classList.remove("d-none");
                }
                
                // Creates new array by splitting the text in the productLabel elements
                let products = productLabel[i].textContent.split("\n")
                
                // Appends content to CART.contents array
                this.contents.push({
                    productName: products[1].trim(),
                    productPrice: parseFloat(products[2].trim().replace("$", "")),
                })
                
                // Saves data to memory
                this.dumpItems()

            };

            // Listener function to check whether the cart icon is clicked and add the item to CART
            shoppingCart[i].addEventListener("click", logItem);
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
                div.innerHTML = `<ul class="d-flex flex-row product__row product__text"> \
                <li class="product__name mg-rt-50">${productNameHTML}</li> \
                <li class="product__price">$${productPriceHTML}</li><i class="fa fa-times"></i>\
                </ul>`

                // Inserts HTML under the productDetails element defined above
                productDetails.appendChild(div);
                
                // Add productPriceHTML to totalCounter
                totalCounter += parseFloat(productPriceHTML);
            }

            // Update price
            if (totalCounter > 0) {
                totals.textContent = parseFloat(totalCounter).toFixed(2);
            }

        }
    }

    // Function to remove a product
    removeProduct () {

        // Array with all the product objects on the payment page
        const productsCashOuts = document.querySelectorAll(".product__row");

        // Array with all the X buttons on the payment page
        const deleteIcon = document.querySelectorAll(".fa-times");


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
                    totals.textContent = parseFloat(totalCounter).toFixed(2);
                } else {
                    totals.textContent = "Please add products to the cart to calculate the total.";
                }

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

// ----------------------CREATES MODAL OBJECT----------------------
class MODALWINDOW {
    constructor(modal_, overlay_, closeButton, automatic) {
        this.modal = document.querySelector(modal_),
        this.overlay = document.querySelector(overlay_),
        this.closeButton = document.querySelector(closeButton),
        this.automatic = automatic;
    }

    init () {
        if (this.automatic == true) {

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
    }

};

// Creates new CART object
let Cart = new CART();

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
slider = new SLIDER(
    child_element=".card__slider",
    button_left=".arrow-prev",
    button_right=".arrow-next"
    );

slider.init();

// Creates new MODALWINDOW object
modalWindow = new MODALWINDOW(
    modal_=".modal__internal",
    overlay_=".overlay",
    closeButton=".close-modal",
    automatic=true
);

modalWindow.init()