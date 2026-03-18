const langToggle = document.getElementById("lang-toggle");
const enBlock = document.querySelector('.about-content[data-lang="en"]');
const ukBlock = document.querySelector('.about-content[data-lang="uk"]');

const translations = {
  en: {
    aboutTitle: "About 1 Link Me",
    aboutTagline: "One link to share them all",
    metaTitle: "About 1 Link Me",
    metaDescription: "About 1 Link Me: a simple, free tool to combine up to 8 links into one shareable URL.",
    terms: "Terms",
    privacy: "Privacy",
    about: "About",
    langButton: "UA",
    flag: "🇺🇦",
  },
  uk: {
    aboutTitle: "Про 1 Link Me",
    aboutTagline: "Одне посилання для всього",
    metaTitle: "Про 1 Link Me",
    metaDescription: "Об’єднайте до 8 посилань в одне зручне для поширення. Без реєстрації, без збереження даних, 100% безкоштовно. Ідеально для креаторів, маркетологів і щоденного використання.",
    terms: "Умови",
    privacy: "Приватність",
    about: "Про нас",
    langButton: "EN",
    flag: "🇺🇸",
  },
};

let currentLang = localStorage.getItem("lang") || "en";

function applyTranslations(lang) {
  const dict = translations[lang] || translations.en;

  if (dict.metaTitle) {
    document.title = dict.metaTitle;
  }
  if (dict.metaDescription) {
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", dict.metaDescription);
  }

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });

  if (enBlock && ukBlock) {
    if (lang === "uk") {
      enBlock.classList.add("hidden");
      ukBlock.classList.remove("hidden");
    } else {
      ukBlock.classList.add("hidden");
      enBlock.classList.remove("hidden");
    }
  }

  if (langToggle) {
    if (lang === "uk") {
      langToggle.classList.remove("ua");
      langToggle.classList.add("en");
      langToggle.innerHTML = `<span class="flag">${dict.flag}</span><span class="lang-code">${dict.langButton}</span>`;
    } else {
      langToggle.classList.remove("en");
      langToggle.classList.add("ua");
      langToggle.innerHTML = `<span class="flag">${dict.flag}</span><span class="lang-code">${dict.langButton}</span>`;
    }
  }

  document.documentElement.lang = lang === "uk" ? "uk" : "en";
}

if (langToggle) {
  langToggle.addEventListener("click", () => {
    currentLang = currentLang === "en" ? "uk" : "en";
    localStorage.setItem("lang", currentLang);
    applyTranslations(currentLang);
  });
}

applyTranslations(currentLang);
