// calculator.js

// ─── UNIT LABEL MAP ───────────────────────────────────────────────────────────

const AREA_UNIT_LABELS = { ft: "sq ft", yd: "sq yd", m: "sq m" , acre: "acre" };

// ─── UPDATE AREA UNIT LABEL ───────────────────────────────────────────────────

function updateAreaUnitLabel() {
  var unit = document.getElementById("dim-unit").value;
  var areaUnitEl = document.getElementById("area-unit");
  if (areaUnitEl) areaUnitEl.value = unit;
}

// ─── RESULT UNIT OPTIONS BY FORMULATION ──────────────────────────────────────

const RESULT_UNIT_OPTIONS = {
  liquid: [
    { value: "base", label: "Default (fl oz)" },
    { value: "mL",   label: "mL"   },
    { value: "tsp",  label: "tsp"  },
    { value: "tbsp", label: "tbsp" },
    { value: "cup",  label: "cup"  },
    { value: "pt",   label: "pt"   },
    { value: "qt",   label: "qt"   },
    { value: "gal",  label: "gal"  }
  ],
  granule: [
    { value: "base", label: "Default (oz)"        },
    { value: "g",    label: "g"                   },
    { value: "tsp",  label: "tsp (approx)"        },
    { value: "tbsp", label: "tbsp (approx)"       }
  ]
};

function updateResultUnitOptions(formulation) {
  const select = document.getElementById("result-unit");
  const current = select.value;
  const opts = RESULT_UNIT_OPTIONS[formulation] || RESULT_UNIT_OPTIONS.liquid;
  select.innerHTML = "";
  opts.forEach(function(o) {
    const opt = document.createElement("option");
    opt.value = o.value;
    opt.textContent = o.label;
    select.appendChild(opt);
  });
  // Keep current selection if it's still valid, otherwise fall back to base
  const stillValid = opts.some(function(o) { return o.value === current; });
  select.value = stillValid ? current : "base";
}

// ─── AUTO-POPULATE AREA FROM LENGTH × WIDTH ───────────────────────────────────

function updateAreaFromDimensions() {
  const len = parseFloat(document.getElementById("len").value) || 0;
  const wid = parseFloat(document.getElementById("wid").value) || 0;
  if (len <= 0 || wid <= 0) return;

  // Multiply in the native unit — no intermediate conversion
  document.getElementById("sqft").value = round(len * wid);
  updateAreaUnitLabel();
}

// ─── READ AREA (always returns sq ft internally) ──────────────────────────────

function getAreaSqFt() {
  var len  = parseFloat(document.getElementById("len").value)  || 0;
  var wid  = parseFloat(document.getElementById("wid").value)  || 0;
  var unit = document.getElementById("dim-unit").value;
  var totalArea = parseFloat(document.getElementById("sqft").value) || 0;

  if (len > 0 && wid > 0) {
    var rawArea = len * wid;
    switch (unit) {
      case "ft": return rawArea;
      case "yd": return rawArea * 9;
      case "m":  return rawArea * 10.7639;
      default:   return rawArea;
    }
  }

  if (totalArea <= 0) return 0;
  var areaUnit = document.getElementById("area-unit").value;
  switch (areaUnit) {
    case "ft":   return totalArea;
    case "yd":   return totalArea * 9;
    case "m":    return totalArea * 10.7639;
    case "acre": return totalArea * 43560;
    default:     return totalArea;
  }
}

// ─── DISPLAY AREA IN USER'S UNIT ─────────────────────────────────────────────

function displayArea(sqft) {
  const unit = document.getElementById("dim-unit").value;
  switch (unit) {
    case "yd": return round(sqft / 9)       + " sq yd";
    case "m":  return round(sqft / 10.7639) + " sq m";
    case "acre": return round(sqft / 43560)   + " acre";
    default:   return round(sqft)           + " sq ft";
  }
}

// ─── POPULATE PRODUCT DROPDOWN ────────────────────────────────────────────────

function populateProducts() {
  const select = document.getElementById("product");
  PRODUCTS.forEach(function(p) {
    const option = document.createElement("option");
    option.value = p.id;
    option.textContent = p.fullName;
    select.appendChild(option);
  });
}

