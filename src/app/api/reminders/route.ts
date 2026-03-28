import { NextRequest, NextResponse } from 'next/server';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Bu endpoint Vercel Cron ile her gün çağrılır
export async function GET(req: NextRequest) {
  // Güvenlik: sadece Vercel Cron veya secret key ile çağrılabilir
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const results = { sent: 0, errors: 0 };

    // Tüm petleri çek
    const petsSnap = await getDocs(collection(db, 'pets'));
    const pets = petsSnap.docs.map(d => ({ id: d.id, ...d.data() })) as any[];

    for (const pet of pets) {
      if (!pet.vaccines?.length) continue;

      const reminders: string[] = [];

      for (const vaccine of pet.vaccines) {
        if (!vaccine.nextDate) continue;
        const daysLeft = Math.ceil((new Date(vaccine.nextDate).getTime() - Date.now()) / (1000*60*60*24));

        // 7 gün ve 1 gün kala hatırlat
        if (daysLeft === 7 || daysLeft === 1) {
          reminders.push(`💉 ${vaccine.name} — ${daysLeft === 1 ? 'YARIN!' : '7 gün sonra'} (${vaccine.nextDate})`);
        }
        // Gecikmiş
        if (daysLeft === -1) {
          reminders.push(`⚠️ ${vaccine.name} — DÜN yapılması gerekiyordu!`);
        }
      }

      if (reminders.length === 0) continue;

      // Kullanıcının mailini bul
      const userSnap = await getDocs(query(collection(db,'users'), where('__name__','==',pet.ownerId)));
      if (userSnap.empty) continue;
      const userEmail = userSnap.docs[0].data().email;
      if (!userEmail) continue;

      // Mail gönder
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'Patipetra <info@patipetra.com>',
          to: userEmail,
          subject: `🐾 ${pet.name} için hatırlatma`,
          html: `
            <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:20px">
              <div style="background:#2F2622;padding:20px;border-radius:12px;margin-bottom:20px">
                <h1 style="color:#E8B86D;font-size:22px;margin:0">Patıpetra 🐾</h1>
              </div>
              <h2 style="color:#2F2622">${pet.name} için Hatırlatmalar</h2>
              <div style="background:#F7F2EA;padding:16px;border-radius:12px;margin:16px 0">
                ${reminders.map(r=>`<p style="margin:8px 0;color:#5C4A32;font-size:15px">${r}</p>`).join('')}
              </div>
              <p style="color:#7A7368;font-size:14px">Veterinerinizi arayarak randevu alabilirsiniz.</p>
              <a href="https://patipetra.com/panel/petlerim" 
                style="display:inline-block;background:#C9832E;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;margin-top:8px">
                Pet Pasaportu Görüntüle →
              </a>
              <p style="color:#9A9188;font-size:12px;margin-top:20px">
                Patıpetra — Türkiye'nin Pet Yaşam Platformu<br>
                Bildirimleri kapatmak için <a href="https://patipetra.com/panel/ayarlar" style="color:#C9832E">ayarlar</a> sayfasını ziyaret edin.
              </p>
            </div>
          `,
        }),
      });

      if (res.ok) results.sent++;
      else results.errors++;
    }

    return NextResponse.json({ success: true, ...results });
  } catch(err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
