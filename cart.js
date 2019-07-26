const client = contentful.createClient({
    // This is the space ID. A space is like a project folder in Contentful terms
    space: "rslfvnzjnv3d",
    // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
    accessToken: "a2YEKEnwZS1FTRsq3SUKRMSWhRVongPbXEParoSvPb0"
});
console.log(client);




//variable

const cartBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.querySelector('.close-cart');
const clearCartBtn = document.querySelector('.clear-cart');
const cartDom = document.querySelector('.cart');
const cartOverlay = document.querySelector('.cart-overlay');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const cartContent = document.querySelector('.cart-content');
const productsDom = document.querySelector('.products-center');

// cart

let cart = [];

let buttonsDOM = [];

// getting the products

class Products {
    async   getProducts() {
        try {
            let contentful = await client.getEntries({
                content_type: "cartproject"
            });
            console.log(contentful);
            let products = contentful.items;
            // let result = await fetch('../products.json');
            // let data = await result.json();
            // let products = data.items;
            products = products.map(item => {
                const { title, price } = item.fields;
                const { id } = item.sys;
                const image = item.fields.image.fields.file.url;
                return { title, price, id, image };
            });
            return products;
        } catch (error) {
            console.log(error)
        }
    }
}
// display products

class UI {
    displayProducts(products) {
        let htmlElements = "";
        products.forEach((product) => {
            htmlElements += `
                <aritcle class="product">
                    <div class="img-container">
                        <img class="product-img" src=${product.image}>
                        <button class="bag-btn" data-id=${product.id}><i class="fas fa-shopping-cart"></i> add to cart</button>
                    </div>
                    <h3>${product.title}</h3>
                    <h4>$${product.price}</h4>
                </aritcle>
            `;
            // console.log(htmlElements);
            productsDom.innerHTML = htmlElements;
        });
    }
    getBegButtons() {
        const buttons = [...document.querySelectorAll(".bag-btn")];
        // const buttons2 = Array.from(document.querySelectorAll(".bag-btn"));

        // 2 tai array return kore but 2ta equal noi keno??
        // buttons = [];
        // buttons2 =[];
        // console.log(buttons === buttons2) //false
        // why
        
        // console.log(buttons)
        // console.log(buttonss)
        buttonsDOM = buttons;
        buttons.forEach((button) => {
            let id = button.dataset.id;
            let inCart = cart.find((item) => {
                item.id === id
            });
            if (inCart) {
                button.innerText = 'In Cart';
                button.disabled = true;
            }
            button.addEventListener('click', ev => {
                ev.target.innerText = 'In Cart';
                ev.target.disabled = true;
                // console.log(ev);

                // get product from products
                let cartItem = { ...Storage.getProductsJson(id), amount: 1 };
                // console.log(cartItem);
                // add product to the cart
                cart = [...cart, cartItem];     //method 1
                // cart.push(cartItem);         // methode 



//////////////////////////////////  which methode is better??  /////////////////

                // console.log(cart);
                // save cart in local storage
                Storage.saveCart(cart);
                // set cart value
                this.setCartValues(cart)


                // display cart item
                this.addCartItems(cartItem);

                // show cart
                this.showCart();
                // console.log(this.setCartValues());

            })
        })
    };
    setCartValues(cart) {
        // console.log(cart);
        // let countamount = [];
        // let countprice = [];
        let tempTotal = 0;
        let itemsTotal = 0;
        cart.map((item) => {

            
            
////////////////////////////  var c and p ke kivabe ai blocker out a use korb??  ////////////
            // let c = countamount.reduce(function(a,b){return a+b;},0);  // created by me
            // let p = countprice.reduce(function(a,b){return a+b;},0);  // created by me
            
            
            tempTotal += item.price * item.amount;  // from tutorial
            itemsTotal += item.amount;   // from tutorail
        });
        cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
        cartItems.innerText = itemsTotal;



/////////////////   var c and p akhane undifine kivabe access korbo??        
        // cartTotal.innerText = this.p; // created by me 
        // cartItems.innerText = this.c; // created by me
        // console.log(cartItems)


    }
    addCartItems(item) {
        // cart is available
        const div = document.createElement('div');
        div.classList.add('cart-item');
        div.innerHTML = `
            <img src=${item.image} alt="product"/>
            <div>
              <h4>${item.title}</h4>
              <h5>${item.price}</h5><span class="remove-item" data-id= ${item.id}>remove</span>
            </div>
            <div><i class="fas fa-chevron-up" data-id=${item.id}></i>
              <p class="item-amount">${item.amount}</p><i class="fas fa-chevron-down" data-id=${item.id}></i>
            </div>
            `;
        cartContent.appendChild(div);
    }
    showCart() {
        // cart is availabel
        cartOverlay.classList.add('transparentBcg');
        cartDom.classList.add('showCart');
    }
    setupAPP(){
        // cart is not available

        cart = Storage.getCart();
        this.setCartValues(cart);
        this.populateCart(cart);
        cartBtn.addEventListener('click',this.showCart);
        closeCartBtn.addEventListener('click', this.hideCart); 
    }
    populateCart(){
        // cart is vailable
        cart.forEach((item) => {
            this.addCartItems(item);
        })
    }
    hideCart(){
        // cart is not available

        cartOverlay.classList.remove('transparentBcg');
        cartDom.classList.remove('showCart');
    }
    // clear cart button
    cartLogic() {
        console.log(cart);
        // cart is not available
        clearCartBtn.addEventListener('click',()=>{
            this.clearCart();
        });
        // cart functionality
        cartContent.addEventListener('click', event=>{
            if(event.target.classList.contains('remove-item')){
                let removeItem = event.target;
                let id = removeItem.dataset.id;
                cartContent.removeChild(removeItem.parentElement.parentElement);
                this.removeItem(id);
            } else if (event.target.classList.contains('fa-chevron-up')){
                let amountUp = event.target
                let id = amountUp.dataset.id;
                console.log(id);
                let tempItem = cart.find(item => item.id === id);
                tempItem.amount += 1;
                Storage.saveCart(cart);
                this.setCartValues(cart);
                amountUp.nextElementSibling.innerText = tempItem.amount;
            } else if (event.target.classList.contains('fa-chevron-down')){
                let amountDown = event.target
                let id = amountDown.dataset.id;
                let tempItem = cart.find(item => item.id === id);
                if (tempItem.amount>0) {
                    tempItem.amount = tempItem.amount - 1;
                    Storage.saveCart(cart);
                    this.setCartValues(cart);
                    amountDown.previousElementSibling.innerText = tempItem.amount;
                    
                }else{
                    cartContent.removeChild(amountDown.parentElement.parentElement);
                    this.removeItem(id);
                }
            }
        });
    }
    clearCart(){

        let cartItems = cart.map( item => item.id);
        cartItems.forEach(id => this.removeItem(id));
        while(cartContent.children.length>0){
            cartContent.removeChild(cartContent.children[0])
        };
        this.hideCart()
    }
    removeItem(id){
        // cart is available
        console.log(cart);
        cart = cart.filter(item=> item.id !== id);
        this.setCartValues(cart);
        Storage.saveCart(cart);
        let button = this.getSingleButton(id);
        button.disabled = false;
        button.innerHTML = `<i class="fas fa-shopping-cart"></i> add to cart`
    }
    getSingleButton(id){
        return buttonsDOM.find(button => button.dataset.id === id);
    }
}

// local storage

class Storage {
    static setProductsString(products) {
        localStorage.setItem("Products", JSON.stringify(products));
    }
    static getProductsJson(id) {
        let toProductsJson = JSON.parse(localStorage.getItem('Products'));
        return toProductsJson.find((product) => product.id === id);
        console.log(id);
    }
    static saveCart(cart) {
        localStorage.setItem('cart', JSON.stringify(cart))
    }
    static getCart(){
        return localStorage.getItem("cart")? JSON.parse(localStorage.getItem("cart")):[];
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const ui = new UI();
    const products = new Products();


    // setup APP
    ui.setupAPP();

    // get all products

    products.getProducts().then(products => {
        ui.displayProducts(products);
        Storage.setProductsString(products);
    }).then(() => {
        ui.getBegButtons();
        ui.cartLogic();
    }).catch(error =>{
        console.log(error);
    });
})