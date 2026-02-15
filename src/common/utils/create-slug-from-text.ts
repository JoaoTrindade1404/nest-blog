import { generateRandomSufix } from './generate-random-sufix';
import { slugify } from './slugify';

export function createSlugFromText(text: string) {
  const slug = slugify(text);

  return `${slug}-${generateRandomSufix()}`;
}
