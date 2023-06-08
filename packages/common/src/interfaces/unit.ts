export enum Unit {
  KILOGRAMS,
  METERS,
  SECONDS,
  REPETITIONS
}

export const unitToString = (unit: Unit): string => {
  const translation = {
    [Unit.KILOGRAMS]:   'Kilogramos',
    [Unit.METERS]:      'Metros',
    [Unit.SECONDS]:     'Segundos',
    [Unit.REPETITIONS]: 'Repeticiones'
  };

  return translation[unit];
};
