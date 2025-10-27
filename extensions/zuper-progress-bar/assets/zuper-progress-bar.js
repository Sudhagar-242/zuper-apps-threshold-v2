// Support both shapes: window.goal_discounts = [{...}] or { goals: [...] }
const goals =
  (window.goal_discounts && window.goal_discounts.goals) ||
  window.goal_discounts ||
  [];
console.log("Goals data:", goals);
let progressUpdated = false;
let lastProgress = 0;
// track last shown current goal index to detect completions
let lastCurrentIndex = null;

const handleUpdate = () => {
  updateProgress();
};

// --- Helpers: evaluate a single goal and find current/next ---
function safeNumber(v) {
  if (v === null || typeof v === "undefined") return NaN;
  if (typeof v === "number") return v;
  if (typeof v === "string") return v.trim() === "" ? NaN : Number(v);
  return NaN;
}

function parseProductsField(field) {
  if (!field) return [];
  if (Array.isArray(field)) return field;
  try {
    return JSON.parse(field);
  } catch (e) {
    return [];
  }
}

function normalizeProductId(raw) {
  if (raw === null || typeof raw === "undefined") return "";
  // If it's an object with id property
  if (typeof raw === "object" && raw.id) raw = raw.id;
  const s = String(raw);
  // strip common gid prefixes like gid://shopify/Product/123456
  const match = s.match(/\/(\d+)$/);
  if (match) return match[1];
  // fallback: remove gid://... prefix if present
  return s.replace(/^gid:\/\/[^/]+\//, "");
}

function showCompletionMessage(message, duration = 3000) {
  try {
    let container = document.getElementById('goal-multi-progress');
    if (!container) {
      container = document.body;
    }
    let el = document.getElementById('goal-complete-msg');
    if (!el) {
      el = document.createElement('div');
      el.id = 'goal-complete-msg';
      el.style.background = '#e6ffe6';
      el.style.border = '1px solid #2e7d32';
      el.style.padding = '8px 10px';
      el.style.marginTop = '8px';
      el.style.borderRadius = '6px';
      el.style.fontWeight = '600';
      container.appendChild(el);
    }
    el.textContent = message;
    el.style.display = '';
    setTimeout(() => {
      try {
        el.style.display = 'none';
      } catch (e) {}
    }, duration);
  } catch (err) {
    console.error('showCompletionMessage error', err);
  }
}

function formatCompletionMessage(goal, template) {
  if (!template) return '';
  const discount = goal && goal.cartDiscount ? `${goal.cartDiscount}%` : '';
  return template.replace(/%discount%/g, discount).replace(/%remaining%/g, '0');
}

function evaluateGoalProgress(goal, cartSnapshot) {
  const cartTotal = Number(cartSnapshot.original_total_price || 0);
  const cartQty = Number(cartSnapshot.item_count || 0);

  if (!goal || !goal.condition) return { unlocked: false, percent: 0 };

  if (goal.condition === "cart_value") {
    const priceDollars = safeNumber(goal.price);
    if (!Number.isFinite(priceDollars) || priceDollars <= 0)
      return { unlocked: false, percent: 0 };
    const target = Math.round(priceDollars * 100); // cents
    const percent = Math.min(100, (cartTotal / target) * 100);
    return {
      unlocked: cartTotal >= target,
      percent: Math.max(0, Math.round(percent)),
    };
  }

  if (goal.condition === "cart_quantity") {
    const targetQty = safeNumber(goal.cartQuantity);
    if (!Number.isFinite(targetQty) || targetQty <= 0)
      return { unlocked: false, percent: 0 };
    const percent = Math.min(100, (cartQty / targetQty) * 100);
    return {
      unlocked: cartQty >= targetQty,
      percent: Math.max(0, Math.round(percent)),
    };
  }

  if (goal.condition === "has_product") {
    const required = parseProductsField(goal.products).map((p) =>
      normalizeProductId((p && p.id) || p),
    );
    if (!required.length) return { unlocked: false, percent: 0 };
    const cartIds = new Set(
      (cartSnapshot.items || []).map((i) => String(i.product_id)),
    );
    // Normalize cart ids too (strip any gid prefixes)
    const normalizedCartIds = new Set(
      Array.from(cartIds).map((id) => normalizeProductId(id)),
    );
    const hasAny = required.some((id) => normalizedCartIds.has(id));
    const hasAll = required.every((id) => normalizedCartIds.has(id));
    return { unlocked: hasAll, percent: hasAll ? 100 : hasAny ? 50 : 0 };
  }

  return { unlocked: false, percent: 0 };
}

function findCurrentAndNextGoal(goalsArray, cartSnapshot) {
  const matches = (goalsArray || []).map((g, i) => {
    const { unlocked, percent } = evaluateGoalProgress(g, cartSnapshot);
    return { goal: g, index: i, unlocked, percent };
  });

  // One-to-one progression: next is the first goal that is NOT unlocked
  const firstNotUnlocked = matches.findIndex((m) => !m.unlocked);
  let nextIndex = null;
  if (firstNotUnlocked === -1) {
    // all unlocked -> no next
    nextIndex = null;
  } else {
    nextIndex = firstNotUnlocked;
  }

  const currentIndex = nextIndex === null ? (matches.length ? matches.length - 1 : null) : (nextIndex > 0 ? nextIndex - 1 : null);
  const current = currentIndex !== null ? matches[currentIndex].goal : null;
  const next = nextIndex !== null ? matches[nextIndex].goal : null;
  const progressForNext = nextIndex !== null ? matches[nextIndex].percent : null;

  return {
    current,
    currentIndex,
    next,
    nextIndex,
    progressForNext,
    matches,
  };
}

document.addEventListener("DOMContentLoaded", () => {
  const insertionSelectors = [
    "#CartDrawer .drawer__footer",
    ".cart-drawer__content .cart-drawer__summary .cart__summary-totals",
    ".cart-drawer__footer",
    ".cart-footer",
    ".site-footer",
  ];

  const findInsertParent = () => {
    for (const sel of insertionSelectors) {
      const el = document.querySelector(sel);
      if (el) return { el, sel };
    }
    return null;
  };

  const found = findInsertParent();
  const parentElement = found ? found.el : null;
  if (found) console.log("progress bar parent selector used:", found.sel);

  // Only insert the progress bar once
  if (parentElement && !document.querySelector("#goal-multi-progress")) {
    console.log("Inserting progress bar...");

    // Insert progress bar HTML
    parentElement.insertAdjacentHTML(
      "beforebegin",
      `
      <div id="goal-multi-progress" class="progress-container">
        <p>Goal Progress: <span id="progress-text">0%</span></p>
        <div id="progress-bar" class="progress-bar"></div>
      </div>
    `,
    );

    // After insertion, check if the progress bar is properly added to the DOM
    console.log(document.querySelector("#goal-multi-progress")); // Should show the inserted progress bar

    // Initial progress value update
    handleUpdate();
  }

  // MutationObserver to handle cart rerenders
  new MutationObserver(() => {
    const found2 = findInsertParent();
    const parentElement = found2 ? found2.el : null;
    if (found2)
      console.log("mutation observer found parent selector:", found2.sel);

    // Avoid triggering updates if the progress has already been updated
    if (!parentElement || progressUpdated) return;

    // If progress bar doesn't exist, insert it again
    if (!document.querySelector("#goal-multi-progress")) {
      console.log("Re-inserting progress bar...", lastProgress);
      if (parentElement) {
        parentElement.insertAdjacentHTML(
          "beforebegin",
          `
            <div id="goal-multi-progress" class="progress-container">
              <p>Goal Progress: <span id="progress-text">${lastProgress}%</span></p>
              <div id="progress-bar" class="progress-bar" style="width: ${lastProgress}%"></div>
            </div>
          `,
        );
      } else {
        // Fallback: insert at top of body so it's always visible for debugging
        console.warn(
          "No insertion parent found — falling back to document.body.prepend",
        );
        const frag = document.createRange().createContextualFragment(`
          <div id="goal-multi-progress" class="progress-container">
            <p>Goal Progress: <span id="progress-text">${lastProgress}%</span></p>
            <div id="progress-bar" class="progress-bar" style="width: ${lastProgress}%"></div>
          </div>
        `);
        document.body.prepend(frag);
      }
      console.log("Progress bar re-inserted!", lastProgress);
      setTimeout(() => {
        handleUpdate();
      }, 100);
    }
  }).observe(document.body, { childList: true, subtree: true });
});

// Listen to common cart events and trigger updates
document.addEventListener("cart:change", handleUpdate);
document.addEventListener("cart:updated", handleUpdate);
window.addEventListener("cart:updated", handleUpdate);

// Function to update progress with animation
function updateProgress() {
  const progressText = document.querySelector("#progress-text");
  const progressBar = document.querySelector("#progress-bar");

  if (progressText && progressBar) {
    // Fetch fresh cart and compute actual progress toward next goal
    fetch("/cart.js")
      .then((r) => r.json())
      .then((cartData) => {
        // Normalize cart snapshot
        const snapshot = {
          original_total_price:
            cartData.original_total_price ?? cartData.total_price ?? 0,
          item_count: cartData.item_count ?? 0,
          items: cartData.items ?? [],
        };

        const res = findCurrentAndNextGoal(goals, snapshot);
        // Detect completion transitions for one-to-one progression
        if (res.currentIndex !== null && res.currentIndex !== lastCurrentIndex) {
          // newly completed goal
          const completedMatch = res.matches[res.currentIndex];
          if (completedMatch && completedMatch.unlocked) {
            const goal = completedMatch.goal || {};
            const rawMsg = goal.confirmationMessage || goal.discountAppliedMessage || 'Goal completed';
            const msg = formatCompletionMessage(goal, rawMsg);
            showCompletionMessage(msg, 3000);
          }
          lastCurrentIndex = res.currentIndex;
        }
        if (res.currentIndex === null && lastCurrentIndex !== null) {
          // reset if no current
          lastCurrentIndex = null;
        }
        // Log goal statuses for debugging
        try {
          console.groupCollapsed("zuper-progress-goals-status");
          console.log("Goals array length:", (goals || []).length);
          console.log("Cart snapshot:", snapshot);
          console.log(
            "Matches:",
            res.matches.map((m) => ({
              index: m.index,
              unlocked: m.unlocked,
              percent: m.percent,
            })),
          );
          console.log(
            "currentIndex:",
            res.currentIndex,
            "nextIndex:",
            res.nextIndex,
            "progressForNext:",
            res.progressForNext,
          );
          console.groupEnd();
        } catch (err) {
          console.error("logging error", err);
        }
        // pick percent to show: progress toward next goal, or 100 if current exists and no next
        let percentToShow = 0;
        if (
          res.progressForNext !== null &&
          typeof res.progressForNext !== "undefined"
        ) {
          percentToShow = res.progressForNext;
        } else if (res.current) {
          percentToShow = 100;
        }

        progressText.textContent = `${Math.round(percentToShow)}%`;
        progressBar.style.width = `${Math.round(percentToShow)}%`;
        lastProgress = Math.round(percentToShow);
      })
      .catch(() => {
        // fallback to lastProgress on error
        progressText.textContent = `${lastProgress}%`;
        progressBar.style.width = `${lastProgress}%`;
      });

    // Mark progress as updated to prevent infinite loop
    progressUpdated = true;

    // Reset progressUpdated flag after a delay, to allow future updates
    setTimeout(() => {
      progressUpdated = false;
    }, 1000); // Adjust the timeout as needed to control update frequency
  }
}
