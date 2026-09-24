
export async function handler(event){
  console.log("CALLBACK", event.body);
  try{
    const b=JSON.parse(event.body||'{}');
    const status = b.status || b.response?.status;
    const meta=b.metadata||b.response?.metadata||{};
    // Bug fix: previously this treated every callback as a success, including
    // failed/cancelled payments, because it never checked the status field.
    if(String(status).toUpperCase() !== 'SUCCESS'){
      console.log("CALLBACK non-success status:", status);
      return {statusCode:200, body: JSON.stringify({ok:true, ignored:true, status})};
    }
    // TODO: save to Supabase: gift 70% to receiver, referral 30%
    return {statusCode:200, body: JSON.stringify({ok:true})};
  }catch(e){ return {statusCode:200, body:'ok'} }
}
