import Profile from "../models/profileModel.js";
import Project from "../models/projectModel.js";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// ─── Rate Limiter ─────────────────────────────────────────────────────────────
const rateLimitMap = new Map();
const RATE_LIMIT_MS = 5000;

const isRateLimited = (socketId) => {
  const last = rateLimitMap.get(socketId);
  const now = Date.now();
  if (last && now - last < RATE_LIMIT_MS) return true;
  rateLimitMap.set(socketId, now);
  return false;
};

// ─── Levenshtein Distance ─────────────────────────────────────────────────────
const levenshtein = (a, b) => {
  const matrix = Array.from({ length: b.length + 1 }, (_, i) => [i]);
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      matrix[i][j] =
        b[i - 1] === a[j - 1]
          ? matrix[i - 1][j - 1]
          : Math.min(matrix[i - 1][j - 1], matrix[i - 1][j], matrix[i][j - 1]) +
            1;
    }
  }
  return matrix[b.length][a.length];
};

// ─── Project Name Matcher (exact + typo tolerant) ─────────────────────────────
const findProjectByName = (projects, msg) => {
  const lower = msg.toLowerCase();
  const words = lower.split(/\s+/);

  const sorted = [...projects].sort((a, b) => b.title.length - a.title.length);

  for (const project of sorted) {
    const projectName = project.title.toLowerCase();

    // 1. Exact substring match
    if (lower.includes(projectName)) return project;

    // 2. Typo-tolerant — 1 typo for short names (≤6 chars), 2 for longer
    const maxDistance = projectName.length <= 6 ? 1 : 2;
    const hasTypoMatch = words.some(
      (word) =>
        word.length >= 3 && levenshtein(word, projectName) <= maxDistance,
    );

    if (hasTypoMatch) return project;
  }

  return null;
};

// ─── Off-Topic Detection ──────────────────────────────────────────────────────
const isOffTopic = (msg) => {
  const offTopicPatterns = [
    /^\d+\s*[\+\-\*\/\^%]\s*\d+/, // math: 5+5, 10*2
    /^what\s+is\s+\d/i, // "what is 5..."
    /\bsolve\b|\bcalculate\b|\bcompute\b|\bequation\b/i, // math intent
    /\bweather\b|\bnews\b|\bsports\b|\bstock\b|\bcrypto\b|\bbitcoin\b/i,
    /\bjoke\b|\bfunny\b|\blaugh\b/i, // jokes
    /\brecipe\b|\bcook\b|\bfood\b/i, // food/recipes
    /\bmovie\b|\bsong\b|\bmusic\b|\bgame\b|\bbook\b/i, // entertainment
    /\btranslate\b|\blanguage\b(?!.*skill)/i, // translate (not "language skill")
    /write (a |me )?(poem|story|essay|code(?! for tejas))/i,
    /who (is|was) (?!(tejas|he|him))/i, // "who is X" about others
  ];
  return offTopicPatterns.some((p) => p.test(msg));
};

// ─── Intent Patterns ──────────────────────────────────────────────────────────

