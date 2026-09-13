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

const playbookHome = document.getElementById("playbookHome");
const procedureView = document.getElementById("procedureView");
const trainingView = document.getElementById("trainingView");

const procedureGrid = document.getElementById("procedureGrid");
const procedureSearch = document.getElementById("procedureSearch");

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
  renderProcedures(procedures);
  updateScoreDisplay();
  showPlaybookHome();
}

initializeApp();

// ==============================
// PLAYBOOK HOME
// ==============================

function renderProcedures(procedureList) {
  procedureGrid.innerHTML = "";

  if (procedureList.length === 0) {
    procedureGrid.innerHTML = `
      <div class="empty-state">
        <p>No procedures found.</p>
      </div>
    `;
    return;
  }

  procedureList.forEach((procedure) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "procedure-button";

    button.innerHTML = `
      <span class="procedure-button-number">${procedure.id}</span>
      <span class="procedure-button-text">
        <strong>${procedure.title}</strong>
        <small>${procedure.description}</small>
      </span>
      <span class="procedure-button-arrow">→</span>
    `;

    button.addEventListener("click", () => {
      openProcedure(procedure.id);
    });

    procedureGrid.appendChild(button);
  });
}

function openProcedure(procedureId) {
  const procedure = procedures.find((item) => item.id === procedureId);

  if (!procedure) {
    console.error(`Procedure ${procedureId} was not found.`);
    return;
  }

  currentProcedure = procedure;
  procedureNumber.textContent = `Procedure #${procedure.id}`;
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
  } else {
    renderStandardProcedure(procedure);
  }

  playbookHome.classList.add("hidden");
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

  if (!searchTerm) {
    renderProcedures(procedures);
    return;
  }

  const filteredProcedures = procedures.filter((procedure) => {
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

  renderProcedures(filteredProcedures);
});

// ==============================
// NAVIGATION
// ==============================

backToPlaybookBtn.addEventListener("click", () => {
  currentProcedure = null;
  showPlaybookHome();
});

playbookModeBtn.addEventListener("click", () => {
  currentMode = "playbook";
  setActiveModeButton("playbook");
  showPlaybookHome();
});

trainingModeBtn.addEventListener("click", () => {
  currentMode = "training";
  setActiveModeButton("training");
  showTrainingMode();
});

function setActiveModeButton(mode) {
  playbookModeBtn.classList.remove("active");
  trainingModeBtn.classList.remove("active");

  if (mode === "playbook") {
    playbookModeBtn.classList.add("active");
  }

  if (mode === "training") {
    trainingModeBtn.classList.add("active");
  }
}

function showPlaybookHome() {
  setActiveModeButton("playbook");

  playbookHome.classList.remove("hidden");
  procedureView.classList.add("hidden");
  trainingView.classList.add("hidden");
    document.getElementById("callsView")?.classList.add("hidden");
    document.getElementById("callsModeBtn")?.classList.remove("active");

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ==============================
// TRAINING MODE
// ==============================

function showTrainingMode() {
  playbookHome.classList.add("hidden");
  procedureView.classList.add("hidden");
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
let activeCallId = null;
let callHistoryFilter = "all";

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
    if (aiText) aiText.textContent = call.aiAdvice;
    aiResult?.classList.remove("hidden");
  } else {
    aiResult?.classList.add("hidden");
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

function saveCallResolution() {
  const resolution = document.getElementById("callResolution")?.value.trim() || "";
  const lesson = document.getElementById("callLesson")?.value.trim() || "";

  if (!resolution) {
    showCallMessage("Write how you actually solved the problem before resolving the call.", "warn");
    document.getElementById("callResolution")?.focus();
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

    const matchesSearch =
      !query || searchableCallText(call).includes(query);

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
    const summary = call.resolution || call.scratch || call.notes?.[call.notes.length - 1]?.text || "Saved call";

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
          <p>${escapeHtml(summary.slice(0, 150))}${summary.length > 150 ? "…" : ""}</p>
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
  return new Set(
    String(text || "")
      .toLowerCase()
      .replace(/[^a-z0-9\s'-]/g, " ")
      .split(/\s+/)
      .filter((word) => word.length >= 3)
  );
}

function findSimilarResolvedCalls(currentCall, limit = 5) {
  const currentText = getCallTextForSimilarity(currentCall);
  const currentTokens = tokenizeCallText(currentText);

  return loadCalls()
    .filter((call) => call.status === "resolved" && call.id !== currentCall.id)
    .map((call) => {
      const tokens = tokenizeCallText(getCallTextForSimilarity(call));
      let overlap = 0;

      currentTokens.forEach((token) => {
        if (tokens.has(token)) overlap += 1;
      });

      return { call, score: overlap };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ call }) => ({
      createdAt: call.createdAt,
      customer: call.customer || "",
      company: call.company || "",
      reference: call.reference || "",
      notes: Array.isArray(call.notes) ? call.notes.map((note) => note.text) : [],
      resolution: call.resolution || "",
      lesson: call.lesson || ""
    }));
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
    result?.classList.remove("hidden");
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
    document.getElementById("procedureView")?.classList.add("hidden");
    document.getElementById("trainingView")?.classList.add("hidden");
    callsView.classList.remove("hidden");

    document.getElementById("playbookModeBtn")?.classList.remove("active");
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
  document.getElementById("saveResolutionBtn")?.addEventListener("click", saveCallResolution);

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
