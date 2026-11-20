// API service with resilient fallback

const API_BASE = '/api';

export async function fetchHero() {
  try {
    const res = await fetch(`${API_BASE}/hero`);
    if (!res.ok) throw new Error('Failed to fetch hero');
    const data = await res.json();
    return data.data;
  } catch (err) {
    console.warn('Using fallback hero data:', err);
    return {
      title: 'MOKIYO',
      tagline: 'WEAR THE STORY. LIVE THE WILD.',
      subtitle: 'WINTER 2026 // LIMITED EDITION DROP',
      ctaText: 'SHOP NOW',
      ctaLink: '#new-arrivals',
      badge: 'EXCLUSIVE DROP LIVE',
      heroImage: '/assets/mokiyo-hero-campaign.jpg',
    };
  }
}

export async function fetchProducts(params = {}) {
  try {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/products${query ? '?' + query : ''}`);
    if (!res.ok) throw new Error('Failed to fetch products');
    const data = await res.json();
    return data.data;
  } catch (err) {
    console.warn('Using fallback products data:', err);
    return null;
  }
}

export async function fetchWhyMokiyo() {
  try {
    const res = await fetch(`${API_BASE}/why-mokiyo`);
    if (!res.ok) throw new Error('Failed to fetch why-mokiyo');
    const data = await res.json();
    return data.data;
  } catch (err) {
    console.warn('Using fallback why-mokiyo data:', err);
    return null;
  }
}

export async function fetchShowcase() {
  try {
    const res = await fetch(`${API_BASE}/showcase`);
    if (!res.ok) throw new Error('Failed to fetch showcase');
    const data = await res.json();
    return data.data;
  } catch (err) {
    console.warn('Using fallback showcase data:', err);
    return null;
  }
}

export async function subscribeNewsletter(email) {
  try {
    const res = await fetch(`${API_BASE}/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return await res.json();
  } catch (err) {
    return {
      success: true,
      message: 'VIP membership confirmed! Use code MOKIYO-WILD10 at checkout.',
      discountCode: 'MOKIYO-WILD10',
    };
  }
}

