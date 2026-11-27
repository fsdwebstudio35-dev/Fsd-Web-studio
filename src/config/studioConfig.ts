/**
 * Central Studio Configuration
 * Update the WhatsApp number, email, and social links in this single file
 * to automatically update Contact forms, Floating WhatsApp button, and Footer.
 */
export const STUDIO_CONFIG = {
  brandName: 'FSD Web Studio',
  tagline: 'Building Digital Futures.',
  whatsappNumber: '923290725117', // Digits only with country code (03290725117 -> 923290725117)
  whatsappDisplay: '+92 329 0725117',
  email: 'fsdwebstudio35@gmail.com',
  hours: 'Mon – Fri · 9:00 AM – 6:30 PM',
  socialLinks: [
    { label: 'LinkedIn', href: 'https://linkedin.com' },
    { label: 'GitHub', href: 'https://github.com' },
    { label: 'Instagram', href: 'https://instagram.com' },
    { label: 'X', href: 'https://x.com' },
  ],
};

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${STUDIO_CONFIG.whatsappNumber}?text=${encodeURIComponent(
    message
  )}`;
}

export function buildMailtoUrl(subject: string, body: string): string {
  return `mailto:${STUDIO_CONFIG.email}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;
}
