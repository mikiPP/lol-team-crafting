export type CounterType = 'extreme' | 'major';

export type Counter = {
  champName: string;
  type: CounterType;
  description?: string;
};

export const getCounterType = (type: string) => {
  const types: CounterType[] = ['extreme', 'major'];

  return types.find((innerType) => innerType === type.toLowerCase());
};

export type SynergyType = 'none' | 'low' | 'ok' | 'strong' | 'ideal';

export type Synergy = {
  champName: string;
  type: SynergyType;
  description?: string;
};

export const getSynergyType = (type: string) => {
  const types: SynergyType[] = ['none', 'low', 'ok', 'strong', 'ideal'];

  return types.find((innerType) => innerType === type.toLowerCase());
};