function populateTurfTypes() {
  const allTurfs = new Set();
  PRODUCTS.forEach(function(p) {
    p.turfTypes.forEach(function(t) { allTurfs.add(t.toLowerCase()); });
  });
  const wrapper = document.querySelector('[data-hidden-input="turf-type"]');
  initCustomSelect(wrapper, Array.from(allTurfs).sort());
}

function onProductChange() {
  const product = getSelectedProduct();
  if (!product) return;

  const useRow  = document.getElementById("use-row");
  const useType = document.getElementById("use-type");

  if (product.rateTiers) {
    useType.innerHTML = "";
    product.rateTiers.forEach(function(t) {
      const opt = document.createElement("option");
      opt.value = t.label;
      opt.textContent = t.label;
      useType.appendChild(opt);
    });
    useRow.classList.remove("hidden");
  } else {
    useRow.classList.add("hidden");
    useType.innerHTML = "";
  }

  updateResultUnitOptions(product.formulation); 
  updateTurfStatus();
}

// ─── TURF SAFETY BANNER ───────────────────────────────────────────────────────

function getTurfStatusForProduct(product, turfType) {
  const turfLower = turfType.toLowerCase();
  if (product.turfTypes.some(t => t.toLowerCase() === turfLower)) return "safe";
  const isUnsafe = product.notSafeTurf.some(function(entry) {
    return entry.toLowerCase().indexOf(turfLower) === 0;
  });
  return isUnsafe ? "unsafe" : "unknown";
}

function updateTurfStatus() {
  const banner   = document.getElementById("turf-status-banner");
  if (!banner) return;
  const product  = getSelectedProduct();
  const turfType = document.getElementById("turf-type").value;

  if (!product || !turfType) { banner.innerHTML = ""; return; }

  const status = getTurfStatusForProduct(product, turfType);
  if (status === "unsafe") {
    banner.innerHTML = `<p id="turf-warning">⚠️ ${product.fullName} is <strong>NOT SAFE</strong> for ${turfType}. <strong>DO NOT APPLY</strong>.</p>`;
  } else if (status === "unknown") {
    banner.innerHTML = `<p id="annual-warning">⚠️ ${turfType} is not listed on the ${product.fullName} label as a safe turf type. Verify with the product label before applying.</p>`;
  } else {
    banner.innerHTML = "";
  }
}

// ─── INIT ─────────────────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", function() {
  populateProducts();
  populateTurfTypes();

  document.getElementById("product").addEventListener("change", onProductChange);
  document.getElementById("turf-type").addEventListener("change", updateTurfStatus);
  document.getElementById("result-unit").addEventListener("change", renderResults);
  var prevAreaUnit = document.getElementById("area-unit").value;
  document.getElementById("area-unit").addEventListener("change", function() {
    var newUnit = document.getElementById("area-unit").value;
    var currentVal = parseFloat(document.getElementById("sqft").value);
    if (!isNaN(currentVal) && currentVal > 0) {
      var inSqFt;
      switch (prevAreaUnit) {
        case "ft":   inSqFt = currentVal;          break;
        case "yd":   inSqFt = currentVal * 9;      break;
        case "m":    inSqFt = currentVal * 10.7639; break;
        case "acre": inSqFt = currentVal * 43560;  break;
        default:     inSqFt = currentVal;
      }
      var converted;
      switch (newUnit) {
        case "ft":   converted = inSqFt;            break;
        case "yd":   converted = inSqFt / 9;        break;
        case "m":    converted = inSqFt / 10.7639;  break;
        case "acre": converted = inSqFt / 43560;    break;
        default:     converted = inSqFt;
      }
      document.getElementById("sqft").value = round(converted);
    }
    prevAreaUnit = newUnit;
    if (!document.getElementById("results").classList.contains("hidden")) {
      renderResults();
    }
  });
  document.getElementById("size-select").addEventListener("change", renderBottles);
  document.getElementById("calculate-btn").addEventListener("click", renderResults);
  document.getElementById("reset-calc-btn").addEventListener("click", resetCalculator);

  ["len", "wid"].forEach(function(id) {
    document.getElementById(id).addEventListener("input", updateAreaFromDimensions);
  });

  document.getElementById("dim-unit").addEventListener("change", function() {
    updateAreaUnitLabel();
    updateAreaFromDimensions();
  });
});

// ─── GET SELECTED PRODUCT ─────────────────────────────────────────────────────

