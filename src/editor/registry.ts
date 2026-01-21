import type { EditorRegistration } from './types';

export class EditorRegistry {
  private registrations: Record<string, EditorRegistration>;

  constructor(initial?: Record<string, EditorRegistration>) {
    this.registrations = { ...(initial ?? {}) };
  }

  register(key: string, registration: EditorRegistration) {
    this.registrations[key] = registration;
    return this;
  }

  get(key: string) {
    return this.registrations[key];
  }

  keys() {
    return Object.keys(this.registrations).sort();
  }
}
