import type { EditorRegistration, TypeRuleContext } from './types';

export class EditorRegistry {
  private registrations: Record<string, EditorRegistration>;
  private typeRules: Array<{ name: string; matcher: (context: TypeRuleContext) => boolean }> = [];
  private typeSuggestions: Record<string, string[]> = {};

  constructor(initial?: Record<string, EditorRegistration>) {
    this.registrations = { ...(initial ?? {}) };
  }

  register(key: string, registration: EditorRegistration) {
    this.registrations[key] = registration;
    return this;
  }

  registerSuggestions(key: string, suggestions: string[]) {
    const existing = this.registrations[key] ?? {};
    this.registrations[key] = {
      ...existing,
      suggestions,
    };
    return this;
  }

  registerTypeRule(name: string, matcher: (context: TypeRuleContext) => boolean) {
    this.typeRules.push({ name, matcher });
    return this;
  }

  registerTypeSuggestions(type: string, suggestions: string[]) {
    this.typeSuggestions[type] = suggestions;
    return this;
  }

  resolveType(context: TypeRuleContext) {
    for (const rule of this.typeRules) {
      if (rule.matcher(context)) {
        return rule.name;
      }
    }
    return undefined;
  }

  getTypeSuggestions(type: string) {
    return this.typeSuggestions[type];
  }

  get(key: string) {
    return this.registrations[key];
  }

  keys() {
    return Object.keys(this.registrations).sort();
  }
}
