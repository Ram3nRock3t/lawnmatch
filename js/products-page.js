// products-page.js

// ─── FILTER STATE ─────────────────────────────────────────────────────────────
const activeFilters = { type: "all", form: "all", cat: "all" };

// ─── INIT ─────────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", function () {
  renderProductsPage();
  initProductFilters();
  document.getElementById("products-reset-btn").addEventListener("click", resetProductFilters);
});

// ─── RENDER ALL PRODUCT CARDS ─────────────────────────────────────────────────
function renderProductsPage() {
  const container = document.getElementById("products-list");
  const sorted = PRODUCTS.slice().sort(function (a, b) {
    return a.fullName.localeCompare(b.fullName);
  });
  sorted.forEach(function (p) {
    const div = document.createElement("div");
    div.innerHTML = buildProductInfoCard(p);
    container.appendChild(div.firstElementChild);
  });
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────

// Returns type always as an array, whether product.type is a string or array
function getTypes(product) {
  if (Array.isArray(product.type)) return product.type;
  if (typeof product.type === "string" && product.type) return [product.type];
  return [];
}

function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function categoryLabel(cat) {
  var labels = {
    "herbicide":              "Herbicide",
    "insecticide":            "Insecticide",
    "fungicide":              "Fungicide",
    "fertilizer":             "Fertilizer",
    "plant-growth-regulator": "Plant Growth Regulator"
  };
  return labels[cat] || capitalize(cat);
}

function escapeHTML(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function buildDetails(summary, items, rawHTML) {
  let html = `<details><summary>${summary}</summary><ul>`;
  items.forEach(function (item) {
    html += rawHTML ? `<li>${item}</li>` : `<li>${escapeHTML(item)}</li>`;
  });
  html += `</ul></details>`;
  return html;
}

// Looks up commonName from weeds and diseases by ID.
// Falls back to the raw ID string if somehow not found.
function getWeedCommonName(id) {
  var found = WEEDS.find(function(w) { return w.id === id; });
  return found ? found.commonName : id;
}

function getDiseaseCommonName(id) {
  var found = DISEASES.find(function(d) { return d.id === id; });
  return found ? found.commonName : id;
}

// ─── BUILD A SINGLE PRODUCT CARD ──────────────────────────────────────────────
function buildProductInfoCard(p) {
  var types = getTypes(p);

  var html = '<div class="product-info-card"'
    + ' data-product-id="' + p.id + '"'
    + ' data-type=\'' + JSON.stringify(types) + '\''
    + ' data-form="' + p.formulation + '"'
    + ' data-category="' + (p.category || "") + '">';

  // Header: name + badges
  html += '<div class="pic-header">';
  html += '<h2>' + p.fullName + '</h2>';
  html += '<div class="pic-badges">';

  types.forEach(function (t) {
    html += '<span class="badge badge-type">' + capitalize(t) + '</span>';
  });

  html += '<span class="badge badge-form">' + capitalize(p.formulation) + '</span>';
  if (p.category) {
    html += '<span class="badge badge-category">' + categoryLabel(p.category) + '</span>';
  }
  html += '</div></div>';

  // Key facts
  html += '<p class="pic-meta"><strong>Active Ingredients:</strong> ' + p.activeIngredients.join(", ") + '</p>';
  html += '<p class="pic-meta"><strong>EPA Toxicity Level:</strong> ' + p.EPAtoxicityLevel + '</p>';
  html += '<p class="pic-meta"><strong>Re-entry Interval:</strong> ' + p.reentryInterval + '</p>';
  html += '<p class="pic-meta"><strong>Container Sizes:</strong> ' + p.containerSizes.map(function (s) { return s.label; }).join(", ") + '</p>';

  // Safe turf types
  if (p.turfTypes && p.turfTypes.length > 0) {
    html += '<p class="pic-meta"><strong>Safe Turf Types:</strong></p>';
    html += '<div class="turf-pill-row">';
    p.turfTypes.forEach(function (t) {
      html += '<span class="turf-pill turf-pill-safe">' + t + '</span>';
    });
    html += '</div>';
  }

  // Unsafe / caution turf
  if (p.notSafeTurf && p.notSafeTurf.length > 0) {
    html += '<p class="pic-meta"><strong>Not Safe For / Cautions:</strong></p>';
    html += '<div class="turf-pill-row">';
    p.notSafeTurf.forEach(function (t) {
      html += '<span class="turf-pill turf-pill-unsafe">' + t + '</span>';
    });
    html += '</div>';
  }

  // Collapsible sections
  if (p.applicationNotes && p.applicationNotes.length > 0) {
    html += buildDetails("Application Notes", p.applicationNotes.map(function (n) { return n; }));
  }
  if (p.restrictions && p.restrictions.length > 0) {
    html += buildDetails("Restrictions", p.restrictions);
  }
  if (p.targetWeeds && p.targetWeeds.length > 0) {
    if (isMultiType(p)) {
      html += '<p class="pic-multi-type-note">ⓘ ' + MULTI_TYPE_DISCLAIMER + '</p>';
    }
    var weedItems = p.targetWeeds.map(function (w) {
      var displayName = escapeHTML(
        w.label || (Array.isArray(w.ids) ? w.ids.map(getWeedCommonName).join(" / ") : "")
      );
      var rate = w.rateRequired
        ? ' <span class="weed-rate-tag">— ' + w.rateRequired + ' rate</span>'
        : "";
      return displayName + rate;
    });
    html += buildDetails("Target Weeds (" + p.targetWeeds.length + ")", weedItems, true);
  }
  if (p.targetDiseases && p.targetDiseases.length > 0) {
    var diseaseItems = p.targetDiseases.map(function (d) {
      var displayName = escapeHTML(
        d.label || (Array.isArray(d.ids) ? d.ids.map(getDiseaseCommonName).join(" / ") : "")
      );
      var rate = d.rateRequired
        ? ' <span class="weed-rate-tag">— ' + d.rateRequired + ' rate</span>'
        : "";
      return displayName + rate;
    });
    html += buildDetails("Target Diseases (" + p.targetDiseases.length + ")", diseaseItems, true);
  }
  if (p.genericAlternatives && p.genericAlternatives.length > 0) {
    var altItems = p.genericAlternatives.map(function (g) {
      return '<strong>' + g.fullName + '</strong> — ' + g.activeIngredient + '. ' + g.note;
    });
    html += buildDetails("Generic Alternatives (" + p.genericAlternatives.length + ")", altItems, true);
  }

  html += '<a href="' + p.labelUrl + '" target="_blank" class="label-link-btn">View Full Product Label ↗</a>';
  html += '</div>';
  return html;
}

// ─── FILTER LOGIC ─────────────────────────────────────────────────────────────
function initProductFilters() {
  document.getElementById("product-name-search").addEventListener("input", filterProductCards);

  buildFilterGroup("category-filter-btn-row", "cat",
    Array.from(new Set(
      PRODUCTS.map(function (p) { return p.category || ""; }).filter(Boolean)
    )).sort(),
    categoryLabel
  );

  buildFilterGroup("type-filter-btn-row", "type",
    Array.from(
      PRODUCTS.reduce(function (set, p) {
        getTypes(p).forEach(function (t) { if (t) set.add(t); });
        return set;
      }, new Set())
    ).sort()
  );

  buildFilterGroup("form-filter-btn-row", "form",
    Array.from(new Set(
      PRODUCTS.map(function (p) { return p.formulation || ""; }).filter(Boolean)
    )).sort()
  );

  document.querySelectorAll(".filter-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var key = btn.dataset.filter;
      activeFilters[key] = btn.dataset.value;
      document.querySelectorAll('.filter-btn[data-filter="' + key + '"]').forEach(function (b) {
        b.classList.toggle("active", b.dataset.value === activeFilters[key]);
      });
      filterProductCards();
    });
  });
}

