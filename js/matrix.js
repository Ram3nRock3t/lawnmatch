// matrix.js

// ─── POPULATE TURF DROPDOWN ───────────────────────────────────────────────────

function populateMatrixTurfTypes() {
  const allTurfs = new Set();
  PRODUCTS.forEach(function(p) {
    p.turfTypes.forEach(function(t) { allTurfs.add(t); });
  });

  const wrapper = document.querySelector('[data-hidden-input="matrix-turf-type"]');
  initCustomSelect(wrapper, Array.from(allTurfs).sort());
}

// ─── CHECK TURF SAFETY STATUS ─────────────────────────────────────────────────

function getTurfSafetyStatus(product, turfType) {
  if (product.turfTypes.includes(turfType)) return "safe";
  if (product.notSafeTurf.some(function(entry) {
    // notSafeTurf entries sometimes include extra notes in parentheses,
    // e.g. "Dichondra (do not apply where desirable)" — match on the turf name itself
    return entry.toLowerCase().indexOf(turfType.toLowerCase()) === 0;
  })) return "unsafe";
  return "unknown";
}

// ─── POPULATE WEED CHECKBOXES ─────────────────────────────────────────────────

function populateMatrixWeeds() {
  const container = document.getElementById("matrix-weed-checkboxes");
  const allWeeds = new Set();

  PRODUCTS.forEach(function(p) {
    p.targetWeeds.forEach(function(w) {
      // targetWeeds is either an array of strings, or an array of objects with .name
      const weedName = typeof w === "string" ? w : w.name;
      allWeeds.add(weedName);
    });
  });

  Array.from(allWeeds).sort().forEach(function(w) {
    const label = document.createElement("label");
    label.className = "weed-label";
    label.dataset.weedName = w.toLowerCase();

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = w;
    checkbox.className = "matrix-weed-checkbox";

    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(" " + w));
    container.appendChild(label);
  });
}

// ─── FILTER WEED CHECKBOXES BY SEARCH TEXT ────────────────────────────────────

function filterWeedCheckboxes() {
  const query = document.getElementById("weed-search").value.toLowerCase().trim();
  document.querySelectorAll(".weed-label").forEach(function(label) {
    label.classList.toggle("hidden", !label.dataset.weedName.includes(query));
  });
}

// ─── CHECK WEED COVERAGE ───────────────────────────────────────────────────────

function getWeedCoverage(product, selectedWeeds) {
  const covered = [];
  const notCovered = [];

  selectedWeeds.forEach(function(weedName) {
    const match = product.targetWeeds.find(function(w) {
      const name = typeof w === "string" ? w : w.name;
      return name === weedName;
    });

    if (!match) {
      notCovered.push(weedName);
    } else {
      const rateRequired = typeof match === "string" ? null : match.rateRequired;
      covered.push({ weedName: weedName, rateRequired: rateRequired });
    }
  });

  return { covered: covered, notCovered: notCovered };
}

// ─── SHARED RESULT BUILDER (table or cards) ────────────────────────────────────

function buildProductWeedTable(turfType, products, weeds, viewMode) {
  if (viewMode === "cards") {
    return buildProductWeedCards(turfType, products, weeds);
  }
  return buildProductWeedTableHTML(turfType, products, weeds);
}

// ─── TABLE VIEW ─────────────────────────────────────────────────────────────────

function buildProductWeedTableHTML(turfType, products, weeds) {
  const turfSafety = {};
  products.forEach(function(product) {
    turfSafety[product.id] = getTurfSafetyStatus(product, turfType);
  });

  let html = `<table id="matrix-table"><thead><tr><th>Weed</th>`;
  products.forEach(function(product) {
    const safety = turfSafety[product.id];
    let safetyTag = "";
    if (safety === "unsafe")  safetyTag = `<br><span class="matrix-unsafe-tag">NOT SAFE for ${turfType}</span>`;
    if (safety === "unknown") safetyTag = `<br><span class="matrix-unknown-tag">Not listed for ${turfType}</span>`;
    html += `<th>${product.fullName}${safetyTag}</th>`;
  });
  html += `</tr></thead><tbody>`;

  weeds.forEach(function(weedName) {
    html += `<tr><td><div class="weed-cell-content">${weedName}</div></td>`;

    products.forEach(function(product) {
      const match = product.targetWeeds.find(function(w) {
        const name = typeof w === "string" ? w : w.name;
        return name === weedName;
      });

      let cellContent = "";
      if (match) {
        const rateRequired = typeof match === "string" ? null : match.rateRequired;
        cellContent = `<span class="matrix-yes">✓</span>${rateRequired ? " (" + rateRequired + ")" : ""}`;
      }

      let cellClass = "matrix-cell";
      const safety = turfSafety[product.id];
      if (safety === "unsafe")  cellClass += " matrix-cell-unsafe";
      if (safety === "unknown") cellClass += " matrix-cell-unknown";

      html += `<td class="${cellClass}">${cellContent}</td>`;
    });

    html += `</tr>`;
  });

  html += `</tbody></table>`;
  return `<div class="table-scroll-wrapper">${html}</div>`;
}

