const MAX_LINKS = 8;

const linksContainer = document.getElementById("links");
const addButton = document.getElementById("add");
const convertButton = document.getElementById("convert");
const limitLabel = document.querySelector(".limit");
const resultSection = document.getElementById("result");
const outputField = document.getElementById("output");
const copyButton = document.getElementById("copy");
const resultMessage = document.getElementById("result-message");
const openLink = document.getElementById("open-link");
const viewerSection = document.getElementById("viewer");
const viewerCtaSection = document.getElementById("viewer-cta");
const sharedList = document.getElementById("shared-list");
const commentInput = document.getElementById("comment");
const heroMessage = document.getElementById("hero-message");
const heroMessageDefault = heroMessage ? heroMessage.innerHTML : "";
const commentCount = document.getElementById("comment-count");
const langToggle = document.getElementById("lang-toggle");
const ADS_CONVERSION_ID = "AW-18059416682/NDe-CPeV3JQcEOqos6ND";

const translations = {
  en: {
    metaTitle: "1 Link Me – Combine Multiple Links Into One URL (Free, No Login)",
    metaDescription:
      "Turn up to 8 links into one shareable link. No sign-up, no storage, 100% free. Perfect for creators, marketers, and everyday sharing.",
    heroTitle: "Turn up to 8 links into one shareable link",
    heroLine1: "Paste your links, click convert, and share a single URL.",
    heroLine2: "Works forever — no login, no costs.",
    heroLine3: "Note: lost links can’t be recovered.",
    linksTitle: "Your links",
    addLink: "Add another link",
    commentLabel: "Comments (optional)",
    commentPlaceholder: "Add a short note (up to 50 characters)",
    convert: "Convert to one link",
    helper: "Only http(s) links are accepted.",
    shareableTitle: "Your shareable link",
    copy: "Copy",
    openLink: "Open the link in a new window",
    sharedTitle: "Shared links",
    viewerCta: "Merge your own links into one sharable link",
    shareMessage: "Share this link to let anyone see your list.",
    sharedHero: "Somebody shared some links with you",
    terms: "Terms",
    privacy: "Privacy",
    about: "About",
    emptyError: "Please add at least one link before converting.",
    invalidError: "These links are invalid:",
    copied: "Copied",
    charsLeft: (n) => `${n} characters left`,
    langButton: "UA",
  },
  uk: {
    metaTitle: "1 Link Me – Об’єднайте кілька посилань в одне (безкоштовно, без реєстрації)",
    metaDescription:
      "Об’єднайте до 8 посилань в одне зручне для поширення. Без реєстрації, без збереження даних, 100% безкоштовно. Ідеально для креаторів, маркетологів і щоденного використання.",
    heroTitle: "Обʼєднайте до 8 посилань в одне",
    heroLine1: "Вставте посилання, натисніть «Конвертувати» та поділіться одним URL.",
    heroLine2: "Працює завжди — без входу та без оплати.",
    heroLine3: "Увага: втрачені посилання відновити неможливо.",
    linksTitle: "Ваші посилання",
    addLink: "Додати ще посилання",
    commentLabel: "Коментар (необов’язково)",
    commentPlaceholder: "Додайте коротку нотатку (до 50 символів)",
    convert: "Конвертувати в одне посилання",
    helper: "Підтримуються лише http(s) посилання.",
    shareableTitle: "Ваше спільне посилання",
    copy: "Скопіювати",
    openLink: "Відкрити посилання у новому вікні",
    sharedTitle: "Спільні посилання",
    viewerCta: "Обʼєднайте свої посилання в одне",
    shareMessage: "Поділіться цим посиланням, щоб показати список.",
    sharedHero: "Хтось поділився з вами посиланнями",
    terms: "Умови",
    privacy: "Приватність",
    about: "Про нас",
    emptyError: "Додайте хоча б одне посилання перед конвертацією.",
    invalidError: "Некоректні посилання:",
    copied: "Скопійовано",
    charsLeft: (n) => `Залишилось ${n} символів`,
    langButton: "EN",
  },
};

let currentLang = localStorage.getItem("lang") || "en";

