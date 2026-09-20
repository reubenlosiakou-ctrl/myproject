
export async function handler(event){
  try{
    const USER = process.env.PAYHERO_USERNAME;
    const PASS = process.env.PAYHERO_PASSWORD;
    const CHANNEL = process.env.PAYHERO_CHANNEL_ID || process.env.PAYHERO_ACCOUNT_ID;
    if(!USER || !PASS || !CHANNEL) return {statusCode:500, body: JSON.stringify({error:"Missing env"})};
    const auth = Buffer.from(`${USER}:${PASS}`).toString('base64');
    const data = JSON.parse(event.body || '{}');
    const allowed = [20,25,30,40,50,100,150,200,300,500,1000,2000];
    if(!allowed.includes(Number(data.amount))) return {statusCode:400, body: JSON.stringify({error:"Amount not allowed"})};
    // clean phone 07 -> 2547
    let phone = (data.phone_number||'').replace(/\s+/g,'');
    if(phone.startsWith('0')) phone = '254'+phone.slice(1);
    if(phone.startsWith('+')) phone = phone.slice(1);
    const payload = {
      amount: Number(data.amount),
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
