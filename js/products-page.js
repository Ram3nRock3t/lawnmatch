// products-page.js

// ─── FILTER STATE ─────────────────────────────────────────────────────────────

const activeFilters = { type: "all", form: "all", cat: "all" };

// ─── INIT ─────────────────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", function() {
  renderProductsPage();
  initProductFilters();
  document.getElementById("products-reset-btn").addEventListener("click", resetProductFilters);
});

// ─── RENDER ALL PRODUCT CARDS ────────────────────────────────────────────────

function renderProductsPage() {
  const container = document.getElementById("products-list");

  const sorted = PRODUCTS.slice().sort(function(a, b) {
    return a.fullName.localeCompare(b.fullName);
  });

  sorted.forEach(function(p) {
    const div = document.createElement("div");
    div.innerHTML = buildProductInfoCard(p);
    container.appendChild(div.firstElementChild);
  });
}

// ─── BUILD A SINGLE PRODUCT CARD ─────────────────────────────────────────────

function buildProductInfoCard(p) {
  var html = '<div class="product-info-card" data-product-id="' + p.id + '" data-type="' + p.type + '" data-form="' + p.formulation + '" data-category="' + (p.category || "") + '">';

  // Header: name + badges
  html += '<div class="pic-header">';
  html += '<h2>' + p.fullName + '</h2>';
  html += '<div class="pic-badges">';
  html += '<span class="badge badge-type">' + capitalize(p.type) + '</span>';
  html += '<span class="badge badge-form">' + capitalize(p.formulation) + '</span>';
  if (p.category) {
    html += '<span class="badge badge-category">' + capitalize(p.category) + '</span>';
  }
  html += '</div></div>';

  // Key facts
  html += '<p class="pic-meta"><strong>Active Ingredients:</strong> ' + p.activeIngredients.join(", ") + '</p>';
  html += '<p class="pic-meta"><strong>EPA Toxicity Level:</strong> ' + p.EPAtoxicityLevel + '</p>';
  html += '<p class="pic-meta"><strong>Re-entry Interval:</strong> ' + p.reentryInterval + '</p>';
  html += '<p class="pic-meta"><strong>Container Sizes:</strong> ' + p.containerSizes.map(function(s) { return s.label; }).join(", ") + '</p>';

  // Safe turf types
  if (p.turfTypes && p.turfTypes.length > 0) {
    html += '<p class="pic-meta"><strong>Safe Turf Types:</strong></p>';
    html += '<div class="turf-pill-row">';
    p.turfTypes.forEach(function(t) {
      html += '<span class="turf-pill turf-pill-safe">' + t + '</span>';
    });
    html += '</div>';
  }

  // Unsafe / caution turf
  if (p.notSafeTurf && p.notSafeTurf.length > 0) {
    html += '<p class="pic-meta"><strong>Not Safe For / Cautions:</strong></p>';
    html += '<div class="turf-pill-row">';
    p.notSafeTurf.forEach(function(t) {
      html += '<span class="turf-pill turf-pill-unsafe">' + t + '</span>';
    });
    html += '</div>';
  }

  // Collapsible sections
  if (p.applicationNotes && p.applicationNotes.length > 0) {
    html += buildDetails("Application Notes", p.applicationNotes.map(function(n) { return n; }));
  }

  if (p.restrictions && p.restrictions.length > 0) {
    html += buildDetails("Restrictions", p.restrictions);
  }

  if (p.targetWeeds && p.targetWeeds.length > 0) {
    var weedItems = p.targetWeeds.map(function(w) {
      var name = typeof w === "string" ? w : w.name;
      var rate = (typeof w === "object" && w.rateRequired)
        ? ' <span class="weed-rate-tag">— ' + w.rateRequired + ' rate</span>'
        : "";
      return name + rate;
    });
    html += buildDetails("Target Weeds (" + p.targetWeeds.length + ")", weedItems, true);
  }

  if (p.genericAlternatives && p.genericAlternatives.length > 0) {
    var altItems = p.genericAlternatives.map(function(g) {
      return '<strong>' + g.fullName + '</strong> — ' + g.activeIngredient + '. ' + g.note;
    });
    html += buildDetails("Generic Alternatives (" + p.genericAlternatives.length + ")", altItems, true);
  }

  html += '<a href="' + p.labelUrl + '" target="_blank" class="label-link-btn">View Full Product Label ↗</a>';
  html += '</div>';
  return html;
}

