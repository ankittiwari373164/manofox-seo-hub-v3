// ─── MANOFOX SEO KEYWORD ENGINE v4 ───────────────────────────────────────────
// Each page gets:
//   - 10 FIXED keywords (manually set, never auto-changed)
//   - 5 SHORT TAIL auto keywords (1-3 words, high volume)
//   - 5 LONG TAIL auto keywords (4-8 words, high intent)
//   - All fetched fresh from Google News per page per category
// Ecommerce has subcategories: fashion, electronics, grocery, furniture, beauty

// ─── PAGE-SPECIFIC FIXED KEYWORDS ────────────────────────────────────────────
// These are DEFAULT fixed keywords — user can override them from dashboard
// Stored in DB as fixedKeywords field

const DEFAULT_FIXED = {

    // ── EDUCATION ─────────────────────────────────────────────────────────────
    education: {
        home:     ['best coaching institute','online classes','top tutor','exam preparation','NEET JEE coaching','CBSE tuition','competitive exam','study material','affordable coaching','quality education'],
        about:    ['experienced teachers','qualified faculty','teaching excellence','best educators','academic success','trusted institute','years experience','best mentors','dedicated faculty','our mission'],
        contact:  ['admission enquiry','contact coaching','call for admission','coaching address','enroll now','free demo class','helpline number','online admission','registration open','get directions'],
        courses:  ['NEET coaching','JEE coaching','CBSE tuition','foundation course','IIT preparation','medical entrance','engineering entrance','class 10 12','online course','competitive course'],
        results:  ['coaching toppers','student success','rank holders','past results','100 percent results','NEET qualified','JEE rank','student achievements','merit list','board results'],
        blog:     ['study tips','exam strategy','how to score high','learning methods','student success guide','time management','best books NEET','education news','coaching tips','academic excellence'],
        services: ['online tutoring','offline coaching','doubt clearing','test series','mock test','personalized coaching','group classes','one on one','weekend coaching','crash course'],
        gallery:  ['institute photos','classroom gallery','student life','campus tour','facilities photos','lab photos','library photos','sports ground','student activities','institute events'],
        faculty:  ['our teachers','subject experts','experienced faculty','visiting faculty','faculty achievements','teacher qualifications','best professors','academic staff','teaching team','faculty list'],
        default:  ['education services','learning center','academic excellence','quality education','student success','coaching programs','educational institute','skill development','career guidance','top institute']
    },

    // ── ECOMMERCE — MAIN ──────────────────────────────────────────────────────
    ecommerce: {
        home:     ['online shopping','best deals','discount offers','free delivery','top brands','cash on delivery','easy returns','secure payment','best price','shop online'],
        shop:     ['all products','best sellers','new arrivals','trending products','sale items','top rated','budget products','premium products','product categories','browse products'],
        about:    ['trusted seller','customer satisfaction','genuine products','certified store','safe shopping','reliable delivery','customer first','authorized seller','our story','brand history'],
        contact:  ['customer support','order help','returns refund','helpline number','track my order','exchange request','delivery support','payment help','customer care','contact us'],
        cart:     ['shopping cart','secure checkout','coupon code','cart discount','multiple payment','UPI payment','EMI option','cod available','save for later','checkout now'],
        checkout: ['secure checkout','fast delivery','order confirmation','UPI net banking','COD available','order placed','safe payment','address verify','place order','payment gateway'],
        products: ['best products','product reviews','compare price','product specs','genuine products','affordable','quality checked','popular trending','limited stock','exclusive products'],
        wishlist: ['save products','wishlist items','saved for later','favourite products','buy later','product wishlist','share wishlist','wishlist deals','notify me','back in stock'],
        orders:   ['my orders','order history','track order','order status','order details','return order','cancel order','reorder items','invoice download','order support'],
        blog:     ['shopping tips','product reviews','deals guide','how to buy','best products list','sale guide','discount tips','online shopping guide','product comparison','buying guide'],
        default:  ['ecommerce','online shopping','buy online','best deals','fast delivery','secure shopping','top brands','discount sale','shop now','best store']
    },

    // ── ECOMMERCE SUBCATEGORIES ───────────────────────────────────────────────
    'ecommerce-fashion': {
        home:     ['fashion online India','buy clothes online','trendy outfits','latest fashion','designer wear','ethnic wear India','western wear','casual wear','party wear','fashion sale'],
        men:      ['mens clothing','mens fashion India','shirts trousers','mens ethnic wear','mens western','mens casual','mens formal wear','jeans tshirts','mens accessories','mens shoes'],
        women:    ['womens clothing','womens fashion India','sarees lehengas','kurtis salwar','western wear women','party dress','womens casual','ethnic collection','womens accessories','womens shoes'],
        kids:     ['kids clothing India','boys girls wear','kids fashion','school uniform','kids ethnic wear','kids casual wear','baby clothes','toddler clothing','kids shoes','kids accessories'],
        sale:     ['fashion sale India','clothes discount','end of season sale','upto 70 percent off','buy 1 get 1','flash sale fashion','clearance sale clothes','branded clothes sale','festival sale fashion','fashion offers today'],
        default:  ['fashion India','clothing online','buy clothes','trendy fashion','latest collection','ethnic western','fashion deals','affordable fashion','branded clothes','fashion store']
    },

    'ecommerce-electronics': {
        home:     ['electronics online India','buy gadgets','latest smartphones','best laptops','electronics deals','top brands electronics','mobile phones India','tech gadgets','electronic store','buy electronics'],
        mobile:   ['buy mobile phones','best smartphones India','android phones','5G phones India','budget smartphones','premium phones','phone under 15000','phone under 30000','latest mobile launch','mobile comparison'],
        laptop:   ['buy laptops India','best laptops 2026','gaming laptops','office laptops','budget laptops','laptop under 50000','MacBook India','Windows laptop','laptop deals','refurbished laptops'],
        tv:       ['buy smart TV India','best TV 2026','4K television','OLED TV India','LED TV deals','55 inch TV','smart TV under 30000','Android TV India','TV sale','best television brand'],
        audio:    ['wireless earbuds India','best headphones','bluetooth speakers','noise cancelling','TWS earbuds','gaming headset','earphones under 2000','premium audio India','sound bar','home theatre'],
        default:  ['electronics India','gadgets online','tech products','buy electronics','latest gadgets','electronic deals','top brands tech','best electronics','technology products','electronic store']
    },

    'ecommerce-grocery': {
        home:     ['grocery online India','buy groceries','fresh vegetables','online grocery store','daily essentials','grocery delivery','organic food India','grocery app','monthly grocery','supermarket online'],
        fresh:    ['fresh vegetables online','organic vegetables','farm fresh produce','daily vegetables','seasonal fruits','fresh fruits delivery','green vegetables','salad ingredients','exotic vegetables','local farm produce'],
        staples:  ['rice dal online','atta flour online','cooking oil India','sugar salt spices','pulses legumes','dry fruits online','packaged food','biscuits snacks','beverages India','dairy products'],
        default:  ['grocery India','online grocery','fresh food','daily essentials','grocery delivery','supermarket online','food products','household items','kitchen essentials','grocery store']
    },

    'ecommerce-beauty': {
        home:     ['beauty products online','skincare India','makeup online','cosmetics India','beauty store','grooming products','personal care','beauty deals','top beauty brands','beauty sale'],
        skincare: ['skincare products India','face wash','moisturizer India','sunscreen SPF','serum vitamin C','night cream','anti ageing cream','face mask India','toner cleanser','skincare routine'],
        makeup:   ['makeup products India','foundation India','lipstick online','kajal eyeliner','mascara India','eyeshadow palette','blush bronzer','setting powder','makeup kit','bridal makeup'],
        haircare: ['hair care products','shampoo conditioner','hair oil India','hair serum','hair mask treatment','anti dandruff','hair growth oil','keratin treatment','dry shampoo','hair color India'],
        default:  ['beauty India','cosmetics online','skincare products','makeup India','personal care','beauty deals','grooming India','beauty brands','beauty store','beauty essentials']
    },

    'ecommerce-furniture': {
        home:     ['furniture online India','buy furniture','home decor India','interior furniture','sofa set online','bed furniture','modular furniture','affordable furniture','branded furniture','furniture sale India'],
        living:   ['sofa set India','living room furniture','coffee table','TV unit stand','bookshelf online','recliner chair','corner sofa','fabric sofa','leather sofa','sectional sofa'],
        bedroom:  ['bed online India','king queen bed','wardrobe online','mattress India','dressing table','bedside table','storage bed','wooden bed','metal bed frame','bedroom set'],
        default:  ['furniture India','home furniture','buy furniture online','interior design','home decor','furniture deals','modular furniture','affordable furniture','furniture store','quality furniture']
    },

    // ── TECHNOLOGY ────────────────────────────────────────────────────────────
    technology: {
        home:     ['software development','IT services','app development','web development','digital transformation','cloud computing','AI ML development','custom software','tech startup','best IT company'],
        about:    ['experienced IT team','software engineers','tech company','IT experts','years IT experience','certified developers','agile development','innovative solutions','trusted IT partner','software company'],
        contact:  ['hire developers','IT project enquiry','free quote IT','tech consultation','custom development','software outsourcing','remote developers','IT support','project discussion','tech contact'],
        services: ['web development','mobile app','cloud solutions','AI ML','ERP software','CRM development','API integration','DevOps','UI UX design','blockchain development'],
        portfolio:['software projects','web app cases','mobile app portfolio','client success','tech projects','enterprise software','startup solutions','ecommerce development','SaaS product','IT portfolio'],
        blog:     ['programming tips','AI trends','software news','coding tutorials','tech news India','web development tips','mobile app trends','startup tech','developer guide','technology updates'],
        pricing:  ['software pricing','IT service cost','app development cost','web development price','hourly rate developers','project cost estimate','IT package plans','affordable IT services','tech service charges','development quotes'],
        careers:  ['IT jobs India','software developer jobs','web developer hiring','app developer vacancy','tech careers','IT internship','fresher IT jobs','experienced developer','remote IT jobs','join our team'],
        default:  ['technology services','IT solutions','software company','digital solutions','tech experts','development services','IT consulting','tech products','innovation','best IT services']
    },

    // ── HEALTHCARE ────────────────────────────────────────────────────────────
    healthcare: {
        home:     ['best doctor','clinic near me','health checkup','medical services','doctor consultation','affordable healthcare','trusted hospital','emergency medical','specialist doctor','health clinic'],
        about:    ['qualified doctors','experienced physicians','medical expertise','hospital history','certified medical','MBBS MD doctors','trusted healthcare','patient care','medical team','healthcare mission'],
        contact:  ['book appointment','OPD timing','emergency contact','clinic phone','online appointment','doctor available','hospital address','patient registration','medical enquiry','clinic helpline'],
        services: ['OPD services','pathology lab','radiology imaging','specialist consultation','health packages','surgery services','ICU care','pediatric services','maternity services','health checkup'],
        doctors:  ['specialist doctors','cardiologist','neurologist','orthopedic surgeon','gynecologist','pediatrician','dermatologist','experienced physicians','best doctors','doctor profiles'],
        blog:     ['health tips','disease prevention','healthy lifestyle','medical advice','wellness guide','diet nutrition','mental health','fitness health','home remedies','medical news'],
        packages: ['health package','full body checkup','diabetes package','cardiac package','women health package','senior citizen package','corporate health','annual checkup','preventive care','health screening'],
        default:  ['healthcare','medical services','doctor clinic','hospital services','health checkup','patient care','medical treatment','health solutions','wellness center','best healthcare']
    },

    // ── DIGITAL MARKETING ─────────────────────────────────────────────────────
    digitalmarketing: {
        home:     ['digital marketing agency','SEO services','Google Ads','social media marketing','lead generation','performance marketing','online marketing','ROI marketing','best agency India','digital growth'],
        about:    ['experienced marketers','certified Google','marketing agency','digital experts','results driven','marketing professionals','successful campaigns','trusted partner','agency awards','marketing team'],
        contact:  ['hire marketers','free consultation','marketing proposal','SEO audit free','agency contact','project enquiry','social media quote','Google Ads help','marketing budget','agency details'],
        services: ['SEO services','PPC management','Facebook Instagram ads','content marketing','email marketing','influencer marketing','video marketing','reputation management','local SEO','ecommerce marketing'],
        blog:     ['SEO tips 2026','Google algorithm','social media tips','digital marketing trends','content strategy','PPC optimization','Instagram marketing','email marketing tips','marketing ROI','startup marketing'],
        portfolio:['marketing case studies','SEO results','campaign success','client growth','ROI achieved','traffic increased','leads generated','conversions improved','brand built','digital success'],
        pricing:  ['marketing packages','SEO pricing India','social media price','Google Ads cost','marketing budget','affordable marketing','marketing packages','agency fees','digital marketing cost','monthly plans'],
        default:  ['digital marketing','SEO company','online marketing','social media agency','marketing services','brand promotion','advertising agency','marketing solutions','growth marketing','best agency']
    },

    // ── RESTAURANT ────────────────────────────────────────────────────────────
    restaurant: {
        home:     ['best restaurant','food delivery','dine in','pure veg restaurant','home cooked food','family restaurant','order food online','best food','restaurant near me','affordable restaurant'],
        about:    ['restaurant history','chef experience','family restaurant','culinary journey','award winning','fresh ingredients','traditional recipes','food quality','restaurant founders','hospitality'],
        contact:  ['table reservation','book a table','restaurant address','catering order','bulk food order','restaurant phone','event booking','party order','restaurant timing','delivery area'],
        menu:     ['restaurant menu','veg non veg menu','special dishes','chef special','daily specials','seasonal menu','price menu','breakfast lunch dinner','desserts menu','healthy food options'],
        blog:     ['food recipes','restaurant trends','cooking tips','new dishes','food blog India','healthy eating','street food India','traditional recipes','food review','culinary news'],
        catering: ['catering services','corporate catering','wedding catering','event catering','bulk food order','party catering','home delivery catering','tiffin service','office lunch','catering menu'],
        default:  ['restaurant India','food delivery','best food nearby','dine in','restaurant services','food catering','tasty food','quality food','good food experience','top restaurant']
    },

    // ── REAL ESTATE ───────────────────────────────────────────────────────────
    realestate: {
        home:     ['property for sale','buy flat','real estate agent','affordable housing','property investment','new property launch','residential property','commercial property','property dealer','best real estate'],
        about:    ['trusted property dealer','real estate experience','property consultant','certified agent','property experts','RERA registered','client satisfaction','property success','company history','reliable dealer'],
        contact:  ['property enquiry','site visit','property consultation','call dealer','property guidance','home loan help','property legal','investment advice','real estate helpline','contact agent'],
        listings: ['flats for sale','2BHK 3BHK','plots available','new project launch','ready to move','under construction','luxury apartments','affordable flats','property listings','best locality'],
        blog:     ['property investment tips','real estate market','home buying guide','property price trends','RERA rules','home loan tips','property legal guide','smart investment','real estate news','property valuation'],
        commercial:['commercial property','office space','shop for sale','warehouse','retail space','commercial lease','business property','showroom','IT park office','commercial investment'],
        default:  ['real estate India','property dealer','buy sell property','housing India','property services','real estate agency','property investment','residential commercial','property market','property consultant']
    },

    // ── DEFAULT ───────────────────────────────────────────────────────────────
    default: {
        home:     ['best services India','professional team','quality work','affordable price','trusted brand','customer satisfaction','experienced professionals','reliable services','top rated','best business'],
        about:    ['about our company','our story','company history','our mission','experienced team','company achievements','client success','why choose us','company values','leadership team'],
        contact:  ['contact us','get in touch','enquiry form','phone number','office location','email support','business hours','quick response','support helpline','reach us'],
        services: ['professional services','what we offer','service packages','customized solutions','expert services','quality delivery','service portfolio','affordable plans','premium services','all services'],
        blog:     ['business tips','industry news','professional guides','expert advice','latest updates','how to guide','insights analysis','trends report','best practices','knowledge hub'],
        default:  ['services India','professional quality','trusted affordable','best company','top services','expert solutions','reliable','customer first','quality assured','industry leader']
    }
};

