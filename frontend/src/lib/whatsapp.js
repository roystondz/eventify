// Builds a wa.me link. wa.me needs the number as digits only, including the
// country code, and the message must be URL-encoded: unencoded characters
// like "&" or "#" would otherwise cut the message short.
export function whatsappLink(number, lines) {
  const digits = String(number ?? '').replace(/\D/g, '');
  const text = lines.filter((line) => line !== null && line !== undefined).join('\n');
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

export function openWhatsApp(number, lines) {
  window.open(whatsappLink(number, lines), '_blank', 'noopener,noreferrer');
}
