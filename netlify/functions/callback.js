const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
exports.handler = async (event) => {
  try {
    const payload = JSON.parse(event.body);
    const ref = payload.ExternalReference || payload.external_reference;
    const success = payload.response_code === '0' || payload.Success === true || payload.status === 'SUCCESS';
    if (success && ref) {
      await fetch(`${SUPABASE_URL}/rest/v1/payments?reference=eq.${ref}`, {
        method: 'PATCH',
        headers: {
          'apikey': SERVICE_KEY,
          'Authorization': `Bearer ${SERVICE_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: 'paid', paid_at: new Date().toISOString() })
      });
    }
    return { statusCode: 200, body: 'OK' };
  } catch (e) {
    return { statusCode: 200, body: 'OK' };
  }
};
