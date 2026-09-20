
export async function handler(event){
  try{
    const {phone, action, code, newPassword} = JSON.parse(event.body||'{}');
    if(action==='request'){
      const otp = Math.floor(100000+Math.random()*900000).toString();
      console.log(`OTP for ${phone}: ${otp}`);
      return {statusCode:200, body:JSON.stringify({success:true, otp, message:"OTP imetumwa (demo inaonyeshwa hapa, production itatumwa SMS)"})};
    }
    if(action==='verify'){ return {statusCode:200, body:JSON.stringify({success:true})}; }
    if(action==='reset'){ return {statusCode:200, body:JSON.stringify({success:true, message:"Password changed"})}; }
  }catch(e){ return {statusCode:500, body:JSON.stringify({error:e.message})}; }
}
