// ─── FIXED BASE KEYWORDS — exactly 10 per page, never change ─────────────────
const FIXED_KEYWORDS = {
    education: {
        home:     ['best coaching institute India','online classes India','top tutor near me','exam preparation coaching','study material online','NEET JEE coaching','CBSE tuition center','competitive exam coaching','affordable coaching fees','best faculty coaching'],
        about:    ['experienced teachers India','qualified faculty coaching','teaching excellence award','best educators India','academic success coaching','trusted coaching institute','years of teaching experience','best mentors students','coaching institute history','dedicated faculty team'],
        contact:  ['coaching institute admission','contact coaching center','admission enquiry form','call for admission','coaching center address','enroll now coaching','free demo class','coaching helpline number','online admission process','coaching registration open'],
        courses:  ['NEET coaching India','JEE coaching institute','CBSE tuition classes','foundation course students','competitive exam course','IIT preparation course','medical entrance coaching','engineering entrance coaching','class 10 12 coaching','online course enrollment'],
        results:  ['coaching institute toppers','student success stories','rank holders coaching','past results coaching','100 percent results coaching','NEET qualified students','JEE rank holders','student achievements awards','best results coaching India','merit list coaching'],
        blog:     ['study tips students India','exam strategy guide','how to score high marks','learning methods students','student success guide','time management students','best books NEET JEE','education news India','coaching tips students','academic excellence tips'],
        services: ['online tutoring India','offline coaching classes','doubt clearing sessions','test series coaching','mock test preparation','personalized coaching plan','group coaching classes','one on one tutoring','weekend coaching classes','crash course coaching'],
        default:  ['education services India','learning center India','academic excellence','quality education India','student success programs','coaching programs India','educational institute India','skill development courses','career guidance students','top education institute']
    },
    ecommerce: {
        home:     ['online shopping India','best deals online India','discount offers today','buy now free delivery','top brands online India','cash on delivery available','easy returns policy','secure payment gateway','best price guarantee','shop online safely India'],
        shop:     ['all products online','best sellers India','new arrivals daily','trending products India','sale items discount','top rated products','budget products India','premium products online','product categories India','browse all products'],
        about:    ['trusted online seller','years in ecommerce business','customer satisfaction guaranteed','genuine products only','certified online store','safe shopping platform','reliable delivery service','customer first policy','brand story ecommerce','authorized seller India'],
        contact:  ['customer support 24x7','order help assistance','returns and refund policy','helpline number India','complaint resolution fast','track my order','exchange product request','delivery issue support','payment support help','customer care email'],
        cart:     ['shopping cart India','checkout secure payment','apply coupon code','cart total discount','save for later items','proceed to checkout','multiple payment options','UPI payment accepted','EMI option available','cart abandonment offer'],
        checkout: ['secure checkout India','fast delivery checkout','order confirmation email','address verification checkout','payment successful order','UPI net banking checkout','COD available checkout','order placed successfully','checkout process simple','safe payment checkout'],
        products: ['best products India','product reviews ratings','compare products price','product specifications details','buy genuine products','affordable products online','quality checked products','popular products trending','limited stock products','exclusive products online'],
        default:  ['ecommerce India','online shopping store','buy products online','best deals offers','fast delivery India','secure shopping India','top brands products','discount sale online','shop now India','best online store']
    },
    technology: {
        home:     ['software development company India','IT services India','mobile app development','web development agency','digital transformation India','cloud computing services','AI ML development India','custom software solutions','tech startup India','best IT company India'],
        about:    ['experienced IT team India','software engineers India','tech company history','IT experts professionals','years of IT experience','certified developers India','agile development team','innovative tech solutions','trusted IT partner','best software company'],
        contact:  ['hire software developers','IT project enquiry','get a free quote IT','tech consultation India','custom development quote','software outsourcing India','remote developers India','IT support contact','project discussion call','tech team contact'],
        services: ['web development India','mobile app iOS Android','cloud solutions AWS Azure','AI ML development','ERP software India','CRM development India','API integration services','DevOps services India','UI UX design India','blockchain development India'],
        portfolio:['software projects India','web app case studies','mobile app portfolio','client success stories IT','tech projects delivered','enterprise software built','startup tech solutions','ecommerce development done','SaaS product developed','IT project examples'],
        blog:     ['programming tips India','AI trends 2026','software development news','coding tutorials Hindi','tech news India today','web development tips','mobile app trends','startup tech India','developer guide India','technology updates India'],
        default:  ['technology services India','IT solutions India','software company India','digital solutions','tech experts India','development services','IT consulting India','tech products India','innovation technology','best IT services']
    },
    healthcare: {
        home:     ['best doctor India','clinic near me','health checkup packages','medical services India','doctor consultation online','affordable healthcare India','trusted hospital India','emergency medical services','specialist doctor India','health clinic India'],
        about:    ['qualified doctors India','experienced physicians','medical expertise years','hospital established since','certified medical staff','MBBS MD doctors India','trusted healthcare provider','patient care excellence','medical team India','healthcare mission'],
        contact:  ['book doctor appointment','OPD timing clinic','emergency contact hospital','clinic phone number','online appointment booking','doctor available today','hospital address directions','patient registration form','medical enquiry contact','clinic helpline'],
        services: ['OPD services India','pathology lab tests','radiology imaging India','specialist consultation','health packages affordable','surgery services India','ICU critical care','pediatric services India','maternity services hospital','preventive health checkup'],
        doctors:  ['specialist doctors India','MBBS MD doctors list','cardiologist India','neurologist India','orthopedic surgeon India','gynecologist India','pediatrician doctor','dermatologist India','experienced physicians team','best doctors nearby'],
        blog:     ['health tips India','disease prevention guide','healthy lifestyle tips','medical advice Indians','wellness guide India','diet nutrition tips India','mental health awareness','fitness health India','home remedies India','medical news India'],
        default:  ['healthcare India','medical services','doctor clinic India','hospital services','health checkup India','patient care India','medical treatment India','health solutions India','wellness center India','best healthcare']
    },
    digitalmarketing: {
        home:     ['digital marketing agency India','SEO services India','Google Ads management','social media marketing India','lead generation services','performance marketing India','online marketing agency','ROI based marketing','best marketing agency India','digital growth partner'],
        about:    ['experienced marketers India','certified Google partners','marketing agency history','digital marketing experts','results driven agency','marketing professionals team','successful campaigns delivered','trusted marketing partner','agency achievements awards','marketing team India'],
        contact:  ['hire digital marketers','marketing consultation free','get marketing proposal','SEO audit free India','contact marketing agency','marketing project enquiry','social media management quote','Google Ads setup help','marketing budget discussion','agency contact details'],
        services: ['SEO services India','PPC management India','Facebook Instagram ads','content marketing India','email marketing campaigns','influencer marketing India','video marketing services','reputation management India','local SEO services','ecommerce marketing India'],
        blog:     ['SEO tips India 2026','Google algorithm updates','social media tips India','digital marketing trends','content strategy guide','PPC optimization tips','Instagram marketing India','email marketing tips','marketing ROI guide','startup marketing tips'],
        default:  ['digital marketing India','SEO company India','online marketing India','social media agency','marketing services India','brand promotion India','advertising agency India','marketing solutions','growth marketing India','best marketing agency']
    },
    restaurant: {
        home:     ['best restaurant India','food delivery near me','dine in restaurant','pure veg restaurant','home cooked food delivery','family restaurant India','order food online','best food in city','restaurant near me','affordable restaurant India'],
        about:    ['restaurant history story','chef experience years','family restaurant since','our culinary journey','award winning restaurant','fresh ingredients daily','traditional recipes restaurant','food quality commitment','restaurant founders story','hospitality excellence'],
        contact:  ['table reservation restaurant','book a table online','restaurant address map','catering order enquiry','bulk food order contact','restaurant phone number','event booking restaurant','party order restaurant','restaurant timing hours','delivery area coverage'],
        menu:     ['restaurant menu 2026','veg non veg menu','special dishes restaurant','chef special today','daily specials menu','seasonal menu items','price menu restaurant','breakfast lunch dinner menu','desserts menu restaurant','healthy food options menu'],
        blog:     ['food recipes India','restaurant food trends','cooking tips home','new dishes restaurant','food blog India','healthy eating guide','street food India','traditional recipes India','food review blog','culinary news India'],
        default:  ['restaurant India','food delivery India','best food nearby','dine in food','restaurant services','food catering India','tasty food India','quality food restaurant','good food experience','top restaurant India']
    },
    realestate: {
        home:     ['property for sale India','buy flat apartment India','real estate agent India','affordable housing India','property investment India','new property launch India','residential property India','commercial property India','property dealer near me','best real estate India'],
        about:    ['trusted property dealer','real estate experience years','property consultant India','certified real estate agent','property experts team','RERA registered agent','client satisfaction property','property success stories','real estate company history','reliable property dealer'],
        contact:  ['property enquiry form','site visit booking','property consultation free','real estate contact India','call property dealer','property purchase guidance','home loan assistance contact','property legal help','property investment advice','real estate helpline'],
        listings: ['flats for sale India','2BHK 3BHK apartment','plots available India','new project launch','ready to move property','under construction property','luxury apartments India','affordable flats India','property listings nearby','best locality property'],
        blog:     ['property investment tips','real estate market India','home buying guide India','property price trends','RERA rules India','home loan tips India','property legal guide','smart investment property','real estate news India','property valuation guide'],
        default:  ['real estate India','property dealer India','buy sell property','housing India','property services','real estate agency','property investment','residential commercial India','property market India','property consultant']
    },
    default: {
        home:     ['best services India','professional team India','quality work guaranteed','affordable price India','trusted brand India','customer satisfaction first','experienced professionals','reliable services India','top rated company India','best business India'],
        about:    ['about our company','our story history','company founded year','our mission vision','experienced team members','company achievements awards','client success stories','why choose us','company values ethics','leadership team India'],
        contact:  ['contact us India','get in touch today','enquiry form online','phone number address','office location map','email contact support','business hours timing','quick response guarantee','support helpline India','reach us easily'],
        services: ['professional services India','what we offer clients','service packages pricing','customized solutions India','expert services team','quality service delivery','service portfolio India','affordable service plans','premium services India','all services available'],
        blog:     ['business tips India','industry news updates','professional guides articles','expert advice blog','latest updates news','how to guide India','insights analysis India','trends report India','best practices guide','knowledge hub articles'],
        default:  ['services India','professional quality','trusted affordable','best company India','top services India','expert solutions','reliable India','customer first India','quality assured','industry leader India']
    }
};

