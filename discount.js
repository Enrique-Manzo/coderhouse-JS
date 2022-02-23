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
            li.innerHTML = `$${discountedPrice}`;
            productText[i].appendChild(li);

            // We strikethrough the old price
            productPrices[i].classList.add("strike");
            
            // We need this class so that it can be fetched by app.js when computing the final price
            li.classList.add("discounted__price");

            totalCounter += parseFloat(discountedPrice);

        }

        codeNotApplied = false;

        total.textContent = `$${totalCounter.toFixed(2)}`;
    }
})

$(() => {

    $("#pay-now").click(
        () => {
            const div = document.createElement("div");
            div.innerHTML = `<div class="payment-overlay"></div>`;
            document.querySelector("body").appendChild(div);

            $(".credit-items-location").removeClass("d-none");
        }
    )

    $(document).keyup( (e)=> {
        if (e.key == "Escape") {
            $(".payment-overlay").remove();
            $(".credit-items-location").addClass("d-none");
        }
    })

    
    $("#card-number-0").on("input", ()=> {
        $("#credit-card__number__0").text($("#card-number-0").val());
      
        if ($("#card-number-0").val().length == 4) {
            $("#card-number-1").focus()
        }
    })

    $("#card-number-1").on("input", ()=> {
        $("#credit-card__number__1").text($("#card-number-1").val());
        if ($("#card-number-1").val().length == 4) {
            $("#card-number-2").focus()
        }
    })

    $("#card-number-2").on("input", ()=> {
        $("#credit-card__number__2").text($("#card-number-2").val());
        if ($("#card-number-2").val().length == 4) {
            $("#card-number-3").focus()
        }
    })

    $("#card-number-3").on("input", ()=> {
        $("#credit-card__number__3").text($("#card-number-3").val());
    })

    $("#card-holder-name").on("input", ()=> {
        $("#credit-card__holder-name").text($("#card-holder-name").val());
    })

    $("#credit-form-month").on("input", ()=> {
        $("#credit-card__expiration-date").text($("#credit-form-month").val() + "/" + $("#credit-form-year").val());
        if ($("#credit-form-month").val().length == 2) {
            $("#credit-form-year").focus()
        }
    })

    $("#credit-form-year").on("input", ()=> {
        $("#credit-card__expiration-date").text($("#credit-form-month").val() + "/" + $("#credit-form-year").val());
    }) 

    $("#credit-submit").on("click", ()=> {
        const PayModal = new MODALWINDOW(
            modal_=".modal__internal",
            overlay_=".payment-overlay",
            closeButton=".close-modal",
            automatic=true
        );
    
        PayModal.init();
        
        $(".modal__internal").removeClass("d-none");

        localStorage.setItem(Cart.KEY, [])
    })
    

})

