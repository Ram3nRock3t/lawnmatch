// matrix.js

// ─── WEED DISPLAY NAME HELPER ─────────────────────────────────────────────────

function getWeedCommonName(id) {
  var found = WEEDS.find(function(w) { return w.id === id; });
  return found ? found.commonName : id;
}

// ─── DISEASE DISPLAY NAME HELPER ──────────────────────────────────────────────

function getDiseaseCommonName(id) {
  var found = DISEASES.find(function(d) { return d.id === id; });
  return found ? found.commonName : id;
}

// ─── GENUS PARENT/CHILD MATCHING (WEEDS ONLY) ────────────────────────────────
// A weed entry counts as a "genus parent" if its scientificName ends in "spp.".
// Selecting a genus parent surfaces products that target specific species
// beneath it; selecting a species surfaces products that only target its
// parent genus. This ONLY applies on the forward Matrix page (user selects
// weeds). The Reverse Matrix (user selects products) always uses exact
// matching only — see useGenusMatching flag threaded through below.
//
// NOTE: Diseases do NOT use genus-parent/child matching — disease matching
// is exact-id only (see findDiseaseMatchExact below).

// Sub-genus catch-alls that do NOT cover their entire genus (only a named
// subset of species within it) go here, keyed by id, mapped to the exact
// species ids they legitimately cover. Add future exceptions here as found.
const PARTIAL_GENUS_CHILDREN = {
  "hop-clover": ["hop-clover-large", "hop-clover-low"]
};

function isGenusParent(weed) {
  return !!weed && typeof weed.scientificName === "string"
    && weed.scientificName.trim().toLowerCase().endsWith("spp.");
}

// Children of a genus PARENT (used when the user selects a parent entry).
function getGenusChildren(parentWeed) {
  if (PARTIAL_GENUS_CHILDREN[parentWeed.id]) {
    return PARTIAL_GENUS_CHILDREN[parentWeed.id]
      .map(function(id) { return WEEDS.find(function(w) { return w.id === id; }); })
      .filter(Boolean);
  }
  return WEEDS.filter(function(w) {
    return w.parentGenus === parentWeed.parentGenus
      && w.id !== parentWeed.id
      && !isGenusParent(w);
  });
}

// Parent(s) of a SPECIES (used when the user selects a specific species).
// Only returns true genus-parent entries that legitimately cover this exact
// species — never sibling species under the same genus.
function getGenusParents(childWeed) {
  return WEEDS.filter(function(w) {
    if (!isGenusParent(w) || w.id === childWeed.id) return false;
    if (w.parentGenus !== childWeed.parentGenus) return false;
    if (PARTIAL_GENUS_CHILDREN[w.id]) {
      return PARTIAL_GENUS_CHILDREN[w.id].includes(childWeed.id);
    }
    return true;
  });
}

// Given a selected weed id, returns every id that should count as a match:
// the weed itself, plus genus parents (if it's a species) or genus children
// (if it's a parent) — never sideways to sibling species.
function getWeedMatchSet(selectedId) {
  var weed = WEEDS.find(function(w) { return w.id === selectedId; });
  if (!weed) return [{ id: selectedId, relation: "exact" }];

  var matches = [{ id: weed.id, relation: "exact" }];

  if (isGenusParent(weed)) {
    getGenusChildren(weed).forEach(function(child) {
      matches.push({ id: child.id, relation: "child" });
    });
  } else {
    getGenusParents(weed).forEach(function(parent) {
      matches.push({ id: parent.id, relation: "parent" });
    });
  }

  return matches;
}

function getWeedDisplayWithScientific(id) {
  var w = WEEDS.find(function(x) { return x.id === id; });
  if (!w) return id;
  return w.commonName + " (" + w.scientificName + ")";
}

// Genus-aware match: expands the selected weed id per getWeedMatchSet before
// checking product.targetWeeds. Used only on the forward Matrix page.
function findWeedMatchGenusAware(product, selectedWeedId) {
  var matchSet = getWeedMatchSet(selectedWeedId);
  for (var i = 0; i < product.targetWeeds.length; i++) {
    var entry = product.targetWeeds[i];
    if (!Array.isArray(entry.ids)) continue;
    for (var j = 0; j < entry.ids.length; j++) {
      var hit = matchSet.find(function(m) { return m.id === entry.ids[j]; });
      if (hit) return { entry: entry, relation: hit.relation, matchedId: hit.id };
    }
  }
  return null;
}

