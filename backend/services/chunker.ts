export function chunkText(
  text: string,
  chunkSize: number,
  overlap: number,
): string[] {
  let start = 0;
  let chunks = [];

  while (start < text.length) {
    let chunk = text.slice(start, chunkSize + start);

    chunks.push(chunk);

    if (chunkSize + start >= text.length) break;

    start += chunkSize - overlap;
  }
  return chunks;
}
