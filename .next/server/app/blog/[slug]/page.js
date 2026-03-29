(()=>{var e={};e.id=308,e.ids=[308],e.modules={47849:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external")},72934:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external.js")},55403:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external")},54580:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external.js")},94749:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external")},45869:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},20399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},83122:e=>{"use strict";e.exports=require("undici")},6113:e=>{"use strict";e.exports=require("crypto")},9523:e=>{"use strict";e.exports=require("dns")},82361:e=>{"use strict";e.exports=require("events")},57147:e=>{"use strict";e.exports=require("fs")},13685:e=>{"use strict";e.exports=require("http")},85158:e=>{"use strict";e.exports=require("http2")},41808:e=>{"use strict";e.exports=require("net")},22037:e=>{"use strict";e.exports=require("os")},71017:e=>{"use strict";e.exports=require("path")},77282:e=>{"use strict";e.exports=require("process")},12781:e=>{"use strict";e.exports=require("stream")},24404:e=>{"use strict";e.exports=require("tls")},57310:e=>{"use strict";e.exports=require("url")},73837:e=>{"use strict";e.exports=require("util")},59796:e=>{"use strict";e.exports=require("zlib")},67149:(e,a,i)=>{"use strict";i.r(a),i.d(a,{GlobalError:()=>t.a,__next_app__:()=>x,originalPathname:()=>m,pages:()=>o,routeModule:()=>u,tree:()=>k}),i(60075),i(73001),i(7629),i(12523);var r=i(23191),l=i(88716),n=i(37922),t=i.n(n),s=i(95231),d={};for(let e in s)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(d[e]=()=>s[e]);i.d(a,d);let k=["",{children:["blog",{children:["[slug]",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(i.bind(i,60075)),"/workspaces/PatiPetra/src/app/blog/[slug]/page.tsx"]}]},{}]},{}]},{layout:[()=>Promise.resolve().then(i.bind(i,73001)),"/workspaces/PatiPetra/src/app/layout.tsx"],error:[()=>Promise.resolve().then(i.bind(i,7629)),"/workspaces/PatiPetra/src/app/error.tsx"],"not-found":[()=>Promise.resolve().then(i.bind(i,12523)),"/workspaces/PatiPetra/src/app/not-found.tsx"]}],o=["/workspaces/PatiPetra/src/app/blog/[slug]/page.tsx"],m="/blog/[slug]/page",x={require:i,loadChunk:()=>Promise.resolve()},u=new r.AppPageRouteModule({definition:{kind:l.x.APP_PAGE,page:"/blog/[slug]/page",pathname:"/blog/[slug]",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:k}})},25731:(e,a,i)=>{Promise.resolve().then(i.t.bind(i,79404,23)),Promise.resolve().then(i.bind(i,65208)),Promise.resolve().then(i.bind(i,16681))},65208:(e,a,i)=>{"use strict";i.d(a,{default:()=>s});var r=i(10326),l=i(90434),n=i(7600),t=i(17577);function s(){let{settings:e}=function(){let[e,a]=(0,t.useState)({siteName:"Patıpetra",slogan:"T\xfcrkiye'nin Pet Yaşam Platformu",email:"info@patipetra.com",phone:"",whatsapp:"",instagram:"",twitter:"",facebook:"",youtube:"",tiktok:"",footerText:"\xa9 2025 Patıpetra. T\xfcm hakları saklıdır."}),[i,r]=(0,t.useState)(!1);return{settings:e,loaded:i}}(),a=[{key:"instagram",icon:"\uD83D\uDCF7",label:"Instagram",url:`https://instagram.com/${e.instagram?.replace("@","")}`},{key:"twitter",icon:"\uD83D\uDC26",label:"Twitter",url:`https://twitter.com/${e.twitter?.replace("@","")}`},{key:"facebook",icon:"\uD83D\uDC64",label:"Facebook",url:e.facebook},{key:"youtube",icon:"▶️",label:"YouTube",url:e.youtube},{key:"tiktok",icon:"\uD83C\uDFB5",label:"TikTok",url:`https://tiktok.com/@${e.tiktok?.replace("@","")}`}].filter(a=>e[a.key]);return r.jsx("footer",{className:"bg-[#2F2622] text-white/70",children:(0,r.jsxs)("div",{className:"max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16 py-12",children:[(0,r.jsxs)("div",{className:"grid grid-cols-2 lg:grid-cols-4 gap-8 mb-10",children:[(0,r.jsxs)("div",{className:"col-span-2 lg:col-span-1",children:[r.jsx("div",{className:"mb-6",children:r.jsx(n.Z,{dark:!0,height:52,linkTo:"/",sizeKey:"footerHeight"})}),r.jsx("p",{className:"text-sm leading-relaxed text-white/50 mb-4",children:e.slogan}),e.email&&(0,r.jsxs)("a",{href:`mailto:${e.email}`,className:"text-sm text-[#E8B86D] hover:text-white transition-colors block mb-1",children:["✉️ ",e.email]}),e.phone&&(0,r.jsxs)("a",{href:`tel:${e.phone}`,className:"text-sm text-white/50 hover:text-white transition-colors block mb-1",children:["\uD83D\uDCDE ",e.phone]}),e.whatsapp&&r.jsx("a",{href:`https://wa.me/${e.whatsapp.replace(/[^0-9]/g,"")}`,target:"_blank",rel:"noopener noreferrer",className:"text-sm text-white/50 hover:text-white transition-colors block",children:"\uD83D\uDCAC WhatsApp"}),a.length>0&&r.jsx("div",{className:"flex gap-3 mt-4",children:a.map(e=>r.jsx("a",{href:e.url,target:"_blank",rel:"noopener noreferrer",className:"w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-base hover:bg-[#C9832E] transition-all",title:e.label,children:e.icon},e.key))})]}),(0,r.jsxs)("div",{children:[r.jsx("div",{className:"text-[11px] font-semibold tracking-[.2em] uppercase text-white/30 mb-4",children:"Platform"}),r.jsx("div",{className:"flex flex-col gap-2 text-sm",children:[["İlanlar","/ilanlar"],["Veterinerler","/veterinerler"],["Hizmetler","/hizmetler"],["Topluluk","/topluluk"],["Blog","/blog"],["Mağaza","/magaza"]].map(([e,a])=>r.jsx(l.default,{href:a,className:"text-white/50 hover:text-white transition-colors",children:e},e))})]}),(0,r.jsxs)("div",{children:[r.jsx("div",{className:"text-[11px] font-semibold tracking-[.2em] uppercase text-white/30 mb-4",children:"Hesap"}),r.jsx("div",{className:"flex flex-col gap-2 text-sm",children:[["Kayıt Ol","/kayit"],["Giriş Yap","/giris"],["Kontrol Paneli","/panel"],["Pet Pasaport","/panel/petlerim"],["Premium","/panel/premium"],["Veteriner Başvuru","/veterinerler/basvur"]].map(([e,a])=>r.jsx(l.default,{href:a,className:"text-white/50 hover:text-white transition-colors",children:e},e))})]}),(0,r.jsxs)("div",{children:[r.jsx("div",{className:"text-[11px] font-semibold tracking-[.2em] uppercase text-white/30 mb-4",children:"Yasal"}),r.jsx("div",{className:"flex flex-col gap-2 text-sm",children:[["KVKK","/kvkk"],["Gizlilik","/gizlilik"],["Kullanım Koşulları","/kullanim"],["SSS","/sss"],["Destek","/destek"]].map(([e,a])=>r.jsx(l.default,{href:a,className:"text-white/50 hover:text-white transition-colors",children:e},e))})]})]}),(0,r.jsxs)("div",{className:"border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3",children:[r.jsx("p",{className:"text-xs text-white/30",children:e.footerText||"\xa9 2025 Patıpetra. T\xfcm hakları saklıdır."}),r.jsx("p",{className:"text-xs text-white/20",children:"T\xfcrkiye'nin Pet Yaşam Platformu \uD83D\uDC3E"})]})]})})}i(76),i(90445)},61085:(e,a,i)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0}),function(e,a){for(var i in a)Object.defineProperty(e,i,{enumerable:!0,get:a[i]})}(a,{ReadonlyURLSearchParams:function(){return t},RedirectType:function(){return r.RedirectType},notFound:function(){return l.notFound},permanentRedirect:function(){return r.permanentRedirect},redirect:function(){return r.redirect}});let r=i(83953),l=i(16399);class n extends Error{constructor(){super("Method unavailable on `ReadonlyURLSearchParams`. Read more: https://nextjs.org/docs/app/api-reference/functions/use-search-params#updating-searchparams")}}class t extends URLSearchParams{append(){throw new n}delete(){throw new n}set(){throw new n}sort(){throw new n}}("function"==typeof a.default||"object"==typeof a.default&&null!==a.default)&&void 0===a.default.__esModule&&(Object.defineProperty(a.default,"__esModule",{value:!0}),Object.assign(a.default,a),e.exports=a.default)},16399:(e,a)=>{"use strict";Object.defineProperty(a,"__esModule",{value:!0}),function(e,a){for(var i in a)Object.defineProperty(e,i,{enumerable:!0,get:a[i]})}(a,{isNotFoundError:function(){return l},notFound:function(){return r}});let i="NEXT_NOT_FOUND";function r(){let e=Error(i);throw e.digest=i,e}function l(e){return"object"==typeof e&&null!==e&&"digest"in e&&e.digest===i}("function"==typeof a.default||"object"==typeof a.default&&null!==a.default)&&void 0===a.default.__esModule&&(Object.defineProperty(a.default,"__esModule",{value:!0}),Object.assign(a.default,a),e.exports=a.default)},8586:(e,a)=>{"use strict";var i;Object.defineProperty(a,"__esModule",{value:!0}),Object.defineProperty(a,"RedirectStatusCode",{enumerable:!0,get:function(){return i}}),function(e){e[e.SeeOther=303]="SeeOther",e[e.TemporaryRedirect=307]="TemporaryRedirect",e[e.PermanentRedirect=308]="PermanentRedirect"}(i||(i={})),("function"==typeof a.default||"object"==typeof a.default&&null!==a.default)&&void 0===a.default.__esModule&&(Object.defineProperty(a.default,"__esModule",{value:!0}),Object.assign(a.default,a),e.exports=a.default)},83953:(e,a,i)=>{"use strict";var r;Object.defineProperty(a,"__esModule",{value:!0}),function(e,a){for(var i in a)Object.defineProperty(e,i,{enumerable:!0,get:a[i]})}(a,{RedirectType:function(){return r},getRedirectError:function(){return d},getRedirectStatusCodeFromError:function(){return c},getRedirectTypeFromError:function(){return u},getURLFromRedirectError:function(){return x},isRedirectError:function(){return m},permanentRedirect:function(){return o},redirect:function(){return k}});let l=i(54580),n=i(72934),t=i(8586),s="NEXT_REDIRECT";function d(e,a,i){void 0===i&&(i=t.RedirectStatusCode.TemporaryRedirect);let r=Error(s);r.digest=s+";"+a+";"+e+";"+i+";";let n=l.requestAsyncStorage.getStore();return n&&(r.mutableCookies=n.mutableCookies),r}function k(e,a){void 0===a&&(a="replace");let i=n.actionAsyncStorage.getStore();throw d(e,a,(null==i?void 0:i.isAction)?t.RedirectStatusCode.SeeOther:t.RedirectStatusCode.TemporaryRedirect)}function o(e,a){void 0===a&&(a="replace");let i=n.actionAsyncStorage.getStore();throw d(e,a,(null==i?void 0:i.isAction)?t.RedirectStatusCode.SeeOther:t.RedirectStatusCode.PermanentRedirect)}function m(e){if("object"!=typeof e||null===e||!("digest"in e)||"string"!=typeof e.digest)return!1;let[a,i,r,l]=e.digest.split(";",4),n=Number(l);return a===s&&("replace"===i||"push"===i)&&"string"==typeof r&&!isNaN(n)&&n in t.RedirectStatusCode}function x(e){return m(e)?e.digest.split(";",3)[2]:null}function u(e){if(!m(e))throw Error("Not a redirect error");return e.digest.split(";",2)[1]}function c(e){if(!m(e))throw Error("Not a redirect error");return Number(e.digest.split(";",4)[3])}(function(e){e.push="push",e.replace="replace"})(r||(r={})),("function"==typeof a.default||"object"==typeof a.default&&null!==a.default)&&void 0===a.default.__esModule&&(Object.defineProperty(a.default,"__esModule",{value:!0}),Object.assign(a.default,a),e.exports=a.default)},60075:(e,a,i)=>{"use strict";i.r(a),i.d(a,{default:()=>x,generateMetadata:()=>o,generateStaticParams:()=>m});var r=i(19510),l=i(61085),n=i(86345),t=i(84869),s=i(57371);let d=[{slug:"kedi-asi-takvimi-kapsamli-rehber",title:"Kedi Aşı Takvimi: Yaşa G\xf6re Eksiksiz Rehber",excerpt:"Kedinizin hangi aşıları, ne zaman ve ka\xe7 kez yaptırması gerektiğini anlatan kapsamlı rehber.",cat:"Sağlık",readTime:8,date:"20 Mart 2026",img:"https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=800&q=80",featured:!0},{slug:"kopek-beslenmesi-yasagore-rehber",title:"K\xf6pek Beslenmesi: Yaşa ve Irka G\xf6re Doğru Diyet",excerpt:"Yavru k\xf6pekten kıdemli k\xf6peğe, k\xfc\xe7\xfck ırklardan b\xfcy\xfck ırklara kadar ideal beslenme d\xfczeni.",cat:"Beslenme",readTime:10,date:"18 Mart 2026",img:"https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80",featured:!1},{slug:"ilk-kez-kedi-sahiplenmek",title:"İlk Kez Kedi Sahipleniyorum: Nereden Başlamalıyım?",excerpt:"Malzeme listesinden veteriner se\xe7imine, beslenme d\xfczeninden aşı takvimine kadar her şey.",cat:"Sahiplendirme",readTime:12,date:"15 Mart 2026",img:"https://images.unsplash.com/photo-1511044568932-338cba0ad803?auto=format&fit=crop&w=800&q=80",featured:!1},{slug:"kedi-kisirlastirma-neden-onemli",title:"Kedi Kısırlaştırma: Neden Bu Kadar \xd6nemli?",excerpt:"Kısırlaştırmanın sağlık ve davranış a\xe7ısından faydaları, ameliyat s\xfcreci ve sonrası bakım.",cat:"Sağlık",readTime:7,date:"12 Mart 2026",img:"https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?auto=format&fit=crop&w=800&q=80",featured:!1},{slug:"kopek-egitimi-temel-komutlar",title:"K\xf6pek Eğitiminin Temelleri: Evde Nasıl Başlanır?",excerpt:"Temel komutları \xf6ğretmek i\xe7in kanıtlanmış pozitif pekiştirme y\xf6ntemleri.",cat:"Eğitim",readTime:9,date:"10 Mart 2026",img:"https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80",featured:!1},{slug:"pet-pasaport-nedir-nasil-kullanilir",title:"Pet Pasaport Nedir ve Neden İhtiya\xe7 Duyarsınız?",excerpt:"Dijital pet pasaport sistemi ile hayvanınızın t\xfcm sağlık ge\xe7mişini tek platformda y\xf6netin.",cat:"Rehber",readTime:5,date:"8 Mart 2026",img:"https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=800&q=80",featured:!1},{slug:"kedi-tuy-dokme-bakimi",title:"Kedi T\xfcy D\xf6kme D\xf6neminde Bakım Rehberi",excerpt:"İlkbahar ve sonbaharda yoğunlaşan t\xfcy d\xf6kme d\xf6neminde kedinizi nasıl bakmalısınız?",cat:"Bakım",readTime:6,date:"5 Mart 2026",img:"https://images.unsplash.com/photo-1446071103084-c257b5f70672?auto=format&fit=crop&w=800&q=80",featured:!1},{slug:"mikrocip-neden-zorunlu",title:"Mikro\xe7ip: Hayvanınızı Kaybetmemenin En Etkili Yolu",excerpt:"Mikro\xe7ip nedir, T\xfcrkiye'de zorunluluk ve kayıp hayvanların bulunmasındaki kritik rol\xfc.",cat:"G\xfcvenlik",readTime:5,date:"2 Mart 2026",img:"https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?auto=format&fit=crop&w=800&q=80",featured:!1},{slug:"dogru-veteriner-nasil-secilir",title:"Petiniz İ\xe7in Doğru Veterineri Nasıl Se\xe7ersiniz?",excerpt:"Veteriner se\xe7imi i\xe7in 8 temel kriter, sormanız gereken sorular ve ipu\xe7ları.",cat:"Rehber",readTime:7,date:"28 Şubat 2026",img:"https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=800&q=80",featured:!1}],k={"kedi-asi-takvimi-kapsamli-rehber":`
Kedinizin sağlıklı ve uzun bir yaşam s\xfcrmesi i\xe7in aşılar kritik bir \xf6neme sahiptir. Pek \xe7ok evcil hayvan sahibi hangi aşıları ne zaman yaptırması gerektiği konusunda kararsız kalır. Bu kapsamlı rehberde, yavru kediden yaşlı kediye kadar t\xfcm yaş grupları i\xe7in aşı takvimini detaylı bi\xe7imde ele alıyoruz.