// ─── GOOGLE NEWS QUERIES — SHORT TAIL per page ────────────────────────────────
// Used to fetch trending SHORT TAIL keywords (1-3 words)
const SHORT_TAIL_QUERIES = {
    education: {
        home:'coaching India', about:'education India', contact:'admission coaching', courses:'NEET JEE 2026',
        results:'board results India', blog:'study tips students', services:'tutoring India', default:'education India'
    },
    ecommerce: {
        home:'online shopping India', shop:'trending products India', about:'ecommerce India', contact:'online store India',
        cart:'shopping deals India', checkout:'payment India', products:'best products India', default:'ecommerce India'
    },
    'ecommerce-fashion': {
        home:'fashion India 2026', men:'mens fashion India', women:'womens fashion India', kids:'kids fashion India',
        sale:'fashion sale India', default:'fashion trends India'
    },
    'ecommerce-electronics': {
        home:'electronics India 2026', mobile:'smartphones India 2026', laptop:'laptops India 2026',
        tv:'smart TV India', audio:'earbuds headphones India', default:'gadgets India 2026'
    },
    'ecommerce-grocery': {
        home:'grocery India', fresh:'fresh vegetables India', staples:'grocery products India', default:'food grocery India'
    },
    'ecommerce-beauty': {
        home:'beauty products India', skincare:'skincare India', makeup:'makeup India', haircare:'haircare India', default:'beauty India'
    },
    'ecommerce-furniture': {
        home:'furniture India', living:'sofa furniture India', bedroom:'bed furniture India', default:'home furniture India'
    },
    technology: {
        home:'software company India', about:'IT company India', contact:'hire developers India', services:'IT services India',
        portfolio:'software projects India', blog:'tech news India', pricing:'software cost India', careers:'IT jobs India', default:'technology India'
    },
    healthcare: {
        home:'doctor India', about:'hospital India', contact:'appointment doctor', services:'medical services India',
        doctors:'specialist doctors India', blog:'health tips India', packages:'health checkup India', default:'healthcare India'
    },
    digitalmarketing: {
        home:'digital marketing India', about:'marketing agency India', contact:'hire marketers India', services:'SEO services India',
        blog:'SEO tips India', portfolio:'marketing results India', pricing:'marketing cost India', default:'digital marketing India'
    },
    restaurant: {
        home:'restaurant India', about:'food restaurant India', contact:'restaurant reservation India', menu:'food menu India',
        blog:'food trends India', catering:'catering services India', default:'food delivery India'
    },
    realestate: {
        home:'property India', about:'real estate India', contact:'property enquiry India', listings:'property for sale India',
        blog:'real estate investment India', commercial:'commercial property India', default:'property India'
    },
    default: {
        home:'best services India', about:'company India', contact:'contact business India',
        services:'professional services India', blog:'business India', default:'India 2026'
    }
};

