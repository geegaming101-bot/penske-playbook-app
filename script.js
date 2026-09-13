// ==============================
// PENSKE PLAYBOOK APP
// Confirmation V1 + Existing Playbook/Training
// ==============================

let currentMode = "playbook";
let currentProcedure = null;
let trainingScore = 0;
let trainingAttempts = 0;
let currentScenario = null;

const playbookModeBtn = document.getElementById("playbookModeBtn");
const trainingModeBtn = document.getElementById("trainingModeBtn");
const howToModeBtn = document.getElementById("howToModeBtn");

const playbookHome = document.getElementById("playbookHome");
const howToView = document.getElementById("howToView");
const procedureView = document.getElementById("procedureView");
const trainingView = document.getElementById("trainingView");

const procedureGrid = document.getElementById("procedureGrid");
const howToGrid = document.getElementById("howToGrid");
const procedureSearch = document.getElementById("procedureSearch");

const EVERYDAY_PROCEDURE_IDS = [1, 2, 3, 18];
const HOW_TO_PROCEDURE_IDS = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 19];

function everydayProcedures() {
  return procedures.filter((procedure) => EVERYDAY_PROCEDURE_IDS.includes(procedure.id));
}

function howToProcedures() {
  return procedures.filter((procedure) => HOW_TO_PROCEDURE_IDS.includes(procedure.id));
}

const backToPlaybookBtn = document.getElementById("backToPlaybookBtn");

const procedureNumber = document.getElementById("procedureNumber");
const procedureTitle = document.getElementById("procedureTitle");
const procedureDescription = document.getElementById("procedureDescription");
const procedureContent = document.getElementById("procedureContent");

const scenarioCategory = document.getElementById("scenarioCategory");
const scenarioQuestion = document.getElementById("scenarioQuestion");
const scenarioAnswers = document.getElementById("scenarioAnswers");
const scenarioFeedback = document.getElementById("scenarioFeedback");

const nextScenarioBtn = document.getElementById("nextScenarioBtn");
const resetScoreBtn = document.getElementById("resetScoreBtn");
const scoreDisplay = document.getElementById("scoreDisplay");

function initializeApp() {
  renderProcedures(everydayProcedures());
  updateScoreDisplay();
  showPlaybookHome();
}

initializeApp();

// ==============================
// PLAYBOOK HOME
// ==============================

function renderProcedures(procedureList, targetGrid = procedureGrid) {
  targetGrid.innerHTML = "";

  if (procedureList.length === 0) {
    targetGrid.innerHTML = `
      <div class="empty-state">
        <p>No procedures found.</p>
      </div>
    `;
    return;
  }

  procedureList.forEach((procedure, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "procedure-button";
    const displayNumber = index + 1;

    button.innerHTML = `
      <span class="procedure-button-number">${displayNumber}</span>
      <span class="procedure-button-text">
        <strong>${procedure.title}</strong>
        <small>${procedure.description}</small>
      </span>
      <span class="procedure-button-arrow">→</span>
    `;

    button.addEventListener("click", () => {
      openProcedure(procedure.id);
    });

    targetGrid.appendChild(button);
  });
}

