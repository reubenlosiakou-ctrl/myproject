
export async function handler(event){
  console.log("CALLBACK", event.body);
  try{
    const b=JSON.parse(event.body||'{}');
    const meta=b.metadata||b.response?.metadata||{};
    // TODO: save to Supabase: gift 90% to receiver, referral 30
    return {statusCode:200, body: JSON.stringify({ok:true})};
  }catch(e){ return {statusCode:200, body:'ok'} }
}