// ─── GOOGLE NEWS QUERIES — LONG TAIL per page ────────────────────────────────
// Used to fetch trending LONG TAIL keywords (4-8 words, high intent)
const LONG_TAIL_QUERIES = {
    education: {
        home:'best coaching institute for NEET JEE India 2026', about:'top experienced coaching faculty India',
        contact:'how to take admission in coaching institute', courses:'NEET JEE preparation courses fees India',
        results:'coaching institute NEET JEE results toppers', blog:'how to score 100 percent in board exams',
        services:'online offline coaching classes study material', default:'best education institute for students India'
    },
    ecommerce: {
        home:'best online shopping site India free delivery 2026', shop:'trending products to buy online India today',
        about:'trusted online store genuine products India', contact:'how to return product online shopping India',
        cart:'best coupon codes discount online shopping India', products:'best quality products affordable price India', default:'best deals online shopping India today'
    },
    'ecommerce-fashion': {
        home:'latest fashion trends online shopping India 2026', men:'best mens clothing brands online India',
        women:'best womens ethnic western wear online India', kids:'best kids clothing brands online India',
        sale:'best fashion sale discount offers online India', default:'buy trendy clothes online India best price'
    },
    'ecommerce-electronics': {
        home:'best electronics gadgets to buy online India 2026', mobile:'best smartphone under 15000 30000 India 2026',
        laptop:'best laptop for students office under 50000 India', tv:'best smart TV to buy India under 40000',
        audio:'best wireless earbuds under 2000 5000 India', default:'best electronics deals buy online India today'
    },
    'ecommerce-grocery': {
        home:'best online grocery delivery app India 2026', fresh:'buy fresh organic vegetables online India delivery',
        staples:'best rice dal atta buy online India cheapest', default:'online grocery shopping home delivery India'
    },
    'ecommerce-beauty': {
        home:'best beauty skincare products to buy online India', skincare:'best skincare routine products India affordable',
        makeup:'best makeup products for beginners India online', haircare:'best hair care products for hair growth India', default:'best beauty products buy online India 2026'
    },
    'ecommerce-furniture': {
        home:'best furniture to buy online India affordable 2026', living:'best sofa set buy online India under 20000',
        bedroom:'best bed mattress buy online India affordable', default:'buy furniture online India best price delivery'
    },
    technology: {
        home:'best software development company India affordable 2026', about:'experienced IT software company India years',
        contact:'how to hire best software developers India', services:'web mobile app development company India cost',
        portfolio:'successful software projects case studies India', blog:'latest AI technology trends India 2026',
        pricing:'how much does software development cost India', careers:'software developer jobs freshers India 2026', default:'best IT software company services India'
    },
    healthcare: {
        home:'best doctor clinic near me affordable India', about:'best experienced doctors hospital India years',
        contact:'how to book doctor appointment online India', services:'best medical services hospital India affordable',
        doctors:'best specialist doctors near me India', blog:'how to stay healthy tips India 2026',
        packages:'best health checkup packages affordable India', default:'best healthcare hospital clinic India affordable'
    },
    digitalmarketing: {
        home:'best digital marketing agency India ROI results 2026', about:'best experienced digital marketing team India',
        contact:'how to hire digital marketing agency India', services:'best SEO PPC services India affordable results',
        blog:'how to rank website on Google India 2026', portfolio:'digital marketing agency results case studies India',
        pricing:'how much digital marketing cost India monthly', default:'best digital marketing agency India affordable'
    },
    restaurant: {
        home:'best restaurant home delivery near me India', about:'best family restaurant traditional food India',
        contact:'how to book table restaurant India', menu:'best veg non veg dishes restaurant India',
        blog:'best food recipes traditional India 2026', catering:'best catering service for events India affordable', default:'best restaurant food delivery India near me'
    },
    realestate: {
        home:'best property to buy India affordable 2026', about:'best trusted property dealer agent India',
        contact:'how to buy property India tips guidance', listings:'best 2BHK 3BHK flat for sale India affordable',
        blog:'property investment tips India 2026 returns', commercial:'best commercial property to buy India', default:'best property dealer real estate India affordable'
    },
    default: {
        home:'best professional services company India affordable', about:'best experienced company team India years',
        contact:'how to contact best company India', services:'best professional services packages India affordable',
        blog:'best business tips guide India 2026', default:'best services company India affordable quality'
    }
};

