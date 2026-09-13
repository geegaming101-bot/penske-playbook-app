// ==============================
// PENSKE PLAYBOOK
// PROCEDURE DATA
// ==============================

const procedures = [
  {
    id: 1,
    title: "Confirmation",
    category: "Calls",
    type: "script",
    description: "Confirm an upcoming rental and make sure the customer is ready.",
    sections: [
      {
        heading: "When to Use",
        items: [
          "Use this when working upcoming rental confirmations."
        ]
      },
      {
        heading: "Before Calling",
        items: [
          "Review the reservation first.",
          "Know the customer name.",
          "Know the vehicle.",
          "Know the pickup date and time.",
          "Know the pickup location.",
          "Know the rental details."
        ]
      },
      {
        heading: "What to Say",
        items: [
          "Hi, may I speak with [Customer Name]?",
          "Hi [Name], this is Clarence calling with Penske Truck Rental. I’m reaching out to confirm your upcoming rental with us for [Pickup Date].",
          "Ask whether they need additional supplies such as furniture pads or a dolly."
        ]
      },
      {
        heading: "Memory Tip",
        items: [
          "Review first, then call. Know the reservation before you start talking."
        ]
      }
    ]
  },

  {
    id: 2,
    title: "Callback",
    category: "Calls",
    type: "decision",
    description: "Follow up with a customer who received a quote.",
    sections: [
      {
        heading: "When to Use",
        items: [
          "Use this when following up on saved quotes or prior rental interest."
        ]
      },
      {
        heading: "Before Calling",
        items: [
          "Write down the customer name.",
          "Write down the truck or vehicle they were quoted.",
          "Write down the location before starting the callback."
        ]
      },
      {
        heading: "Callback Flow",
        items: [
          "Confirm you are speaking with the correct customer.",
          "Reference the quote or rental they were considering.",
          "Ask whether they are still interested.",
          "If YES, continue toward booking.",
          "If NOT SURE YET, answer what you can and leave the option open.",
          "If NO, note that they are no longer moving forward."
        ]
      },
      {
        heading: "Important",
        items: [
          "Keep this section flexible because the exact conversation changes based on the customer."
        ]
      }
    ]
  },

  {
    id: 3,
    title: "Vehicle Log",
    category: "Vehicles",
    type: "reference",
    description: "Track Non-Revs and simple customer returns so you do not forget vehicle details.",
    sections: [
      {
        heading: "Purpose",
        items: [
          "Use the interactive Vehicle Log to record vehicle information while you are outside.",
          "Saved entries remain on this browser/device until you delete them or clear the log."
        ]
      }
    ]
  },

  {
    id: 4,
    title: "Non-Rev vs a Unit",
    category: "Fleet",
    type: "procedure",
    description: "Contact another Penske location when you need a unit moved to your location.",
    sections: [
      {
        heading: "When to Use",
        items: [
          "Use this when another location has a unit you may need non-revved to your location."
        ]
      },
      {
        heading: "Click Path",
        items: [
          "Go to Tools.",
          "Open Penske Location.",
          "Open District Location.",
          "Search for the location.",
          "Click the location hyperlink.",
          "Use the published phone number to call."
        ]
      },
      {
        heading: "What to Say",
        items: [
          "Ask whether they can non-rev the needed vehicle type to your location."
        ]
      },
      {
        heading: "Memory Tip",
        items: [
          "Find location first, then call."
        ]
      }
    ]
  },

  {
    id: 5,
    title: "Put Unit in Deadline",
    category: "Vehicles",
    type: "reference",
    description: "Use when a unit needs to be placed in Deadline status.",
    sections: [
      {
        heading: "When to Use",
        items: [
          "Usually used during check-in when the unit has a problem."
        ]
      },
      {
        heading: "Important",
        items: [
          "Detailed steps are not added here yet because this is already a procedure you know and your exact click path has not been fully documented in the notes used for this app."
        ]
      }
    ]
  },

  {
    id: 6,
    title: "Assign Unit to Customer",
    category: "Reservations",
    type: "procedure",
    description: "Assign a specific unit to a customer reservation.",
    sections: [
      {
        heading: "Click Path",
        items: [
          "Go to Planner.",
          "Open Reservation.",
          "Find the business or customer reservation.",
          "Change Unassigned to the correct unit number."
        ]
      },
      {
        heading: "Memory Tip",
        items: [
          "Planner → Reservation → Customer → Unassigned → Unit #."
        ]
      }
    ]
  },

  {
    id: 7,
    title: "Yard Check",
    category: "Yard",
    type: "procedure",
    description: "Print the summarized yard check report.",
    sections: [
      {
        heading: "Click Path",
        items: [
          "Go to Reports.",
          "Open Daily.",
          "Select Yard Check.",
          "Choose Summarized.",
          "Submit.",
          "Refresh twice.",
          "Click the report.",
          "Print.",
          "Make sure printing is not double-sided."
        ]
      },
      {
        heading: "Important",
        items: [
          "Refresh twice before opening the report.",
          "Make sure the report does not print double-sided."
        ]
      },
      {
        heading: "Memory Tip",
        items: [
          "Reports → Daily → Yard Check → Summarized → Submit."
        ]
      }
    ]
  },

  {
    id: 8,
    title: "SOS / Fleet",
    category: "Fleet",
    type: "procedure",
    description: "Pull the fleet report used for SOS.",
    sections: [
      {
        heading: "Click Path",
        items: [
          "Go to Planner.",
          "Open Fleet.",
          "Enter the location.",
          "Sort twice.",
          "Export.",
          "Delete the extra column used in your normal process.",
          "Press Ctrl + P.",
          "Use columns B–F for the printed view."
        ]
      },
      {
        heading: "Save",
        items: [
          "Save As.",
          "Use the DOC folder.",
          "Use the SOS folder.",
          "Save in the normal saved location."
        ]
      },
      {
        heading: "Memory Tip",
        items: [
          "Planner → Fleet → Location → Sort twice → Export."
        ]
      }
    ]
  },

  {
    id: 9,
    title: "Finding Keys",
    category: "Fleet",
    type: "procedure",
    description: "Use Fleet to help locate where a vehicle's keys should be.",
    sections: [
      {
        heading: "Click Path",
        items: [
          "Go to Planner.",
          "Open Fleet.",
          "Enter the location.",
          "Sort the fleet."
        ]
      },
      {
        heading: "Important",
        items: [
          "Do not include dry vans when using this process."
        ]
      },
      {
        heading: "Memory Tip",
        items: [
          "Planner → Fleet → Location → Sort."
        ]
      }
    ]
  },

  {
    id: 10,
    title: "Get Updated Registration",
    category: "Vehicles",
    type: "procedure",
    description: "Print a current cab card or get an updated one from the originating location.",
    sections: [
      {
        heading: "Basic Process",
        items: [
          "Open Unit Jacket.",
          "Enter the unit number.",
          "Select Cab Card.",
          "Print the registration.",
          "Replace the registration in the truck."
        ]
      },
      {
        heading: "If the Cab Card Is Outdated",
        items: [
          "Open Unit Jacket.",
          "Enter the unit number.",
          "Open Cab Card.",
          "Check whether the registration is current.",
          "If outdated, look up the unit or reservation to determine where the unit was picked up or which Penske location originated it.",
          "Write down that location number.",
          "Go to Tools.",
          "Open Penske Location.",
          "Enter the location number.",
          "Search.",
          "Click the location.",
          "Use the published number to call the originating Penske location."
        ]
      },
      {
        heading: "What to Say",
        items: [
          "Hey, this is Clarence with Penske Rental. I’m calling about unit #____. We have someone needing an updated cab card for this unit. Could you check and see if you have an updated cab card available?",
          "If they find it: Perfect, can you email that updated cab card to us so I can get it to the person requesting it?"
        ]
      },
      {
        heading: "Important",
        items: [
          "If an updated cab card is received, send the updated cab card back to the person requesting it."
        ]
      }
    ]
  },

  {
    id: 11,
    title: "Check Vehicle Availability",
    category: "Reservations",
    type: "decision",
    description: "Check whether a vehicle TYPE is available before promising it to a customer.",
    sections: [
      {
        heading: "When to Use",
        items: [
          "Use this when a customer asks whether a certain truck or vehicle type is available."
        ]
      },
      {
        heading: "Click Path",
        items: [
          "Go to Whiteboard.",
          "Select Truck.",
          "Search by Vehicle Type or Vehicle Class."
        ]
      },
      {
        heading: "Important",
        items: [
          "Before promising a unit, check WHITEBOARD."
        ]
      },
      {
        heading: "If the Customer Does Not Know the Vehicle Type",
        items: [
          "Ask what they are moving.",
          "Ask how much they are moving.",
          "Ask about any special needs.",
          "Determine the vehicle category.",
          "Go to Whiteboard.",
          "Open Truck.",
          "Search the appropriate type or class."
        ]
      },
      {
        heading: "Vehicle Quick Guide",
        items: [
          "Cargo Vans: Cargo Van; Cargo Van – Lift; High Roof Cargo Van; Delivery Van w/ Shelves; Electric Cargo Vans.",
          "Light Duty: 12' Box Truck; 16' Box Truck; Railway Trucks w/ Shelves; 16' and 18' Cabover Truck.",
          "Medium: 18'–22' Step Van; 22'–26' Straight Truck; Non-CDL / CDL versions where applicable.",
          "Heavy: Single-Axle Day Cab Tractor; Tandem-Axle Day Cab Tractor; Tandem-Axle Sleeper Tractor.",
          "Refrigerated: 16' Refrigerated Cabover; 18'–26' Refrigerated Truck; 53' Refrigerated Trailer.",
          "Flatbed: 24'–26' Flatbed — Non-CDL/CDL.",
          "Semi-Trailers: 48' Dry Van Trailer; 53' Dry Van Trailer.",
          "One-Way: High Roof Van; 12' Box; 16' Box; 22' Box; 26' Box.",
          "Specialized: 26' Refrigerated Truck; Flatbed Truck; Electric High Roof Van."
        ]
      },
      {
        heading: "Memory Tip",
        items: [
          "#11 answers: Do we have this TYPE?"
        ]
      }
    ]
  },

  {
    id: 12,
    title: "Find Specific Unit",
    category: "Vehicles",
    type: "procedure",
    description: "Locate or check a specific unit by actual unit number.",
    sections: [
      {
        heading: "Quick Path",
        items: [
          "Go to Vehicle.",
          "Open Vehicle Reconciliation.",
          "Select View Geo.",
          "Open CORE Connect.",
          "Enter the actual unit number."
        ]
      },
      {
        heading: "Full Path",
        items: [
          "Go to Vehicle.",
          "Open Vehicle Reconciliation.",
          "Scroll down.",
          "Select View all geofenced units.",
          "Open CORE Connect.",
          "Search the actual unit number."
        ]
      },
      {
        heading: "Memory Tip",
        items: [
          "#11 = Do we have this TYPE?",
          "#12 = Where is this SPECIFIC unit?"
        ]
      }
    ]
  },

  {
    id: 13,
    title: "Yard Check Vehicle Reconciliation",
    category: "Yard",
    type: "decision",
    description: "Match the physical yard to the system and research anything that does not line up.",
    sections: [
      {
        heading: "When to Use",
        items: [
          "Use during the morning physical yard and vehicle reconciliation process."
        ]
      },
      {
        heading: "Physical Yard Check",
        items: [
          "Write down where each unit is physically located: A, B, C, RL, etc.",
          "The letters are the actual physical rows or locations where you found the unit.",
          "Compare what you physically see with what the system shows.",
          "If something does not match, underline or mark the unit and research it before doing anything."
        ]
      },
      {
        heading: "Important",
        items: [
          "NOT EVERY underlined unit = CI. Research first.",
          "A unit can show OUT-LOCAL in the system and still physically be at the location.",
          "Do not assume C row means leased.",
          "Physical reality and system status can disagree. Research the reason."
        ]
      },
      {
        heading: "Ready Line / A Row",
        items: [
          "RL + Available = good.",
          "RL + a status you do not understand = investigate and use the Task List if needed.",
          "Use the same mindset for A row: inspect the status instead of assuming.",
          "A row + PM can be okay because A row rentals can be doing preventive maintenance.",
          "A row + Deadline with an issue: put the unit number, A row, and the question or comment on the Task List so the reason can be researched.",
          "If a unit is physically in A row but is not on the Yard Check, it can be added after looking up the actual unit number.",
          "If that unit is not PM and nothing is wrong, your local process may allow it to be checked in."
        ]
      },
      {
        heading: "Research a Mismatch",
        items: [
          "Look up the unit number.",
          "Find out why the unit is physically there.",
          "Check whether it could be due for PM.",
          "If research shows it was returned and needs CI, continue with the correct status process.",
          "Go to Vehicle.",
          "Open Vehicle Info.",
          "Enter the unit number.",
          "Select Update Status.",
          "Change to Available when that is the correct action.",
          "Put the unit on the Task List with the actual physical location and CI note when appropriate."
        ]
      },
      {
        heading: "ServiceNet Research",
        items: [
          "Search the unit number.",
          "Click the RO number.",
          "Open Correspondence.",
          "Read the status.",
          "Check whether the unit is due for PM."
        ]
      },
      {
        heading: "Before Reconcile",
        items: [
          "For units in WASH that need to be included, write down the unit numbers.",
          "Go to Vehicle.",
          "Open Vehicle Info.",
          "Enter the unit number.",
          "Select Update Status.",
          "Change WASH to AVAILABLE.",
          "Use the same process for units at the fuel island when required by your local workflow."
        ]
      },
      {
        heading: "Reconcile",
        items: [
          "Go to Vehicle.",
          "Open Vehicle Reconciliation.",
          "Select Reconcile."
        ]
      },
      {
        heading: "After Reconcile",
        items: [
          "Go back to the units you wrote down.",
          "Return temporary status changes to the correct status.",
          "For the local WASH workflow: WASH → AVAILABLE → Reconcile → back to WASH.",
          "Research all mismatches.",
          "Use the Task List for units that still need action or follow-up."
        ]
      },
      {
        heading: "Memory Tip",
        items: [
          "See it physically → compare system → research mismatch → reconcile → restore temporary statuses."
        ]
      }
    ]
  },

  {
    id: 14,
    title: "Change Vehicle Status",
    category: "Vehicles",
    type: "procedure",
    description: "Update a vehicle to the correct status.",
    sections: [
      {
        heading: "Click Path",
        items: [
          "Go to Vehicle.",
          "Open Vehicle Info.",
          "Enter the unit number.",
          "Select Update Status.",
          "Choose the appropriate status."
        ]
      },
      {
        heading: "Important",
        items: [
          "Use the correct status for the actual situation. Do not change a status just to make the screen look right."
        ]
      }
    ]
  },

  {
    id: 15,
    title: "Non-Rev Unit to Others",
    category: "Fleet",
    type: "procedure",
    description: "Handle a unit that needs to be moved in the system from one location to another.",
    sections: [
      {
        heading: "When to Use",
        items: [
          "Use when a unit is physically at one location but RentalNet shows it under another location and the unit needs to be properly moved/check-in processed."
        ]
      },
      {
        heading: "Process",
        items: [
          "Change RentalNet from your current location to the location that currently holds the unit in the system.",
          "Enter the unit number and check it in.",
          "During check-in, verify damage.",
          "Verify mileage.",
          "Verify fuel.",
          "Go to the Quote tab.",
          "Open the Non-Rev Contract tab.",
          "Select the driver.",
          "Choose the drop-off and first driver using your normal workflow.",
          "Enter the unit number again when prompted.",
          "Verify damage, mileage, and fuel again.",
          "Verify the pickup and drop-off locations are correct.",
          "Submit the request.",
          "Enter your initials in Requested By.",
          "Use customer reason: customer drop off.",
          "Open the Non-Rev reservation.",
          "Change RentalNet to the destination location.",
          "Enter the unit number.",
          "Check the unit in at the destination location."
        ]
      },
      {
        heading: "Important",
        items: [
          "Verify the pickup and drop-off locations BEFORE creating the Non-Rev reservation.",
          "Verify the unit number carefully before continuing."
        ]
      },
      {
        heading: "Memory Tip",
        items: [
          "Check in at current system location → create Non-Rev → switch to destination → check in there."
        ]
      }
    ]
  },

  {
    id: 16,
    title: "Find Nearest Location",
    category: "Tools",
    type: "procedure",
    description: "Find the Penske location nearest to an address.",
    sections: [
      {
        heading: "Click Path",
        items: [
          "Go to Tools.",
          "Open Nearest Location.",
          "Enter the address.",
          "Enter the ZIP code.",
          "Find the nearest location."
        ]
      },
      {
        heading: "Memory Tip",
        items: [
          "Tools → Nearest Location → Address + ZIP."
        ]
      }
    ]
  },

  {
    id: 17,
    title: "Notes for Reservation",
    category: "Reservations",
    type: "reference",
    description: "Reservation notes workflow.",
    sections: [
      {
        heading: "Known Note",
        items: [
          "Click Add Customer."
        ]
      },
      {
        heading: "Important",
        items: [
          "The full procedure has not been documented yet. Add more only after you capture the exact workflow from training."
        ]
      }
    ]
  },

  {
    id: 18,
    title: "District Branches",
    category: "Reference",
    type: "districtBranches",
    description: "Search district branches by city or branch code.",
    sections: [
      {
        heading: "District Branches",
        items: [
          "0386-10 — KC, MO",
          "0387-40 — Lenexa, KS",
          "0417-10 — Salina, KS",
          "0386-20 — Gladstone, MO",
          "0386-21 — Leavenworth, KS",
          "0386-23 — Grandview, MO",
          "0386-24 — Blue Springs, MO",
          "0386-25 — Manhattan, KS",
          "0386-30 — Platte City, MO",
          "0386-32 — Belton, MO",
          "0386-35 — HD, KC, MO",
          "0386-40 — Junction City",
          "0386-45 — Harrisonville, MO",
          "0386-46 — Colby, KS",
          "0386-64 — Joseph, MO",
          "0386-90 — Topeka, KS",
          "0387-24 — Shawnee, KS"
        ]
            }
    ]
  },

  {
    id: 19,
    title: "Look Up / Pay Invoices",
    category: "Invoices",
    type: "decision",
    description: "Look up an invoice, answer invoice questions, or pay an invoice balance.",
    sections: [
      {
        heading: "If You HAVE the Invoice Number",
        items: [
          "Go to Tools.",
          "Open Misc Item.",
          "Type the invoice number.",
          "Search.",
          "From there, the balance can be paid."
        ]
      },
      {
        heading: "Invoice Number Note",
        items: [
          "If needed, use the invoice number with leading 00 based on the format shown in your notes."
        ]
      },
      {
        heading: "If the Customer Has a Question About the Invoice",
        items: [
          "Open CMS PLUS.",
          "Enter the invoice number.",
          "Find the invoice."
        ]
      },
      {
        heading: "If the Customer DOES NOT Have the Invoice Number",
        items: [
          "Look up the customer name.",
          "From there, your notes say you may need to ask for help with the next step."
        ]
      },
      {
        heading: "Important",
        items: [
          "Do not guess the missing workflow after customer-name lookup. Ask for help until you document the exact next step."
        ]
      }
    ]
  }
];
