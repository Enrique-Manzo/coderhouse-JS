const discountField = document.querySelector("#discount");
const discountButton = document.querySelector(".discount__apply")
const total = document.querySelector(".total");

// Array to store the discount codes, ideally this should be in the back end
const discountCodes = ["coderhouse2022", "petfood2022"]

// Variable to check whether a code has NOT been applied yet
let codeNotApplied = true;

// Event listener to detect when the discount button is clicked
discountButton.addEventListener("click", () => {

    const codeIsValid = discountCodes.includes(discountField.value);
    const productText = document.querySelectorAll(".product__text");
    const productPrices = document.querySelectorAll(".product__price");
    
    // If a code has been applied before, we won't apply it again
    if (codeIsValid && codeNotApplied) {

        Cart.init()

        let totalCounter = 0;

        // We loop through the products on screen
        for (i=0; i < productText.length; i++) {

            // Here we compute the price after the discount is made
            const price = Cart.contents[i]["productPrice"];
            const applicableDiscount = 0.75;
            const discountedPrice = (price * applicableDiscount).toFixed(2)

            // We create the discounted price next to the old price
            const li = document.createElement("li");
            li.innerHTML = `${discountedPrice}`;
            productText[i].appendChild(li);

            // We strikethrough the old price
            productPrices[i].classList.add("strike");
            
            // We need this class so that it can be fetched by app.js when computing the final price
            li.classList.add("discounted__price");

            totalCounter += parseFloat(discountedPrice);

        }

        codeNotApplied = false;

        total.textContent = totalCounter.toFixed(2);
    }
})