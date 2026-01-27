import type { EditorRegistration, TypeRuleContext } from './types';

export class EditorRegistry {
  private registrations: Array<{ matcher: (context: TypeRuleContext) => boolean; registration: EditorRegistration }> = [];

  constructor(initial?: Record<string, EditorRegistration>) {
    if (initial) {
      Object.entries(initial).forEach(([key, registration]) => {
        this.register(({ path }) => String(path[path.length - 1]) === key, registration);
      });
    }
  }

  register(matcher: (context: TypeRuleContext) => boolean, registration: EditorRegistration) {
    this.registrations.push({ matcher, registration });
    return this;
  }

  resolveType(context: TypeRuleContext) {
    let resolved: string | undefined;
    for (const entry of this.registrations) {
      if (entry.matcher(context) && entry.registration.type) {
        resolved = entry.registration.type;
      }
    }
    return resolved;
  }

  getTypeSuggestions(type: string) {
    const suggestions: string[] = [];
    this.registrations.forEach((entry) => {
      if (entry.registration.type === type && entry.registration.suggestions) {
        suggestions.push(...entry.registration.suggestions);
      }
    });
    return suggestions;
  }

  resolveRegistration(context: TypeRuleContext) {
    let resolved: EditorRegistration | undefined;
    for (const entry of this.registrations) {
      if (entry.matcher(context)) {
        resolved = {
          ...(resolved ?? {}),
          ...entry.registration,
        };
      }
    }
    return resolved;
  }
}
