const discountField = document.querySelector("#discount");
const discountButton = document.querySelector(".discount__apply")
const productText = document.querySelectorAll(".product__text");
const productPrices = document.querySelectorAll(".product__price");
const total = document.querySelector(".total");

// Creates CART object to store product information
const CARTS = {
    KEY: "thisisatestkey",
    // Array with products
    contents: [],
    
    // OBJECT METHODS
    // Object initialization: checks whether there are products stored in memory
    init() {
        let _contents = localStorage.getItem(CARTS.KEY);
        if (_contents) {
            CARTS.contents = JSON.parse(_contents);
        } else {
            CARTS.dumpItems();
        }
    },

    // dumpItems: saves products to browser memory (only strings)
    dumpItems () {
        let cartContentsString = JSON.stringify(CARTS.contents)
        localStorage.setItem(CART.KEY, cartContentsString)
    },

    // logContents: control method to check whether products are being saved
    logContents () {console.log(CARTS.contents)},
}


const discountCodes = ["coderhouse2022", "petfood2022"]
let codeNotApplied = true;

discountButton.addEventListener("click", () => {
    const codeIsValid = discountCodes.includes(discountField.value);

    CARTS.init()

    if (codeIsValid && codeNotApplied) {

        let totalCounter = 0;

        for (i=0; i < productText.length; i++) {

            const price = CARTS.contents[i]["productPrice"];
            const applicableDiscount = 0.75;

            const discountedPrice = (price * applicableDiscount).toFixed(2)

            const li = document.createElement("li");
            li.innerHTML = `${discountedPrice}`;
            productText[i].appendChild(li);

            productPrices[i].classList.add("strike");

            totalCounter += parseFloat(discountedPrice);


        }

        codeNotApplied = false;

        total.textContent = totalCounter;
    }
})