## Aşı Neden Bu Kadar \xd6nemli?

Aşılar, kedinizin bağışıklık sistemini olası hastalıklara karşı hazırlar. \xd6zellikle apartman kedilerinin dahi belirli aşılara ihtiya\xe7 duyduğunu bilmek \xf6nemlidir; zira bazı hastalıklar hava yoluyla ya da sahibinin kıyafetleri \xfczerinden bulaşabilir.

D\xfczenli aşılar sayesinde:
- \xd6l\xfcmc\xfcl solunum yolu hastalıklarından korunulur
- Vir\xfcs kaynaklı ishaller \xf6nlenir
- Kediden insana ge\xe7ebilecek hastalık riskleri azalır
- Veteriner masrafları uzun vadede d\xfcşer

## Yavru Kedi Aşı Takvimi (0-12 Ay)

**6-8. Hafta:** İlk veteriner muayenesi ve Felis Trivalent (FPV) aşısının birinci dozu yapılır. Bu aşı; panlok\xf6peni, rinotrakeit ve kalisivir\xfcse karşı koruma sağlar.

**10-12. Hafta:** FPV aşısının ikinci dozu uygulanır. Bu d\xf6nemde veterineriniz i\xe7 parazit kontrol\xfc de yapacaktır.

**14-16. Hafta:** FPV aşısının \xfc\xe7\xfcnc\xfc ve son dozu ile birlikte kuduz aşısı yapılır. T\xfcrkiye'de kuduz aşısı yasal zorunluluktur.