// ─── FETCH KEYWORDS FROM GOOGLE NEWS ─────────────────────────────────────────
async function fetchFromGoogleNews(query, maxResults = 5) {
    try {
        const url = 'https://news.google.com/rss/search?q=' + encodeURIComponent(query) + '&hl=en-IN&gl=IN&ceid=IN:en';
        const res = await fetch(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
            signal: AbortSignal.timeout(8000)
        });
        const text    = await res.text();
        const matches = text.match(/<title>(.*?)<\/title>/g) || [];
        return matches
            .slice(1, maxResults + 3)
            .map(t => t.replace(/<\/?title>/g, '').replace(/ - Google News.*$/g, '').trim())
            .filter(t => t.length > 3 && t.length < 100)
            .slice(0, maxResults);
    } catch (e) {
        return [];
    }
}

// ─── MAIN KEYWORD FETCHER ─────────────────────────────────────────────────────
// Returns: 10 fixed + 5 short tail + 5 long tail = 20 total unique keywords per page

async function fetchTrendingKeywords(category, page, existingFixed) {
    const p        = (page || 'home').toLowerCase().trim();
    const catFixed = DEFAULT_FIXED[category] || DEFAULT_FIXED.default;

    // Use existing fixed from DB if available, else use defaults
    const fixedArr  = existingFixed
        ? existingFixed.split(',').map(k => k.trim()).filter(Boolean).slice(0, 10)
        : (catFixed[p] || catFixed.default);

    // Ensure exactly 10 fixed
    const fixedKeys = fixedArr.slice(0, 10);

    // Get short tail query for this specific page
    const shortQ = (SHORT_TAIL_QUERIES[category] || SHORT_TAIL_QUERIES.default)[p]
                || (SHORT_TAIL_QUERIES[category] || SHORT_TAIL_QUERIES.default).default;

    // Get long tail query for this specific page
    const longQ  = (LONG_TAIL_QUERIES[category] || LONG_TAIL_QUERIES.default)[p]
                || (LONG_TAIL_QUERIES[category] || LONG_TAIL_QUERIES.default).default;

    // Fetch both in parallel
    const [shortTailRaw, longTailRaw] = await Promise.all([
        fetchFromGoogleNews(shortQ, 5),
        fetchFromGoogleNews(longQ,  5)
    ]);

    // Short tail = clean 1-3 word phrases extracted from headlines
    const shortTail = shortTailRaw
        .map(headline => {
            // Extract 2-3 word phrases from headlines
            const words = headline.replace(/[^\w\s]/g, '').split(' ').filter(w => w.length > 2);
            return words.slice(0, 3).join(' ');
        })
        .filter((v, i, a) => v && a.indexOf(v) === i)
        .slice(0, 5);

    // Long tail = keep full headlines (naturally long tail)
    const longTail = longTailRaw
        .filter(h => h.split(' ').length >= 4)
        .slice(0, 5);

    const source = (shortTail.length + longTail.length) > 0 ? 'google-trends' : 'fallback';

    // Combine all — fixed first, then short, then long
    const allKeywords = [
        ...fixedKeys,
        ...shortTail,
        ...longTail
    ].filter((v, i, a) => v && a.indexOf(v) === i); // deduplicate

    return {
        keywords:         allKeywords.join(', '),
        fixedKeywords:    fixedKeys.join(', '),
        shortTailKeywords: shortTail.join(', '),
        longTailKeywords:  longTail.join(', '),
        source
    };
}