function buildFilterGroup(rowId, filterKey, values, labelFn) {
  var row = document.getElementById(rowId);
  if (!row) return;
  var allBtn = document.createElement("button");
  allBtn.className = "filter-btn active";
  allBtn.dataset.filter = filterKey;
  allBtn.dataset.value = "all";
  allBtn.textContent = "All";
  row.appendChild(allBtn);
  values.forEach(function (val) {
    var btn = document.createElement("button");
    btn.className = "filter-btn";
    btn.dataset.filter = filterKey;
    btn.dataset.value = val;
    btn.textContent = labelFn ? labelFn(val) : (val.charAt(0).toUpperCase() + val.slice(1));
    row.appendChild(btn);
  });
}

function filterProductCards() {
  const query = document.getElementById("product-name-search").value.toLowerCase().trim();
  const cards = document.querySelectorAll(".product-info-card");
  let anyVisible = false;

  cards.forEach(function (card) {
    const product = PRODUCTS.find(function (p) { return p.id === card.dataset.productId; });
    if (!product) return;

    const searchText = [product.fullName, ...product.activeIngredients].join(" ").toLowerCase();
    const nameMatch = !query || searchText.includes(query);

    var cardTypes = [];
    try { cardTypes = JSON.parse(card.dataset.type); } catch (e) { cardTypes = []; }
    const typeMatch = activeFilters.type === "all" || cardTypes.includes(activeFilters.type);

    const formMatch = activeFilters.form === "all" || card.dataset.form === activeFilters.form;
    const catMatch  = activeFilters.cat  === "all" || card.dataset.category === activeFilters.cat;

    const visible = nameMatch && typeMatch && formMatch && catMatch;
    card.classList.toggle("hidden", !visible);
    if (visible) anyVisible = true;
  });

  const noResults = document.getElementById("products-no-results");
  if (noResults) noResults.classList.toggle("hidden", anyVisible);
}

// ─── RESET FILTERS ────────────────────────────────────────────────────────────
function resetProductFilters() {
  document.getElementById("product-name-search").value = "";
  activeFilters.type = "all";
  activeFilters.form = "all";
  activeFilters.cat  = "all";
  document.querySelectorAll(".filter-btn").forEach(function (btn) {
    btn.classList.toggle("active", btn.dataset.value === "all");
  });
  filterProductCards();
}