// ─── CARD VIEW ──────────────────────────────────────────────────────────────────

function buildProductWeedCards(turfType, products, weeds) {
  let html = "";

  products.forEach(function(product) {
    const safety = getTurfSafetyStatus(product, turfType);

    let safetyTag = "";
    if (safety === "unsafe")  safetyTag = `<p><span class="matrix-unsafe-tag" style="display:inline;">⚠️ NOT SAFE for ${turfType}</span></p>`;
    if (safety === "unknown") safetyTag = `<p><span class="matrix-unknown-tag" style="display:inline;">❓ Not listed for ${turfType}</span></p>`;

    const coveredWeeds = weeds.filter(function(weedName) {
      return product.targetWeeds.some(function(w) {
        const name = typeof w === "string" ? w : w.name;
        return name === weedName;
      });
    });

    let cardClass = "product-card";
    if (safety === "unsafe")  cardClass += " product-card-unsafe";
    if (safety === "unknown") cardClass += " product-card-unknown";

    html += `<div class="${cardClass}">`;
    html += `<h4>${product.fullName}</h4>`;
    html += safetyTag;

    if (coveredWeeds.length > 0) {
      html += `<ul>`;
      coveredWeeds.forEach(function(weedName) {
        const match = product.targetWeeds.find(function(w) {
          const name = typeof w === "string" ? w : w.name;
          return name === weedName;
        });
        const rateRequired = typeof match === "object" ? match.rateRequired : null;
        html += `<li>${weedName}${rateRequired ? " — rate: " + rateRequired : ""}</li>`;
      });
      html += `</ul>`;
    } else {
      html += `<p style="color: var(--color-text-muted);">No matching weeds from your selection.</p>`;
    }

    html += `</div>`;
  });

  return html;
}

// ─── VIEW MODE STATE ────────────────────────────────────────────────────────────

let matrixViewMode = "table";
let reverseViewMode = "table";

function setMatrixView(mode) {
  matrixViewMode = mode;
  document.querySelectorAll("#matrix-section .view-btn").forEach(function(btn) {
    btn.classList.toggle("active", btn.dataset.view === mode);
  });
  renderMatrix();
}

function setReverseView(mode) {
  reverseViewMode = mode;
  document.querySelectorAll("#reverse-section .view-btn").forEach(function(btn) {
    btn.classList.toggle("active", btn.dataset.view === mode);
  });
  renderReverseMatrix();
}

// ─── FORWARD MATRIX: select weeds → see matching products ──────────────────────

function renderMatrix() {
  const turfType = document.getElementById("matrix-turf-type").value;
  const selectedWeeds = Array.from(document.querySelectorAll(".matrix-weed-checkbox:checked"))
    .map(function(cb) { return cb.value; });

  const resultsDiv = document.getElementById("matrix-results");

  if (!turfType) {
    resultsDiv.innerHTML = "<p>Please select a turf type.</p>";
    return;
  }
  if (selectedWeeds.length === 0) {
    resultsDiv.innerHTML = "<p>Please select at least one weed.</p>";
    return;
  }

  let relevantProducts = PRODUCTS.filter(function(product) {
    if (getTurfSafetyStatus(product, turfType) === "unsafe") return false;
    return selectedWeeds.some(function(weedName) {
      return product.targetWeeds.some(function(w) {
        const name = typeof w === "string" ? w : w.name;
        return name === weedName;
      });
    });
  });

  if (relevantProducts.length === 0) {
    resultsDiv.innerHTML = "<p>No safe, matching products found for this turf and weed selection.</p>";
    return;
  }

  const coverageCount = {};
  relevantProducts.forEach(function(product) {
    coverageCount[product.id] = selectedWeeds.filter(function(weedName) {
      return product.targetWeeds.some(function(w) {
        const name = typeof w === "string" ? w : w.name;
        return name === weedName;
      });
    }).length;
  });

  relevantProducts.sort(function(a, b) {
    const diff = coverageCount[b.id] - coverageCount[a.id];
    if (diff !== 0) return diff;
    return a.fullName.localeCompare(b.fullName);
  });

  document.querySelector('#matrix-section .view-toggle').classList.add("visible");
  resultsDiv.innerHTML = buildProductWeedTable(turfType, relevantProducts, selectedWeeds, matrixViewMode);
}

// ─── REVERSE MATRIX: select products → see weeds covered ───────────────────────