// ─── GET DEFAULT FIXED KEYWORDS FOR A PAGE ────────────────────────────────────
function getDefaultFixed(category, page) {
    const p      = (page || 'home').toLowerCase().trim();
    const catFix = DEFAULT_FIXED[category] || DEFAULT_FIXED.default;
    return (catFix[p] || catFix.default).join(', ');
}

// ─── DETECT ECOMMERCE SUBCATEGORY FROM PAGE SLUG ─────────────────────────────
function detectEcomSubcategory(siteId, page) {
    const p = (page || '').toLowerCase();
    if (p.includes('fashion') || p.includes('cloth') || p.includes('wear') || p.includes('dress')) return 'ecommerce-fashion';
    if (p.includes('electron') || p.includes('mobile') || p.includes('laptop') || p.includes('gadget') || p.includes('phone')) return 'ecommerce-electronics';
    if (p.includes('grocery') || p.includes('food') || p.includes('vegetable') || p.includes('fruit')) return 'ecommerce-grocery';
    if (p.includes('beauty') || p.includes('skin') || p.includes('makeup') || p.includes('cosmetic')) return 'ecommerce-beauty';
    if (p.includes('furniture') || p.includes('sofa') || p.includes('bed') || p.includes('home decor')) return 'ecommerce-furniture';
    return 'ecommerce';
}

