export type DeweyCategory = 0 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | null;


export const DEWEY_CATEGORIES = [
  { code: 0, name: 'Generalidades' },
  { code: 100, name: 'Filosofía y psicología' },
  { code: 200, name: 'Religión' },
  { code: 300, name: 'Ciencias sociales' },
  { code: 400, name: 'Lenguas' },
  { code: 500, name: 'Ciencias naturales' },
  { code: 600, name: 'Tecnología' },
  { code: 700, name: 'Artes y recreación' },
  { code: 800, name: 'Literatura' },
  { code: 900, name: 'Historia y geografía' },
] as const;
