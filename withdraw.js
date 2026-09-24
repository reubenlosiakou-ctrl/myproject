
export async function handler(event){
  try{
    const {phone, amount}=JSON.parse(event.body||'{}');
    if(!phone || amount<100) return {statusCode:400, body:JSON.stringify({error:"Min 100"})};
    let c=phone.replace(/\s+/g,''); if(c.startsWith('0')) c='254'+c.slice(1);
    console.log(`WITHDRAW ${amount} to ${c}`);
    return {statusCode:200, body:JSON.stringify({success:true, message:`${amount} KES imetumwa kwa ${c}. Angalia M-Pesa in 2 min.`})};
  }catch(e){ return {statusCode:500, body:JSON.stringify({error:e.message})}; }
}
