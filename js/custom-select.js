// custom-select.js

function initCustomSelect(wrapperEl, options) {
  const hiddenInputId = wrapperEl.dataset.hiddenInput;
  const hiddenInput = document.getElementById(hiddenInputId);
  const trigger = wrapperEl.querySelector(".custom-select-trigger");
  const panel = wrapperEl.querySelector(".custom-select-panel");

  // Build the option buttons
  options.forEach(function(optionText) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "custom-select-option";
    btn.textContent = optionText;
    btn.addEventListener("click", function() {
      hiddenInput.value = optionText;
      trigger.textContent = optionText;
      closePanel();
      hiddenInput.dispatchEvent(new Event("change")); // in case anything listens for change later
    });
    panel.appendChild(btn);
  });

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
  hiddenInput.value    = "";
  trigger.textContent  = "— select your turf —";
  panel.classList.remove("open");
}