function applyTranslations(lang) {
  const dict = translations[lang];
  if (!dict) return;

  if (dict.metaTitle) {
    document.title = dict.metaTitle;
  }
  if (dict.metaDescription) {
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", dict.metaDescription);
  }

  const hash = window.location.hash.slice(1);
  if (heroMessage && !hash && heroMessageDefault) {
    heroMessage.innerHTML = heroMessageDefault;
  }

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (dict[key]) {
      el.setAttribute("placeholder", dict[key]);
    }
  });

  if (langToggle) {
    if (lang === "uk") {
      langToggle.classList.remove("ua");
      langToggle.classList.add("en");
      langToggle.innerHTML = '<span class="flag">🇺🇸</span><span class="lang-code">EN</span>';
    } else {
      langToggle.classList.remove("en");
      langToggle.classList.add("ua");
      langToggle.innerHTML = '<span class="flag">🇺🇦</span><span class="lang-code">UA</span>';
    }
  }

  if (commentCount) {
    const length = commentInput ? commentInput.value.length : 0;
    const remaining = Math.max(0, 50 - length);
    commentCount.textContent = dict.charsLeft(remaining);
  }

  if (heroMessage && hash) {
    heroMessage.textContent = dict.sharedHero;
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

// Lightweight LZ-based compression to keep share links as short as possible.
const LZString = (() => {
  const keyStrUriSafe = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$";
  function compressToEncodedURIComponent(input) {
    if (input == null) return "";
    return _compress(input, 6, (a) => keyStrUriSafe.charAt(a));
  }
  function decompressFromEncodedURIComponent(input) {
    if (input == null) return "";
    if (input === "") return null;
    input = input.replace(/ /g, "+");
    return _decompress(input.length, 32, (index) => getBaseValue(keyStrUriSafe, input.charAt(index)));
  }
  function getBaseValue(alphabet, character) {
    if (!baseReverseDic[alphabet]) {
      baseReverseDic[alphabet] = {};
      for (let i = 0; i < alphabet.length; i++) {
        baseReverseDic[alphabet][alphabet.charAt(i)] = i;
      }
    }
    return baseReverseDic[alphabet][character];
  }
  const baseReverseDic = {};
  function _compress(uncompressed, bitsPerChar, getCharFromInt) {
    if (uncompressed == null) return "";
    let i;
    let value;
    const context_dictionary = {};
    const context_dictionaryToCreate = {};
    let context_c = "";
    let context_wc = "";
    let context_w = "";
    let context_enlargeIn = 2;
    let context_dictSize = 3;
    let context_numBits = 2;
    const context_data = [];
    let context_data_val = 0;
    let context_data_position = 0;
    for (let ii = 0; ii < uncompressed.length; ii += 1) {
      context_c = uncompressed.charAt(ii);
      if (!Object.prototype.hasOwnProperty.call(context_dictionary, context_c)) {
        context_dictionary[context_c] = context_dictSize++;
        context_dictionaryToCreate[context_c] = true;
      }
      context_wc = context_w + context_c;
      if (Object.prototype.hasOwnProperty.call(context_dictionary, context_wc)) {
        context_w = context_wc;
      } else {
        if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
          if (context_w.charCodeAt(0) < 256) {
            for (i = 0; i < context_numBits; i++) {
              context_data_val = context_data_val << 1;
              if (context_data_position === bitsPerChar - 1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }
            }
            value = context_w.charCodeAt(0);
            for (i = 0; i < 8; i++) {
              context_data_val = (context_data_val << 1) | (value & 1);
              if (context_data_position === bitsPerChar - 1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }
              value = value >> 1;
            }
          } else {
            value = 1;
            for (i = 0; i < context_numBits; i++) {
              context_data_val = (context_data_val << 1) | value;
              if (context_data_position === bitsPerChar - 1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }
              value = 0;
            }
            value = context_w.charCodeAt(0);
            for (i = 0; i < 16; i++) {
              context_data_val = (context_data_val << 1) | (value & 1);
              if (context_data_position === bitsPerChar - 1) {
                context_data_position = 0;
                context_data.push(getCharFromInt(context_data_val));
                context_data_val = 0;
              } else {
                context_data_position++;
              }
              value = value >> 1;
            }
          }
          context_enlargeIn--;
          if (context_enlargeIn === 0) {
            context_enlargeIn = Math.pow(2, context_numBits);
            context_numBits++;
          }
          delete context_dictionaryToCreate[context_w];
        } else {
          value = context_dictionary[context_w];
          for (i = 0; i < context_numBits; i++) {
            context_data_val = (context_data_val << 1) | (value & 1);
            if (context_data_position === bitsPerChar - 1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = value >> 1;
          }
        }
        context_enlargeIn--;
        if (context_enlargeIn === 0) {
          context_enlargeIn = Math.pow(2, context_numBits);
          context_numBits++;
        }
        context_dictionary[context_wc] = context_dictSize++;
        context_w = String(context_c);
      }
    }
    if (context_w !== "") {
      if (Object.prototype.hasOwnProperty.call(context_dictionaryToCreate, context_w)) {
        if (context_w.charCodeAt(0) < 256) {
          for (i = 0; i < context_numBits; i++) {
            context_data_val = context_data_val << 1;
            if (context_data_position === bitsPerChar - 1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
          }
          value = context_w.charCodeAt(0);
          for (i = 0; i < 8; i++) {
            context_data_val = (context_data_val << 1) | (value & 1);
            if (context_data_position === bitsPerChar - 1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = value >> 1;
          }
        } else {
          value = 1;
          for (i = 0; i < context_numBits; i++) {
            context_data_val = (context_data_val << 1) | value;
            if (context_data_position === bitsPerChar - 1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = 0;
          }
          value = context_w.charCodeAt(0);
          for (i = 0; i < 16; i++) {
            context_data_val = (context_data_val << 1) | (value & 1);
            if (context_data_position === bitsPerChar - 1) {
              context_data_position = 0;
              context_data.push(getCharFromInt(context_data_val));
              context_data_val = 0;
            } else {
              context_data_position++;
            }
            value = value >> 1;
          }
        }
        context_enlargeIn--;
        if (context_enlargeIn === 0) {
          context_enlargeIn = Math.pow(2, context_numBits);
          context_numBits++;
        }
        delete context_dictionaryToCreate[context_w];
      } else {
        value = context_dictionary[context_w];
        for (i = 0; i < context_numBits; i++) {
          context_data_val = (context_data_val << 1) | (value & 1);
          if (context_data_position === bitsPerChar - 1) {
            context_data_position = 0;
            context_data.push(getCharFromInt(context_data_val));
            context_data_val = 0;
          } else {
            context_data_position++;
          }
          value = value >> 1;
        }
      }
      context_enlargeIn--;
      if (context_enlargeIn === 0) {
        context_enlargeIn = Math.pow(2, context_numBits);
        context_numBits++;
      }
    }
    value = 2;
    for (i = 0; i < context_numBits; i++) {
      context_data_val = (context_data_val << 1) | (value & 1);
      if (context_data_position === bitsPerChar - 1) {
        context_data_position = 0;
        context_data.push(getCharFromInt(context_data_val));
        context_data_val = 0;
      } else {
        context_data_position++;
      }
      value = value >> 1;
    }
    while (true) {
      context_data_val = context_data_val << 1;
      if (context_data_position === bitsPerChar - 1) {
        context_data.push(getCharFromInt(context_data_val));
        break;
      } else {
        context_data_position++;
      }
    }
    return context_data.join("");
  }
  function _decompress(length, resetValue, getNextValue) {
    const dictionary = [];
    let next;
    let enlargeIn = 4;
    let dictSize = 4;
    let numBits = 3;
    let entry = "";
    const result = [];
    let i;
    let w;
    let bits, resb, maxpower, power;
    const data = { val: getNextValue(0), position: resetValue, index: 1 };
    for (i = 0; i < 3; i += 1) {
      dictionary[i] = i;
    }
    bits = 0;
    maxpower = Math.pow(2, 2);
    power = 1;
    while (power !== maxpower) {
      resb = data.val & data.position;
      data.position >>= 1;
      if (data.position === 0) {
        data.position = resetValue;
        data.val = getNextValue(data.index++);
      }
      bits |= (resb > 0 ? 1 : 0) * power;
      power <<= 1;
    }
    switch (next = bits) {
      case 0:
        bits = 0;
        maxpower = Math.pow(2, 8);
        power = 1;
        while (power !== maxpower) {
          resb = data.val & data.position;
          data.position >>= 1;
          if (data.position === 0) {
            data.position = resetValue;
            data.val = getNextValue(data.index++);
          }
          bits |= (resb > 0 ? 1 : 0) * power;
          power <<= 1;
        }
        next = String.fromCharCode(bits);
        break;
      case 1:
        bits = 0;
        maxpower = Math.pow(2, 16);
        power = 1;
        while (power !== maxpower) {
          resb = data.val & data.position;
          data.position >>= 1;
          if (data.position === 0) {
            data.position = resetValue;
            data.val = getNextValue(data.index++);
          }
          bits |= (resb > 0 ? 1 : 0) * power;
          power <<= 1;
        }
        next = String.fromCharCode(bits);
        break;
      case 2:
        return "";
    }
    dictionary[3] = next;
    w = next;
    result.push(next);
    while (true) {
      if (data.index > length) {
        return "";
      }
      bits = 0;
      maxpower = Math.pow(2, numBits);
      power = 1;
      while (power !== maxpower) {
        resb = data.val & data.position;
        data.position >>= 1;
        if (data.position === 0) {
          data.position = resetValue;
          data.val = getNextValue(data.index++);
        }
        bits |= (resb > 0 ? 1 : 0) * power;
        power <<= 1;
      }
      switch (next = bits) {
        case 0:
          bits = 0;
          maxpower = Math.pow(2, 8);
          power = 1;
          while (power !== maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position === 0) {
              data.position = resetValue;
              data.val = getNextValue(data.index++);
            }
            bits |= (resb > 0 ? 1 : 0) * power;
            power <<= 1;
          }
          dictionary[dictSize++] = String.fromCharCode(bits);
          next = dictSize - 1;
          enlargeIn--;
          break;
        case 1:
          bits = 0;
          maxpower = Math.pow(2, 16);
          power = 1;
          while (power !== maxpower) {
            resb = data.val & data.position;
            data.position >>= 1;
            if (data.position === 0) {
              data.position = resetValue;
              data.val = getNextValue(data.index++);
            }
            bits |= (resb > 0 ? 1 : 0) * power;
            power <<= 1;
          }
          dictionary[dictSize++] = String.fromCharCode(bits);
          next = dictSize - 1;
          enlargeIn--;
          break;
        case 2:
          return result.join("");
      }
      if (enlargeIn === 0) {
        enlargeIn = Math.pow(2, numBits);
        numBits++;
      }
      if (dictionary[next]) {
        entry = dictionary[next];
      } else {
        if (next === dictSize) {
          entry = w + w.charAt(0);
        } else {
          return null;
        }
      }
      result.push(entry);
      dictionary[dictSize++] = w + entry.charAt(0);
      enlargeIn--;
      w = entry;
      if (enlargeIn === 0) {
        enlargeIn = Math.pow(2, numBits);
        numBits++;
      }
    }
  }
  return { compressToEncodedURIComponent, decompressFromEncodedURIComponent };
})();

function updateLimit() {
  const count = linksContainer.querySelectorAll(".link-row").length;
  limitLabel.textContent = `${count} / ${MAX_LINKS}`;
  addButton.disabled = count >= MAX_LINKS;
}

function createRow(value = "") {
  const row = document.createElement("div");
  row.className = "link-row";

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "https://example.com";
  input.value = value;

  const remove = document.createElement("button");
  remove.type = "button";
  remove.className = "btn ghost";
  remove.textContent = "Remove";
  remove.addEventListener("click", () => {
    row.remove();
    if (linksContainer.children.length === 0) {
      linksContainer.appendChild(createRow());
    }
    updateLimit();
  });

  row.appendChild(input);
  row.appendChild(remove);
  return row;
}

function isValidLink(link) {
  try {
    const url = new URL(link);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (error) {
    return false;
  }
}

function gatherLinks() {
  const inputs = linksContainer.querySelectorAll("input");
  const links = [];
  inputs.forEach((input) => {
    const value = input.value.trim();
    if (value.length > 0) {
      links.push(value);
    }
  });
  return links;
}

function showResult(link, message) {
  resultSection.classList.remove("hidden");
  outputField.value = link;
  resultMessage.textContent = message;
  if (openLink) openLink.href = link || "#";
}

function trackAdsConversion() {
  if (typeof window.gtag !== "function") {
    return;
  }

  window.gtag("event", "conversion", {
    send_to: ADS_CONVERSION_ID,
  });
}

function showViewer(links, comment) {
  sharedList.innerHTML = "";
  const existing = viewerSection.querySelector(".shared-comment");
  if (existing) existing.remove();
  if (comment && comment.trim().length > 0) {
    const note = document.createElement("p");
    note.className = "shared-comment";
    note.textContent = comment.trim();
    sharedList.parentElement.insertBefore(note, sharedList);
  }
  links.forEach((link) => {
    const item = document.createElement("li");
    const anchor = document.createElement("a");
    anchor.href = link;
    anchor.textContent = link;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    item.appendChild(anchor);
    sharedList.appendChild(item);
  });
  viewerSection.classList.remove("hidden");
}

function resetBuilder() {
  linksContainer.innerHTML = "";
  linksContainer.appendChild(createRow());
  if (commentInput) commentInput.value = "";
  if (commentCount) {
    const dict = translations[currentLang] || translations.en;
    commentCount.textContent = dict.charsLeft(50);
  }
  updateLimit();
}

addButton.addEventListener("click", () => {
  if (linksContainer.children.length >= MAX_LINKS) {
    return;
  }
  linksContainer.appendChild(createRow());
  updateLimit();
});

if (commentInput && commentCount) {
  commentInput.addEventListener("input", () => {
    const length = commentInput.value.length;
    const remaining = Math.max(0, 50 - length);
    const dict = translations[currentLang] || translations.en;
    commentCount.textContent = dict.charsLeft(remaining);
  });
}

convertButton.addEventListener("click", () => {
  const links = gatherLinks();
  const comment = commentInput ? commentInput.value.trim().slice(0, 50) : "";
  resultMessage.textContent = "";
  const dict = translations[currentLang] || translations.en;

  if (links.length === 0) {
    showResult("", dict.emptyError);
    outputField.value = "";
    return;
  }

  const invalid = links.filter((link) => !isValidLink(link));
  if (invalid.length > 0) {
    showResult("", `${dict.invalidError} ${invalid.join(", ")}`);
    outputField.value = "";
    return;
  }

  const payload = JSON.stringify({ links, comment });
  const encoded = LZString.compressToEncodedURIComponent(payload);
  const shareable = `${window.location.origin}${window.location.pathname}#${encoded}`;

  showResult(shareable, dict.shareMessage);
  trackAdsConversion();
  history.replaceState(null, "", `#${encoded}`);
});

copyButton.addEventListener("click", async () => {
  if (!outputField.value) {
    return;
  }

  try {
    await navigator.clipboard.writeText(outputField.value);
    const dict = translations[currentLang] || translations.en;
    copyButton.textContent = dict.copied;
    setTimeout(() => {
      copyButton.textContent = dict.copy;
    }, 1600);
  } catch (error) {
    outputField.select();
    document.execCommand("copy");
  }
});

function initFromHash() {
  resetBuilder();
  const hash = window.location.hash.slice(1);
  if (!hash) {
    if (heroMessage && heroMessageDefault) {
      heroMessage.innerHTML = heroMessageDefault;
    }
    return;
  }
  try {
    const decoded = JSON.parse(LZString.decompressFromEncodedURIComponent(hash));
    if (!decoded.links || !Array.isArray(decoded.links)) {
      return;
    }
    showViewer(decoded.links, decoded.comment);
    document.getElementById("builder").classList.add("hidden");
    resultSection.classList.add("hidden");
    if (viewerCtaSection) viewerCtaSection.classList.remove("hidden");
    if (heroMessage) {
      const dict = translations[currentLang] || translations.en;
      heroMessage.textContent = dict.sharedHero;
    }
  } catch (error) {
    // If the hash is invalid, ignore it.
  }
}

initFromHash();
