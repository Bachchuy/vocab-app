/** Provider-neutral request for one structured text generation. */
export const AI_PROVIDER = Symbol('AI_PROVIDER');

export type StructuredGenerationRequest = {
  instructions: string;
  input: unknown;
  schemaName: string;
  schema: Record<string, unknown>;
  maxOutputTokens: number;
};

export interface AiProvider {
  generateStructured(request: StructuredGenerationRequest): Promise<unknown>;
}