const TREND_QUERIES = {
    education: { home:'best coaching institute India 2026', about:'education institute India', contact:'coaching admission India', courses:'NEET JEE coaching 2026', results:'coaching toppers India', blog:'education tips students India', services:'tutoring services India', default:'education India 2026' },
    ecommerce: { home:'online shopping deals India 2026', shop:'trending products sale India', about:'trusted online store India', contact:'ecommerce customer support India', cart:'online shopping offers India', checkout:'secure payment India', products:'best products buy India', default:'ecommerce India 2026' },
    technology: { home:'software development company India 2026', about:'IT company India', contact:'hire developers India', services:'IT services web app India', portfolio:'software projects India', blog:'tech news India 2026', default:'technology IT India 2026' },
    healthcare: { home:'best doctor clinic India 2026', about:'qualified doctors hospital India', contact:'doctor appointment India', services:'medical services hospital India', doctors:'specialist doctors India', blog:'health tips India 2026', default:'healthcare India 2026' },
    digitalmarketing: { home:'digital marketing agency India 2026', about:'marketing agency India', contact:'hire digital marketers India', services:'SEO PPC services India', blog:'SEO tips digital marketing India 2026', default:'digital marketing India 2026' },
    restaurant: { home:'best restaurant food delivery India', about:'restaurant story India', contact:'restaurant reservation India', menu:'restaurant menu dishes India', blog:'food trends India 2026', default:'restaurant food India 2026' },
    realestate: { home:'property for sale India 2026', about:'real estate agent India', contact:'property enquiry India', listings:'new property listings India', blog:'real estate investment India', default:'real estate India 2026' },
    default: { home:'best services India 2026', about:'company India', contact:'contact business India', services:'professional services India', blog:'business tips India 2026', default:'business India 2026' }
};

