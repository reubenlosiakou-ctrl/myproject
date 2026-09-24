
export async function handler(event){
  try{
    const {phone, action, code, newPassword} = JSON.parse(event.body||'{}');
    if(action==='request'){
      const otp = Math.floor(100000+Math.random()*900000).toString();
      console.log(`OTP for ${phone}: ${otp}`);
      return {statusCode:200, body:JSON.stringify({success:true, otp, message:"OTP imetumwa (demo inaonyeshwa hapa, production itatumwa SMS)"})};
    }
    if(action==='verify'){
      // NOTE: this can't actually be fixed here — the 'request' step never
      // stores the generated OTP anywhere (no DB/session write), so there is
      // nothing to compare `code` against. Right now ANY code passed in
      // returns success. To fix for real you need to persist {phone, otp,
      // expiresAt} when it's generated, then check `code === storedOtp &&
      // !expired` here. Flagging rather than faking a check.
      if(!code) return {statusCode:400, body:JSON.stringify({success:false, error:"Code required"})};
      return {statusCode:200, body:JSON.stringify({success:true})};
    }
    if(action==='reset'){ return {statusCode:200, body:JSON.stringify({success:true, message:"Password changed"})}; }
  }catch(e){ return {statusCode:500, body:JSON.stringify({error:e.message})}; }
}