const CATEGORY_KEYWORDS = {
    education: 'best coaching institute, online classes, NEET JEE coaching',
    ecommerce: 'online shopping India, best deals, free delivery',
    technology: 'software development, IT services, app development',
    healthcare: 'best doctor, clinic near me, health checkup',
    digitalmarketing: 'digital marketing agency, SEO services, Google Ads',
    restaurant: 'best restaurant, food delivery, dine in',
    realestate: 'property for sale, buy flat, real estate agent',
    default: 'best services, professional team, quality work'
};

const DEFAULT_PAGES = {
    ecommerce:        ['home','shop','about','contact','cart','checkout','products','wishlist','orders','blog'],
    'ecommerce-fashion':     ['home','men','women','kids','sale'],
    'ecommerce-electronics': ['home','mobile','laptop','tv','audio'],
    'ecommerce-grocery':     ['home','fresh','staples'],
    'ecommerce-beauty':      ['home','skincare','makeup','haircare'],
    'ecommerce-furniture':   ['home','living','bedroom'],
    education:        ['home','about','contact','courses','results','services','blog','faculty'],
    healthcare:       ['home','about','contact','services','doctors','blog','packages'],
    technology:       ['home','about','contact','services','portfolio','blog','pricing','careers'],
    restaurant:       ['home','about','contact','menu','blog','catering'],
    realestate:       ['home','about','contact','listings','blog','commercial'],
    digitalmarketing: ['home','about','contact','services','blog','portfolio','pricing'],
    default:          ['home','about','contact','services','blog']
};

module.exports = { fetchTrendingKeywords, getDefaultFixed, detectEcomSubcategory, CATEGORY_KEYWORDS, DEFAULT_PAGES, DEFAULT_FIXED };