function getSelectedProduct() {
  const id = document.getElementById("product").value;
  return PRODUCTS.find(function(p) { return p.id === id; }) || null;
}

// ─── DETECT RATE PATTERN ──────────────────────────────────────────────────────

function getRatePattern(product) {
  const hasTurfRates = Array.isArray(product.turfRates);
  const hasRateTiers = Array.isArray(product.rateTiers);
  if (hasTurfRates && hasRateTiers) return "both";
  if (hasTurfRates)                 return "turf";
  if (hasRateTiers)                 return "weed";
  return "flat";
}

// ─── GET RATE ─────────────────────────────────────────────────────────────────

function getRate(product, turfType, rateTierLabel) {
  const pattern = getRatePattern(product);

  if (pattern === "flat") {
    return { rateMin: product.rateMin, rateMax: product.rateMax };
  }
  if (pattern === "turf") {
    const match = product.turfRates.find(function(g) { return g.turfGroup.includes(turfType); });
    if (!match) return null;
    return { rateMin: match.rateMin, rateMax: match.rateMax };
  }
  if (pattern === "weed") {
    const tier = product.rateTiers.find(function(t) { return t.label === rateTierLabel; });
    if (!tier) return null;
    return { rateMin: tier.ozPer1k, rateMax: tier.ozPer1k };
  }
  if (pattern === "both") {
    var turfMatch = product.turfRates.find(function(g) { return g.turfGroup.includes(turfType); });
    var tier = product.rateTiers.find(function(t) { return t.label === rateTierLabel; });
    if (!turfMatch || !tier) return null;
    var rate = Math.min(tier.ozPer1k, turfMatch.rateMax);
    return { rateMin: rate, rateMax: rate };
  }
  return null;
}

// ─── CALCULATE ────────────────────────────────────────────────────────────────

function calculate(product, sqft, turfType, rateTierLabel) {
  const rate = getRate(product, turfType, rateTierLabel);
  if (!rate) return null;
  const k = sqft / 1000;
  const amountMin     = rate.rateMin * k;
  const amountMax     = rate.rateMax * k;
  const water         = (product.waterPerUnit === null || product.waterPerUnit === undefined)
                          ? null
                          : product.waterPerUnit * k;
  const annualMax     = product.annualMaxPer1k * k;
  const overAnnualMax = amountMax > annualMax;
  return { sqft, k, amountMin, amountMax, water, annualMax, overAnnualMax };
}

// ─── UNIT CONVERSION FOR DISPLAY ─────────────────────────────────────────────

function convertAmount(oz, formulation, displayUnit) {
  if (displayUnit === "base") {
    return { value: round(oz), unit: formulation === "liquid" ? "fl oz" : "oz" };
  }
  if (formulation === "liquid") {
    switch (displayUnit) {
      case "mL":   return { value: round(oz * 29.5735), unit: "mL"   };
      case "tsp":  return { value: round(oz * 6),       unit: "tsp"  };
      case "tbsp": return { value: round(oz * 2),       unit: "tbsp" };
      case "cup":  return { value: round(oz / 8),       unit: "cup"  };
      case "pt":   return { value: round(oz / 16),      unit: "pt"   };
      case "qt":   return { value: round(oz / 32),      unit: "qt"   };
      case "gal":  return { value: round(oz / 128),     unit: "gal"  };
    }
  }
  if (formulation === "granule") {
    switch (displayUnit) {
      case "g":    return { value: round(oz * 28.3495), unit: "g"              };
      case "tsp":  return { value: round(oz * 2),       unit: "tsp (approx)"  };
      case "tbsp": return { value: round(oz * 0.67),    unit: "tbsp (approx)" };
    }
  }
  return { value: round(oz), unit: formulation === "liquid" ? "fl oz" : "oz" };
}

function round(n) {
  return Math.round(n * 10) / 10;
}

// ─── CONTAINER CALCULATION ────────────────────────────────────────────────────

function calcContainers(amountMax, containerOz) {
  const needed         = Math.ceil(amountMax / containerOz);
  const totalPurchased = needed * containerOz;
  const leftover       = round(totalPurchased - amountMax);
  return { needed, totalPurchased, leftover };
}

// ─── RENDER RESULTS ───────────────────────────────────────────────────────────

