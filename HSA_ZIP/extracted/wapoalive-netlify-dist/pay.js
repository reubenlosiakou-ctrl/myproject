
export async function handler(event){
  try{
    const USER = process.env.PAYHERO_USERNAME;
    const PASS = process.env.PAYHERO_PASSWORD;
    const CHANNEL = process.env.PAYHERO_CHANNEL_ID ?? process.env.PAYHERO_ACCOUNT_ID;
    if(!USER || !PASS || CHANNEL === undefined || CHANNEL === null || CHANNEL === '') return {statusCode:500, body: JSON.stringify({error:"Missing env"})};
    const auth = Buffer.from(`${USER}:${PASS}`).toString('base64');
    const data = JSON.parse(event.body || '{}');
    // Bug fix: the old fixed whitelist ([20,25,30,...]) didn't include 5 or 10
    // KES, so the two cheapest flower gifts (Maua 1 = 5 KES, Maua 2 = 10 KES)
    // always failed with "Amount not allowed" - and any multi-flower combo
    // whose sum landed outside that whitelist failed too. M-Pesa STK push
    // itself accepts 1 to 150,000 KES, so validate against that real range
    // instead of a hardcoded list.
    const amount = Number(data.amount);
    if(!Number.isInteger(amount) || amount < 1 || amount > 150000) return {statusCode:400, body: JSON.stringify({error:"Invalid amount"})};
    // clean phone 07 -> 2547
    let phone = (data.phone_number||'').replace(/\s+/g,'');
    if(phone.startsWith('+')) phone = phone.slice(1);
    if(phone.startsWith('0')) phone = '254'+phone.slice(1);
    const payload = {
      amount,
      phone_number: phone,
      channel_id: Number(CHANNEL),
      provider: data.provider || 'm-pesa',
      external_reference: data.external_reference || `WAPOA-${Date.now()}`,
      callback_url: `${process.env.URL || 'https://wapoalive.netlify.app'}/.netlify/functions/pay-callback`,
      customer_name: data.customer_name || 'Wapoa User',
      metadata: data.metadata || {}
    };
    const res = await fetch('https://backend.payhero.co.ke/api/v2/payments', {
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':'Basic '+auth},
      body: JSON.stringify(payload)
    });
    const txt = await res.text();
    return {statusCode: res.status, body: txt};
  }catch(e){
    return {statusCode:500, body: JSON.stringify({error:e.message})};
  }
}
