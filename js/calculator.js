// calculator.js

// ─── UNIT LABEL MAP ───────────────────────────────────────────────────────────

const AREA_UNIT_LABELS = { ft: "sq ft", yd: "sq yd", m: "sq m" };

// ─── UPDATE AREA UNIT LABEL ───────────────────────────────────────────────────

function updateAreaUnitLabel() {
  const unit = document.getElementById("dim-unit").value;
  const label = document.getElementById("area-unit-label");
  if (label) label.textContent = AREA_UNIT_LABELS[unit] || "sq ft";
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
  const len  = parseFloat(document.getElementById("len").value)  || 0;
  const wid  = parseFloat(document.getElementById("wid").value)  || 0;
  const unit = document.getElementById("dim-unit").value;
  const totalArea = parseFloat(document.getElementById("sqft").value) || 0;

  const rawArea = (len > 0 && wid > 0) ? len * wid : totalArea;
  if (rawArea <= 0) return 0;

  switch (unit) {
    case "ft": return rawArea;
    case "yd": return rawArea * 9;
    case "m":  return rawArea * 10.7639;
    default:   return rawArea;
  }
}

// ─── DISPLAY AREA IN USER'S UNIT ─────────────────────────────────────────────

function displayArea(sqft) {
  const unit = document.getElementById("dim-unit").value;
  switch (unit) {
    case "yd": return round(sqft / 9)       + " sq yd";
    case "m":  return round(sqft / 10.7639) + " sq m";
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
    p.turfTypes.forEach(function(t) { allTurfs.add(t); });
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
  if (product.turfTypes.includes(turfType)) return "safe";
  const isUnsafe = product.notSafeTurf.some(function(entry) {
    return entry.toLowerCase().indexOf(turfType.toLowerCase()) === 0;
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
    const turfMatch = product.turfRates.find(function(g) { return g.turfGroup.includes(turfType); });
    const tier = product.rateTiers.find(function(t) { return t.label === rateTierLabel; });
    if (!turfMatch || !tier) return null;
    const rate = Math.min(tier.ozPer1k, turfMatch.rateMax);
    return { rateMin: rate, rateMax: turfMatch.rateMax };
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
  const water         = product.waterPerUnit * k;
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
  const product = getSelectedProduct();
  if (!product) return;
  const sqft = getAreaSqFt();
  if (sqft <= 0) return;

  const turfType      = document.getElementById("turf-type").value || null;
  const rateTierLabel = document.getElementById("use-type").value  || null;
  const displayUnit   = document.getElementById("result-unit").value;

  const calc = calculate(product, sqft, turfType, rateTierLabel);
  if (!calc) return;

  const min          = convertAmount(calc.amountMin, product.formulation, displayUnit);
  const max          = convertAmount(calc.amountMax, product.formulation, displayUnit);
  const waterRounded = round(calc.water);

  let turfWarningHTML = "";
  if (turfType && product.notSafeTurf && product.notSafeTurf.includes(turfType)) {
    turfWarningHTML = `<p id="turf-warning">⚠️ ${product.fullName} is <strong>NOT SAFE</strong> for ${turfType}. <strong>DO NOT APPLY</strong>.</p>`;
  }

  let metricsHTML = `
    ${turfWarningHTML}
    <p><strong>Area:</strong> ${displayArea(sqft)}</p>
    <p><strong>Product needed:</strong> ${
      min.value === max.value
        ? `${max.value} ${max.unit}`
        : `${min.value} – ${max.value} ${max.unit}`
    }</p>
    <p><strong>Water / carrier:</strong> ${waterRounded} gal</p>
  `;

  if (calc.overAnnualMax) {
    metricsHTML += `<p id="annual-warning">⚠️ Amount exceeds annual maximum of ${round(calc.annualMax)} oz per application cycle. Split into multiple applications.</p>`;
  }

  document.getElementById("metrics").innerHTML = metricsHTML;

  const sizeSelect = document.getElementById("size-select");
  sizeSelect.innerHTML = "";
  product.containerSizes.forEach(function(s) {
    const opt = document.createElement("option");
    opt.value = s.oz;
    opt.textContent = s.label;
    sizeSelect.appendChild(opt);
  });

  renderBottles();

  let infoHTML = `<h3>${product.fullName}</h3>`;
  infoHTML += `<p><strong>Type:</strong> ${product.type}</p>`;
  infoHTML += `<p><strong>Active ingredients:</strong> ${product.activeIngredients.join(", ")}</p>`;
  infoHTML += `<p><strong>EPA toxicity level:</strong> ${product.EPAtoxicityLevel}</p>`;
  infoHTML += `<p><strong>Re-entry interval:</strong> ${product.reentryInterval}</p>`;

  if (product.applicationNotes && product.applicationNotes.length) {
    infoHTML += `<p><strong>Application notes:</strong></p><ul>`;
    product.applicationNotes.forEach(function(n) { infoHTML += `<li>${n}</li>`; });
    infoHTML += `</ul>`;
  }
  if (product.restrictions && product.restrictions.length) {
    infoHTML += `<p><strong>Restrictions:</strong></p><ul>`;
    product.restrictions.forEach(function(r) { infoHTML += `<li>${r}</li>`; });
    infoHTML += `</ul>`;
  }
  if (product.genericAlternatives && product.genericAlternatives.length) {
    infoHTML += `<p><strong>Generic alternatives:</strong></p><ul>`;
    product.genericAlternatives.forEach(function(g) {
      infoHTML += `<li><strong>${g.fullName}</strong> — ${g.activeIngredient}. ${g.note}</li>`;
    });
    infoHTML += `</ul>`;
  }
  infoHTML += `<p><a href="${product.labelUrl}" target="_blank">View full product label ↗</a></p>`;

  document.getElementById("info").innerHTML = infoHTML;
  document.getElementById("results").classList.remove("hidden");
}

// ─── RENDER BOTTLE CALCULATION ────────────────────────────────────────────────

function renderBottles() {
  const product = getSelectedProduct();
  if (!product) return;
  const sqft = getAreaSqFt();
  if (sqft <= 0) return;
  const containerOz = parseFloat(document.getElementById("size-select").value);
  if (!containerOz) return;

  const turfType      = document.getElementById("turf-type").value || null;
  const rateTierLabel = document.getElementById("use-type").value  || null;
  const calc = calculate(product, sqft, turfType, rateTierLabel);
  if (!calc) return;

  const result = calcContainers(calc.amountMax, containerOz);
  document.getElementById("bottle-result").innerHTML = `
    <p><strong>Containers to buy:</strong> ${result.needed}</p>
    <p><strong>Total purchased:</strong> ${result.totalPurchased} oz</p>
    <p><strong>Leftover after max rate:</strong> ${result.leftover} oz</p>
  `;
}

// ─── RESET CALCULATOR ────────────────────────────────────────────────────────

function resetCalculator() {
  document.getElementById("len").value         = "";
  document.getElementById("wid").value         = "";
  document.getElementById("sqft").value        = "";
  document.getElementById("dim-unit").value    = "ft";
  document.getElementById("product").value     = "";
  document.getElementById("result-unit").value = "base";
  document.getElementById("use-row").classList.add("hidden");
  document.getElementById("use-type").innerHTML = "";
  document.getElementById("results").classList.add("hidden");
  document.getElementById("turf-status-banner").innerHTML = "";
  updateAreaUnitLabel();
  resetCustomSelect("turf-type");
}