**12. Ay:** İlk yıllık hatırlatma aşıları yapılır. Bu d\xf6nemde FeLV (Kedi L\xf6semi Vir\xfcs\xfc) aşısına ihtiya\xe7 olup olmadığı veterinerinizle değerlendirilmelidir.

## Yetişkin Kedi Aşı Takvimi (1-10 Yaş)

Yetişkin kediler i\xe7in aşı takvimi genellikle yılda bir ya da \xfc\xe7 yılda bir şeklinde d\xfczenlenir. Bu s\xfcre, kullanılan aşının t\xfcr\xfcne ve kedinizin yaşam koşullarına g\xf6re değişir.

**Yıllık yapılan aşılar:**
- Kuduz aşısı (T\xfcrkiye mevzuatı gereği yıllık)
- FPV hatırlatma (bazı aşı tipleri i\xe7in)

**3 Yılda bir yapılan aşılar:**
- Modifiye canlı FPV aşısı
- Kalisivir\xfcs ve rinotrakeit kombinasyonu

## Yaşlı Kedi Aşı Takvimi (10+ Yaş)

10 yaş \xfcst\xfc kediler "yaşlı" olarak değerlendirilir. Bu d\xf6nemde bağışıklık sistemi zayıflamaya başlar, bu nedenle aşılar daha da \xf6nem kazanır. Ancak bazı yaşlı kedilerde aşıya bağlı yan etkiler daha sık g\xf6r\xfclebilir.

Veterineriniz, kedinizin genel sağlık durumuna g\xf6re aşı programını bireysel olarak belirleyecektir. 6 ayda bir veteriner kontrol\xfc bu d\xf6nemde altın standart sayılır.

## Aşı \xd6ncesi ve Sonrası Dikkat Edilecekler

Aşı \xf6ncesinde kediniz sağlıklı olmalıdır. Nezle, ishal ya da herhangi bir hastalık belirtisi varsa aşı birka\xe7 hafta ertelenmelidir.

Aşı sonrasında 24-48 saat kedinizi yakından g\xf6zlemleyin. Hafif uyuşukluk, iştah kaybı ve aşı b\xf6lgesinde hassasiyet normaldir. Ancak şiddetli şişlik, nefes darlığı ya da y\xfcz \xf6demi acil veteriner m\xfcdahalesi gerektiren belirtilerdir.

## Aşı Defteri Tutun

Kedinizin t\xfcm aşı bilgilerini dijital ortamda saklamak i\xe7in Patıpetra Pet Pasaport sistemini kullanabilirsiniz. Aşı tarihleri, veteriner bilgileri ve hatırlatma tarihleri otomatik olarak kaydedilir.

D\xfczenli aşı yaptırmak, kedinize verebileceğiniz en g\xfczel armağanlardan biridir. Bir sonraki veteriner randevunuzu bug\xfcn planlayın.
  `,"kopek-beslenmesi-yasagore-rehber":`
K\xf6pekler i\xe7in beslenme, ırka, yaşa, kiloya ve aktivite d\xfczeyine g\xf6re b\xfcy\xfck farklılıklar g\xf6sterir. "K\xf6pek mamısı, k\xf6pek yiyeceği" gibi genel bir yaklaşım yerine, k\xf6peğinizin bireysel ihtiya\xe7larını g\xf6z \xf6n\xfcnde bulundurmanız gerekir.

## K\xf6peklerin Temel Besin İhtiya\xe7ları

Her k\xf6pek diyeti beş temel besin grubunu i\xe7ermelidir:

**Protein:** Kas gelişimi ve bakımı i\xe7in hayati \xf6nem taşır. K\xf6pekler i\xe7in ideal protein kaynakları tavuk, hindi, sığır, balık ve yumurtadır.

**Karbonhidrat:** Enerji sağlar. Pirin\xe7, patates ve yulaf iyi kaynaklardır. Buğday bazlı \xfcr\xfcnlere alerjisi olan k\xf6pekler i\xe7in tahılsız se\xe7enekler mevcuttur.

**Yağ:** Cilt ve t\xfcy sağlığı i\xe7in gereklidir. Omega-3 ve Omega-6 yağ asitleri \xf6zellikle \xf6nemlidir.

**Vitamin ve Mineraller:** Kemik sağlığı, bağışıklık sistemi ve metabolizma i\xe7in şarttır.

**Su:** \xc7oğu zaman g\xf6z ardı edilse de su, bir k\xf6peğin ihtiya\xe7 duyduğu en kritik besindir.

## Yavru K\xf6pek Beslenmesi (0-12 Ay)

Yavru k\xf6pekler hızlı b\xfcy\xfcd\xfcğ\xfcnden, yetişkin k\xf6peklere kıyasla kilo başına \xe7ok daha fazla kalori ve protein ihtiya\xe7 duyarlar.

K\xfc\xe7\xfck ırklar (Chihuahua, Yorkshire Terrier): G\xfcnde 3-4 k\xfc\xe7\xfck \xf6ğ\xfcn
Orta ırklar (Labrador, Golden): G\xfcnde 3 \xf6ğ\xfcn
B\xfcy\xfck ırklar (Alman Kurdu, Rottweiler): G\xfcnde 2-3 \xf6ğ\xfcn