// Exact-only match: no genus expansion at all. Used on the Reverse Matrix,
// where the tool should display exactly what's on the label, nothing inferred.
function findWeedMatchExact(product, selectedWeedId) {
  var entry = product.targetWeeds.find(function(w) {
    return Array.isArray(w.ids) && w.ids.includes(selectedWeedId);
  });
  return entry ? { entry: entry, relation: "exact", matchedId: selectedWeedId } : null;
}

function findWeedMatch(product, selectedWeedId, useGenusMatching) {
  return useGenusMatching
    ? findWeedMatchGenusAware(product, selectedWeedId)
    : findWeedMatchExact(product, selectedWeedId);
}

function getMatchFlagLabel(relation, matchedId) {
  if (relation === "exact") return null;
  var display = getWeedDisplayWithScientific(matchedId);
  if (relation === "child")  return "Targets specific species: " + display;
  if (relation === "parent") return "Targets parent genus: " + display;
  return null;
}

// Whether a weed can be reached by any herbicide product, either directly or
// via genus parent/child matching — used to decide the Matrix checkbox list.
function isWeedTargetable(weed) {
  var matchIds = getWeedMatchSet(weed.id).map(function(m) { return m.id; });
  return PRODUCTS.filter(function(p) { return p.category === "herbicide" && !p.excludeFromMatrix; })
    .some(function(p) {
      return p.targetWeeds.some(function(t) {
        return Array.isArray(t.ids) && t.ids.some(function(id) { return matchIds.includes(id); });
      });
    });
}

// ─── DISEASE MATCHING (EXACT-ID ONLY — NO GENUS EXPANSION) ───────────────────

function findDiseaseMatchExact(product, selectedDiseaseId) {
  if (!Array.isArray(product.targetDiseases)) return null;
  var entry = product.targetDiseases.find(function(d) {
    return Array.isArray(d.ids) && d.ids.includes(selectedDiseaseId);
  });
  return entry ? { entry: entry, relation: "exact", matchedId: selectedDiseaseId } : null;
}

// Whether a disease can be reached by any fungicide product — used to decide
// the Matrix checkbox list when in disease mode.
function isDiseaseTargetable(disease) {
  return PRODUCTS.filter(function(p) { return p.category === "fungicide" && !p.excludeFromMatrix; })
    .some(function(p) {
      return Array.isArray(p.targetDiseases) && p.targetDiseases.some(function(t) {
        return Array.isArray(t.ids) && t.ids.includes(disease.id);
      });
    });
}

// ─── MODE CONFIG (drives Forward Matrix: weed vs. disease) ──────────────────

function getEntityConfig(mode) {
  if (mode === "disease") {
    return {
      dataArray: DISEASES,
      productCategory: "fungicide",
      matchFn: function(product, id) { return findDiseaseMatchExact(product, id); },
      getNameFn: getDiseaseCommonName,
      getFlagLabelFn: function() { return null; },
      isTargetableFn: isDiseaseTargetable,
      legendText: "Target disease(s)",
      productLegendText: "Filter by fungicide(s)",
      entityLabel: "Disease",
      noItemMessage: "Please select at least one disease."
    };
  }
  return {
    dataArray: WEEDS,
    productCategory: "herbicide",
    matchFn: function(product, id) { return findWeedMatch(product, id, true); },
    getNameFn: getWeedCommonName,
    getFlagLabelFn: getMatchFlagLabel,
    isTargetableFn: isWeedTargetable,
    legendText: "Target weed(s)",
    productLegendText: "Filter by herbicide(s)",
    entityLabel: "Weed",
    noItemMessage: "Please select at least one weed."
  };
}

// ─── MODE CONFIG (drives Reverse Matrix: herbicide vs. fungicide) ───────────

function getReverseConfig(mode) {
  if (mode === "fungicide") {
    return {
      productCategory: "fungicide",
      targetField: "targetDiseases",
      matchFn: function(product, id) { return findDiseaseMatchExact(product, id); },
      getNameFn: getDiseaseCommonName,
      legendText: "Fungicide(s)",
      submitBtnText: "Show Diseases Covered",
      entityLabel: "Disease"
    };
  }
  return {
    productCategory: "herbicide",
    targetField: "targetWeeds",
    matchFn: function(product, id) { return findWeedMatch(product, id, false); },
    getNameFn: getWeedCommonName,
    legendText: "Herbicide(s)",
    submitBtnText: "Show Weeds Covered",
    entityLabel: "Weed"
  };
}

