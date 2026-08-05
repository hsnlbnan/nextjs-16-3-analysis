import type { Dictionary } from "@/lib/dictionaries/en";

export const tr: Dictionary = {
  meta: {
    title: "Instant Lab — Next.js 16.3 render modeli, gerçek ölçümlerle",
    description:
      "Suspense, Partial Prerendering, Cache Components ve Partial Prefetching; çalışan route’lar ve doğrudan stream’den alınan zamanlamalarla. Streaming simüle edilmez.",
  },
  nav: {
    home: "Genel bakış",
    suspense: "Suspense",
    waterfall: "Waterfall",
    cache: "Cache",
    prefetch: "Prefetch",
    migration: "Geçiş",
    repo: "Kaynak kod",
  },
  home: {
    eyebrow: "Next.js 16.3",
    title: "Render modeli, gerçek ölçümlerle.",
    lede: "Tek bir route artık prerender edilmiş static shell’i hemen sunarken request sırasında üretilen bölgeleri aynı yanıt içinde daha sonra stream edebiliyor. Bu sitedeki her zamanlama çalışan bir route’tan geliyor; marker’lar ilgili chunk tarayıcıya ulaştığı anda okunuyor.",
    method: {
      title: "Zamanlamalar nasıl ölçülüyor",
      body: "Her demo route, RSC stream’ine inline script marker’ları ekliyor: biri static shell’de, diğeri async bölgenin chunk’ında. Marker, ait olduğu chunk tarayıcıya ulaştığında, hydration başlamadan ve React client-side çalışmadan önce tetikleniyor. Bu nedenle ölçüm render’ın tamamlanmasını değil, byte’ların gelişini gösteriyor. Farkı normal hızda görünür kılmak için sunucuda gecikme ekleniyor; streaming davranışı simüle edilmiyor.",
    },
    chaptersTitle: "Beş bölüm",
    start: "Suspense ile başla",
    chapters: {
      suspense: {
        title: "Hangi UI’ın bekleyeceğini Suspense boundary belirler",
        body: "Aynı sayfa, iki route. Biri veriyi page seviyesinde await ediyor; diğeri async bölgeyi bir Suspense boundary içine alıyor. Static shell’in ne zaman geldiğini karşılaştır.",
      },
      waterfall: {
        title: "Suspense boundary sorguları hızlandırmaz",
        body: "Aynı boundary, farklı async akış. Sequential sorguların süreleri toplanır; parallel başlatılan sorgularda toplam süreyi çoğunlukla en yavaş işlem belirler.",
      },
      cache: {
        title: "Route’u değil, veriyi cache’e alırsın",
        body: "use cache, cacheLife ve cache’e alınan içeriğin prerender ile App Shell’e girip girmeyeceğini belirleyen eşikler.",
      },
      prefetch: {
        title: "Route başına tek App Shell, tüm link’ler için ortak",
        body: "Partial Prefetching açıkken bir <Link>’in ne indirdiğini gerçek fetch request’leri ve transfer edilen byte’larla ölç.",
      },
      migration: {
        title: "Statik, dinamik ve partial render",
        body: "Next.js 16’da ne değiştiğini, geçişte nelerin gözden kaçtığını ve bu uygulamanın gerçek build çıktısını incele.",
      },
    },
  },
  suspense: {
    eyebrow: "Suspense",
    title: "Hangi UI’ın bekleyeceğini Suspense boundary belirler.",
    lede: "Suspense boundary, async işlem tamamlanana kadar hangi fallback’in gösterileceğini ve hangi bölgenin bağımsız stream edileceğini belirler. Boundary dışında olup henüz tamamlanmamış async işlem tarafından bloklanmayan UI ilk yanıtta gönderilebilir. Bu React primitive’i, streaming ve Partial Prerendering modelinin temel parçalarından biridir.",
    demo: {
      title: "İki route, tek yapısal fark",
      lede: "İki route da aynı dashboard’u aynı sorgu ve aynı sunucu gecikmesiyle render ediyor. Yalnızca verinin nerede await edildiği değişiyor. İkisini çalıştır ve static shell’in ne zaman geldiğini karşılaştır.",
      blocking: {
        title: "Page seviyesinde await",
        caption:
          "Page, markup döndürmeden önce veriyi await ediyor. Üst bar, başlık ve filtreler sorgu sonucunu kullanmadığı hâlde aynı await tarafından bloklanıyor.",
      },
      streaming: {
        title: "Suspense boundary içinde",
        caption:
          "Static shell ilk yanıtta gönderiliyor; tablo, layout’un önceden ayırdığı alana daha sonra stream ediliyor. Fallback ile içerik aynı alanı kullandığı için satırlar geldiğinde layout kaymıyor.",
      },
    },
    code: {
      title: "Tek fark bu",
      blockingCaption: "Page seviyesindeki tek await, tüm markup’ı bekletiyor.",
      streamingCaption:
        "Promise hemen başlatılıyor, aşağı aktarılıyor ve yalnızca veriye ihtiyaç duyan bölge içinde await ediliyor.",
      note: "Okunabilirlik için timing marker’ları snippet’lerden çıkarıldı. Her blok gerçek dosyanın adını gösteriyor; demo panelindeki link ile çalışan route’u doğrudan açıp stream edilen HTML’i inceleyebilirsin.",
    },
    reading: {
      title: "Ölçüm ne gösteriyor",
      body1:
        "Blocking route’ta üç marker yaklaşık aynı anda geliyor. Bunun nedeni ölçüm yuvarlaması değil: sunucu sorgu tamamlanana kadar yanıtı başlatamıyor; dolayısıyla shell, veri ve load olayı birbirine yakın zamanlarda görülüyor. Header çok daha erken hazırlanabilecek olsa da page seviyesindeki await onu da bekletiyor.",
      body2:
        "Streaming route’ta shell marker’ı önce, data marker’ı ise ayarladığın gecikmeye yakın bir zamanda tetikleniyor. Sorgunun tamamlanma süresi değişmiyor; değişen, kullanıcının bu süre boyunca boş bir yanıt yerine hazır UI ve tablonun fallback’ini görebilmesi.",
      body3:
        "Tamamlanma sürelerinin birbirine yakın kalması önemli: Suspense boundary sorguyu hızlandırmıyor. Sorgu çalışırken hangi UI’ın hazır olduğunu ve async içeriğin hangi bölgeye stream edileceğini belirliyor. Sonraki bölüm, sorguların kendi çalışma süresine odaklanıyor.",
    },
    placement: {
      title: "Boundary’yi veriye ihtiyaç duyan bölgeye yaklaştır",
      body1:
        "Tüm page’i saran tek bir Suspense boundary teknik olarak geçerli olabilir; ancak her navigation’da büyük bir UI bölümünü tek fallback ile değiştirebilir. Boundary’yi async veriyi gerçekten kullanan component’e yaklaştırmak, daha fazla gerçek UI’ın hazır kalmasını sağlar.",
      body2:
        "Asıl soru “Suspense boundary’yi nereye koymalıyım?” değil, “Bu page’in hangi component’leri gerçekten request-time veriye bağlı?” olmalı. Yalnızca iki link arasında seçim yapmak için session bekleyen layout’lar, tek bir ad göstermek için büyük bir nesne alan header’lar ve satırlar gelmeden kendi kolonlarını render edebilen tablolar bu ayrımı görünür kılar.",
      body3:
        "use cache direktifini eklemek kolaydır; asıl tasarım kararı, verinin nerede okunacağı ve Suspense boundary’nin hangi UI’ı kapsayacağıdır.",
    },
    shell: {
      title: "Static shell bir loading state değildir",
      body: "Skeleton, henüz hazır olmayan içeriğin geçici fallback’idir. Static shell ise navigation, heading, tablo kolonları, empty state ve filtreler gibi request-time veriye bağlı olmayan gerçek UI’dan oluşur. Shell’i yalnızca loading screen gibi tasarlarsan, kullanıcı veri beklerken hazır olabilecek içeriği de gereksiz yere gizlersin.",
    },
  },
  waterfall: {
    eyebrow: "Waterfall",
    title: "Suspense boundary sorguları hızlandırmaz.",
    lede: "Aşağıdaki iki route aynı Suspense boundary’yi, fallback’i ve layout’u kullanıyor. Değişen yalnızca async işlerin ne zaman başlatıldığı. Bu nedenle shell timing’leri yakınken completion timing’leri belirgin biçimde ayrılıyor.",
    demo: {
      title: "Aynı boundary, farklı async akış",
      lede: "İki sorgu, tek bölge ve tek Suspense boundary. Solda ikinci sorgu ilk await tamamlandıktan sonra başlıyor; sağda ikisi birlikte başlatılıyor. Bu karşılaştırmada tamamlanma timing’ine odaklan.",
      sequential: {
        title: "Sequential await",
        caption:
          "İkinci sorgu, ilk sorgu tamamlanmadan başlamıyor. Bölgenin bekleme süresi yaklaşık olarak iki sorgunun toplamına çıkıyor.",
      },
      parallel: {
        title: "Parallel başlatıldı",
        caption:
          "İki sorgu da herhangi biri await edilmeden önce başlatılıyor. Toplam süreyi çoğunlukla daha yavaş tamamlanan sorgu belirliyor.",
      },
    },
    code: {
      title: "Tek fark bu",
      sequentialCaption: "İkinci request, ilk request tamamlandıktan sonra başlıyor.",
      parallelCaption: "Aynı iki request eşzamanlı olarak devam ediyor.",
    },
    reading: {
      title: "Ölçüm ne gösteriyor",
      body1:
        "Shell timing’leri birbirine yakın; çünkü Suspense boundary iki route’ta da aynı yerde. Değişen, async bölgenin veriyi aldığı ve final içeriği stream ettiği an.",
      body2:
        "Bu yüzden yalnızca “Suspense boundary ekle” demek performans çalışmasının yarısını açıklar. Boundary, sorgular sürerken gösterilecek UI’ı belirler; sorguların çalışma süresini değiştirmez. Sequential waterfall’ı bir fallback arkasına taşımak bekleme süresini azaltmaz, yalnızca bekleme deneyimini değiştirir.",
    },
    independent: {
      title: "Sibling Suspense boundary’ler bağımsız tamamlanır",
      lede: "Tek route içinde iki bölge ve farklı süren iki sorgu var. Her bölge kendi Suspense boundary’sinde olduğu için hazır olan içerik diğer sorguyu beklemeden stream edilebilir.",
      paneTitle: "İki boundary, tek route",
      caption:
        "İstatistikler önce, tablo daha sonra geliyor. Her boundary yalnızca kendi verisi hazır olduğunda fallback’ini final içerikle değiştiriyor.",
      codeCaption: "İki async bölge, iki bağımsız Suspense boundary.",
      body: "İki bölgeyi tek boundary içinde toplarsan hızlı sorgunun sonucu, yavaş sorgu tamamlanana kadar aynı fallback arkasında kalır. Ayrı boundary’ler ise her bölgenin hazır olduğunda bağımsız stream edilmesini sağlar. Boundary sayısını component yapısına ve kullanıcıya anlamlı bir fallback gösterebileceğin noktalara göre seçmelisin.",
    },
    phases: {
      stats: "İstatistikler geldi",
      table: "Tablo geldi",
    },
  },
  cache: {
    eyebrow: "Cache Components",
    title: "Route’u değil, veriyi cache’e alırsın.",
    lede: "Cache Components açıkken veri erişimi varsayılan olarak request sırasında çalışır; use cache direktifiyle yalnızca tekrar kullanılmasını istediğin function veya component’leri cache’e alırsın. Bu config aynı zamanda Partial Prerendering’i App Router’ın varsayılan davranışı yapar. Bu nedenle experimental.ppr flag’i ve experimental_ppr segment config’i Next.js 16’da kaldırıldı.",
    inversion: {
      title: "Model tersine döndü",
      body1:
        "Önceki varsayılan modelde bir route’un prerender edilip edilmeyeceği route seviyesinde belirleniyordu. Bir layout içinde “Giriş yap” ile “Panel” arasında seçim yapmak için cookie okumak, altındaki statik üretilebilen içeriğin de request sırasında render edilmesine yol açabiliyordu. Bu nedenle birçok uygulama route group’larını bütünüyle force-dynamic işaretliyordu.",
      body2:
        "Cache Components bu tercihi veri seviyesine taşır. Cache’e almadığın işlemler request sırasında çalışır; tekrar kullanılabilecek function veya component’leri use cache ile açıkça işaretlersin. Böylece aynı route prerender edilmiş bir static shell sunarken kullanıcıya özel bölgeleri request sırasında render edebilir.",
      body3:
        "İki modelin hata riski aynı değildir. Kullanıcıya özel veriyi yanlışlıkla ortak cache’e almak veri izolasyonunu ve güvenliği etkileyebilir. Cache’e alınabilecek bir sorguyu request sırasında çalıştırmak ise genellikle performans kaybına neden olur. Bu yüzden Cache Components, belirsiz veriyi önce request sırasında tutup cache kararını açıkça vermeni ister.",
    },
    explorer: {
      title: "Üç süre, iki teslim kararı",
      lede: "Bir cache profili stale, revalidate ve expire sürelerinden oluşur. Bu değerler yalnızca cache’in ne zaman yenileneceğini değil, içeriğin prerender’a ve App Shell’e dahil edilip edilmeyeceğini de belirler. Bir profil seç ve sonucu incele.",
      copy: {
        fields: {
          stale: {
            label: "stale",
            body: "İstemcinin sunucuya request göndermeden cache’teki kopyayı kullanabildiği süre.",
          },
          revalidate: {
            label: "revalidate",
            body: "Bu süre dolduktan sonraki request’in background refresh başlattığı eşik.",
          },
          expire: {
            label: "expire",
            body: "Trafik olmadığında süre dolarsa sonraki request’in güncel içeriği beklediği eşik.",
          },
        },
        requestAt: "Request şu kadar sonra geliyor:",
        client: "İstemci",
        server: "Sunucu",
        outcomes: {
          clientCache:
            "Sunucuya request gitmez; istemci hâlâ stale süresi içindedir.",
          serverCache: "Cache’teki değer doğrudan döndürülür.",
          staleRefresh:
            "Cache’teki değer döndürülür, güncel değer arka planda üretilir.",
          blocking: "Cache kaydı expire oldu; bu request güncel değerin üretilmesini bekler.",
        },
        clientReuse: "İstemci, sunucuya request göndermeden cache’teki kopyayı kullanır.",
        clientCheck: "Stale süresi dolduğu için istemci sunucuyu kontrol eder.",
        verdict: {
          title: "Prerendering",
          prerendered: "Prerender’a dahil edilir",
          notPrerendered: "Prerender’a dahil edilmez — request sırasında çözülür",
          inShell: "App Shell’e dahil edilir",
          notInShell:
            "App Shell’e dahil edilmez — navigation sonrasında stream edilir",
          reasons: {
            revalidateZero:
              "revalidate değerinin 0 olması cache’teki verinin yeniden kullanılabileceği bir süre bırakmaz. Bölge request sırasında çözülür.",
            expireTooShort:
              "5 dakikadan kısa expire süresi içeriği prerender’ın dışında bırakır; bölge request sırasında çözülür. Built-in profillerden yalnızca seconds bu eşiğin altındadır.",
            staleTooShort:
              "30 saniyeden kısa stale süresi içeriği prerender’ın dışında bırakır; aksi durumda prefetched data kullanıcı link’e tıklamadan önce geçerliliğini yitirebilir.",
            staleUnderShellMinimum:
              "İçerik prerender edilir; ancak 5 dakikadan kısa stale süresi nedeniyle route’un App Shell’ine girmez. Client navigation sonrasında ayrıca stream edilir.",
            included:
              "İçerik hem prerender’a hem App Shell’e dahil edilir; client navigation sırasında hazır olabilir.",
          },
        },
        customBadge: "özel",
      },
    },
    live: {
      title: "Cache invalidation’ını canlı izle",
      lede: "Bu gerçek route, cache’te tutulan bir değer ile her request’te yeniden okunan bir değer gösteriyor. Cached timestamp yalnızca cache kaydı oluşturulduğunda yazılır ve ilgili tag invalidate edildiğinde değişir. Iframe içindeki iki action’ı çalıştırarak değerlerin ne zaman yenilendiğini karşılaştır.",
      paneTitle: "cacheTag kullanan use cache",
      caption:
        "updateTag cache kaydını hemen expire eder; action sonrasındaki render güncel timestamp’i gösterir. revalidateTag(tag, 'max') ise stale değeri döndürüp refresh’i arka planda başlatır; güncel timestamp sonraki render’lardan birinde görünür.",
    },
    code: {
      title: "Cache’e alınan fonksiyon",
      caption:
        "cacheLife ve cacheTag, cache’e alınan fonksiyonun gövdesinde ve use cache scope’u içinde çağrılır.",
    },
    serverless: {
      title: "Serverless ortamda cache kapsamı",
      body: "Varsayılan use cache store’u memory’de ve instance’a özeldir. Serverless deployment’ta bir instance’ın oluşturduğu cache kaydı diğer instance tarafından görülmeyebilir; bu nedenle art arda gelen request’ler farklı cached timestamp gösterebilir. use cache: remote, destekleyen ve remote cache provider’ı yapılandırılmış platformlarda cache kaydını instance’lar arasında paylaşabilir. Bu demo, deployment farkını görünür kılmak için standart use cache direktifini kullanıyor.",
    },
  },
  prefetch: {
    eyebrow: "Partial Prefetching",
    title: "Route başına tek App Shell, tüm link’ler için ortak.",
    lede: "16.3 öncesinde bir link, loading.tsx fallback’ini veya prefetch={true} ile hedefin daha büyük bir payload’unu prefetch ediyordu. Partial Prefetching, route için yeniden kullanılabilen bir App Shell üretip aynı hedefe giden link’ler arasında paylaşır. Böylece aynı route’a giden çok sayıda link için ortak shell tekrar tekrar oluşturulmaz.",
    shells: {
      title: "Static shell ve App Shell aynı şey değildir",
      body1:
        "Aynı route’a doğrudan yapılan request ile client navigation aynı ilk payload’u kullanmaz. Doğrudan ziyarette tarayıcı prerender edilmiş static shell’i HTML olarak alabilir. Client navigation ise mevcut route ile hedef route’un paylaştığı layout’un altındaki RSC payload’unu günceller. Paylaşılan layout’un üstündeki Suspense boundary bu geçiş için yeniden render edilmez.",
      body2:
        "useSearchParams() bu iki akışta farklı davranabilir. Server render sırasında search params build time’da bilinmediği için component suspend olabilir. Client navigation sırasında router URL bilgisini zaten taşıdığından aynı değer senkron okunabilir. Bu nedenle aynı component soft navigation’da hemen görünürken doğrudan page load’da fallback gösterebilir.",
    },
    demo: {
      title: "Bir link hangi payload’u indiriyor",
      lede: "Bu mini store’da ürün navigation’ı shared layout içinde. Ürünler arasında geçiş yalnızca layout’un altındaki page’i güncelliyor. Bir link modu seç, frame’in prefetch request’lerini tamamlamasını bekle ve ardından bir ürüne tıkla.",
      copy: {
        modes: {
          auto: "<Link>",
          eager: "<Link prefetch>",
          off: "<Link prefetch={false}>",
        },
        modeHints: {
          auto: "Hedef route’un ortak App Shell’ini yükler. Partial Prefetching açıkken varsayılan davranış budur.",
          eager:
            "App Shell’e ek olarak link’e özel URL verisini runtime prefetching ile önceden çözer.",
          off: "Prefetch yapılmaz; hedef route’un payload’u tıklamadan sonra istenir.",
        },
        requests: "Fetch request sayısı",
        transferred: "Transfer boyutu",
        clickHint: "Bir ürüne tıkla",
        toProduct: "Tıklama → ürün adı hazır",
        toInventory: "Tıklama → stok hazır",
        devWarning:
          "Next.js development modunda prefetching’i devre dışı bırakır. Buradaki ölçümler çalışan route’tan gelir ancak production prefetch davranışını temsil etmez. Doğru karşılaştırma için pnpm build && pnpm start çalıştır veya deploy edilmiş siteyi aç.",
        reload: "Yeniden yükle",
        openRoute: "Route’u yeni sekmede aç",
        pending: "—",
      },
    },
    reading: {
      title: "Ölçüm ne gösteriyor",
      body1:
        "Prefetch kapalıyken hedef route için gereken network request’leri tıklamadan sonra başlar. Varsayılan <Link> kullanımında ortak App Shell istemcide hazır olabilir; shared store header ve product navigation yeniden render edilmez. Ancak ürün adı params’a bağlıdır. Route’un tüm URL varyasyonları aynı App Shell’i paylaştığı için URL’ye özel bu değer ortak shell’in parçası olamaz. Lookup’ı cache’e almak bu ayrımı değiştirmez.",
      body2:
        "prefetch={true}, link’i runtime prefetching’e dahil eder. Next.js hedef route’u ilgili params ile tıklamadan önce çalıştırıp cache’e alınabilen URL’ye bağlı içeriği çözebilir. Stok verisi bilerek cache’e alınmadığı için request sırasında kalır. Partial Prefetching request-time data maliyetini ortadan kaldırmaz; ortak UI’ın bu veri tarafından bloklanmasını önler.",
      body3:
        "Bu repo’nun e2e test suite’i iki davranışı da doğruluyor. İlk taslak, cache’e alınmış ürün adının varsayılan <Link> ile birlikte geldiğini varsayıyordu. Başarısız test bunun doğru olmadığını gösterdi: default prefetch ortak App Shell’i getirirken URL’ye özel ürün adı için runtime prefetching gerekiyor.",
    },
  },
  migration: {
    eyebrow: "Geçiş",
    title: "Statik, dinamik ve partial render.",
    lede: "Next.js 16, Suspense streaming’i ilk kez getirmedi. Değişen şey, prerender, request-time rendering ve cache kararlarının Cache Components ile aynı route içinde daha ayrıntılı biçimde bir araya gelmesidir.",
    modes: {
      title: "Next.js 16’da ne değişti",
      headers: {
        mode: "Mod",
        before: "Next.js 15 (varsayılan)",
        after: "Next.js 16",
      },
      rows: {
        static: {
          mode: "Statik",
          before:
            "Uygun route build sırasında prerender edilirdi. Cookie veya session gibi request-time access, route’un tamamını request-time render’a taşıyabilirdi.",
          after:
            "Statik UI build sırasında prerender edilir. Suspense boundary içindeki request-time access, diğer bölgeleri static shell’den çıkarmaz.",
        },
        dynamic: {
          mode: "Dinamik",
          before:
            "Route her request’te render edilirdi. Suspense streaming vardı; ancak route’un tamamı prerender cache’inin dışında kalırdı.",
          after:
            "Request-time data boundary içinde kalabilir; route’un geri kalanı prerender edilmiş shell’den sunulur.",
        },
        partial: {
          mode: "Partial",
          before:
            "Next.js 15’te experimental.ppr ile deneysel olarak vardı; varsayılan değildi.",
          after:
            "cacheComponents ile varsayılan modele dahildir. Static shell hemen sunulur; request-time bölgeler stream edilir.",
        },
      },
    },
    report: {
      title: "Bu uygulamanın gerçek build çıktısı",
      lede: "Aşağıdaki tablo temsili değil; repo’da çalıştırılan son next build çıktısından üretiliyor. /lab/blocking bilerek tamamen request-time kalırken diğer lab route’ları aynı build içinde statik veya partial olabilir. Böylece üç render modu ikinci bir uygulama olmadan karşılaştırılabilir.",
      copy: {
        kinds: { static: "statik", partial: "partial", dynamic: "dinamik" },
        kindHints: {
          static: "Build sırasında prerender edilir; request sırasında server render gerekmez.",
          partial:
            "Prerender edilmiş static shell hemen sunulur; request-time bölgeler stream edilir.",
          dynamic:
            "Her request’te sunucu tarafından render edilir. Bu repo’da karşılaştırma için bilerek prerender’ın dışında bırakılmıştır.",
        },
        route: "Route",
        revalidate: "Revalidate",
        expire: "Expire",
        generated: "Gerçek build çıktısından üretildi:",
        regenerate: "pnpm report:build",
      },
    },
    gotchas: {
      title: "Geçişte gözden kaçan beş davranış",
      lede: "Bu davranışların çoğu API signature’larından anlaşılmaz ve görünen hata, asıl problemi oluşturan component’ten farklı bir yerde raporlanabilir.",
      items: [
        {
          tag: "Cache Components",
          title: "Build başarılı olsa da navigation hâlâ bloklanabilir",
          body: "Request-time data’yı page seviyesinde bekleyen bir route geçerli biçimde build olabilir; ancak client navigation sırasında instant UI sunmayabilir. Build çıktısı bu UX farkını tek başına göstermez.",
          fix: "Route’ları next dev içinde Navigation Inspector ve dev overlay ile client navigation üzerinden denetle. Instant validation development modunda varsayılan olarak uyarı verir ve production build’i bloklamaz.",
        },
        {
          tag: "Suspense",
          title:
            "Suspense boundary dışındaki searchParams sorunu client navigation’da görünür olabilir",
          body: "Page seviyesinde await edilen searchParams doğrudan ziyarette sorunsuz görünebilir. Aynı route’a <Link> ile geçildiğinde instant validation, URL’ye bağlı async işlemin App Shell’i blokladığını raporlayabilir.",
          fix: "Yalnızca URL’leri doğrudan açmak yeterli değildir. Client navigation akışlarını test et ve await searchParams kullanım noktalarını kod tabanında denetle.",
        },
        {
          tag: "Cache Components",
          title: "Suspense, non-deterministic değerleri tek başına çözmez",
          body: "Date.now(), new Date() ve Math.random() aynı prerender’ın tekrarında farklı sonuç üretebilir. Cache Components bu değerleri otomatik olarak request-time bölgeye dönüştürmek yerine kullanım bağlamını açıkça belirtmeni ister.",
          fix: "Request’e özel değer için await connection(), belirli süre sabit kalacak değer için use cache ve cacheLife, browser-only değer için use client, timing ölçümü için performance.now() kullan.",
        },
        {
          tag: "Cache Components",
          title: "use cache kullanan fonksiyonu React cache() ile sarmalama",
          body: "Bu kombinasyon build sırasında “Invalid value used as weak map key” hatasına yol açabilir. Stack trace, problemi oluşturan loader yerine generateMetadata gibi çağıran bir API’yi gösterebilir.",
          fix: "React cache() wrapper’ını kaldır. use cache zaten sonucu request’ler arasında yeniden kullanacak cache scope’unu oluşturur.",
        },
        {
          tag: "Testing",
          title: "Playwright selector’ları hidden Activity içeriğiyle eşleşebilir",
          body: "Cache Components, navigation state’ini korumak için React <Activity> kullanır. Önceki route DOM’da mounted fakat hidden kalabildiğinden aynı selector navigation sonrasında birden fazla node ile eşleşebilir. page.click() görünmeyen ilk eşleşmeyi seçerse test timeout’a gider.",
          fix: "Locator’ları görünür container ile daralt veya uygun yerde :visible kullan. Server Action sonrasında DOM node sayısını değil, kullanıcıya görünen bölgeyi hedefle.",
        },
      ],
    },
    order: {
      title: "Önerilen geçiş sırası",
      body1:
        "Önce component tree’yi düzenle, sonra flag’i aç. Veri erişimini gerçekten kullanan component’e taşımak ve doğru Suspense boundary’leri eklemek, cacheComponents olmadan da streaming davranışını iyileştirebilir. Boundary yerleşimi çözülmeden flag’i açmak çok sayıda validation uyarısı üretir ancak temel component yapısını kendiliğinden düzeltmez.",
      body2:
        "Ardından partialPrefetching’i ayrı bir geçiş olarak ele al. Her <Link prefetch={true}> için hedef route’un URL’ye bağlı hangi içeriğini önceden çözmek istediğine karar ver. Daha küçük bir diff gerekiyorsa global flag kapalıyken export const prefetch = 'partial' ile route bazında ilerle; global flag’i açtıktan sonra remove-partial-prefetch codemod ile geçici export’ları kaldır.",
    },
  },
  lab: {
    cached: {
      cachedLabel: "Cache’teki değer",
      cachedHint: "Cache kaydı oluşturulurken yazılır.",
      liveLabel: "Request sırasında okunan değer",
      liveHint: "await connection() sonrasında her request için yeniden okunur.",
      profile: "profil",
      tag: "tag",
      updateHint: "Cache kaydını hemen expire eder; bu render güncel değeri gösterir.",
      revalidateHint: "Stale değeri döndürür, refresh’i arka planda başlatır.",
    },
    store: {
      pickOne: "Yukarıdaki navigation’dan bir ürün seç.",
      inStock: "Stok: {count}",
      checking: "Stok bilgisi yükleniyor…",
    },
  },
  common: {
    run: "Çalıştır",
    runBoth: "İkisini çalıştır",
    reset: "Sıfırla",
    running: "Çalışıyor…",
    latency: "Sunucu gecikmesi",
    openRoute: "Route’u yeni sekmede aç",
    shellPainted: "Static shell geldi",
    dataStreamed: "Async data geldi",
    complete: "Tamamlandı",
    waiting: "Route’u render etmek için Çalıştır’a bas.",
    honesty:
      "Her çalıştırmada iki panel de aynı anda ve aynı sunucuda gerçek route’ları render ediyor. Timing farkını görünür kılmak için sunucuda gecikme ekleniyor; streaming davranışı simüle edilmiyor. Yanıtı incelemek için demo route’unu yeni sekmede açabilirsin.",
  },
};