function renderResults() {
  var product = getSelectedProduct();
  if (!product) return;
  var sqft = getAreaSqFt();
  if (sqft <= 0) return;

  var turfType      = document.getElementById("turf-type").value  || null;
  var rateTierLabel = document.getElementById("use-type").value   || null;
  var displayUnit   = document.getElementById("result-unit").value;

  var calc = calculate(product, sqft, turfType, rateTierLabel);
  if (!calc) return;

  var min          = convertAmount(calc.amountMin, product.formulation, displayUnit);
  var max          = convertAmount(calc.amountMax, product.formulation, displayUnit);
  var waterRounded = calc.water === null ? "See label" : round(calc.water);

  // ── Calculation Summary stats ──────────────────────────────────────────────
  var metricsHTML = "";

  if (turfType && product.notSafeTurf && product.notSafeTurf.includes(turfType)) {
    metricsHTML += '<p class="result-warning-danger">⚠️ ' + product.fullName + ' is <strong>NOT SAFE</strong> for ' + turfType + '. <strong>DO NOT APPLY</strong>.</p>';
  }

  var productAmount = min.value === max.value
    ? (max.value + " " + max.unit)
    : (min.value + " – " + max.value + " " + max.unit);

  metricsHTML += '<div class="result-stat"><span class="result-stat-label">Area</span><span class="result-stat-value">' + displayArea(sqft) + '</span></div>';
  metricsHTML += '<div class="result-stat"><span class="result-stat-label">Product needed</span><span class="result-stat-value result-stat-highlight">' + productAmount + '</span></div>';
  metricsHTML += '<div class="result-stat"><span class="result-stat-label">Water / carrier</span><span class="result-stat-value">' + waterRounded + (calc.water === null ? '' : ' gal') + '</span></div>';

  if (calc.overAnnualMax) {
    metricsHTML += '<p class="result-warning-caution">⚠️ Amount exceeds annual maximum of ' + round(calc.annualMax) + ' oz. Split into multiple applications.</p>';
  }

  document.getElementById("metrics").innerHTML = metricsHTML;

  // ── Container size dropdown ────────────────────────────────────────────────
  var sizeSelect = document.getElementById("size-select");
  sizeSelect.innerHTML = "";
  product.containerSizes.forEach(function(s) {
    var opt = document.createElement("option");
    opt.value = s.oz;
    opt.textContent = s.label;
    sizeSelect.appendChild(opt);
  });

  renderBottles();

  // ── Product Info card ──────────────────────────────────────────────────────
  var toxicityClass = product.EPAtoxicityLevel === "CAUTION" ? "result-badge-caution"
                    : product.EPAtoxicityLevel === "WARNING" ? "result-badge-warning"
                    : product.EPAtoxicityLevel === "DANGER"  ? "result-badge-danger"
                    : "";

  var infoHTML = '<h3 class="result-product-name">' + product.fullName + '</h3>';
  infoHTML += '<div class="result-badges">';
  infoHTML += '<span class="result-badge">' + product.type + '</span>';
  infoHTML += '<span class="result-badge">' + product.formulation + '</span>';
  infoHTML += '<span class="result-badge ' + toxicityClass + '">' + product.EPAtoxicityLevel + '</span>';
  infoHTML += '</div>';

  infoHTML += '<div class="result-stat"><span class="result-stat-label">Active ingredients</span><span class="result-stat-value">' + product.activeIngredients.join(", ") + '</span></div>';
  infoHTML += '<div class="result-stat"><span class="result-stat-label">Re-entry interval</span><span class="result-stat-value">' + product.reentryInterval + '</span></div>';

  if (product.applicationNotes && product.applicationNotes.length) {
    var noteItems = product.applicationNotes.map(function(n) { return "<li>" + n + "</li>"; }).join("");
    infoHTML += '<div class="result-collapsible">';
    infoHTML += '<button class="result-collapsible-btn" aria-expanded="false" data-body="rc-notes">';
    infoHTML += '<span>Application notes</span><span class="result-collapsible-count">' + product.applicationNotes.length + '</span><span class="result-chevron" aria-hidden="true">▼</span>';
    infoHTML += '</button>';
    infoHTML += '<div id="rc-notes" class="result-collapsible-body hidden"><ul>' + noteItems + '</ul></div>';
    infoHTML += '</div>';
  }

  if (product.restrictions && product.restrictions.length) {
    var restrictItems = product.restrictions.map(function(r) { return "<li>" + r + "</li>"; }).join("");
    infoHTML += '<div class="result-collapsible">';
    infoHTML += '<button class="result-collapsible-btn" aria-expanded="false" data-body="rc-restrictions">';
    infoHTML += '<span>Restrictions</span><span class="result-collapsible-count">' + product.restrictions.length + '</span><span class="result-chevron" aria-hidden="true">▼</span>';
    infoHTML += '</button>';
    infoHTML += '<div id="rc-restrictions" class="result-collapsible-body hidden"><ul>' + restrictItems + '</ul></div>';
    infoHTML += '</div>';
  }

  if (product.genericAlternatives && product.genericAlternatives.length) {
    var genericItems = product.genericAlternatives.map(function(g) {
      return "<li><strong>" + g.fullName + "</strong> — " + g.activeIngredient + ". " + g.note + "</li>";
    }).join("");
    infoHTML += '<div class="result-collapsible">';
    infoHTML += '<button class="result-collapsible-btn" aria-expanded="false" data-body="rc-generics">';
    infoHTML += '<span>Generic alternatives</span><span class="result-collapsible-count">' + product.genericAlternatives.length + '</span><span class="result-chevron" aria-hidden="true">▼</span>';
    infoHTML += '</button>';
    infoHTML += '<div id="rc-generics" class="result-collapsible-body hidden"><ul>' + genericItems + '</ul></div>';
    infoHTML += '</div>';
  }

  infoHTML += '<a href="' + product.labelUrl + '" class="result-label-link" target="_blank" rel="noopener noreferrer">View full product label ↗</a>';

  document.getElementById("info").innerHTML = infoHTML;
  wireResultCollapsibles();

  document.getElementById("results").classList.remove("hidden");
}

