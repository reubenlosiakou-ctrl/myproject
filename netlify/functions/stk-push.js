exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  try {
    const { amount, phone, reference } = JSON.parse(event.body);
    const username = process.env.PAYHERO_API_USERNAME;
    const password = process.env.PAYHERO_API_PASSWORD;
    const channelId = process.env.PAYHERO_CHANNEL_ID;
    const auth = Buffer.from(`${username}:${password}`).toString('base64');
    let formattedPhone = phone;
    if (phone.startsWith('0')) formattedPhone = '254' + phone.substring(1);
    if (phone.startsWith('+')) formattedPhone = phone.substring(1);
    const res = await fetch('https://backend.payhero.co.ke/api/v2/payments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Basic ${auth}` },
      body: JSON.stringify({
        amount: Number(amount),
        phone_number: formattedPhone,
        channel_id: Number(channelId),
        provider: 'm-pesa',
        external_reference: reference,
        callback_url: `https://${process.env.URL}/.netlify/functions/callback`
      })
    });
    const data = await res.json();
    return { statusCode: 200, body: JSON.stringify(data) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
