// custom-select.js

function initCustomSelect(wrapperEl, options) {
  const hiddenInputId = wrapperEl.dataset.hiddenInput;
  const hiddenInput = document.getElementById(hiddenInputId);
  const trigger = wrapperEl.querySelector(".custom-select-trigger");
  const panel = wrapperEl.querySelector(".custom-select-panel");

  // Remember the original placeholder text so resetCustomSelect can restore it
  if (!trigger.dataset.placeholder) {
    trigger.dataset.placeholder = trigger.textContent;
  }

  panel.innerHTML = "";

  // Search box — filters the option list below as the user types
  const search = document.createElement("input");
  search.type = "text";
  search.className = "custom-select-search";
  search.placeholder = "Type to filter...";
  search.autocomplete = "off";
  panel.appendChild(search);

  const optionList = document.createElement("div");
  optionList.className = "custom-select-option-list";
  panel.appendChild(optionList);

  const noResults = document.createElement("div");
  noResults.className = "custom-select-no-results hidden";
  noResults.textContent = "No matches found";
  panel.appendChild(noResults);

  // Normalize options to { label, value } pairs. Plain strings use the same
  // text for both (turf types). Pass { label, value } objects when the
  // displayed text should differ from the stored value (e.g. showing a
  // product's full name while storing its id).
  const normalized = options.map(function(o) {
    return typeof o === "string" ? { label: o, value: o } : o;
  });

  normalized.forEach(function(opt) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "custom-select-option";
    btn.textContent = opt.label;
    btn.dataset.searchText = opt.label.toLowerCase();
    btn.addEventListener("click", function() {
      hiddenInput.value = opt.value;
      trigger.textContent = opt.label;
      closePanel();
      hiddenInput.dispatchEvent(new Event("change")); // in case anything listens for change later
    });
    optionList.appendChild(btn);
  });

  function filterOptions() {
    const query = search.value.toLowerCase().trim();
    let visibleCount = 0;
    optionList.querySelectorAll(".custom-select-option").forEach(function(btn) {
      const match = btn.dataset.searchText.includes(query);
      btn.classList.toggle("hidden", !match);
      if (match) visibleCount++;
    });
    noResults.classList.toggle("hidden", visibleCount !== 0);
  }

  search.addEventListener("input", filterOptions);
  search.addEventListener("click", function(e) { e.stopPropagation(); });

  function openPanel() {
    // Close any other open custom selects first
    document.querySelectorAll(".custom-select-panel.open").forEach(function(p) {
      if (p !== panel) p.classList.remove("open");
    });

    panel.classList.add("open");

    // Decide whether to drop down or flip upward, and cap height to fit
    const triggerRect = trigger.getBoundingClientRect();
    const spaceBelow = window.innerHeight - triggerRect.bottom;
    const spaceAbove = triggerRect.top;

    panel.classList.remove("flip-up");
    if (spaceBelow < 150 && spaceAbove > spaceBelow) {
      panel.classList.add("flip-up");
    }

    search.value = "";
    filterOptions();
    search.focus();
  }

  function closePanel() {
    panel.classList.remove("open");
  }

  trigger.addEventListener("click", function(e) {
    e.stopPropagation();
    if (panel.classList.contains("open")) {
      closePanel();
    } else {
      openPanel();
    }
  });

  // Close when clicking anywhere outside this dropdown
  document.addEventListener("click", function(e) {
    if (!wrapperEl.contains(e.target)) {
      closePanel();
    }
  });
}

// Reset a custom select back to its placeholder state
function resetCustomSelect(hiddenInputId) {
  const wrapper = document.querySelector(`[data-hidden-input="${hiddenInputId}"]`);
  if (!wrapper) return;
  const hiddenInput = document.getElementById(hiddenInputId);
  const trigger    = wrapper.querySelector(".custom-select-trigger");
  const panel      = wrapper.querySelector(".custom-select-panel");
  const search     = panel.querySelector(".custom-select-search");

  hiddenInput.value    = "";
  trigger.textContent  = trigger.dataset.placeholder || trigger.textContent;
  panel.classList.remove("open");
  if (search) search.value = "";
  panel.querySelectorAll(".custom-select-option").forEach(function(btn) {
    btn.classList.remove("hidden");
  });
  const noResults = panel.querySelector(".custom-select-no-results");
  if (noResults) noResults.classList.add("hidden");
}