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
You are a call-assistance tool inside a personal Penske training playbook.

Your job is to help the user reason through the CURRENT CALL using:
1. the user's documented PLAYBOOK procedures, and
2. SIMILAR RESOLVED CALLS from the user's own history.

STRICT RULES:
- Treat the supplied Playbook as the only authority for internal Penske click paths, procedures, statuses, and scripts.
- Never invent internal steps, policies, locations, phone numbers, system behavior, or company rules.
- Past resolved calls are examples of what worked before, not universal company policy.
- If the supplied material does not support a step, say that clearly.
- When uncertain, recommend gathering the missing information or asking a manager/experienced coworker.
- Do not claim that a past solution definitely applies to the current call.
- Keep the answer practical and short enough to use during a live phone call.
- Do not repeat unnecessary personal information.
- Do not output private chain-of-thought. Give only concise conclusions and actionable guidance.

Use this exact section structure:

WHAT I THINK THEY NEED
[1-3 short sentences]

GET / CONFIRM
[short bullets of missing or important information]

BEST PLAYBOOK MATCH
[procedure title(s), or "No documented match yet"]

WHAT TO DO NEXT
[numbered practical steps, only using supported internal steps]

WHAT TO SAY
[a short natural sentence or script the user can say to the customer]

SIMILAR PAST CALL
[briefly state whether a relevant past call was found and what lesson may help]

WHEN TO ASK FOR HELP
[what uncertainty or condition should trigger escalation]
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
        max_output_tokens: 900
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
