export enum Category {
  LEGS = 0,
  CHEST = 1,
  BACK = 2,
  SHOULDERS = 3,
  ARMS = 4,
  CORE = 5,
  CARDIO = 6,
  FULLBODY = 7,
  FREEWEIGHT = 8,
  STRETCHING = 9,
  STRENGTH = 10,
  UNRECOGNIZED = -1
}

export const categoryToString = (category: Category): string => {
  const translation = {
    [Category.LEGS]:         'Piernas',
    [Category.CHEST]:        'Pecho',
    [Category.BACK]:         'Espalda',
    [Category.SHOULDERS]:    'Hombros',
    [Category.ARMS]:         'Brazos',
    [Category.CORE]:         'Nucleo',
    [Category.CARDIO]:       'Cardio',
    [Category.FULLBODY]:     'Cuerpo completo',
    [Category.FREEWEIGHT]:   'Peso libre',
    [Category.STRETCHING]:   'Estiramiento',
    [Category.STRENGTH]:     'Fuerza',
    [Category.UNRECOGNIZED]: 'Desconocido'
  };

  return translation[category];
};