const INTENTS = {
  greeting: /^(hi|hello|hey|howdy|sup|what'?s up|greetings)[!?.,\s]*$/i,
  internship: /intern(ship)?/i,
  contact:
    /contact|email|linkedin|github|twitter|reach out|get in touch|portfolio/i,
  skills: /skill|tech(nolog)?|stack|tools?|expertise|know|language/i,
  education: /educat|degree|college|university|stud(y|ied|ying)|school|qualif/i,
  availability:
    /freelanc|open to work|open for work|hire(d)?|available|opportunit/i,
  experience: /experience|worked|working|background|career|professional/i,
  hobbies: /hobb(y|ies)|interest|passion|free time|like to do|fun/i,
  projects: /^(what|show|list)\s+(are\s+)?(his\s+)?projects?/i,
  summary:
    /who (is|are)|introduce|about (him|you|yourself)|tell me about (tejas|him)/i,
};

const detectIntent = (msg) => {
  for (const [intent, pattern] of Object.entries(INTENTS)) {
    if (pattern.test(msg)) return intent;
  }
  return null;
};

// ─── Data Builders ────────────────────────────────────────────────────────────

const buildContactBlock = (profile) => {
  const { email, linkedIn, github, twitter } = profile.contact || {};
  return `## Contact Information
- **Email:** ${email ? `[${email}](mailto:${email})` : "Not available"}
- **LinkedIn:** ${linkedIn ? `[View LinkedIn Profile](${linkedIn})` : "Not available"}
- **GitHub:** ${github ? `[View GitHub Profile](${github})` : "Not available"}
- **Portfolio:** ${profile.portfolio ? `[Visit Portfolio](${profile.portfolio})` : "Not available"}
${twitter ? `- **X (Twitter):** [View on X](${twitter})` : ""}`.trim();
};

const buildSkillsBlock = (profile) =>
  `## Skills & Technologies
${profile.skills?.join(", ") || "Not specified"}`;

const buildEducationBlock = (profile) =>
  `## Education
${
  profile.education?.length
    ? profile.education
        .map(
          (edu) =>
            `**${edu.degree}** — ${edu.institute}
${edu.startYear} – ${edu.yearOfPassing || "Present"}${edu.grade ? ` | Grade: ${edu.grade}` : ""}${edu.description ? `\n${edu.description}` : ""}`,
        )
        .join("\n\n")
    : "No education details available."
}`;

const buildExperienceBlock = (profile) =>
  `## Experience
${profile.experienceSummary || "No experience summary available."}`;

const buildInternshipBlock = (profile) => {
  const summary = profile.experienceSummary?.toLowerCase() || "";

  const hasNoInternship =
    summary.includes("not held formal") ||
    summary.includes("no formal") ||
    summary.includes("have not") ||
    summary.includes("hasn't") ||
    summary.includes("no internship") ||
    !summary.includes("intern");

  if (hasNoInternship) {
    return `**No**, Tejas has not done any internship yet.

He has been focused on independently building real-world projects that demonstrate his ability to design, develop, and deploy full-stack applications using the MERN stack. While he hasn't held a formal role, his hands-on project experience reflects strong practical skills.
${
  profile.openToWork
    ? `\nHe is currently **open to opportunities** — feel free to [reach out](mailto:${profile.contact?.email || ""})!`
    : ""
}`.trim();
  }

  return `**Yes**, Tejas has internship experience.\n\n${profile.experienceSummary}`;
};

const buildHobbiesBlock = (profile) =>
  `## Hobbies & Interests
${profile.hobbies?.length ? profile.hobbies.join(", ") : "Not specified"}`;

const buildAvailabilityBlock = (profile) => {
  if (profile.openToWork && profile.freelanceAvailable)
    return "He is currently **open to full-time job opportunities** as well as **freelance work**.";
  if (profile.openToWork)
    return "He is currently **open to full-time job opportunities** but not available for freelance at the moment.";
  if (profile.freelanceAvailable)
    return "He is available for **freelance work** but not actively seeking full-time roles.";
  return "He is **not currently seeking** job or freelance opportunities.";
};

const buildSingleProjectBlock = (project) =>
  `## ${project.title}

${project.description}

**Tech Stack:** ${project.techStack?.join(", ") || "Not specified"}
**Key Features:** ${project.features?.length ? project.features.join(", ") : "Not specified"}
**Repository:** ${project.repoLink ? `[View on GitHub](${project.repoLink})` : "Not available"}
**Live Demo:** ${project.liveDemo ? `[Visit Live Site](${project.liveDemo})` : "Not available"}`;

const buildAllProjectsBlock = (projects) =>
  `## Projects (${projects.length} total)

${projects
  .map(
    (p) =>
      `### ${p.title}
${p.description}
- **Tech Stack:** ${p.techStack?.join(", ") || "Not specified"}
- **Repository:** ${p.repoLink ? `[View on GitHub](${p.repoLink})` : "Not available"}
- **Live Demo:** ${p.liveDemo ? `[Visit Live Site](${p.liveDemo})` : "Not available"}`,
  )
  .join("\n\n")}`;

const buildSummaryBlock = (profile) =>
  `## ${profile.fullName}
**${profile.title}**

${profile.bio}

**Skills:** ${profile.skills?.join(", ") || "Not specified"}
**Experience:** ${profile.experienceSummary || "Not specified"}`;

const buildFullContext = (profile, projects) =>
  `${buildSummaryBlock(profile)}

${buildSkillsBlock(profile)}

${buildEducationBlock(profile)}

${buildExperienceBlock(profile)}

${buildHobbiesBlock(profile)}

${buildContactBlock(profile)}

${buildAllProjectsBlock(projects)}`;

// ─── AI Call ──────────────────────────────────────────────────────────────────
const callGemini = async (profile, context, userMessage) => {
  const prompt = `You are the personal AI assistant and advocate of ${profile.fullName}, a ${profile.title}.

YOUR ROLE:
- You represent ${profile.fullName} professionally and speak on his behalf.
- When asked about his capabilities, suitability, or potential — be confident and positive while staying honest.
- Use the provided data to build a compelling, human case for him.
- Never invent facts, but DO connect the dots between his skills, projects, and what is being asked.
- Be warm, professional, and concise. Avoid robotic or overly formal language.
- Always refer to ${profile.fullName} in third person (he/him/his).
- Format all URLs as proper Markdown links: [label](url)
- Keep responses under 150 words unless the question genuinely needs more detail.
- End with a call to action if the question is from a potential employer or client (e.g. suggest reaching out).

--- PROFILE DATA ---
${context}

--- QUESTION ---
${userMessage}`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.4, maxOutputTokens: 1024 },
  });

  return response.text?.trim() || null;
};

