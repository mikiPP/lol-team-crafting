import players from './players';

// ej {top: "tercero",jungle:"eze",mid:"marco",adc:"miki",support:"sagi"}
const getAvailableChamps = (composition) => {
  const desiredChampsToPlay = {};
  const undesiredChampsToPlay = {};

  Object.entries(composition).forEach(([line, player]) => {
    desiredChampsToPlay[line] = [
      ...players[player][line].likely,
      ...players[player][line].possible,
    ];
    undesiredChampsToPlay[line] = [
      ...players[player][line].unlikely,
      ...players[player][line].impossible,
    ];
  });

  return {
    desiredChampsToPlay,
    undesiredChampsToPlay,
  };
};

console.log(
  getAvailableChamps({ top: 'tercero', jungle: 'eze', mid: 'marco', adc: 'miki', support: 'sagi' }),
);

/**
 *  170 champs -> counters, arquetipo,
 *  compsition -> 1 diengage, 2 poke, 1 hardengage o poke o disengage
 */