B\xfcy\xfck ırk yavruları i\xe7in \xf6zellikle tasarlanmış mamalar tercih edilmelidir; zira fazla hızlı b\xfcy\xfcme iskelet sorunlarına yol a\xe7abilir.

## Yetişkin K\xf6pek Beslenmesi (1-7 Yaş)

Bu d\xf6nemde g\xfcnde iki \xf6ğ\xfcn standart haline gelir. K\xf6peğinizin ideal kilosunu korumak i\xe7in porsiyon kontrol\xfc \xe7ok \xf6nemlidir.

G\xfcnl\xfck kalori ihtiyacı kabaca şu şekilde hesaplanabilir:
- Sedanter k\xf6pek: V\xfccut ağırlığı (kg) \xd7 30 + 70
- Aktif k\xf6pek: Bu değerin %20-40 fazlası

Hazır mama se\xe7erken ilk \xfc\xe7 i\xe7eriğe bakın. Bunların protein kaynakları olması (tavuk, sığır, balık) tercih edilir.

## Yaşlı K\xf6pek Beslenmesi (7+ Yaş)

Yaşlı k\xf6pekler daha az aktif olduğundan kalori ihtiya\xe7ları d\xfcşer, ancak protein ihtiya\xe7ları artabilir. Joint (eklem) sağlığını destekleyen glukozamin i\xe7eren mamalar bu d\xf6nemde faydalıdır.

B\xf6brek sorunları yaşlı k\xf6peklerde sık g\xf6r\xfcl\xfcr; bu nedenle d\xfcş\xfck fosfor i\xe7eren mamalar \xf6nerilebilir. Ancak bu t\xfcr \xf6zel diyetler mutlaka veteriner g\xf6zetiminde uygulanmalıdır.

## Asla Verilmemesi Gereken Besinler

- \xc7ikolata (teobromin zehirlenmesi)
- Soğan ve sarımsak (kırmızı kan h\xfccresi hasarı)
- \xdcz\xfcm ve kuru \xfcz\xfcm (b\xf6brek yetmezliği)
- Avokado (persine toksini)
- Makadamya fıstığı (n\xf6rolojik sorunlar)
- Ksilitol i\xe7eren \xfcr\xfcnler (karaciğer yetmezliği)
- Alkol ve kafein

## Ev Yapımı Mama vs. Hazır Mama

Ev yapımı mamalar doğal g\xf6r\xfcnse de yeterli vitamin ve mineral dengesini sağlamak olduk\xe7a zordur. Hazır mamalar bu a\xe7ıdan daha g\xfcvenilir se\xe7enekler sunar. Ev yapımı diyet uygulamak isteyenler mutlaka bir veteriner beslenmecisiyle \xe7alışmalıdır.
  `,"ilk-kez-kedi-sahiplenmek":`
Hayatınıza ilk kedinizi almak heyecan verici ama bir o kadar da hazırlık gerektiren bir s\xfcre\xe7tir. Y\xfczlerce sahip adayı "nereden başlayacağını bilmiyorum" diyerek bu yolculuğa başlar. Bu rehber, ilk kez kedi sahipleneceklere adım adım yol g\xf6stermek i\xe7in hazırlanmıştır.

## Kedi mi Yavru mu, Yetişkin mi?

İlk soruyu yanıtlamanız gerekiyor: Yavru kedi mi (2-4 aylık) yoksa yetişkin kedi mi sahipleneceksiniz?

**Yavru kediler** daha fazla enerji, sabır ve zaman gerektirir. Tuvalet eğitimi, sosyalleşme ve aşı programı y\xf6netimi sizin sorumluluğunuzdadır. Ancak yavruyla b\xfcy\xfcmenin verdiği bağ eşsizdir.

**Yetişkin kediler** genellikle karakteri oturmuş, tuvalet eğitimli ve daha sakin hayvanlardır. Barınak ve sahiplendirme derneklerinde bekleyen pek \xe7ok yetişkin kedi vardır.

## Sahiplendirme Mi, Petshop Mu?

Bu konuda net bir tavsiyemiz var: **\xd6nce sahiplendirmeyi deneyin.** T\xfcrkiye'de milyonlarca sahipsiz kedi ve k\xf6pek vardır. Patıpetra gibi platformlarda ya da yerel hayvanseverler aracılığıyla \xe7ok sayıda sahiplendirme ilanı bulabilirsiniz.

Sahiplendirilen kediler genellikle veteriner kontrol\xfcnden ge\xe7irilmiş, aşıları yapılmış ve kısırlaştırılmış olarak gelir.

## Eve Gelmeden \xd6nce Hazırlık Listesi

Kedinizin ilk g\xfcn\xfcnde ihtiya\xe7 duyacağı malzemeler:

**Temel İhtiya\xe7lar:**
- Mama kabı ve su kabı (paslanmaz \xe7elik veya seramik tercih edin)
- Kapalı kumu kutan (\xf6zellikle utanga\xe7 kediler i\xe7in)
- Kaliteli kedi kumu (topaklaşan ve kokusuz \xe7eşitler \xf6nerilir)
- Taşıma \xe7antası (ilk veteriner ziyareti i\xe7in şart)

**Konfor ve Oyun:**
- Kedi yatağı veya minderli kutu
- Tırmalama tahtası (mobilyalarınızı korumak i\xe7in)
- İnteraktif oyuncaklar (t\xfcyl\xfc asa, lazer pointer, top)

**Sağlık:**
- Kedi tarağı (t\xfcy bakımı i\xe7in)
- Tırnak makası

## İlk Veteriner Ziyareti

Kedinizi eve aldıktan sonraki ilk hafta i\xe7inde veteriner ziyareti şarttır. Bu ziyarette:

- Genel sağlık muayenesi yapılır
- Parazit kontrol\xfc (i\xe7 ve dış parazit) ger\xe7ekleştirilir
- Mevcut aşı durumu değerlendirilir
- Kısırlaştırma zamanlaması planlanır

## Eve Alışma S\xfcreci

İlk g\xfcnler kedinize \xe7ok fazla dokunmaya ya da zorlamaya \xe7alışmayın. G\xfcvenli bir oda belirleyin; onu mama, su, kumu kutusu ve yatakla birlikte bu odaya bırakın. Kendi hızında keşfetmesine izin verin.

\xc7oğu kedi 1-2 haftada yeni evine alışır. Bazı kediler ise birka\xe7 ay s\xfcrebilir. Sabır bu s\xfcrecin en \xf6nemli anahtarıdır.

## Tuvalet Eğitimi

Kediler i\xe7g\xfcd\xfcsel olarak kumu kutusunu kullanmayı bilirler. Ancak kutunun konumu, kumu t\xfcr\xfc ve temizlik d\xfczeni \xf6nemlidir. Kumu kutusunu sakin, ulaşılabilir bir yere koyun. G\xfcnde en az bir kez temizleyin.

Evde birden fazla katin varsa her kata bir kumu kutusu yerleştirin.

## Besleme D\xfczeni

Kediler tatlı tadı alamaz ve karbonhidratlara ihtiya\xe7 duymazlar. Protein ağırlıklı bir diyet idealdir. Yaşa uygun kedi maması se\xe7in; yavru, yetişkin ve yaşlı form\xfclasyonları birbirinden farklıdır.

Su t\xfcketimini artırmak i\xe7in ıslak mama ya da \xe7eşme benzeri su i\xe7ecekleri d\xfcş\xfcnebilirsiniz.
  `,"kedi-kisirlastirma-neden-onemli":`
Kısırlaştırma, evcil hayvan sahipliğinin en sorumlu adımlarından biridir. Pek \xe7ok sahip bu konuda kararsız kalır ya da "doğal hayatına karışmak istemiyorum" der. Ancak bilimsel veriler, kısırlaştırmanın hem bireysel hayvan sağlığını hem de toplumsal hayvan refahını b\xfcy\xfck \xf6l\xe7\xfcde iyileştirdiğini g\xf6stermektedir.

## Kısırlaştırma Nedir?