function renderReverseMatrix() {
  const turfType = document.getElementById("reverse-turf-type").value;
  const selectedProductIds = Array.from(document.querySelectorAll(".reverse-product-checkbox:checked"))
    .map(function(cb) { return cb.value; });

  const resultsDiv = document.getElementById("reverse-results");

  if (!turfType) {
    resultsDiv.innerHTML = "<p>Please select a turf type.</p>";
    return;
  }
  if (selectedProductIds.length === 0) {
    resultsDiv.innerHTML = "<p>Please select at least one product.</p>";
    return;
  }

  const selectedProducts = PRODUCTS.filter(function(p) {
    return selectedProductIds.includes(p.id);
  });

  // Flags unsafe products
  const relevantProducts = selectedProducts;

  // Build the weed list as the union of every weed targeted by the relevant products
  const weedSet = new Set();
  relevantProducts.forEach(function(product) {
    product.targetWeeds.forEach(function(w) {
      const name = typeof w === "string" ? w : w.name;
      weedSet.add(name);
    });
  });
  const weeds = Array.from(weedSet).sort();

  // Sort products by how many of those weeds they individually cover
  const coverageCount = {};
  relevantProducts.forEach(function(product) {
    coverageCount[product.id] = weeds.filter(function(weedName) {
      return product.targetWeeds.some(function(w) {
        const name = typeof w === "string" ? w : w.name;
        return name === weedName;
      });
    }).length;
  });

  relevantProducts.sort(function(a, b) {
    const diff = coverageCount[b.id] - coverageCount[a.id];
    if (diff !== 0) return diff;
    return a.fullName.localeCompare(b.fullName);
  });

  document.querySelector('#reverse-section .view-toggle').classList.add("visible");
  resultsDiv.innerHTML = buildProductWeedTable(turfType, relevantProducts, weeds, reverseViewMode);
}

// ─── POPULATE REVERSE TURF DROPDOWN ───────────────────────────────────────────

function populateReverseTurfTypes() {
  const allTurfs = new Set();
  PRODUCTS.forEach(function(p) {
    p.turfTypes.forEach(function(t) { allTurfs.add(t); });
  });

  const wrapper = document.querySelector('[data-hidden-input="reverse-turf-type"]');
  initCustomSelect(wrapper, Array.from(allTurfs).sort());
}

// ─── POPULATE PRODUCT CHECKBOXES ──────────────────────────────────────────────

function populateReverseProducts() {
  const container = document.getElementById("reverse-product-checkboxes");

  PRODUCTS.slice().sort(function(a, b) {
    return a.fullName.localeCompare(b.fullName);
  }).forEach(function(p) {
    const label = document.createElement("label");
    label.className = "product-label";
    label.dataset.productName = p.fullName.toLowerCase();

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = p.id;
    checkbox.className = "reverse-product-checkbox";

    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(" " + p.fullName));
    container.appendChild(label);
  });
}

// ─── FILTER PRODUCT CHECKBOXES BY SEARCH TEXT ─────────────────────────────────

function filterProductCheckboxes() {
  const query = document.getElementById("product-search").value.toLowerCase().trim();
  document.querySelectorAll(".product-label").forEach(function(label) {
    label.classList.toggle("hidden", !label.dataset.productName.includes(query));
  });
}

// ─── RESET MATRIX ─────────────────────────────────────────────────────────────

function resetMatrix() {
  resetCustomSelect("matrix-turf-type");
  document.querySelectorAll(".matrix-weed-checkbox").forEach(function(cb) {
    cb.checked = false;
  });
  document.getElementById("weed-search").value = "";
  filterWeedCheckboxes(); // show all weeds again
  document.getElementById("matrix-results").innerHTML = "";
  document.querySelector("#matrix-section .view-toggle").classList.remove("visible");
}

function resetReverseMatrix() {
  resetCustomSelect("reverse-turf-type");
  document.querySelectorAll(".reverse-product-checkbox").forEach(function(cb) {
    cb.checked = false;
  });
  document.getElementById("product-search").value = "";
  filterProductCheckboxes(); // show all products again
  document.getElementById("reverse-results").innerHTML = "";
  document.querySelector("#reverse-section .view-toggle").classList.remove("visible");
}

// ─── INIT ─────────────────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", function() {

  // Forward matrix — only runs on matrix.html where these elements exist
  populateMatrixTurfTypes();
  populateMatrixWeeds();
  document.getElementById("weed-search").addEventListener("input", filterWeedCheckboxes);
  document.getElementById("matrix-submit-btn").addEventListener("click", renderMatrix);
  document.getElementById("matrix-reset-btn").addEventListener("click", resetMatrix);
  document.querySelectorAll("#matrix-section .view-btn").forEach(function(btn) {
    btn.addEventListener("click", function() { setMatrixView(btn.dataset.view); });
  });

  // Reverse search — only runs on reverse.html where these elements exist
  populateReverseTurfTypes();
  populateReverseProducts();
  document.getElementById("product-search").addEventListener("input", filterProductCheckboxes);
  document.getElementById("reverse-submit-btn").addEventListener("click", renderReverseMatrix);
  document.getElementById("reverse-reset-btn").addEventListener("click", resetReverseMatrix);
  document.querySelectorAll("#reverse-section .view-btn").forEach(function(btn) {
    btn.addEventListener("click", function() { setReverseView(btn.dataset.view); });
  });

});