// ─── Main Handler ─────────────────────────────────────────────────────────────
export const chatWithAI = async (socket, userMessage) => {
  try {
    // ── Validate
    if (
      !userMessage ||
      typeof userMessage !== "string" ||
      !userMessage.trim()
    ) {
      socket.emit("receiveMessage", "Please send a valid message.");
      return;
    }

    const msg = userMessage.trim();
    const lowerMsg = msg.toLowerCase();

    // ── Load DB in parallel
    const [profile, projects] = await Promise.all([
      Profile.findOne().lean(),
      Project.find().lean(),
    ]);

    if (!profile) {
      socket.emit("receiveMessage", "Profile not found.");
      return;
    }

    // ──────────────────────────────────────────────────────
    // TIER 1 — Greeting → instant reply
    // ──────────────────────────────────────────────────────
    if (INTENTS.greeting.test(lowerMsg)) {
      socket.emit(
        "receiveMessage",
        `Hi there! 👋 I'm the personal AI assistant of **${profile.fullName}**. Feel free to ask me anything about his skills, projects, education, or how to reach him!`,
      );
      return;
    }

    // ──────────────────────────────────────────────────────
    // TIER 2 — Known intent → local reply, zero API call
    // ──────────────────────────────────────────────────────
    const intent = detectIntent(lowerMsg);

    switch (intent) {
      case "internship":
        socket.emit("receiveMessage", buildInternshipBlock(profile));
        return;
      case "contact":
        socket.emit("receiveMessage", buildContactBlock(profile));
        return;
      case "skills":
        socket.emit("receiveMessage", buildSkillsBlock(profile));
        return;
      case "education":
        socket.emit("receiveMessage", buildEducationBlock(profile));
        return;
      case "experience":
        socket.emit("receiveMessage", buildExperienceBlock(profile));
        return;
      case "hobbies":
        socket.emit("receiveMessage", buildHobbiesBlock(profile));
        return;
      case "availability":
        socket.emit("receiveMessage", buildAvailabilityBlock(profile));
        return;
      case "projects":
        socket.emit("receiveMessage", buildAllProjectsBlock(projects));
        return;
      case "summary":
        socket.emit("receiveMessage", buildSummaryBlock(profile));
        return;
    }

    // ──────────────────────────────────────────────────────
    // TIER 3 — Specific project name (exact + typo) → local reply, zero API call
    // e.g. "tell me about QuickLink", "shoper project", "snipvualt"
    // ──────────────────────────────────────────────────────
    const matchedProject = findProjectByName(projects, lowerMsg);
    if (matchedProject) {
      socket.emit("receiveMessage", buildSingleProjectBlock(matchedProject));
      return;
    }

    // ──────────────────────────────────────────────────────
    // TIER 4 — Off-topic → polite rejection, zero API call
    // e.g. "what is 5+5", "tell me a joke", "what's the weather"
    // ──────────────────────────────────────────────────────
    if (isOffTopic(lowerMsg)) {
      socket.emit(
        "receiveMessage",
        `That's outside my scope! 🙂 I'm exclusively designed to answer questions about **${profile.fullName}** — his skills, projects, experience, education, and professional background.\n\nFeel free to ask me anything about him!`,
      );
      return;
    }

    // ──────────────────────────────────────────────────────
    // TIER 5 — Open/ambiguous question → Gemini (true last resort)
    // e.g. "can he meet our expectations?", "is he a good hire?"
    // ──────────────────────────────────────────────────────
    if (isRateLimited(socket.id)) {
      socket.emit(
        "receiveMessage",
        "Please wait a moment before sending another message. ⏳",
      );
      return;
    }

    try {
      const fullContext = buildFullContext(profile, projects);
      const aiReply = await callGemini(profile, fullContext, msg);
      socket.emit("receiveMessage", aiReply || buildSummaryBlock(profile));
    } catch (aiError) {
      if (aiError?.status === 429) {
        console.warn("Gemini quota exceeded.");
        socket.emit(
          "receiveMessage",
          `I'm unable to process that right now (API quota reached). Here's a quick summary:\n\n${buildSummaryBlock(profile)}`,
        );
      } else {
        console.error("Gemini error:", aiError);
        socket.emit(
          "receiveMessage",
          "I couldn't process that right now. Please try again shortly.",
        );
      }
    }
  } catch (error) {
    console.error("chatWithAI error:", error);
    socket.emit("receiveMessage", "Something went wrong. Please try again.");
  }
};
