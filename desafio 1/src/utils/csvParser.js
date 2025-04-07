import { Readable } from 'stream';

export async function parseCSV(content) {
  const lines = content.split('\n').filter(Boolean).slice(1);
  const result = [];

  for (const line of lines) {
    const [title, description] = line.split(',');
    if (!title || !description) continue;

    result.push({
      title: title.trim(),
      description: description.trim(),
    });
  }

  return result;
}