Dişi kedilerde ovaryohisterektomi (yumurtalık ve rahim alımı), erkek kedilerde ise orşiektomi (testis alımı) işlemidir. Her iki ameliyat da genel anestezi altında ger\xe7ekleştirilir ve deneyimli bir veteriner tarafından yapıldığında olduk\xe7a g\xfcvenlidir.

## Sağlık Faydaları

**Dişi kedilerde:**
- Rahim enfeksiyonu (pyometra) riski ortadan kalkar; bu hastalık tedavi edilmezse \xf6l\xfcmc\xfcl olabilir
- Meme t\xfcm\xf6r\xfc riski dramatik bi\xe7imde azalır; \xf6zellikle ilk kızgınlık \xf6ncesi kısırlaştırmalarda bu oran %90'a kadar d\xfcşer
- Yalancı gebelik semptomları yaşanmaz

**Erkek kedilerde:**
- Testis kanseri riski sıfırlanır
- Prostat sorunları azalır
- B\xf6lge işaretleme davranışı ve saldırganlık \xf6nemli \xf6l\xe7\xfcde azalır

## Davranışsal Değişiklikler

Kısırlaştırma sonrası en sık g\xf6zlemlenen davranış değişiklikleri şunlardır:

- Koku salgısıyla b\xf6lge işaretleme azalır veya tamamen durur
- Ev dışına ka\xe7ma isteği belirgin bi\xe7imde d\xfcşer
- Diğer kedilerle kavga etme eğilimi azalır
- Genel olarak daha sakin ve uysal bir karakter ortaya \xe7ıkar

\xd6nemli not: Kısırlaştırma kedinin kişiliğini değiştirmez; yalnızca hormonal d\xfcrt\xfcleri ortadan kaldırır.

## Ne Zaman Yapılmalı?

Geleneksel yaklaşım, dişi kedilerin ilk kızgınlık \xf6ncesinde (genellikle 5-6. aylarda), erkek kedilerin ise 6. ay civarında kısırlaştırılması y\xf6n\xfcndedir. Ancak barınaklarda erken d\xf6nem kısırlaştırma (8-16 haftalık) da uygulanmakta ve g\xfcvenli olduğu kanıtlanmaktadır.

## Ameliyat S\xfcreci Nasıl İşler?

Ameliyat \xf6ncesi kedinizin 8-12 saat a\xe7 kalması gerekir. Ameliyat genel anestezi altında 20-45 dakika s\xfcrer. Dişi kediler i\xe7in iyileşme s\xfcresi 7-10 g\xfcn, erkek kediler i\xe7in ise 2-3 g\xfcnd\xfcr.

Ameliyat sonrası yaklaşık 10 g\xfcn i\xe7in elizabethan yaka (koruyucu yakalık) takılması gerekebilir.

## Kısırlaştırmanın Toplumsal Boyutu

T\xfcrkiye'de sokak hayvanı sorunu b\xfcy\xfck \xf6l\xe7\xfcde kontrols\xfcz \xfcremeden kaynaklanmaktadır. Her yıl milyonlarca kedi ve k\xf6pek barınaklarda ya da sokaklarda hayatta kalma m\xfccadelesi vermektedir. Evcil hayvanınızı kısırlaştırarak bu tablonun bir par\xe7ası olmayı reddediyorsunuz.
  `,"kopek-egitimi-temel-komutlar":`
K\xf6pek eğitimi, ne kadar erken başlanırsa o kadar kolay ilerler. Ancak bu "yaşlı k\xf6pek yeni numara \xf6ğrenemez" demek değildir; sabır ve doğru tekniklerle her yaştaki k\xf6pek eğitilebilir. Bu rehberde pozitif pekiştirme y\xf6ntemiyle temel komutları nasıl \xf6ğreteceğinizi adım adım anlatıyoruz.

## Pozitif Pekiştirme Nedir?

Pozitif pekiştirme, k\xf6peğinizin doğru davranışı yaptığında \xf6d\xfcl (mama, oyun, \xf6vg\xfc) vermesi esasına dayanır. Ceza temelli y\xf6ntemler hem etkisiz hem de k\xf6pek-sahip ilişkisine zarar vericidir. Modern k\xf6pek eğitimi bilimi, pozitif pekiştirmenin \xe7ok daha hızlı ve kalıcı sonu\xe7lar verdiğini g\xf6stermektedir.

## Eğitime Başlamadan \xd6nce

**Doğru \xf6d\xfcl se\xe7imi:** K\xf6peğinizin en \xe7ok neyi sevdiğini \xf6ğrenin. Bazı k\xf6pekler mama i\xe7in, bazıları oyun i\xe7in, bazıları ise \xf6vg\xfc i\xe7in \xe7alışır.

**Zamanlama:** \xd6d\xfcl, davranış ger\xe7ekleştikten sonraki 1-2 saniye i\xe7inde verilmelidir. Gecikmeli \xf6d\xfcl, k\xf6peğin hangi davranışının \xf6d\xfcllendirildiğini anlamamasına yol a\xe7ar.

**Seans s\xfcresi:** G\xfcnde 2-3 kez, 5-10 dakikalık kısa seanslar daha verimlidir. Uzun seanslar k\xf6peği yorar ve dikkatini dağıtır.

## OTUR Komutu

Otur, t\xfcm komutların temelidir. \xd6ğretmek en kolay komutlardan biridir.

1. Elinizde \xf6d\xfcl tutun ve k\xf6peğinizin burnunun \xf6n\xfcne getirin
2. Elinizi yavaş\xe7a başının \xfcst\xfcne ve arkasına doğru g\xf6t\xfcr\xfcn
3. K\xf6pek \xf6d\xfcl\xfc takip ederken otomatik olarak oturacaktır
4. Oturur oturmaz "OTUR" deyin ve \xf6d\xfcl\xfc verin
5. 10-15 tekrar sonra el hareketi olmadan komutla deneyin

## DUR Komutu

Dur komutu g\xfcvenlik a\xe7ısından kritiktir; \xf6zellikle trafik yanında ya da tehlikeli durumlarda hayat kurtarabilir.

1. K\xf6peğiniz otururken \xf6ne iki adım atın
2. Elinizi a\xe7ık tutarak "DUR" deyin
3. 3 saniye bekleyin, kalmazsa geri d\xf6n\xfcn ve baştan başlayın
4. Başarılı olursa \xf6d\xfcl\xfc verin
5. S\xfcreyi kademeli olarak artırın: 3 saniye → 5 saniye → 10 saniye

## GEL Komutu

Gel komutu, k\xf6peğinizin her koşulda yanınıza gelmesini sağlar. Bu komutun her uygulamasının pozitif bitmesi şarttır.

1. K\xf6peğinizden birka\xe7 adım uzaklaşın
2. \xc7\xf6melip "GEL" deyin ve coşkuyla el hareketi yapın
3. Geldiğinde bol \xf6d\xfcl ve \xf6vg\xfcyle karşılayın
4. Mesafeyi kademeli olarak artırın

Uyarı: K\xf6pek geldiğinde asla azarlamayın. Bu, gelme davranışını olumsuz koşullandırır.

## YATIR Komutu

Yatır, otur komutunu \xf6ğrenen k\xf6pekler i\xe7in nispeten kolaydır.

1. K\xf6pek otururken \xf6d\xfcl\xfc burnunun \xf6n\xfcne getirin
2. \xd6d\xfcl\xfc yavaş\xe7a aşağı ve \xf6ne doğru \xe7ekin
3. K\xf6pek \xf6d\xfcl\xfc takip ederken yere uzanacaktır
4. "YATIR" deyin ve \xf6d\xfcl\xfc verin

## Yaygın Hatalar

**Komutları tekrarlamak:** "Otur, otur, otur!" demek k\xf6peğe hangi tekrarda oturması gerektiğini \xf6ğretir. Komutu bir kez verin.

**Eğitim seanslarını \xe7ok uzun tutmak:** Yorgunluk \xf6ğrenmeyi engeller.

**Tutarsız olmak:** Ailenin herkes aynı komutları kullanmalıdır.

**Olumsuz duygularla eğitmek:** Sinirli ya da sabırsızken eğitim yapmayın.

## Ne Zaman Profesyonel Yardım Alınmalı?