// ─── POPULATE TURF DROPDOWN (FORWARD MATRIX) ─────────────────────────────────

function populateMatrixTurfTypes(mode) {
  var config = getEntityConfig(mode);
  var allTurfs = new Set();
  PRODUCTS.filter(function(p) { return p.category === config.productCategory && !p.excludeFromMatrix; }).forEach(function(p) {
    p.turfTypes.forEach(function(t) { allTurfs.add(t); });
  });

  const wrapper = document.querySelector('[data-hidden-input="matrix-turf-type"]');
  initCustomSelect(wrapper, Array.from(allTurfs).sort());
  resetCustomSelect("matrix-turf-type");
}

// ─── CHECK TURF SAFETY STATUS ─────────────────────────────────────────────────

function getTurfSafetyStatus(product, turfType) {
  if (product.turfTypes.includes(turfType)) return "safe";
  if (product.notSafeTurf.some(function(entry) {
    return entry.toLowerCase().indexOf(turfType.toLowerCase()) === 0;
  })) return "unsafe";
  return "unknown";
}

// ─── POPULATE MATRIX PRODUCT FILTER (FORWARD MATRIX) ─────────────────────────

function populateMatrixProducts(mode) {
  var container = document.getElementById("matrix-product-checkboxes");
  container.innerHTML = "";
  var config = getEntityConfig(mode);
  PRODUCTS.filter(function(p) { return p.category === config.productCategory && !p.excludeFromMatrix; })
    .slice().sort(function(a, b) { return a.fullName.localeCompare(b.fullName); })
    .forEach(function(p) {
      var label = document.createElement("label");
      label.className = "product-label";
      label.dataset.productName = p.fullName.toLowerCase();
      var checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = p.id;
      checkbox.className = "matrix-product-checkbox";
      label.appendChild(checkbox);
      label.appendChild(document.createTextNode(" " + p.fullName));
      container.appendChild(label);
    });
}

function filterMatrixProductCheckboxes() {
  var query = document.getElementById("matrix-product-search").value.toLowerCase().trim();
  document.querySelectorAll("#matrix-product-checkboxes .product-label").forEach(function(label) {
    label.classList.toggle("hidden", !label.dataset.productName.includes(query));
  });
}

// ─── POPULATE ENTITY CHECKBOXES (WEEDS OR DISEASES, FORWARD MATRIX) ──────────

function populateMatrixEntities(mode) {
  var container = document.getElementById("matrix-weed-checkboxes");
  container.innerHTML = "";
  var config = getEntityConfig(mode);

  var targetableEntities = config.dataArray.filter(config.isTargetableFn);

  targetableEntities.slice().sort(function(a, b) {
    return a.commonName.localeCompare(b.commonName);
  }).forEach(function(entity) {
    var label = document.createElement("label");
    label.className = "weed-label";
    label.dataset.commonName = entity.commonName.toLowerCase();
    var sciOrPathogen = mode === "disease" ? (entity.pathogen || "") : (entity.scientificName || "");
    label.dataset.scientificName = sciOrPathogen.toLowerCase();
    label.dataset.aliasList = Array.isArray(entity.aliases) ? entity.aliases.join("|") : "";

    var checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = entity.id;
    checkbox.className = "matrix-weed-checkbox";

    var textSpan = document.createElement("span");
    textSpan.className = "weed-label-text";
    textSpan.innerHTML = " " + escapeHTML(entity.commonName) + " <em>(" + escapeHTML(sciOrPathogen) + ")</em>";

    var aliasNote = document.createElement("span");
    aliasNote.className = "weed-alias-note";

    label.appendChild(checkbox);
    label.appendChild(textSpan);
    label.appendChild(aliasNote);
    container.appendChild(label);
  });
}

// ─── FILTER WEED/DISEASE CHECKBOXES BY SEARCH TEXT ───────────────────────────
// Matches against commonName, scientificName/pathogen, and aliases. If the
// query only matches via alias(es) — not the visible name — shows which
// alias(es) matched. Works identically regardless of whether the container
// currently holds weed or disease checkboxes.