function buildDetails(summary, items, rawHTML) {
  let html = `<details><summary>${summary}</summary><ul>`;
  items.forEach(function(item) {
    html += rawHTML ? `<li>${item}</li>` : `<li>${escapeHTML(item)}</li>`;
  });
  html += `</ul></details>`;
  return html;
}

function escapeHTML(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ─── FILTER LOGIC ─────────────────────────────────────────────────────────────

function initProductFilters() {
  document.getElementById("product-name-search").addEventListener("input", filterProductCards);

  buildFilterGroup("category-filter-btn-row", "cat",
    Array.from(new Set(PRODUCTS.map(function(p) { return p.category || ""; }).filter(Boolean))).sort()
  );

  buildFilterGroup("type-filter-btn-row", "type",
    Array.from(new Set(PRODUCTS.map(function(p) { return p.type || ""; }).filter(Boolean))).sort()
  );

  buildFilterGroup("form-filter-btn-row", "form",
    Array.from(new Set(PRODUCTS.map(function(p) { return p.formulation || ""; }).filter(Boolean))).sort()
  );

  // Wire all filter buttons after all groups are built
  document.querySelectorAll(".filter-btn").forEach(function(btn) {
    btn.addEventListener("click", function() {
      var key = btn.dataset.filter;
      activeFilters[key] = btn.dataset.value;
      document.querySelectorAll('.filter-btn[data-filter="' + key + '"]').forEach(function(b) {
        b.classList.toggle("active", b.dataset.value === activeFilters[key]);
      });
      filterProductCards();
    });
  });
}

function buildFilterGroup(rowId, filterKey, values) {
  var row = document.getElementById(rowId);
  if (!row) return;

  var allBtn = document.createElement("button");
  allBtn.className = "filter-btn active";
  allBtn.dataset.filter = filterKey;
  allBtn.dataset.value = "all";
  allBtn.textContent = "All";
  row.appendChild(allBtn);

  values.forEach(function(val) {
    var btn = document.createElement("button");
    btn.className = "filter-btn";
    btn.dataset.filter = filterKey;
    btn.dataset.value = val;
    btn.textContent = val.charAt(0).toUpperCase() + val.slice(1);
    row.appendChild(btn);
  });
}

  // Wire all filter buttons (static type/form + dynamically built category)
  document.querySelectorAll(".filter-btn").forEach(function(btn) {
    btn.addEventListener("click", function() {
      var key = btn.dataset.filter;
      activeFilters[key] = btn.dataset.value;
      document.querySelectorAll('.filter-btn[data-filter="' + key + '"]').forEach(function(b) {
        b.classList.toggle("active", b.dataset.value === activeFilters[key]);
      });
      filterProductCards();
    });
  });

function filterProductCards() {
  const query = document.getElementById("product-name-search").value.toLowerCase().trim();
  const cards  = document.querySelectorAll(".product-info-card");
  let anyVisible = false;

  cards.forEach(function(card) {
    const product = PRODUCTS.find(function(p) { return p.id === card.dataset.productId; });
    if (!product) return;

    const searchText = [product.fullName, ...product.activeIngredients].join(" ").toLowerCase();
    const nameMatch  = !query || searchText.includes(query);
    const typeMatch  = activeFilters.type === "all" || card.dataset.type === activeFilters.type;
    const formMatch  = activeFilters.form === "all" || card.dataset.form === activeFilters.form;
    const catMatch   = activeFilters.cat  === "all" || card.dataset.category === activeFilters.cat;

    const visible    = nameMatch && typeMatch && formMatch;

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

  document.querySelectorAll(".filter-btn").forEach(function(btn) {
    btn.classList.toggle("active", btn.dataset.value === "all");
  });

  filterProductCards();
}