K\xf6peğinizde saldırganlık, aşırı korku ya da yıkıcı davranışlar varsa ve temel eğitim teknikleri işe yaramıyorsa, deneyimli bir k\xf6pek eğitmeninden destek almanız gerekebilir. Patıpetra \xfczerinden onaylı k\xf6pek eğitmenlerine ulaşabilirsiniz.
  `,"pet-pasaport-nedir-nasil-kullanilir":`
Evcil hayvanınızın t\xfcm sağlık bilgilerini, aşı tarihlerini, veteriner notlarını ve ila\xe7 kayıtlarını tek bir dijital platformda y\xf6netebilirsiniz. İşte bu, pet pasaport sistemidir.

## Pet Pasaport Nedir?

Pet pasaport, evcil hayvanınızın t\xfcm sağlık ge\xe7mişini dijital ortamda saklayan ve y\xf6neten bir sistemdir. Fiziksel sağlık karnelerinin aksine kaybolmaz, her yerden erişilebilir ve paylaşılması \xe7ok kolaydır.

## Neden Her Evcil Hayvan Sahibi Pet Pasaporta İhtiya\xe7 Duyar?

G\xfcn\xfcm\xfczde evcil hayvan sahipliği giderek daha bilin\xe7li bir hal almaktadır. Veterinerinizin değişmesi, tatile gittiğinizde başka birine bakım bırakmanız ya da acil bir durumda farklı bir kliniğe gidilmesi gerektiğinde, eksiksiz sağlık ge\xe7mişine sahip olmak hayat kurtarabilir.

Bir araştırmaya g\xf6re, evcil hayvan sahiplerinin %60'ı son yapılan aşının tarihini hatırlayamadıklarını belirtiyor. Bu, ge\xe7 aşı yapılmasına ya da gereksiz tekrar aşılara neden olabilir.

## Patıpetra Pet Pasaport ile Neler Yapabilirsiniz?

**Aşı Takibi:** Her aşının tarihi, sonraki uygulama zamanı ve yapan veteriner bilgisi kaydedilir. Hatırlatma bildirimler g\xf6nderilir.

**Veteriner Notları:** Her muayeneden sonra notlar eklenir; b\xf6ylece hastalık ge\xe7mişi eksiksiz tutulur.

**İla\xe7 Kaydı:** Kullanılan ila\xe7lar, dozaj bilgileri ve kullanım s\xfcreleri sisteme eklenir.

**Fotoğraf Galerisi:** Hayvanınızın fotoğraflarını y\xfckleyebilirsiniz; bu \xf6zellikle kayıp ilanları i\xe7in kritik \xf6nem taşır.

**Paylaşım \xd6zelliği:** Pet pasaportunuzu veterinerinizle, bakıcınızla ya da otel yetkilileriyle kolayca paylaşabilirsiniz.

## Nasıl Oluşturulur?

Patıpetra'ya \xfcye olduktan sonra Kontrol Paneli'dan "Pet Pasaportlarım" b\xf6l\xfcm\xfcne girin. "Yeni Pet Ekle" butonuna tıklayarak birka\xe7 dakika i\xe7inde ilk pasaportunuzu oluşturabilirsiniz.

Gerekli bilgiler: Pet adı, t\xfcr\xfc, ırkı, doğum tarihi, cinsiyet, kilo ve fotoğraf. Sonrasında aşı ve sağlık bilgilerini eklemeye başlayabilirsiniz.

## Sonu\xe7

Dijital d\xf6n\xfcş\xfcm evcil hayvan sahipliğini de değiştiriyor. Pet pasaport sistemi sayesinde hayvanınızın sağlığı artık parmaklarınızın ucunda.
  `,"kedi-tuy-dokme-bakimi":`
Her kedi t\xfcy d\xf6ker; bu doğal ve ka\xe7ınılmazdır. Ancak mevsim ge\xe7işlerinde, \xf6zellikle ilkbahar ve sonbaharda yoğunlaşan t\xfcy d\xf6kme d\xf6neminde doğru bakım hem evcil hayvanınızın sağlığını hem de evinizin temizliğini korur.

## Neden T\xfcy D\xf6kerler?

Kediler, v\xfccut ısısını d\xfczenlemek i\xe7in mevsimsel t\xfcy değişimi ge\xe7irirler. İlkbaharda kış t\xfcylerini atarak daha serin yazlık t\xfcylere ge\xe7erler. Sonbaharda ise tam tersi olur.

İ\xe7 mek\xe2nda yaşayan kedilerde bu d\xf6ng\xfc yapay aydınlatma nedeniyle d\xfczensizleşebilir ve yıl boyu hafif d\xfczeyde t\xfcy d\xf6k\xfcm\xfc yaşanabilir.

## Aşırı T\xfcy D\xf6k\xfcm\xfcn\xfcn Nedenleri

Mevsimsel değişimin \xf6tesinde aşırı t\xfcy d\xf6k\xfcm\xfc farklı nedenlere işaret edebilir:

- Beslenme yetersizliği (\xf6zellikle protein ve yağ asidi eksikliği)
- Parazit enfestasyonu (pire, uyuz)
- Alerjiler (gıda veya \xe7evresel)
- Stres ve anksiyete
- Hormonal dengesizlik
- Tiroid sorunları
- Dermatit ve mantar enfeksiyonları

Normal d\xf6nemi aşan t\xfcy d\xf6k\xfcm\xfc, deride a\xe7ıklar ya da kaşıma davranışı varsa veteriner muayenesi şarttır.

## Tarama Rutini

D\xfczenli tarama, t\xfcy d\xf6k\xfcm\xfcn\xfc kontrol altına almanın en etkili yoludur.

**Kısa t\xfcyl\xfc kediler:** Haftada 1-2 kez tarama yeterlidir.
**Uzun t\xfcyl\xfc kediler:** G\xfcnl\xfck tarama gereklidir; aksi halde ke\xe7eleşme ka\xe7ınılmazdır.
**Yoğun d\xf6kme d\xf6nemlerinde:** Kısa t\xfcyl\xfc kediler bile g\xfcnl\xfck taramadan fayda g\xf6r\xfcr.

T\xfcy tarağı se\xe7imi de \xf6nemlidir. Metal dişli ince taraklar \xf6l\xfc t\xfcyleri almak i\xe7in idealdir. Silikon kaplamalı taraklar ise deriye masaj yaparak kan dolaşımını artırır.

## Beslenme ile T\xfcy Sağlığı

T\xfcy kalitesini artırmanın en etkili yolu beslenmedir.

- Omega-3 ve Omega-6 yağ asitleri zengin mamalar tercih edin
- Balık yağı takviyesi veteriner onayıyla eklenebilir
- Kaliteli protein kaynakları t\xfcy g\xfc\xe7lendirici etkiye sahiptir
- Bol su i\xe7mek de t\xfcy sağlığını destekler

## Ev Temizliği İ\xe7in \xd6neriler

T\xfcy d\xf6kme d\xf6nemlerinde evinizi temiz tutmak i\xe7in:

- HEPA filtreli elektrikli s\xfcp\xfcrge kullanın
- Mobilyaları mikrofiber bezle silin
- Kedi yatağını haftada bir yıkayın
- Hava filtreli fanlar veya hava temizleyiciler d\xfcş\xfcn\xfcn

## T\xfcy Yumağı (Bezoar) Sorunu

Kediler t\xfcy bakımı yaparken (grooming) \xf6nemli miktarda t\xfcy yutarlar. Bu t\xfcyler midede birikip t\xfcy yumağı oluşturabilir. Haftalık t\xfcy yumağı \xf6nleyici macunlar ve tarama bu riski azaltır.
  `,"mikrocip-neden-zorunlu":`
Her yıl binlerce evcil kedi ve k\xf6pek kaybolmakta ya da \xe7alınmaktadır. Bunların b\xfcy\xfck \xe7oğunluğu sahiplerine bir daha kavuşamamaktadır; \xe7\xfcnk\xfc kimlikleri belirlenemez. Mikro\xe7ip, bu trajedileri \xf6nlemenin en etkili yoludur.

## Mikro\xe7ip Nedir?