function filterWeedCheckboxes() {
  const query = document.getElementById("weed-search").value.toLowerCase().trim();

  document.querySelectorAll(".weed-label").forEach(function(label) {
    const aliasNoteEl = label.querySelector(".weed-alias-note");

    if (!query) {
      label.classList.remove("hidden");
      if (aliasNoteEl) aliasNoteEl.textContent = "";
      return;
    }

    const commonMatch = label.dataset.commonName.includes(query);
    const sciMatch = label.dataset.scientificName.includes(query);
    const aliasList = label.dataset.aliasList ? label.dataset.aliasList.split("|") : [];
    const matchingAliases = aliasList.filter(function(a) {
      return a.toLowerCase().includes(query);
    });

    const isMatch = commonMatch || sciMatch || matchingAliases.length > 0;
    label.classList.toggle("hidden", !isMatch);

    if (aliasNoteEl) {
      const showAliasNote = isMatch && !commonMatch && !sciMatch && matchingAliases.length > 0;
      aliasNoteEl.textContent = showAliasNote ? "Alias: " + matchingAliases.join(", ") : "";
    }
  });
}

// ─── SHARED RESULT BUILDER (table or cards) ────────────────────────────────────

function buildProductWeedTable(turfType, products, entityIds, viewMode, showRemove, matchFn, getNameFn, getFlagLabelFn, entityLabel) {
  if (viewMode === "cards") {
    return buildProductWeedCards(turfType, products, entityIds, matchFn, getNameFn, getFlagLabelFn);
  }
  return buildProductWeedTableHTML(turfType, products, entityIds, showRemove, matchFn, getNameFn, getFlagLabelFn, entityLabel);
}

// ─── TABLE VIEW ─────────────────────────────────────────────────────────────────

