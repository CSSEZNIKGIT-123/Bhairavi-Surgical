import { formatCurrency } from './utils.js';

/**
 * Returns the configured WhatsApp business number.
 * Can be overridden via NEXT_PUBLIC_WHATSAPP_NUMBER environment variable.
 */
export function getWhatsAppNumber() {
  const envNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  if (envNumber && envNumber.trim()) {
    // Sanitize to digits only
    return envNumber.replace(/\D/g, '');
  }
  return '919876543210';
}

/**
 * Generates a clean, formatted, dynamic WhatsApp purchase inquiry message for a product.
 *
 * @param {Object} params
 * @param {Object} params.product - The product object
 * @param {Object} [params.selectedVariant] - Currently selected variant (if any)
 * @param {number} [params.quantity=1] - Currently selected quantity
 * @param {string} [params.mode='B2C'] - 'B2C' | 'B2B' | 'SPECIAL'
 * @returns {string} Clean plain text message
 */
export function generateProductWhatsAppMessage({
  product,
  selectedVariant = null,
  quantity = 1,
  mode = 'B2C',
}) {
  if (!product) return '';

  const productName = product.name || product.title || 'Ayurvedic Product';
  const sku = selectedVariant?.sku || product.sku || null;
  const variantName = selectedVariant?.name || null;
  const qty = quantity && !isNaN(quantity) && quantity > 0 ? quantity : 1;

  let headerGreeting = 'Hello Yugan Ayurved,';
  let intentLine = 'I would like to buy the following product:';
  let platformLabel = 'B2C Wellness Store';
  let closingLine = 'Please share the payment and delivery details.\nThank you!';

  if (mode === 'B2B') {
    headerGreeting = 'Hello Yugan Ayurved B2B Procurement Desk,';
    intentLine = 'I would like to place an order / request quotation for:';
    platformLabel = 'B2B Institutional Wholesale';
    closingLine = 'Please share the wholesale quotation, GST invoice, and dispatch schedule.\nThank you!';
  } else if (mode === 'SPECIAL') {
    headerGreeting = 'Hello Yugan Sovereign Atelier,';
    intentLine = 'I would like to commission / order this bespoke masterwork:';
    platformLabel = 'Sovereign Atelier Commission';
    closingLine = 'Please coordinate artisan allocation, custom specifications, and delivery timelines.\nThank you!';
  }

  const lines = [
    headerGreeting,
    '',
    intentLine,
    `• Product: ${productName}`,
  ];

  if (sku) {
    lines.push(`• SKU: ${sku}`);
  }

  if (variantName) {
    lines.push(`• Selected Variant: ${variantName}`);
  }

  lines.push(`• Quantity: ${qty} ${mode === 'B2B' ? 'units' : mode === 'SPECIAL' ? 'suite(s)' : 'unit(s)'}`);

  // Price calculation
  const unitPrice = selectedVariant?.price || (
    mode === 'B2B'
      ? (product.b2bBasePrice || product.retailPrice)
      : mode === 'SPECIAL'
      ? (product.specialBasePrice || product.retailPrice * 1.5)
      : (product.salePrice || product.retailPrice)
  );

  if (unitPrice && !isNaN(unitPrice) && unitPrice > 0) {
    const total = unitPrice * qty;
    if (qty > 1) {
      lines.push(`• Price: ${formatCurrency(unitPrice)} / unit (Estimated Total: ${formatCurrency(total)})`);
    } else {
      lines.push(`• Price: ${formatCurrency(unitPrice)}`);
    }
  }

  lines.push(`• Channel: ${platformLabel}`);
  lines.push('');
  lines.push(closingLine);

  return lines.join('\n');
}

/**
 * Builds the complete click-to-chat WhatsApp URL with dynamic message encoding.
 */
export function generateProductWhatsAppUrl({
  product,
  selectedVariant = null,
  quantity = 1,
  mode = 'B2C',
}) {
  const number = getWhatsAppNumber();
  const rawMessage = generateProductWhatsAppMessage({
    product,
    selectedVariant,
    quantity,
    mode,
  });

  return `https://wa.me/${number}?text=${encodeURIComponent(rawMessage)}`;
}