function openProcedure(procedureId) {
  const procedure = procedures.find((item) => item.id === procedureId);

  if (!procedure) {
    console.error(`Procedure ${procedureId} was not found.`);
    return;
  }

  currentProcedure = procedure;

  if (procedure.id === 13) {
    openYardCheckWorkspace();
    return;
  }

  const everydayIndex = everydayProcedures().findIndex((item) => item.id === procedure.id);
  const howToIndex = howToProcedures().findIndex((item) => item.id === procedure.id);
  const displayNumber = everydayIndex >= 0 ? everydayIndex + 1 : howToIndex + 1;
  const displayLabel = everydayIndex >= 0 ? "Playbook" : "How-To";

  procedureNumber.textContent = `${displayLabel} #${displayNumber}`;
  procedureTitle.textContent = procedure.title;
  procedureDescription.textContent = procedure.description;
  procedureContent.innerHTML = "";

  // Confirmation gets its own interactive builder.
  if (procedure.id === 1) {
    renderConfirmationBuilder();
  } else if (procedure.id === 2) {
    renderCallbackBuilder();
  } else if (procedure.id === 3) {
    renderVehicleLog();
  } else if (procedure.id === 18) {
    renderDistrictBranchesTool(procedure);
  } else {
    renderStandardProcedure(procedure);
  }

  playbookHome.classList.add("hidden");
  howToView?.classList.add("hidden");
  trainingView.classList.add("hidden");
    document.getElementById("callsView")?.classList.add("hidden");
    document.getElementById("callsModeBtn")?.classList.remove("active");
  procedureView.classList.remove("hidden");

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function renderStandardProcedure(procedure) {
  procedure.sections.forEach((section, sectionIndex) => {
    const sectionElement = document.createElement("section");
    sectionElement.className = "procedure-section";

    const heading = document.createElement("h3");
    heading.textContent = section.heading;
    sectionElement.appendChild(heading);

    const headingName = section.heading.toLowerCase();

    if (
      headingName.includes("important") ||
      headingName.includes("warning") ||
      headingName.includes("remember")
    ) {
      sectionElement.classList.add("important-section");
    }

    if (
      headingName.includes("memory tip") ||
      headingName.includes("shortcut")
    ) {
      sectionElement.classList.add("memory-section");
    }

    if (headingName.includes("when to use")) {
      sectionElement.classList.add("when-section");
    }

    if (
      headingName.includes("what to say") ||
      headingName.includes("script")
    ) {
      sectionElement.classList.add("script-section");
    }

    let list;

    if (
      procedure.type === "procedure" ||
      procedure.type === "decision"
    ) {
      list = document.createElement("ol");
      list.className = "procedure-step-list";
    } else if (procedure.type === "script") {
      list = document.createElement("ul");
      list.className = "script-list";
    } else {
      list = document.createElement("ul");
      list.className = "reference-list";
    }

    section.items.forEach((item) => {
      const listItem = document.createElement("li");
      listItem.textContent = item;
      list.appendChild(listItem);
    });

    sectionElement.appendChild(list);
    procedureContent.appendChild(sectionElement);

    if (sectionIndex < procedure.sections.length - 1) {
      const divider = document.createElement("hr");
      divider.className = "procedure-divider";
      procedureContent.appendChild(divider);
    }
  });
}

function renderDistrictBranchesTool(procedure) {
  const branchLines = procedure.sections
    .flatMap((section) => section.items || [])
    .filter((item) => /^\d{4}-\d{2}\s+—\s+/.test(item));

  const branches = branchLines.map((line) => {
    const separatorIndex = line.indexOf("—");
    return {
      code: line.slice(0, separatorIndex).trim(),
      name: line.slice(separatorIndex + 1).trim()
    };
  });

  procedureContent.innerHTML = `
    <section class="district-branch-tool">
      <label class="branch-search-wrap" for="districtBranchSearch">
        <span class="mini-label">SEARCH BRANCHES</span>
        <input id="districtBranchSearch" type="search" placeholder="City or branch code..." autocomplete="off" />
      </label>
      <div id="districtBranchResults" class="district-branch-results"></div>
    </section>
  `;

  const input = document.getElementById("districtBranchSearch");
  const results = document.getElementById("districtBranchResults");

  function draw(query = "") {
    const term = query.trim().toLowerCase();
    const filtered = branches.filter((branch) =>
      !term ||
      branch.code.toLowerCase().includes(term) ||
      branch.name.toLowerCase().includes(term)
    );

    if (!filtered.length) {
      results.innerHTML = `<div class="empty-state"><strong>No branch found.</strong><span>Try a city or branch code.</span></div>`;
      return;
    }

    results.innerHTML = filtered.map((branch) => `
      <article class="district-branch-card">
        <div class="district-branch-info">
          <strong>${escapeHtml(branch.name)}</strong>
          <span>${escapeHtml(branch.code)}</span>
        </div>
        <button class="secondary-btn small-btn branch-copy-btn" type="button" data-copy-branch="${escapeHtml(branch.code)}">Copy Code</button>
      </article>
    `).join("");

    results.querySelectorAll("[data-copy-branch]").forEach((button) => {
      button.addEventListener("click", async () => {
        const code = button.dataset.copyBranch || "";
        try {
          await navigator.clipboard.writeText(code);
          button.textContent = "Copied";
          setTimeout(() => { button.textContent = "Copy Code"; }, 1200);
        } catch {
          window.prompt("Copy branch code:", code);
        }
      });
    });
  }

  input?.addEventListener("input", (event) => draw(event.target.value));
  draw();
}


// ==============================
// YARD CHECK V1
// Photo Import + Yard Mode
// ==============================

const YARD_SESSION_KEY = "penskeYardCheckSessionV1";
const YARD_DB_NAME = "PenskePlaybookYardCheck";
const YARD_DB_VERSION = 1;
const YARD_PAGE_STORE = "yardPages";
let yardActiveListFilter = "loaded";

function makeEmptyYardSession() {
  return {
    sessionId: "",
    createdAt: "",
    sourceType: "photos",
    sourcePages: 0,
    units: []
  };
}

function loadYardSession() {
  try {
    const parsed = JSON.parse(localStorage.getItem(YARD_SESSION_KEY) || "null");
    return parsed && Array.isArray(parsed.units) ? parsed : makeEmptyYardSession();
  } catch (error) {
    return makeEmptyYardSession();
  }
}

function saveYardSession(session) {
  localStorage.setItem(YARD_SESSION_KEY, JSON.stringify(session));
  renderYardDashboard();
  renderYardResearchList();
  renderYardListBrowser();
}

function openYardCheckWorkspace() {
  currentMode = "howto";
  setActiveModeButton("howto");

  playbookHome.classList.add("hidden");
  howToView?.classList.add("hidden");
  procedureView.classList.add("hidden");
  trainingView.classList.add("hidden");
  document.getElementById("callsView")?.classList.add("hidden");
  document.getElementById("yardCheckWorkspace")?.classList.remove("hidden");
  document.getElementById("callsModeBtn")?.classList.remove("active");

  renderYardDashboard();
  renderYardSelectedFiles();
  renderYardImportReview();
  renderYardResearchList();

  const session = loadYardSession();
  if (session.units.length) {
    document.getElementById("yardModePanel")?.classList.remove("hidden");
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function openYardDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(YARD_DB_NAME, YARD_DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(YARD_PAGE_STORE)) {
        db.createObjectStore(YARD_PAGE_STORE, { keyPath: "key" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function saveYardPageImage(sessionId, pageNumber, dataUrl, fileName) {
  const db = await openYardDb();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(YARD_PAGE_STORE, "readwrite");
    const store = tx.objectStore(YARD_PAGE_STORE);
    store.put({
      key: `${sessionId}:${pageNumber}`,
      sessionId,
      pageNumber,
      dataUrl,
      fileName
    });

    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
}

async function getYardPageImage(sessionId, pageNumber) {
  const db = await openYardDb();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(YARD_PAGE_STORE, "readonly");
    const request = tx.objectStore(YARD_PAGE_STORE).get(`${sessionId}:${pageNumber}`);

    request.onsuccess = () => {
      const result = request.result || null;
      db.close();
      resolve(result);
    };
    request.onerror = () => {
      db.close();
      reject(request.error);
    };
  });
}

async function clearYardPageImages(sessionId) {
  if (!sessionId) return;

  const db = await openYardDb();

  return new Promise((resolve, reject) => {
    const tx = db.transaction(YARD_PAGE_STORE, "readwrite");
    const store = tx.objectStore(YARD_PAGE_STORE);
    const request = store.openCursor();

    request.onsuccess = () => {
      const cursor = request.result;
      if (!cursor) return;
      if (cursor.value?.sessionId === sessionId) {
        cursor.delete();
      }
      cursor.continue();
    };

    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
}

function renderYardDashboard() {
  const session = loadYardSession();
  const loaded = session.units.length;
  const checked = session.units.filter((unit) => unit.checked).length;
  const research = session.units.filter((unit) => unit.researchNeeded).length;
  const remaining = Math.max(loaded - checked, 0);

  setText("yardLoadedCount", loaded);
  setText("yardCheckedCount", checked);
  setText("yardResearchCount", research);
  setText("yardRemainingCount", remaining);
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = String(value);
}

function setYardStatus(message, kind = "info") {
  const status = document.getElementById("yardImportStatus");
  if (!status) return;

  status.textContent = message;
  status.className = `yard-status ${kind}`;
  status.classList.remove("hidden");
}

function renderYardSelectedFiles() {
  const input = document.getElementById("yardPhotoInput");
  const target = document.getElementById("yardSelectedFiles");
  if (!target) return;

  const files = Array.from(input?.files || []);

  if (!files.length) {
    target.innerHTML = `<span>No photos selected yet.</span>`;
    return;
  }

  target.innerHTML = `
    <strong>${files.length} page photo${files.length === 1 ? "" : "s"} selected</strong>
    <span>Page numbers will follow this upload order.</span>
  `;
}

async function compressYardPhoto(file) {
  const objectUrl = URL.createObjectURL(file);

  try {
    const image = await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Could not read ${file.name}. Try JPG, PNG, or a screenshot.`));
      img.src = objectUrl;
    });

    const maxDimension = 1800;
    const longestSide = Math.max(image.naturalWidth, image.naturalHeight);
    const scale = Math.min(1, maxDimension / longestSide);

    const width = Math.max(1, Math.round(image.naturalWidth * scale));
    const height = Math.max(1, Math.round(image.naturalHeight * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d", { alpha: false });
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(image, 0, 0, width, height);

    return canvas.toDataURL("image/jpeg", 0.82);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

async function analyzeYardPhotos() {
  const input = document.getElementById("yardPhotoInput");
  const files = Array.from(input?.files || []);
  const button = document.getElementById("analyzeYardPhotosBtn");

  if (!files.length) {
    setYardStatus("Select your Yard Check page photos first.", "warn");
    return;
  }

  if (files.length > 15) {
    setYardStatus("For this version, import up to 15 report pages at one time.", "warn");
    return;
  }

  const oldSession = loadYardSession();
  const sessionId = `yard-${Date.now()}`;

  button.disabled = true;

  try {
    if (oldSession.sessionId) {
      await clearYardPageImages(oldSession.sessionId);
    }

    const collectedUnits = [];

    for (let index = 0; index < files.length; index += 1) {
      const pageNumber = index + 1;
      const file = files[index];

      setYardStatus(`Preparing page ${pageNumber} of ${files.length}...`);

      const dataUrl = await compressYardPhoto(file);
      await saveYardPageImage(sessionId, pageNumber, dataUrl, file.name);

      setYardStatus(`Reading page ${pageNumber} of ${files.length} with AI...`);

      const response = await fetch("/.netlify/functions/yard-check-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageNumber,
          imageDataUrl: dataUrl
        })
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.error ||
          `Page ${pageNumber} could not be analyzed.`
        );
      }

      const pageUnits = Array.isArray(data.units) ? data.units : [];

      pageUnits.forEach((unit, unitIndex) => {
        const unitNumber = String(unit.unitNumber || "").replace(/\D/g, "");

        if (!unitNumber) return;

        collectedUnits.push({
          id: `${sessionId}-${pageNumber}-${unitIndex}-${unitNumber}`,
          unitNumber,
          page: pageNumber,
          owningLocation: String(unit.owningLocation || "").trim(),
          vehicleStatus: String(unit.vehicleStatus || "").trim(),
          vehicleType: String(unit.vehicleType || "").trim(),
          mileage: String(unit.mileage || "").trim(),
          pmInfo: String(unit.pmInfo || "").trim(),
          comments: String(unit.comments || "").trim(),
          confidence: normalizeYardConfidence(unit.confidence),
          physicalLocation: "",
          checked: false,
          researchNeeded: false,
          yardNote: "",
          unlisted: false
        });
      });
    }

    const session = {
      sessionId,
      createdAt: new Date().toISOString(),
      sourceType: "photos",
      sourcePages: files.length,
      units: collectedUnits
    };

    saveYardSession(session);
    renderYardImportReview();

    document.getElementById("yardModePanel")?.classList.add("hidden");

    const needsReview = collectedUnits.filter((unit) => unit.confidence !== "high").length;

    setYardStatus(
      `Imported ${collectedUnits.length} unit row${collectedUnits.length === 1 ? "" : "s"} from ${files.length} page${files.length === 1 ? "" : "s"}. ${needsReview} need${needsReview === 1 ? "s" : ""} extra verification.`,
      "good"
    );
  } catch (error) {
    setYardStatus(error.message || "Yard Check import failed.", "warn");
  } finally {
    button.disabled = false;
  }
}

function normalizeYardConfidence(value) {
  const confidence = String(value || "").toLowerCase();
  return ["high", "medium", "low"].includes(confidence) ? confidence : "medium";
}

function renderYardImportReview() {
  const panel = document.getElementById("yardImportReview");
  const list = document.getElementById("yardReviewList");
  const summary = document.getElementById("yardReviewSummary");

  if (!panel || !list || !summary) return;

  const session = loadYardSession();

  if (!session.units.length) {
    panel.classList.add("hidden");
    list.innerHTML = "";
    summary.innerHTML = "";
    return;
  }

  panel.classList.remove("hidden");

  const questionable = session.units.filter((unit) => unit.confidence !== "high");
  const high = session.units.length - questionable.length;

  summary.innerHTML = `
    <div><strong>${session.units.length}</strong><span>Total rows</span></div>
    <div><strong>${high}</strong><span>High confidence</span></div>
    <div><strong>${questionable.length}</strong><span>Verify</span></div>
  `;

  if (!questionable.length) {
    list.innerHTML = `
      <div class="yard-empty-state">
        <strong>No medium/low-confidence unit numbers were flagged.</strong>
        <span>Still compare anything suspicious with the original report page.</span>
      </div>
    `;
    return;
  }

  list.innerHTML = questionable
    .map((unit) => `
      <article class="yard-review-row">
        <div>
          <strong>Unit ${escapeHtml(unit.unitNumber)}</strong>
          <span>Page ${unit.page} · ${escapeHtml(unit.confidence.toUpperCase())} confidence</span>
          <small>${escapeHtml([unit.vehicleStatus, unit.owningLocation].filter(Boolean).join(" · ") || "Verify against original page")}</small>
        </div>
        <div class="yard-row-actions">
          <button class="secondary-btn small-btn" type="button" data-yard-view-page="${unit.page}">View Page</button>
          <button class="secondary-btn small-btn" type="button" data-yard-correct="${escapeHtml(unit.id)}">Correct</button>
        </div>
      </article>
    `)
    .join("");

  list.querySelectorAll("[data-yard-view-page]").forEach((button) => {
    button.addEventListener("click", () => showYardOriginalPage(Number(button.dataset.yardViewPage)));
  });

  list.querySelectorAll("[data-yard-correct]").forEach((button) => {
    button.addEventListener("click", () => correctYardUnit(button.dataset.yardCorrect));
  });
}

function correctYardUnit(unitId) {
  const session = loadYardSession();
  const unit = session.units.find((item) => item.id === unitId);
  if (!unit) return;

  const corrected = window.prompt(
    "Correct the unit number using the original report:",
    unit.unitNumber
  );

  if (corrected === null) return;

  const cleaned = corrected.replace(/\D/g, "");

  if (!cleaned) {
    window.alert("Enter a valid unit number.");
    return;
  }

  unit.unitNumber = cleaned;
  unit.confidence = "high";

  saveYardSession(session);
  renderYardImportReview();
}

function startYardMode() {
  const session = loadYardSession();

  if (!session.units.length) {
    setYardStatus("Import a Yard Check first.", "warn");
    return;
  }

  const panel = document.getElementById("yardModePanel");
  const input = document.getElementById("yardUnitSearch");

  panel?.classList.remove("hidden");
  panel?.scrollIntoView({ behavior: "smooth", block: "start" });

  if (input) {
    input.value = "";
    input.focus();
  }

  const result = document.getElementById("yardUnitResult");
  if (result) result.innerHTML = "";
}

function searchYardUnit() {
  const input = document.getElementById("yardUnitSearch");
  const result = document.getElementById("yardUnitResult");

  if (!input || !result) return;

  const query = input.value.replace(/\D/g, "");

  if (!query) {
    result.innerHTML = "";
    return;
  }

  const session = loadYardSession();
  const matches = session.units.filter((unit) => unit.unitNumber === query);

  if (!matches.length) {
    result.innerHTML = `
      <article class="yard-result-card yard-not-found-card">
        <span class="yard-result-badge not-found">NOT FOUND ON THIS YARD CHECK</span>
        <h3>Unit ${escapeHtml(query)}</h3>
        <p>
          If you physically found this unit, add it to the Research List.
          The app will not assume why it is missing from the report.
        </p>
        <div class="call-actions">
          <button class="primary-btn" type="button" data-yard-add-unlisted-checked="${escapeHtml(query)}">
            Add to Checked
          </button>
          <button class="secondary-btn" type="button" data-yard-add-unlisted-research="${escapeHtml(query)}">
            Add to Research
          </button>
        </div>
      </article>
    `;

    result.querySelector("[data-yard-add-unlisted-checked]")?.addEventListener("click", () => {
      addUnlistedYardUnit(query, "checked");
    });

    result.querySelector("[data-yard-add-unlisted-research]")?.addEventListener("click", () => {
      addUnlistedYardUnit(query, "research");
    });

    return;
  }

  if (matches.length > 1) {
    result.innerHTML = `
      <div class="yard-duplicate-note">
        This unit appears ${matches.length} times in the imported report. Verify the page/details below.
      </div>
      ${matches.map((unit) => buildYardUnitResultCard(unit)).join("")}
    `;
  } else {
    result.innerHTML = buildYardUnitResultCard(matches[0]);
  }

  attachYardUnitResultEvents();
}

function buildYardUnitResultCard(unit) {
  return `
    <article class="yard-result-card" data-yard-result-id="${escapeHtml(unit.id)}">
      <div class="yard-result-top">
        <div>
          <span class="yard-result-badge found">FOUND · PAGE ${unit.page || "?"}</span>
          <h3>Unit ${escapeHtml(unit.unitNumber)}</h3>
        </div>
        ${unit.page ? `<button class="secondary-btn small-btn" type="button" data-yard-result-view-page="${unit.page}">View Page</button>` : ""}
      </div>

      <dl class="yard-detail-grid">
        <div>
          <dt>System Status</dt>
          <dd>${escapeHtml(unit.vehicleStatus || "Not captured")}</dd>
        </div>
        <div>
          <dt>Owning Location</dt>
          <dd>${escapeHtml(unit.owningLocation || "Not captured")}</dd>
        </div>
        <div>
          <dt>Vehicle Type</dt>
          <dd>${escapeHtml(unit.vehicleType || "Not captured")}</dd>
        </div>
        <div>
          <dt>Mileage</dt>
          <dd>${escapeHtml(unit.mileage || "Not captured")}</dd>
        </div>
        <div>
          <dt>PM Info</dt>
          <dd>${escapeHtml(unit.pmInfo || "Not captured")}</dd>
        </div>
        <div>
          <dt>Comments</dt>
          <dd>${escapeHtml(unit.comments || "None captured")}</dd>
        </div>
      </dl>

      <div class="yard-confidence-line">
        Import confidence:
        <strong>${escapeHtml(unit.confidence.toUpperCase())}</strong>
      </div>

      <span class="mini-label">WHERE DID YOU PHYSICALLY FIND IT?</span>
      <div class="yard-location-grid">
        ${["RL", "A", "B", "C", "D", "GY", "TRI", "SH", "Fuel Island", "Other"].map((location) => `
          <button
            class="yard-location-btn ${unit.physicalLocation === location ? "selected" : ""}"
            type="button"
            data-yard-location="${escapeHtml(location)}"
            data-yard-id="${escapeHtml(unit.id)}"
          >
            <span>${escapeHtml(location)}</span>
            ${yardLocationMeaning(location) ? `<small>${escapeHtml(yardLocationMeaning(location))}</small>` : ""}
          </button>
        `).join("")}
      </div>

      <label class="yard-note-label">
        <span>Yard Note</span>
        <input
          type="text"
          data-yard-note-input="${escapeHtml(unit.id)}"
          value="${escapeHtml(unit.yardNote || "")}"
          placeholder="Optional mismatch / follow-up note"
        />
      </label>

      <div class="call-actions">
        <button class="primary-btn" type="button" data-yard-toggle-checked="${escapeHtml(unit.id)}">
          ${unit.checked ? "Uncheck" : "Mark Checked"}
        </button>
        <button class="secondary-btn" type="button" data-yard-toggle-research="${escapeHtml(unit.id)}">
          ${unit.researchNeeded ? "Remove Research Flag" : "Mark for Research"}
        </button>
        <button class="secondary-btn danger-outline" type="button" data-yard-remove-unit="${escapeHtml(unit.id)}">
          Remove Unit
        </button>
      </div>

      <p class="yard-safety-note">
        Physical row and system status are separate facts. This app does not automatically decide CI,
        Deadline, Available, or another company action from the row alone.
      </p>
    </article>
  `;
}

function attachYardUnitResultEvents() {
  document.querySelectorAll("[data-yard-result-view-page]").forEach((button) => {
    button.addEventListener("click", () => {
      showYardOriginalPage(Number(button.dataset.yardResultViewPage));
    });
  });

  document.querySelectorAll("[data-yard-location]").forEach((button) => {
    button.addEventListener("click", () => {
      updateYardUnit(button.dataset.yardId, {
        physicalLocation: button.dataset.yardLocation
      });
      searchYardUnit();
    });
  });

  document.querySelectorAll("[data-yard-toggle-checked]").forEach((button) => {
    button.addEventListener("click", () => {
      const unitId = button.dataset.yardToggleChecked;
      const session = loadYardSession();
      const unit = session.units.find((item) => item.id === unitId);
      if (!unit) return;

      const note = getYardNoteValue(unitId);
      const nextChecked = !unit.checked;

      updateYardUnit(unitId, {
        checked: nextChecked,
        yardNote: note
      });

      if (nextChecked) {
        const input = document.getElementById("yardUnitSearch");
        const result = document.getElementById("yardUnitResult");

        if (input) input.value = "";
        if (result) {
          result.innerHTML = `
            <div class="yard-next-unit">
              Unit ${escapeHtml(unit.unitNumber)} checked. Ready for the next unit.
            </div>
          `;
        }
        input?.focus();
      } else {
        searchYardUnit();
      }
    });
  });

  document.querySelectorAll("[data-yard-toggle-research]").forEach((button) => {
    button.addEventListener("click", () => {
      const unitId = button.dataset.yardToggleResearch;
      const session = loadYardSession();
      const unit = session.units.find((item) => item.id === unitId);
      if (!unit) return;

      const note = getYardNoteValue(unitId);

      updateYardUnit(unitId, {
        researchNeeded: !unit.researchNeeded,
        yardNote: note
      });

      searchYardUnit();
    });
  });

  document.querySelectorAll("[data-yard-remove-unit]").forEach((button) => {
    button.addEventListener("click", () => {
      removeYardUnit(button.dataset.yardRemoveUnit);
    });
  });
}

function getYardNoteValue(unitId) {
  const input = document.querySelector(`[data-yard-note-input="${CSS.escape(unitId)}"]`);
  return input?.value.trim() || "";
}

function updateYardUnit(unitId, changes) {
  const session = loadYardSession();
  const unit = session.units.find((item) => item.id === unitId);
  if (!unit) return;

  Object.assign(unit, changes);
  saveYardSession(session);
}

function removeYardUnit(unitId) {
  const session = loadYardSession();
  const unit = session.units.find((item) => item.id === unitId);

  if (!unit) return;

  const confirmed = window.confirm(
    `Remove unit ${unit.unitNumber} from this Yard Check session completely?`
  );

  if (!confirmed) return;

  session.units = session.units.filter((item) => item.id !== unitId);
  saveYardSession(session);

  const searchInput = document.getElementById("yardUnitSearch");
  const result = document.getElementById("yardUnitResult");

  if (searchInput) {
    searchInput.value = "";
  }

  if (result) {
    result.innerHTML = `
      <div class="yard-next-unit">
        Unit ${escapeHtml(unit.unitNumber)} removed from this Yard Check session.
      </div>
    `;
  }

  renderYardImportReview();
  renderYardResearchList();
  renderYardListBrowser();
  searchInput?.focus();
}

function addUnlistedYardUnit(unitNumber, mode = "research") {
  const session = loadYardSession();

  const existing = session.units.find((unit) => unit.unitNumber === unitNumber);

  if (existing) {
    if (mode === "checked") {
      existing.checked = true;
    } else {
      existing.researchNeeded = true;
    }

    if (!existing.yardNote) {
      existing.yardNote = "Physically found but not on imported Yard Check.";
    }

    saveYardSession(session);
    searchYardUnit();
    return;
  }

  const newUnit = {
    id: `${session.sessionId || "yard"}-unlisted-${Date.now()}-${unitNumber}`,
    unitNumber,
    page: 0,
    owningLocation: "",
    vehicleStatus: "Not on imported report",
    vehicleType: "",
    mileage: "",
    pmInfo: "",
    comments: "",
    confidence: "high",
    physicalLocation: "",
    checked: mode === "checked",
    researchNeeded: mode === "research",
    yardNote: "Physically found but not on imported Yard Check.",
    unlisted: true
  };

  session.units.push(newUnit);
  saveYardSession(session);
  searchYardUnit();
}


function yardLocationMeaning(location) {
  const meanings = {
    "RL": "Ready Line",
    "GY": "Graveyard",
    "SH": "Shop"
  };

  return meanings[location] || "";
}

function openYardListBrowser(filter) {
  yardActiveListFilter = filter || "loaded";

  const panel = document.getElementById("yardListBrowser");
  const search = document.getElementById("yardListSearch");

  panel?.classList.remove("hidden");

  if (search) {
    search.value = "";
  }

  renderYardListBrowser();
  panel?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function closeYardListBrowser() {
  document.getElementById("yardListBrowser")?.classList.add("hidden");
}

function getYardListUnits(session, filter) {
  if (filter === "checked") {
    return session.units.filter((unit) => unit.checked);
  }

  if (filter === "research") {
    return session.units.filter((unit) => unit.researchNeeded);
  }

  if (filter === "remaining") {
    return session.units.filter((unit) => !unit.checked);
  }

  return session.units;
}

function yardListFilterTitle(filter) {
  const titles = {
    loaded: "Loaded Units",
    checked: "Checked Units",
    research: "Research Units",
    remaining: "Remaining Units"
  };

  return titles[filter] || "Loaded Units";
}

function renderYardListBrowser() {
  const panel = document.getElementById("yardListBrowser");
  const target = document.getElementById("yardListResults");
  const title = document.getElementById("yardListTitle");
  const search = document.getElementById("yardListSearch");

  if (!panel || !target || !title) return;
  if (panel.classList.contains("hidden")) return;

  const session = loadYardSession();
  const query = search?.value.trim().toLowerCase() || "";

  let units = getYardListUnits(session, yardActiveListFilter);

  if (query) {
    units = units.filter((unit) =>
      String(unit.unitNumber || "").toLowerCase().includes(query)
    );
  }

  title.textContent = `${yardListFilterTitle(yardActiveListFilter)} · ${units.length}`;

  if (!units.length) {
    target.innerHTML = `
      <div class="yard-empty-state">
        <strong>No matching units.</strong>
        <span>Try another filter or unit number.</span>
      </div>
    `;
    return;
  }

  target.innerHTML = units
    .map((unit) => `
      <article class="yard-list-row">
        <button
          class="yard-list-open-unit"
          type="button"
          data-yard-list-open="${escapeHtml(unit.id)}"
        >
          <div class="yard-list-row-main">
            <strong>Unit ${escapeHtml(unit.unitNumber)}</strong>
            <span>
              ${unit.page ? `Page ${unit.page}` : "Not on report"}
              · ${escapeHtml(unit.physicalLocation || "No physical location")}
            </span>
            <small>
              ${escapeHtml(
                unit.vehicleStatus ||
                (unit.researchNeeded ? "Research needed" : unit.checked ? "Checked" : "Remaining")
              )}
            </small>
          </div>

          <div class="yard-list-row-badges">
            ${unit.checked ? `<span class="yard-mini-badge checked">Checked</span>` : ""}
            ${unit.researchNeeded ? `<span class="yard-mini-badge research">Research</span>` : ""}
          </div>
        </button>
      </article>
    `)
    .join("");

  target.querySelectorAll("[data-yard-list-open]").forEach((button) => {
    button.addEventListener("click", () => {
      openYardUnitFromList(button.dataset.yardListOpen);
    });
  });
}

function openYardUnitFromList(unitId) {
  const session = loadYardSession();
  const unit = session.units.find((item) => item.id === unitId);

  if (!unit) return;

  const panel = document.getElementById("yardModePanel");
  const input = document.getElementById("yardUnitSearch");
  const result = document.getElementById("yardUnitResult");

  panel?.classList.remove("hidden");

  if (input) {
    input.value = unit.unitNumber;
  }

  if (result) {
    result.innerHTML = buildYardUnitResultCard(unit);
  }

  attachYardUnitResultEvents();
  panel?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function renderYardResearchList() {
  const target = document.getElementById("yardResearchList");
  if (!target) return;

  const session = loadYardSession();
  const research = session.units.filter((unit) => unit.researchNeeded);

  if (!research.length) {
    target.innerHTML = `
      <div class="yard-empty-state">
        <strong>No units marked for research.</strong>
        <span>Flag mismatches as you work the yard.</span>
      </div>
    `;
    return;
  }

  target.innerHTML = research
    .map((unit) => `
      <article class="yard-research-row">
        <div>
          <strong>Unit ${escapeHtml(unit.unitNumber)}</strong>
          <span>
            ${unit.page ? `Page ${unit.page}` : "Not on report"}
            · ${escapeHtml(unit.physicalLocation || "Physical location not recorded")}
          </span>
          <small>${escapeHtml(unit.yardNote || unit.vehicleStatus || "Research needed")}</small>
        </div>
        <div class="yard-row-actions">
          <button class="secondary-btn small-btn" type="button" data-yard-research-open="${escapeHtml(unit.id)}">Open Unit</button>
          <button class="secondary-btn small-btn" type="button" data-yard-research-remove="${escapeHtml(unit.id)}">Remove Research</button>
          ${unit.page ? `<button class="secondary-btn small-btn" type="button" data-yard-research-view-page="${unit.page}">View Page</button>` : ""}
        </div>
      </article>
    `)
    .join("");

  target.querySelectorAll("[data-yard-research-open]").forEach((button) => {
    button.addEventListener("click", () => {
      openYardUnitFromList(button.dataset.yardResearchOpen);
    });
  });

  target.querySelectorAll("[data-yard-research-remove]").forEach((button) => {
    button.addEventListener("click", () => {
      updateYardUnit(button.dataset.yardResearchRemove, {
        researchNeeded: false
      });
      renderYardResearchList();
    });
  });

  target.querySelectorAll("[data-yard-research-view-page]").forEach((button) => {
    button.addEventListener("click", () => {
      showYardOriginalPage(Number(button.dataset.yardResearchViewPage));
    });
  });
}

async function showYardOriginalPage(pageNumber) {
  const session = loadYardSession();

  if (!session.sessionId || !pageNumber) return;

  try {
    const page = await getYardPageImage(session.sessionId, pageNumber);

    if (!page?.dataUrl) {
      window.alert("The original page image is not available on this device.");
      return;
    }

    setText("yardPageModalTitle", `Original Yard Check · Page ${pageNumber}`);

    const image = document.getElementById("yardPageModalImage");
    if (image) image.src = page.dataUrl;

    document.getElementById("yardPageModal")?.classList.remove("hidden");
  } catch (error) {
    window.alert("Could not open the saved page image on this device.");
  }
}

function closeYardPageModal() {
  const modal = document.getElementById("yardPageModal");
  const image = document.getElementById("yardPageModalImage");

  modal?.classList.add("hidden");
  if (image) image.removeAttribute("src");
}

async function clearYardSession() {
  const session = loadYardSession();

  const confirmed = window.confirm(
    "Clear the current Yard Check session, extracted units, page photos, and research list from this device?"
  );

  if (!confirmed) return;

  try {
    await clearYardPageImages(session.sessionId);
  } catch (error) {
    console.warn("Could not clear saved Yard Check page images.", error);
  }

  localStorage.removeItem(YARD_SESSION_KEY);

  const photoInput = document.getElementById("yardPhotoInput");
  if (photoInput) photoInput.value = "";

  document.getElementById("yardImportStatus")?.classList.add("hidden");
  document.getElementById("yardImportReview")?.classList.add("hidden");
  document.getElementById("yardModePanel")?.classList.add("hidden");
  document.getElementById("yardListBrowser")?.classList.add("hidden");

  const result = document.getElementById("yardUnitResult");
  if (result) result.innerHTML = "";

  renderYardSelectedFiles();
  renderYardDashboard();
  renderYardImportReview();
  renderYardResearchList();
}

function initializeYardCheck() {
  document.getElementById("yardBackBtn")?.addEventListener("click", showHowToMode);
  document.querySelectorAll("[data-yard-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      openYardListBrowser(button.dataset.yardFilter);
    });
  });
  document.getElementById("closeYardListBtn")?.addEventListener("click", closeYardListBrowser);
  document.getElementById("yardListSearch")?.addEventListener("input", renderYardListBrowser);

  document.getElementById("yardPhotoInput")?.addEventListener("change", renderYardSelectedFiles);
  document.getElementById("analyzeYardPhotosBtn")?.addEventListener("click", analyzeYardPhotos);
  document.getElementById("clearYardSessionBtn")?.addEventListener("click", clearYardSession);
  document.getElementById("startYardModeBtn")?.addEventListener("click", startYardMode);
  document.getElementById("yardUnitSearch")?.addEventListener("input", searchYardUnit);
  document.getElementById("closeYardPageModalBtn")?.addEventListener("click", closeYardPageModal);

  document.getElementById("yardPageModal")?.addEventListener("click", (event) => {
    if (event.target.id === "yardPageModal") {
      closeYardPageModal();
    }
  });

  renderYardSelectedFiles();
  renderYardDashboard();
  renderYardResearchList();
}

document.addEventListener("DOMContentLoaded", initializeYardCheck);


// ==============================
// CONFIRMATION V1
// ==============================

function renderConfirmationBuilder() {
  procedureContent.innerHTML = `
    <div class="confirmation-app">

      <div id="confirmationFormView">
        <div class="confirmation-intro">
          <span class="mini-label">LIVE CALL BUILDER</span>
          <h3>Enter what you know</h3>
          <p>
            Every field is optional. You can leave everything blank and still continue.
          </p>
        </div>

        <div class="confirmation-form">

          <label class="field-card">
            <span>Customer Name</span>
            <input id="confirmCustomerName" type="text" autocomplete="off" placeholder="Example: Greg">
          </label>

          <label class="field-card">
            <span>Vehicle Type</span>
            <input id="confirmVehicleType" type="text" autocomplete="off" placeholder="Example: 16' truck">
          </label>

          <div class="form-row">
            <label class="field-card">
              <span>Pickup Date</span>
              <input id="confirmPickupDate" type="text" autocomplete="off" placeholder="Example: 9/25">
            </label>

            <label class="field-card">
              <span>Pickup Time</span>
              <input id="confirmPickupTime" type="text" autocomplete="off" placeholder="Example: 10 AM">
            </label>
          </div>

          <label class="field-card">
            <span>Pickup Location</span>
            <input id="confirmPickupLocation" type="text" autocomplete="off" placeholder="Enter pickup location">
          </label>

          <label class="field-card">
            <span>Return Location</span>
            <input id="confirmReturnLocation" type="text" autocomplete="off" placeholder="Enter return location">
          </label>

          <label class="field-card">
            <span>Rental Days</span>
            <input id="confirmRentalDays" type="text" inputmode="numeric" autocomplete="off" placeholder="Example: 5">
          </label>

        </div>

        <div class="confirmation-form-actions">
          <button id="generateLiveConfirmationBtn" class="primary-btn big-action-btn" type="button">
            Continue
          </button>

          <button id="generateVoicemailBtn" class="secondary-btn big-action-btn" type="button">
            Voicemail
          </button>
        </div>

        <p class="privacy-note">
          Customer information is used only on this screen and is not saved by the app.
        </p>
      </div>

      <div id="confirmationScriptView" class="hidden"></div>

    </div>
  `;

  document
    .getElementById("generateLiveConfirmationBtn")
    .addEventListener("click", () => generateConfirmationScript("live"));

  document
    .getElementById("generateVoicemailBtn")
    .addEventListener("click", () => generateConfirmationScript("voicemail"));
}

function getConfirmationValues() {
  return {
    customerName: document.getElementById("confirmCustomerName").value.trim(),
    vehicleType: document.getElementById("confirmVehicleType").value.trim(),
    pickupDate: document.getElementById("confirmPickupDate").value.trim(),
    pickupTime: document.getElementById("confirmPickupTime").value.trim(),
    pickupLocation: document.getElementById("confirmPickupLocation").value.trim(),
    returnLocation: document.getElementById("confirmReturnLocation").value.trim(),
    rentalDays: document.getElementById("confirmRentalDays").value.trim()
  };
}

function safeText(value) {
  return value ? value : "";
}

function generateConfirmationScript(mode) {
  const data = getConfirmationValues();

  document.getElementById("confirmationFormView").classList.add("hidden");
  const scriptView = document.getElementById("confirmationScriptView");
  scriptView.classList.remove("hidden");

  if (mode === "voicemail") {
    scriptView.innerHTML = buildVoicemailView(data);
  } else {
    scriptView.innerHTML = buildLiveCallView(data);
  }

  attachConfirmationScriptButtons(data, mode);

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

function buildLiveCallView(data) {
  const greetingName = data.customerName
    ? `Hi, may I speak with ${safeText(data.customerName)}?`
    : "Hi, may I speak with the customer on the reservation?";

  const introName = data.customerName
    ? `Hi ${safeText(data.customerName)}, this is Clarence calling with Penske Truck Rental.`
    : "Hi, this is Clarence calling with Penske Truck Rental.";

  const pickupDateIntro = data.pickupDate
    ? ` I'm reaching out to confirm your upcoming rental with us for ${safeText(data.pickupDate)}.`
    : " I'm reaching out to confirm your upcoming rental with us.";

  const detailLines = buildLiveDetailLines(data);

  return `
    <div class="generated-script">

      <div class="script-topbar">
        <div>
          <span class="mini-label">LIVE CONFIRMATION</span>
          <h3>Read this to the customer</h3>
        </div>
        <button id="editConfirmationBtn" class="text-btn" type="button">Edit Details</button>
      </div>

      <div class="read-card">
        <p>${escapeHtml(greetingName)}</p>

        <p>
          ${escapeHtml(introName + pickupDateIntro)}
        </p>

        <p>
          I just want to go over a few details with you to make sure everything is correct.
        </p>

        ${detailLines}

        <p>
          Perfect. And before I let you go, do you need any additional supplies with the rental, such as furniture pads or dollies?
        </p>
      </div>

      <div class="branch-heading">
        <span class="mini-label">CUSTOMER ANSWER</span>
        <h3>Do they need supplies?</h3>
      </div>

      <div class="branch-buttons">
        <button id="suppliesYesBtn" class="branch-btn yes-btn" type="button">
          Yes
        </button>

        <button id="suppliesNoBtn" class="branch-btn no-btn" type="button">
          No
        </button>
      </div>

      <div id="branchResult" class="hidden"></div>

      <div class="script-bottom-actions">
        <button id="switchToVoicemailBtn" class="secondary-btn" type="button">
          Show Voicemail
        </button>

        <button id="clearConfirmationBtn" class="danger-outline-btn" type="button">
          Clear Customer Info
        </button>
      </div>

    </div>
  `;
}

function buildLiveDetailLines(data) {
  const lines = [];

  if (data.vehicleType || data.pickupDate || data.pickupTime) {
    const pieces = [];

    if (data.vehicleType) {
      pieces.push(`a ${safeText(data.vehicleType)}`);
    } else {
      pieces.push("the vehicle on your reservation");
    }

    if (data.pickupDate) {
      pieces.push(`on ${safeText(data.pickupDate)}`);
    }

    if (data.pickupTime) {
      pieces.push(`at ${safeText(data.pickupTime)}`);
    }

    lines.push(
      `I have you picking up ${pieces.join(" ")}. Is that correct?`
    );
  } else {
    lines.push(
      "I want to confirm the vehicle type, pickup date, and pickup time with you. Is everything showing correctly?"
    );
  }

  if (data.pickupLocation || data.returnLocation) {
    if (data.pickupLocation && data.returnLocation) {
      lines.push(
        `And you'll be picking it up from ${safeText(data.pickupLocation)} and returning it to ${safeText(data.returnLocation)}. Is that correct?`
      );
    } else if (data.pickupLocation) {
      lines.push(
        `And I have your pickup location as ${safeText(data.pickupLocation)}. Is that correct?`
      );
      lines.push(
        "I also want to confirm the return location with you."
      );
    } else {
      lines.push(
        `And I have your return location as ${safeText(data.returnLocation)}. Is that correct?`
      );
      lines.push(
        "I also want to confirm the pickup location with you."
      );
    }
  } else {
    lines.push(
      "I also want to confirm your pickup location and return location."
    );
  }

  if (data.rentalDays) {
    const dayWord = data.rentalDays === "1" ? "day" : "days";
    lines.push(
      `I also have you keeping the vehicle for ${safeText(data.rentalDays)} ${dayWord}. Is that correct?`
    );
  } else {
    lines.push(
      "And I want to confirm how long you'll be keeping the vehicle."
    );
  }

  return lines
    .map((line) => `<p>${escapeHtml(line)}</p>`)
    .join("");
}

function buildVoicemailView(data) {
  const customerOpening = data.customerName
    ? `Hi ${safeText(data.customerName)}, this is Clarence calling with Penske Truck Rental.`
    : "Hi, this is Clarence calling with Penske Truck Rental.";

  const dateLine = data.pickupDate
    ? ` I'm reaching out regarding your upcoming rental with us on ${safeText(data.pickupDate)}.`
    : " I'm reaching out regarding your upcoming rental with us.";

  return `
    <div class="generated-script">

      <div class="script-topbar">
        <div>
          <span class="mini-label">CONFIRMATION VOICEMAIL</span>
          <h3>Read this voicemail</h3>
        </div>
        <button id="editConfirmationBtn" class="text-btn" type="button">Edit Details</button>
      </div>

      <div class="read-card voicemail-card">
        <p>
          ${escapeHtml(customerOpening + dateLine)}
        </p>

        <p>
          I was just calling to confirm your reservation and make sure everything is good to go.
        </p>

        <p>
          When you get a chance, please give us a call back at the location.
        </p>

        <p>
          Again, this is Clarence with Penske Truck Rental. Thank you, and have a great day.
        </p>
      </div>

      <div class="script-bottom-actions">
        <button id="switchToLiveBtn" class="secondary-btn" type="button">
          Show Live Call
        </button>

        <button id="clearConfirmationBtn" class="danger-outline-btn" type="button">
          Clear Customer Info
        </button>
      </div>

    </div>
  `;
}

function attachConfirmationScriptButtons(data, mode) {
  const editBtn = document.getElementById("editConfirmationBtn");
  const clearBtn = document.getElementById("clearConfirmationBtn");

  if (editBtn) {
    editBtn.addEventListener("click", () => {
      document.getElementById("confirmationScriptView").classList.add("hidden");
      document.getElementById("confirmationFormView").classList.remove("hidden");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", clearConfirmationData);
  }

  if (mode === "live") {
    const yesBtn = document.getElementById("suppliesYesBtn");
    const noBtn = document.getElementById("suppliesNoBtn");
    const voicemailBtn = document.getElementById("switchToVoicemailBtn");

    yesBtn.addEventListener("click", () => {
      showSupplyBranch("yes", data);
    });

    noBtn.addEventListener("click", () => {
      showSupplyBranch("no", data);
    });

    voicemailBtn.addEventListener("click", () => {
      document.getElementById("confirmationScriptView").innerHTML =
        buildVoicemailView(data);
      attachConfirmationScriptButtons(data, "voicemail");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  } else {
    const liveBtn = document.getElementById("switchToLiveBtn");

    liveBtn.addEventListener("click", () => {
      document.getElementById("confirmationScriptView").innerHTML =
        buildLiveCallView(data);
      attachConfirmationScriptButtons(data, "live");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
}

function showSupplyBranch(answer, data) {
  const branchResult = document.getElementById("branchResult");
  branchResult.classList.remove("hidden");

  if (answer === "yes") {
    branchResult.innerHTML = `
      <div class="branch-result-card branch-yes-result">
        <span class="mini-label">SAY THIS</span>
        <p>Absolutely, let me get that added to your reservation.</p>
      </div>
    `;
  } else {
    const dateText = data.pickupDate
      ? `We'll see you on ${safeText(data.pickupDate)}${data.pickupTime ? ` at ${safeText(data.pickupTime)}` : ""}.`
      : data.pickupTime
        ? `We'll see you at ${safeText(data.pickupTime)}.`
        : "We'll see you at pickup.";

    branchResult.innerHTML = `
      <div class="branch-result-card branch-no-result">
        <span class="mini-label">SAY THIS</span>
        <p>No problem. Everything looks good on my end.</p>
        <p>${escapeHtml(dateText)}</p>
        <p>If anything changes before then, just give us a call. Thank you for choosing Penske, and have a great day.</p>
      </div>
    `;
  }

  branchResult.scrollIntoView({
    behavior: "smooth",
    block: "nearest"
  });
}

function clearConfirmationData() {
  renderConfirmationBuilder();

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


// ==============================
// CALLBACK V1
// ==============================

function renderCallbackBuilder() {
  procedureContent.innerHTML = `
    <div class="callback-app">

      <div id="callbackFormView">
        <div class="callback-intro">
          <span class="mini-label">CALLBACK BUILDER</span>
          <h3>Enter what you know</h3>
          <p>
            Every field is optional. Leave anything blank and the script will still generate.
          </p>
        </div>

        <div class="callback-form">

          <label class="field-card">
            <span>Customer Name</span>
            <input id="callbackCustomerName" type="text" autocomplete="off" placeholder="Example: Sarah">
          </label>

          <label class="field-card">
            <span>Vehicle Type</span>
            <input id="callbackVehicleType" type="text" autocomplete="off" placeholder="Example: 16' truck">
          </label>

          <label class="field-card">
            <span>Location</span>
            <input id="callbackLocation" type="text" autocomplete="off" placeholder="Example: Lenexa">
          </label>

          <label class="field-card">
            <span>Callback Number</span>
            <input id="callbackPhone" type="tel" autocomplete="off" placeholder="Optional">
          </label>

        </div>

        <div class="callback-form-actions">
          <button id="generateLiveCallbackBtn" class="primary-btn big-action-btn" type="button">
            Continue
          </button>

          <button id="generateCallbackVoicemailBtn" class="secondary-btn big-action-btn" type="button">
            Voicemail
          </button>
        </div>

        <p class="privacy-note">
          Customer information is used only on this screen and is not saved by the app.
        </p>
      </div>

      <div id="callbackScriptView" class="hidden"></div>

    </div>
  `;

  document
    .getElementById("generateLiveCallbackBtn")
    .addEventListener("click", () => generateCallbackScript("live"));

  document
    .getElementById("generateCallbackVoicemailBtn")
    .addEventListener("click", () => generateCallbackScript("voicemail"));
}

function getCallbackValues() {
  return {
    customerName: document.getElementById("callbackCustomerName").value.trim(),
    vehicleType: document.getElementById("callbackVehicleType").value.trim(),
    location: document.getElementById("callbackLocation").value.trim(),
    phone: document.getElementById("callbackPhone").value.trim()
  };
}

function generateCallbackScript(mode) {
  const data = getCallbackValues();

  document.getElementById("callbackFormView").classList.add("hidden");

  const scriptView = document.getElementById("callbackScriptView");
  scriptView.classList.remove("hidden");

  if (mode === "voicemail") {
    scriptView.innerHTML = buildCallbackVoicemailView(data);
  } else {
    scriptView.innerHTML = buildLiveCallbackView(data);
  }

  attachCallbackButtons(data, mode);

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

function buildLiveCallbackView(data) {
  const firstLine = data.customerName
    ? `Hi, this is Clarence with Penske Truck Rental. Is this ${safeText(data.customerName)}?`
    : "Hi, this is Clarence with Penske Truck Rental. Am I speaking with the customer who received the quote?";

  let secondLine;

  if (data.customerName || data.vehicleType || data.location) {
    const namePart = data.customerName ? `Hi ${safeText(data.customerName)}, ` : "Hi, ";
    const vehiclePart = data.vehicleType
      ? ` for a ${safeText(data.vehicleType)}`
      : "";
    const locationPart = data.location
      ? ` at our ${safeText(data.location)} location`
      : "";

    secondLine =
      `${namePart}I'm following up on a saved quote you have with us${vehiclePart}${locationPart}. I just wanted to see if you're still interested in the rental.`;
  } else {
    secondLine =
      "Hi, I'm following up on a saved quote you have with us. I just wanted to see if you're still interested in the rental.";
  }

  return `
    <div class="generated-script">

      <div class="script-topbar">
        <div>
          <span class="mini-label">LIVE CALLBACK</span>
          <h3>Read this to the customer</h3>
        </div>
        <button id="editCallbackBtn" class="text-btn" type="button">Edit Details</button>
      </div>

      <div class="read-card callback-read-card">
        <p>${escapeHtml(firstLine)}</p>
        <p>${escapeHtml(secondLine)}</p>
      </div>

      <div class="stop-talking-card">
        <strong>STOP TALKING</strong>
        <span>Let the customer answer.</span>
      </div>

      <div class="branch-heading">
        <span class="mini-label">CUSTOMER ANSWER</span>
        <h3>Are they still interested?</h3>
      </div>

      <div class="callback-branch-buttons">
        <button id="callbackYesBtn" class="branch-btn yes-btn" type="button">
          Yes
        </button>

        <button id="callbackUnsureBtn" class="branch-btn unsure-btn" type="button">
          Not Sure Yet
        </button>

        <button id="callbackNoBtn" class="branch-btn no-btn" type="button">
          No
        </button>
      </div>

      <div id="callbackBranchResult" class="hidden"></div>

      <div class="script-bottom-actions">
        <button id="switchToCallbackVoicemailBtn" class="secondary-btn" type="button">
          Show Voicemail
        </button>

        <button id="clearCallbackBtn" class="danger-outline-btn" type="button">
          Clear Customer Info
        </button>
      </div>

    </div>
  `;
}

function buildCallbackVoicemailView(data) {
  const opening = data.customerName
    ? `Hi ${safeText(data.customerName)}, this is Clarence with Penske Truck Rental.`
    : "Hi, this is Clarence with Penske Truck Rental.";

  const vehiclePart = data.vehicleType
    ? ` for a ${safeText(data.vehicleType)}`
    : "";

  const locationPart = data.location
    ? ` at our ${safeText(data.location)} location`
    : "";

  const callbackLine = data.phone
    ? `If you're still interested or have any questions about the rental, feel free to give us a callback at ${safeText(data.phone)}. Again, that's ${safeText(data.phone)}.`
    : "If you're still interested or have any questions about the rental, feel free to give us a callback at the location.";

  return `
    <div class="generated-script">

      <div class="script-topbar">
        <div>
          <span class="mini-label">CALLBACK VOICEMAIL</span>
          <h3>Read this voicemail</h3>
        </div>
        <button id="editCallbackBtn" class="text-btn" type="button">Edit Details</button>
      </div>

      <div class="read-card voicemail-card">
        <p>
          ${escapeHtml(opening)}
        </p>

        <p>
          ${escapeHtml(`I'm following up on the saved quote you have with us${vehiclePart}${locationPart}.`)}
        </p>

        <p>
          ${escapeHtml(callbackLine)}
        </p>

        <p>
          Thank you, and have a great day.
        </p>
      </div>

      <div class="script-bottom-actions">
        <button id="switchToLiveCallbackBtn" class="secondary-btn" type="button">
          Show Live Call
        </button>

        <button id="clearCallbackBtn" class="danger-outline-btn" type="button">
          Clear Customer Info
        </button>
      </div>

    </div>
  `;
}

function attachCallbackButtons(data, mode) {
  const editBtn = document.getElementById("editCallbackBtn");
  const clearBtn = document.getElementById("clearCallbackBtn");

  if (editBtn) {
    editBtn.addEventListener("click", () => {
      document.getElementById("callbackScriptView").classList.add("hidden");
      document.getElementById("callbackFormView").classList.remove("hidden");
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", clearCallbackData);
  }

  if (mode === "live") {
    document.getElementById("callbackYesBtn").addEventListener("click", () => {
      showCallbackBranch("yes");
    });

    document.getElementById("callbackUnsureBtn").addEventListener("click", () => {
      showCallbackBranch("unsure");
    });

    document.getElementById("callbackNoBtn").addEventListener("click", () => {
      showCallbackBranch("no");
    });

    document
      .getElementById("switchToCallbackVoicemailBtn")
      .addEventListener("click", () => {
        document.getElementById("callbackScriptView").innerHTML =
          buildCallbackVoicemailView(data);

        attachCallbackButtons(data, "voicemail");

        window.scrollTo({ top: 0, behavior: "smooth" });
      });
  } else {
    document
      .getElementById("switchToLiveCallbackBtn")
      .addEventListener("click", () => {
        document.getElementById("callbackScriptView").innerHTML =
          buildLiveCallbackView(data);

        attachCallbackButtons(data, "live");

        window.scrollTo({ top: 0, behavior: "smooth" });
      });
  }
}

function showCallbackBranch(answer) {
  const result = document.getElementById("callbackBranchResult");
  result.classList.remove("hidden");

  if (answer === "yes") {
    result.innerHTML = `
      <div class="branch-result-card branch-yes-result">
        <span class="mini-label">SAY THIS</span>
        <p>Absolutely. Let me pull up that quote for you.</p>
      </div>
    `;
  }

  if (answer === "unsure") {
    result.innerHTML = `
      <div class="branch-result-card branch-unsure-result">
        <span class="mini-label">SAY THIS</span>
        <p>No problem. Is there anything about the rental I can help you with or any questions I can answer for you?</p>
      </div>
    `;
  }

  if (answer === "no") {
    result.innerHTML = `
      <div class="branch-result-card branch-no-result">
        <span class="mini-label">SAY THIS</span>
        <p>No problem at all. Just so I can update the quote correctly, did your plans change or did you end up finding another rental option?</p>
      </div>
    `;
  }

  result.scrollIntoView({
    behavior: "smooth",
    block: "nearest"
  });
}

function clearCallbackData() {
  renderCallbackBuilder();

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}



// ==============================
// VEHICLE LOG V1
// ==============================

const VEHICLE_LOG_STORAGE_KEY = "penskeVehicleLogV1";
let vehicleLogEditingId = null;
let selectedVehicleType = "nonrev";
let selectedVehicleClass = "";
let selectedFuel = "";
let selectedDamage = "";
let selectedVPF = false;
let selectedVehicleStatus = "";
let customerReturnCompleted = false;
let vehicleLogFilter = "all";

function loadVehicleLogEntries() {
  try {
    const saved = localStorage.getItem(VEHICLE_LOG_STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error("Could not read vehicle log:", error);
    return [];
  }
}

function saveVehicleLogEntries(entries) {
  try {
    localStorage.setItem(
      VEHICLE_LOG_STORAGE_KEY,
      JSON.stringify(entries)
    );
  } catch (error) {
    console.error("Could not save vehicle log:", error);
  }
}

function renderVehicleLog() {
  vehicleLogEditingId = null;
  selectedVehicleType = "nonrev";
  selectedVehicleClass = "";
  selectedVehicleClass = "";
  selectedFuel = "";
  selectedDamage = "";
  selectedVPF = false;
  selectedVehicleStatus = "";
  customerReturnCompleted = false;
  vehicleLogFilter = "all";

  procedureContent.innerHTML = `
    <div class="vehicle-log-app">

      <div class="vehicle-log-heading">
        <div>
          <span class="mini-label">DAILY VEHICLE TRACKER</span>
          <h3>Vehicle Log</h3>
          <p>
            Non-Rev is the main workflow. Saved vehicles stay on this device until you delete them or clear the log.
          </p>
        </div>

        <div class="vehicle-count-card">
          <span>Saved</span>
          <strong id="vehicleLogCount">0</strong>
        </div>
      </div>

      <div class="vehicle-type-switch">
        <button id="nonRevTypeBtn" class="vehicle-type-btn active" type="button">
          Non-Rev
        </button>

        <button id="customerReturnTypeBtn" class="vehicle-type-btn" type="button">
          Customer Return
        </button>
      </div>

      <div id="vehicleEntryForm"></div>

      <div class="vehicle-log-actions">
        <button id="saveVehicleBtn" class="primary-btn big-action-btn" type="button">
          Save Vehicle
        </button>

        <button id="cancelVehicleEditBtn" class="secondary-btn hidden" type="button">
          Cancel Edit
        </button>
      </div>

      <div id="vehicleFormMessage" class="vehicle-form-message hidden"></div>

      <div class="vehicle-log-divider"></div>

      <div class="vehicle-list-heading">
        <div>
          <span class="mini-label">SAVED ON THIS DEVICE</span>
          <h3>Vehicle List</h3>
        </div>
      </div>

      <div class="vehicle-list-toolbar">
        <button id="checkVehiclesBtn" class="primary-btn vehicle-check-btn" type="button">
          Check Before Going Inside
        </button>

        <button id="incompleteOnlyBtn" class="secondary-btn vehicle-filter-btn" type="button">
          Incomplete Only
        </button>
      </div>

      <div id="vehicleCheckResult" class="hidden"></div>
      <div id="vehicleLogList"></div>

      <button id="clearVehicleLogBtn" class="danger-outline-btn clear-log-btn" type="button">
        Clear Vehicle Log
      </button>

      <p class="privacy-note vehicle-storage-note">
        This log is stored only in this browser on this device. Clearing browser/site data can erase it.
      </p>

    </div>
  `;

  renderVehicleEntryForm();
  renderVehicleLogList();
  attachVehicleLogMainButtons();
}

function renderVehicleEntryForm(entry = null) {
  const form = document.getElementById("vehicleEntryForm");

  if (!form) {
    return;
  }

  const unitValue = entry?.unitNumber || "";
  const mileageValue = entry?.mileage || "";
  const damageNoteValue = entry?.damageNote || "";

  if (selectedVehicleType === "customer") {
    form.innerHTML = `
      <div class="vehicle-entry-card">

        <label class="field-card">
          <span>Unit Number</span>
          <input id="vehicleUnitNumber" type="text" inputmode="numeric" autocomplete="off"
            placeholder="Enter unit number" value="${escapeHtml(unitValue)}">
        </label>

        <div class="tap-section">
          <span class="tap-label">Vehicle Type</span>

          <div class="status-grid">
            ${["12'", "16'", "26'", "Tractor", "Sleeper"]
              .map(
                (vehicleClass) => `
                  <button
                    class="tap-choice customer-vehicle-class-choice ${selectedVehicleClass === vehicleClass ? "selected-dark" : ""}"
                    type="button"
                    data-vehicle-class="${vehicleClass}">
                    ${vehicleClass}
                  </button>
                `
              )
              .join("")}
          </div>
        </div>

        <div class="tap-section">
          <span class="tap-label">Customer Check-In Completed?</span>

          <div class="two-choice-grid">
            <button id="customerCompleteYesBtn"
              class="tap-choice ${customerReturnCompleted ? "selected-good" : ""}"
              type="button">
              ✓ Yes
            </button>

            <button id="customerCompleteNoBtn"
              class="tap-choice ${customerReturnCompleted ? "" : "selected-neutral"}"
              type="button">
              Not Yet
            </button>
          </div>
        </div>

        <div class="tap-section">
          <span class="tap-label">Final Status / Next Step</span>

          <div class="status-grid">
            ${["Available", "Wash", "PM", "Service", "Ask"]
              .map(
                (status) => `
                  <button
                    class="tap-choice customer-status-choice ${selectedVehicleStatus === status ? "selected-dark" : ""}"
                    type="button"
                    data-status="${status}">
                    ${status}
                  </button>
                `
              )
              .join("")}
          </div>

          <p class="tap-helper">
            PM = preventive maintenance. Use Ask if you are unsure instead of guessing.
          </p>
        </div>

        <div class="simple-customer-note">
          Use the company phone for the actual customer-return check-in, pictures, VPF, mileage, fuel, and damage.
          This app only tracks that you handled the unit and what status it should go to next.
        </div>

      </div>
    `;

    document.querySelectorAll(".customer-vehicle-class-choice").forEach((button) => {
      button.addEventListener("click", () => {
        const currentUnit = document.getElementById("vehicleUnitNumber").value;
        selectedVehicleClass = button.dataset.vehicleClass;
        renderVehicleEntryForm({ unitNumber: currentUnit });
      });
    });

    document
      .getElementById("customerCompleteYesBtn")
      .addEventListener("click", () => {
        const currentUnit = document.getElementById("vehicleUnitNumber").value;
        customerReturnCompleted = true;
        renderVehicleEntryForm({ unitNumber: currentUnit });
      });

    document
      .getElementById("customerCompleteNoBtn")
      .addEventListener("click", () => {
        const currentUnit = document.getElementById("vehicleUnitNumber").value;
        customerReturnCompleted = false;
        renderVehicleEntryForm({ unitNumber: currentUnit });
      });

    document.querySelectorAll(".customer-status-choice").forEach((button) => {
      button.addEventListener("click", () => {
        const currentUnit = document.getElementById("vehicleUnitNumber").value;
        selectedVehicleStatus = button.dataset.status;
        renderVehicleEntryForm({ unitNumber: currentUnit });
      });
    });

    return;
  }

  form.innerHTML = `
    <div class="vehicle-entry-card">

      <div class="form-row">
        <label class="field-card">
          <span>Unit Number</span>
          <input id="vehicleUnitNumber" type="text" inputmode="numeric" autocomplete="off"
            placeholder="Enter unit number" value="${escapeHtml(unitValue)}">
        </label>

        <label class="field-card">
          <span>Mileage</span>
          <input id="vehicleMileage" type="text" inputmode="numeric" autocomplete="off"
            placeholder="Enter mileage" value="${escapeHtml(mileageValue)}">
        </label>
      </div>

      <div class="tap-section">
        <span class="tap-label">Vehicle Type</span>

        <div class="status-grid">
          ${["12'", "16'", "26'", "Tractor", "Sleeper"]
            .map(
              (vehicleClass) => `
                <button
                  class="tap-choice vehicle-class-choice ${selectedVehicleClass === vehicleClass ? "selected-dark" : ""}"
                  type="button"
                  data-vehicle-class="${vehicleClass}">
                  ${vehicleClass}
                </button>
              `
            )
            .join("")}
        </div>
      </div>

      <div class="tap-section">
        <span class="tap-label">Fuel</span>

        <div class="fuel-grid">
          ${["E", "1/4", "1/2", "3/4", "7/8", "Full"]
            .map(
              (fuel) => `
                <button
                  class="tap-choice fuel-choice ${selectedFuel === fuel ? "selected-dark" : ""}"
                  type="button"
                  data-fuel="${fuel}">
                  ${fuel}
                </button>
              `
            )
            .join("")}
        </div>
      </div>

      <div class="tap-section">
        <span class="tap-label">Damage?</span>

        <div class="two-choice-grid">
          <button id="damageNoBtn"
            class="tap-choice ${selectedDamage === "No" ? "selected-good" : ""}"
            type="button">
            ✓ No
          </button>

          <button id="damageYesBtn"
            class="tap-choice ${selectedDamage === "Yes" ? "selected-bad" : ""}"
            type="button">
            ✕ Yes
          </button>
        </div>
      </div>

      <div id="damageNoteWrap" class="${selectedDamage === "Yes" ? "" : "hidden"}">
        <label class="field-card">
          <span>Damage Note <small>(optional)</small></span>
          <input id="vehicleDamageNote" type="text" autocomplete="off"
            placeholder="Short damage note" value="${escapeHtml(damageNoteValue)}">
        </label>
      </div>

      <div class="tap-section">
        <span class="tap-label">VPF Done?</span>

        <div class="two-choice-grid">
          <button id="vpfDoneBtn"
            class="tap-choice ${selectedVPF ? "selected-good" : ""}"
            type="button">
            ✓ Done
          </button>

          <button id="vpfNotDoneBtn"
            class="tap-choice ${selectedVPF ? "" : "selected-neutral"}"
            type="button">
            Not Yet
          </button>
        </div>
      </div>

      <div class="tap-section">
        <span class="tap-label">Final Status / Next Step</span>

        <div class="status-grid">
          ${["Available", "Wash", "PM", "Service", "Ask"]
            .map(
              (status) => `
                <button
                  class="tap-choice status-choice ${selectedVehicleStatus === status ? "selected-dark" : ""}"
                  type="button"
                  data-status="${status}">
                  ${status}
                </button>
              `
            )
            .join("")}
        </div>

        <p class="tap-helper">
          PM = preventive maintenance. Use Ask if you are unsure instead of guessing.
        </p>
      </div>

    </div>
  `;

  document.querySelectorAll(".vehicle-class-choice").forEach((button) => {
    button.addEventListener("click", () => {
      preserveVehicleTypedValues();
      selectedVehicleClass = button.dataset.vehicleClass;
      renderVehicleEntryForm(getCurrentTypedVehicleValues());
    });
  });

  document.querySelectorAll(".fuel-choice").forEach((button) => {
    button.addEventListener("click", () => {
      preserveVehicleTypedValues();
      selectedFuel = button.dataset.fuel;
      renderVehicleEntryForm(getCurrentTypedVehicleValues());
    });
  });

  document.getElementById("damageNoBtn").addEventListener("click", () => {
    preserveVehicleTypedValues();
    selectedDamage = "No";
    renderVehicleEntryForm(getCurrentTypedVehicleValues());
  });

  document.getElementById("damageYesBtn").addEventListener("click", () => {
    preserveVehicleTypedValues();
    selectedDamage = "Yes";
    renderVehicleEntryForm(getCurrentTypedVehicleValues());
  });

  document.getElementById("vpfDoneBtn").addEventListener("click", () => {
    preserveVehicleTypedValues();
    selectedVPF = true;
    renderVehicleEntryForm(getCurrentTypedVehicleValues());
  });

  document.getElementById("vpfNotDoneBtn").addEventListener("click", () => {
    preserveVehicleTypedValues();
    selectedVPF = false;
    renderVehicleEntryForm(getCurrentTypedVehicleValues());
  });

  document.querySelectorAll(".status-choice").forEach((button) => {
    button.addEventListener("click", () => {
      preserveVehicleTypedValues();
      selectedVehicleStatus = button.dataset.status;
      renderVehicleEntryForm(getCurrentTypedVehicleValues());
    });
  });
}

let vehicleTypedDraft = {
  unitNumber: "",
  mileage: "",
  damageNote: ""
};

function preserveVehicleTypedValues() {
  const unit = document.getElementById("vehicleUnitNumber");
  const mileage = document.getElementById("vehicleMileage");
  const note = document.getElementById("vehicleDamageNote");

  vehicleTypedDraft = {
    unitNumber: unit ? unit.value : vehicleTypedDraft.unitNumber,
    mileage: mileage ? mileage.value : vehicleTypedDraft.mileage,
    damageNote: note ? note.value : vehicleTypedDraft.damageNote
  };
}

function getCurrentTypedVehicleValues() {
  return {
    unitNumber: vehicleTypedDraft.unitNumber,
    mileage: vehicleTypedDraft.mileage,
    damageNote: vehicleTypedDraft.damageNote
  };
}

function attachVehicleLogMainButtons() {
  document.getElementById("nonRevTypeBtn").addEventListener("click", () => {
    selectedVehicleType = "nonrev";
    resetVehicleEntrySelections();
    updateVehicleTypeButtons();
    renderVehicleEntryForm();
  });

  document.getElementById("customerReturnTypeBtn").addEventListener("click", () => {
    selectedVehicleType = "customer";
    resetVehicleEntrySelections();
    updateVehicleTypeButtons();
    renderVehicleEntryForm();
  });

  document.getElementById("saveVehicleBtn").addEventListener("click", saveVehicleEntry);

  document.getElementById("cancelVehicleEditBtn").addEventListener("click", () => {
    resetVehicleEntryForm();
  });

  document.getElementById("checkVehiclesBtn").addEventListener("click", checkVehicleLog);

  document.getElementById("incompleteOnlyBtn").addEventListener("click", () => {
    vehicleLogFilter = vehicleLogFilter === "all" ? "incomplete" : "all";
    updateVehicleLogFilterButton();
    renderVehicleLogList();
  });

  document.getElementById("clearVehicleLogBtn").addEventListener("click", () => {
    const entries = loadVehicleLogEntries();

    if (entries.length === 0) {
      showVehicleFormMessage("The vehicle log is already empty.", "neutral");
      return;
    }

    const shouldClear = window.confirm(
      "Clear all saved vehicles from this device?"
    );

    if (!shouldClear) {
      return;
    }

    localStorage.removeItem(VEHICLE_LOG_STORAGE_KEY);
    resetVehicleEntryForm();
    renderVehicleLogList();

    const result = document.getElementById("vehicleCheckResult");
    result.classList.add("hidden");
    result.innerHTML = "";

    showVehicleFormMessage("Vehicle log cleared.", "good");
  });
}

function updateVehicleTypeButtons() {
  const nonRevBtn = document.getElementById("nonRevTypeBtn");
  const customerBtn = document.getElementById("customerReturnTypeBtn");

  nonRevBtn.classList.toggle(
    "active",
    selectedVehicleType === "nonrev"
  );

  customerBtn.classList.toggle(
    "active",
    selectedVehicleType === "customer"
  );
}

function updateVehicleLogFilterButton() {
  const button = document.getElementById("incompleteOnlyBtn");

  if (!button) {
    return;
  }

  if (vehicleLogFilter === "incomplete") {
    button.textContent = "Show All";
    button.classList.add("filter-active");
  } else {
    button.textContent = "Incomplete Only";
    button.classList.remove("filter-active");
  }
}

function resetVehicleEntrySelections() {
  vehicleLogEditingId = null;
  selectedFuel = "";
  selectedDamage = "";
  selectedVPF = false;
  selectedVehicleStatus = "";
  customerReturnCompleted = false;
  vehicleTypedDraft = {
    unitNumber: "",
    mileage: "",
    damageNote: ""
  };

  const saveBtn = document.getElementById("saveVehicleBtn");
  const cancelBtn = document.getElementById("cancelVehicleEditBtn");

  if (saveBtn) {
    saveBtn.textContent = "Save Vehicle";
  }

  if (cancelBtn) {
    cancelBtn.classList.add("hidden");
  }
}

function resetVehicleEntryForm() {
  resetVehicleEntrySelections();
  selectedVehicleType = "nonrev";
  updateVehicleTypeButtons();
  renderVehicleEntryForm();
}

function saveVehicleEntry() {
  const unitNumber = document.getElementById("vehicleUnitNumber").value.trim();

  if (!unitNumber) {
    showVehicleFormMessage(
      "Enter the unit number before saving this vehicle.",
      "bad"
    );
    return;
  }

  const entries = loadVehicleLogEntries();

  const duplicateEntry = entries.find(
    (entry) =>
      String(entry.unitNumber).trim().toLowerCase() === unitNumber.toLowerCase() &&
      entry.id !== vehicleLogEditingId
  );

  if (duplicateEntry) {
    const saveDuplicate = window.confirm(
      `Unit ${unitNumber} is already in the Vehicle Log. Save another entry for the same unit anyway?`
    );

    if (!saveDuplicate) {
      showVehicleFormMessage(
        `Unit ${unitNumber} is already saved. Use Edit on the existing entry if you need to change it.`,
        "warn"
      );
      return;
    }
  }

  if (selectedVehicleType === "customer") {
    const newEntry = {
      id: vehicleLogEditingId || createVehicleEntryId(),
      type: "customer",
      unitNumber,
      vehicleClass: selectedVehicleClass,
      customerReturnCompleted,
      status: selectedVehicleStatus,
      savedAt: new Date().toISOString()
    };

    upsertVehicleEntry(entries, newEntry);
    saveVehicleLogEntries(entries);
    resetVehicleEntryForm();
    renderVehicleLogList();

    showVehicleFormMessage(
      `Unit ${unitNumber} saved. Ready for the next vehicle.`,
      "good"
    );

    prepareNextNonRevEntry();
    return;
  }

  const mileage = document.getElementById("vehicleMileage").value.trim();
  const damageNoteElement = document.getElementById("vehicleDamageNote");
  const damageNote = damageNoteElement
    ? damageNoteElement.value.trim()
    : "";

  const newEntry = {
    id: vehicleLogEditingId || createVehicleEntryId(),
    type: "nonrev",
    unitNumber,
    vehicleClass: selectedVehicleClass,
    mileage,
    fuel: selectedFuel,
    damage: selectedDamage,
    damageNote: selectedDamage === "Yes" ? damageNote : "",
    vpfDone: selectedVPF,
    status: selectedVehicleStatus,
    savedAt: new Date().toISOString()
  };

  upsertVehicleEntry(entries, newEntry);
  saveVehicleLogEntries(entries);

  resetVehicleEntryForm();
  renderVehicleLogList();

  const missing = getVehicleMissingItems(newEntry);

  if (missing.length > 0) {
    showVehicleFormMessage(
      `Unit ${unitNumber} saved. Still missing: ${missing.join(", ")}.`,
      "warn"
    );
  } else {
    showVehicleFormMessage(
      `Unit ${unitNumber} is complete and saved. Ready for the next Non-Rev.`,
      "good"
    );
  }

  prepareNextNonRevEntry();
}

function prepareNextNonRevEntry() {
  selectedVehicleType = "nonrev";
  resetVehicleEntrySelections();
  updateVehicleTypeButtons();
  renderVehicleEntryForm();

  window.setTimeout(() => {
    const unitInput = document.getElementById("vehicleUnitNumber");

    if (unitInput) {
      unitInput.focus();
    }
  }, 50);
}

function upsertVehicleEntry(entries, entry) {
  const existingIndex = entries.findIndex(
    (item) => item.id === entry.id
  );

  if (existingIndex >= 0) {
    entries[existingIndex] = entry;
  } else {
    entries.unshift(entry);
  }
}

function createVehicleEntryId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getVehicleMissingItems(entry) {
  if (entry.type === "customer") {
    const missing = [];

    if (!entry.unitNumber) {
      missing.push("unit number");
    }

    if (!entry.vehicleClass) {
      missing.push("vehicle type");
    }

    if (!entry.customerReturnCompleted) {
      missing.push("customer check-in completion");
    }

    if (!entry.status) {
      missing.push("status");
    }

    return missing;
  }

  const missing = [];

  if (!entry.unitNumber) {
    missing.push("unit number");
  }

  if (!entry.vehicleClass) {
    missing.push("vehicle type");
  }

  if (!entry.mileage) {
    missing.push("mileage");
  }

  if (!entry.fuel) {
    missing.push("fuel");
  }

  if (!entry.damage) {
    missing.push("damage");
  }

  if (!entry.vpfDone) {
    missing.push("VPF");
  }

  if (!entry.status) {
    missing.push("status");
  }

  return missing;
}

function formatVehicleSavedTime(savedAt) {
  if (!savedAt) {
    return "";
  }

  const date = new Date(savedAt);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit"
  });
}

function renderVehicleLogList() {
  const entries = loadVehicleLogEntries();
  const list = document.getElementById("vehicleLogList");
  const count = document.getElementById("vehicleLogCount");

  if (!list || !count) {
    return;
  }

  count.textContent = entries.length;
  updateVehicleLogFilterButton();

  if (entries.length === 0) {
    list.innerHTML = `
      <div class="empty-vehicle-log">
        <strong>No vehicles saved yet.</strong>
        <span>Add a Non-Rev or customer return above.</span>
      </div>
    `;
    return;
  }

  const visibleEntries =
    vehicleLogFilter === "incomplete"
      ? entries.filter((entry) => getVehicleMissingItems(entry).length > 0)
      : entries;

  if (visibleEntries.length === 0) {
    list.innerHTML = `
      <div class="empty-vehicle-log">
        <strong>No incomplete vehicles.</strong>
        <span>Everything currently saved is complete.</span>
      </div>
    `;
    return;
  }

  list.innerHTML = visibleEntries
    .map((entry) => {
      const missing = getVehicleMissingItems(entry);
      const complete = missing.length === 0;

      if (entry.type === "customer") {
        return `
          <article class="saved-vehicle-card">
            <div class="saved-vehicle-top">
              <div>
                <span class="vehicle-type-pill customer-pill">Customer Return</span>
                <h4>Unit ${escapeHtml(entry.unitNumber)}</h4>
                <small class="vehicle-saved-time">Saved ${escapeHtml(formatVehicleSavedTime(entry.savedAt))}</small>
              </div>

              <span class="completion-pill ${complete ? "complete-pill" : "missing-pill"}">
                ${complete ? "Complete" : "Needs Attention"}
              </span>
            </div>

            <div class="saved-vehicle-grid customer-summary-grid">
              <span>Vehicle <strong>${escapeHtml(entry.vehicleClass || "—")}</strong></span>
              <span>Check-In <strong>${entry.customerReturnCompleted ? "✓ Completed" : "Not Yet"}</strong></span>
              <span>Status <strong>${escapeHtml(entry.status || "—")}</strong></span>
            </div>

            ${
              complete
                ? ""
                : `<div class="missing-line">Missing: ${escapeHtml(missing.join(", "))}</div>`
            }

            <div class="saved-vehicle-actions">
              <button class="secondary-btn edit-vehicle-btn" data-id="${entry.id}" type="button">
                Edit
              </button>

              <button class="delete-one-btn delete-vehicle-btn" data-id="${entry.id}" type="button">
                Delete
              </button>
            </div>
          </article>
        `;
      }

      return `
        <article class="saved-vehicle-card">
          <div class="saved-vehicle-top">
            <div>
              <span class="vehicle-type-pill nonrev-pill">Non-Rev</span>
              <h4>Unit ${escapeHtml(entry.unitNumber)}</h4>
              <small class="vehicle-saved-time">Saved ${escapeHtml(formatVehicleSavedTime(entry.savedAt))}</small>
            </div>

            <span class="completion-pill ${complete ? "complete-pill" : "missing-pill"}">
              ${complete ? "Complete" : "Missing Info"}
            </span>
          </div>

          <div class="saved-vehicle-grid">
            <span>Vehicle <strong>${escapeHtml(entry.vehicleClass || "—")}</strong></span>
            <span>Mileage <strong>${escapeHtml(entry.mileage || "—")}</strong></span>
            <span>Fuel <strong>${escapeHtml(entry.fuel || "—")}</strong></span>
            <span>Damage <strong>${escapeHtml(entry.damage || "—")}</strong></span>
            <span>VPF <strong>${entry.vpfDone ? "✓ Done" : "—"}</strong></span>
            <span>Status <strong>${escapeHtml(entry.status || "—")}</strong></span>
          </div>

          ${
            entry.damage === "Yes" && entry.damageNote
              ? `<div class="damage-note-line"><strong>Damage Note:</strong> ${escapeHtml(entry.damageNote)}</div>`
              : ""
          }

          ${
            complete
              ? ""
              : `<div class="missing-line">Missing: ${escapeHtml(missing.join(", "))}</div>`
          }

          <div class="saved-vehicle-actions">
            <button class="secondary-btn edit-vehicle-btn" data-id="${entry.id}" type="button">
              Edit
            </button>

            <button class="delete-one-btn delete-vehicle-btn" data-id="${entry.id}" type="button">
              Delete
            </button>
          </div>
        </article>
      `;
    })
    .join("");

  document.querySelectorAll(".edit-vehicle-btn").forEach((button) => {
    button.addEventListener("click", () => {
      editVehicleEntry(button.dataset.id);
    });
  });

  document.querySelectorAll(".delete-vehicle-btn").forEach((button) => {
    button.addEventListener("click", () => {
      deleteVehicleEntry(button.dataset.id);
    });
  });
}

function editVehicleEntry(entryId) {
  const entries = loadVehicleLogEntries();
  const entry = entries.find((item) => item.id === entryId);

  if (!entry) {
    return;
  }

  vehicleLogEditingId = entry.id;
  selectedVehicleType = entry.type === "customer" ? "customer" : "nonrev";
  selectedVehicleClass = entry.vehicleClass || "";
  selectedFuel = entry.fuel || "";
  selectedDamage = entry.damage || "";
  selectedVPF = Boolean(entry.vpfDone);
  selectedVehicleStatus = entry.status || "";
  customerReturnCompleted = Boolean(entry.customerReturnCompleted);

  vehicleTypedDraft = {
    unitNumber: entry.unitNumber || "",
    mileage: entry.mileage || "",
    damageNote: entry.damageNote || ""
  };

  updateVehicleTypeButtons();
  renderVehicleEntryForm(entry);

  document.getElementById("saveVehicleBtn").textContent = "Update Vehicle";
  document.getElementById("cancelVehicleEditBtn").classList.remove("hidden");

  document.querySelector(".vehicle-entry-card").scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
}

function deleteVehicleEntry(entryId) {
  const entries = loadVehicleLogEntries();
  const entry = entries.find((item) => item.id === entryId);

  if (!entry) {
    return;
  }

  const shouldDelete = window.confirm(
    `Delete unit ${entry.unitNumber} from the vehicle log?`
  );

  if (!shouldDelete) {
    return;
  }

  const updated = entries.filter((item) => item.id !== entryId);
  saveVehicleLogEntries(updated);

  if (vehicleLogEditingId === entryId) {
    resetVehicleEntryForm();
  }

  renderVehicleLogList();
  showVehicleFormMessage(
    `Unit ${entry.unitNumber} deleted.`,
    "neutral"
  );
}

function checkVehicleLog() {
  const entries = loadVehicleLogEntries();
  const result = document.getElementById("vehicleCheckResult");

  if (entries.length === 0) {
    result.className = "vehicle-check-result check-neutral";
    result.innerHTML = `
      <strong>No vehicles saved.</strong>
      <span>Add vehicles before running the check.</span>
    `;
    return;
  }

  const incompleteEntries = entries
    .map((entry) => ({
      entry,
      missing: getVehicleMissingItems(entry)
    }))
    .filter((item) => item.missing.length > 0);

  if (incompleteEntries.length === 0) {
    result.className = "vehicle-check-result check-good";
    result.innerHTML = `
      <strong>✓ You are good to go inside.</strong>
      <span>All ${entries.length} saved vehicle${entries.length === 1 ? "" : "s"} have the required information.</span>
    `;
    return;
  }

  result.className = "vehicle-check-result check-warn";
  result.innerHTML = `
    <strong>Don't go inside yet.</strong>
    <span>Finish these items first:</span>

    <ul>
      ${incompleteEntries
        .map(
          ({ entry, missing }) => `
            <li>
              Unit ${escapeHtml(entry.unitNumber)} — ${escapeHtml(missing.join(", "))}
            </li>
          `
        )
        .join("")}
    </ul>
  `;
}

function showVehicleFormMessage(message, type) {
  const box = document.getElementById("vehicleFormMessage");

  if (!box) {
    return;
  }

  box.className = `vehicle-form-message vehicle-message-${type}`;
  box.textContent = message;

  window.setTimeout(() => {
    if (box) {
      box.classList.add("hidden");
    }
  }, 5000);
}


// ==============================
// SEARCH
// ==============================

procedureSearch.addEventListener("input", (event) => {
  const searchTerm = event.target.value.trim().toLowerCase();
  const baseList = howToProcedures();

  if (!searchTerm) {
    renderProcedures(baseList, howToGrid);
    return;
  }

  const filteredProcedures = baseList.filter((procedure) => {
    const searchableText = [
      procedure.id,
      procedure.title,
      procedure.category,
      procedure.description,
      ...procedure.sections.flatMap((section) => [
        section.heading,
        ...section.items
      ])
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(searchTerm);
  });

  renderProcedures(filteredProcedures, howToGrid);
});

// ==============================
// NAVIGATION
// ==============================

backToPlaybookBtn.addEventListener("click", () => {
  const returnToHowTo = currentProcedure && HOW_TO_PROCEDURE_IDS.includes(currentProcedure.id);
  currentProcedure = null;

  if (returnToHowTo) {
    showHowToMode();
  } else {
    showPlaybookHome();
  }
});

playbookModeBtn.addEventListener("click", () => {
  currentMode = "playbook";
  setActiveModeButton("playbook");
  showPlaybookHome();
});

howToModeBtn?.addEventListener("click", () => {
  currentMode = "howto";
  showHowToMode();
});

trainingModeBtn.addEventListener("click", () => {
  currentMode = "training";
  setActiveModeButton("training");
  showTrainingMode();
});

function setActiveModeButton(mode) {
  playbookModeBtn.classList.remove("active");
  howToModeBtn?.classList.remove("active");
  trainingModeBtn.classList.remove("active");

  if (mode === "playbook") {
    playbookModeBtn.classList.add("active");
  }

  if (mode === "howto") {
    howToModeBtn?.classList.add("active");
  }

  if (mode === "training") {
    trainingModeBtn.classList.add("active");
  }
}

function showPlaybookHome() {
  setActiveModeButton("playbook");

  playbookHome.classList.remove("hidden");
  howToView?.classList.add("hidden");
  procedureView.classList.add("hidden");
  trainingView.classList.add("hidden");
  document.getElementById("yardCheckWorkspace")?.classList.add("hidden");
  renderProcedures(everydayProcedures());
    document.getElementById("callsView")?.classList.add("hidden");
    document.getElementById("callsModeBtn")?.classList.remove("active");

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showHowToMode() {
  setActiveModeButton("howto");

  playbookHome.classList.add("hidden");
  procedureView.classList.add("hidden");
  trainingView.classList.add("hidden");
  document.getElementById("yardCheckWorkspace")?.classList.add("hidden");
  document.getElementById("callsView")?.classList.add("hidden");
  howToView?.classList.remove("hidden");
  document.getElementById("callsModeBtn")?.classList.remove("active");

  if (procedureSearch) procedureSearch.value = "";
  renderProcedures(howToProcedures(), howToGrid);

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ==============================
// TRAINING MODE
// ==============================

function showTrainingMode() {
  playbookHome.classList.add("hidden");
  howToView?.classList.add("hidden");
  procedureView.classList.add("hidden");
  document.getElementById("yardCheckWorkspace")?.classList.add("hidden");
  trainingView.classList.remove("hidden");

  if (typeof scenarios !== "undefined" && scenarios.length > 0) {
    loadRandomScenario();
  } else {
    scenarioCategory.textContent = "Training Mode";
    scenarioQuestion.textContent =
      "Training scenarios have not been added yet.";
    scenarioAnswers.innerHTML = "";
    scenarioFeedback.classList.add("hidden");
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function loadRandomScenario() {
  if (typeof scenarios === "undefined" || scenarios.length === 0) {
    return;
  }

  let randomScenario;

  if (scenarios.length > 1) {
    do {
      const randomIndex = Math.floor(Math.random() * scenarios.length);
      randomScenario = scenarios[randomIndex];
    } while (
      currentScenario &&
      randomScenario.id === currentScenario.id
    );
  } else {
    randomScenario = scenarios[0];
  }

  currentScenario = randomScenario;

  scenarioCategory.textContent =
    currentScenario.category || "Scenario";

  scenarioQuestion.textContent =
    currentScenario.question;

  scenarioAnswers.innerHTML = "";
  scenarioFeedback.innerHTML = "";
  scenarioFeedback.classList.add("hidden");

  currentScenario.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer-button";
    button.textContent = answer;

    button.addEventListener("click", () => {
      checkScenarioAnswer(index, button);
    });

    scenarioAnswers.appendChild(button);
  });
}

function checkScenarioAnswer(selectedIndex, selectedButton) {
  if (!currentScenario) {
    return;
  }

  const answerButtons =
    document.querySelectorAll(".answer-button");

  const alreadyAnswered = Array.from(answerButtons).some(
    (button) => button.disabled
  );

  if (alreadyAnswered) {
    return;
  }

  trainingAttempts++;

  const isCorrect =
    selectedIndex === currentScenario.correctAnswer;

  if (isCorrect) {
    trainingScore++;
    selectedButton.classList.add("correct");

    scenarioFeedback.innerHTML = `
      <strong>Correct.</strong>
      <p>${currentScenario.explanation}</p>
    `;
  } else {
    selectedButton.classList.add("incorrect");

    if (answerButtons[currentScenario.correctAnswer]) {
      answerButtons[
        currentScenario.correctAnswer
      ].classList.add("correct");
    }

    scenarioFeedback.innerHTML = `
      <strong>Not quite.</strong>
      <p>${currentScenario.explanation}</p>
    `;
  }

  answerButtons.forEach((button) => {
    button.disabled = true;
  });

  scenarioFeedback.classList.remove("hidden");
  updateScoreDisplay();
}

nextScenarioBtn.addEventListener("click", () => {
  loadRandomScenario();
});

resetScoreBtn.addEventListener("click", () => {
  trainingScore = 0;
  trainingAttempts = 0;
  updateScoreDisplay();

  if (typeof scenarios !== "undefined" && scenarios.length > 0) {
    loadRandomScenario();
  }
});

function updateScoreDisplay() {
  scoreDisplay.textContent =
    `${trainingScore} / ${trainingAttempts}`;
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (!procedureView.classList.contains("hidden")) {
      showPlaybookHome();
    }
  }
});


// ==========================================================
// CALL EXPERIENCE LIBRARY V1
// ==========================================================

const CALLS_STORAGE_KEY = "penskeCallsV1";
const PLAYBOOK_BACKUP_VERSION = 1;
let activeCallId = null;
let callHistoryFilter = "all";
let pendingBackupImport = null;
let resolutionReviewMessages = [];
let resolutionReviewApproved = false;


function loadCalls() {
  try {
    const saved = JSON.parse(localStorage.getItem(CALLS_STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch (error) {
    return [];
  }
}

function saveCalls(calls) {
  localStorage.setItem(CALLS_STORAGE_KEY, JSON.stringify(calls));
}

function makeCallId() {
  return `call-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getActiveCall() {
  if (!activeCallId) return null;
  return loadCalls().find((call) => call.id === activeCallId) || null;
}

function readCurrentCallFields() {
  return {
    customer: document.getElementById("callCustomer")?.value.trim() || "",
    company: document.getElementById("callCompany")?.value.trim() || "",
    reference: document.getElementById("callReference")?.value.trim() || "",
    phone: document.getElementById("callPhone")?.value.trim() || "",
    scratch: document.getElementById("callScratchpad")?.value.trim() || ""
  };
}

function showCallMessage(message, type = "good") {
  const box = document.getElementById("callMessage");
  if (!box) return;
  box.className = `call-message ${type}`;
  box.textContent = message;
}

function clearCallMessage() {
  const box = document.getElementById("callMessage");
  if (!box) return;
  box.className = "hidden";
  box.textContent = "";
}

function saveCurrentCall(options = {}) {
  const fields = readCurrentCallFields();
  let calls = loadCalls();
  let call = calls.find((item) => item.id === activeCallId);

  if (!call) {
    call = {
      id: makeCallId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: "open",
      customer: "",
      company: "",
      reference: "",
      phone: "",
      scratch: "",
      notes: [],
      resolution: "",
      lesson: "",
      aiAdvice: "",
      aiAdviceAt: null,
      resolvedAt: null
    };
    activeCallId = call.id;
    calls.unshift(call);
  }

  call.customer = fields.customer;
  call.company = fields.company;
  call.reference = fields.reference;
  call.phone = fields.phone;
  call.scratch = fields.scratch;
  call.updatedAt = new Date().toISOString();

  saveCalls(calls);
  renderActiveCall();
  renderCallHistory();

  if (!options.silent) {
    showCallMessage("Call saved on this device.", "good");
  }

  return call;
}

function addCurrentCallNote() {
  const scratch = document.getElementById("callScratchpad");
  const text = scratch?.value.trim() || "";

  if (!text) {
    showCallMessage("Type something in Running Notes first.", "warn");
    scratch?.focus();
    return;
  }

  const call = saveCurrentCall({ silent: true });
  const calls = loadCalls();
  const stored = calls.find((item) => item.id === call.id);

  stored.notes = Array.isArray(stored.notes) ? stored.notes : [];
  stored.notes.push({
    id: `note-${Date.now()}`,
    text,
    createdAt: new Date().toISOString()
  });
  stored.scratch = "";
  stored.updatedAt = new Date().toISOString();

  saveCalls(calls);

  if (scratch) {
    scratch.value = "";
    scratch.focus();
  }

  renderActiveCall();
  renderCallHistory();
  showCallMessage("Note added to this call.", "good");
}

function newCall() {
  activeCallId = null;
  clearCallMessage();

  ["callCustomer", "callCompany", "callReference", "callPhone", "callScratchpad", "callResolution", "callLesson"]
    .forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.value = "";
    });

  document.getElementById("resolutionPanel")?.classList.add("hidden");
  const similarResults = document.getElementById("similarCallResults");
  if (similarResults) {
    similarResults.classList.add("hidden");
    similarResults.innerHTML = "";
  }
  renderActiveCall();
}

function openSavedCall(id) {
  activeCallId = id;
  clearCallMessage();

  const call = getActiveCall();
  if (!call) return;

  const values = {
    callCustomer: call.customer || "",
    callCompany: call.company || "",
    callReference: call.reference || "",
    callPhone: call.phone || "",
    callScratchpad: call.scratch || "",
    callResolution: call.resolution || "",
    callLesson: call.lesson || ""
  };

  Object.entries(values).forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (el) el.value = value;
  });

  document.getElementById("resolutionPanel")?.classList.add("hidden");
  renderActiveCall();

  document.getElementById("callsView")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function formatCallDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString([], {
    month: "short",
    day: "numeric",
    year: "2-digit",
    hour: "numeric",
    minute: "2-digit"
  });
}

function callDisplayTitle(call) {
  return call.customer || call.company || call.reference || "Untitled Call";
}

function renderActiveCall() {
  const call = getActiveCall();
  const heading = document.getElementById("currentCallHeading");
  const status = document.getElementById("currentCallStatus");
  const timeline = document.getElementById("callTimeline");
  const resolveButton = document.getElementById("resolveCallBtn");
  const editResolutionButton = document.getElementById("editResolutionBtn");
  const aiResult = document.getElementById("aiCallResult");
  const aiText = document.getElementById("aiCallText");

  if (!heading || !status || !timeline || !resolveButton) return;

  if (!call) {
    heading.textContent = "New Call";
    status.textContent = "OPEN";
    status.className = "call-status open";
    timeline.innerHTML = `
      <div class="empty-call-state">
        <strong>No notes yet.</strong>
        <span>Type in Running Notes and tap Add Note as the call develops.</span>
      </div>
    `;
    resolveButton.textContent = "Resolve Call";
    resolveButton.disabled = false;
    editResolutionButton?.classList.add("hidden");
    aiResult?.classList.add("hidden");
    document.getElementById("aiMatchBadge")?.classList.add("hidden");
    document.getElementById("aiCallCards")?.replaceChildren();
    if (aiText) aiText.textContent = "";
    return;
  }

  heading.textContent = callDisplayTitle(call);
  status.textContent = call.status === "resolved" ? "RESOLVED" : "OPEN";
  status.className = `call-status ${call.status === "resolved" ? "resolved" : "open"}`;

  const notes = Array.isArray(call.notes) ? call.notes : [];
  const pieces = notes.map((note) => `
    <div class="call-note">
      <div class="call-note-meta">
        <strong>YOU</strong>
        <span>${escapeHtml(formatCallDate(note.createdAt))}</span>
      </div>
      <p>${escapeHtml(note.text)}</p>
    </div>
  `);

  if (call.scratch) {
    pieces.push(`
      <div class="call-note draft-note">
        <div class="call-note-meta">
          <strong>UNFILED SCRATCH</strong>
          <span>Saved</span>
        </div>
        <p>${escapeHtml(call.scratch)}</p>
      </div>
    `);
  }

  if (call.status === "resolved") {
    pieces.push(`
      <div class="call-resolution-card">
        <span class="mini-label">FINAL RESOLUTION</span>
        <p>${escapeHtml(call.resolution || "No resolution notes entered.")}</p>
        <span class="mini-label lesson-label">LESSON LEARNED</span>
        <p>${escapeHtml(call.lesson || "No lesson entered.")}</p>
      </div>
    `);
  }

  timeline.innerHTML = pieces.length
    ? pieces.join("")
    : `
      <div class="empty-call-state">
        <strong>Call saved.</strong>
        <span>Add running notes as the conversation develops.</span>
      </div>
    `;

  if (call.aiAdvice) {
    renderAiAdvice(call.aiAdvice);
  } else {
    aiResult?.classList.add("hidden");
    document.getElementById("aiMatchBadge")?.classList.add("hidden");
    document.getElementById("aiCallCards")?.replaceChildren();
    if (aiText) aiText.textContent = "";
  }

  if (call.status === "resolved") {
    resolveButton.textContent = "Reopen Call";
    resolveButton.disabled = false;
    editResolutionButton?.classList.remove("hidden");
  } else {
    resolveButton.textContent = "Resolve Call";
    resolveButton.disabled = false;
    editResolutionButton?.classList.add("hidden");
  }
}

function beginResolveCall() {
  const existing = getActiveCall();

  if (existing?.status === "resolved") {
    reopenResolvedCall();
    return;
  }

  const call = saveCurrentCall({ silent: true });

  if (!call) return;

  openResolutionEditor(call);
}

function openResolutionEditor(call) {
  const panel = document.getElementById("resolutionPanel");
  const resolution = document.getElementById("callResolution");
  const lesson = document.getElementById("callLesson");

  if (resolution) resolution.value = call?.resolution || "";
  if (lesson) lesson.value = call?.lesson || "";

  resetResolutionReview();
  panel?.classList.remove("hidden");
  panel?.scrollIntoView({ behavior: "smooth", block: "center" });
  resolution?.focus();
}

function editResolvedCallResolution() {
  const call = getActiveCall();

  if (!call) {
    showCallMessage("Open a saved call first.", "warn");
    return;
  }

  openResolutionEditor(call);
}

function reopenResolvedCall() {
  let calls = loadCalls();
  const call = calls.find((item) => item.id === activeCallId);

  if (!call) {
    showCallMessage("Open a saved call first.", "warn");
    return;
  }

  call.status = "open";
  call.updatedAt = new Date().toISOString();
  saveCalls(calls);

  renderActiveCall();
  renderCallHistory();
  showCallMessage("Call reopened. You can add more notes and resolve it again when finished.", "good");
}

function resetResolutionReview() {
  resolutionReviewMessages = [];
  resolutionReviewApproved = false;

  const area = document.getElementById("resolutionReviewArea");
  const thread = document.getElementById("resolutionReviewThread");
  const reply = document.getElementById("resolutionReviewReply");
  const finish = document.getElementById("finishResolutionReviewBtn");
  const save = document.getElementById("saveResolutionBtn");

  area?.classList.add("hidden");
  if (thread) thread.innerHTML = "";
  if (reply) reply.value = "";
  finish?.classList.add("hidden");
  if (save) save.disabled = true;
}

function renderResolutionReviewThread() {
  const thread = document.getElementById("resolutionReviewThread");
  if (!thread) return;

  thread.innerHTML = resolutionReviewMessages.map((message) => `
    <div class="resolution-review-message ${message.role === "user" ? "user" : "assistant"}">
      <span>${message.role === "user" ? "YOU" : "AI REVIEW"}</span>
      <p>${escapeHtml(message.text).replace(/\n/g, "<br>")}</p>
    </div>
  `).join("");

  thread.scrollTop = thread.scrollHeight;
}

async function requestResolutionReview(userReply = "") {
  const resolution = document.getElementById("callResolution")?.value.trim() || "";

  if (!resolution) {
    showCallMessage("Write what happened first, then review the resolution with AI.", "warn");
    document.getElementById("callResolution")?.focus();
    return;
  }

  const call = saveCurrentCall({ silent: true });
  if (!call) return;

  if (userReply) {
    resolutionReviewMessages.push({ role: "user", text: userReply });
  }

  const reviewButton = document.getElementById("reviewResolutionBtn");
  const sendButton = document.getElementById("sendResolutionReplyBtn");
  const area = document.getElementById("resolutionReviewArea");

  reviewButton.disabled = true;
  if (sendButton) sendButton.disabled = true;
  area?.classList.remove("hidden");
  clearCallMessage();

  try {
    const payload = {
      mode: "resolution_review",
      currentCall: {
        customer: call.customer || "",
        company: call.company || "",
        reference: call.reference || "",
        scratch: call.scratch || "",
        notes: Array.isArray(call.notes) ? call.notes.map((note) => note.text) : []
      },
      proposedResolution: resolution,
      proposedLesson: document.getElementById("callLesson")?.value.trim() || "",
      reviewMessages: resolutionReviewMessages,
      procedures: prepareProceduresForAi()
    };

    const response = await fetch("/.netlify/functions/call-assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || "Resolution review is unavailable.");

    const review = String(data.review || data.advice || "").trim();
    if (!review) throw new Error("The AI returned no resolution review.");

    resolutionReviewMessages.push({ role: "assistant", text: review });
    renderResolutionReviewThread();

    const ready = data.readyToSave === true;
    document.getElementById("finishResolutionReviewBtn")?.classList.toggle("hidden", !ready);

    if (ready) {
      const finalResolution = String(data.finalResolution || "").trim();
      const finalLesson = String(data.lesson || "").trim();

      if (finalResolution) document.getElementById("callResolution").value = finalResolution;
      if (finalLesson) document.getElementById("callLesson").value = finalLesson;

      resolutionReviewApproved = true;
      const save = document.getElementById("saveResolutionBtn");
      if (save) save.disabled = false;
    } else {
      resolutionReviewApproved = false;
      const save = document.getElementById("saveResolutionBtn");
      if (save) save.disabled = true;
      document.getElementById("resolutionReviewReply")?.focus();
    }
  } catch (error) {
    showCallMessage(error.message || "Could not review this resolution.", "warn");
  } finally {
    reviewButton.disabled = false;
    if (sendButton) sendButton.disabled = false;
  }
}

function startResolutionReview() {
  resetResolutionReview();
  requestResolutionReview();
}

function sendResolutionReviewReply() {
  const reply = document.getElementById("resolutionReviewReply");
  const text = reply?.value.trim() || "";

  if (!text) {
    showCallMessage("Type your reply to the AI first.", "warn");
    reply?.focus();
    return;
  }

  reply.value = "";
  requestResolutionReview(text);
}

function useFinalResolutionSummary() {
  resolutionReviewApproved = true;
  const save = document.getElementById("saveResolutionBtn");
  if (save) save.disabled = false;
  showCallMessage("Final summary is ready. Review it, edit if needed, then approve and save.", "good");
  document.getElementById("callResolution")?.focus();
}

function saveCallResolution() {
  const resolution = document.getElementById("callResolution")?.value.trim() || "";
  const lesson = document.getElementById("callLesson")?.value.trim() || "";

  if (!resolution) {
    showCallMessage("Write how you actually solved the problem before resolving the call.", "warn");
    document.getElementById("callResolution")?.focus();
    return;
  }

  if (!resolutionReviewApproved) {
    showCallMessage("Review the resolution with AI and reach a final summary before saving.", "warn");
    return;
  }

  let calls = loadCalls();
  const call = calls.find((item) => item.id === activeCallId);

  if (!call) {
    showCallMessage("Save the call first.", "warn");
    return;
  }

  call.resolution = resolution;
  call.lesson = lesson;
  call.status = "resolved";
  call.resolvedAt = new Date().toISOString();
  call.updatedAt = new Date().toISOString();

  saveCalls(calls);
  document.getElementById("resolutionPanel")?.classList.add("hidden");
  renderActiveCall();
  renderCallHistory();
  showCallMessage("Resolved. Your solution is saved for next time.", "good");
}

function deleteSavedCall(id) {
  const calls = loadCalls();
  const call = calls.find((item) => item.id === id);
  if (!call) return;

  const okay = window.confirm(`Delete "${callDisplayTitle(call)}" from Call History?`);
  if (!okay) return;

  saveCalls(calls.filter((item) => item.id !== id));

  if (activeCallId === id) {
    newCall();
  }

  renderCallHistory();
}

function searchableCallText(call) {
  const notes = Array.isArray(call.notes) ? call.notes.map((note) => note.text).join(" ") : "";
  return [
    call.customer,
    call.company,
    call.reference,
    call.scratch,
    notes,
    call.resolution,
    call.lesson
  ].filter(Boolean).join(" ").toLowerCase();
}

function renderCallHistory() {
  const list = document.getElementById("callHistoryList");
  const count = document.getElementById("callCount");
  const search = document.getElementById("callHistorySearch");
  if (!list || !count) return;

  const calls = loadCalls();
  const query = search?.value.trim().toLowerCase() || "";

  count.textContent = calls.length;

  const visible = calls.filter((call) => {
    const matchesFilter =
      callHistoryFilter === "all" ||
      call.status === callHistoryFilter;

    const searchTerms = query.split(/\s+/).filter(Boolean);
    const haystack = searchableCallText(call);
    const matchesSearch =
      !searchTerms.length || searchTerms.every((term) => haystack.includes(term));

    return matchesFilter && matchesSearch;
  });

  if (!visible.length) {
    list.innerHTML = `
      <div class="empty-call-state">
        <strong>No matching calls.</strong>
        <span>Saved calls will build your experience library over time.</span>
      </div>
    `;
    return;
  }

  list.innerHTML = visible.map((call) => {
    const noteCount = Array.isArray(call.notes) ? call.notes.length : 0;
    const fallbackSummary = call.scratch || call.notes?.[call.notes.length - 1]?.text || "Saved call";
    const summary = call.status === "resolved"
      ? (call.resolution || fallbackSummary)
      : fallbackSummary;
    const summaryLabel = call.status === "resolved" ? "Solved" : "Latest";
    const lessonPreview = call.status === "resolved" && call.lesson
      ? call.lesson.slice(0, 110)
      : "";

    return `
      <article class="call-history-card ${activeCallId === call.id ? "active" : ""}">
        <button class="call-history-open" data-open-call="${escapeHtml(call.id)}" type="button">
          <div class="call-history-top">
            <strong>${escapeHtml(callDisplayTitle(call))}</strong>
            <span class="call-status ${call.status === "resolved" ? "resolved" : "open"}">
              ${call.status === "resolved" ? "RESOLVED" : "OPEN"}
            </span>
          </div>
          <span class="call-history-date">${escapeHtml(formatCallDate(call.updatedAt || call.createdAt))}</span>
          <p><b>${summaryLabel}:</b> ${escapeHtml(summary.slice(0, 150))}${summary.length > 150 ? "…" : ""}</p>
          ${lessonPreview ? `<p class="history-lesson-preview"><b>Remember:</b> ${escapeHtml(lessonPreview)}${call.lesson.length > 110 ? "…" : ""}</p>` : ""}
          <span class="call-history-meta">${noteCount} note${noteCount === 1 ? "" : "s"}${call.reference ? ` • ${escapeHtml(call.reference)}` : ""}</span>
        </button>
        <button class="delete-call-btn" data-delete-call="${escapeHtml(call.id)}" type="button">Delete</button>
      </article>
    `;
  }).join("");

  list.querySelectorAll("[data-open-call]").forEach((button) => {
    button.addEventListener("click", () => openSavedCall(button.dataset.openCall));
  });

  list.querySelectorAll("[data-delete-call]").forEach((button) => {
    button.addEventListener("click", () => deleteSavedCall(button.dataset.deleteCall));
  });
}


const CALL_SIMILARITY_STOP_WORDS = new Set([
  "the", "and", "for", "that", "this", "with", "from", "they", "their", "there",
  "have", "has", "had", "was", "were", "are", "but", "not", "you", "your", "our",
  "call", "called", "calling", "customer", "company", "unit", "truck", "vehicle",
  "reservation", "penske", "need", "needs", "needed", "said", "says", "saying",
  "about", "into", "just", "then", "than", "when", "where", "what", "which",
  "would", "could", "should", "them", "some", "more", "also", "still", "today"
]);

function normalizedCallWords(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s'-]/g, " ")
    .split(/\s+/)
    .map((word) => word.trim())
    .filter((word) =>
      word.length >= 3 &&
      !CALL_SIMILARITY_STOP_WORDS.has(word)
    );
}

function phraseCandidates(text) {
  const words = normalizedCallWords(text);
  const phrases = new Set();

  for (let i = 0; i < words.length - 1; i += 1) {
    phrases.add(`${words[i]} ${words[i + 1]}`);
  }

  return phrases;
}

function getCallTextForSimilarity(call) {
  const notes = Array.isArray(call.notes)
    ? call.notes.map((note) => note.text).join(" ")
    : "";

  return [
    call.customer,
    call.company,
    call.reference,
    call.scratch,
    notes,
    call.resolution,
    call.lesson
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function tokenizeCallText(text) {
  return new Set(normalizedCallWords(text));
}

function scoreSimilarCall(currentCall, pastCall) {
  const currentText = getCallTextForSimilarity(currentCall);
  const pastText = getCallTextForSimilarity(pastCall);

  const currentTokens = tokenizeCallText(currentText);
  const pastTokens = tokenizeCallText(pastText);
  const currentPhrases = phraseCandidates(currentText);
  const pastPhrases = phraseCandidates(pastText);

  let tokenOverlap = 0;
  currentTokens.forEach((token) => {
    if (pastTokens.has(token)) tokenOverlap += 1;
  });

  let phraseOverlap = 0;
  currentPhrases.forEach((phrase) => {
    if (pastPhrases.has(phrase)) phraseOverlap += 1;
  });

  const score = tokenOverlap + (phraseOverlap * 3);

  return {
    score,
    tokenOverlap,
    phraseOverlap
  };
}

function findSimilarResolvedCalls(currentCall, limit = 5, includeMeta = false) {
  return loadCalls()
    .filter((call) => call.status === "resolved" && call.id !== currentCall.id)
    .map((call) => {
      const match = scoreSimilarCall(currentCall, call);
      return { call, ...match };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return new Date(b.call.updatedAt || b.call.createdAt) - new Date(a.call.updatedAt || a.call.createdAt);
    })
    .slice(0, limit)
    .map(({ call, score, tokenOverlap, phraseOverlap }) => {
      const result = {
        id: call.id,
        createdAt: call.createdAt,
        updatedAt: call.updatedAt,
        customer: call.customer || "",
        company: call.company || "",
        reference: call.reference || "",
        notes: Array.isArray(call.notes) ? call.notes.map((note) => note.text) : [],
        scratch: call.scratch || "",
        resolution: call.resolution || "",
        lesson: call.lesson || ""
      };

      if (includeMeta) {
        result.matchScore = score;
        result.tokenOverlap = tokenOverlap;
        result.phraseOverlap = phraseOverlap;
      }

      return result;
    });
}

function similarityStrength(match) {
  const score = Number(match?.matchScore || 0);
  const phraseOverlap = Number(match?.phraseOverlap || 0);

  if (phraseOverlap >= 2 || score >= 9) return "Strong match";
  if (phraseOverlap >= 1 || score >= 5) return "Good match";
  return "Possible match";
}

function renderSimilarResolvedCalls() {
  const container = document.getElementById("similarCallResults");
  if (!container) return;

  const fields = readCurrentCallFields();
  const existing = getActiveCall();

  const currentCall = {
    id: existing?.id || null,
    customer: fields.customer || existing?.customer || "",
    company: fields.company || existing?.company || "",
    reference: fields.reference || existing?.reference || "",
    phone: fields.phone || existing?.phone || "",
    scratch: fields.scratch || existing?.scratch || "",
    notes: Array.isArray(existing?.notes) ? existing.notes : []
  };

  const currentText = getCallTextForSimilarity(currentCall).trim();

  if (!currentText) {
    container.classList.remove("hidden");
    container.innerHTML = `
      <div class="empty-call-state">
        <strong>Add current call notes first.</strong>
        <span>The matcher needs a short description of the problem to compare against resolved calls.</span>
      </div>
    `;
    return;
  }

  const matches = findSimilarResolvedCalls(currentCall, 3, true);
  container.classList.remove("hidden");

  if (!matches.length) {
    container.innerHTML = `
      <div class="empty-call-state">
        <strong>No useful past match found.</strong>
        <span>Resolve this call when finished and it becomes experience for next time.</span>
      </div>
    `;
    return;
  }

  container.innerHTML = matches.map((match, index) => {
    const title = match.customer || match.company || match.reference || "Resolved Call";
    const strength = similarityStrength(match);
    const resolution = match.resolution || "No resolution was saved.";
    const lesson = match.lesson || "";
    const isTop = index === 0;

    return `
      <article class="similar-call-card ${isTop ? "top-match" : ""}">
        <div class="similar-call-card-top">
          <div>
            <span class="similarity-pill ${strength.toLowerCase().replace(/\s+/g, "-")}">${escapeHtml(strength)}</span>
            <strong>${escapeHtml(title)}</strong>
          </div>
          <span class="call-history-date">${escapeHtml(formatCallDate(match.updatedAt || match.createdAt))}</span>
        </div>

        <div class="similar-call-solution">
          <span class="mini-label">WHAT WORKED</span>
          <p>${escapeHtml(resolution)}</p>
        </div>

        ${lesson ? `
          <div class="similar-call-lesson">
            <span class="mini-label">REMEMBER</span>
            <p>${escapeHtml(lesson)}</p>
          </div>
        ` : ""}

        <div class="similar-call-footer">
          <span>Past example, not policy.</span>
          <div class="similar-call-actions">
            <button class="primary-btn small-btn" data-use-resolution="${escapeHtml(match.id)}" type="button">
              Use This Resolution
            </button>
            <button class="secondary-btn small-btn" data-open-similar-call="${escapeHtml(match.id)}" type="button">
              Open Past Call
            </button>
          </div>
        </div>
      </article>
    `;
  }).join("");

  container.querySelectorAll("[data-use-resolution]").forEach((button) => {
    button.addEventListener("click", () => usePastResolution(button.dataset.useResolution));
  });

  container.querySelectorAll("[data-open-similar-call]").forEach((button) => {
    button.addEventListener("click", () => openSavedCall(button.dataset.openSimilarCall));
  });
}

function usePastResolution(pastCallId) {
  const current = getActiveCall();

  if (!current) {
    showCallMessage("Save the current call first, then choose a past resolution.", "warn");
    return;
  }

  if (current.id === pastCallId) {
    showCallMessage("That is the call you already have open.", "warn");
    return;
  }

  const pastCall = loadCalls().find((call) => call.id === pastCallId && call.status === "resolved");

  if (!pastCall || !pastCall.resolution) {
    showCallMessage("That past call does not have a saved resolution to reuse.", "warn");
    return;
  }

  const panel = document.getElementById("resolutionPanel");
  const resolution = document.getElementById("callResolution");
  const lesson = document.getElementById("callLesson");

  if (resolution) resolution.value = pastCall.resolution || "";
  if (lesson && pastCall.lesson) lesson.value = pastCall.lesson;

  panel?.classList.remove("hidden");
  panel?.scrollIntoView({ behavior: "smooth", block: "center" });
  resolution?.focus();

  showCallMessage(
    `Previous resolution loaded from "${callDisplayTitle(pastCall)}". Review it, edit anything that changed, then save.`,
    "good"
  );
}

function mergeById(currentItems, importedItems) {
  const map = new Map();

  (Array.isArray(currentItems) ? currentItems : []).forEach((item) => {
    if (item && item.id) map.set(item.id, item);
  });

  (Array.isArray(importedItems) ? importedItems : []).forEach((item) => {
    if (!item || !item.id) return;

    const existing = map.get(item.id);
    if (!existing) {
      map.set(item.id, item);
      return;
    }

    const existingTime = new Date(existing.updatedAt || existing.createdAt || 0).getTime();
    const importedTime = new Date(item.updatedAt || item.createdAt || 0).getTime();

    map.set(item.id, importedTime >= existingTime ? item : existing);
  });

  return Array.from(map.values()).sort((a, b) => {
    const aTime = new Date(a.updatedAt || a.createdAt || 0).getTime();
    const bTime = new Date(b.updatedAt || b.createdAt || 0).getTime();
    return bTime - aTime;
  });
}

function buildPlaybookBackup() {
  // Make sure typed current-call fields are not lost before export.
  const fields = readCurrentCallFields();
  const hasTypedCallData = Object.values(fields).some(Boolean);
  if (hasTypedCallData || activeCallId) {
    saveCurrentCall({ silent: true });
  }

  return {
    app: "Penske Playbook",
    backupVersion: PLAYBOOK_BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    data: {
      calls: loadCalls(),
      vehicleLog: loadVehicleLogEntries()
    }
  };
}

function downloadJsonFile(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function exportPlaybookBackup() {
  const backup = buildPlaybookBackup();
  const stamp = new Date().toISOString().slice(0, 10);
  downloadJsonFile(`penske-playbook-backup-${stamp}.json`, backup);
  showCallMessage("Backup exported. Keep the JSON file somewhere you can find it later.", "good");
}

function validateBackupPayload(payload) {
  if (!payload || typeof payload !== "object") {
    throw new Error("That file is not a valid Playbook backup.");
  }

  if (payload.app !== "Penske Playbook" || !payload.data) {
    throw new Error("That JSON file is not recognized as a Penske Playbook backup.");
  }

  if (!Array.isArray(payload.data.calls) || !Array.isArray(payload.data.vehicleLog)) {
    throw new Error("The backup file is missing Calls or Vehicle Log data.");
  }

  return payload;
}

async function readBackupFile(file) {
  const text = await file.text();
  let payload;

  try {
    payload = JSON.parse(text);
  } catch (error) {
    throw new Error("The selected file is not valid JSON.");
  }

  return validateBackupPayload(payload);
}

async function chooseBackupFile(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  try {
    pendingBackupImport = await readBackupFile(file);
    const panel = document.getElementById("importChoicePanel");
    panel?.classList.remove("hidden");
    panel?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    showCallMessage(
      `Backup ready: ${pendingBackupImport.data.calls.length} calls and ${pendingBackupImport.data.vehicleLog.length} vehicle log entries.`,
      "good"
    );
  } catch (error) {
    pendingBackupImport = null;
    showCallMessage(error.message || "Could not read that backup file.", "warn");
  } finally {
    // Allows selecting the same file again later.
    event.target.value = "";
  }
}

function finishBackupImport(mode) {
  if (!pendingBackupImport) {
    showCallMessage("Choose a backup file first.", "warn");
    return;
  }

  const importedCalls = pendingBackupImport.data.calls;
  const importedVehicles = pendingBackupImport.data.vehicleLog;

  if (mode === "replace") {
    const okay = window.confirm(
      "Replace current Calls and Vehicle Log with the selected backup? This will overwrite the saved data on this device."
    );
    if (!okay) return;

    saveCalls(importedCalls);
    saveVehicleLogEntries(importedVehicles);
  } else {
    saveCalls(mergeById(loadCalls(), importedCalls));
    saveVehicleLogEntries(mergeById(loadVehicleLogEntries(), importedVehicles));
  }

  activeCallId = null;
  pendingBackupImport = null;

  document.getElementById("importChoicePanel")?.classList.add("hidden");
  newCall();
  renderCallHistory();

  if (typeof renderVehicleLogList === "function") {
    renderVehicleLogList();
  }

  showCallMessage(
    mode === "replace"
      ? "Backup imported. Current saved data was replaced."
      : "Backup imported and merged with the data already on this device.",
    "good"
  );
}

function resetEverything() {
  const firstConfirm = window.confirm(
    "Reset ALL saved Calls and Vehicle Log data on this device? Export a backup first if you may want this data later."
  );
  if (!firstConfirm) return;

  const secondConfirm = window.confirm(
    "Final confirmation: this will permanently clear your saved call experiences, resolutions, lessons, current/open call, and Vehicle Log from this browser. Continue?"
  );
  if (!secondConfirm) return;

  localStorage.removeItem(CALLS_STORAGE_KEY);
  localStorage.removeItem(VEHICLE_LOG_STORAGE_KEY);

  activeCallId = null;
  pendingBackupImport = null;

  clearCurrentCallFields();
  document.getElementById("resolutionPanel")?.classList.add("hidden");
  document.getElementById("importChoicePanel")?.classList.add("hidden");

  const similarResults = document.getElementById("similarCallResults");
  if (similarResults) {
    similarResults.classList.add("hidden");
    similarResults.innerHTML = "";
  }

  renderActiveCall();
  renderCallHistory();

  if (typeof renderVehicleLogList === "function") {
    renderVehicleLogList();
  }

  showCallMessage(
    "Saved Calls and Vehicle Log cleared from this device. Your Playbook procedures and Training content were not deleted.",
    "good"
  );
}

function cancelBackupImport() {
  pendingBackupImport = null;
  document.getElementById("importChoicePanel")?.classList.add("hidden");
  showCallMessage("Import canceled.", "neutral");
}

function prepareProceduresForAi() {
  if (typeof procedures === "undefined" || !Array.isArray(procedures)) {
    return [];
  }

  return procedures.map((procedure) => ({
    id: procedure.id,
    title: procedure.title || "",
    description: procedure.description || "",
    content: procedure.content || procedure.steps || procedure.sections || procedure
  }));
}

const AI_SECTION_ORDER = [
  "QUICK READ",
  "SIMILAR PAST CALL",
  "GET / CONFIRM",
  "BEST PLAYBOOK MATCH",
  "WHAT TO DO NEXT",
  "WHAT TO SAY",
  "WHEN TO ASK FOR HELP"
];

function parseAiAdviceSections(advice) {
  const normalized = String(advice || "").replace(/\r/g, "").trim();
  if (!normalized) return {};

  const sections = {};
  let current = null;

  normalized.split("\n").forEach((rawLine) => {
    const line = rawLine.trim();
    const heading = AI_SECTION_ORDER.find((name) => line.toUpperCase() === name);

    if (heading) {
      current = heading;
      sections[current] = [];
      return;
    }

    if (current) {
      sections[current].push(rawLine);
    }
  });

  Object.keys(sections).forEach((key) => {
    sections[key] = sections[key].join("\n").trim();
  });

  return sections;
}

function aiSectionClass(title) {
  const classes = {
    "QUICK READ": "quick-read",
    "SIMILAR PAST CALL": "past-call",
    "GET / CONFIRM": "confirm",
    "BEST PLAYBOOK MATCH": "playbook-match",
    "WHAT TO DO NEXT": "next-steps",
    "WHAT TO SAY": "what-to-say",
    "WHEN TO ASK FOR HELP": "ask-help"
  };
  return classes[title] || "";
}

function aiSectionLabel(title) {
  const labels = {
    "QUICK READ": "QUICK READ",
    "SIMILAR PAST CALL": "SIMILAR PAST CALL",
    "GET / CONFIRM": "GET / CONFIRM",
    "BEST PLAYBOOK MATCH": "PLAYBOOK MATCH",
    "WHAT TO DO NEXT": "WHAT TO DO NEXT",
    "WHAT TO SAY": "WHAT TO SAY",
    "WHEN TO ASK FOR HELP": "ASK FOR HELP WHEN"
  };
  return labels[title] || title;
}

function formatAiSectionBody(text) {
  const lines = String(text || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (!lines.length) return "";

  const numbered = lines.every((line) => /^\d+[.)]\s+/.test(line));
  const bullets = lines.every((line) => /^[-•*]\s+/.test(line));

  if (numbered) {
    return `<ol>${lines.map((line) => `<li>${escapeHtml(line.replace(/^\d+[.)]\s+/, ""))}</li>`).join("")}</ol>`;
  }

  if (bullets) {
    return `<ul>${lines.map((line) => `<li>${escapeHtml(line.replace(/^[-•*]\s+/, ""))}</li>`).join("")}</ul>`;
  }

  return lines.map((line) => `<p>${escapeHtml(line)}</p>`).join("");
}

function renderAiAdvice(advice) {
  const result = document.getElementById("aiCallResult");
  const rawText = document.getElementById("aiCallText");
  const cards = document.getElementById("aiCallCards");
  const badge = document.getElementById("aiMatchBadge");

  if (rawText) rawText.textContent = advice || "";
  if (!cards) return;

  const sections = parseAiAdviceSections(advice);
  const hasStructured = AI_SECTION_ORDER.some((title) => sections[title]);

  if (!hasStructured) {
    cards.innerHTML = `<section class="ai-guidance-card quick-read"><span class="ai-guidance-label">GUIDANCE</span><div class="ai-guidance-body"><p>${escapeHtml(advice || "")}</p></div></section>`;
    badge?.classList.add("hidden");
    result?.classList.remove("hidden");
    return;
  }

  cards.innerHTML = AI_SECTION_ORDER
    .filter((title) => sections[title])
    .map((title) => `
      <section class="ai-guidance-card ${aiSectionClass(title)}">
        <span class="ai-guidance-label">${aiSectionLabel(title)}</span>
        <div class="ai-guidance-body">${formatAiSectionBody(sections[title])}</div>
      </section>
    `)
    .join("");

  const past = String(sections["SIMILAR PAST CALL"] || "").toLowerCase();
  const strongPastMatch =
    past &&
    !past.includes("no strong match") &&
    !past.includes("no match") &&
    !past.includes("none found");

  badge?.classList.toggle("hidden", !strongPastMatch);
  result?.classList.remove("hidden");
}

async function askAiForCallHelp() {
  const fields = readCurrentCallFields();
  const hasCurrentInfo =
    fields.scratch ||
    fields.customer ||
    fields.company ||
    fields.reference;

  const existing = getActiveCall();
  const hasSavedNotes = existing?.notes?.length > 0;

  if (!hasCurrentInfo && !hasSavedNotes) {
    showCallMessage("Add some call details or notes before asking AI for help.", "warn");
    document.getElementById("callScratchpad")?.focus();
    return;
  }

  const call = saveCurrentCall({ silent: true });
  const button = document.getElementById("askCallAiBtn");
  const loading = document.getElementById("aiCallLoading");
  const result = document.getElementById("aiCallResult");
  const text = document.getElementById("aiCallText");

  button.disabled = true;
  loading?.classList.remove("hidden");
  result?.classList.add("hidden");
  clearCallMessage();

  try {
    const payload = {
      currentCall: {
        customer: call.customer || "",
        company: call.company || "",
        reference: call.reference || "",
        phone: call.phone || "",
        scratch: call.scratch || "",
        notes: Array.isArray(call.notes) ? call.notes.map((note) => note.text) : []
      },
      procedures: prepareProceduresForAi(),
      similarCalls: findSimilarResolvedCalls(call, 5)
    };

    const response = await fetch("/.netlify/functions/call-assistant", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    let data = {};

    try {
      data = await response.json();
    } catch (error) {
      data = {};
    }

    if (!response.ok) {
      throw new Error(
        data.error ||
        "The AI helper is not available yet. Make sure the Netlify function and OPENAI_API_KEY are configured."
      );
    }

    const advice = String(data.advice || "").trim();

    if (!advice) {
      throw new Error("The AI helper returned an empty response.");
    }

    let calls = loadCalls();
    const stored = calls.find((item) => item.id === call.id);

    if (stored) {
      stored.aiAdvice = advice;
      stored.aiAdviceAt = new Date().toISOString();
      stored.updatedAt = new Date().toISOString();
      saveCalls(calls);
    }

    if (text) text.textContent = advice;
    renderAiAdvice(advice);
    renderCallHistory();
    showCallMessage("AI recommendation added to this call.", "good");
  } catch (error) {
    showCallMessage(error.message || "Could not reach the AI helper.", "warn");
  } finally {
    button.disabled = false;
    loading?.classList.add("hidden");
  }
}

async function copyAiCallAdvice() {
  const text = document.getElementById("aiCallText")?.textContent || "";

  if (!text) {
    showCallMessage("There is no AI recommendation to copy yet.", "warn");
    return;
  }

  try {
    await navigator.clipboard.writeText(text);
    showCallMessage("AI recommendation copied.", "good");
  } catch (error) {
    showCallMessage("Copy did not work in this browser. You can select the text manually.", "warn");
  }
}

function initializeCalls() {
  const callsButton = document.getElementById("callsModeBtn");
  const callsView = document.getElementById("callsView");
  if (!callsButton || !callsView) return;

  callsButton.addEventListener("click", () => {
    currentMode = "calls";
    document.getElementById("playbookHome")?.classList.add("hidden");
    document.getElementById("howToView")?.classList.add("hidden");
    document.getElementById("procedureView")?.classList.add("hidden");
    document.getElementById("trainingView")?.classList.add("hidden");
    document.getElementById("yardCheckWorkspace")?.classList.add("hidden");
    callsView.classList.remove("hidden");

    document.getElementById("playbookModeBtn")?.classList.remove("active");
    document.getElementById("howToModeBtn")?.classList.remove("active");
    document.getElementById("trainingModeBtn")?.classList.remove("active");
    callsButton.classList.add("active");

    renderActiveCall();
    renderCallHistory();
  });

  document.getElementById("saveCallBtn")?.addEventListener("click", () => saveCurrentCall());
  document.getElementById("addCallNoteBtn")?.addEventListener("click", addCurrentCallNote);
  document.getElementById("newCallBtn")?.addEventListener("click", newCall);
  document.getElementById("resolveCallBtn")?.addEventListener("click", beginResolveCall);
  document.getElementById("editResolutionBtn")?.addEventListener("click", editResolvedCallResolution);
  document.getElementById("askCallAiBtn")?.addEventListener("click", askAiForCallHelp);
  document.getElementById("copyAiCallBtn")?.addEventListener("click", copyAiCallAdvice);
  document.getElementById("findSimilarCallsBtn")?.addEventListener("click", renderSimilarResolvedCalls);
  document.getElementById("reviewResolutionBtn")?.addEventListener("click", startResolutionReview);
  document.getElementById("sendResolutionReplyBtn")?.addEventListener("click", sendResolutionReviewReply);
  document.getElementById("finishResolutionReviewBtn")?.addEventListener("click", useFinalResolutionSummary);
  document.getElementById("saveResolutionBtn")?.addEventListener("click", saveCallResolution);

  document.getElementById("exportBackupBtn")?.addEventListener("click", exportPlaybookBackup);
  document.getElementById("importBackupBtn")?.addEventListener("click", () => {
    document.getElementById("importBackupFile")?.click();
  });
  document.getElementById("importBackupFile")?.addEventListener("change", chooseBackupFile);
  document.getElementById("mergeBackupBtn")?.addEventListener("click", () => finishBackupImport("merge"));
  document.getElementById("replaceBackupBtn")?.addEventListener("click", () => finishBackupImport("replace"));
  document.getElementById("cancelImportBtn")?.addEventListener("click", cancelBackupImport);
  document.getElementById("resetEverythingBtn")?.addEventListener("click", resetEverything);

  document.getElementById("cancelResolutionBtn")?.addEventListener("click", () => {
    document.getElementById("resolutionPanel")?.classList.add("hidden");
  });

  document.getElementById("callHistorySearch")?.addEventListener("input", renderCallHistory);

  document.querySelectorAll("[data-call-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      callHistoryFilter = button.dataset.callFilter || "all";
      document.querySelectorAll("[data-call-filter]").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      renderCallHistory();
    });
  });

  renderActiveCall();
  renderCallHistory();
}

document.addEventListener("DOMContentLoaded", initializeCalls);
