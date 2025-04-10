// DOM Content Loaded Event Handler
document.addEventListener('DOMContentLoaded', function() {
  // Image slider functionality
  const slides = document.querySelectorAll('.slide');
  const thumbnails = document.querySelectorAll('.thumbnail');
  const prevBtn = document.querySelector('.slider-prev-btn');
  const nextBtn = document.querySelector('.slider-next-btn');
  let currentIndex = 0;

  function showSlide(index) {
      slides.forEach(slide => slide.classList.remove('active'));
      thumbnails.forEach(thumb => thumb.classList.remove('active'));
      
      slides[index].classList.add('active');
      thumbnails[index].classList.add('active');
      
      currentIndex = index;
  }

  prevBtn.addEventListener('click', function() {
      let newIndex = currentIndex - 1;
      if (newIndex < 0) newIndex = slides.length - 1;
      showSlide(newIndex);
  });

  nextBtn.addEventListener('click', function() {
      let newIndex = currentIndex + 1;
      if (newIndex >= slides.length) newIndex = 0;
      showSlide(newIndex);
  });

  thumbnails.forEach(thumb => {
      thumb.addEventListener('click', function() {
          const index = parseInt(this.getAttribute('data-index'));
          showSlide(index);
      });
  });

  // Product quantity counter
  const decrementBtn = document.querySelector('.decrement');
  const incrementBtn = document.querySelector('.increment');
  const countDisplay = document.querySelector('.count');
  let count = 0;

  function updateCount() {
      countDisplay.textContent = count;
  }

  decrementBtn.addEventListener('click', function() {
      if (count > 0) {
          count--;
          updateCount();
      }
  });

  incrementBtn.addEventListener('click', function() {
      count++;
      updateCount();
  });

  updateCount();
});

// Shopping cart functionality
document.addEventListener('DOMContentLoaded', function() {
  // Get existing elements from HTML
  const menuIcon = document.querySelector('.menu');
  const cartIcon = document.querySelector('.nav_right img[src="images/icon-cart.svg"]');
  const addToCartButton = document.querySelector('.cart button');
  const countDisplay = document.querySelector('.count');
  
  // Create and append cart modal to the DOM
  const cartModal = document.createElement('div');
  cartModal.className = 'cart-modal';
  cartModal.innerHTML = `
    <div class="cart-modal-content">
      <h3>Cart</h3>
      <div id="cartItems" class="cart-items"></div>
      <div id="cartEmpty" class="cart-empty">
        <p>Your cart is empty</p>
      </div>
      <button id="checkoutBtn" class="checkout-btn">Checkout</button>
    </div>
  `;
  document.body.appendChild(cartModal);
  
  // Create and append mobile menu overlay
  const overlay = document.createElement('div');
  overlay.className = 'overlay';
  document.body.appendChild(overlay);
  
  // Create mobile menu sidebar
  const mobileMenu = document.createElement('div');
  mobileMenu.className = 'mobile-menu';
  mobileMenu.innerHTML = `
    <div class="mobile-menu-header">
      <img src="images/icon-close.svg" alt="Close" class="close-menu">
    </div>
    <div class="mobile-menu-content">
      <ul>
        <li><a href="">Collections</a></li>
        <li><a href="">Men</a></li>
        <li><a href="">Women</a></li>
        <li><a href="">About</a></li>
        <li><a href="">Contact</a></li>
      </ul>
    </div>
  `;
  document.body.appendChild(mobileMenu);
  
  // Get newly created elements
  const closeMenuBtn = document.querySelector('.close-menu');
  const cartItemsContainer = document.getElementById('cartItems');
  const cartEmptyMessage = document.getElementById('cartEmpty');
  const checkoutBtn = document.getElementById('checkoutBtn');
  
  // Shopping cart state
  let cartItems = [];
  let cartCount = 0;
  
  // Toggle cart modal
  cartIcon.addEventListener('click', function() {
    cartModal.classList.toggle('show');
    updateCartDisplay();
  });
  
  // Mobile menu functionality
  menuIcon.addEventListener('click', function() {
    mobileMenu.classList.add('show');
    overlay.classList.add('show');
  });
  
  closeMenuBtn.addEventListener('click', function() {
    mobileMenu.classList.remove('show');
    overlay.classList.remove('show');
  });
  
  overlay.addEventListener('click', function() {
    mobileMenu.classList.remove('show');
    cartModal.classList.remove('show');
    overlay.classList.remove('show');
  });
  
  // Add to cart functionality
  addToCartButton.addEventListener('click', function() {
    const quantity = parseInt(countDisplay.textContent);
    
    if (quantity > 0) {
      const productName = document.querySelector('.main_right h2').textContent;
      const productPrice = 125.00;
      const productImage = document.querySelector('.slide.active img').src;
      
      addItemToCart({
        name: productName,
        price: productPrice,
        quantity: quantity,
        image: "images/image-product-1.jpg"
      });
      
      showNotification(`Added ${quantity} item(s) to cart`);
      document.querySelector('.count').textContent = '0';
    }
  });
  
  function addItemToCart(item) {
    const existingItemIndex = cartItems.findIndex(cartItem => cartItem.name === item.name);
    
    if (existingItemIndex !== -1) {
      cartItems[existingItemIndex].quantity += item.quantity;
    } else {
      cartItems.push(item);
    }
    
    cartCount += item.quantity;
    updateCartBadge();
  }
  
  function removeItemFromCart(index) {
    cartCount -= cartItems[index].quantity;
    cartItems.splice(index, 1);
    updateCartBadge();
    updateCartDisplay();
  }
  
  function updateCartBadge() {
    let cartBadge = document.querySelector('.cart-badge');
    
    if (cartCount > 0) {
      if (!cartBadge) {
        cartBadge = document.createElement('span');
        cartBadge.className = 'cart-badge';
        cartIcon.parentNode.appendChild(cartBadge);
      }
      cartBadge.textContent = cartCount;
    } else if (cartBadge) {
      cartBadge.remove();
    }
  }
  
  function updateCartDisplay() {
    if (cartItems.length === 0) {
      cartEmptyMessage.style.display = 'block';
      cartItemsContainer.style.display = 'none';
      checkoutBtn.style.display = 'none';
    } else {
      cartEmptyMessage.style.display = 'none';
      cartItemsContainer.style.display = 'block';
      checkoutBtn.style.display = 'block';
      
      cartItemsContainer.innerHTML = '';
      
      cartItems.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        
        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
          <img src="${item.image}"  class="cart-item-image">
          <div class="cart-item-details">
            <p class="cart-item-name">${item.name}</p>
            <p class="cart-item-price">
              $${item.price.toFixed(2)} x ${item.quantity} 
              <span class="cart-item-total">$${itemTotal.toFixed(2)}</span>
            </p>
          </div>
          <img src="images/icon-delete.svg" alt="Delete" class="cart-item-delete" data-index="${index}">
        `;
        
        cartItemsContainer.appendChild(itemElement);
      });
      
      document.querySelectorAll('.cart-item-delete').forEach(button => {
        button.addEventListener('click', function() {
          const index = parseInt(this.getAttribute('data-index'));
          removeItemFromCart(index);
        });
      });
    }
  }
  
  function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('fade-out');
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  }
  
  // Checkout button functionality
  checkoutBtn.addEventListener('click', function() {
    alert('Proceeding to checkout!');
  });
});