Mikro\xe7ip, yaklaşık bir pirin\xe7 tanesi b\xfcy\xfckl\xfcğ\xfcnde (2x12 mm), radyo frekansıyla \xe7alışan pasif bir elektronik etikettir. İ\xe7inde 15 haneli benzersiz bir kod bulunur. Bu kod, ulusal veri tabanına kayıtlı sahip bilgileriyle eşleştirilir.

Mikro\xe7ipin kendi pil veya enerji kaynağı yoktur; yalnızca okuyucu cihaz yakına geldiğinde aktif hale gelir.

## Nasıl Takılır?

Mikro\xe7ip, enjekt\xf6r yardımıyla hayvanın k\xfcrek kemikleri arasındaki deri altına yerleştirilir. İşlem birka\xe7 saniye s\xfcrer ve standart bir aşı kadar acı verir. Genel anestezi gerektirmez.

İmplante edilen \xe7ip kaybolmaz, \xe7alışmaz hale gelmez ve yaşam boyu aynı yerde kalır.

## T\xfcrkiye'de Mikro\xe7ip Zorunluluğu

T\xfcrkiye'de 5199 sayılı Hayvanları Koruma Kanunu kapsamında k\xf6pek ve kedilerin mikro\xe7iplenmesi zorunludur. Mikro\xe7ipsiz hayvanla yakalanmak idari para cezasına neden olabilir. Ayrıca yurt dışına \xe7ıkarılacak evcil hayvanlar i\xe7in ISO standartlı (15 haneli) mikro\xe7ip zorunludur.

## Mikro\xe7ip Kaybolan Hayvanı Nasıl Bulduruyor?

Barınaklar, veteriner klinikleri ve belediye ekipleri okuyucu cihazlara sahiptir. Bulunan ya da getirilen her hayvan taranır. Eşleşen kod varsa veri tabanından sahip bilgilerine ulaşılır ve iletişim kurulur.

Bu nedenle mikro\xe7ip taktırdıktan sonra iletişim bilgilerinizi g\xfcncel tutmanız kritik \xf6nem taşır.

## Mikro\xe7ip, Tasma Yerine Ge\xe7er Mi?

Hayır. Tasma ve kimlik kolye dışarıdan g\xf6r\xfcl\xfcr ve anında bilgi verir. Mikro\xe7ip ise okuyucu cihaz olmadan okunamaz. İkisi birbirini tamamlar; birinin diğerinin yerini alması beklenmemelidir.

## Kayıp Durumunda Ne Yapmalı?

1. Hemen yakın \xe7evreyi arayın; kaybolduktan ilk 24 saat kritiktir
2. B\xf6lgedeki t\xfcm veteriner kliniklerine ve barınaklara haber verin
3. Sosyal medyada ve Patıpetra kayıp ilanı b\xf6l\xfcm\xfcnde ilan verin
4. Belediye zabıtası ve sokak hayvanları birimlerine bildirim yapın
5. Mikro\xe7ip kayıt firmanıza da durumu bildirin
  `,"dogru-veteriner-nasil-secilir":`
Evcil hayvanınız i\xe7in doğru veterineri bulmak, sağlıklı ve uzun bir ilişkinin temelidir. İyi bir veteriner yalnızca hastalıkları tedavi etmez; koruyucu sağlık hizmetleri sunar, sorularınızı sabırla yanıtlar ve hayvanınızla sağlıklı bir ilişki kurar.

## 1. Uzmanlık Alanını Kontrol Edin

Her veteriner her hayvan t\xfcr\xfcnde uzman değildir. K\xf6pek ve kedi klinikleri en yaygın olsa da egzotik hayvanlar (tavşan, papağan, hamster, s\xfcr\xfcngen) i\xe7in \xf6zel veteriner arayışına girmeniz gerekebilir.

Veterinerin hangi konularda daha deneyimli olduğunu sormaktan \xe7ekinmeyin: Diş sağlığı, ortopedi, dermatoloji, onkoloji gibi alanlarda ek eğitim almış veterinerler de bulunmaktadır.

## 2. Klinikteki Ekipmanlar

Modern bir veteriner kliniği şu ekipmanlara sahip olmalıdır:
- Dijital r\xf6ntgen cihazı
- Ultrason cihazı
- Kan tahlil laboratuvarı (ya da hızlı sonu\xe7 i\xe7in anlaşmalı lab)
- Steril ameliyathane
- Yatış \xfcnitesi

Bu ekipmanların varlığı hem teşhis kalitesini artırır hem de acil durumlarda kıymetli zaman kazandırır.

## 3. İletişim Kalitesi

İyi bir veteriner:
- Tanıyı ve tedaviyi anlaşılır bir dille a\xe7ıklar
- Alternatif tedavi se\xe7eneklerini sunar
- Maliyet konusunda \xf6nceden şeffaf bilgi verir
- Sorularınıza sabırla yanıt verir

Veteriner muayene sırasında s\xfcrekli ekrana bakıyor, sizi dinlemiyor ya da sorularınıza cevap vermekten ka\xe7ınıyorsa bu iyi bir işaret değildir.

## 4. Temizlik ve Hijyen

Kliniğin genel temizliği sağlık g\xfcvencesinin g\xf6rsel bir yansımasıdır. Y\xfczeylerin temiz olması, keskin koku bulunmaması ve kullanılan ekipmanların steril g\xf6r\xfcnmesi dikkat edilmesi gereken noktalardır.

## 5. Acil Durumlarda Ulaşılabilirlik

Evcil hayvanlar her zaman mesai saatlerinde hastalanmaz. Kliniğin n\xf6bet uygulaması var mı ya da acil durumlarda y\xf6nlendirebilecekleri bir klinikle anlaşmaları mevcut mu? Bunu \xf6nceden \xf6ğrenin.

## 6. Fiyat Şeffaflığı

Muayene, aşı ve temel işlemler i\xe7in yaklaşık \xfccretleri \xf6nceden sorabilirsiniz. Şeffaf fiyatlandırma yapan klinikler, g\xfcvenilirlik a\xe7ısından olumlu bir işarettir.

## 7. Hayvanınızın Tepkisi

Hayvanınız veterinere gitmeyi tamamen reddetmesi, klinikte aşırı panik yaşaması ya da muayene sırasında veterinere karşı olağandışı saldırgan davranması bir işaret olabilir. Ancak bu bazen hayvandan kaynaklanıyor da olabilir; bu nedenle sıklıkla yaşanıyorsa değerlendirmeye alın.

## 8. Tavsiyeler ve Yorumlar

\xc7evrenizden aldığınız tavsiyeler h\xe2l\xe2 en g\xfcvenilir bilgi kaynaklarından biridir. Patıpetra \xfczerinden de doğrulanmış veterinerler i\xe7in yorumları inceleyebilirsiniz.

## İlk Muayeneyi Deneme Fırsatı Olarak G\xf6r\xfcn

İlk muayeneden sonra kendinize şu soruları sorun:
- Kendimi iyi dinlenilmiş hissettim mi?
- Tanı anlaşılır bi\xe7imde a\xe7ıklandı mı?
- Fiyatlar makul m\xfcydi?
- Kliniğe g\xfcvenebildim mi?

