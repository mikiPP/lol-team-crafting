import { Archetype } from './archetype';
import { Line } from './line';
import { Counter, Synergy } from './relationship';

export class Champion {
  name: String;
  counters: Counter[];
  synergies: Synergy[];
  archetype: Archetype[];
  lines: Line[];

  constructor({
    name,
    counters,
    synergies,
    archetype,
    lines,
  }: {
    name: String;
    archetype: Archetype[];
    counters?: Counter[];
    synergies?: Synergy[];
    lines?: Line[];
  }) {
    this.name = name;
    this.archetype = archetype;
    this.counters = counters || [];
    this.synergies = synergies || [];
    this.lines = lines || [];
  }

  toString() {
    return JSON.stringify({
      name: this.name,
      counters: this.counters,
      synergies: this.synergies,
      archetype: this.archetype,
      lines: this.lines,
    });
  }
}
