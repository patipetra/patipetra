"use strict";(()=>{var e={};e.id=433,e.ids=[433],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},60173:(e,i,a)=>{a.r(i),a.d(i,{originalPathname:()=>y,patchFetch:()=>f,requestAsyncStorage:()=>b,routeModule:()=>m,serverHooks:()=>x,staticGenerationAsyncStorage:()=>c});var t={};a.r(t),a.d(t,{POST:()=>u});var r=a(49303),n=a(88716),p=a(60670),o=a(87070);let s=process.env.RESEND_API_KEY,d="info@patipetra.com";async function l(e,i,a){if(e&&e.includes("@"))return(await fetch("https://api.resend.com/emails",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${s}`},body:JSON.stringify({from:"Patipetra <info@patipetra.com>",to:e,subject:i,html:a})})).json()}async function u(e){try{let{type:i,data:a}=await e.json();if("vet_application"===i)await l(d,`Yeni Veteriner Basvurusu: ${a.fullName}`,`<div style="font-family:sans-serif;padding:20px">
          <h2>Yeni Veteriner Basvurusu</h2>
          <p><b>Ad:</b> ${a.fullName}</p>
          <p><b>Klinik:</b> ${a.clinicName}</p>
          <p><b>Sehir:</b> ${a.city}</p>
          <p><b>Telefon:</b> ${a.phone}</p>
          <p><b>E-posta:</b> ${a.email}</p>
          <p><b>Uzmanliklar:</b> ${(a.specs||[]).join(", ")}</p>
          <a href="https://patipetra.com/admin" style="display:inline-block;background:#C9832E;color:white;padding:12px 24px;border-radius:8px;text-decoration:none">Admin Paneline Git</a>
        </div>`),await l(a.email,"Patipetra Veteriner Basvurunuz Alindi",`<div style="font-family:sans-serif;padding:20px">
          <h2>Merhaba ${a.fullName},</h2>
          <p>Basvurunuz alindi. 2 is gunu icinde incelenecek.</p>
        </div>`);else if("vet_meeting"===i)await l(a.vetEmail,"Patipetra - Goruntulusu Gorusme Daveti",`<div style="font-family:sans-serif;padding:20px">
          <h2>Merhaba ${a.vetName},</h2>
          <p>Goruntulusu gorusme planlanmistir.</p>
          <p><b>Tarih:</b> ${new Date(a.meetingDate).toLocaleString("tr-TR")}</p>
          ${a.adminNotes?`<p><b>Not:</b> ${a.adminNotes}</p>`:""}
        </div>`);else if("vet_contract"===i)await l(a.vetEmail,"Patipetra Veteriner Sozlesmesi",`<div style="font-family:sans-serif;padding:20px">
          <h2>Merhaba ${a.vetName},</h2>
          <p><b>Plan:</b> ${"yearly"===a.planType?"Yillik":"Aylik"}</p>
          <p><b>Aylik Ucret:</b> ${a.monthlyFee} TL</p>
          <p><b>Yillik Ucret:</b> ${a.yearlyFee} TL</p>
          <p><b>Baslangic:</b> ${a.startDate}</p>
          ${a.notes?`<p><b>Notlar:</b> ${a.notes}</p>`:""}
          <p>Onaylamak icin info@patipetra.com adresine "ONAYLIYORUM - ${a.vetName}" yazin.</p>
        </div>`);else if("vet_approved"===i)await l(a.vetEmail,"Tebrikler! Patipetra Profiliniz Yayinda",`<div style="font-family:sans-serif;padding:20px">
          <h2>Tebrikler ${a.vetName}!</h2>
          <p>Veteriner profiliniz onaylandi ve yayina girdi.</p>
          <a href="https://patipetra.com/vet-panel" style="display:inline-block;background:#C9832E;color:white;padding:12px 24px;border-radius:8px;text-decoration:none">Veteriner Panelinize Gidin</a>
        </div>`);else if("question_answered"===i){if(!a.userEmail)return o.NextResponse.json({success:!0});await l(a.userEmail,`Sorunuz Yanitlandi - ${a.vetName}`,`<div style="font-family:sans-serif;padding:20px">
          <h2>Merhaba ${a.userName},</h2>
          <p>Sorunuz <b>${a.vetName}</b> tarafindan yanitlandi.</p>
          <div style="background:#F7F2EA;padding:16px;border-radius:8px;margin:16px 0">
            <p><b>Sorunuz:</b> ${a.question}</p>
          </div>
          <div style="background:#fff3e0;padding:16px;border-radius:8px;border-left:4px solid #C9832E">
            <p><b>Yanit:</b> ${a.answer}</p>
          </div>
          <a href="https://patipetra.com/veterinerler/${a.vetSlug}" style="display:inline-block;background:#C9832E;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:16px">Veteriner Profiline Git</a>
        </div>`)}else"vet_new_question"===i?await l(a.vetEmail,`Yeni Soru: ${a.userName}`,`<div style="font-family:sans-serif;padding:20px">
          <h2>Yeni Soru Geldi!</h2>
          <p><b>${a.userName}</b> size bir soru sordu:</p>
          ${a.petInfo?`<p><b>Pet:</b> ${a.petInfo}</p>`:""}
          <div style="background:#F7F2EA;padding:16px;border-radius:8px;border-left:4px solid #C9832E">
            <p>${a.question}</p>
          </div>
          <a href="https://patipetra.com/vet-panel" style="display:inline-block;background:#C9832E;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:16px">Veteriner Panelinde Yanitla</a>
        </div>`):"vet_new_appointment"===i?await l(a.vetEmail,`Yeni Randevu Talebi: ${a.userName}`,`<div style="font-family:sans-serif;padding:20px">
          <h2>Yeni Randevu Talebi!</h2>
          <p><b>${a.userName}</b> randevu talep etti.</p>
          <p><b>Tarih:</b> ${a.date} - ${a.time}</p>
          <p><b>Telefon:</b> ${a.userPhone}</p>
          ${a.petName?`<p><b>Pet:</b> ${a.petName}</p>`:""}
          ${a.note?`<p><b>Not:</b> ${a.note}</p>`:""}
          <a href="https://patipetra.com/vet-panel" style="display:inline-block;background:#C9832E;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:16px">Randevuyu Onayla</a>
        </div>`):"vet_new_message"===i?await l(a.vetEmail,`Yeni Mesaj: ${a.userName}`,`<div style="font-family:sans-serif;padding:20px">
          <h2>Yeni Mesaj!</h2>
          <p><b>${a.userName}</b> size mesaj gonderdi:</p>
          <div style="background:#F7F2EA;padding:16px;border-radius:8px">
            <p>${a.message}</p>
          </div>
          <a href="https://patipetra.com/vet-panel" style="display:inline-block;background:#C9832E;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:16px">Veteriner Panelinde Gor</a>
        </div>`):"community_request"===i?await l(d,`Yeni Topluluk Basvurusu: ${a.communityName}`,`<div style="font-family:sans-serif;padding:20px">
          <h2>Yeni Topluluk Basvurusu</h2>
          <p><b>Topluluk Adi:</b> ${a.communityName}</p>
          <p><b>Aciklama:</b> ${a.description}</p>
          <p><b>Kategori:</b> ${a.category}</p>
          <p><b>Kurucu:</b> ${a.creatorName} (${a.creatorEmail})</p>
          <a href="https://patipetra.com/admin" style="display:inline-block;background:#C9832E;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;margin-top:16px">Admin Panelinde Incele</a>
        </div>`):"premium_activated"===i&&await l(a.userEmail,"✨ Patipetra Premium Uyeliginiz Aktif!",`<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px">
          <div style="background:#2F2622;padding:24px;border-radius:12px;text-align:center;margin-bottom:24px">
            <h1 style="color:#E8B86D;margin:0;font-size:24px">Patipetra 🐾</h1>
          </div>
          <h2 style="color:#2F2622">Tebrikler! Premium Uyeliginiz Aktif</h2>
          <div style="background:#F7F2EA;padding:20px;border-radius:12px;margin:16px 0">
            <p style="margin:0 0 8px"><b>Plan:</b> ${a.planName}</p>
            <p style="margin:0 0 8px"><b>Gecerlilik:</b> ${a.expiry} tarihine kadar</p>
            <p style="margin:0;color:#9A9188;font-size:13px">Kod: ${a.code}</p>
          </div>
          <a href="https://patipetra.com/panel" style="display:inline-block;background:#C9832E;color:white;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:bold;margin:8px 0">
            Panele Git →
          </a>
          <p style="color:#9A9188;font-size:12px;margin-top:20px">
            Sorulariniz icin info@patipetra.com adresine yazabilirsiniz.
          </p>
        </div>`);return o.NextResponse.json({success:!0})}catch(e){return console.error("Email error:",e),o.NextResponse.json({error:e.message},{status:500})}}let m=new r.AppRouteRouteModule({definition:{kind:n.x.APP_ROUTE,page:"/api/email/route",pathname:"/api/email",filename:"route",bundlePath:"app/api/email/route"},resolvedPagePath:"/workspaces/PatiPetra/src/app/api/email/route.ts",nextConfigOutput:"",userland:t}),{requestAsyncStorage:b,staticGenerationAsyncStorage:c,serverHooks:x}=m,y="/api/email/route";function f(){return(0,p.patchFetch)({serverHooks:x,staticGenerationAsyncStorage:c})}}};var i=require("../../../webpack-runtime.js");i.C(e);var a=e=>i(i.s=e),t=i.X(0,[948,972],()=>a(60173));module.exports=t})();