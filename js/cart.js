document.addEventListener("DOMContentLoaded", function () {
  const storageKey = "yongji-cart";
  const shell = document.querySelector(".cart-shell");
  const drawer = document.querySelector(".cart-drawer");
  const backdrop = document.querySelector(".cart-backdrop");
  const itemsContainer = document.querySelector(".js-cart-items");
  const emptyState = document.querySelector(".js-cart-empty");
  const subtotalElement = document.querySelector(".js-cart-subtotal");
  const countElements = document.querySelectorAll(".js-cart-count");
  const checkoutButton = document.querySelector(".js-cart-checkout");
  const animation = window.gsap;
  let cart = loadCart();
  let isOpen = false;

  if (!shell || !drawer || !itemsContainer || !emptyState || !subtotalElement) {
    return;
  }

  function loadCart() {
    try {
      return JSON.parse(window.localStorage.getItem(storageKey)) || [];
    } catch {
      return [];
    }
  }

  function saveCart() {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(cart));
    } catch {
      // Keep the cart usable even when storage is blocked.
    }
  }

  function formatPrice(value) {
    return `$${Number(value).toLocaleString("zh-TW")}`;
  }

  function getCurrentLang() {
    return document.documentElement.dataset.lang || "tw";
  }

  function getCartText(key) {
    return window.translations?.[getCurrentLang()]?.cart?.[key] || "";
  }

  function getProductName(button) {
    if (getCurrentLang() === "en" && button.dataset.itemNameEn) {
      return button.dataset.itemNameEn;
    }
    return button.dataset.itemName;
  }

  function getTotals() {
    return cart.reduce(
      (totals, item) => {
        totals.count += item.quantity;
        totals.subtotal += item.quantity * item.price;
        return totals;
      },
      { count: 0, subtotal: 0 }
    );
  }

  function renderCart() {
    const totals = getTotals();
    countElements.forEach((element) => {
      element.textContent = totals.count;
    });
    subtotalElement.textContent = formatPrice(totals.subtotal);
    emptyState.classList.toggle("is-visible", cart.length === 0);
    itemsContainer.hidden = cart.length === 0;

    itemsContainer.innerHTML = cart
      .map(
        (item) => `
          <article class="cart-item" data-cart-item="${item.id}">
            <div class="cart-item__image">
              <img src="${item.image}" alt="${item.name}" />
            </div>
            <div class="cart-item__body">
              <div class="cart-item__top">
                <div>
                  <div class="cart-item__name">${item.name}</div>
                  <div class="cart-item__meta">${getCartText("quantity")}</div>
                </div>
                <div class="cart-item__price">${formatPrice(item.price)}</div>
              </div>
              <div class="cart-item__actions">
                <div class="cart-item__quantity" aria-label="${getCartText(
                  "quantity"
                )}">
                  <button type="button" data-cart-decrease="${
                    item.id
                  }" aria-label="Decrease quantity">−</button>
                  <span>${item.quantity}</span>
                  <button type="button" data-cart-increase="${
                    item.id
                  }" aria-label="Increase quantity">+</button>
                </div>
                <button type="button" class="cart-item__remove" data-cart-remove="${
                  item.id
                }">${getCartText("remove")}</button>
              </div>
            </div>
          </article>
        `
      )
      .join("");

    if (animation && cart.length > 0) {
      animation.fromTo(
        ".cart-item",
        { autoAlpha: 0, y: 12 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.35,
          ease: "power2.out",
          stagger: 0.04,
        }
      );
    }
  }

  function openCart() {
    if (isOpen) {
      return;
    }

    isOpen = true;
    shell.classList.add("is-open");
    shell.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    if (animation) {
      animation.killTweensOf([drawer, backdrop]);
      animation
        .timeline()
        .to(backdrop, {
          autoAlpha: 1,
          duration: 0.22,
          ease: "power2.out",
        })
        .to(
          drawer,
          {
            x: 0,
            duration: 0.42,
            ease: "power3.out",
          },
          "<"
        );
      return;
    }

    backdrop.style.opacity = "1";
    drawer.style.transform = "translateX(0)";
  }

  function closeCart() {
    if (!isOpen) {
      return;
    }

    isOpen = false;
    document.body.style.overflow = "";

    function finishClose() {
      shell.classList.remove("is-open");
      shell.setAttribute("aria-hidden", "true");
    }

    if (animation) {
      animation.killTweensOf([drawer, backdrop]);
      animation
        .timeline({ onComplete: finishClose })
        .to(drawer, {
          x: "100%",
          duration: 0.32,
          ease: "power2.in",
        })
        .to(
          backdrop,
          {
            autoAlpha: 0,
            duration: 0.2,
            ease: "power2.out",
          },
          "<"
        );
      return;
    }

    backdrop.style.opacity = "0";
    drawer.style.transform = "translateX(100%)";
    finishClose();
  }

  function animateAdd(button) {
    if (!animation) {
      return;
    }

    animation.fromTo(
      button,
      { scale: 0.98 },
      { scale: 1, duration: 0.28, ease: "back.out(2)" }
    );

    countElements.forEach((element) => {
      animation.fromTo(
        element,
        { scale: 1.25 },
        { scale: 1, duration: 0.34, ease: "back.out(2)" }
      );
    });
  }

  function addItem(button) {
    const id = button.dataset.itemId;
    const existingItem = cart.find((item) => item.id === id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id,
        name: getProductName(button),
        price: Number(button.dataset.itemPrice),
        image: button.dataset.itemImage,
        quantity: 1,
      });
    }

    saveCart();
    renderCart();
    animateAdd(button);
    openCart();
  }

  function updateQuantity(id, delta) {
    const item = cart.find((cartItem) => cartItem.id === id);
    if (!item) {
      return;
    }

    item.quantity += delta;
    if (item.quantity <= 0) {
      cart = cart.filter((cartItem) => cartItem.id !== id);
    }

    saveCart();
    renderCart();
  }

  document.addEventListener("click", function (event) {
    const openButton = event.target.closest(".js-cart-open");
    const closeButton = event.target.closest(".js-cart-close");
    const addButton = event.target.closest(".js-cart-add");

    if (openButton) {
      openCart();
    }

    if (closeButton) {
      closeCart();
    }

    if (addButton) {
      event.preventDefault();
      addItem(addButton);
    }
  });

  itemsContainer.addEventListener("click", function (event) {
    const decreaseButton = event.target.closest("[data-cart-decrease]");
    const increaseButton = event.target.closest("[data-cart-increase]");
    const removeButton = event.target.closest("[data-cart-remove]");

    if (decreaseButton) {
      updateQuantity(decreaseButton.dataset.cartDecrease, -1);
    }

    if (increaseButton) {
      updateQuantity(increaseButton.dataset.cartIncrease, 1);
    }

    if (removeButton) {
      cart = cart.filter((item) => item.id !== removeButton.dataset.cartRemove);
      saveCart();
      renderCart();
    }
  });

  checkoutButton?.addEventListener("click", function () {
    if (animation) {
      animation.fromTo(
        checkoutButton,
        { x: -4 },
        { x: 0, duration: 0.35, ease: "elastic.out(1, 0.35)" }
      );
    }
    checkoutButton.querySelector("span").textContent =
      getCartText("checkoutPending") || "Checkout is not connected yet";
  });

  window.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeCart();
    }
  });

  window.addEventListener("languagechange", renderCart);

  renderCart();
});