function getPageConfig(category, page) {
    const p       = (page || 'home').toLowerCase().trim();
    const cat     = FIXED_KEYWORDS[category]    || FIXED_KEYWORDS.default;
    const queries = TREND_QUERIES[category]     || TREND_QUERIES.default;
    return {
        fixedKeys: cat[p]     || cat.default,
        q:         queries[p] || queries.default
    };
}

async function fetchTrendingKeywords(category, page) {
    const config = getPageConfig(category, page);
    try {
        const url = 'https://news.google.com/rss/search?q=' + encodeURIComponent(config.q) + '&hl=en-IN&gl=IN&ceid=IN:en';
        const res = await fetch(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
            signal: AbortSignal.timeout(8000)
        });
        const text = await res.text();
        const matches = text.match(/<title>(.*?)<\/title>/g) || [];
        const trendingKeys = matches
            .slice(1, 8)
            .map(t => t.replace(/<\/?title>/g, '').replace(/ - Google News/g, '').trim())
            .filter(t => t.length > 5 && t.length < 80)
            .slice(0, 5);

        if (trendingKeys.length > 0) {
            return {
                keywords:         [...config.fixedKeys, ...trendingKeys].join(', '),
                fixedKeywords:    config.fixedKeys.join(', '),
                trendingKeywords: trendingKeys.join(', '),
                source: 'google-trends'
            };
        }
    } catch (e) {
        console.log('Trend fetch failed:', e.message);
    }
    return {
        keywords:         config.fixedKeys.join(', '),
        fixedKeywords:    config.fixedKeys.join(', '),
        trendingKeywords: '',
        source: 'fallback'
    };
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
    ecommerce:        ['home','shop','about','contact','cart','checkout','my-account'],
    education:        ['home','about','contact','courses','results','blog'],
    healthcare:       ['home','about','contact','services','doctors','blog'],
    technology:       ['home','about','contact','services','portfolio','blog'],
    restaurant:       ['home','about','contact','menu','blog'],
    realestate:       ['home','about','contact','listings','blog'],
    digitalmarketing: ['home','about','contact','services','blog'],
    default:          ['home','about','contact','services']
};

module.exports = { fetchTrendingKeywords, getPageConfig, CATEGORY_KEYWORDS, DEFAULT_PAGES };
