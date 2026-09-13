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

  if (body.mode === "resolution_review") {
    return handleResolutionReview(body, currentCall, procedures);
  }

  if (body.mode === "live_followup") {
    return handleLiveFollowup(body, currentCall, procedures, similarCalls);
  }

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


async function handleLiveFollowup(body, currentCall, procedures, similarCalls) {
  const liveMessages = Array.isArray(body.liveMessages) ? body.liveMessages : [];
  const initialAdvice = String(body.initialAdvice || "").trim();

  if (!liveMessages.length) {
    return jsonResponse(400, { error: "Add an update from the live call first." });
  }

  const model = process.env.OPENAI_MODEL || "gpt-5.6-luna";

  const instructions = `
You are the user's LIVE CALL COPILOT inside a personal Penske training playbook.

The call is still happening. Your job is to move the user toward the next useful action, one turn at a time.

USE THESE SOURCES IN THIS ORDER:
1. Documented PLAYBOOK procedures.
2. Strongly similar RESOLVED PAST CALLS, clearly labeled as past examples.
3. The facts the user gives during this live conversation.

STRICT ACCURACY:
- Never invent Penske click paths, company policy, phone numbers, approvals, dispatch rules, statuses, or system behavior.
- Treat the Playbook as the only authority for internal Penske procedures.
- A past call is an example, not policy.
- If the Playbook does not document the required internal step, say that plainly and tell the user exactly what part needs a manager or experienced coworker.
- Do not tell the user to perform an undocumented internal action just because it seems generally reasonable.
- For an unsafe vehicle, do not encourage continued driving.
- Do not expose chain-of-thought.

LIVE-CONVERSATION STYLE:
- Do NOT repeat the full dashboard or all prior advice.
- Respond directly to the newest update.
- Keep the answer very short and easy to scan.
- Give the next action first.
- Ask at most ONE question, and only when the answer changes the next action.
- If a short script would help, include it naturally.
- Avoid headings unless they make the answer clearer.
- Usually stay under 90 words.
- Do not ask "what happened next?" when you can already give a useful next step.
- If the user reports the problem is solved, briefly confirm the factual outcome and tell them they can use Resolve Call to save what worked.

Return ONLY valid JSON:
{
  "reply": "short live-call guidance"
}
`.trim();

  const input = `
CURRENT CALL
${JSON.stringify(currentCall, null, 2)}

INITIAL AI GUIDANCE
${initialAdvice || "None saved."}

LIVE CONVERSATION
${JSON.stringify(liveMessages, null, 2)}

DOCUMENTED PLAYBOOK
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
        max_output_tokens: 220
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return jsonResponse(response.status, {
        error: data?.error?.message || `OpenAI request failed with status ${response.status}.`
      });
    }

    const raw = extractOutputText(data);
    if (!raw) return jsonResponse(502, { error: "OpenAI returned no readable live guidance." });

    let parsed;
    try {
      parsed = JSON.parse(raw.replace(/^```json\s*/i, "").replace(/```$/i, "").trim());
    } catch {
      return jsonResponse(502, { error: "The live AI response was unreadable. Try sending the update again." });
    }

    const reply = String(parsed.reply || "").trim();
    if (!reply) return jsonResponse(502, { error: "AI returned no next step." });

    return jsonResponse(200, { reply, model });
  } catch (error) {
    return jsonResponse(500, { error: "Could not reach OpenAI from the Netlify function." });
  }
}

async function handleResolutionReview(body, currentCall, procedures) {
  const proposedResolution = String(body.proposedResolution || "").trim();
  const proposedLesson = String(body.proposedLesson || "").trim();
  const reviewMessages = Array.isArray(body.reviewMessages) ? body.reviewMessages : [];

  if (!proposedResolution) {
    return jsonResponse(400, { error: "Add how the call was resolved before reviewing it." });
  }

  const model = process.env.OPENAI_MODEL || "gpt-5.6-luna";

  const instructions = `
You are reviewing how a real call was resolved for the user's personal training history.

GOAL:
Understand what actually happened before the call is saved as resolved. Ask concise follow-up questions when the user's explanation is incomplete. Once the resolution is clear enough to be useful later, produce a clean final summary.

STRICT RULES:
- Do not invent missing events, Penske policy, internal click paths, approvals, or outcomes.
- The supplied Playbook may help you recognize documented procedures, but do not claim the user's real call followed a step unless the user says it did.
- A one-time resolution is a past example, not company policy.
- Ask only ONE focused follow-up question at a time.
- Keep each response short and conversational.
- Do not ask for information that is unnecessary to understand why/how the call was resolved.
- If the user has clearly explained the problem, the actions taken, and the final outcome, mark the review ready.
- "What happens next" means the actual known next action/outcome from this call. Never predict or invent an internal process.
- Do not expose chain-of-thought.

Return ONLY valid JSON with exactly these keys:
{
  "readyToSave": boolean,
  "review": "short feedback or one focused question",
  "finalResolution": "clean factual resolution summary, or empty string if not ready",
  "lesson": "short useful remember-next-time note, or empty string if not ready"
}
`.trim();

  const input = `
CURRENT CALL
${JSON.stringify(currentCall, null, 2)}

USER'S CURRENT RESOLUTION
${proposedResolution}

USER'S CURRENT LESSON
${proposedLesson}

RESOLUTION REVIEW CONVERSATION
${JSON.stringify(reviewMessages, null, 2)}

DOCUMENTED PLAYBOOK
${JSON.stringify(procedures, null, 2)}
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
        max_output_tokens: 450
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return jsonResponse(response.status, {
        error: data?.error?.message || `OpenAI request failed with status ${response.status}.`
      });
    }

    const raw = extractOutputText(data);
    if (!raw) return jsonResponse(502, { error: "OpenAI returned no readable review." });

    let parsed;
    try {
      parsed = JSON.parse(raw.replace(/^```json\s*/i, "").replace(/```$/i, "").trim());
    } catch {
      return jsonResponse(502, { error: "The AI review returned an unreadable response. Try again." });
    }

    return jsonResponse(200, {
      readyToSave: parsed.readyToSave === true,
      review: String(parsed.review || "").trim(),
      finalResolution: String(parsed.finalResolution || "").trim(),
      lesson: String(parsed.lesson || "").trim()
    });
  } catch (error) {
    return jsonResponse(500, { error: "Could not reach OpenAI from the Netlify function." });
  }
}

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