function buildProductWeedTableHTML(turfType, products, entityIds, showRemove, matchFn, getNameFn, getFlagLabelFn, entityLabel) {
  const turfSafety = {};
  products.forEach(function(product) {
    turfSafety[product.id] = getTurfSafetyStatus(product, turfType);
  });

  let html = `<table id="matrix-table"><thead><tr><th>${entityLabel || "Weed"}</th>`;
  products.forEach(function(product) {
    var safety = turfSafety[product.id];
    var safetyTag = "";
    if (safety === "unsafe")  safetyTag = '<br><span class="matrix-unsafe-tag">NOT SAFE for ' + turfType + '</span>';
    if (safety === "unknown") safetyTag = '<br><span class="matrix-unknown-tag">Not listed for ' + turfType + '</span>';
    var multiTypeTag = isMultiType(product)
      ? '<br><span class="matrix-multitype-tag">ⓘ Pre- &amp; post-emergent — timing varies</span>'
      : "";
    var removeBtn = showRemove
      ? '<button class="matrix-col-remove" data-product-id="' + product.id + '" aria-label="Remove ' + product.fullName + '" title="Remove product">❌</button>'
      : "";
    html += "<th>" + product.fullName + safetyTag + multiTypeTag + removeBtn + "</th>";
  });
  html += `</tr></thead><tbody>`;

  entityIds.forEach(function(id) {
    var displayName = getNameFn(id);
    html += `<tr><td><div class="weed-cell-content">${displayName}</div></td>`;

    products.forEach(function(product) {
      const match = matchFn(product, id);

      let cellContent = "";
      if (match) {
        const rateRequired = match.entry.rateRequired || null;
        const flag = getFlagLabelFn(match.relation, match.matchedId);
        cellContent = `<span class="matrix-yes">✓</span>${rateRequired ? " (" + rateRequired + ")" : ""}`;
        if (flag) {
          cellContent += `<br><span class="matrix-genus-flag">ⓘ ${escapeHTML(flag)}</span>`;
        }
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

function buildProductWeedCards(turfType, products, entityIds, matchFn, getNameFn, getFlagLabelFn) {
  let html = "";

  products.forEach(function(product) {
    const safety = getTurfSafetyStatus(product, turfType);

    let safetyTag = "";
    if (safety === "unsafe")  safetyTag = `<p><span class="matrix-unsafe-tag">⚠️ NOT SAFE for ${turfType}</span></p>`;
    if (safety === "unknown") safetyTag = `<p><span class="matrix-unknown-tag">❓ Not listed for ${turfType}</span></p>`;

    const coveredIds = entityIds.filter(function(id) {
      return !!matchFn(product, id);
    });

    let cardClass = "product-card";
    if (safety === "unsafe")  cardClass += " product-card-unsafe";
    if (safety === "unknown") cardClass += " product-card-unknown";

    var multiTypeNote = isMultiType(product)
      ? `<p class="matrix-multitype-note">ⓘ ${MULTI_TYPE_DISCLAIMER}</p>`
      : "";

    html += `<div class="${cardClass}">`;
    html += `<h4>${product.fullName}</h4>`;
    html += safetyTag;
    html += multiTypeNote;

    if (coveredIds.length > 0) {
      html += `<ul>`;
      coveredIds.forEach(function(id) {
        var displayName = getNameFn(id);
        var match = matchFn(product, id);
        var rateRequired = match ? (match.entry.rateRequired || null) : null;
        var flag = match ? getFlagLabelFn(match.relation, match.matchedId) : null;
        html += `<li>${displayName}${rateRequired ? " — rate: " + rateRequired : ""}`;
        if (flag) html += `<br><span class="matrix-genus-flag">ⓘ ${escapeHTML(flag)}</span>`;
        html += `</li>`;
      });
      html += `</ul>`;
    } else {
      html += `<p class="matrix-no-weeds">No matches from your selection.</p>`;
    }

    html += `</div>`;
  });

  return html;
}

// ─── VIEW MODE STATE ────────────────────────────────────────────────────────────

let matrixViewMode = "table";
let reverseViewMode = "table";
let matrixEntityMode = "weed";
let reverseCategoryMode = "herbicide";

function setMatrixView(mode) {
  matrixViewMode = mode;
  document.querySelectorAll("#matrix-section .view-btn[data-view]").forEach(function(btn) {
    btn.classList.toggle("active", btn.dataset.view === mode);
  });
  renderMatrix();
}

function setReverseView(mode) {
  reverseViewMode = mode;
  document.querySelectorAll("#reverse-section .view-btn[data-view]").forEach(function(btn) {
    btn.classList.toggle("active", btn.dataset.view === mode);
  });
  renderReverseMatrix();
}

// ─── FORWARD MATRIX ENTITY MODE TOGGLE (weed / disease) ─────────────────────

function setMatrixEntityMode(mode) {
  matrixEntityMode = mode;
  document.querySelectorAll("#matrix-entity-toggle .view-btn").forEach(function(btn) {
    btn.classList.toggle("active", btn.dataset.mode === mode);
  });
  var config = getEntityConfig(mode);
  var legendEl = document.getElementById("matrix-weed-legend-text");
  if (legendEl) legendEl.textContent = getEntityConfig(mode).legendText;
  var productLegendEl = document.getElementById("matrix-product-legend-text");
  if (productLegendEl) productLegendEl.textContent = config.productLegendText;

  document.getElementById("weed-search").value = "";
  document.getElementById("matrix-product-search").value = "";
  populateMatrixTurfTypes(mode);
  populateMatrixProducts(mode);
  populateMatrixEntities(mode);
  filterWeedCheckboxes();
  filterMatrixProductCheckboxes();
  document.getElementById("matrix-results").innerHTML = "";
  document.querySelector("#matrix-section .view-toggle").classList.remove("visible");
}

// ─── REVERSE MATRIX CATEGORY MODE TOGGLE (herbicide / fungicide) ────────────

function setReverseCategoryMode(mode) {
  reverseCategoryMode = mode;
  document.querySelectorAll("#reverse-category-toggle .view-btn").forEach(function(btn) {
    btn.classList.toggle("active", btn.dataset.mode === mode);
  });
  var config = getReverseConfig(mode);
  var legendEl = document.getElementById("reverse-product-legend-text");
  if (legendEl) legendEl.textContent = config.legendText;
  var submitBtn = document.getElementById("reverse-submit-btn");
  if (submitBtn) submitBtn.textContent = config.submitBtnText;

  document.getElementById("product-search").value = "";
  populateReverseTurfTypes(mode);
  populateReverseProducts(mode);
  filterProductCheckboxes();
  document.getElementById("reverse-results").innerHTML = "";
  document.querySelector("#reverse-section .view-toggle").classList.remove("visible");
}

// ─── FORWARD MATRIX: select weeds/diseases → see matching products ─────────

function renderMatrix() {
  var config = getEntityConfig(matrixEntityMode);
  var turfType = document.getElementById("matrix-turf-type").value;
  var selectedIds = Array.from(document.querySelectorAll(".matrix-weed-checkbox:checked"))
    .map(function(cb) { return cb.value; });

  var resultsDiv = document.getElementById("matrix-results");

  if (!turfType) {
    resultsDiv.innerHTML = "<p>Please select a turf type.</p>";
    return;
  }
  if (selectedIds.length === 0) {
    resultsDiv.innerHTML = "<p>" + config.noItemMessage + "</p>";
    return;
  }

  var selectedProductIds = Array.from(document.querySelectorAll(".matrix-product-checkbox:checked"))
    .map(function(cb) { return cb.value; });
  var productPool = selectedProductIds.length > 0
    ? PRODUCTS.filter(function(p) { return selectedProductIds.includes(p.id); })
    : PRODUCTS.filter(function(p) { return p.category === config.productCategory && !p.excludeFromMatrix; });

  var relevantProducts = productPool.filter(function(product) {
    if (getTurfSafetyStatus(product, turfType) === "unsafe") return false;
    return selectedIds.some(function(id) {
      return !!config.matchFn(product, id);
    });
  });

  if (relevantProducts.length === 0) {
    resultsDiv.innerHTML = "<p>No safe, matching products found for this turf and selection.</p>";
    return;
  }

  var coverageCount = {};
  relevantProducts.forEach(function(product) {
    coverageCount[product.id] = selectedIds.filter(function(id) {
      return !!config.matchFn(product, id);
    }).length;
  });

  relevantProducts.sort(function(a, b) {
    var diff = coverageCount[b.id] - coverageCount[a.id];
    if (diff !== 0) return diff;
    return a.fullName.localeCompare(b.fullName);
  });

  document.querySelector('#matrix-section .view-toggle').classList.add("visible");
  resultsDiv.innerHTML = buildProductWeedTable(turfType, relevantProducts, selectedIds, matrixViewMode, true, config.matchFn, config.getNameFn, config.getFlagLabelFn, config.entityLabel);
  wireMatrixColRemove();
}

// ─── WIRE COLUMN REMOVE BUTTONS ───────────────────────────────────────────────

function wireMatrixColRemove() {
  document.querySelectorAll(".matrix-col-remove").forEach(function(btn) {
    btn.addEventListener("click", function() {
      var productId = btn.dataset.productId;
      var checkboxes = Array.from(document.querySelectorAll(".matrix-product-checkbox"));
      var anyChecked = checkboxes.some(function(cb) { return cb.checked; });

      if (!anyChecked) {
        checkboxes.forEach(function(cb) {
          cb.checked = cb.value !== productId;
        });
      } else {
        checkboxes.forEach(function(cb) {
          if (cb.value === productId) cb.checked = false;
        });
      }
      renderMatrix();
    });
  });
}

// ─── REVERSE MATRIX: select products → see weeds/diseases covered ──────────

function renderReverseMatrix() {
  var config = getReverseConfig(reverseCategoryMode);
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

  const relevantProducts = selectedProducts;

  const idSet = new Set();
  relevantProducts.forEach(function(product) {
    var targetArr = product[config.targetField];
    if (!Array.isArray(targetArr)) return;
    targetArr.forEach(function(t) {
      if (Array.isArray(t.ids)) {
        t.ids.forEach(function(id) { idSet.add(id); });
      }
    });
  });

  const ids = Array.from(idSet).sort(function(a, b) {
    return config.getNameFn(a).localeCompare(config.getNameFn(b));
  });

  const coverageCount = {};
  relevantProducts.forEach(function(product) {
    coverageCount[product.id] = ids.filter(function(id) {
      return !!config.matchFn(product, id);
    }).length;
  });

  relevantProducts.sort(function(a, b) {
    const diff = coverageCount[b.id] - coverageCount[a.id];
    if (diff !== 0) return diff;
    return a.fullName.localeCompare(b.fullName);
  });

  document.querySelector('#reverse-section .view-toggle').classList.add("visible");
  resultsDiv.innerHTML = buildProductWeedTable(turfType, relevantProducts, ids, reverseViewMode, false, config.matchFn, config.getNameFn, function() { return null; }, config.entityLabel);
}

// ─── POPULATE REVERSE TURF DROPDOWN ───────────────────────────────────────────

function populateReverseTurfTypes(mode) {
  var config = getReverseConfig(mode);
  var allTurfs = new Set();
  PRODUCTS.filter(function(p) { return p.category === config.productCategory && !p.excludeFromMatrix; }).forEach(function(p) {
    p.turfTypes.forEach(function(t) { allTurfs.add(t); });
  });

  const wrapper = document.querySelector('[data-hidden-input="reverse-turf-type"]');
  initCustomSelect(wrapper, Array.from(allTurfs).sort());
  resetCustomSelect("reverse-turf-type");
}

// ─── POPULATE PRODUCT CHECKBOXES (REVERSE MATRIX) ────────────────────────────

function populateReverseProducts(mode) {
  const container = document.getElementById("reverse-product-checkboxes");
  container.innerHTML = "";
  var config = getReverseConfig(mode);

  PRODUCTS.filter(function(p) { return p.category === config.productCategory && !p.excludeFromMatrix; }).slice().sort(function(a, b) {
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

// ─── MULTI-TYPE DISCLAIMER ────────────────────────────────────────────────────

const MULTI_TYPE_DISCLAIMER = "Pre- and post-emergent product — timing varies by species. Consult the full label before applying.";

function isMultiType(product) {
  return Array.isArray(product.type) && product.type.length > 1;
}

// ─── RESET MATRIX ─────────────────────────────────────────────────────────────

function resetMatrix() {
  matrixEntityMode = "weed";
  document.querySelectorAll("#matrix-entity-toggle .view-btn").forEach(function(btn) {
    btn.classList.toggle("active", btn.dataset.mode === "weed");
  });
  var legendEl = document.getElementById("matrix-weed-legend-text");
  if (legendEl) legendEl.textContent = getEntityConfig("weed").legendText;

  populateMatrixTurfTypes("weed");
  populateMatrixProducts("weed");
  populateMatrixEntities("weed");
  document.getElementById("weed-search").value = "";
  document.getElementById("matrix-product-search").value = "";
  filterWeedCheckboxes();
  filterMatrixProductCheckboxes();
  document.getElementById("matrix-results").innerHTML = "";
  document.querySelector("#matrix-section .view-toggle").classList.remove("visible");
}

function resetReverseMatrix() {
  reverseCategoryMode = "herbicide";
  document.querySelectorAll("#reverse-category-toggle .view-btn").forEach(function(btn) {
    btn.classList.toggle("active", btn.dataset.mode === "herbicide");
  });
  var config = getReverseConfig("herbicide");
  var legendEl = document.getElementById("reverse-product-legend-text");
  if (legendEl) legendEl.textContent = config.legendText;
  var submitBtn = document.getElementById("reverse-submit-btn");
  if (submitBtn) submitBtn.textContent = config.submitBtnText;

  populateReverseTurfTypes("herbicide");
  populateReverseProducts("herbicide");
  document.getElementById("product-search").value = "";
  filterProductCheckboxes();
  document.getElementById("reverse-results").innerHTML = "";
  document.querySelector("#reverse-section .view-toggle").classList.remove("visible");
}

// ─── INIT ─────────────────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", function() {

  populateMatrixTurfTypes("weed");
  populateMatrixProducts("weed");
  populateMatrixEntities("weed");
  document.getElementById("matrix-product-search").addEventListener("input", filterMatrixProductCheckboxes);
  document.getElementById("weed-search").addEventListener("input", filterWeedCheckboxes);
  document.getElementById("matrix-submit-btn").addEventListener("click", renderMatrix);
  document.getElementById("matrix-reset-btn").addEventListener("click", resetMatrix);
  document.querySelectorAll("#matrix-section .view-btn[data-view]").forEach(function(btn) {
    btn.addEventListener("click", function() { setMatrixView(btn.dataset.view); });
  });
  document.querySelectorAll("#matrix-entity-toggle .view-btn").forEach(function(btn) {
    btn.addEventListener("click", function() { setMatrixEntityMode(btn.dataset.mode); });
  });

  populateReverseTurfTypes("herbicide");
  populateReverseProducts("herbicide");
  document.getElementById("product-search").addEventListener("input", filterProductCheckboxes);
  document.getElementById("reverse-submit-btn").addEventListener("click", renderReverseMatrix);
  document.getElementById("reverse-reset-btn").addEventListener("click", resetReverseMatrix);
  document.querySelectorAll("#reverse-section .view-btn[data-view]").forEach(function(btn) {
    btn.addEventListener("click", function() { setReverseView(btn.dataset.view); });
  });
  document.querySelectorAll("#reverse-category-toggle .view-btn").forEach(function(btn) {
    btn.addEventListener("click", function() { setReverseCategoryMode(btn.dataset.mode); });
  });

});