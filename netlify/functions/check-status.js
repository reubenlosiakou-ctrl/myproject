export async function handler(event){
  try{
    const USER = process.env.PAYHERO_USERNAME;
    const PASS = process.env.PAYHERO_PASSWORD;
    if(!USER || !PASS) return {statusCode:500, body: JSON.stringify({error:"Missing env"})};
    const reference = event.queryStringParameters && event.queryStringParameters.external_reference;
    if(!reference) return {statusCode:400, body: JSON.stringify({error:"Missing external_reference"})};
    const auth = Buffer.from(`${USER}:${PASS}`).toString('base64');
    const res = await fetch(`https://backend.payhero.co.ke/api/v2/transaction-status?external_reference=${encodeURIComponent(reference)}`, {
      headers: {'Authorization':'Basic '+auth}
    });
    const txt = await res.text();
    return {statusCode: res.status, body: txt};
  }catch(e){
    return {statusCode:500, body: JSON.stringify({error:e.message})};
  }
}
