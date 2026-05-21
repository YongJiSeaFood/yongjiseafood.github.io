const translations = {
  tw: {
    header: {
      title: "永吉水產",
      section1: "養殖方式",
      section2: "熱銷商品",
      section3: "社交媒體",
    },
    section1: {
      title: "養殖方式",
      content: "這是養殖方式的內容。",
    },
    section2: {
      title: "熱銷商品",
      productATitle: "商品 A",
      productADescription: "商品 A 選項",
      productBTitle: "商品 B",
      productBDescription: "商品 B 選項",
      productCTitle: "商品 C",
      productCDescription: "商品 C 選項",
      // item 1
      item1Title: "虱目魚肚規格 / 💰價目表",
      item1S: "170-190g / $120",
      item1M: "200-220g / $135",
      item1L: "230-250g / $150",
      item1Sub: "限量提供",
      item1XL: "260-280g / $165",
      item1XXL: "290-310g / $180",
      item1XXXL: "320-340g / $195",
      // item 2
      item2Title: "魚皮",
      item2Sub: "300g / $90",
      // item 3
      item3Title: "魚柳",
      item3Sub: "600g / $180",
      //item 4
      item4Title: "魚腸",
      item4Sub: "600g / $100",
      //item 5
      item5Title: "里肌",
      item5Sub: "300g / $90",
      //item 6
      item6Title: "魚頭",
      item6Sub: "$50 / 包",
      //item 7
      item7Title: "虱目魚香腸",
      item7Sub: "600g / $250",
      //item 8
      item8Title: "飛魚卵虱目魚香腸",
      item8Sub: "600g / $300",
    },
    section3: {
      title: "社交媒體",
      content: "點擊或掃碼加入",
    },
    footer: {
      text: "© 2025 永吉水產。版權所有。",
    },
    cart: {
      button: "購物車",
      addToCart: "加入購物車",
      eyebrow: "Yong Ji Seafood",
      title: "購物車",
      emptyTitle: "購物車還是空的",
      emptyText: "先選一個商品加入購物車。",
      subtotal: "小計",
      checkoutHint: "付款串接完成後，這裡會送出訂單並前往綠界付款。",
      checkout: "前往結帳",
      quantity: "數量",
      remove: "移除",
      checkoutPending: "結帳功能準備中",
    },
    floatingBtn: {
      lineLink: "立即訂購",
    },
  },
  en: {
    header: {
      title: "Yong Ji Seafood",
      section1: "Farming Methods",
      section2: "Products",
      section3: "Social Media",
    },
    section1: {
      title: "Farming Methods",
      content: "This is the content of Section 1.",
    },
    section2: {
      title: "Best-selling Products",
      productATitle: "Product A",
      productADescription: "Product A option",
      productBTitle: "Product B",
      productBDescription: "Product B option",
      productCTitle: "Product C",
      productCDescription: "Product C option",
      // item 1
      item1Title: "Milkfish Belly Specifications / 💰 Price List",
      item1S: "170-190g / $120",
      item1M: "200-220g / $135",
      item1L: "230-250g / $150",
      item1Sub: "Limited Supply",
      item1XL: "260-280g / $165",
      item1XXL: "290-310g / $180",
      item1XXXL: "320-340g / $195",
      // item 2
      item2Title: "Fish Skin",
      item2Sub: "300g / $90",
      // item 3
      item3Title: "Fish Fillets",
      item3Sub: "600g / $180",
      // item 4
      item4Title: "Fish Intestine",
      item4Sub: "600g / $100",
      // item 5
      item5Title: "Fish Tenderloin",
      item5Sub: "300g / $90",
      // item 6
      item6Title: "Fish Head",
      item6Sub: "$50 / per pack",
      // item 7
      item7Title: "Milkfish Sausage",
      item7Sub: "600g / $250",
      // item 8
      item8Title: "Flying Fish Roe Milkfish Sausage",
      item8Sub: "600g / $300",
    },

    section3: {
      title: "Social Media",
      content: "Click or Scan",
    },
    footer: {
      text: "© 2025 Yong Ji Seafood. All rights reserved.",
    },
    cart: {
      button: "Cart",
      addToCart: "Add to Cart",
      eyebrow: "Yong Ji Seafood",
      title: "Cart",
      emptyTitle: "Your cart is empty",
      emptyText: "Add a product to get started.",
      subtotal: "Subtotal",
      checkoutHint:
        "After payment integration, this will create an order and continue to ECPay.",
      checkout: "Checkout",
      quantity: "Quantity",
      remove: "Remove",
      checkoutPending: "Checkout is not connected yet",
    },
    floatingBtn: {
      lineLink: "Order Now",
    },
  },
};

window.translations = translations;

function getNestedValue(obj, keyPath) {
  return keyPath.split(".").reduce((acc, key) => acc && acc[key], obj);
}

function setLanguage(lang) {
  document.documentElement.dataset.lang = lang;
  const currentTranslations = translations[lang];
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const keyPath = element.getAttribute("data-i18n");
    const translation = getNestedValue(currentTranslations, keyPath);
    if (translation) {
      element.textContent = translation;
    }
  });

  const titleTranslation = getNestedValue(currentTranslations, "header.title");
  if (titleTranslation) {
    document.title = titleTranslation;
  }

  document.querySelectorAll("select[onchange]").forEach((select) => {
    select.value = lang;
  });

  window.dispatchEvent(new CustomEvent("languagechange", { detail: { lang } }));
}

// 預設語系
setLanguage("tw");

function toggleMobileMenu() {
  const mobileMenu = document.getElementById("mobile-menu");
  mobileMenu.classList.toggle("hidden");
}

function closeMobileMenu() {
  const mobileMenu = document.getElementById("mobile-menu");
  if (!mobileMenu.classList.contains("hidden")) {
    mobileMenu.classList.add("hidden");
  }
}

function toggleMobileMenu() {
  const mobileMenu = document.getElementById("mobile-menu");
  mobileMenu.classList.toggle("hidden");
}

// 為所有行動版導覽連結加上點擊事件：點擊後收起選單
document.querySelectorAll("#mobile-menu a").forEach((link) => {
  link.addEventListener("click", () => {
    closeMobileMenu();
  });
});