Yanıtlar olumlu değilse farklı bir veteriner denemekten \xe7ekinmeyin. Evcil hayvanınızın sağlığı en doğru tercih hakkını hak eder.
  `};async function o({params:e}){let a=d.find(a=>a.slug===e.slug);return a?{title:`${a.title} — Patıpetra Blog`,description:a.excerpt,keywords:[a.cat,"evcil hayvan","pet bakım","patipetra"],openGraph:{title:a.title,description:a.excerpt,images:[{url:a.img}],type:"article"}}:{title:"Makale Bulunamadı"}}function m(){return d.map(e=>({slug:e.slug}))}function x({params:e}){let a=d.find(a=>a.slug===e.slug),i=k[e.slug];a||(0,l.notFound)();let o=d.filter(i=>i.slug!==e.slug&&i.cat===a.cat).slice(0,2);return(0,r.jsxs)(r.Fragment,{children:[r.jsx(n.ZP,{}),(0,r.jsxs)("main",{className:"min-h-screen bg-[#F7F2EA] pb-20 lg:pb-0",children:[(0,r.jsxs)("div",{className:"h-[300px] lg:h-[420px] relative overflow-hidden",children:[r.jsx("img",{src:a.img,alt:a.title,className:"w-full h-full object-cover"}),r.jsx("div",{className:"absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"}),r.jsx("div",{className:"absolute top-[84px] left-4 sm:left-8",children:r.jsx(s.default,{href:"/blog",className:"text-sm text-white/70 hover:text-white transition-colors",children:"← Blog'a D\xf6n"})})]}),r.jsx("div",{className:"max-w-[1100px] mx-auto px-4 sm:px-8 py-10",children:(0,r.jsxs)("div",{className:"grid lg:grid-cols-[1fr_.32fr] gap-10",children:[(0,r.jsxs)("article",{children:[(0,r.jsxs)("div",{className:"mb-8",children:[r.jsx("span",{className:"inline-block text-[10px] font-semibold tracking-[.1em] uppercase text-[#C9832E] bg-[rgba(201,131,46,.1)] px-3 py-1 rounded-full mb-3",children:a.cat}),r.jsx("h1",{className:"font-serif text-[clamp(26px,4vw,42px)] font-semibold text-[#2F2622] mb-4 leading-tight",children:a.title}),(0,r.jsxs)("div",{className:"flex flex-wrap items-center gap-4 text-sm text-[#9A9188]",children:[r.jsx("span",{children:"✍️ Patıpetra Edit\xf6r\xfc"}),(0,r.jsxs)("span",{children:["\uD83D\uDCC5 ",a.date]}),(0,r.jsxs)("span",{children:["⏱ ",a.readTime," dakika okuma"]})]})]}),r.jsx("div",{className:"bg-[#F4EBDD] border-l-4 border-[#C9832E] rounded-r-[16px] px-5 py-4 mb-8",children:r.jsx("p",{className:"text-[15px] font-medium text-[#5C4A32] leading-relaxed italic",children:a.excerpt})}),r.jsx("div",{className:"prose max-w-none text-[15px]",children:i?i.trim().split("\n").map((e,a)=>{if(e.startsWith("## "))return r.jsx("h2",{className:"font-serif text-[clamp(20px,2.5vw,26px)] font-semibold text-[#2F2622] mt-8 mb-4",children:e.slice(3)},a);if(e.startsWith("**")&&e.endsWith("**"))return r.jsx("p",{className:"font-semibold text-[#2F2622] mb-2",children:e.slice(2,-2)},a);if(e.startsWith("- "))return r.jsx("li",{className:"ml-5 mb-1 list-disc text-[#5C4A32]",children:e.slice(2)},a);if(""===e.trim())return null;let i=e.split(/\*\*(.*?)\*\*/g);return r.jsx("p",{className:"mb-4 leading-[1.95] text-[#5C4A32]",children:i.map((e,a)=>a%2==0?e:r.jsx("strong",{className:"font-semibold text-[#2F2622]",children:e},a))},a)}):r.jsx("p",{className:"text-[#7A7368]",children:"Bu makale yakında eklenecek."})}),r.jsx("div",{className:"mt-8 pt-6 border-t border-[#E3D9C6]",children:r.jsx("div",{className:"flex flex-wrap gap-2",children:[a.cat,"evcil hayvan","pet bakım","patipetra"].map(e=>(0,r.jsxs)("span",{className:"text-xs bg-[#EDE5D3] text-[#6E5A40] px-3 py-1 rounded-full",children:["#",e]},e))})}),o.length>0&&(0,r.jsxs)("div",{className:"mt-10",children:[r.jsx("h3",{className:"font-serif text-xl font-semibold text-[#2F2622] mb-4",children:"İlgili Makaleler"}),r.jsx("div",{className:"grid sm:grid-cols-2 gap-4",children:o.map(e=>(0,r.jsxs)(s.default,{href:`/blog/${e.slug}`,className:"bg-white rounded-[16px] border border-[rgba(196,169,107,.12)] p-4 hover:shadow-md hover:-translate-y-1 transition-all flex gap-3",children:[r.jsx("div",{className:"w-16 h-16 rounded-[10px] overflow-hidden flex-shrink-0",children:r.jsx("img",{src:e.img,alt:e.title,className:"w-full h-full object-cover"})}),(0,r.jsxs)("div",{className:"flex-1 min-w-0",children:[r.jsx("div",{className:"text-xs text-[#C9832E] mb-1",children:e.cat}),r.jsx("div",{className:"text-sm font-semibold text-[#2F2622] leading-tight line-clamp-2",children:e.title}),(0,r.jsxs)("div",{className:"text-[11px] text-[#9A9188] mt-1",children:[e.readTime," dk"]})]})]},e.slug))})]})]}),r.jsx("aside",{className:"hidden lg:block",children:(0,r.jsxs)("div",{className:"sticky top-[84px] space-y-4",children:[(0,r.jsxs)("div",{className:"bg-white rounded-[16px] border border-[rgba(196,169,107,.12)] p-5",children:[r.jsx("h3",{className:"font-serif text-base font-semibold text-[#2F2622] mb-3",children:"\uD83D\uDCCB Hızlı Erişim"}),r.jsx("div",{className:"space-y-2",children:i&&i.split("\n").filter(e=>e.startsWith("## ")).map((e,a)=>r.jsx("div",{className:"text-xs text-[#7A7368] hover:text-[#C9832E] transition-colors cursor-pointer py-1 border-b border-[#F7F2EA] last:border-0",children:e.slice(3)},a))})]}),(0,r.jsxs)("div",{className:"bg-[#5C4A32] rounded-[16px] p-5 text-white",children:[r.jsx("div",{className:"text-2xl mb-2",children:"\uD83D\uDC3E"}),r.jsx("h3",{className:"font-serif text-base font-semibold mb-2",children:"Pet Pasaport Oluşturun"}),r.jsx("p",{className:"text-xs text-white/60 leading-relaxed mb-4",children:"Petinizin t\xfcm sağlık bilgilerini dijital ortamda y\xf6netin."}),r.jsx(s.default,{href:"/panel/petlerim",className:"block w-full text-center bg-[#C9832E] text-white text-xs font-semibold py-2 rounded-full hover:bg-[#b87523] transition-colors",children:"Hemen Başla →"})]}),(0,r.jsxs)("div",{className:"bg-white rounded-[16px] border border-[rgba(196,169,107,.12)] p-5",children:[r.jsx("h3",{className:"font-serif text-base font-semibold text-[#2F2622] mb-3",children:"Son Makaleler"}),r.jsx("div",{className:"space-y-3",children:d.filter(a=>a.slug!==e.slug).slice(0,4).map(e=>(0,r.jsxs)(s.default,{href:`/blog/${e.slug}`,className:"flex gap-2 hover:opacity-75 transition-opacity",children:[r.jsx("div",{className:"w-10 h-10 rounded-[8px] overflow-hidden flex-shrink-0",children:r.jsx("img",{src:e.img,alt:"",className:"w-full h-full object-cover"})}),(0,r.jsxs)("div",{children:[r.jsx("div",{className:"text-xs font-medium text-[#2F2622] leading-tight line-clamp-2",children:e.title}),(0,r.jsxs)("div",{className:"text-[10px] text-[#9A9188] mt-1",children:[e.readTime," dk"]})]})]},e.slug))})]})]})})]})})]}),r.jsx(t.ZP,{})]})}},84869:(e,a,i)=>{"use strict";i.d(a,{ZP:()=>s});var r=i(68570);let l=(0,r.createProxy)(String.raw`/workspaces/PatiPetra/src/components/layout/Footer.tsx`),{__esModule:n,$$typeof:t}=l;l.default;let s=(0,r.createProxy)(String.raw`/workspaces/PatiPetra/src/components/layout/Footer.tsx#default`)}};var a=require("../../../webpack-runtime.js");a.C(e);var i=e=>a(a.s=e),r=a.X(0,[948,145,808],()=>i(67149));module.exports=r})();