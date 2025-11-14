import { z } from 'zod';

export const LessonSuggestionSchema = z.object({
  title: z.string(),
  timeBreakdown: z
    .array(
      z.object({
        minutes: z.number().min(1),
        activity: z.string(),
        materials: z.string(),
      }),
    )
    .min(1),
  differentiation: z
    .array(z.object({ group: z.string(), strategy: z.string() }))
    .min(1),
  assessment: z
    .array(z.object({ type: z.string(), when: z.string() }))
    .min(1),
  homeworkSuggestion: z.string(),
  rationale: z.string(),
});

export type LessonSuggestion = z.infer<typeof LessonSuggestionSchema>;

interface SuggestLessonArgs {
  class: {
    name: string;
    level: string;
    subject: string;
  };
  latestProgress: {
    summary: string;
    nextFocus?: string;
  } | null;
  upcomingPlan: {
    title: string;
    objectives: Record<string, unknown>;
    plannedDurationMins: number;
  } | null;
  timeboxMins: number;
}

const fallbackActivities = [
  'Warm-up discussion',
  'Direct instruction',
  'Guided practice',
  'Collaborative task',
  'Exit ticket',
];

function buildFallbackSuggestion(args: SuggestLessonArgs): LessonSuggestion {
  const focus = Array.isArray(args.upcomingPlan?.objectives?.focus)
    ? (args.upcomingPlan?.objectives?.focus as string[])
    : ['Key concept', 'Practice', 'Reflection'];
  const duration = args.timeboxMins;
  const slot = Math.max(10, Math.floor(duration / focus.length));
  return {
    title: args.upcomingPlan?.title ?? `${args.class.subject} focus session`,
    timeBreakdown: focus.map((objective, index) => ({
      minutes: slot,
      activity: `${fallbackActivities[index % fallbackActivities.length]} – ${objective}`,
      materials: 'Whiteboard, student notebooks',
    })),
    differentiation: [
      { group: 'Extension', strategy: 'Provide a challenge prompt related to the concept.' },
      { group: 'Support', strategy: 'Use manipulatives or sentence starters to scaffold.' },
    ],
    assessment: [
      { type: 'Exit ticket', when: 'Last 5 minutes' },
      { type: 'Observation', when: 'During guided practice' },
    ],
    homeworkSuggestion: 'Complete a short reflection and prepare one question for next lesson.',
    rationale:
      args.latestProgress?.nextFocus
        ? `Addresses noted focus: ${args.latestProgress.nextFocus}`
        : 'Balanced mix of input, practice, and reflection tailored to timebox.',
  };
}

type OpenAIConstructor = new (config: { apiKey: string }) => {
  responses: {
    create(args: {
      model: string;
      input: string;
      max_output_tokens?: number;
    }): Promise<{ output_text: string }>;
  };
};

async function callOpenAI(prompt: string) {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }

  const openaiModule = (await import('openai').catch((error) => {
    console.warn('OpenAI client unavailable', error);
    return null;
  })) as { default?: OpenAIConstructor } | null;

  const OpenAIClient = openaiModule?.default ?? null;
  if (!OpenAIClient) {
    return null;
  }

  const client = new OpenAIClient({ apiKey: process.env.OPENAI_API_KEY });
  const response = await client.responses.create({
    model: 'gpt-4o-mini',
    input: prompt.slice(0, 6000),
    max_output_tokens: 800,
  });
  const output = response.output_text;
  return output;
}

function buildPrompt(args: SuggestLessonArgs) {
  const objectives = JSON.stringify(args.upcomingPlan?.objectives ?? {});
  return `You are an expert lesson planner creating a ${args.timeboxMins}-minute lesson for ${args.class.name} (${args.class.level} ${args.class.subject}).
Previous progress summary: ${args.latestProgress?.summary ?? 'None recorded'}.
Next focus: ${args.latestProgress?.nextFocus ?? 'Continue steady progress'}.
Planned objectives: ${objectives}.
Respond with JSON following this schema: ${LessonSuggestionSchema.toString()}`;
}

function safeParseSuggestion(raw: string | null): LessonSuggestion | null {
  if (!raw) return null;
  try {
    const jsonStart = raw.indexOf('{');
    const jsonString = jsonStart >= 0 ? raw.slice(jsonStart) : raw;
    const parsed = JSON.parse(jsonString);
    return LessonSuggestionSchema.parse(parsed);
  } catch (error) {
    console.warn('Failed to parse AI suggestion', error);
    return null;
  }
}

export async function suggestLesson(args: SuggestLessonArgs): Promise<LessonSuggestion> {
  const prompt = buildPrompt(args);
  const first = safeParseSuggestion(await callOpenAI(prompt));
  if (first) {
    return first;
  }
  const second = safeParseSuggestion(await callOpenAI(prompt));
  if (second) {
    return second;
  }
  return buildFallbackSuggestion(args);
}