// ─── WIRE COLLAPSIBLES IN RESULT INFO CARD ────────────────────────────────────

function wireResultCollapsibles() {
  document.querySelectorAll("#info .result-collapsible-btn").forEach(function(btn) {
    btn.addEventListener("click", function() {
      var bodyId   = btn.dataset.body;
      var body     = document.getElementById(bodyId);
      if (!body) return;
      var expanded = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!expanded));
      body.classList.toggle("hidden", expanded);
    });
  });
}

// ─── RENDER BOTTLE CALCULATION ────────────────────────────────────────────────

function renderBottles() {
  var product = getSelectedProduct();
  if (!product) return;
  var sqft = getAreaSqFt();
  if (sqft <= 0) return;
  var containerOz = parseFloat(document.getElementById("size-select").value);
  if (!containerOz) return;

  var turfType      = document.getElementById("turf-type").value || null;
  var rateTierLabel = document.getElementById("use-type").value  || null;
  var calc = calculate(product, sqft, turfType, rateTierLabel);
  if (!calc) return;

  var result = calcContainers(calc.amountMax, containerOz);

  document.getElementById("bottle-result").innerHTML =
    '<div class="result-stat"><span class="result-stat-label">Containers to buy</span><span class="result-stat-value result-stat-highlight">' + result.needed + '</span></div>' +
    '<div class="result-stat"><span class="result-stat-label">Total purchased</span><span class="result-stat-value">' + result.totalPurchased + ' oz</span></div>' +
    '<div class="result-stat"><span class="result-stat-label">Leftover after max rate</span><span class="result-stat-value">' + result.leftover + ' oz</span></div>';
}

// ─── RESET CALCULATOR ────────────────────────────────────────────────────────

function resetCalculator() {
  document.getElementById("len").value         = "";
  document.getElementById("wid").value         = "";
  document.getElementById("sqft").value        = "";
  document.getElementById("dim-unit").value    = "ft";
  document.getElementById("area-unit").value   = "ft";
  document.getElementById("product").value     = "";
  document.getElementById("result-unit").value = "base";
  document.getElementById("use-row").classList.add("hidden");
  document.getElementById("use-type").innerHTML = "";
  document.getElementById("results").classList.add("hidden");
  document.getElementById("turf-status-banner").innerHTML = "";
  updateAreaUnitLabel();
  resetCustomSelect("turf-type");
}