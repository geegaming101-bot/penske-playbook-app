const OPENAI_URL = "https://api.openai.com/v1/responses";

exports.handler = async function handler(event) {
  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { error: "Method not allowed." });
  }

  if (!process.env.OPENAI_API_KEY) {
    return jsonResponse(500, {
      error: "OPENAI_API_KEY is not configured on the server."
    });
  }

  let body;

  try {
    body = JSON.parse(event.body || "{}");
  } catch (error) {
    return jsonResponse(400, { error: "Invalid JSON request." });
  }

  const currentCall = body.currentCall || {};
  const procedures = Array.isArray(body.procedures) ? body.procedures : [];
  const similarCalls = Array.isArray(body.similarCalls) ? body.similarCalls : [];

  const callText = [
    currentCall.customer,
    currentCall.company,
    currentCall.reference,
    currentCall.scratch,
    ...(Array.isArray(currentCall.notes) ? currentCall.notes : [])
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  if (!callText) {
    return jsonResponse(400, {
      error: "Add some call notes before asking for AI help."
    });
  }

  const model = process.env.OPENAI_MODEL || "gpt-5.6-luna";

  const instructions = `
You are a fast live-call assistance tool inside a personal Penske training playbook.

Your job is to help the user solve the CURRENT CALL using:
1. the user's documented PLAYBOOK procedures, and
2. SIMILAR RESOLVED CALLS from the user's own history.

The user may be reading your answer while a customer is waiting. Be useful at a glance.

STRICT ACCURACY RULES:
- Treat the supplied Playbook as the only authority for internal Penske click paths, procedures, statuses, and scripts.
- Never invent internal steps, policies, locations, phone numbers, system behavior, or company rules.
- Past resolved calls are examples of what worked before, not universal company policy.
- Never turn a past-call solution into official policy.
- If the supplied material does not support a step, say so briefly.
- When uncertain, recommend the smallest necessary escalation to a manager or experienced coworker.
- Do not output private chain-of-thought. Give only conclusions and actionable guidance.

RELEVANCE RULES:
- Do not match a Playbook procedure just because it shares a word with the call.
- Only list a procedure when it directly helps solve part of the current problem.
- Example: an exterior license-plate problem is NOT automatically a "Get Updated Registration / Cab Card" match.
- If a resolved past call is a strong match, prioritize it over weak Playbook matches.
- If a similar resolved call appears to describe the same problem, clearly surface what worked last time, while labeling it as a past example.
- Do not request information that is not needed to decide the next action.

ANTI-RAMBLING RULES:
- Do not repeat the same fact in multiple sections.
- Prefer one precise sentence over several explanatory sentences.
- Keep the entire response compact enough to scan during a live call.
- GET / CONFIRM: maximum 4 bullets.
- BEST PLAYBOOK MATCH: maximum 3 items.
- WHAT TO DO NEXT: maximum 4 numbered steps.
- WHAT TO SAY: maximum 2 short sentences.
- SIMILAR PAST CALL: maximum 2 sentences.
- WHEN TO ASK FOR HELP: maximum 1 sentence.
- If a section has nothing useful to add, write "None needed."

Use this exact section structure:

QUICK READ
[1-2 sentences: what the issue is and the immediate direction]

SIMILAR PAST CALL
[If a strong match exists, say what happened and what worked. End with "Past example, not policy." If none, say "No strong match found."]

GET / CONFIRM
[Only the few facts still needed before acting; max 4 bullets]

BEST PLAYBOOK MATCH
[Only directly relevant procedure title(s), max 3, or "No direct documented match"]

WHAT TO DO NEXT
[Up to 4 numbered practical steps. Put the most useful next action first.]

WHAT TO SAY
[One short natural script the user can say]

WHEN TO ASK FOR HELP
[One sentence describing the exact unresolved point that requires escalation]
`.trim();

  const input = `
CURRENT CALL
${JSON.stringify(currentCall, null, 2)}

PLAYBOOK PROCEDURES
${JSON.stringify(procedures, null, 2)}

SIMILAR RESOLVED CALLS
${JSON.stringify(similarCalls, null, 2)}
`.trim();

  try {
    const response = await fetch(OPENAI_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        instructions,
        input,
        store: false,
        max_output_tokens: 600
      })
    });

    const data = await response.json();

    if (!response.ok) {
      const message =
        data?.error?.message ||
        `OpenAI request failed with status ${response.status}.`;

      return jsonResponse(response.status, { error: message });
    }

    const advice = extractOutputText(data);

    if (!advice) {
      return jsonResponse(502, {
        error: "OpenAI returned no readable text."
      });
    }

    return jsonResponse(200, {
      advice,
      model
    });
  } catch (error) {
    return jsonResponse(500, {
      error: "Could not reach OpenAI from the Netlify function."
    });
  }
};

function extractOutputText(data) {
  if (typeof data.output_text === "string" && data.output_text.trim()) {
    return data.output_text.trim();
  }

  const pieces = [];

  for (const item of data.output || []) {
    for (const content of item.content || []) {
      if (content.type === "output_text" && typeof content.text === "string") {
        pieces.push(content.text);
      }
    }
  }

  return pieces.join("\n").trim();
}

function jsonResponse(statusCode, payload) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store"
    },
    body: JSON.stringify(payload)
  };
}
