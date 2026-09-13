// ==========================================
// PENSKE PLAYBOOK
// TRAINING SCENARIOS
// ==========================================

const scenarios = [

  // ========================================
  // CONFIRMATION
  // ========================================

  {
    id: 1,
    procedureId: 1,
    category: "Confirmation",
    question:
      "You're about to make a confirmation call. What should you do FIRST?",

    answers: [
      "Call immediately and ask the customer what they rented",
      "Review the reservation and know the customer, vehicle, pickup date/time, location, and rental details",
      "Open Whiteboard",
      "Go to Vehicle Reconciliation"
    ],

    correctAnswer: 1,

    explanation:
      "Review the reservation before calling so you already know the important rental details."
  },


  {
    id: 2,
    procedureId: 1,
    category: "Confirmation",
    question:
      "During a confirmation call, what additional items should you ask whether the customer needs?",

    answers: [
      "Furniture pads or a dolly",
      "A different account number",
      "A ServiceNet repair order",
      "A different unit status"
    ],

    correctAnswer: 0,

    explanation:
      "Your confirmation process includes checking whether the customer needs additional supplies such as furniture pads or a dolly."
  },


  // ========================================
  // CALLBACK
  // ========================================

  {
    id: 3,
    procedureId: 2,
    category: "Callback",
    question:
      "Before making a callback, which information do you normally write down?",

    answers: [
      "Customer name, truck/vehicle, and pickup location",
      "Only the customer's phone number",
      "Unit status and ServiceNet RO number",
      "Fuel level only"
    ],

    correctAnswer: 0,

    explanation:
      "Your callback setup includes the customer's name, truck or vehicle, and pickup location so you're prepared before starting the conversation."
  },


  {
    id: 4,
    procedureId: 2,
    category: "Callback",
    question:
      "You call someone about a saved quote and they say they're still interested. What direction should the call go?",

    answers: [
      "Toward booking the reservation",
      "Immediately transfer the call",
      "Open Vehicle Reconciliation",
      "Create a Non-Rev"
    ],

    correctAnswer: 0,

    explanation:
      "If they're still interested, the callback can move toward booking the reservation."
  },


  // ========================================
  // ASSIGN UNIT
  // ========================================

  {
    id: 5,
    procedureId: 5,
    category: "Assign Unit",
    question:
      "You need to assign a specific truck to an existing customer reservation. Which path matches your playbook?",

    answers: [
      "Planner → Reservation → Find customer/business → Change Unassigned to unit number",
      "Reports → Daily → Yard Check",
      "Tools → Misc Item",
      "Vehicle → Vehicle Reconciliation → Reconcile"
    ],

    correctAnswer: 0,

    explanation:
      "Your Assign Unit procedure starts in Planner, then Reservation, where you find the customer or business and change Unassigned to the correct unit."
  },


  // ========================================
  // YARD CHECK
  // ========================================

  {
    id: 6,
    procedureId: 6,
    category: "Yard Check",
    question:
      "Which path do you use to pull up your Yard Check report?",

    answers: [
      "Reports → Daily → Yard Check → Summarized → Submit",
      "Tools → Penske Location → Search",
      "Planner → Reservation → Yard Check",
      "Vehicle → Vehicle Info → Yard Check"
    ],

    correctAnswer: 0,

    explanation:
      "Your Yard Check report path is Reports → Daily → Yard Check → Summarized → Submit."
  },


  {
    id: 7,
    procedureId: 6,
    category: "Yard Check",
    question:
      "After submitting the Yard Check report, what does your playbook tell you to do before printing?",

    answers: [
      "Refresh twice",
      "Change every unit to Available",
      "Open CMS Plus",
      "Create a Non-Rev"
    ],

    correctAnswer: 0,

    explanation:
      "Your notes say to refresh twice, open the report, and then print it."
  },


  // ========================================
  // VEHICLE AVAILABILITY
  // ========================================

  {
    id: 8,
    procedureId: 10,
    category: "Vehicle Availability",
    question:
      "A customer asks if you have a certain TYPE of truck available. Where should you check?",

    answers: [
      "Whiteboard",
      "CMS Plus",
      "Unit Jacket",
      "ServiceNet"
    ],

    correctAnswer: 0,

    explanation:
      "Use Whiteboard when checking whether a vehicle TYPE or CLASS is available."
  },


  {
    id: 9,
    procedureId: 10,
    category: "Vehicle Availability",
    question:
      "A customer doesn't know what type of truck they need. What should you do BEFORE choosing a vehicle category?",

    answers: [
      "Ask what they're moving, how much they're moving, and whether they have special needs",
      "Automatically give them a 26-foot truck",
      "Search a random unit number",
      "Open CMS Plus"
    ],

    correctAnswer: 0,

    explanation:
      "First understand what the customer is moving and how much. Then determine the appropriate vehicle category and check Whiteboard."
  },


  // ========================================
  // SPECIFIC UNIT
  // ========================================

  {
    id: 10,
    procedureId: 11,
    category: "Find Specific Unit",
    question:
      "You already have the actual unit number and need to locate that specific truck. Which procedure should you use?",

    answers: [
      "Vehicle → Vehicle Reconciliation → View geofenced units → CORE Connect → Unit #",
      "Whiteboard → Truck → Vehicle Class",
      "Tools → Misc Item",
      "CMS Plus → Invoice"
    ],

    correctAnswer: 0,

    explanation:
      "Whiteboard answers whether you have a TYPE of vehicle. CORE Connect through Vehicle Reconciliation helps when you're looking for a SPECIFIC unit."
  },


  // ========================================
  // RECONCILIATION
  // ========================================

  {
    id: 11,
    procedureId: 12,
    category: "Vehicle Reconciliation",
    question:
      "During the physical Yard Check, you see a unit in RL and the system shows Available. Based on your notes, what does that mean?",

    answers: [
      "That looks good",
      "Immediately put it in Deadline",
      "Automatically check it in",
      "Create a Non-Rev"
    ],

    correctAnswer: 0,

    explanation:
      "In your local yard notes, RL means Ready Line. RL + Available is a normal match."
  },


  {
    id: 12,
    procedureId: 12,
    category: "Vehicle Reconciliation",
    question:
      "You underline a unit during Yard Check because something doesn't match. What should you do next?",

    answers: [
      "Research the unit before changing anything",
      "Automatically check it in",
      "Automatically make it Available",
      "Delete it from the report"
    ],

    correctAnswer: 0,

    explanation:
      "Your key rule is: NOT EVERY underlined unit equals CI. Research first."
  },


  {
    id: 13,
    procedureId: 12,
    category: "Vehicle Reconciliation",
    question:
      "You find a truck physically in A row and its status shows PM. Based on your local yard notes, what should you think?",

    answers: [
      "That can be normal because A row can contain units undergoing preventive maintenance",
      "Every A-row truck must be Available",
      "It must immediately be Non-Rev'd",
      "It automatically needs CI"
    ],

    correctAnswer: 0,

    explanation:
      "Your notes say A row + PM can be normal at your location because A-row units can be there for preventive maintenance."
  },


  {
    id: 14,
    procedureId: 12,
    category: "Vehicle Reconciliation",
    question:
      "A unit is physically in A row, but its status doesn't make sense. What is the safer move based on your procedure?",

    answers: [
      "Research it and put it on the Task List if it needs follow-up",
      "Guess the correct status",
      "Automatically make it Available",
      "Ignore it"
    ],

    correctAnswer: 0,

    explanation:
      "When physical reality and the system don't make sense together, research the unit rather than guessing."
  },


  {
    id: 15,
    procedureId: 12,
    category: "Vehicle Reconciliation",
    question:
      "What information should your Task List help capture?",

    answers: [
      "Unit number, actual physical location, and the action/question needing follow-up",
      "Only the customer's phone number",
      "Only the vehicle type",
      "Only the mileage"
    ],

    correctAnswer: 0,

    explanation:
      "Your Task List helps you track the actual yard location and what still needs to be researched or handled."
  },


  {
    id: 16,
    procedureId: 12,
    category: "Vehicle Reconciliation",
    question:
      "You need to research a unit in ServiceNet. Which sequence matches your notes?",

    answers: [
      "Search unit # → RO # → Correspondence → Read status / check PM",
      "Invoice → CMS Plus → Cab Card",
      "Whiteboard → Truck → Available",
      "Planner → Reservation → Non-Rev"
    ],

    correctAnswer: 0,

    explanation:
      "Your ServiceNet research notes say to search the unit, open the RO, open Correspondence, and read the information to understand the unit's status and whether PM is involved."
  },


  // ========================================
  // CHANGE VEHICLE STATUS
  // ========================================

  {
    id: 17,
    procedureId: 13,
    category: "Change Vehicle Status",
    question:
      "After research confirms that you need to update a vehicle's status, which path matches your playbook?",

    answers: [
      "Vehicle → Vehicle Info → Unit # → Update Status",
      "Reports → Daily → Yard Check",
      "Tools → Nearest Location",
      "CMS Plus → Invoice"
    ],

    correctAnswer: 0,

    explanation:
      "Your Change Vehicle Status path is Vehicle → Vehicle Info → enter the unit number → Update Status."
  },


  // ========================================
  // NON-REV TO ANOTHER LOCATION
  // ========================================

  {
    id: 18,
    procedureId: 14,
    category: "Non-Rev",
    question:
      "You're creating a Non-Rev to move a customer-dropped unit to another location. Before creating the Non-Rev reservation, what is especially important to verify?",

    answers: [
      "Pickup and drop-off locations",
      "Only the customer's last name",
      "Only the truck color",
      "The invoice balance"
    ],

    correctAnswer: 0,

    explanation:
      "Your notes specifically emphasize verifying the pickup and drop-off locations before creating the Non-Rev reservation."
  },


  {
    id: 19,
    procedureId: 14,
    category: "Non-Rev",
    question:
      "During the Non-Rev process, what vehicle information do you verify during check-in?",

    answers: [
      "Damage, mileage, and fuel",
      "Only fuel",
      "Only mileage",
      "Invoice number and account balance"
    ],

    correctAnswer: 0,

    explanation:
      "Your Non-Rev workflow includes verifying damage, mileage, and fuel."
  },


  {
    id: 20,
    procedureId: 14,
    category: "Non-Rev",
    question:
      "In your documented customer-drop-off Non-Rev example, what customer reason do you enter?",

    answers: [
      "Customer Drop Off",
      "Preventive Maintenance",
      "Invoice Question",
      "Vehicle Availability"
    ],

    correctAnswer: 0,

    explanation:
      "Your documented workflow uses Customer Drop Off as the reason for this particular Non-Rev situation."
  },


  // ========================================
  // NEAREST LOCATION
  // ========================================

  {
    id: 21,
    procedureId: 15,
    category: "Find Nearest Location",
    question:
      "A customer needs the closest Penske location. Which path matches your playbook?",

    answers: [
      "Tools → Nearest Location → Address/ZIP",
      "Vehicle → Vehicle Info → Update Status",
      "CMS Plus → Invoice",
      "Reports → Yard Check"
    ],

    correctAnswer: 0,

    explanation:
      "Your nearest-location procedure is Tools → Nearest Location → enter the address and ZIP code."
  },


  // ========================================
  // REGISTRATION / CAB CARD
  // ========================================

  {
    id: 22,
    procedureId: 9,
    category: "Registration / Cab Card",
    question:
      "Someone needs an updated registration for a unit. Where do you FIRST check the cab card?",

    answers: [
      "Unit Jacket",
      "Whiteboard",
      "CMS Plus",
      "Yard Check"
    ],

    correctAnswer: 0,

    explanation:
      "Your basic registration path starts with Unit Jacket → unit number → Cab Card."
  },


  {
    id: 23,
    procedureId: 9,
    category: "Registration / Cab Card",
    question:
      "The Cab Card in Unit Jacket is outdated. What do you need to determine next?",

    answers: [
      "The unit's originating Penske location",
      "The customer's invoice balance",
      "The nearest gas station",
      "The truck's current Whiteboard category"
    ],

    correctAnswer: 0,

    explanation:
      "If the cab card is outdated, your procedure has you identify the originating Penske location so you can contact them about an updated cab card."
  },


  // ========================================
  // INVOICES
  // ========================================

  {
    id: 24,
    procedureId: 18,
    category: "Invoices",
    question:
      "A customer HAS their invoice number and wants to look it up or pay the balance. Where do you go?",

    answers: [
      "Tools → Misc Item",
      "Vehicle → Vehicle Reconciliation",
      "Whiteboard → Truck",
      "Unit Jacket → Cab Card"
    ],

    correctAnswer: 0,

    explanation:
      "Your invoice notes say Tools → Misc Item → enter the invoice number → Search."
  },


  {
    id: 25,
    procedureId: 18,
    category: "Invoices",
    question:
      "The customer has a QUESTION about an invoice and you need to find the invoice details. What system does your playbook tell you to use?",

    answers: [
      "CMS Plus",
      "CORE Connect",
      "ServiceNet",
      "Whiteboard"
    ],

    correctAnswer: 0,

    explanation:
      "Your notes say to use CMS Plus and enter the invoice number when researching questions about the invoice."
  },


  {
    id: 26,
    procedureId: 18,
    category: "Invoices",
    question:
      "The customer doesn't have their invoice number. What does your current playbook tell you to do?",

    answers: [
      "Look up the customer name, then ask for help if needed",
      "Make up an invoice number",
      "Create a Non-Rev",
      "Change the vehicle status"
    ],

    correctAnswer: 0,

    explanation:
      "That's as far as your current notes document this situation: look up the customer name and get help from there if needed."
  }

];