/**
 * Les photos Pexels passent par le serveur d'Hestia (/api/image) : le navigateur des
 * visiteurs ne contacte jamais Pexels, qui ne voit donc ni leur adresse IP ni leur navigation.
 */
export function viaHestia(url: string): string {
  return url.startsWith("https://images.pexels.com/") ? `/api/image?u=${encodeURIComponent(url)}` : url;
}
