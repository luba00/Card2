document.addEventListener('DOMContentLoaded', function () {
    const card = document.querySelector('.card'); 
  
  if (card) { 
   const priceInner = card.querySelector('.card_price-inner');
    if (priceInner) { 
      const priceText = priceInner.querySelector('.price_inner-text b');
        const  priceValue = parseInt(priceText.textContent.replace('₽', '').trim(), 10)
      
      const orderBtn = priceInner.querySelector('.price_inner-btn');

      orderBtn.addEventListener('click', function () {
        const productImage = this.getAttribute('data-product-image');
        const productTitle = this.getAttribute('data-product-title');
         const productPrice = parseInt(this.getAttribute('data-product-price'));

       addToBasket(productImage, productTitle, productPrice, card, priceValue);
      });
    }
  }

  function addToBasket(productImage, productTitle, productPrice, card, initialPrice) {

    let productsWrapper = localStorage.getItem('products') ? JSON.parse(localStorage.getItem('products')) : []; 


    const existingProductIndex = productsWrapper.findIndex(product => product.title === productTitle); 

    if (existingProductIndex > -1) {
      productsWrapper[existingProductIndex].count++; 
     
    } else {
      productsWrapper.push({ 
        image: productImage,
        title: productTitle,
        price: initialPrice,
          count: 1
      });
    }


    localStorage.setItem('products', JSON.stringify(productsWrapper)); //lc
    alert('Товар уже ждет вас в корзине!');

  }


   if (window.location.pathname.includes('basket.html')) {
        const productsWrapper = document.querySelector('.products_wrapper');
        if (productsWrapper) {
            const products = localStorage.getItem('products') ? JSON.parse(localStorage.getItem('products')) : [];
           
            productsWrapper.innerHTML = products.map(product => createProductHTML(product)).join('');
            updateTotalCost();
            addCounter();
        }

   }


   function createProductHTML(product) {
    return `
    <div class="products_one">
      <div class="products_img-inner">
        <img src="https://content.img-gorod.ru/pim/products/images/ff/39/018edf81-709b-714d-9bc6-13b8abc4ff39.jpg?width=92&height=138&fit=bounds" alt="" class="products_img">
      </div>
      <div class="products_text-inner">
        <h3 class="products_text-title">${product.title}</h3>
        <p class="products_text-price">${product.price}₽</p>
        <div class="products_interactive-inner">
          <button class="products_interactive-left" data-product-title='${product.title}'>-</button>
          <input type="text" value='${product.count}' class="products_interactive-input" data-product-title='${product.title}'>
          <button class="products_interactive-right" data-product-title='${product.title}'>+</button>
        </div>
      </div>
    </div>
  `;
  }




  function addCounter() {
    const interactiveInners = document.querySelectorAll('.products_interactive-inner');
    interactiveInners.forEach(interactiveInner => {
        const input = interactiveInner.querySelector('.products_interactive-input');
        const leftButton = interactiveInner.querySelector('.products_interactive-left');
        const rightButton = interactiveInner.querySelector('.products_interactive-right');
        const productName = input.getAttribute('data-product-title');




      leftButton.addEventListener('click', () => {
          if(parseInt(input.value) > 1) {
              input.value = parseInt(input.value) - 1;
              updateProductCount(productName, parseInt(input.value));
          }
        });
        rightButton.addEventListener('click', () => {
          input.value = parseInt(input.value) + 1;
             updateProductCount(productName, parseInt(input.value));
        });

        input.addEventListener('change', () => {
          if(parseInt(input.value) <= 0) {
            input.value = 1
            updateProductCount(productName, 1)
          }
           updateProductCount(productName, parseInt(input.value))
       });
   });
  }

    function updateProductCount(productName, count) {
        const products = JSON.parse(localStorage.getItem('products'))
       const index = products.findIndex(product => product.title === productName)

       if (index > -1) {
           products[index].count = count
            localStorage.setItem('products', JSON.stringify(products));
       }
        updateTotalCost();
    }

  function updateTotalCost() {
      const totalCostElement = document.querySelector('.total_price'); 

        if (totalCostElement) {
            let totalCost = 0;
            let products = localStorage.getItem('products') ? JSON.parse(localStorage.getItem('products')) : [];

            products.forEach(product => {
                totalCost += product.price * product.count;
            });
            totalCostElement.textContent = `Общая стоимость: ${totalCost} ₽`;
        }

    }
});