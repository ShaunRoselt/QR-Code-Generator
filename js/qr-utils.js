"use strict";

// QR Code generation utilities
let currentQRCode = null;

const QRCodeErrorCorrectionOptions = {
    FALLBACK_LEVELS: Object.freeze({
        L: Object.freeze({ key: 'L', label: 'Very Low', recoveryPercent: 7 }),
        M: Object.freeze({ key: 'M', label: 'Low', recoveryPercent: 15 }),
        Q: Object.freeze({ key: 'Q', label: 'Medium', recoveryPercent: 25 }),
        H: Object.freeze({ key: 'H', label: 'High', recoveryPercent: 30 })
    }),

    getLevels() {
        return QRCode?.CorrectLevelInfo ?? this.FALLBACK_LEVELS;
    },

    renderOptions(selectedLevel = 'Q') {
        const normalizedSelectedLevel = String(selectedLevel).toUpperCase();

        return Object.values(this.getLevels())
            .map(level => {
                const selectedAttribute = level.key === normalizedSelectedLevel ? ' selected' : '';
                return `<option value="${level.key}"${selectedAttribute}>${level.label} (${level.recoveryPercent}%)</option>`;
            })
            .join('');
    }
};

const QR_CODE_VERSION_AUTOMATIC = 0;
const QR_LOGO_SIZE_MIN_PERCENT = 12;
const QR_LOGO_SIZE_MAX_PERCENT = 44;

function generateQRCode(content, elementId, options = {}) {
    const {
        size = 256,
        foreground = '#000000',
        background = '#ffffff',
        errorCorrection = 'M',
        margin
    } = options;
    
    const element = document.getElementById(elementId);
    if (!element) return null;
    
    // Clear previous QR code
    element.innerHTML = '';
    
    try {
        currentQRCode = new QRCode(element, {
            text: content,
            width: size,
            height: size,
            ...(margin == null ? {} : { margin }),
            colorDark: foreground,
            colorLight: background,
            correctLevel: QRCode.CorrectLevel[errorCorrection]
        });
        return currentQRCode;
    } catch (error) {
        console.error('Error generating QR code:', error);
        return null;
    }
}

function downloadQRAsPNG(size = 3840) {
    const canvas = document.querySelector('#qrcode canvas');
    if (!canvas) {
        alert(I18n.translateString('No QR code to download'));
        return;
    }
    
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = size;
    exportCanvas.height = size;
    const ctx = exportCanvas.getContext('2d');
    
    ctx.imageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.msImageSmoothingEnabled = false;
    
    ctx.drawImage(canvas, 0, 0, size, size);
    
    const url = exportCanvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = url;
    link.download = `qrcode-${size}x${size}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function downloadQRAsSVG(size = 3840) {
    const canvas = document.querySelector('#qrcode canvas');
    if (!canvas) {
        alert(I18n.translateString('No QR code to download'));
        return;
    }
    
    const canvasSize = canvas.width;
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvasSize, canvasSize);
    const data = imageData.data;
    
    const scale = size / canvasSize;
    
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`;
    
    const bgColor = `rgb(${data[0]}, ${data[1]}, ${data[2]})`;
    svg += `<rect width="${size}" height="${size}" fill="${bgColor}"/>`;
    
    let path = '';
    for (let y = 0; y < canvasSize; y++) {
        for (let x = 0; x < canvasSize; x++) {
            const i = (y * canvasSize + x) * 4;
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            if (r < 128 || g < 128 || b < 128) {
                const scaledX = Math.floor(x * scale);
                const scaledY = Math.floor(y * scale);
                const scaledSize = Math.ceil(scale);
                path += `M${scaledX},${scaledY}h${scaledSize}v${scaledSize}h-${scaledSize}z `;
            }
        }
    }
    
    if (path) {
        const fgColor = document.getElementById('foregroundColor')?.value || '#000000';
        svg += `<path fill="${fgColor}" d="${path}"/>`;
    }
    
    svg += '</svg>';
    
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `qrcode-${size}x${size}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

const QRCodeLogoControls = {
    ICONS_ASSET_PATH: 'assets/icons',
    logoDataUrl: '',
    logoSvgMarkup: '',
    logoImage: null,
    uploadedLogos: [],
    activeUploadedLogoId: '',
    logoBackgroundColor: '#ffffff',
    activeLogoLabel: '',
    selectedPresetId: '',
    logoPresets: null,
    assetPresetSlugSet: null,
    sizePercent: 22,
    logoPadding: 20,
    logoIconColor: '',
    logoShape: 'rounded',
    logoShapeCatalog: Object.freeze([
        { id: 'rounded', title: 'Rounded Square', icon: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="1" y="1" width="18" height="18" rx="4" stroke="currentColor" stroke-width="2"></rect></svg>' },
        { id: 'square', title: 'Square', icon: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="1" y="1" width="18" height="18" stroke="currentColor" stroke-width="2"></rect></svg>' },
        { id: 'circle', title: 'Circle', icon: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="9" stroke="currentColor" stroke-width="2"></circle></svg>' },
        { id: 'hexagon', title: 'Hexagon', icon: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><polygon points="10,1 18.66,5.5 18.66,14.5 10,19 1.34,14.5 1.34,5.5" stroke="currentColor" stroke-width="2" stroke-linejoin="round"></polygon></svg>' },
        { id: 'heart', title: 'Heart', icon: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 18 C10 18 1 12 1 6.5 C1 3.46 3.46 1 6.5 1 C8.24 1 9.73 1.81 10 3 C10.27 1.81 11.76 1 13.5 1 C16.54 1 19 3.46 19 6.5 C19 12 10 18 10 18Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"></path></svg>' },
        { id: 'diamond', title: 'Diamond', icon: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><polygon points="10,1 19,10 10,19 1,10" stroke="currentColor" stroke-width="2" stroke-linejoin="round"></polygon></svg>' },
        { id: 'star', title: 'Star', icon: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><polygon points="10,1 12.47,7.6 19.51,7.64 13.82,11.72 15.88,18.36 10,14.58 4.12,18.36 6.18,11.72 0.49,7.64 7.53,7.6" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"></polygon></svg>' },
        { id: 'shield', title: 'Shield', icon: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 1 L18 4 L18 10 C18 14.42 14.42 17.5 10 19 C5.58 17.5 2 14.42 2 10 L2 4 Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"></path></svg>' },
        { id: 'teardrop', title: 'Teardrop', icon: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 1 C10 1 18 8 18 12.5 C18 16.92 14.42 19 10 19 C5.58 19 2 16.92 2 12.5 C2 8 10 1 10 1Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"></path></svg>' },
        { id: 'triangle', title: 'Triangle', icon: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><polygon points="10,1 19,19 1,19" stroke="currentColor" stroke-width="2" stroke-linejoin="round"></polygon></svg>' },
        { id: 'cloud', title: 'Cloud', icon: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 16 C2.5 16 1 14.2 1 12 C1 10 2.5 8.5 4.5 8.2 C4.2 7.5 4 6.8 4 6 C4 3.2 6.2 1 9 1 C11.2 1 13 2.4 13.7 4.4 C14.2 4.1 14.8 4 15.5 4 C17.4 4 19 5.6 19 7.5 C19 7.8 18.9 8.1 18.8 8.4 C19.5 9 19 10.8 19 12 C19 14.2 17.2 16 15 16 Z" stroke="currentColor" stroke-width="1.5"></path></svg>' },
        { id: 'clover', title: 'Clover', icon: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="5.5" r="4" stroke="currentColor" stroke-width="1.5"></circle><circle cx="14.5" cy="10" r="4" stroke="currentColor" stroke-width="1.5"></circle><circle cx="10" cy="14.5" r="4" stroke="currentColor" stroke-width="1.5"></circle><circle cx="5.5" cy="10" r="4" stroke="currentColor" stroke-width="1.5"></circle></svg>' },
        { id: 'ribbon', title: 'Ribbon', icon: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><polygon points="1,1 19,1 19,19 10,15 1,19" stroke="currentColor" stroke-width="2" stroke-linejoin="round"></polygon></svg>' },
        { id: 'speech-bubble', title: 'Speech Bubble', icon: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M3 1 H17 Q19 1 19 3 V11 Q19 13 17 13 H11 L7 17 L8 13 H3 Q1 13 1 11 V3 Q1 1 3 1Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"></path></svg>' },
        { id: 'ticket', title: 'Ticket', icon: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M1 3 H19 V8 A2 2 0 0 0 19 12 V17 H1 V12 A2 2 0 0 0 1 8 Z" stroke="currentColor" stroke-width="2"></path></svg>' },
        { id: 'crescent', title: 'Crescent', icon: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M15 3 A8 8 0 1 0 15 17 A6 6 0 1 1 15 3 Z" stroke="currentColor" stroke-width="1.5"></path></svg>' },
        { id: 'wavy-circle', title: 'Wavy Circle', icon: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 1.5 Q12.5 3 13.5 2 Q15 3.5 14 5 Q16 5.5 16 7.5 Q17.5 8.5 17 10 Q18 11.5 16.5 13 Q16.5 15 15 15.5 Q14.5 17 13 17 Q12 18.5 10 18 Q8 18.5 7 17 Q5.5 17 5 15.5 Q3.5 15 3.5 13 Q2 11.5 3 10 Q2.5 8.5 4 7.5 Q4 5.5 6 5 Q5 3.5 6.5 2 Q7.5 3 10 1.5Z" stroke="currentColor" stroke-width="1.5"></path></svg>' },
        { id: 'lightning', title: 'Lightning', icon: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M12 1 L4 11 H9 L7 19 L16 8 H11 Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"></path></svg>' },
        { id: 'play-triangle', title: 'Play', icon: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 2 L18 10 L4 18 Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"></path></svg>' },
        { id: 'location-pin', title: 'Location Pin', icon: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 19 C10 19 3 12 3 8 A7 7 0 0 1 17 8 C17 12 10 19 10 19 Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"></path><circle cx="10" cy="8" r="2.5" stroke="currentColor" stroke-width="1.5"></circle></svg>' },
        { id: 'house', title: 'House', icon: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M2 10 L10 2 L18 10 V18 H2 Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"></path></svg>' },
        { id: 'tag', title: 'Tag', icon: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M2 6 L7 2 H17 V17 H7 L2 13 L5 9.5 Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"></path><circle cx="13" cy="6" r="1.2" stroke="currentColor" stroke-width="1.2"></circle></svg>' },
        { id: 'blob', title: 'Blob', icon: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2 C14 2 18 5 17 10 C19 14 14 18 10 17 C5 19 1 14 3 10 C1 5 6 2 10 2 Z" stroke="currentColor" stroke-width="1.5"></path></svg>' },
        { id: 'gemstone', title: 'Gemstone', icon: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 2 H15 L19 8 L10 19 L1 8 Z M1 8 H19 M5 2 L10 19 M15 2 L10 19 M5 2 L10 8 M15 2 L10 8" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"></path></svg>' },
        { id: 'arrow', title: 'Arrow', icon: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><polygon points="19,10 10,1 10,6.5 1,6.5 1,13.5 10,13.5 10,19" stroke="currentColor" stroke-width="2" stroke-linejoin="round"></polygon></svg>' },
        { id: 'arrow-up', title: 'Arrow Up', icon: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2 L17 9 H13 V18 H7 V9 H3 Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"></path></svg>' },
        { id: 'arrow-down', title: 'Arrow Down', icon: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 18 L17 11 H13 V2 H7 V11 H3 Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"></path></svg>' },
        { id: 'arrow-left', title: 'Arrow Left', icon: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M2 10 L9 3 V7 H18 V13 H9 V17 Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"></path></svg>' },
        { id: 'chevron-up', title: 'Chevron Up', icon: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M2 18 V13 L10 5 L18 13 V18 H13 L10 15 L7 18 Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"></path></svg>' },
        { id: 'chevron-left', title: 'Chevron Left', icon: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M18 2 H13 L5 10 L13 18 H18" stroke="currentColor" stroke-width="2" stroke-linejoin="round" fill="none"></path></svg>' },
        { id: 'chevron-right', title: 'Chevron Right', icon: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M2 2 H7 L15 10 L7 18 H2" stroke="currentColor" stroke-width="2" stroke-linejoin="round" fill="none"></path></svg>' },
        { id: 'plus-sign', title: 'Plus', icon: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M8 2 H12 V8 H18 V12 H12 V18 H8 V12 H2 V8 H8 Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"></path></svg>' },
        { id: 'x-mark', title: 'Cross', icon: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4 2 L10 7 L16 2 L18 4 L13 10 L18 16 L16 18 L10 13 L4 18 L2 16 L7 10 L2 4 Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"></path></svg>' },
        { id: 'checkmark', title: 'Checkmark', icon: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M2 11 L4 8 L8 12 L16 3 L18 6 L8 18 Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"></path></svg>' }
    ]),
    lastTypeNumber: 0,
    lastCorrectLevelKey: 'Q',
    lastAppliedSizePercent: 22,
    assetPresetNameOverrides: {
        '1and1': '1&1',
        '1dot1dot1dot1': '1.1.1.1',
        '1001tracklists': '1001 Tracklists',
        '30secondsofcode': '30 Seconds of Code',
        '365datascience': '365 Data Science',
        '3m': '3M',
        '4chan': '4chan',
        '4d': '4D',
        '500px': '500px',
        '7zip': '7-Zip',
        '99designs': '99designs',
        '9gag': '9GAG',
        abdownloadmanager: 'AB Download Manager',
        aboutdotme: 'about.me',
        abusedotch: 'abuse.ch',
        accuweather: 'AccuWeather',
        activitypub: 'ActivityPub',
        actualbudget: 'Actual Budget',
        addydotio: 'addy.io',
        adblockplus: 'Adblock Plus',
        adonisjs: 'AdonisJS',
        adventofcode: 'Advent of Code',
        aegisauthenticator: 'Aegis Authenticator',
        aftership: 'AfterShip',
        aidungeon: 'AI Dungeon',
        airplayaudio: 'AirPlay Audio',
        airplayvideo: 'AirPlay Video',
        albertheijn: 'Albert Heijn',
        alibabacloud: 'Alibaba Cloud',
        alibabadotcom: 'Alibaba.com',
        alienware: 'Alienware',
        aliexpress: 'AliExpress',
        alliedmodders: 'Allied Modders',
        alltrails: 'AllTrails',
        almalinux: 'AlmaLinux',
        alpinedotjs: 'Alpine.js',
        alpinelinux: 'Alpine Linux',
        alternativeto: 'AlternativeTo',
        alwaysdata: 'alwaysdata',
        americanairlines: 'American Airlines',
        americanexpress: 'American Express',
        androidauto: 'Android Auto',
        androidstudio: 'Android Studio',
        animedotjs: 'Anime.js',
        ankermake: 'AnkerMake',
        animalplanet: 'Animal Planet',
        antennapod: 'AntennaPod',
        antdesign: 'Ant Design',
        apacheairflow: 'Apache Airflow',
        apacheant: 'Apache Ant',
        apacheavro: 'Apache Avro',
        apachecassandra: 'Apache Cassandra',
        apachecloudstack: 'Apache CloudStack',
        apachecordova: 'Apache Cordova',
        apachecouchdb: 'Apache CouchDB',
        apachedolphinscheduler: 'Apache DolphinScheduler',
        apachedoris: 'Apache Doris',
        apachedruid: 'Apache Druid',
        apacheecharts: 'Apache ECharts',
        apacheflink: 'Apache Flink',
        apachefreemarker: 'Apache FreeMarker',
        apachegroovy: 'Apache Groovy',
        apacheguacamole: 'Apache Guacamole',
        apachehadoop: 'Apache Hadoop',
        apachehbase: 'Apache HBase',
        apachehive: 'Apache Hive',
        apachejmeter: 'Apache JMeter',
        apachekafka: 'Apache Kafka',
        apachekylin: 'Apache Kylin',
        apachelucene: 'Apache Lucene',
        apachemaven: 'Apache Maven',
        apachenetbeanside: 'Apache NetBeans IDE',
        apachenifi: 'Apache NiFi',
        apacheopenoffice: 'Apache OpenOffice',
        apacheparquet: 'Apache Parquet',
        apachepdfbox: 'Apache PDFBox',
        apachepulsar: 'Apache Pulsar',
        apacherocketmq: 'Apache RocketMQ',
        apachesolr: 'Apache Solr',
        apachespark: 'Apache Spark',
        apachestorm: 'Apache Storm',
        apachesuperset: 'Apache Superset',
        apachetomcat: 'Apache Tomcat',
        apollographql: 'Apollo GraphQL',
        applearcade: 'Apple Arcade',
        applemusic: 'Apple Music',
        applenews: 'Apple News',
        applepay: 'Apple Pay',
        applepodcasts: 'Apple Podcasts',
        appletv: 'Apple TV',
        appmanager: 'App Manager',
        appstore: 'App Store',
        archiveofourown: 'Archive of Our Own',
        archlinux: 'Arch Linux',
        arstechnica: 'Ars Technica',
        artifacthub: 'Artifact Hub',
        artixlinux: 'Artix Linux',
        artstation: 'ArtStation',
        asahilinux: 'Asahi Linux',
        assemblyscript: 'AssemblyScript',
        astonmartin: 'Aston Martin',
        atandt: 'AT&T',
        audiobookshelf: 'Audiobookshelf',
        audiotechnica: 'Audio-Technica',
        autohotkey: 'AutoHotkey',
        avaloniaui: 'Avalonia UI',
        axisbank: 'Axis Bank',
        babylondotjs: 'Babylon.js',
        backbonedotjs: 'Backbone.js',
        bankofamerica: 'Bank of America',
        bandsintown: 'Bandsintown',
        bandrautomation: 'B&R Automation',
        basicattentiontoken: 'Basic Attention Token',
        battledotnet: 'Battle.net',
        beatsbydre: 'Beats by Dre',
        beatstars: 'BeatStars',
        beekeeperstudio: 'Beekeeper Studio',
        beijingsubway: 'Beijing Subway',
        betterauth: 'Better Auth',
        betterdiscord: 'BetterDiscord',
        betterstack: 'Better Stack',
        bigbasket: 'BigBasket',
        bigbluebutton: 'BigBlueButton',
        bigcartel: 'Big Cartel',
        bigcommerce: 'BigCommerce',
        bisecthosting: 'BisectHosting',
        bitcoincash: 'Bitcoin Cash',
        bitcoinsv: 'Bitcoin SV',
        blackberry: 'BlackBerry',
        blackmagicdesign: 'Blackmagic Design',
        blockchaindotcom: 'Blockchain.com',
        boardgamegeek: 'BoardGameGeek',
        boehringeringelheim: 'Boehringer Ingelheim',
        bohemiainteractive: 'Bohemia Interactive',
        bookingdotcom: 'Booking.com',
        bookmeter: 'Bookmeter',
        bookmyshow: 'BookMyShow',
        bookstack: 'BookStack',
        botblecms: 'Botble CMS',
        boxysvg: 'Boxy SVG',
        brandfolder: 'Brandfolder',
        britishairways: 'British Airways',
        bugcrowd: 'Bugcrowd',
        buildkite: 'Buildkite',
        builtbybit: 'BuiltByBit',
        burgerking: 'Burger King',
        burpsuite: 'Burp Suite',
        buymeacoffee: 'Buy Me a Coffee',
        buysellads: 'BuySellAds',
        buzzfeed: 'BuzzFeed',
        bytedance: 'ByteDance',
        c: 'C',
        cachyos: 'CachyOS',
        cairographics: 'Cairo Graphics',
        cairometro: 'Cairo Metro',
        caixabank: 'CaixaBank',
        cakephp: 'CakePHP',
        caldotcom: 'Cal.com',
        campaignmonitor: 'Campaign Monitor',
        carlsberggroup: 'Carlsberg Group',
        cashapp: 'Cash App',
        chartdotjs: 'Chart.js',
        chessdotcom: 'Chess.com',
        chianetwork: 'Chia Network',
        chinaeasternairlines: 'China Eastern Airlines',
        chinarailway: 'China Railway',
        chinasouthernairlines: 'China Southern Airlines',
        chromewebstore: 'Chrome Web Store',
        cloudflarepages: 'Cloudflare Pages',
        cloudflareworkers: 'Cloudflare Workers',
        cloudfoundry: 'Cloud Foundry',
        cloudnativebuild: 'Cloud Native Build',
        codeblocks: 'Code::Blocks',
        codecademy: 'Codecademy',
        codeceptjs: 'CodeceptJS',
        codechef: 'CodeChef',
        codeclimate: 'Code Climate',
        codecrafters: 'CodeCrafters',
        codefactor: 'CodeFactor',
        codeforces: 'Codeforces',
        codefresh: 'Codefresh',
        codeigniter: 'CodeIgniter',
        codemagic: 'Codemagic',
        codementor: 'Codementor',
        codemirror: 'CodeMirror',
        codenewbie: 'CodeNewbie',
        codeproject: 'CodeProject',
        coderabbit: 'CodeRabbit',
        codersrank: 'CodersRank',
        codesandbox: 'CodeSandbox',
        codesignal: 'CodeSignal',
        codestream: 'CodeStream',
        codewars: 'Codewars',
        codingninjas: 'Coding Ninjas',
        coffeescript: 'CoffeeScript',
        coinmarketcap: 'CoinMarketCap',
        collaboraonline: 'Collabora Online',
        comicfury: 'Comic Fury',
        commonlisp: 'Common Lisp',
        commonworkflowlanguage: 'Common Workflow Language',
        compilerexplorer: 'Compiler Explorer',
        contactlesspayment: 'Contactless Payment',
        conventionalcommits: 'Conventional Commits',
        cookiecutter: 'Cookiecutter',
        coolermaster: 'Cooler Master',
        copaairlines: 'Copa Airlines',
        counterstrike: 'Counter-Strike',
        countingworkspro: 'CountingWorks Pro',
        cplusplus: 'C++',
        cplusplusbuilder: 'C++Builder',
        createreactapp: 'Create React App',
        creativecommons: 'Creative Commons',
        creativetechnology: 'Creative Technology',
        css: 'CSS',
        cssdesignawards: 'CSS Design Awards',
        cssmodules: 'CSS Modules',
        csswizardry: 'CSS Wizardry',
        curseforge: 'CurseForge',
        customink: 'Custom Ink',
        cyberdefenders: 'CyberDefenders',
        cytoscapedotjs: 'Cytoscape.js',
        d3: 'D3.js',
        dailydotdev: 'daily.dev',
        dailymotion: 'Dailymotion',
        darkreader: 'Dark Reader',
        dassaultsystemes: 'Dassault Systèmes',
        datadotai: 'Data.ai',
        datacamp: 'DataCamp',
        datefns: 'date-fns',
        davinciresolve: 'DaVinci Resolve',
        dazhongdianping: 'Dazhong Dianping',
        dcentertainment: 'DC Entertainment',
        debridlink: 'Debrid Link',
        decapcms: 'Decap CMS',
        deepcool: 'DeepCool',
        deepgram: 'Deepgram',
        dependencycheck: 'Dependency-Check',
        depositphotos: 'Depositphotos',
        derspiegel: 'Der Spiegel',
        deutschebahn: 'Deutsche Bahn',
        deutschebank: 'Deutsche Bank',
        deutschepost: 'Deutsche Post',
        deutschetelekom: 'Deutsche Telekom',
        deutschewelle: 'Deutsche Welle',
        developmentcontainers: 'Development Containers',
        deviantart: 'DeviantArt',
        devexpress: 'DevExpress',
        diagramsdotnet: 'diagrams.net',
        dialogflow: 'Dialogflow',
        dictionarydotcom: 'Dictionary.com',
        digikeyelectronics: 'Digi-Key Electronics',
        digitalocean: 'DigitalOcean',
        dinersclub: 'Diners Club',
        discorddotjs: 'Discord.js',
        docsdotrs: 'docs.rs',
        dotnet: '.NET',
        dota2: 'Dota 2',
        duckduckgo: 'DuckDuckGo',
        dungeonsanddragons: 'Dungeons & Dragons',
        e3: 'E3',
        eclipseadoptium: 'Eclipse Adoptium',
        eclipseche: 'Eclipse Che',
        eclipseide: 'Eclipse IDE',
        eclipsejetty: 'Eclipse Jetty',
        eclipsemosquitto: 'Eclipse Mosquitto',
        eclipsevertdotx: 'Eclipse Vert.x',
        edgeimpulse: 'Edge Impulse',
        editorconfig: 'EditorConfig',
        edotleclerc: 'E.Leclerc',
        eightsleep: 'Eight Sleep',
        electronbuilder: 'electron-builder',
        electronfiddle: 'Electron Fiddle',
        emberdotjs: 'Ember.js',
        endeavouros: 'EndeavourOS',
        enterprisedb: 'EnterpriseDB',
        envoyproxy: 'Envoy Proxy',
        epicgames: 'Epic Games',
        equinixmetal: 'Equinix Metal',
        esotericsoftware: 'Esoteric Software',
        ethiopianairlines: 'Ethiopian Airlines',
        etihadairways: 'Etihad Airways',
        europeanunion: 'European Union',
        eventstore: 'Event Store',
        everydotorg: 'Every.org',
        expressdotcom: 'Express.com',
        expressvpn: 'ExpressVPN',
        f1: 'F1',
        f5: 'F5',
        facebookgaming: 'Facebook Gaming',
        facebooklive: 'Facebook Live',
        fairphone: 'Fairphone',
        fareharbor: 'FareHarbor',
        fastapi: 'FastAPI',
        filedotio: 'File.io',
        filemaker: 'FileMaker',
        filezilla: 'FileZilla',
        fireflyiii: 'Firefly III',
        firefoxbrowser: 'Firefox Browser',
        flashforge: 'FlashForge',
        flathub: 'Flathub',
        flightaware: 'FlightAware',
        floatplane: 'Floatplane',
        fluentbit: 'Fluent Bit',
        fluentd: 'Fluentd',
        flydotio: 'Fly.io',
        fontawesome: 'Font Awesome',
        fontforge: 'FontForge',
        foodpanda: 'foodpanda',
        foundryvirtualtabletop: 'Foundry Virtual Tabletop',
        foursquare: 'Foursquare',
        fraunhofergesellschaft: 'Fraunhofer-Gesellschaft',
        freebsd: 'FreeBSD',
        freecad: 'FreeCAD',
        freecodecamp: 'freeCodeCamp',
        freedesktopdotorg: 'freedesktop.org',
        freelancermap: 'freelancermap',
        frontendmentor: 'Frontend Mentor',
        fusionauth: 'FusionAuth',
        futurelearn: 'FutureLearn',
        g2: 'G2',
        g2a: 'G2A',
        g2g: 'G2G',
        gamedeveloper: 'Game Developer',
        gamejolt: 'Game Jolt',
        gamemaker: 'GameMaker',
        gamescience: 'Game Science',
        garudalinux: 'Garuda Linux',
        geeksforgeeks: 'GeeksforGeeks',
        generalelectric: 'General Electric',
        generalmotors: 'General Motors',
        ghostfolio: 'Ghostfolio',
        gitconnected: 'gitconnected',
        gitextensions: 'Git Extensions',
        gitforwindows: 'Git for Windows',
        githubactions: 'GitHub Actions',
        githubcopilot: 'GitHub Copilot',
        githubpages: 'GitHub Pages',
        githubsponsors: 'GitHub Sponsors',
        gitignoredotio: 'gitignore.io',
        gitkraken: 'GitKraken',
        gldotinet: 'GL.iNet',
        gnometerminal: 'GNOME Terminal',
        gnuprivacyguard: 'GNU Privacy Guard',
        gnuicecat: 'GNU IceCat',
        godotengine: 'Godot Engine',
        gogdotcom: 'GOG.com',
        goldmansachs: 'Goldman Sachs',
        goodreads: 'Goodreads',
        googleadmob: 'Google AdMob',
        googleads: 'Google Ads',
        googleadsense: 'Google AdSense',
        googleanalytics: 'Google Analytics',
        googleappsscript: 'Google Apps Script',
        googleassistant: 'Google Assistant',
        googleauthenticator: 'Google Authenticator',
        googlebigquery: 'Google BigQuery',
        googlebigtable: 'Google Bigtable',
        googlecalendar: 'Google Calendar',
        googlecampaignmanager360: 'Google Campaign Manager 360',
        googlecardboard: 'Google Cardboard',
        googlecast: 'Google Cast',
        googlechat: 'Google Chat',
        googlechrome: 'Google Chrome',
        googlechronicle: 'Google Chronicle',
        googleclassroom: 'Google Classroom',
        googlecloud: 'Google Cloud',
        googlecloudcomposer: 'Google Cloud Composer',
        googlecloudspanner: 'Google Cloud Spanner',
        googlecloudstorage: 'Google Cloud Storage',
        googlecolab: 'Google Colab',
        googlecontaineroptimizedos: 'Google Container-Optimized OS',
        googledataflow: 'Google Dataflow',
        googledataproc: 'Google Dataproc',
        googledisplayandvideo360: 'Google Display & Video 360',
        googledocs: 'Google Docs',
        googledrive: 'Google Drive',
        googleearth: 'Google Earth',
        googleearthengine: 'Google Earth Engine',
        googlefonts: 'Google Fonts',
        googleforms: 'Google Forms',
        googlegemini: 'Google Gemini',
        googlehome: 'Google Home',
        googlejules: 'Google Jules',
        googlekeep: 'Google Keep',
        googlelens: 'Google Lens',
        googlemaps: 'Google Maps',
        googlemarketingplatform: 'Google Marketing Platform',
        googlemeet: 'Google Meet',
        googlemessages: 'Google Messages',
        googlenearby: 'Google Nearby',
        googlenews: 'Google News',
        googlepay: 'Google Pay',
        googlephotos: 'Google Photos',
        googleplay: 'Google Play',
        googlepubsub: 'Google Pub/Sub',
        googlescholar: 'Google Scholar',
        googlesearchconsole: 'Google Search Console',
        googlesheets: 'Google Sheets',
        googleslides: 'Google Slides',
        googlestreetview: 'Google Street View',
        googlesummerofcode: 'Google Summer of Code',
        googletagmanager: 'Google Tag Manager',
        googletasks: 'Google Tasks',
        googletranslate: 'Google Translate',
        googletv: 'Google TV',
        gotomeeting: 'GoTo Meeting',
        gradleplaypublisher: 'Gradle Play Publisher',
        grapheneos: 'GrapheneOS',
        greasyfork: 'Greasy Fork',
        greatlearning: 'Great Learning',
        greensock: 'GreenSock',
        greptimedb: 'GreptimeDB',
        griddotai: 'Grid.ai',
        guangzhoumetro: 'Guangzhou Metro',
        guitarpro: 'Guitar Pro',
        h2database: 'H2',
        h3: 'H3',
        hackerearth: 'HackerEarth',
        hackernoon: 'Hacker Noon',
        hackerone: 'HackerOne',
        hackerrank: 'HackerRank',
        hackthebox: 'Hack The Box',
        handlebarsdotjs: 'Handlebars.js',
        handm: 'H&M',
        handshake_protocol: 'Handshake Protocol',
        happycow: 'HappyCow',
        harmonyos: 'HarmonyOS',
        hatenabookmark: 'Hatena Bookmark',
        haveibeenpwned: 'Have I Been Pwned',
        hdfcbank: 'HDFC Bank',
        headlessui: 'Headless UI',
        headphonezone: 'Headphone Zone',
        hearthisdotat: 'hearthis.at',
        hellofresh: 'HelloFresh',
        hellyhansen: 'Helly Hansen',
        heroicgameslauncher: 'Heroic Games Launcher',
        hiltonhotelsandresorts: 'Hilton Hotels & Resorts',
        hive_blockchain: 'Hive Blockchain',
        homeadvisor: 'HomeAdvisor',
        homeassistant: 'Home Assistant',
        homeassistantcommunitystore: 'Home Assistant Community Store',
        honeybadger: 'Honeybadger',
        honeygain: 'Honeygain',
        hotelsdotcom: 'Hotels.com',
        html5: 'HTML5',
        hungryjacks: "Hungry Jack's",
        hyprland: 'Hyprland',
        i18next: 'i18next',
        i3: 'i3',
        icicibank: 'ICICI Bank',
        iledefrancemobilites: 'Île-de-France Mobilités',
        ilovepdf: 'iLovePDF',
        imagedotsc: 'Image.sc',
        imagetoolbox: 'Image Toolbox',
        immersivetranslate: 'Immersive Translate',
        indiansuperleague: 'Indian Super League',
        indiehackers: 'Indie Hackers',
        indieweb: 'IndieWeb',
        inductiveautomation: 'Inductive Automation',
        infinityfree: 'InfinityFree',
        intellijidea: 'IntelliJ IDEA',
        interactiondesignfoundation: 'Interaction Design Foundation',
        interactjs: 'interact.js',
        internetarchive: 'Internet Archive',
        internetcomputer: 'Internet Computer',
        invoiceninja: 'Invoice Ninja',
        itchdotio: 'itch.io',
        japanairlines: 'Japan Airlines',
        javascript: 'JavaScript',
        jetpackcompose: 'Jetpack Compose',
        jfrogpipelines: 'JFrog Pipelines',
        jirasoftware: 'Jira Software',
        johndeere: 'John Deere',
        jsonwebtokens: 'JSON Web Tokens',
        junipernetworks: 'Juniper Networks',
        junit5: 'JUnit 5',
        k3s: 'K3s',
        k6: 'k6',
        kalilinux: 'Kali Linux',
        karlsruherverkehrsverbund: 'Karlsruher Verkehrsverbund',
        kasasmart: 'Kasa Smart',
        kdeneon: 'KDE Neon',
        kdeplasma: 'KDE Plasma',
        keepachangelog: 'Keep a Changelog',
        khanacademy: 'Khan Academy',
        khronosgroup: 'Khronos Group',
        kingstontechnology: 'Kingston Technology',
        knowledgebase: 'Knowledge Base',
        knexdotjs: 'Knex.js',
        languagetool: 'LanguageTool',
        laravelhorizon: 'Laravel Horizon',
        laravelnova: 'Laravel Nova',
        lastdotfm: 'Last.fm',
        leagueoflegends: 'League of Legends',
        leaderprice: 'Leader Price',
        lefthook: 'Lefthook',
        legacygames: 'Legacy Games',
        lemonsqueezy: 'Lemon Squeezy',
        leroymerlin: 'Leroy Merlin',
        leslibraires: 'Les Libraires',
        letsencrypt: "Let's Encrypt",
        letterboxd: 'Letterboxd',
        levelsdotfyi: 'Levels.fyi',
        liberadotchat: 'Libera.Chat',
        librariesdotio: 'Libraries.io',
        librarything: 'LibraryThing',
        libreoffice: 'LibreOffice',
        libreofficebase: 'LibreOffice Base',
        libreofficecalc: 'LibreOffice Calc',
        libreofficedraw: 'LibreOffice Draw',
        libreofficeimpress: 'LibreOffice Impress',
        libreofficemath: 'LibreOffice Math',
        libreofficewriter: 'LibreOffice Writer',
        libretranslate: 'LibreTranslate',
        libretube: 'LibreTube',
        librewolf: 'LibreWolf',
        lineageos: 'LineageOS',
        linktree: 'Linktree',
        lintcode: 'LintCode',
        linuxcontainers: 'Linux Containers',
        linuxfoundation: 'Linux Foundation',
        linuxmint: 'Linux Mint',
        linuxprofessionalinstitute: 'Linux Professional Institute',
        linuxserver: 'LinuxServer',
        lionair: 'Lion Air',
        livechat: 'LiveChat',
        livejournal: 'LiveJournal',
        localsend: 'LocalSend',
        localxpose: 'LocalXpose',
        lotpolishairlines: 'LOT Polish Airlines',
        lottiefiles: 'LottieFiles',
        majorleaguehacking: 'Major League Hacking',
        makerbot: 'MakerBot',
        malwarebytes: 'Malwarebytes',
        mangacollec: 'Manga Collec',
        mangaupdates: 'Manga Updates',
        mariadbfoundation: 'MariaDB Foundation',
        materialdesign: 'Material Design',
        materialdesignicons: 'Material Design Icons',
        materialformkdocs: 'Material for MkDocs',
        maxplanckgesellschaft: 'Max Planck Gesellschaft',
        mcdonalds: "McDonald's",
        mdnwebdocs: 'MDN Web Docs',
        mediafire: 'MediaFire',
        mediamarkt: 'MediaMarkt',
        mediapipe: 'MediaPipe',
        medibangpaint: 'MediBang Paint',
        meilisearch: 'Meilisearch',
        mentorcruise: 'MentorCruise',
        mercadopago: 'Mercado Pago',
        metrodelaciudaddemexico: 'Metro de la Ciudad de México',
        metrodemadrid: 'Metro de Madrid',
        metrodeparis: 'Métro de Paris',
        microdotblog: 'Micro.blog',
        microeditor: 'micro editor',
        micropython: 'MicroPython',
        microstation: 'MicroStation',
        microstrategy: 'MicroStrategy',
        mingww64: 'MinGW-w64',
        mockserviceworker: 'Mock Service Worker',
        modelcontextprotocol: 'Model Context Protocol',
        mongoosedotws: 'Mongoose.ws',
        monkeytype: 'Monkeytype',
        moonrepo: 'moonrepo',
        moscowmetro: 'Moscow Metro',
        myanimelist: 'MyAnimeList',
        natsdotio: 'NATS.io',
        nederlandsespoorwegen: 'Nederlandse Spoorwegen',
        neteasecloudmusic: 'NetEase Cloud Music',
        neutralinojs: 'Neutralinojs',
        newbalance: 'New Balance',
        newgrounds: 'Newgrounds',
        newjapanprowrestling: 'New Japan Pro-Wrestling',
        newpipe: 'NewPipe',
        newrelic: 'New Relic',
        newyorktimes: 'New York Times',
        nextbilliondotai: 'NextBillion.ai',
        nextdns: 'NextDNS',
        nextdotjs: 'Next.js',
        nextcloud: 'Nextcloud',
        nginxproxymanager: 'Nginx Proxy Manager',
        nicehash: 'NiceHash',
        nixos: 'NixOS',
        nobaralinux: 'Nobara Linux',
        nodedotjs: 'Node.js',
        nordicsemiconductor: 'Nordic Semiconductor',
        normalizedotcss: 'Normalize.css',
        notepadplusplus: 'Notepad++',
        o2: 'O2',
        opencollective: 'Open Collective',
        opencontainersinitiative: 'Open Containers Initiative',
        opencritic: 'OpenCritic',
        openfaas: 'OpenFaaS',
        openjdk: 'OpenJDK',
        openjsfoundation: 'OpenJS Foundation',
        openlayers: 'OpenLayers',
        openmediavault: 'OpenMediaVault',
        openmined: 'OpenMined',
        opennebula: 'OpenNebula',
        openproject: 'OpenProject',
        openrouter: 'OpenRouter',
        opensearch: 'OpenSearch',
        opensourcehardware: 'Open Source Hardware',
        opensourceinitiative: 'Open Source Initiative',
        openstack: 'OpenStack',
        openstreetmap: 'OpenStreetMap',
        opensuse: 'openSUSE',
        opentelemetry: 'OpenTelemetry',
        opentext: 'OpenText',
        opentofu: 'OpenTofu',
        openverse: 'OpenVerse',
        openvpn: 'OpenVPN',
        openwrt: 'OpenWrt',
        openzeppelin: 'OpenZeppelin',
        openzfs: 'OpenZFS',
        operagx: 'Opera GX',
        p5dotjs: 'p5.js',
        paddlepaddle: 'PaddlePaddle',
        paddypower: 'Paddy Power',
        pagespeedinsights: 'PageSpeed Insights',
        paloaltonetworks: 'Palo Alto Networks',
        paloaltosoftware: 'Palo Alto Software',
        paperlessngx: 'Paperless-ngx',
        paperswithcode: 'Papers with Code',
        paradoxinteractive: 'Paradox Interactive',
        paramountplus: 'Paramount+',
        paritysubstrate: 'Parity Substrate',
        parrotsecurity: 'Parrot Security',
        parsedotly: 'Parse.ly',
        payloadcms: 'Payload CMS',
        pcgamingwiki: 'PCGamingWiki',
        peakdesign: 'Peak Design',
        philipshue: 'Philips Hue',
        phoenixframework: 'Phoenix Framework',
        phosphoricons: 'Phosphor Icons',
        photobucket: 'PhotoBucket',
        photocrowd: 'Photocrowd',
        picardsurgeles: 'Picard Surgelés',
        picartodottv: 'Picarto.tv',
        pinetwork: 'Pi Network',
        pioneerdj: 'Pioneer DJ',
        pivotaltracker: 'Pivotal Tracker',
        platformdotsh: 'Platform.sh',
        plausibleanalytics: 'Plausible Analytics',
        playcanvas: 'PlayCanvas',
        playerdotme: 'Player.me',
        playerfm: 'Player FM',
        playstation: 'PlayStation',
        playstation2: 'PlayStation 2',
        playstation3: 'PlayStation 3',
        playstation4: 'PlayStation 4',
        playstation5: 'PlayStation 5',
        playstationportable: 'PlayStation Portable',
        playstationvita: 'PlayStation Vita',
        pocketbase: 'PocketBase',
        pocketcasts: 'Pocket Casts',
        podcastaddict: 'Podcast Addict',
        podcastindex: 'Podcast Index',
        polymerproject: 'Polymer Project',
        portableappsdotcom: 'PortableApps.com',
        posthog: 'PostHog',
        postcss: 'PostCSS',
        premierleague: 'Premier League',
        primereact: 'PrimeReact',
        primevue: 'PrimeVue',
        privateinternetaccess: 'Private Internet Access',
        processingfoundation: 'Processing Foundation',
        processwire: 'ProcessWire',
        producthunt: 'Product Hunt',
        pronounsdotpage: 'Pronouns.page',
        protocolsdotio: 'Protocols.io',
        protodotio: 'Proto.io',
        protoncalendar: 'Proton Calendar',
        protondrive: 'Proton Drive',
        protonmail: 'Proton Mail',
        protonvpn: 'Proton VPN',
        qt: 'Qt',
        qatarairways: 'Qatar Airways',
        qubesos: 'Qubes OS',
        quickbooks: 'QuickBooks',
        r: 'R',
        r3: 'R3',
        raspberrypi: 'Raspberry Pi',
        reactbootstrap: 'React Bootstrap',
        reacthookform: 'React Hook Form',
        reactiveresume: 'Reactive Resume',
        reactquery: 'React Query',
        reactrouter: 'React Router',
        reacttable: 'React Table',
        readdotcv: 'Read.cv',
        readthedocs: 'Read the Docs',
        redbull: 'Red Bull',
        redcandlegames: 'Red Candle Games',
        redhatopenshift: 'Red Hat OpenShift',
        redhat: 'Red Hat',
        redwoodjs: 'RedwoodJS',
        refinedgithub: 'Refined GitHub',
        republicofgamers: 'Republic of Gamers',
        removedotbg: 'remove.bg',
        retroachievements: 'RetroAchievements',
        retroarch: 'RetroArch',
        retropie: 'RetroPie',
        revealdotjs: 'reveal.js',
        revoltdotchat: 'Revolt.chat',
        roadmapdotsh: 'roadmap.sh',
        roamresearch: 'Roam Research',
        robloxstudio: 'Roblox Studio',
        robotframework: 'Robot Framework',
        rocketdotchat: 'Rocket.Chat',
        rockstargames: 'Rockstar Games',
        rockwellautomation: 'Rockwell Automation',
        rockylinux: 'Rocky Linux',
        rollupdotjs: 'Rollup.js',
        rotaryinternational: 'Rotary International',
        rottentomatoes: 'Rotten Tomatoes',
        rubyonrails: 'Ruby on Rails',
        rubysinatra: 'Ruby Sinatra',
        runrundotit: 'Runrun.it',
        s7airlines: 'S7 Airlines',
        sahibinden: 'sahibinden',
        sailfishos: 'Sailfish OS',
        sailsdotjs: 'Sails.js',
        saltproject: 'Salt Project',
        samsclub: "Sam's Club",
        samsungpay: 'Samsung Pay',
        sanfranciscomunicipalrailway: 'San Francisco Municipal Railway',
        saopaulometro: 'São Paulo Metrô',
        schneiderelectric: 'Schneider Electric',
        scikitlearn: 'scikit-learn',
        scpfoundation: 'SCP Foundation',
        scrollreveal: 'ScrollReveal',
        scrumalliance: 'Scrum Alliance',
        scrutinizerci: 'Scrutinizer CI',
        securityscorecard: 'SecurityScorecard',
        semanticrelease: 'semantic-release',
        semanticscholar: 'Semantic Scholar',
        semanticui: 'Semantic UI',
        semanticuireact: 'Semantic UI React',
        semanticweb: 'Semantic Web',
        shanghaimetro: 'Shanghai Metro',
        shenzhenmetro: 'Shenzhen Metro',
        shieldsdotio: 'Shields.io',
        silverairways: 'Silver Airways',
        similarweb: 'SimilarWeb',
        simpleanalytics: 'Simple Analytics',
        simpleicons: 'Simple Icons',
        simplelocalize: 'SimpleLocalize',
        simplelogin: 'SimpleLogin',
        simplenote: 'Simplenote',
        sinaweibo: 'Sina Weibo',
        singaporeairlines: 'Singapore Airlines',
        singlestore: 'SingleStore',
        sitepoint: 'SitePoint',
        smartthings: 'SmartThings',
        smashingmagazine: 'Smashing Magazine',
        socialblade: 'Social Blade',
        socketdotio: 'Socket.io',
        soundcharts: 'Soundcharts',
        soundcloud: 'SoundCloud',
        sourceengine: 'Source Engine',
        sourceforge: 'SourceForge',
        sourcehut: 'SourceHut',
        sourcetree: 'Sourcetree',
        southwestairlines: 'Southwest Airlines',
        spidermonkey: 'SpiderMonkey',
        spigotmc: 'SpigotMC',
        spring_creators: 'Spring Creators',
        springboot: 'Spring Boot',
        springsecurity: 'Spring Security',
        spyderide: 'Spyder IDE',
        sqlalchemy: 'SQLAlchemy',
        squareenix: 'Square Enix',
        squarespace: 'Squarespace',
        stackblitz: 'StackBlitz',
        stackedit: 'StackEdit',
        stackexchange: 'Stack Exchange',
        stackhawk: 'StackHawk',
        stackoverflow: 'Stack Overflow',
        stackshare: 'StackShare',
        staffbase: 'Staffbase',
        stagetimer: 'Stagetimer',
        standardjs: 'StandardJS',
        standardresume: 'Standard Resume',
        starlingbank: 'Starling Bank',
        startdotgg: 'start.gg',
        startpage: 'Startpage',
        startrek: 'Star Trek',
        statuspage: 'Statuspage',
        statuspal: 'StatusPal',
        steamdeck: 'Steam Deck',
        steamworks: 'Steamworks',
        steelseries: 'SteelSeries',
        stmicroelectronics: 'STMicroelectronics',
        stopstalk: 'StopStalk',
        storyblok: 'Storyblok',
        storybook: 'Storybook',
        streamlabs: 'Streamlabs',
        streamlit: 'Streamlit',
        streamrunners: 'StreamRunners',
        strongswan: 'strongSwan',
        styledcomponents: 'styled-components',
        sublimetext: 'Sublime Text',
        subtitleedit: 'Subtitle Edit',
        superuser: 'Super User',
        svgdotjs: 'SVG.js',
        svgtrace: 'SVGtrace',
        tailwindcss: 'Tailwind CSS',
        taketwointeractivesoftware: 'Take-Two Interactive',
        tampermonkey: 'Tampermonkey',
        testinglibrary: 'Testing Library',
        threedotjs: 'Three.js',
        ticktick: 'TickTick',
        ticketmaster: 'Ticketmaster',
        tildapublishing: 'Tilda Publishing',
        timescale: 'Timescale',
        tinkercad: 'Tinkercad',
        tokyometro: 'Tokyo Metro',
        topdotgg: 'top.gg',
        torbrowser: 'Tor Browser',
        torproject: 'Tor Project',
        tradingview: 'TradingView',
        traefikmesh: 'Traefik Mesh',
        traefikproxy: 'Traefik Proxy',
        trailforks: 'Trailforks',
        trainerroad: 'TrainerRoad',
        transportforireland: 'Transport for Ireland',
        transportforlondon: 'Transport for London',
        treehouse: 'Treehouse',
        trendmicro: 'Trend Micro',
        tripadvisor: 'Tripadvisor',
        tripdotcom: 'Trip.com',
        tryitonline: 'Try It Online',
        tryhackme: 'TryHackMe',
        turkishairlines: 'Turkish Airlines',
        tuxedocomputers: 'TUXEDO Computers',
        tv4play: 'TV4 Play',
        typescript: 'TypeScript',
        ublockorigin: 'uBlock Origin',
        ubuntumate: 'Ubuntu MATE',
        udotsdotnews: 'U.S. News',
        underarmour: 'Under Armour',
        underscoredotjs: 'Underscore.js',
        unitedairlines: 'United Airlines',
        unitednations: 'United Nations',
        unrealengine: 'Unreal Engine',
        uptimekuma: 'Uptime Kuma',
        uservoice: 'UserVoice',
        v0: 'v0',
        v8: 'V8',
        vanillaextract: 'vanilla-extract',
        vaultwarden: 'Vaultwarden',
        vectorlogozone: 'Vector Logo Zone',
        victoriametrics: 'VictoriaMetrics',
        victronenergy: 'Victron Energy',
        virginatlantic: 'Virgin Atlantic',
        virginmedia: 'Virgin Media',
        virtualbox: 'VirtualBox',
        virustotal: 'VirusTotal',
        visualparadigm: 'Visual Paradigm',
        vlcmediaplayer: 'VLC Media Player',
        voidlinux: 'Void Linux',
        voipdotms: 'VoIP.ms',
        vorondesign: 'Voron Design',
        vowpalwabbit: 'Vowpal Wabbit',
        w3schools: 'W3Schools',
        walletconnect: 'WalletConnect',
        wappalyzer: 'Wappalyzer',
        wasmcloud: 'wasmCloud',
        watchtower: 'Watchtower',
        weatherchannel: 'The Weather Channel',
        web3dotjs: 'Web3.js',
        webassembly: 'WebAssembly',
        webcomponentsdotorg: 'webcomponents.org',
        webdotde: 'web.de',
        webdriverio: 'WebdriverIO',
        webmoney: 'WebMoney',
        weightsandbiases: 'Weights & Biases',
        welcometothejungle: 'Welcome to the Jungle',
        wellsfargo: 'Wells Fargo',
        westernunion: 'Western Union',
        what3words: 'what3words',
        wheniwork: 'When I Work',
        wikidotgg: 'Wiki.gg',
        wikidotjs: 'Wiki.js',
        wikimediacommons: 'Wikimedia Commons',
        wikimediafoundation: 'Wikimedia Foundation',
        wolframlanguage: 'Wolfram Language',
        wolframmathematica: 'Wolfram Mathematica',
        wondersharefilmora: 'Wondershare Filmora',
        woocommerce: 'WooCommerce',
        worldhealthorganization: 'World Health Organization',
        writedotas: 'Write.as',
        x: 'X',
        xdadevelopers: 'XDA Developers',
        xdotorg: 'X.Org',
        xiaohongshu: 'Xiaohongshu',
        yamahacorporation: 'Yamaha Corporation',
        yamahamotorcorporation: 'Yamaha Motor Corporation',
        yandexcloud: 'Yandex Cloud',
        ycombinator: 'Y Combinator',
        youtubegaming: 'YouTube Gaming',
        youtubekids: 'YouTube Kids',
        youtubemusic: 'YouTube Music',
        youtubeshorts: 'YouTube Shorts',
        youtubestudio: 'YouTube Studio',
        youtubetv: 'YouTube TV',
        zebratechnologies: 'Zebra Technologies',
        zedindustries: 'Zed Industries',
        zerotier: 'ZeroTier',
        zigbee2mqtt: 'Zigbee2MQTT'
    },

    getPresetMarkup() {
        return `
            <div class="logo-presets-panel">
                <input type="file" class="logo-upload-input" id="qrLogoInput" accept="image/png,image/jpeg,image/svg+xml">
                <div class="logo-presets-search">
                    <input type="search" class="form-input logo-presets-search-input" id="logoPresetSearchInput" placeholder="${I18n.translateString('Search logos')}" aria-label="${I18n.translateString('Filter logos by name')}">
                </div>
                <div class="logo-presets-grid" id="qrLogoPresets" data-logo-presets-rendered="false">
                    ${this.getBaseLogoTilesMarkup()}
                    ${this.getUploadedLogoTilesMarkup()}
                    <span hidden data-logo-preset-anchor="true"></span>
                </div>
                <div class="form-hint logo-presets-empty-state" id="logoPresetSearchEmpty" hidden>${I18n.translateString('No logos match your search.')}</div>
            </div>
        `;
    },

    getBaseLogoTilesMarkup() {
        return `
            <button type="button" class="logo-preset-button logo-preset-button-action" data-logo-action="clear" data-logo-preset-name="none remove clear" aria-label="${I18n.translateString('Clear logo')}">
                <span class="logo-preset-thumb logo-preset-thumb-action"></span>
                <span class="logo-preset-name">${I18n.translateString('None')}</span>
            </button>
            <button type="button" class="logo-preset-button logo-preset-button-action" data-logo-action="upload" data-logo-preset-name="upload custom file logo" aria-label="${I18n.translateString('Upload logo')}">
                <span class="logo-preset-thumb logo-preset-thumb-action logo-preset-thumb-upload">
                    <i class="bi bi-upload"></i>
                </span>
                <span class="logo-preset-name">${I18n.translateString('Upload logo')}</span>
            </button>
        `;
    },

    getPresetTilesMarkup() {
        const presets = this.getLogoPresets();

        presets.forEach(preset => {
            if (preset.hex) {
                const invert = !this.isLightColor(preset.hex);
                preset.thumbCls = invert ? ' logo-preset-thumb-branded logo-preset-thumb-invert' : ' logo-preset-thumb-branded';
                preset.thumbStyle = ` style="background-color: #${preset.hex}"`;
            } else {
                preset.thumbCls = '';
                preset.thumbStyle = '';
            }
        });

        return presets.map(preset => `
            <button type="button" class="logo-preset-button" data-logo-preset="${preset.id}" data-logo-preset-name="${`${preset.name} ${preset.slug || preset.id}`.toLowerCase()}" aria-label="${preset.name} logo preset">
                <span class="logo-preset-thumb${preset.thumbCls}"${preset.thumbStyle}>
                    <img src="${preset.dataUrl}" alt="${preset.name} logo preset" loading="lazy">
                </span>
                <span class="logo-preset-name">${preset.name}</span>
            </button>
        `).join('');
    },

    getLogoPresets() {
        if (this.logoPresets) {
            return this.logoPresets;
        }

        const manualPresets = [];

        if (!this.hasAssetPreset('twitter')) {
            manualPresets.push(this.createTwitterPreset());
        }

        if (!this.hasAssetPreset('linkedin')) {
            manualPresets.push(this.createLinkedInPreset());
        }

        if (!this.hasAssetPreset('outlook')) {
            manualPresets.push(this.createOutlookPreset());
        }

        if (this.hasAssetPreset('devdotto')) {
            manualPresets.push(this.createDevToPreset());
        }

        this.logoPresets = [
            ...manualPresets,
            ...this.createCatalogIconPresets()
        ];

        return this.logoPresets;
    },

    getAssetPresetSlugs() {
        return Array.isArray(window.QRCodeLogoPresetData)
            ? window.QRCodeLogoPresetData.map(entry => entry[0])
            : [];
    },

    getAssetPresetSlugSet() {
        if (!this.assetPresetSlugSet) {
            this.assetPresetSlugSet = new Set(this.getAssetPresetSlugs());
        }

        return this.assetPresetSlugSet;
    },

    hasAssetPreset(slug) {
        return this.getAssetPresetSlugSet().has(slug);
    },

    getAssetPresetHex(slug) {
        if (!this.assetPresetHexMap) {
            this.assetPresetHexMap = new Map(
                Array.isArray(window.QRCodeLogoPresetData) ? window.QRCodeLogoPresetData : []
            );
        }
        return this.assetPresetHexMap.get(slug) || '';
    },

    isLightColor(hex) {
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return (0.299 * r + 0.587 * g + 0.114 * b) > 186;
    },

    getAssetPresetName(slug) {
        if (this.assetPresetNameOverrides[slug]) {
            return this.assetPresetNameOverrides[slug];
        }

        const normalized = slug
            .replace(/_/g, ' ')
            .replace(/dotjs/g, '.js')
            .replace(/dotio/g, '.io')
            .replace(/dotcom/g, '.com')
            .replace(/dotorg/g, '.org')
            .replace(/dotnet/g, '.net')
            .replace(/dotrs/g, '.rs')
            .replace(/dotgg/g, '.gg')
            .replace(/dotcv/g, '.cv')
            .replace(/dotde/g, '.de')
            .replace(/dotas/g, '.as')
            .replace(/dotat/g, '.at')
            .replace(/dotco/g, '.co')
            .replace(/dotsh/g, '.sh')
            .replace(/dotlv/g, '.lv')
            .replace(/([0-9])([a-z])/gi, '$1 $2')
            .replace(/([a-z])([0-9])/gi, '$1 $2')
            .replace(/\s+/g, ' ')
            .trim();

        return normalized
            .split(' ')
            .filter(Boolean)
            .map(token => this.formatAssetPresetToken(token))
            .join(' ');
    },

    knownTLDs: new Set(['com', 'org', 'net', 'io', 'dev', 'gg', 'fm', 'tv', 'me', 'sh', 'rs', 'sc', 'ly', 'at', 'de', 'ws', 'ai', 'ms', 'it', 'as', 'bg', 'js', 'ts', 'css', 'chat', 'page', 'fyi']),

    formatAssetPresetToken(token) {
        if (!token) {
            return '';
        }

        if (token.includes('.')) {
            return token
                .split('.')
                .map((segment, index, arr) => {
                    if (!segment) {
                        return '';
                    }

                    if (index > 0 && this.knownTLDs.has(segment.toLowerCase())) {
                        return segment.toLowerCase();
                    }

                    if (segment.length <= 3) {
                        return segment.toUpperCase();
                    }

                    return index === 0
                        ? segment.charAt(0).toUpperCase() + segment.slice(1)
                        : segment.toLowerCase();
                })
                .join('.');
        }

        if (/^[0-9.+&-]+$/.test(token)) {
            return token;
        }

        if (token.length <= 3 && /^[a-z0-9.+&-]+$/i.test(token)) {
            return token.toUpperCase();
        }

        return token.charAt(0).toUpperCase() + token.slice(1);
    },

    createContainedIconPreset({
        id,
        name,
        backgroundMarkup = '',
        iconMarkup,
        iconWidth,
        iconHeight,
        box = { x: 18, y: 18, width: 60, height: 60 }
    }) {
        const scale = Math.min(box.width / iconWidth, box.height / iconHeight);
        const translateX = box.x + ((box.width - (iconWidth * scale)) / 2);
        const translateY = box.y + ((box.height - (iconHeight * scale)) / 2);
        const svg = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" width="96" height="96">
                ${backgroundMarkup}
                <g transform="translate(${translateX.toFixed(2)} ${translateY.toFixed(2)}) scale(${scale.toFixed(4)})">
                    ${iconMarkup}
                </g>
            </svg>
        `;

        return { id, name, contained: true, dataUrl: this.svgToDataUrl(svg) };
    },

    createTextBadgePreset({
        id,
        name,
        text,
        background = '#111111',
        foreground = '#ffffff',
        shape = 'rounded'
    }) {
        const frameMarkup = shape === 'circle'
            ? `<circle cx="48" cy="48" r="42" fill="${background}"/>`
            : `<rect x="12" y="12" width="72" height="72" rx="18" fill="${background}"/>`;
        const fontSize = text.length >= 4 ? 23 : text.length === 3 ? 27 : text.length === 2 ? 32 : 40;
        const svg = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" width="96" height="96">
                ${frameMarkup}
                <text x="48" y="54" text-anchor="middle" dominant-baseline="middle" fill="${foreground}" font-size="${fontSize}" font-weight="700" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif" letter-spacing="${text.length >= 3 ? '-1.2' : '-0.6'}">${text}</text>
            </svg>
        `;

        return { id, name, dataUrl: this.svgToDataUrl(svg) };
    },

    createAssetSvgPreset({ id, name, slug = id, hex = '' }) {
        const presetId = id || slug;
        return {
            id: presetId,
            slug,
            name,
            hex,
            dataUrl: `${this.ICONS_ASSET_PATH}/${slug}.svg`
        };
    },

    createCatalogIconPresets() {
        const data = Array.isArray(window.QRCodeLogoPresetData) ? window.QRCodeLogoPresetData : [];
        return data.map(([slug, hex]) => this.createAssetSvgPreset({
            id: slug,
            slug,
            hex: hex || '',
            name: this.getAssetPresetName(slug)
        }));
    },

    createTwitterPreset() {
        return this.createContainedIconPreset({
            id: 'twitter',
            name: 'Twitter',
            backgroundMarkup: '<circle cx="48" cy="48" r="42" fill="#1d9bf0"/>',
            iconWidth: 512,
            iconHeight: 512,
            box: { x: 22, y: 22, width: 52, height: 52 },
            iconMarkup: '<path fill="#ffffff" d="M459.4 151.7c.3 4.5 .3 9.1 .3 13.6 0 138.7-105.6 298.6-298.6 298.6-59.5 0-114.7-17.2-161.1-47.1 8.4 1 16.6 1.3 25.3 1.3 49.1 0 94.2-16.6 130.3-44.8-46.1-1-84.8-31.2-98.1-72.8 6.5 1 13 1.6 19.8 1.6 9.4 0 18.8-1.3 27.6-3.6-48.1-9.7-84.1-52-84.1-103l0-1.3c14 7.8 30.2 12.7 47.4 13.3-28.3-18.8-46.8-51-46.8-87.4 0-19.5 5.2-37.4 14.3-53 51.7 63.7 129.3 105.3 216.4 109.8-1.6-7.8-2.6-15.9-2.6-24 0-57.8 46.8-104.9 104.9-104.9 30.2 0 57.5 12.7 76.7 33.1 23.7-4.5 46.5-13.3 66.6-25.3-7.8 24.4-24.4 44.8-46.1 57.8 21.1-2.3 41.6-8.1 60.4-16.2-14.3 20.8-32.2 39.3-52.6 54.3z"/>'
        });
    },

    createXPreset() {
        return this.createContainedIconPreset({
            id: 'x',
            name: 'X',
            backgroundMarkup: '<circle cx="48" cy="48" r="42" fill="#111111"/>',
            iconWidth: 448,
            iconHeight: 512,
            box: { x: 23, y: 21, width: 50, height: 54 },
            iconMarkup: '<path fill="#ffffff" d="M357.2 48L427.8 48 273.6 224.2 455 464 313 464 201.7 318.6 74.5 464 3.8 464 168.7 275.5-5.2 48 140.4 48 240.9 180.9 357.2 48zM332.4 421.8l39.1 0-252.4-333.8-42 0 255.3 333.8z"/>'
        });
    },

    createYouTubePreset() {
        return this.createContainedIconPreset({
            id: 'youtube',
            name: 'YouTube',
            backgroundMarkup: '<rect x="18" y="25" width="60" height="42" rx="14" fill="#ffffff"/>',
            iconWidth: 576,
            iconHeight: 512,
            box: { x: 18, y: 25, width: 60, height: 42 },
            iconMarkup: '<path fill="#ff0000" d="M549.7 124.1C543.5 100.4 524.9 81.8 501.4 75.5 458.9 64 288.1 64 288.1 64S117.3 64 74.7 75.5C51.2 81.8 32.7 100.4 26.4 124.1 15 167 15 256.4 15 256.4s0 89.4 11.4 132.3c6.3 23.6 24.8 41.5 48.3 47.8 42.6 11.5 213.4 11.5 213.4 11.5s170.8 0 213.4-11.5c23.5-6.3 42-24.2 48.3-47.8 11.4-42.9 11.4-132.3 11.4-132.3s0-89.4-11.4-132.3zM232.2 337.6l0-162.4 142.7 81.2-142.7 81.2z"/>'
        });
    },

    createInstagramPreset() {
        return this.createContainedIconPreset({
            id: 'instagram',
            name: 'Instagram',
            backgroundMarkup: `
                <defs>
                    <linearGradient id="igGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stop-color="#feda75"/>
                        <stop offset="45%" stop-color="#fa7e1e"/>
                        <stop offset="75%" stop-color="#d62976"/>
                        <stop offset="100%" stop-color="#4f5bd5"/>
                    </linearGradient>
                </defs>
                <rect x="10" y="10" width="76" height="76" rx="22" fill="url(#igGradient)"/>
            `,
            iconWidth: 24,
            iconHeight: 24,
            box: { x: 23, y: 23, width: 50, height: 50 },
            iconMarkup: '<path fill="#ffffff" d="M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077"/>'
        });
    },

    createTikTokPreset() {
        return this.createContainedIconPreset({
            id: 'tiktok',
            name: 'TikTok',
            backgroundMarkup: '<rect x="12" y="12" width="72" height="72" rx="18" fill="#111111"/>',
            iconWidth: 24,
            iconHeight: 24,
            box: { x: 24, y: 18, width: 48, height: 60 },
            iconMarkup: `
                <path fill="#25f4ee" transform="translate(-0.55 -0.35)" d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                <path fill="#fe2c55" transform="translate(0.55 0.35)" d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                <path fill="#ffffff" d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
            `
        });
    },

    createLinkedInPreset() {
        return this.createContainedIconPreset({
            id: 'linkedin',
            name: 'LinkedIn',
            backgroundMarkup: '<rect x="14" y="14" width="68" height="68" rx="16" fill="#0a66c2"/>',
            iconWidth: 448,
            iconHeight: 512,
            box: { x: 24, y: 20, width: 48, height: 56 },
            iconMarkup: '<path fill="#ffffff" d="M100.3 448l-92.9 0 0-299.1 92.9 0 0 299.1zM53.8 108.1C24.1 108.1 0 83.5 0 53.8 0 39.5 5.7 25.9 15.8 15.8s23.8-15.8 38-15.8 27.9 5.7 38 15.8 15.8 23.8 15.8 38c0 29.7-24.1 54.3-53.8 54.3zM447.9 448l-92.7 0 0-145.6c0-34.7-.7-79.2-48.3-79.2-48.3 0-55.7 37.7-55.7 76.7l0 148.1-92.8 0 0-299.1 89.1 0 0 40.8 1.3 0c12.4-23.5 42.7-48.3 87.9-48.3 94 0 111.3 61.9 111.3 142.3l0 164.3-.1 0z"/>'
        });
    },

    createSnapchatPreset() {
        return this.createContainedIconPreset({
            id: 'snapchat',
            name: 'Snapchat',
            backgroundMarkup: '<circle cx="48" cy="48" r="42" fill="#fffc00"/>',
            iconWidth: 24,
            iconHeight: 24,
            box: { x: 20, y: 19, width: 56, height: 58 },
            iconMarkup: '<path fill="#111111" d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301.165-.088.344-.104.464-.104.182 0 .359.029.509.09.45.149.734.479.734.838.015.449-.39.839-1.213 1.168-.089.029-.209.075-.344.119-.45.135-1.139.36-1.333.81-.09.224-.061.524.12.868l.015.015c.06.136 1.526 3.475 4.791 4.014.255.044.435.27.42.509 0 .075-.015.149-.045.225-.24.569-1.273.988-3.146 1.271-.059.091-.12.375-.164.57-.029.179-.074.36-.134.553-.076.271-.27.405-.555.405h-.03c-.135 0-.313-.031-.538-.074-.36-.075-.765-.135-1.273-.135-.3 0-.599.015-.913.074-.6.104-1.123.464-1.723.884-.853.599-1.826 1.288-3.294 1.288-.06 0-.119-.015-.18-.015h-.149c-1.468 0-2.427-.675-3.279-1.288-.599-.42-1.107-.779-1.707-.884-.314-.045-.629-.074-.928-.074-.54 0-.958.089-1.272.149-.211.043-.391.074-.54.074-.374 0-.523-.224-.583-.42-.061-.192-.09-.389-.135-.567-.046-.181-.105-.494-.166-.57-1.918-.222-2.95-.642-3.189-1.226-.031-.063-.052-.15-.055-.225-.015-.243.165-.465.42-.509 3.264-.54 4.73-3.879 4.791-4.02l.016-.029c.18-.345.224-.645.119-.869-.195-.434-.884-.658-1.332-.809-.121-.029-.24-.074-.346-.119-1.107-.435-1.257-.93-1.197-1.273.09-.479.674-.793 1.168-.793.146 0 .27.029.383.074.42.194.789.3 1.104.3.234 0 .384-.06.465-.105l-.046-.569c-.098-1.626-.225-3.651.307-4.837C7.392 1.077 10.739.807 11.727.807l.419-.015h.06z"/>'
        });
    },

    createPinterestPreset() {
        return this.createContainedIconPreset({
            id: 'pinterest',
            name: 'Pinterest',
            backgroundMarkup: '<circle cx="48" cy="48" r="42" fill="#e60023"/>',
            iconWidth: 384,
            iconHeight: 512,
            box: { x: 28, y: 18, width: 40, height: 58 },
            iconMarkup: '<path fill="#ffffff" d="M204 6.5c-102.6 0-204 68.4-204 179.1 0 70.4 39.6 110.4 63.6 110.4 9.9 0 15.6-27.6 15.6-35.4 0-9.3-23.7-29.1-23.7-67.8 0-80.4 61.2-137.4 140.4-137.4 68.1 0 118.5 38.7 118.5 109.8 0 53.1-21.3 152.7-90.3 152.7-24.9 0-46.2-18-46.2-43.8 0-37.8 26.4-74.4 26.4-113.4 0-66.2-93.9-54.2-93.9 25.8 0 16.8 2.1 35.4 9.6 50.7-13.8 59.4-42 147.9-42 209.1 0 18.9 2.7 37.5 4.5 56.4 3.4 3.8 1.7 3.4 6.9 1.5 50.4-69 48.6-82.5 71.4-172.8 12.3 23.4 44.1 36 69.3 36 106.2 0 153.9-103.5 153.9-196.8 0-99.3-85.8-164.1-180-164.1z"/>'
        });
    },

    createRedditPreset() {
        return this.createContainedIconPreset({
            id: 'reddit',
            name: 'Reddit',
            backgroundMarkup: '<circle cx="48" cy="48" r="42" fill="#ff4500"/>',
            iconWidth: 24,
            iconHeight: 24,
            box: { x: 18, y: 18, width: 60, height: 60 },
            iconMarkup: '<path fill="#ffffff" d="M12 0C5.373 0 .029 5.373.029 12c0 3.314 1.343 6.314 3.515 8.485l-2.286 2.286C.775 23.225 1.097 24 1.738 24H12c6.627 0 12-5.373 12-12S18.627 0 12 0Zm4.388 3.199c1.104 0 1.999.895 1.999 1.999 0 1.105-.895 2-1.999 2-.946 0-1.739-.657-1.947-1.539v.002c-1.147.162-2.032 1.15-2.032 2.341v.007c1.776.067 3.4.567 4.686 1.363.473-.363 1.064-.58 1.707-.58 1.547 0 2.802 1.254 2.802 2.802 0 1.117-.655 2.081-1.601 2.531-.088 3.256-3.637 5.876-7.997 5.876-4.361 0-7.905-2.617-7.998-5.87-.954-.447-1.614-1.415-1.614-2.538 0-1.548 1.255-2.802 2.803-2.802.645 0 1.239.218 1.712.585 1.275-.79 2.881-1.291 4.64-1.365v-.01c0-1.663 1.263-3.034 2.88-3.207.188-.911.993-1.595 1.959-1.595Zm-8.085 8.376c-.784 0-1.459.78-1.506 1.797-.047 1.016.64 1.429 1.426 1.429.786 0 1.371-.369 1.418-1.385.047-1.017-.553-1.841-1.338-1.841Zm7.406 0c-.786 0-1.385.824-1.338 1.841.047 1.017.634 1.385 1.418 1.385.785 0 1.473-.413 1.426-1.429-.046-1.017-.721-1.797-1.506-1.797Zm-3.703 4.013c-.974 0-1.907.048-2.77.135-.147.015-.241.168-.183.305.483 1.154 1.622 1.964 2.953 1.964 1.33 0 2.47-.81 2.953-1.964.057-.137-.037-.29-.184-.305-.863-.087-1.795-.135-2.769-.135Z"/>'
        });
    },

    createDiscordPreset() {
        return this.createContainedIconPreset({
            id: 'discord',
            name: 'Discord',
            backgroundMarkup: '<rect x="12" y="12" width="72" height="72" rx="18" fill="#5865f2"/>',
            iconWidth: 24,
            iconHeight: 24,
            box: { x: 18, y: 20, width: 60, height: 56 },
            iconMarkup: '<path fill="#ffffff" d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>'
        });
    },

    createBlueskyPreset() {
        return this.createContainedIconPreset({
            id: 'bluesky',
            name: 'Bluesky',
            backgroundMarkup: '<circle cx="48" cy="48" r="42" fill="#0285ff"/>',
            iconWidth: 24,
            iconHeight: 24,
            box: { x: 18, y: 20, width: 60, height: 56 },
            iconMarkup: '<path fill="#ffffff" d="M5.202 2.857C7.954 4.922 10.913 9.11 12 11.358c1.087-2.247 4.046-6.436 6.798-8.501C20.783 1.366 24 .213 24 3.883c0 .732-.42 6.156-.667 7.037-.856 3.061-3.978 3.842-6.755 3.37 4.854.826 6.089 3.562 3.422 6.299-5.065 5.196-7.28-1.304-7.847-2.97-.104-.305-.152-.448-.153-.327 0-.121-.05.022-.153.327-.568 1.666-2.782 8.166-7.847 2.97-2.667-2.737-1.432-5.473 3.422-6.3-2.777.473-5.899-.308-6.755-3.369C.42 10.04 0 4.615 0 3.883c0-3.67 3.217-2.517 5.202-1.026"/>'
        });
    },

    createMastodonPreset() {
        return this.createContainedIconPreset({
            id: 'mastodon',
            name: 'Mastodon',
            backgroundMarkup: '<rect x="12" y="12" width="72" height="72" rx="18" fill="#6364ff"/>',
            iconWidth: 24,
            iconHeight: 24,
            box: { x: 18, y: 18, width: 60, height: 60 },
            iconMarkup: '<path fill="#ffffff" d="M23.268 5.313c-.35-2.578-2.617-4.61-5.304-5.004C17.51.242 15.792 0 11.813 0h-.03c-3.98 0-4.835.242-5.288.309C3.882.692 1.496 2.518.917 5.127.64 6.412.61 7.837.661 9.143c.074 1.874.088 3.745.26 5.611.118 1.24.325 2.47.62 3.68.55 2.237 2.777 4.098 4.96 4.857 2.336.792 4.849.923 7.256.38.265-.061.527-.132.786-.213.585-.184 1.27-.39 1.774-.753a.057.057 0 0 0 .023-.043v-1.809a.052.052 0 0 0-.02-.041.053.053 0 0 0-.046-.01 20.282 20.282 0 0 1-4.709.545c-2.73 0-3.463-1.284-3.674-1.818a5.593 5.593 0 0 1-.319-1.433.053.053 0 0 1 .066-.054c1.517.363 3.072.546 4.632.546.376 0 .75 0 1.125-.01 1.57-.044 3.224-.124 4.768-.422.038-.008.077-.015.11-.024 2.435-.464 4.753-1.92 4.989-5.604.008-.145.03-1.52.03-1.67.002-.512.167-3.63-.024-5.545zm-3.748 9.195h-2.561V8.29c0-1.309-.55-1.976-1.67-1.976-1.23 0-1.846.79-1.846 2.35v3.403h-2.546V8.663c0-1.56-.617-2.35-1.848-2.35-1.112 0-1.668.668-1.67 1.977v6.218H4.822V8.102c0-1.31.337-2.35 1.011-3.12.696-.77 1.608-1.164 2.74-1.164 1.311 0 2.302.5 2.962 1.498l.638 1.06.638-1.06c.66-.999 1.65-1.498 2.96-1.498 1.13 0 2.043.395 2.74 1.164.675.77 1.012 1.81 1.012 3.12z"/>'
        });
    },

    createOutlookPreset() {
        const svg = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" width="96" height="96">
                <rect x="10" y="18" width="30" height="60" rx="8" fill="#0f5bd7"/>
                <rect x="36" y="24" width="46" height="48" rx="9" fill="#1f8fff"/>
                <rect x="42" y="30" width="34" height="36" rx="6" fill="#0f78d4"/>
                <path d="M45 36l14 12 14-12" fill="none" stroke="#ffffff" stroke-width="4.4" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M45 60l11-9" fill="none" stroke="#8ed0ff" stroke-width="3" stroke-linecap="round"/>
                <path d="M73 60l-11-9" fill="none" stroke="#8ed0ff" stroke-width="3" stroke-linecap="round"/>
                <circle cx="25" cy="48" r="10" fill="none" stroke="#ffffff" stroke-width="5"/>
            </svg>
        `;

        return { id: 'outlook', name: 'Outlook', dataUrl: this.svgToDataUrl(svg) };
    },

    createTelegramPreset() {
        return this.createContainedIconPreset({
            id: 'telegram',
            name: 'Telegram',
            backgroundMarkup: '<circle cx="48" cy="48" r="42" fill="#27a7e7"/>',
            iconWidth: 24,
            iconHeight: 24,
            box: { x: 19, y: 19, width: 58, height: 58 },
            iconMarkup: '<path fill="#ffffff" d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>'
        });
    },

    createApplePreset() {
        return this.createContainedIconPreset({
            id: 'apple',
            name: 'Apple',
            backgroundMarkup: '<circle cx="48" cy="48" r="42" fill="#111111"/>',
            iconWidth: 384,
            iconHeight: 512,
            box: { x: 26, y: 18, width: 44, height: 58 },
            iconMarkup: '<path fill="#ffffff" d="M319.1 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7-55.8 .9-115.1 44.5-115.1 133.2 0 26.2 4.8 53.3 14.4 81.2 12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zM262.5 104.5c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>'
        });
    },

    createGmailPreset() {
        const svg = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" width="96" height="96">
                <rect x="10" y="14" width="76" height="68" rx="18" fill="#ffffff" stroke="#e5e7eb" stroke-width="2.5"/>
                <path d="M24 68V30l24 18 24-18v38" fill="none" stroke="#ea4335" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M24 68V30" fill="none" stroke="#4285f4" stroke-width="7" stroke-linecap="round"/>
                <path d="M72 68V30" fill="none" stroke="#34a853" stroke-width="7" stroke-linecap="round"/>
                <path d="M24 30l24 18 24-18" fill="none" stroke="#fbbc05" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;

        return { id: 'gmail', name: 'Gmail', dataUrl: this.svgToDataUrl(svg) };
    },

    createWhatsAppPreset() {
        return this.createContainedIconPreset({
            id: 'whatsapp',
            name: 'WhatsApp',
            backgroundMarkup: '<circle cx="48" cy="48" r="42" fill="#ffffff"/>',
            iconWidth: 24,
            iconHeight: 24,
            box: { x: 18, y: 18, width: 60, height: 60 },
            iconMarkup: '<path fill="#25d366" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>'
        });
    },

    createFacebookPreset() {
        return this.createContainedIconPreset({
            id: 'facebook',
            name: 'Facebook',
            backgroundMarkup: '<circle cx="48" cy="48" r="42" fill="#1877f2"/>',
            iconWidth: 320,
            iconHeight: 512,
            box: { x: 31, y: 19, width: 34, height: 58 },
            iconMarkup: '<path fill="#ffffff" d="M80 299.3l0 212.7 116 0 0-212.7 86.5 0 18-97.8-104.5 0 0-34.6c0-51.7 20.3-71.5 72.7-71.5 16.3 0 29.4 .4 37 1.2l0-88.7C291.4 4 256.4 0 236.2 0 129.3 0 80 50.5 80 159.4l0 42.1-66 0 0 97.8 66 0z"/>'
        });
    },

    createGitHubPreset() {
        return this.createContainedIconPreset({
            id: 'github',
            name: 'GitHub',
            backgroundMarkup: '<circle cx="48" cy="48" r="42" fill="#111111"/>',
            iconWidth: 24,
            iconHeight: 24,
            box: { x: 19, y: 19, width: 58, height: 58 },
            iconMarkup: '<path fill="#ffffff" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>'
        });
    },

    createMessengerPreset() {
        return this.createContainedIconPreset({
            id: 'messenger',
            name: 'Messenger',
            backgroundMarkup: '<circle cx="48" cy="48" r="42" fill="#0084ff"/>',
            iconWidth: 24,
            iconHeight: 24,
            box: { x: 18, y: 18, width: 60, height: 60 },
            iconMarkup: '<path fill="#ffffff" d="M12 0C5.24 0 0 4.952 0 11.64c0 3.499 1.434 6.521 3.769 8.61a.96.96 0 0 1 .323.683l.065 2.135a.96.96 0 0 0 1.347.85l2.381-1.053a.96.96 0 0 1 .641-.046A13 13 0 0 0 12 23.28c6.76 0 12-4.952 12-11.64S18.76 0 12 0m6.806 7.44c.522-.03.971.567.63 1.094l-4.178 6.457a.707.707 0 0 1-.977.208l-3.87-2.504a.44.44 0 0 0-.49.007l-4.363 3.01c-.637.438-1.415-.317-.995-.966l4.179-6.457a.706.706 0 0 1 .977-.21l3.87 2.505c.15.097.344.094.491-.007l4.362-3.008a.7.7 0 0 1 .364-.13"/>'
        });
    },

    createTumblrPreset() {
        return this.createContainedIconPreset({
            id: 'tumblr',
            name: 'Tumblr',
            backgroundMarkup: '<rect x="12" y="12" width="72" height="72" rx="18" fill="#001935"/>',
            iconWidth: 24,
            iconHeight: 24,
            box: { x: 27, y: 18, width: 42, height: 60 },
            iconMarkup: '<path fill="#ffffff" d="M14.563 24c-5.093 0-7.031-3.756-7.031-6.411V9.747H5.116V6.648c3.63-1.313 4.512-4.596 4.71-6.469C9.84.051 9.941 0 9.999 0h3.517v6.114h4.801v3.633h-4.82v7.47c.016 1.001.375 2.371 2.207 2.371h.09c.631-.02 1.486-.205 1.936-.419l1.156 3.425c-.436.636-2.4 1.374-4.156 1.404h-.178l.011.002z"/>'
        });
    },

    createTwitchPreset() {
        return this.createContainedIconPreset({
            id: 'twitch',
            name: 'Twitch',
            backgroundMarkup: '<rect x="12" y="12" width="72" height="72" rx="16" fill="#9146ff"/>',
            iconWidth: 24,
            iconHeight: 24,
            box: { x: 17, y: 16, width: 62, height: 62 },
            iconMarkup: '<path fill="#ffffff" d="M11.571 4.714h1.715v5.143H11.57zm4.715 0H18v5.143h-1.714zM6 0L1.714 4.286v15.428h5.143V24l4.286-4.286h3.428L22.286 12V0zm14.571 11.143l-3.428 3.428h-3.429l-3 3v-3H6.857V1.714h13.714Z"/>'
        });
    },

    createThreadsPreset() {
        return this.createContainedIconPreset({
            id: 'threads',
            name: 'Threads',
            backgroundMarkup: '<circle cx="48" cy="48" r="42" fill="#111111"/>',
            iconWidth: 24,
            iconHeight: 24,
            box: { x: 18, y: 18, width: 60, height: 60 },
            iconMarkup: '<path fill="#ffffff" d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142c-.126-.742-.375-1.332-.75-1.757-.513-.586-1.308-.883-2.359-.89h-.029c-.844 0-1.992.232-2.721 1.32L7.734 7.847c.98-1.454 2.568-2.256 4.478-2.256h.044c3.194.02 5.097 1.975 5.287 5.388.108.046.216.094.321.142 1.49.7 2.58 1.761 3.154 3.07.797 1.82.871 4.79-1.548 7.158-1.85 1.81-4.094 2.628-7.277 2.65Zm1.003-11.69c-.242 0-.487.007-.739.021-1.836.103-2.98.946-2.916 2.143.067 1.256 1.452 1.839 2.784 1.767 1.224-.065 2.818-.543 3.086-3.71a10.5 10.5 0 0 0-2.215-.221z"/>'
        });
    },

    createMediumPreset() {
        return this.createContainedIconPreset({
            id: 'medium',
            name: 'Medium',
            backgroundMarkup: '<rect x="12" y="12" width="72" height="72" rx="18" fill="#ffffff"/>',
            iconWidth: 24,
            iconHeight: 24,
            box: { x: 16, y: 16, width: 64, height: 64 },
            iconMarkup: '<path fill="#111111" d="M4.21 0A4.201 4.201 0 0 0 0 4.21v15.58A4.201 4.201 0 0 0 4.21 24h15.58A4.201 4.201 0 0 0 24 19.79v-1.093c-.137.013-.278.02-.422.02-2.577 0-4.027-2.146-4.09-4.832a7.592 7.592 0 0 1 .022-.708c.093-1.186.475-2.241 1.105-3.022a3.885 3.885 0 0 1 1.395-1.1c.468-.237 1.127-.367 1.664-.367h.023c.101 0 .202.004.303.01V4.211A4.201 4.201 0 0 0 19.79 0Zm.198 5.583h4.165l3.588 8.435 3.59-8.435h3.864v.146l-.019.004c-.705.16-1.063.397-1.063 1.254h-.003l.003 10.274c.06.676.424.885 1.063 1.03l.02.004v.145h-4.923v-.145l.019-.005c.639-.144.994-.353 1.054-1.03V7.267l-4.745 11.15h-.261L6.15 7.569v9.445c0 .857.358 1.094 1.063 1.253l.02.004v.147H4.405v-.147l.019-.004c.705-.16 1.065-.397 1.065-1.253V6.987c0-.857-.358-1.094-1.064-1.254l-.018-.004zm19.25 3.668c-1.086.023-1.733 1.323-1.813 3.124H24V9.298a1.378 1.378 0 0 0-.342-.047Zm-1.862 3.632c-.1 1.756.86 3.239 2.204 3.634v-3.634z"/>'
        });
    },

    createBehancePreset() {
        return this.createAssetSvgPreset({
            id: 'behance',
            name: 'Behance',
            slug: 'behance',
            hex: this.getAssetPresetHex('behance')
        });
    },

    createDribbblePreset() {
        return this.createAssetSvgPreset({
            id: 'dribbble',
            name: 'Dribbble',
            slug: 'dribbble',
            hex: this.getAssetPresetHex('dribbble')
        });
    },

    createPatreonPreset() {
        return this.createAssetSvgPreset({
            id: 'patreon',
            name: 'Patreon',
            slug: 'patreon',
            hex: this.getAssetPresetHex('patreon')
        });
    },

    createDevToPreset() {
        return this.createAssetSvgPreset({
            id: 'devto',
            name: 'DEV',
            slug: 'devdotto',
            hex: this.getAssetPresetHex('devdotto')
        });
    },

    createSubstackPreset() {
        return this.createAssetSvgPreset({
            id: 'substack',
            name: 'Substack',
            slug: 'substack',
            hex: this.getAssetPresetHex('substack')
        });
    },

    createNetflixPreset() {
        return this.createAssetSvgPreset({
            id: 'netflix',
            name: 'Netflix',
            slug: 'netflix',
            hex: this.getAssetPresetHex('netflix')
        });
    },

    svgToDataUrl(svg) {
        return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg.replace(/\s{2,}/g, ' ').trim())}`;
    },

    getAvailableLogoShapes() {
        return this.logoShapeCatalog;
    },

    normalizeLogoShape(shape = this.logoShape) {
        return this.getAvailableLogoShapes().some(option => option.id === shape)
            ? shape
            : 'rounded';
    },

    ensurePresetTilesRendered(root = document) {
        const grid = root.querySelector('#qrLogoPresets');
        const anchor = grid?.querySelector('[data-logo-preset-anchor]');
        if (!grid || !anchor || grid.dataset.logoPresetsRendered === 'true') {
            return;
        }

        anchor.insertAdjacentHTML('afterend', this.getPresetTilesMarkup());
        grid.dataset.logoPresetsRendered = 'true';
    },

    releasePresetTiles(root = document) {
        const grid = root.querySelector('#qrLogoPresets');
        const anchor = grid?.querySelector('[data-logo-preset-anchor]');
        if (!grid || !anchor || grid.dataset.logoPresetsRendered !== 'true') {
            return;
        }

        let node = anchor.nextSibling;
        while (node) {
            const nextNode = node.nextSibling;
            node.remove();
            node = nextNode;
        }

        grid.dataset.logoPresetsRendered = 'false';
    },

    getLogoShapeButtonsMarkup(currentShape = this.logoShape) {
        const activeShape = this.normalizeLogoShape(currentShape);

        return this.getAvailableLogoShapes().map(option => {
            const translatedTitle = I18n.translateString(option.title);
            return `
                <button type="button" class="logo-shape-button${activeShape === option.id ? ' active' : ''}" data-logo-shape="${option.id}" title="${this.escapeHTML(translatedTitle)}" aria-label="${this.escapeHTML(translatedTitle)}">
                    ${option.icon}
                </button>
            `;
        }).join('');
    },

    init(root = document) {
        const logoInput = root.querySelector('#qrLogoInput');
        const logoSizeRange = root.querySelector('#qrLogoSizeRange');
        const logoPaddingRange = root.querySelector('#qrLogoPaddingRange');
        const logoBackgroundColorControl = FrameColorControl.getControl(root, 'logoBackgroundColor');
        const presetSearchInput = root.querySelector('#logoPresetSearchInput');
        const presetEmptyState = root.querySelector('#logoPresetSearchEmpty');
        const sizeValueLabel = root.querySelector('#qrLogoSizeValue');
        const presetButtons = root.querySelectorAll('[data-logo-preset]');
        const actionButtons = root.querySelectorAll('[data-logo-action]');

        if (!logoInput || !logoSizeRange || !sizeValueLabel || !logoBackgroundColorControl) {
            return;
        }

        if (logoInput.dataset.logoControlsInitialized !== 'true') {
            logoInput.addEventListener('change', async event => {
                const [file] = event.target.files || [];
                if (!file) {
                    return;
                }

                const loaded = await this.loadLogoFile(file);
                logoInput.value = '';
                if (!loaded) {
                    return;
                }

                this.insertUploadedTile(root);
                this.syncUI(root);
                QRCodeFrameControls.triggerActiveFrameRefresh(root);
            });

            logoSizeRange.addEventListener('input', () => {
                this.sizePercent = this.clampRequestedLogoSize(parseInt(logoSizeRange.value, 10) || 22);
                this.syncUI(root);
                if (this.hasLogo()) {
                    QRCodeFrameControls.triggerActiveFrameRefresh(root);
                }
            });

            if (logoPaddingRange) {
                logoPaddingRange.addEventListener('input', () => {
                    this.logoPadding = Math.min(80, Math.max(0, parseInt(logoPaddingRange.value, 10) || 20));
                    this.syncUI(root);
                    if (this.hasLogo()) {
                        QRCodeFrameControls.triggerActiveFrameRefresh(root);
                    }
                });
            }

            FrameColorControl.bindControl(logoBackgroundColorControl, control => {
                this.logoBackgroundColor = FrameColorControl.getValue(control);
                const hex = this.logoBackgroundColor.replace('#', '');
                if (hex.length === 6 && this.selectedPresetId && !this.isContainedPreset()) {
                    this.logoIconColor = this.isLightColor(hex) ? '#000000' : '#ffffff';
                }
                if (this.hasLogo()) {
                    QRCodeFrameControls.triggerActiveFrameRefresh(root);
                }
            });

            presetSearchInput?.addEventListener('input', () => {
                this.ensurePresetTilesRendered(root);
                this.applyPresetSearch(root, this.getLogoSearchButtons(root), presetSearchInput, presetEmptyState);
            });

            logoInput.dataset.logoControlsInitialized = 'true';
        }

        const shapeButtons = root.querySelectorAll('[data-logo-shape]');
        shapeButtons.forEach(button => {
            if (button.dataset.logoShapeInitialized === 'true') {
                return;
            }

            button.addEventListener('click', () => {
                this.logoShape = this.normalizeLogoShape(button.dataset.logoShape);
                shapeButtons.forEach(b => b.classList.toggle('active', b.dataset.logoShape === this.logoShape));
                if (this.hasLogo()) {
                    QRCodeFrameControls.triggerActiveFrameRefresh(root);
                }
            });

            button.dataset.logoShapeInitialized = 'true';
        });

        actionButtons.forEach(button => {
            if (button.dataset.logoActionInitialized === 'true') {
                return;
            }

            button.addEventListener('click', () => {
                const action = button.dataset.logoAction;
                if (action === 'upload') {
                    logoInput.click();
                    return;
                }

                if (action === 'clear') {
                    this.clearLogo(root);
                    QRCodeFrameControls.triggerActiveFrameRefresh(root);
                }
            });

            button.dataset.logoActionInitialized = 'true';
        });

        presetButtons.forEach(button => {
            if (button.dataset.logoPresetInitialized === 'true') {
                return;
            }

            button.addEventListener('click', async () => {
                const presetId = button.dataset.logoPreset;
                if (!presetId) {
                    return;
                }

                const loaded = await this.selectPreset(presetId, root);
                if (loaded) {
                    QRCodeFrameControls.triggerActiveFrameRefresh(root);
                }
            });

            button.dataset.logoPresetInitialized = 'true';
        });

        root.querySelectorAll('[data-logo-uploaded]').forEach(button => this.bindUploadedLogoTile(button, root));

        this.syncUI(root);
        this.applyPresetSearch(root, this.getLogoSearchButtons(root), presetSearchInput, presetEmptyState);
    },

    getLogoSearchButtons(root = document) {
        return root.querySelectorAll('[data-logo-action], [data-logo-preset], [data-logo-uploaded]');
    },

    insertUploadedTile(root = document) {
        const grid = root.querySelector('#qrLogoPresets');
        if (!grid) {
            return;
        }

        grid.querySelectorAll('[data-logo-uploaded]').forEach(tile => tile.remove());
        const uploadButton = grid.querySelector('[data-logo-action="upload"]');
        let insertAfter = uploadButton;

        this.uploadedLogos.forEach(logo => {
            const tile = document.createElement('button');
            tile.type = 'button';
            tile.className = 'logo-preset-button';
            tile.style.gridRow = '1';
            tile.dataset.logoUploaded = 'true';
            tile.dataset.logoUploadId = logo.id;
            tile.dataset.logoPresetName = `uploaded custom ${logo.label || ''}`.toLowerCase();
            tile.setAttribute('aria-label', `${logo.label || I18n.translateString('Uploaded logo')} ${I18n.translateString('logo')}`);
            tile.innerHTML = this.getUploadedLogoTileInnerMarkup(logo);
            this.bindUploadedLogoTile(tile, root);

            if (insertAfter?.nextSibling) {
                grid.insertBefore(tile, insertAfter.nextSibling);
            } else if (uploadButton) {
                grid.appendChild(tile);
            } else {
                grid.appendChild(tile);
            }
            insertAfter = tile;
        });

        this.applyPresetSearch(root, this.getLogoSearchButtons(root), root.querySelector('#logoPresetSearchInput'), root.querySelector('#logoPresetSearchEmpty'));
    },

    bindUploadedLogoTile(tile, root = document) {
        if (!tile || tile.dataset.logoUploadedInitialized === 'true') {
            return;
        }
        tile.addEventListener('click', async () => {
            const loaded = await this.selectUploadedLogo(tile.dataset.logoUploadId, root);
            if (loaded) {
                QRCodeFrameControls.triggerActiveFrameRefresh(root);
            }
        });
        tile.dataset.logoUploadedInitialized = 'true';
    },

    getUploadedLogoTilesMarkup() {
        return this.uploadedLogos.map(logo => `
            <button type="button" class="logo-preset-button" style="grid-row: 1;" data-logo-uploaded="true" data-logo-upload-id="${logo.id}" data-logo-preset-name="uploaded custom ${(logo.label || '').toLowerCase()}" aria-label="${this.escapeHTML(logo.label || I18n.translateString('Uploaded logo'))} ${I18n.translateString('logo')}">
                ${this.getUploadedLogoTileInnerMarkup(logo)}
            </button>
        `).join('');
    },

    getUploadedLogoTileInnerMarkup(logo) {
        return `
            <span class="logo-preset-thumb logo-preset-thumb-uploaded">
                <img src="${logo.dataUrl}" alt="${this.escapeHTML(logo.label || I18n.translateString('Uploaded logo'))}">
            </span>
            <span class="logo-preset-name">${this.escapeHTML(logo.label || I18n.translateString('Uploaded'))}</span>
        `;
    },

    escapeHTML(value) {
        return String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    },

    applyPresetSearch(root, presetButtons, presetSearchInput, presetEmptyState) {
        if (!presetSearchInput) {
            return;
        }

        const searchTerm = presetSearchInput.value.trim().toLowerCase();
        let visibleCount = 0;

        presetButtons.forEach(button => {
            const presetName = button.dataset.logoPresetName || '';
            const matches = !searchTerm || presetName.includes(searchTerm);
            button.hidden = !matches;
            button.classList.toggle('is-filtered-out', !matches);
            if (matches) {
                visibleCount += 1;
            }
        });

        if (presetEmptyState) {
            presetEmptyState.hidden = visibleCount > 0;
        }
    },

    async loadLogoFile(file) {
        const isSupportedType = ['image/png', 'image/jpeg', 'image/svg+xml'].includes(file.type);
        if (!isSupportedType) {
            alert(I18n.translateString('Upload a PNG, JPG, or SVG logo.'));
            return false;
        }

        try {
            const dataUrl = await this.readFileAsDataUrl(file);
            await this.setLogoSource(dataUrl, {
                label: file.name,
                selectedPresetId: ''
            });
            this.addUploadedLogo({
                dataUrl,
                image: this.logoImage,
                svgMarkup: this.logoSvgMarkup,
                label: file.name || I18n.translateString('Uploaded')
            });
            this.logoIconColor = '';
            this.logoBackgroundColor = '#ffffff';
            return true;
        } catch (error) {
            console.error('Unable to load logo image:', error);
            alert(I18n.translateString('Unable to load the selected logo image.'));
            return false;
        }
    },

    async selectPreset(presetId, root = document) {
        const preset = this.getLogoPresets().find(candidate => candidate.id === presetId);
        if (!preset) {
            return false;
        }

        try {
            const presetSource = await this.resolvePresetDataUrl(preset);
            await this.setLogoSource(presetSource, {
                label: `${preset.name} preset`,
                selectedPresetId: preset.id
            });
            this.activeUploadedLogoId = '';

            if (preset.hex) {
                this.logoBackgroundColor = `#${preset.hex}`;
                this.logoIconColor = this.isLightColor(preset.hex) ? '#000000' : '#ffffff';
            } else {
                this.logoBackgroundColor = '#ffffff';
                this.logoIconColor = '';
            }

            const logoInput = root.querySelector('#qrLogoInput');
            if (logoInput) {
                logoInput.value = '';
            }

            this.syncUI(root);
            return true;
        } catch (error) {
            console.error('Unable to load preset logo:', error);
            alert(I18n.translateString('Unable to load the selected preset logo.'));
            return false;
        }
    },

    async resolvePresetDataUrl(preset) {
        return preset?.dataUrl || '';
    },

    async setLogoSource(dataUrl, { label = '', selectedPresetId = '' } = {}) {
        const image = await this.loadImage(dataUrl);
        const svgMarkup = await this.resolveLogoSVGMarkup(dataUrl);
        this.logoDataUrl = dataUrl;
        this.logoSvgMarkup = svgMarkup;
        this.logoImage = image;
        this.activeLogoLabel = label;
        this.selectedPresetId = selectedPresetId;
    },

    addUploadedLogo({ dataUrl, image, label, svgMarkup = '' }) {
        const logo = {
            id: `uploaded-logo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            dataUrl,
            image,
            svgMarkup,
            label: label || I18n.translateString('Uploaded')
        };
        this.uploadedLogos.unshift(logo);
        this.activeUploadedLogoId = logo.id;
        return logo;
    },

    async selectUploadedLogo(uploadedLogoId, root = document) {
        const logo = this.uploadedLogos.find(candidate => candidate.id === uploadedLogoId);
        if (!logo) {
            return false;
        }
        await this.setLogoSource(logo.dataUrl, {
            label: logo.label,
            selectedPresetId: ''
        });
        this.logoImage = logo.image || this.logoImage;
        this.logoSvgMarkup = logo.svgMarkup || this.logoSvgMarkup;
        this.activeUploadedLogoId = logo.id;
        this.logoIconColor = '';
        this.logoBackgroundColor = '#ffffff';
        this.syncUI(root);
        return true;
    },

    clearLogo(root = document) {
        this.logoDataUrl = '';
        this.logoSvgMarkup = '';
        this.logoImage = null;
        this.activeLogoLabel = '';
        this.selectedPresetId = '';
        this.activeUploadedLogoId = '';
        this.logoBackgroundColor = '#ffffff';
        this.logoIconColor = '';
        this.logoShape = 'rounded';
        this.logoPadding = 20;

        const logoInput = root.querySelector('#qrLogoInput');
        if (logoInput) {
            logoInput.value = '';
        }

        this.syncUI(root);
    },

    hasLogo() {
        return Boolean(this.logoImage);
    },

    getCorrectLevelKey(correctLevel = this.lastCorrectLevelKey) {
        if (typeof correctLevel === 'string') {
            const normalizedLevel = correctLevel.toUpperCase();

            if (normalizedLevel in (QRCode?.CorrectLevelInfo ?? QRCodeErrorCorrectionOptions.getLevels())) {
                return normalizedLevel;
            }
        }

        const correctLevelEntries = Object.entries(QRCode?.CorrectLevel ?? {});
        const matchedEntry = correctLevelEntries.find(([, value]) => value === correctLevel);
        return matchedEntry?.[0] ?? 'Q';
    },

    getEffectiveTypeNumber(typeNumber = this.lastTypeNumber) {
        const normalizedTypeNumber = Number(typeNumber);
        return Number.isInteger(normalizedTypeNumber) && normalizedTypeNumber > 0
            ? normalizedTypeNumber
            : this.getRecommendedMinTypeNumber();
    },

    getLogoBackgroundScale() {
        const paddingFraction = Math.min(0.8, Math.max(0, this.logoPadding / 100));
        return 1 + Math.min(0.16, 0.06 + paddingFraction * 0.12);
    },

    getSafeBackgroundCoveragePercent(typeNumber = this.lastTypeNumber, correctLevel = this.lastCorrectLevelKey) {
        const effectiveTypeNumber = this.getEffectiveTypeNumber(typeNumber);
        const levelKey = this.getCorrectLevelKey(correctLevel);
        const baseCoverageByLevel = {
            L: 22,
            M: 26,
            Q: 30,
            H: 34
        };
        const versionBoost = Math.min(8, Math.max(0, (effectiveTypeNumber - 4) * 0.45));
        return Math.min(42, baseCoverageByLevel[levelKey] + versionBoost);
    },

    getMaximumAllowedLogoSizePercent(typeNumber = this.lastTypeNumber, correctLevel = this.lastCorrectLevelKey) {
        const backgroundScale = this.getLogoBackgroundScale();
        const maxBackgroundCoverage = this.getSafeBackgroundCoveragePercent(typeNumber, correctLevel);
        return Math.max(
            QR_LOGO_SIZE_MIN_PERCENT,
            Math.min(QR_LOGO_SIZE_MAX_PERCENT, Math.floor(maxBackgroundCoverage / backgroundScale))
        );
    },

    clampRequestedLogoSize(sizePercent, typeNumber = this.lastTypeNumber, correctLevel = this.lastCorrectLevelKey) {
        const normalizedSize = Math.min(QR_LOGO_SIZE_MAX_PERCENT, Math.max(QR_LOGO_SIZE_MIN_PERCENT, Number(sizePercent) || 22));
        return Math.min(normalizedSize, this.getMaximumAllowedLogoSizePercent(typeNumber, correctLevel));
    },

    updateGenerationContext(qrCodeInstance, options = {}) {
        const instanceTypeNumber = typeof qrCodeInstance?.getTypeNumber === 'function' ? qrCodeInstance.getTypeNumber() : 0;
        const nextTypeNumber = this.getEffectiveTypeNumber(instanceTypeNumber);
        const nextCorrectLevelKey = this.getCorrectLevelKey(options.correctLevel);

        this.lastTypeNumber = nextTypeNumber;
        this.lastCorrectLevelKey = nextCorrectLevelKey;
        this.sizePercent = this.clampRequestedLogoSize(this.sizePercent, nextTypeNumber, nextCorrectLevelKey);
        this.lastAppliedSizePercent = this.sizePercent;
    },

    getRecommendedMinTypeNumber() {
        if (!this.hasLogo()) {
            return QR_CODE_VERSION_AUTOMATIC;
        }

        const safeSizePercent = Math.min(QR_LOGO_SIZE_MAX_PERCENT, Math.max(QR_LOGO_SIZE_MIN_PERCENT, this.sizePercent || 22));

        if (safeSizePercent >= 38) {
            return 14;
        }

        if (safeSizePercent >= 32) {
            return 12;
        }

        if (safeSizePercent >= 26) {
            return 10;
        }

        return 8;
    },

    isContainedPreset() {
        if (!this.selectedPresetId) return false;
        const preset = this.getLogoPresets().find(p => p.id === this.selectedPresetId);
        return Boolean(preset?.contained);
    },

    syncUI(root = document, uploadedFileName = '') {
        const activeShape = this.normalizeLogoShape(this.logoShape);
        if (activeShape !== this.logoShape) {
            this.logoShape = activeShape;
        }

        const sizeRange = root.querySelector('#qrLogoSizeRange');
        const paddingRange = root.querySelector('#qrLogoPaddingRange');
        const logoBackgroundColorControl = FrameColorControl.getControl(root, 'logoBackgroundColor');
        const sizeValueLabel = root.querySelector('#qrLogoSizeValue');
        const paddingValueLabel = root.querySelector('#qrLogoPaddingValue');
        const presetButtons = root.querySelectorAll('[data-logo-preset]');
        const clearActionButton = root.querySelector('[data-logo-action="clear"]');

        if (sizeRange) {
            sizeRange.max = String(this.getMaximumAllowedLogoSizePercent());
            sizeRange.value = String(this.sizePercent);
        }

        if (sizeValueLabel) {
            const maximumAllowedSize = this.getMaximumAllowedLogoSizePercent();
            const newSizeText = I18n.translate('{size}% of QR width (max {max}% for this QR code)', {
                size: this.sizePercent,
                max: maximumAllowedSize
            });
            if (sizeValueLabel.textContent !== newSizeText) {
                sizeValueLabel.textContent = newSizeText;
            }
        }

        if (paddingRange) {
            paddingRange.value = String(this.logoPadding);
        }

        if (paddingValueLabel) {
            const newPaddingText = `${this.logoPadding}%`;
            if (paddingValueLabel.textContent !== newPaddingText) {
                paddingValueLabel.textContent = newPaddingText;
            }
        }

        if (logoBackgroundColorControl) {
            FrameColorControl.setValue(logoBackgroundColorControl, this.logoBackgroundColor);
        }

        const shapeButtons = root.querySelectorAll('[data-logo-shape]');
        shapeButtons.forEach(button => {
            button.classList.toggle('active', button.dataset.logoShape === activeShape);
        });

        if (clearActionButton) {
            clearActionButton.classList.toggle('active', !this.hasLogo());
        }

        root.querySelectorAll('[data-logo-uploaded]').forEach(uploadedTile => {
            const isUploadedActive = this.hasLogo()
                && !this.selectedPresetId
                && uploadedTile.dataset.logoUploadId === this.activeUploadedLogoId;
            uploadedTile.classList.toggle('active', isUploadedActive);
        });

        presetButtons.forEach(button => {
            button.classList.toggle('active', button.dataset.logoPreset === this.selectedPresetId);
        });
    },

    applyLogoToContainer(container, qrCodeInstance = null, options = {}) {
        if (!container || !this.hasLogo()) {
            return;
        }

        this.updateGenerationContext(qrCodeInstance, options);
        this.syncUI(document);

        const canvas = container.querySelector('canvas');
        if (!canvas) {
            return;
        }

        this.applyLogoToCanvas(canvas, qrCodeInstance, options);
    },

    applyLogoToCanvas(canvas, qrCodeInstance = null, options = {}) {
        if (!canvas || !this.hasLogo()) {
            return canvas;
        }

        this.updateGenerationContext(qrCodeInstance, options);

        const ctx = canvas.getContext('2d');
        if (!ctx) {
            return canvas;
        }

        const qrSize = Math.min(canvas.width, canvas.height);
        const safeSizePercent = this.clampRequestedLogoSize(this.sizePercent, this.lastTypeNumber, this.lastCorrectLevelKey);
        const logoBoxSize = qrSize * (safeSizePercent / 100);
        const backgroundSize = logoBoxSize * this.getLogoBackgroundScale();
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const backgroundRadius = Math.max(8, backgroundSize * 0.18);

        const paddingFraction = Math.min(0.8, Math.max(0, this.logoPadding / 100));
        const paddedLogoBoxSize = Math.max(8, logoBoxSize * (1 - paddingFraction));
        const imageAspectRatio = this.logoImage.naturalWidth / this.logoImage.naturalHeight || 1;
        const imageWidth = imageAspectRatio >= 1 ? paddedLogoBoxSize : paddedLogoBoxSize * imageAspectRatio;
        const imageHeight = imageAspectRatio >= 1 ? paddedLogoBoxSize / imageAspectRatio : paddedLogoBoxSize;
        const imageX = centerX - (imageWidth / 2);
        const imageY = centerY - (imageHeight / 2);

        this.lastAppliedSizePercent = safeSizePercent;

        ctx.save();
        ctx.imageSmoothingEnabled = true;
        ctx.fillStyle = this.logoBackgroundColor;

        this.drawLogoShapePath(ctx, this.logoShape, centerX, centerY, backgroundSize, backgroundRadius);
        ctx.fill();

        this.drawLogoShapePath(ctx, this.logoShape, centerX, centerY, backgroundSize, backgroundRadius);
        ctx.clip();

        if (this.logoIconColor) {
            const tintCanvas = document.createElement('canvas');
            tintCanvas.width = Math.ceil(imageWidth);
            tintCanvas.height = Math.ceil(imageHeight);
            const tintCtx = tintCanvas.getContext('2d');
            tintCtx.drawImage(this.logoImage, 0, 0, tintCanvas.width, tintCanvas.height);
            tintCtx.globalCompositeOperation = 'source-in';
            tintCtx.fillStyle = this.logoIconColor;
            tintCtx.fillRect(0, 0, tintCanvas.width, tintCanvas.height);
            ctx.drawImage(tintCanvas, imageX, imageY, imageWidth, imageHeight);
        } else {
            ctx.drawImage(this.logoImage, imageX, imageY, imageWidth, imageHeight);
        }

        ctx.restore();

        return canvas;
    },

    getSVGViewportSize(svgElement) {
        const viewBox = svgElement?.getAttribute('viewBox')?.trim() ?? '';

        if (viewBox) {
            const [, , width, height] = viewBox.split(/\s+/).map(Number);

            if (Number.isFinite(width) && Number.isFinite(height)) {
                return Math.min(width, height);
            }
        }

        const width = Number(svgElement?.getAttribute('width'));
        const height = Number(svgElement?.getAttribute('height'));

        if (Number.isFinite(width) && Number.isFinite(height)) {
            return Math.min(width, height);
        }

        return 0;
    },

    getLogoOverlayGeometry(qrSize, typeNumber = this.lastTypeNumber, correctLevel = this.lastCorrectLevelKey) {
        const safeSizePercent = this.clampRequestedLogoSize(this.sizePercent, typeNumber, correctLevel);
        const logoBoxSize = qrSize * (safeSizePercent / 100);
        const backgroundSize = logoBoxSize * this.getLogoBackgroundScale();
        const centerX = qrSize / 2;
        const centerY = qrSize / 2;
        const backgroundX = centerX - (backgroundSize / 2);
        const backgroundY = centerY - (backgroundSize / 2);
        const backgroundRadius = Math.max(8, backgroundSize * 0.18);
        const paddingFraction = Math.min(0.8, Math.max(0, this.logoPadding / 100));
        const paddedLogoBoxSize = Math.max(8, logoBoxSize * (1 - paddingFraction));
        const imageAspectRatio = this.logoImage.naturalWidth / this.logoImage.naturalHeight || 1;
        const imageWidth = imageAspectRatio >= 1 ? paddedLogoBoxSize : paddedLogoBoxSize * imageAspectRatio;
        const imageHeight = imageAspectRatio >= 1 ? paddedLogoBoxSize / imageAspectRatio : paddedLogoBoxSize;
        const imageX = centerX - (imageWidth / 2);
        const imageY = centerY - (imageHeight / 2);

        return {
            safeSizePercent,
            backgroundSize,
            backgroundX,
            backgroundY,
            backgroundRadius,
            imageWidth,
            imageHeight,
            imageX,
            imageY
        };
    },

    buildLogoOverlayDataUrl(geometry) {
        const overlayCanvas = document.createElement('canvas');
        const overlaySize = Math.max(1, Math.ceil(geometry.backgroundSize));
        const baseRasterScale = Math.max(4, Math.ceil((window.devicePixelRatio || 1) * 4));
        const rasterPixels = Math.max(128, overlaySize * baseRasterScale);
        const rasterScale = rasterPixels / overlaySize;
        overlayCanvas.width = rasterPixels;
        overlayCanvas.height = rasterPixels;

        const context = overlayCanvas.getContext('2d');
        if (!context) {
            return '';
        }

        const localCenter = overlaySize / 2;
        const imageX = geometry.imageX - geometry.backgroundX;
        const imageY = geometry.imageY - geometry.backgroundY;

        context.scale(rasterScale, rasterScale);

        context.save();
        context.imageSmoothingEnabled = true;
        context.fillStyle = this.logoBackgroundColor;

        this.drawLogoShapePath(context, this.logoShape, localCenter, localCenter, geometry.backgroundSize, geometry.backgroundRadius);
        context.fill();

        this.drawLogoShapePath(context, this.logoShape, localCenter, localCenter, geometry.backgroundSize, geometry.backgroundRadius);
        context.clip();

        if (this.logoIconColor) {
            const tintCanvas = document.createElement('canvas');
            tintCanvas.width = Math.max(1, Math.ceil(geometry.imageWidth));
            tintCanvas.height = Math.max(1, Math.ceil(geometry.imageHeight));
            const tintContext = tintCanvas.getContext('2d');

            if (tintContext) {
                tintContext.drawImage(this.logoImage, 0, 0, tintCanvas.width, tintCanvas.height);
                tintContext.globalCompositeOperation = 'source-in';
                tintContext.fillStyle = this.logoIconColor;
                tintContext.fillRect(0, 0, tintCanvas.width, tintCanvas.height);
                context.drawImage(tintCanvas, imageX, imageY, geometry.imageWidth, geometry.imageHeight);
            }
        } else {
            context.drawImage(this.logoImage, imageX, imageY, geometry.imageWidth, geometry.imageHeight);
        }

        context.restore();

        return overlayCanvas.toDataURL('image/png');
    },

    appendVectorLogoOverlay(svgElement, geometry) {
        const parsedLogoSvg = this.getParsedLogoSVG();
        if (!parsedLogoSvg) {
            return false;
        }

        const viewBox = this.parseLogoSVGViewBox(parsedLogoSvg.viewBox);
        if (!viewBox) {
            return false;
        }

        const localCenter = geometry.backgroundSize / 2;
        const shapePath = this.getLogoShapeSVGPath(this.logoShape, localCenter, localCenter, geometry.backgroundSize, geometry.backgroundRadius);

        if (!shapePath) {
            return false;
        }

        const svgNamespace = 'http://www.w3.org/2000/svg';
        const clipPathId = `logo-clip-${Math.random().toString(36).slice(2, 10)}`;
        const overlayGroup = document.createElementNS(svgNamespace, 'g');
        overlayGroup.setAttribute('transform', `translate(${this.formatSvgNumber(geometry.backgroundX)} ${this.formatSvgNumber(geometry.backgroundY)})`);

        const defsElement = document.createElementNS(svgNamespace, 'defs');
        const clipPathElement = document.createElementNS(svgNamespace, 'clipPath');
        clipPathElement.setAttribute('id', clipPathId);
        const clipPathShape = document.createElementNS(svgNamespace, 'path');
        clipPathShape.setAttribute('d', shapePath);
        clipPathElement.appendChild(clipPathShape);
        defsElement.appendChild(clipPathElement);
        overlayGroup.appendChild(defsElement);

        const backgroundPath = document.createElementNS(svgNamespace, 'path');
        backgroundPath.setAttribute('d', shapePath);
        backgroundPath.setAttribute('fill', this.logoBackgroundColor);
        overlayGroup.appendChild(backgroundPath);

        const clippedGroup = document.createElementNS(svgNamespace, 'g');
        clippedGroup.setAttribute('clip-path', `url(#${clipPathId})`);

        const contentGroup = document.createElementNS(svgNamespace, 'g');
        const scale = Math.min(geometry.imageWidth / viewBox.width, geometry.imageHeight / viewBox.height);
        const translateX = geometry.imageX - geometry.backgroundX + ((geometry.imageWidth - (viewBox.width * scale)) / 2) - (viewBox.minX * scale);
        const translateY = geometry.imageY - geometry.backgroundY + ((geometry.imageHeight - (viewBox.height * scale)) / 2) - (viewBox.minY * scale);
        contentGroup.setAttribute('transform', `translate(${this.formatSvgNumber(translateX)} ${this.formatSvgNumber(translateY)}) scale(${this.formatSvgNumber(scale)})`);

        if (this.logoIconColor) {
            const tintClassName = `qr-logo-tint-${Math.random().toString(36).slice(2, 10)}`;
            const styleElement = document.createElementNS(svgNamespace, 'style');
            styleElement.textContent = `.${tintClassName}, .${tintClassName} * { fill: ${this.logoIconColor} !important; stroke: ${this.logoIconColor} !important; color: ${this.logoIconColor} !important; }`;
            overlayGroup.appendChild(styleElement);
            contentGroup.setAttribute('class', tintClassName);
        }

        this.appendParsedLogoContent(contentGroup, parsedLogoSvg.content, svgElement.ownerDocument || document);
        clippedGroup.appendChild(contentGroup);
        overlayGroup.appendChild(clippedGroup);
        svgElement.appendChild(overlayGroup);

        return true;
    },

    applyLogoToSVG(svgElement, qrCodeInstance = null, options = {}) {
        if (!svgElement || !this.hasLogo()) {
            return svgElement;
        }

        this.updateGenerationContext(qrCodeInstance, options);

        const qrSize = this.getSVGViewportSize(svgElement);
        if (!qrSize) {
            return svgElement;
        }

        const geometry = this.getLogoOverlayGeometry(qrSize, this.lastTypeNumber, this.lastCorrectLevelKey);
        this.lastAppliedSizePercent = geometry.safeSizePercent;

        if (this.appendVectorLogoOverlay(svgElement, geometry)) {
            return svgElement;
        }

        const overlayHref = this.buildLogoOverlayDataUrl(geometry);
        if (!overlayHref) {
            return svgElement;
        }

        const imageElement = document.createElementNS('http://www.w3.org/2000/svg', 'image');
        imageElement.setAttribute('x', String(geometry.backgroundX));
        imageElement.setAttribute('y', String(geometry.backgroundY));
        imageElement.setAttribute('width', String(geometry.backgroundSize));
        imageElement.setAttribute('height', String(geometry.backgroundSize));
        imageElement.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        imageElement.setAttribute('href', overlayHref);
        imageElement.setAttributeNS('http://www.w3.org/1999/xlink', 'href', overlayHref);
        svgElement.appendChild(imageElement);

        return svgElement;
    },

    isSvgLogoDataUrl(dataUrl = this.logoDataUrl) {
        return typeof dataUrl === 'string' && dataUrl.startsWith('data:image/svg+xml');
    },

    getParsedLogoSVG() {
        if (typeof this.logoSvgMarkup !== 'string' || !this.logoSvgMarkup.trim()) {
            return null;
        }

        const parser = new DOMParser();
        const svgDocument = parser.parseFromString(this.logoSvgMarkup, 'image/svg+xml');
        const svgElement = svgDocument.documentElement;
        if (!svgElement || svgElement.nodeName.toLowerCase() !== 'svg') {
            return null;
        }

        const viewBox = svgElement.getAttribute('viewBox')
            || `0 0 ${svgElement.getAttribute('width') || '100'} ${svgElement.getAttribute('height') || '100'}`;

        return {
            viewBox,
            content: svgElement.innerHTML
        };
    },

    parseLogoSVGViewBox(viewBox) {
        if (typeof viewBox !== 'string') {
            return null;
        }

        const parts = viewBox.trim().split(/\s+/).map(Number);
        if (parts.length !== 4 || parts.some(value => !Number.isFinite(value))) {
            return null;
        }

        const [minX, minY, width, height] = parts;
        if (width <= 0 || height <= 0) {
            return null;
        }

        return { minX, minY, width, height };
    },

    appendParsedLogoContent(targetElement, svgContent, targetDocument = document) {
        if (!targetElement || typeof svgContent !== 'string' || !svgContent.trim()) {
            return;
        }

        const parser = new DOMParser();
        const parsedDocument = parser.parseFromString(`<svg xmlns="http://www.w3.org/2000/svg">${svgContent}</svg>`, 'image/svg+xml');
        const parsedRoot = parsedDocument.documentElement;
        Array.from(parsedRoot.childNodes).forEach(node => {
            targetElement.appendChild(targetDocument.importNode(node, true));
        });
    },

    async resolveLogoSVGMarkup(source) {
        if (typeof source !== 'string' || !source) {
            return '';
        }

        try {
            if (source.startsWith('data:image/svg+xml')) {
                const [, encodedSvg = ''] = source.split(',', 2);
                return decodeURIComponent(encodedSvg);
            }

            if (/\.svg(?:[?#].*)?$/i.test(source)) {
                const response = await fetch(source);
                if (!response.ok) {
                    return '';
                }

                return await response.text();
            }
        } catch (error) {
            console.warn('Unable to resolve SVG logo markup:', error);
        }

        return '';
    },

    getLogoShapeSVGPath(shape, cx, cy, size, radius) {
        const recorder = this.createSVGPathRecorder();
        this.drawLogoShapePath(recorder, shape, cx, cy, size, radius);
        return recorder.toString();
    },

    createSVGPathRecorder() {
        const parts = [];
        let currentX = 0;
        let currentY = 0;
        let subpathStartX = 0;
        let subpathStartY = 0;
        let hasCurrentPoint = false;

        const moveTo = (x, y) => {
            parts.push(`M ${this.formatSvgNumber(x)} ${this.formatSvgNumber(y)}`);
            currentX = x;
            currentY = y;
            subpathStartX = x;
            subpathStartY = y;
            hasCurrentPoint = true;
        };

        const lineTo = (x, y) => {
            if (!hasCurrentPoint) {
                moveTo(x, y);
                return;
            }
            parts.push(`L ${this.formatSvgNumber(x)} ${this.formatSvgNumber(y)}`);
            currentX = x;
            currentY = y;
        };

        const ensureArcStart = (x, y) => {
            if (!hasCurrentPoint) {
                moveTo(x, y);
                return;
            }
            if (Math.abs(currentX - x) > 0.001 || Math.abs(currentY - y) > 0.001) {
                lineTo(x, y);
            }
        };

        const appendArc = (radiusX, radiusY, rotation, largeArcFlag, sweepFlag, x, y) => {
            parts.push(`A ${this.formatSvgNumber(radiusX)} ${this.formatSvgNumber(radiusY)} ${this.formatSvgNumber(rotation)} ${largeArcFlag} ${sweepFlag} ${this.formatSvgNumber(x)} ${this.formatSvgNumber(y)}`);
            currentX = x;
            currentY = y;
            hasCurrentPoint = true;
        };

        const describeArc = (centerX, centerY, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise = false) => {
            const tau = Math.PI * 2;
            let delta = endAngle - startAngle;
            if (!anticlockwise && delta < 0) {
                delta += tau;
            }
            if (anticlockwise && delta > 0) {
                delta -= tau;
            }

            const isFullEllipse = Math.abs(Math.abs(delta) - tau) < 0.0001;
            const sweepFlag = anticlockwise ? 0 : 1;
            const pointAt = angle => ({
                x: centerX + radiusX * Math.cos(angle),
                y: centerY + radiusY * Math.sin(angle)
            });

            if (isFullEllipse) {
                const startPoint = pointAt(startAngle);
                const midAngle = startAngle + (delta / 2);
                const midPoint = pointAt(midAngle);
                ensureArcStart(startPoint.x, startPoint.y);
                appendArc(radiusX, radiusY, rotation, 0, sweepFlag, midPoint.x, midPoint.y);
                appendArc(radiusX, radiusY, rotation, 0, sweepFlag, startPoint.x, startPoint.y);
                return;
            }

            const endPoint = pointAt(endAngle);
            const largeArcFlag = Math.abs(delta) > Math.PI ? 1 : 0;
            const startPoint = pointAt(startAngle);
            ensureArcStart(startPoint.x, startPoint.y);
            appendArc(radiusX, radiusY, rotation, largeArcFlag, sweepFlag, endPoint.x, endPoint.y);
        };

        return {
            beginPath() {
                parts.length = 0;
                hasCurrentPoint = false;
            },
            moveTo,
            lineTo,
            bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y) {
                if (!hasCurrentPoint) {
                    moveTo(x, y);
                    return;
                }
                parts.push(`C ${this.formatSvgNumber(cp1x)} ${this.formatSvgNumber(cp1y)} ${this.formatSvgNumber(cp2x)} ${this.formatSvgNumber(cp2y)} ${this.formatSvgNumber(x)} ${this.formatSvgNumber(y)}`);
                currentX = x;
                currentY = y;
            },
            quadraticCurveTo(cpx, cpy, x, y) {
                if (!hasCurrentPoint) {
                    moveTo(x, y);
                    return;
                }
                parts.push(`Q ${this.formatSvgNumber(cpx)} ${this.formatSvgNumber(cpy)} ${this.formatSvgNumber(x)} ${this.formatSvgNumber(y)}`);
                currentX = x;
                currentY = y;
            },
            arc(centerX, centerY, radius, startAngle, endAngle, anticlockwise = false) {
                describeArc(centerX, centerY, radius, radius, 0, startAngle, endAngle, anticlockwise);
            },
            ellipse(centerX, centerY, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise = false) {
                describeArc(centerX, centerY, radiusX, radiusY, rotation * 180 / Math.PI, startAngle, endAngle, anticlockwise);
            },
            rect(x, y, width, height) {
                moveTo(x, y);
                lineTo(x + width, y);
                lineTo(x + width, y + height);
                lineTo(x, y + height);
                this.closePath();
            },
            closePath() {
                if (!hasCurrentPoint) {
                    return;
                }
                parts.push('Z');
                currentX = subpathStartX;
                currentY = subpathStartY;
            },
            toString() {
                return parts.join(' ');
            },
            formatSvgNumber: value => this.formatSvgNumber(value)
        };
    },

    formatSvgNumber(value) {
        if (!Number.isFinite(value)) {
            return '0';
        }
        return Number(value.toFixed(3)).toString();
    },

    escapeSvgAttribute(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    },

    roundRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    },

    drawLogoShapePath(ctx, shape, cx, cy, size, radius) {
        const half = size / 2;
        const x = cx - half;
        const y = cy - half;
        const normalizedShape = this.normalizeLogoShape(shape);

        ctx.beginPath();
        switch (normalizedShape) {
            case 'circle':
                ctx.arc(cx, cy, half, 0, Math.PI * 2);
                break;

            case 'square':
                ctx.rect(x, y, size, size);
                break;

            case 'hexagon': {
                for (let i = 0; i < 6; i++) {
                    const angle = (Math.PI / 3) * i - Math.PI / 2;
                    const px = cx + half * Math.cos(angle);
                    const py = cy + half * Math.sin(angle);
                    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
                }
                break;
            }

            case 'heart': {
                const top = cy - half * 0.45;
                const bottom = cy + half;
                const cRadius = half * 0.52;
                ctx.moveTo(cx, bottom);
                ctx.bezierCurveTo(cx - half * 1.2, cy - half * 0.1, cx - half * 0.8, top - cRadius * 0.7, cx, top + cRadius * 0.3);
                ctx.bezierCurveTo(cx + half * 0.8, top - cRadius * 0.7, cx + half * 1.2, cy - half * 0.1, cx, bottom);
                break;
            }

            case 'diamond': {
                // Gem-cut diamond (flat top with angled shoulders)
                const topW = half * 0.55;
                const shoulderY = y + half * 0.45;
                ctx.moveTo(cx - topW, y);
                ctx.lineTo(cx + topW, y);
                ctx.lineTo(x + size, shoulderY);
                ctx.lineTo(cx, y + size);
                ctx.lineTo(x, shoulderY);
                break;
            }

            case 'star': {
                const outerR = half;
                const innerR = half * 0.4;
                for (let i = 0; i < 10; i++) {
                    const r = i % 2 === 0 ? outerR : innerR;
                    const angle = (Math.PI / 5) * i - Math.PI / 2;
                    const px = cx + r * Math.cos(angle);
                    const py = cy + r * Math.sin(angle);
                    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
                }
                break;
            }

            case 'shield':
                ctx.moveTo(cx, y);
                ctx.lineTo(cx + half, y + half * 0.35);
                ctx.lineTo(cx + half, cy);
                ctx.quadraticCurveTo(cx + half, y + size, cx, y + size);
                ctx.quadraticCurveTo(cx - half, y + size, cx - half, cy);
                ctx.lineTo(cx - half, y + half * 0.35);
                break;

            case 'octagon': {
                for (let i = 0; i < 8; i++) {
                    const angle = (Math.PI / 4) * i - Math.PI / 8;
                    const px = cx + half * Math.cos(angle);
                    const py = cy + half * Math.sin(angle);
                    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
                }
                break;
            }

            case 'pentagon': {
                for (let i = 0; i < 5; i++) {
                    const angle = (Math.PI * 2 / 5) * i - Math.PI / 2;
                    const px = cx + half * Math.cos(angle);
                    const py = cy + half * Math.sin(angle);
                    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
                }
                break;
            }

            case 'cross': {
                const arm = half * 0.38;
                ctx.moveTo(cx - arm, y);
                ctx.lineTo(cx + arm, y);
                ctx.lineTo(cx + arm, cy - arm);
                ctx.lineTo(cx + half, cy - arm);
                ctx.lineTo(cx + half, cy + arm);
                ctx.lineTo(cx + arm, cy + arm);
                ctx.lineTo(cx + arm, y + size);
                ctx.lineTo(cx - arm, y + size);
                ctx.lineTo(cx - arm, cy + arm);
                ctx.lineTo(cx - half, cy + arm);
                ctx.lineTo(cx - half, cy - arm);
                ctx.lineTo(cx - arm, cy - arm);
                break;
            }

            case 'teardrop':
                ctx.moveTo(cx, y);
                ctx.bezierCurveTo(cx + half * 0.2, y + half * 0.4, cx + half, y + half * 0.8, cx + half, cy + half * 0.15);
                ctx.quadraticCurveTo(cx + half, y + size, cx, y + size);
                ctx.quadraticCurveTo(cx - half, y + size, cx - half, cy + half * 0.15);
                ctx.bezierCurveTo(cx - half, y + half * 0.8, cx - half * 0.2, y + half * 0.4, cx, y);
                break;

            case 'arch': {
                // Narrow tall arch (horseshoe-like)
                const archWidth = half * 0.75;
                const archHeight = half * 0.85;
                ctx.moveTo(cx - archWidth, y + size);
                ctx.lineTo(cx - archWidth, cy - archHeight + archWidth);
                ctx.arc(cx, cy - archHeight + archWidth, archWidth, Math.PI, 0, false);
                ctx.lineTo(cx + archWidth, y + size);
                break;
            }

            case 'leaf': {
                // Pointed leaf with tip at top and bottom (lens/vesica piscis, rotated)
                ctx.moveTo(cx, y);
                ctx.bezierCurveTo(cx + half * 1.1, cy - half * 0.6, cx + half * 1.1, cy + half * 0.6, cx, y + size);
                ctx.bezierCurveTo(cx - half * 1.1, cy + half * 0.6, cx - half * 1.1, cy - half * 0.6, cx, y);
                break;
            }

            case 'squircle': {
                const n = 4;
                const steps = 200;
                for (let i = 0; i <= steps; i++) {
                    const t = (2 * Math.PI * i) / steps;
                    const cosT = Math.cos(t);
                    const sinT = Math.sin(t);
                    const px = cx + half * Math.sign(cosT) * Math.pow(Math.abs(cosT), 2 / n);
                    const py = cy + half * Math.sign(sinT) * Math.pow(Math.abs(sinT), 2 / n);
                    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
                }
                break;
            }

            case 'oval':
                // Vertical (portrait) ellipse
                ctx.ellipse(cx, cy, half * 0.72, half, 0, 0, Math.PI * 2);
                break;

            case 'triangle':
                ctx.moveTo(cx, y);
                ctx.lineTo(x + size, y + size);
                ctx.lineTo(x, y + size);
                break;

            case 'egg': {
                // Pointed-top oval (pointy apex, round base)
                ctx.moveTo(cx, y);
                ctx.bezierCurveTo(x + size, y + half * 0.2, x + size, y + size, cx, y + size);
                ctx.bezierCurveTo(x, y + size, x, y + half * 0.2, cx, y);
                break;
            }

            case 'cloud': {
                ctx.arc(cx, cy + half * 0.15, half * 0.48, Math.PI * 0.9, Math.PI * 0.1);
                ctx.arc(cx + half * 0.4, cy - half * 0.1, half * 0.38, Math.PI * 1.5, Math.PI * 0.5);
                ctx.arc(cx, cy - half * 0.35, half * 0.4, 0, Math.PI, true);
                ctx.arc(cx - half * 0.42, cy - half * 0.05, half * 0.35, Math.PI * 1.6, Math.PI * 0.7);
                break;
            }

            case 'clover': {
                const r = half * 0.42;
                const d = half * 0.28;
                ctx.arc(cx, cy - d, r, 0, Math.PI * 2);
                ctx.moveTo(cx + d + r, cy);
                ctx.arc(cx + d, cy, r, 0, Math.PI * 2);
                ctx.moveTo(cx + r, cy + d);
                ctx.arc(cx, cy + d, r, 0, Math.PI * 2);
                ctx.moveTo(cx - d + r, cy);
                ctx.arc(cx - d, cy, r, 0, Math.PI * 2);
                break;
            }

            case 'badge': {
                // Scalloped (rounded-point) medallion
                const points = 12;
                const outerR = half;
                const innerR = half * 0.82;
                for (let i = 0; i <= points * 2; i++) {
                    const angle = (Math.PI / points) * i - Math.PI / 2;
                    const r = i % 2 === 0 ? outerR : innerR;
                    const px = cx + r * Math.cos(angle);
                    const py = cy + r * Math.sin(angle);
                    if (i === 0) {
                        ctx.moveTo(px, py);
                    } else if (i % 2 === 0) {
                        // Arc outward between scallops
                        const prevAngle = (Math.PI / points) * (i - 1) - Math.PI / 2;
                        const midAngle = (angle + prevAngle) / 2;
                        const cpR = (outerR + innerR) / 2 + half * 0.05;
                        const cpx = cx + cpR * Math.cos(midAngle);
                        const cpy = cy + cpR * Math.sin(midAngle);
                        ctx.quadraticCurveTo(cpx, cpy, px, py);
                    } else {
                        ctx.lineTo(px, py);
                    }
                }
                break;
            }

            case 'arrow': {
                // Right-pointing arrow
                const shaft = half * 0.35;
                const headW = half * 0.45;
                const headStart = cx + half - headW;
                ctx.moveTo(x, cy - shaft);
                ctx.lineTo(headStart, cy - shaft);
                ctx.lineTo(headStart, cy - half * 0.75);
                ctx.lineTo(x + size, cy);
                ctx.lineTo(headStart, cy + half * 0.75);
                ctx.lineTo(headStart, cy + shaft);
                ctx.lineTo(x, cy + shaft);
                break;
            }

            case 'trapezoid': {
                const inset = half * 0.3;
                ctx.moveTo(x + inset, y);
                ctx.lineTo(x + size - inset, y);
                ctx.lineTo(x + size, y + size);
                ctx.lineTo(x, y + size);
                break;
            }

            case 'semicircle':
                ctx.arc(cx, cy, half, Math.PI, 0, false);
                ctx.lineTo(x + size, cy + half * 0.35);
                ctx.lineTo(x, cy + half * 0.35);
                break;

            case 'parallelogram': {
                const skew = half * 0.3;
                ctx.moveTo(x + skew, y);
                ctx.lineTo(x + size, y);
                ctx.lineTo(x + size - skew, y + size);
                ctx.lineTo(x, y + size);
                break;
            }

            case 'rhombus':
                ctx.moveTo(cx, y);
                ctx.lineTo(x + size, cy);
                ctx.lineTo(cx, y + size);
                ctx.lineTo(x, cy);
                break;

            case 'kite':
                ctx.moveTo(cx, y);
                ctx.lineTo(cx + half * 0.6, cy - half * 0.2);
                ctx.lineTo(cx, y + size);
                ctx.lineTo(cx - half * 0.6, cy - half * 0.2);
                break;

            case 'heptagon': {
                for (let i = 0; i < 7; i++) {
                    const angle = (Math.PI * 2 / 7) * i - Math.PI / 2;
                    const px = cx + half * Math.cos(angle);
                    const py = cy + half * Math.sin(angle);
                    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
                }
                break;
            }

            case 'nonagon': {
                for (let i = 0; i < 9; i++) {
                    const angle = (Math.PI * 2 / 9) * i - Math.PI / 2;
                    const px = cx + half * Math.cos(angle);
                    const py = cy + half * Math.sin(angle);
                    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
                }
                break;
            }

            case 'decagon': {
                for (let i = 0; i < 10; i++) {
                    const angle = (Math.PI * 2 / 10) * i - Math.PI / 2;
                    const px = cx + half * Math.cos(angle);
                    const py = cy + half * Math.sin(angle);
                    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
                }
                break;
            }

            case 'starburst': {
                // 10-point bursting star with long spikes
                const pts = 10;
                const outerR = half;
                const innerR = half * 0.45;
                for (let i = 0; i < pts * 2; i++) {
                    const r = i % 2 === 0 ? outerR : innerR;
                    const angle = (Math.PI / pts) * i - Math.PI / 2;
                    const px = cx + r * Math.cos(angle);
                    const py = cy + r * Math.sin(angle);
                    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
                }
                break;
            }

            case 'ribbon': {
                // Wider ribbon with forked swallow-tail bottom
                const tailDepth = half * 0.4;
                ctx.moveTo(x, y);
                ctx.lineTo(x + size, y);
                ctx.lineTo(x + size, y + size);
                ctx.lineTo(x + size - half * 0.3, y + size - tailDepth * 0.6);
                ctx.lineTo(cx, y + size - tailDepth);
                ctx.lineTo(x + half * 0.3, y + size - tailDepth * 0.6);
                ctx.lineTo(x, y + size);
                break;
            }

            case 'chevron': {
                const depth = half * 0.35;
                ctx.moveTo(x, y);
                ctx.lineTo(x + size, y);
                ctx.lineTo(x + size, y + size - depth);
                ctx.lineTo(cx, y + size);
                ctx.lineTo(x, y + size - depth);
                break;
            }

            case 'tab':
                ctx.moveTo(x, cy);
                ctx.arc(cx, cy, half, Math.PI, 0, true);
                ctx.lineTo(x + size, y + size);
                ctx.lineTo(x, y + size);
                break;

            case 'raindrop': {
                // Classic raindrop: pointed top, round bottom
                const topR = half * 0.15;
                const bodyR = half * 0.8;
                const bodyCY = cy + half * 0.18;
                ctx.moveTo(cx, y);
                ctx.bezierCurveTo(cx + topR, cy - half * 0.3, cx + bodyR, bodyCY - bodyR * 0.5, cx + bodyR, bodyCY);
                ctx.arc(cx, bodyCY, bodyR, 0, Math.PI);
                ctx.bezierCurveTo(cx - bodyR, bodyCY - bodyR * 0.5, cx - topR, cy - half * 0.3, cx, y);
                break;
            }

            case 'flower': {
                const petals = 6;
                const petalR = half * 0.45;
                const dist = half * 0.5;
                for (let i = 0; i < petals; i++) {
                    const angle = (Math.PI * 2 / petals) * i - Math.PI / 2;
                    const px = cx + dist * Math.cos(angle);
                    const py = cy + dist * Math.sin(angle);
                    if (i > 0) ctx.moveTo(px + petalR, py);
                    ctx.arc(px, py, petalR, 0, Math.PI * 2);
                }
                break;
            }

            case 'gear': {
                const teeth = 8;
                const outerR = half;
                const innerR = half * 0.72;
                const toothAngle = Math.PI / teeth;
                for (let i = 0; i < teeth; i++) {
                    const a1 = (Math.PI * 2 / teeth) * i - Math.PI / 2;
                    const a2 = a1 + toothAngle * 0.4;
                    const a3 = a1 + toothAngle * 0.6;
                    const a4 = a1 + toothAngle;
                    if (i === 0) {
                        ctx.moveTo(cx + outerR * Math.cos(a1), cy + outerR * Math.sin(a1));
                    }
                    ctx.lineTo(cx + outerR * Math.cos(a2), cy + outerR * Math.sin(a2));
                    ctx.lineTo(cx + innerR * Math.cos(a3), cy + innerR * Math.sin(a3));
                    ctx.lineTo(cx + innerR * Math.cos(a4), cy + innerR * Math.sin(a4));
                    const nextA = (Math.PI * 2 / teeth) * (i + 1) - Math.PI / 2;
                    ctx.lineTo(cx + outerR * Math.cos(nextA), cy + outerR * Math.sin(nextA));
                }
                break;
            }

            case 'explosion': {
                // Comic-book jagged explosion with rotation offset so it doesn't look like starburst
                const spikes = 14;
                const outerR = half;
                const innerR = half * 0.62;
                const rotOffset = Math.PI / spikes / 2;
                for (let i = 0; i < spikes * 2; i++) {
                    const r = i % 2 === 0 ? outerR : innerR * (0.85 + (i % 3) * 0.1);
                    const angle = (Math.PI / spikes) * i - Math.PI / 2 + rotOffset;
                    const px = cx + r * Math.cos(angle);
                    const py = cy + r * Math.sin(angle);
                    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
                }
                break;
            }

            case 'bookmark':
                ctx.moveTo(x, y);
                ctx.lineTo(x + size, y);
                ctx.lineTo(x + size, y + size);
                ctx.lineTo(cx, y + size - half * 0.4);
                ctx.lineTo(x, y + size);
                break;

            case 'ticket': {
                const notchR = half * 0.15;
                ctx.moveTo(x, y);
                ctx.lineTo(x + size, y);
                ctx.lineTo(x + size, cy - notchR);
                ctx.arc(x + size, cy, notchR, -Math.PI / 2, Math.PI / 2, true);
                ctx.lineTo(x + size, y + size);
                ctx.lineTo(x, y + size);
                ctx.lineTo(x, cy + notchR);
                ctx.arc(x, cy, notchR, Math.PI / 2, -Math.PI / 2, true);
                break;
            }

            case 'speech-bubble':
                ctx.moveTo(x + half * 0.3, y);
                ctx.lineTo(x + size - half * 0.3, y);
                ctx.quadraticCurveTo(x + size, y, x + size, y + half * 0.3);
                ctx.lineTo(x + size, y + size - half * 0.7);
                ctx.quadraticCurveTo(x + size, y + size - half * 0.4, x + size - half * 0.3, y + size - half * 0.4);
                ctx.lineTo(cx + half * 0.2, y + size - half * 0.4);
                ctx.lineTo(cx - half * 0.1, y + size);
                ctx.lineTo(cx - half * 0.05, y + size - half * 0.4);
                ctx.lineTo(x + half * 0.3, y + size - half * 0.4);
                ctx.quadraticCurveTo(x, y + size - half * 0.4, x, y + size - half * 0.7);
                ctx.lineTo(x, y + half * 0.3);
                ctx.quadraticCurveTo(x, y, x + half * 0.3, y);
                break;

            case 'tombstone': {
                // Wide base with narrower rounded cap (shoulders)
                const shoulderIn = half * 0.2;
                const capR = half - shoulderIn;
                const capCenterY = cy - half * 0.2;
                ctx.moveTo(x, y + size);
                ctx.lineTo(x, capCenterY);
                ctx.quadraticCurveTo(x, capCenterY - capR * 0.4, x + shoulderIn, capCenterY - capR * 0.6);
                ctx.arc(cx, capCenterY - capR * 0.6, capR, Math.PI, 0, false);
                ctx.quadraticCurveTo(x + size, capCenterY - capR * 0.4, x + size, capCenterY);
                ctx.lineTo(x + size, y + size);
                break;
            }

            case 'pill':
                ctx.ellipse(cx, cy, half, half * 0.5, 0, 0, Math.PI * 2);
                break;

            case 'wavy-circle': {
                // Circle with pronounced scalloped / wavy edge
                const waves = 10;
                const amp = half * 0.18;
                const steps = 240;
                for (let i = 0; i <= steps; i++) {
                    const t = (Math.PI * 2 * i) / steps;
                    const r = (half - amp) + amp * Math.cos(waves * t);
                    const px = cx + r * Math.cos(t);
                    const py = cy + r * Math.sin(t);
                    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
                }
                break;
            }

            case 'arrow-up': {
                const shaft = half * 0.35;
                const headH = half * 0.45;
                const headStart = cy - half + headH;
                ctx.moveTo(cx - shaft, y + size);
                ctx.lineTo(cx - shaft, headStart);
                ctx.lineTo(cx - half * 0.75, headStart);
                ctx.lineTo(cx, y);
                ctx.lineTo(cx + half * 0.75, headStart);
                ctx.lineTo(cx + shaft, headStart);
                ctx.lineTo(cx + shaft, y + size);
                break;
            }

            case 'arrow-down': {
                const shaft = half * 0.35;
                const headH = half * 0.45;
                const headStart = cy + half - headH;
                ctx.moveTo(cx - shaft, y);
                ctx.lineTo(cx + shaft, y);
                ctx.lineTo(cx + shaft, headStart);
                ctx.lineTo(cx + half * 0.75, headStart);
                ctx.lineTo(cx, y + size);
                ctx.lineTo(cx - half * 0.75, headStart);
                ctx.lineTo(cx - shaft, headStart);
                break;
            }

            case 'arrow-left': {
                const shaft = half * 0.35;
                const headW = half * 0.45;
                const headStart = cx - half + headW;
                ctx.moveTo(x + size, cy - shaft);
                ctx.lineTo(x + size, cy + shaft);
                ctx.lineTo(headStart, cy + shaft);
                ctx.lineTo(headStart, cy + half * 0.75);
                ctx.lineTo(x, cy);
                ctx.lineTo(headStart, cy - half * 0.75);
                ctx.lineTo(headStart, cy - shaft);
                break;
            }

            case 'chevron-up': {
                const depth = half * 0.35;
                ctx.moveTo(x, y + size);
                ctx.lineTo(x, y + depth);
                ctx.lineTo(cx, y);
                ctx.lineTo(x + size, y + depth);
                ctx.lineTo(x + size, y + size);
                break;
            }

            case 'chevron-left': {
                const depth = half * 0.35;
                ctx.moveTo(x + size, y);
                ctx.lineTo(x + depth, y);
                ctx.lineTo(x, cy);
                ctx.lineTo(x + depth, y + size);
                ctx.lineTo(x + size, y + size);
                break;
            }

            case 'chevron-right': {
                const depth = half * 0.35;
                ctx.moveTo(x, y);
                ctx.lineTo(x + size - depth, y);
                ctx.lineTo(x + size, cy);
                ctx.lineTo(x + size - depth, y + size);
                ctx.lineTo(x, y + size);
                break;
            }

            case 'plus-sign': {
                // Thicker plus (cross) with narrower arms
                const arm = half * 0.28;
                ctx.moveTo(cx - arm, y);
                ctx.lineTo(cx + arm, y);
                ctx.lineTo(cx + arm, cy - arm);
                ctx.lineTo(cx + half, cy - arm);
                ctx.lineTo(cx + half, cy + arm);
                ctx.lineTo(cx + arm, cy + arm);
                ctx.lineTo(cx + arm, y + size);
                ctx.lineTo(cx - arm, y + size);
                ctx.lineTo(cx - arm, cy + arm);
                ctx.lineTo(cx - half, cy + arm);
                ctx.lineTo(cx - half, cy - arm);
                ctx.lineTo(cx - arm, cy - arm);
                break;
            }

            case 'x-mark': {
                // X / cross-out mark with thick strokes
                const t = half * 0.22;
                const r = half;
                const diag = Math.SQRT1_2;
                // Build two crossed rectangles as one path
                // Top-left tip
                ctx.moveTo(cx - r * diag + t * diag, cy - r * diag - t * diag);
                ctx.lineTo(cx - r * diag - t * diag, cy - r * diag + t * diag);
                ctx.lineTo(cx - t * diag, cy + t * diag);
                ctx.lineTo(cx - r * diag - t * diag, cy + r * diag - t * diag);
                ctx.lineTo(cx - r * diag + t * diag, cy + r * diag + t * diag);
                ctx.lineTo(cx, cy + 2 * t * diag);
                ctx.lineTo(cx + r * diag - t * diag, cy + r * diag + t * diag);
                ctx.lineTo(cx + r * diag + t * diag, cy + r * diag - t * diag);
                ctx.lineTo(cx + t * diag, cy + t * diag);
                ctx.lineTo(cx + r * diag + t * diag, cy - r * diag + t * diag);
                ctx.lineTo(cx + r * diag - t * diag, cy - r * diag - t * diag);
                ctx.lineTo(cx, cy - 2 * t * diag);
                break;
            }

            case 'checkmark': {
                // Filled thick checkmark polygon
                const t = half * 0.22;
                ctx.moveTo(x, cy + t * 0.2);
                ctx.lineTo(x + half * 0.35, cy - t * 0.5);
                ctx.lineTo(cx - half * 0.05, cy + half * 0.35);
                ctx.lineTo(x + size - half * 0.1, y + half * 0.2);
                ctx.lineTo(x + size, y + half * 0.55);
                ctx.lineTo(cx - half * 0.05, y + size - half * 0.05);
                ctx.lineTo(x + half * 0.1, cy + half * 0.4);
                break;
            }

            case 'crescent': {
                // Crescent moon: two arcs subtracting
                ctx.arc(cx, cy, half, Math.PI * 0.25, Math.PI * 1.75, false);
                ctx.arc(cx + half * 0.35, cy, half * 0.85, Math.PI * 1.75, Math.PI * 0.25, true);
                break;
            }

            case 'sunburst': {
                // Central disc with triangular rays outside it (spike star with wide base)
                const rays = 12;
                const innerR = half * 0.55;
                const outerR = half;
                const spread = (Math.PI * 2 / rays) * 0.35;
                for (let i = 0; i < rays; i++) {
                    const baseAngle = (Math.PI * 2 / rays) * i - Math.PI / 2;
                    const a1 = baseAngle - spread;
                    const a2 = baseAngle + spread;
                    const p1x = cx + innerR * Math.cos(a1);
                    const p1y = cy + innerR * Math.sin(a1);
                    const tipX = cx + outerR * Math.cos(baseAngle);
                    const tipY = cy + outerR * Math.sin(baseAngle);
                    const p2x = cx + innerR * Math.cos(a2);
                    const p2y = cy + innerR * Math.sin(a2);
                    if (i === 0) ctx.moveTo(p1x, p1y);
                    else ctx.lineTo(p1x, p1y);
                    ctx.lineTo(tipX, tipY);
                    ctx.lineTo(p2x, p2y);
                }
                break;
            }

            case 'lightning': {
                // Lightning bolt (zigzag)
                ctx.moveTo(cx + half * 0.2, y);
                ctx.lineTo(x + half * 0.1, cy + half * 0.1);
                ctx.lineTo(cx - half * 0.1, cy + half * 0.1);
                ctx.lineTo(cx - half * 0.5, y + size);
                ctx.lineTo(cx + half * 0.4, cy - half * 0.05);
                ctx.lineTo(cx + half * 0.05, cy - half * 0.05);
                ctx.lineTo(cx + half * 0.7, y);
                break;
            }

            case 'play-triangle': {
                // Play button equilateral triangle pointing right
                const inset = half * 0.1;
                ctx.moveTo(x + inset, y);
                ctx.lineTo(x + size - inset, cy);
                ctx.lineTo(x + inset, y + size);
                break;
            }

            case 'location-pin': {
                // Map pin: round top with pointed bottom
                const topR = half * 0.7;
                const topCY = cy - half * 0.2;
                ctx.moveTo(cx, y + size);
                ctx.bezierCurveTo(cx - topR * 0.4, topCY + topR * 0.6, cx - topR, topCY + topR * 0.5, cx - topR, topCY);
                ctx.arc(cx, topCY, topR, Math.PI, 0, false);
                ctx.bezierCurveTo(cx + topR, topCY + topR * 0.5, cx + topR * 0.4, topCY + topR * 0.6, cx, y + size);
                break;
            }

            case 'house': {
                // Pentagon-home shape
                const roofY = y + half * 0.55;
                ctx.moveTo(x, y + size);
                ctx.lineTo(x, roofY);
                ctx.lineTo(cx, y);
                ctx.lineTo(x + size, roofY);
                ctx.lineTo(x + size, y + size);
                break;
            }

            case 'hendecagon': {
                for (let i = 0; i < 11; i++) {
                    const angle = (Math.PI * 2 / 11) * i - Math.PI / 2;
                    const px = cx + half * Math.cos(angle);
                    const py = cy + half * Math.sin(angle);
                    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
                }
                break;
            }

            case 'dodecagon': {
                for (let i = 0; i < 12; i++) {
                    const angle = (Math.PI * 2 / 12) * i - Math.PI / 2;
                    const px = cx + half * Math.cos(angle);
                    const py = cy + half * Math.sin(angle);
                    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
                }
                break;
            }

            case 'tag': {
                // Price tag: rect with angled cut on left side
                const cut = half * 0.4;
                ctx.moveTo(x + cut, y);
                ctx.lineTo(x + size, y);
                ctx.lineTo(x + size, y + size);
                ctx.lineTo(x + cut, y + size);
                ctx.lineTo(x, cy);
                break;
            }

            case 'blob': {
                // Organic irregular blob (fixed deterministic shape)
                const pts = [
                    [0, -1], [0.6, -0.85], [0.95, -0.3], [0.85, 0.25],
                    [1, 0.7], [0.45, 0.95], [-0.15, 0.8], [-0.75, 0.95],
                    [-0.95, 0.35], [-0.8, -0.25], [-1, -0.7], [-0.45, -0.95]
                ];
                for (let i = 0; i < pts.length; i++) {
                    const [dx, dy] = pts[i];
                    const px = cx + half * dx;
                    const py = cy + half * dy;
                    const [ndx, ndy] = pts[(i + 1) % pts.length];
                    const nx = cx + half * ndx;
                    const ny = cy + half * ndy;
                    if (i === 0) ctx.moveTo(px, py);
                    const mx = (px + nx) / 2;
                    const my = (py + ny) / 2;
                    ctx.quadraticCurveTo(px, py, mx, my);
                }
                break;
            }

            case 'barrel': {
                // Rectangle with bulging sides
                const bulge = half * 0.15;
                ctx.moveTo(x, y);
                ctx.lineTo(x + size, y);
                ctx.quadraticCurveTo(x + size + bulge, cy, x + size, y + size);
                ctx.lineTo(x, y + size);
                ctx.quadraticCurveTo(x - bulge, cy, x, y);
                break;
            }

            case 'flag': {
                // Pennant flag with notched right edge
                const notch = half * 0.35;
                ctx.moveTo(x, y);
                ctx.lineTo(x + size, y);
                ctx.lineTo(x + size - notch, cy);
                ctx.lineTo(x + size, y + size);
                ctx.lineTo(x, y + size);
                break;
            }

            case 'lens': {
                // Horizontal vesica piscis (pointed oval sideways)
                ctx.moveTo(x, cy);
                ctx.bezierCurveTo(cx - half * 0.6, cy - half * 1.1, cx + half * 0.6, cy - half * 1.1, x + size, cy);
                ctx.bezierCurveTo(cx + half * 0.6, cy + half * 1.1, cx - half * 0.6, cy + half * 1.1, x, cy);
                break;
            }

            case 'sun': {
                // Circle with triangular rays
                const rays = 8;
                const innerR = half * 0.55;
                const outerR = half;
                for (let i = 0; i < rays * 2; i++) {
                    const r = i % 2 === 0 ? outerR : innerR;
                    const angle = (Math.PI / rays) * i - Math.PI / 2;
                    const px = cx + r * Math.cos(angle);
                    const py = cy + r * Math.sin(angle);
                    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
                }
                break;
            }

            case 'gemstone': {
                // Top-down view of a gem cut
                const topY = y + half * 0.3;
                const w1 = half * 0.35;
                const w2 = half * 0.75;
                ctx.moveTo(cx - w1, y);
                ctx.lineTo(cx + w1, y);
                ctx.lineTo(cx + w2, topY);
                ctx.lineTo(cx + half, topY);
                ctx.lineTo(cx, y + size);
                ctx.lineTo(cx - half, topY);
                ctx.lineTo(cx - w2, topY);
                break;
            }

            default:
                this.roundRect(ctx, x, y, size, size, radius);
                return;
        }
        ctx.closePath();
    },

    readFileAsDataUrl(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(file);
        });
    },

    loadImage(src) {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.crossOrigin = 'anonymous';
            image.onload = () => resolve(image);
            image.onerror = reject;
            image.src = src;
        });
    },

    observe() {
        const initializeControls = () => this.init(document);
        initializeControls();

        const observer = new MutationObserver(() => initializeControls());
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
};

const QRCodeFrameControls = {
    activeFrameRefreshRequests: new WeakMap(),
    framePreviewRefreshRequests: new WeakMap(),

    qrCodeWrapped: false,
    activeFrameRefreshRequests: new WeakMap(),
    framePreviewRefreshRequests: new WeakMap(),

    updateStylingVisibility(root = document, frameType = this.getActiveFrameType(root)) {
        if (!window.QRFrames) {
            return;
        }

        const showTextSettings = window.QRFrames.supportsFrameText(frameType);
        root.querySelectorAll('[data-frame-setting="textColor"]').forEach(section => {
            section.hidden = !showTextSettings;
        });

        const stageText = root.querySelector('#customFrameStageText');
        if (stageText) {
            stageText.hidden = !showTextSettings;
            stageText.contentEditable = showTextSettings ? 'true' : 'false';
            stageText.dataset.placeholder = showTextSettings
                ? I18n.translateString('Edit frame text')
                : '';
        }

        this.syncStageTextEditor(root, frameType);
    },

    normalizeInlineFrameText(value) {
        return String(value || '')
            .replace(/\r\n?/g, '\n')
            .replace(/\u00a0/g, ' ')
            .slice(0, 160);
    },

    setStageTextContent(stageText, value) {
        if (!stageText) {
            return;
        }

        const normalizedValue = this.normalizeInlineFrameText(value);
        if (stageText.textContent !== normalizedValue) {
            stageText.textContent = normalizedValue;
        }
    },

    syncStageTextEditor(root = document, frameType = this.getActiveFrameType(root), stageMetrics = null) {
        if (!window.QRFrames) {
            return;
        }

        const stage = root.querySelector('#customFrameStage');
        const stageText = root.querySelector('#customFrameStageText');
        const moveHandle = root.querySelector('#customFrameStageTextMoveHandle');
        if (!stage || !stageText) {
            return;
        }

        if (!frameType || !window.QRFrames.supportsFrameText(frameType)) {
            stageText.hidden = true;
            if (moveHandle) {
                moveHandle.hidden = true;
            }
            return;
        }

        const metrics = stageMetrics || this.getCustomFrameStageMetrics(stage);
        const textLayout = metrics ? window.QRFrames.getFrameTextLayout(frameType, metrics.width) : null;
        if (!metrics || !textLayout) {
            stageText.hidden = true;
            if (moveHandle) {
                moveHandle.hidden = true;
            }
            return;
        }

        stageText.hidden = false;
        stageText.style.left = `${textLayout.left}px`;
        stageText.style.top = `${textLayout.top}px`;
        stageText.style.width = `${textLayout.width}px`;
        stageText.style.height = `${textLayout.height}px`;
        stageText.style.fontSize = `${textLayout.fontSize}px`;
        stageText.style.fontWeight = textLayout.fontWeight;
        stageText.style.fontFamily = textLayout.fontFamily;
        stageText.style.color = textLayout.color;
        stageText.style.transform = textLayout.rotation ? `rotate(${textLayout.rotation}deg)` : 'none';
        if (moveHandle) {
            moveHandle.hidden = false;
            moveHandle.style.left = `${textLayout.left - 14}px`;
            moveHandle.style.top = `${textLayout.top - 14}px`;
        }
    },

    autoSizeStageTextEditor(root = document, frameType = this.getActiveFrameType(root)) {
        if (!window.QRFrames?.supportsFrameText(frameType)) {
            return;
        }

        const stage = root.querySelector('#customFrameStage');
        const stageText = root.querySelector('#customFrameStageText');
        if (!stage || !stageText) {
            return;
        }

        const stageMetrics = this.getCustomFrameStageMetrics(stage);
        if (!stageMetrics) {
            return;
        }

        const currentRect = window.QRFrames.getFrameTextRect(frameType, stageMetrics.width);
        if (!currentRect) {
            return;
        }

        const measuredHeight = Math.max(currentRect.height, stageText.scrollHeight + 4);
        const measuredWidth = Math.max(currentRect.width, Math.min(stageMetrics.width * 0.92, stageText.scrollWidth + 12));
        const nextRect = window.QRFrames.setFrameTextRect(frameType, {
            width: measuredWidth,
            height: measuredHeight
        }, stageMetrics.width);
        if (!nextRect) {
            return;
        }

        this.syncStageTextEditor(root, frameType, stageMetrics);
    },

    notifyFrameEditorChange(root = document) {
        this.applySettings(root);
        this.autoSizeStageTextEditor(root);
        this.syncStageTextEditor(root);
        this.scheduleFramePreviewSampleRefresh(root);
        this.scheduleActiveFrameRefresh(root);
        window.QRFrames.updateDeveloperJsonViewer?.();
    },

    getStageRotationFromPointer(interactionRect, stageMetrics, event) {
        const rectLeft = interactionRect.xPct * stageMetrics.width;
        const rectTop = interactionRect.yPct * stageMetrics.height;
        const rectWidth = interactionRect.widthPct * stageMetrics.width;
        const rectHeight = interactionRect.heightPct * stageMetrics.height;
        const centerX = rectLeft + (rectWidth / 2);
        const centerY = rectTop + (rectHeight / 2);
        const pointerX = event.clientX - stageMetrics.left;
        const pointerY = event.clientY - stageMetrics.top;
        const angle = (Math.atan2(pointerY - centerY, pointerX - centerX) * 180 / Math.PI) + 90;
        return window.QRFrames.normalizeQRRotation(angle);
    },

    init(root = document) {
        if (!window.QRFrames) {
            return;
        }

        const stageText = root.querySelector('#customFrameStageText');
        const frameForegroundColorControl = FrameColorControl.getControl(root, 'frameForegroundColor');
        const frameBackgroundColorControl = FrameColorControl.getControl(root, 'frameBackgroundColor');
        const frameTextColorControl = FrameColorControl.getControl(root, 'frameTextColor');

        if (!stageText || !frameForegroundColorControl || !frameBackgroundColorControl || !frameTextColorControl) {
            return;
        }

        if (stageText.dataset.frameControlsInitialized !== 'true') {
            stageText.addEventListener('input', () => {
                const normalizedValue = this.normalizeInlineFrameText(stageText.textContent);
                if (stageText.textContent !== normalizedValue) {
                    stageText.textContent = normalizedValue;
                }
                this.notifyFrameEditorChange(root);
            });

            FrameColorControl.bindControl(frameForegroundColorControl, () => this.notifyFrameEditorChange(root));
            FrameColorControl.bindControl(frameBackgroundColorControl, () => this.notifyFrameEditorChange(root));
            FrameColorControl.bindControl(frameTextColorControl, () => this.notifyFrameEditorChange(root), { markUserModified: true });

            const frameSelector = root.querySelector('#frameSelector');
            const frameSearchInput = root.querySelector('#framePresetSearchInput');
            const frameSearchEmpty = root.querySelector('#framePresetSearchEmpty');
            if (frameSelector && frameSelector.dataset.frameSyncBound !== 'true') {
                frameSelector.addEventListener('click', (event) => {
                    const deleteAction = event.target.closest('[data-frame-delete="true"]');
                    if (deleteAction?.dataset.customFrameId) {
                        event.preventDefault();
                        event.stopPropagation();
                        const removedFrameId = deleteAction.dataset.customFrameId;
                        const wasActiveFrame = window.QRFrames.activeCustomFrameId === removedFrameId;
                        const removed = window.QRFrames.deleteCustomFrame(removedFrameId);
                        if (!removed) {
                            return;
                        }
                        const shell = deleteAction.closest('.frame-card-shell-custom');
                        shell?.remove();
                        if (wasActiveFrame) {
                            if (window.QRFrames.hasCustomFrame()) {
                                this.activateFrameByType(root, 'custom');
                            } else {
                                this.activateFrameByType(root, 'none');
                            }
                        }
                        this.updatePositionPanelVisibility(root, this.getActiveFrameType(root));
                        this.applyFrameSearch(root, frameSearchInput, frameSearchEmpty);
                        return;
                    }

                    const card = event.target.closest('.frame-card');
                    if (!card || !card.dataset.frame) {
                        return;
                    }
                    const previousActiveCard = frameSelector.querySelector('.frame-card.active');
                    const previousFrameType = previousActiveCard?.dataset.frame || this.getActiveFrameType(root);
                    if (previousActiveCard && previousActiveCard !== card) {
                        previousActiveCard.classList.remove('active');
                        window.QRFrames.resetFramePreviewCard(previousActiveCard);
                    }
                    card.classList.add('active');
                    this.applySettings(root, previousFrameType);
                    if (card.dataset.frame === 'custom' && card.dataset.customFrameId) {
                        window.QRFrames.setActiveCustomFrame(card.dataset.customFrameId);
                    }
                    window.QRFrames.applyFrameCustomization(card.dataset.frame);
                    this.syncControlValues(root, card.dataset.frame);
                    this.updateStylingVisibility(root, card.dataset.frame);
                    this.updatePositionPanelVisibility(root, card.dataset.frame);
                    this.scheduleFramePreviewSampleRefresh(root);
                    this.scheduleActiveFrameRefresh(root);
                    window.QRFrames.updateDeveloperJsonViewer?.();
                }, true);
                frameSelector.dataset.frameSyncBound = 'true';
            }

            if (frameSearchInput && frameSearchInput.dataset.frameSearchBound !== 'true') {
                frameSearchInput.addEventListener('input', () => {
                    this.applyFrameSearch(root, frameSearchInput, frameSearchEmpty);
                });
                frameSearchInput.dataset.frameSearchBound = 'true';
            }

            this.initCustomFrameControls(root);
            this.applyFrameSearch(root, frameSearchInput, frameSearchEmpty);

            stageText.dataset.frameControlsInitialized = 'true';
        }

        const activeFrameType = this.getActiveFrameType(root);
        window.QRFrames.applyFrameCustomization(activeFrameType);
        this.syncControlValues(root, activeFrameType);
        this.updateStylingVisibility(root, activeFrameType);
        this.applySettings(root);
        this.updatePositionPanelVisibility(root, activeFrameType);
    },

    updatePositionPanelVisibility(root = document, frameType = this.getActiveFrameType(root)) {
        const panel = root.querySelector('#customFramePositionPanel');
        if (!panel) {
            return;
        }
        const shouldShow = Boolean(frameType) && (frameType !== 'custom' || window.QRFrames.hasCustomFrame());
        panel.hidden = !shouldShow;
        if (shouldShow) {
            this.updateCustomFrameStage(root, frameType);
        }
    },

    initCustomFrameControls(root = document) {
        const fileInput = root.querySelector('#customFrameInput');
        const selector = root.querySelector('#frameSelector');
        if (!fileInput || !selector) {
            return;
        }

        // Upload action delegated through frame selector clicks
        if (selector.dataset.customUploadBound !== 'true') {
            selector.addEventListener('click', (event) => {
                const action = event.target.closest('[data-frame-action="upload-custom"]');
                if (!action) {
                    return;
                }
                event.preventDefault();
                event.stopPropagation();
                fileInput.click();
            });
            selector.addEventListener('keydown', (event) => {
                const action = event.target.closest('[data-frame-action="upload-custom"]');
                if (!action) {
                    return;
                }
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    fileInput.click();
                }
            });
            selector.dataset.customUploadBound = 'true';
        }

        if (fileInput.dataset.customFrameInitialized !== 'true') {
            fileInput.addEventListener('change', async (event) => {
                const [file] = event.target.files || [];
                if (!file) {
                    return;
                }
                const loaded = await window.QRFrames.loadCustomFrameFile(file);
                fileInput.value = '';
                if (!loaded) {
                    return;
                }
                this.installCustomFrameCard(root);
                this.activateFrameByType(root, 'custom');
                this.updatePositionPanelVisibility(root, 'custom');
                this.updateCustomFrameStage(root);
            });
            fileInput.dataset.customFrameInitialized = 'true';
        }

        this.bindPositionStage(root);

        const centerBtn = root.querySelector('#customFrameCenterButton');
        if (centerBtn && centerBtn.dataset.customFrameCenterBound !== 'true') {
            centerBtn.addEventListener('click', () => {
                const frameType = this.getActiveFrameType(root);
                const rect = window.QRFrames.getFrameQRRect(frameType);
                const range = window.QRFrames.getFrameQRRectRange(frameType, rect);
                const centeredX = 0.5 - (rect.widthPct / 2);
                const centeredY = 0.5 - (rect.heightPct / 2);
                this.updateFramePlacementFromControls(root, {
                    xPct: Math.min(range.maxXPct, Math.max(range.minXPct, centeredX)),
                    yPct: Math.min(range.maxYPct, Math.max(range.minYPct, centeredY))
                });
            });
            centerBtn.dataset.customFrameCenterBound = 'true';
        }

        const resetBtn = root.querySelector('#customFrameResetButton');
        if (resetBtn && resetBtn.dataset.customFrameResetBound !== 'true') {
            resetBtn.addEventListener('click', () => {
                const frameType = this.getActiveFrameType(root);
                window.QRFrames.resetFrameToDefaults(frameType);
                window.QRFrames.resetFrameQRRect(frameType);
                window.QRFrames.resetFrameTextRect(frameType);
                this.syncControlValues(root, frameType);
                this.syncCustomFrameStageBox(root);
                this.updateCustomFrameStage(root, frameType);
                this.updateFramePreviewSamples();
                this.triggerActiveFrameRefresh(root);
                window.QRFrames.updateDeveloperJsonViewer?.();
            });
            resetBtn.dataset.customFrameResetBound = 'true';
        }

        // Apply visibility on initial render
        this.updatePositionPanelVisibility(root, this.getActiveFrameType(root));
    },

    installCustomFrameCard(root = document) {
        const grid = root.querySelector('#frameSelector');
        if (!grid) {
            return;
        }
        grid.querySelectorAll('.frame-card[data-custom-frame="true"]').forEach(card => card.closest('.frame-card-shell-custom')?.remove());
        const uploadTile = grid.querySelector('[data-frame-action="upload-custom"]');
        let insertAfter = uploadTile;
        window.QRFrames.customFrames.forEach(frame => {
            const wrapper = document.createElement('div');
            wrapper.innerHTML = window.QRFrames.getCustomFrameCardMarkup(frame).trim();
            const card = wrapper.firstElementChild;
            if (!card) {
                return;
            }
            if (insertAfter?.nextSibling) {
                grid.insertBefore(card, insertAfter.nextSibling);
            } else if (uploadTile) {
                grid.appendChild(card);
            } else {
                grid.appendChild(card);
            }
            insertAfter = card;
        });
        this.applyFrameSearch(root, root.querySelector('#framePresetSearchInput'), root.querySelector('#framePresetSearchEmpty'));
    },

    updateCustomFrameStage(root = document, frameType = this.getActiveFrameType(root)) {
        const stage = root.querySelector('#customFrameStage');
        const img = root.querySelector('#customFrameStageImage');
        if (!stage || !img || !frameType) {
            return;
        }
        const dataUrl = window.QRFrames.getPlacementStageImageDataUrl(frameType, 300, { omitText: true });
        if (!dataUrl) {
            return;
        }
        img.src = dataUrl;
        img.alt = frameType === 'custom'
            ? I18n.translateString('Custom frame placement preview')
            : I18n.translateString('Frame placement preview');
        if (img.complete) {
            this.syncCustomFrameStageBox(root, frameType);
        } else {
            img.addEventListener('load', () => this.syncCustomFrameStageBox(root, frameType), { once: true });
        }
    },

    getCustomFrameStageMetrics(stage) {
        if (!stage) {
            return null;
        }

        const stageRect = stage.getBoundingClientRect();
        const width = stage.clientWidth;
        const height = stage.clientHeight;

        if (!width || !height) {
            return null;
        }

        return {
            width,
            height,
            left: stageRect.left + stage.clientLeft,
            top: stageRect.top + stage.clientTop
        };
    },

    syncCustomFrameStageBox(root = document, frameType = this.getActiveFrameType(root), remainingRetries = 2) {
        const stage = root.querySelector('#customFrameStage');
        const box = root.querySelector('#customFrameQRBox');
        const boxChrome = root.querySelector('#customFrameQRBoxChrome');
        if (!stage || !box || !frameType) {
            return;
        }
        const stageMetrics = this.getCustomFrameStageMetrics(stage);
        if (!stageMetrics) {
            if (remainingRetries > 0) {
                window.requestAnimationFrame(() => this.syncCustomFrameStageBox(root, frameType, remainingRetries - 1));
            }
            return;
        }
        const qrRect = window.QRFrames.getFrameQRRect(frameType);
        const widthPx = qrRect.widthPct * stageMetrics.width;
        const heightPx = qrRect.heightPct * stageMetrics.height;
        const leftPx = qrRect.xPct * stageMetrics.width;
        const topPx = qrRect.yPct * stageMetrics.height;
        box.style.width = `${widthPx}px`;
        box.style.height = `${heightPx}px`;
        box.style.left = `${leftPx}px`;
        box.style.top = `${topPx}px`;
        if (boxChrome) {
            const qrRotation = window.QRFrames.getFrameCustomization(frameType).qrRotation || 0;
            boxChrome.style.transform = qrRotation ? `rotate(${qrRotation}deg)` : 'none';
        }

        this.syncStageTextEditor(root, frameType, stageMetrics);
    },

    updateFramePlacementFromControls(root = document, partial = {}) {
        const frameType = this.getActiveFrameType(root);
        if (!frameType) {
            return;
        }
        window.QRFrames.setFrameQRRect(frameType, partial);
        this.syncCustomFrameStageBox(root);
        this.scheduleFramePreviewSampleRefresh(root);
        this.scheduleActiveFrameRefresh(root);
    },

    scheduleActiveFrameRefresh(root = document) {
        if (this.activeFrameRefreshRequests.has(root)) {
            return;
        }

        const refreshRequest = window.requestAnimationFrame(() => {
            this.activeFrameRefreshRequests.delete(root);
            this.triggerActiveFrameRefresh(root);
        });

        this.activeFrameRefreshRequests.set(root, refreshRequest);
    },

    scheduleFramePreviewSampleRefresh(root = document) {
        if (this.framePreviewRefreshRequests.has(root)) {
            return;
        }

        const refreshRequest = window.requestAnimationFrame(() => {
            this.framePreviewRefreshRequests.delete(root);
            this.updateFramePreviewSamples(root);
        });

        this.framePreviewRefreshRequests.set(root, refreshRequest);
    },

    bindPositionStage(root = document) {
        const stage = root.querySelector('#customFrameStage');
        const box = root.querySelector('#customFrameQRBox');
        const stageTextMoveHandle = root.querySelector('#customFrameStageTextMoveHandle');
        if (!stage || !box || stage.dataset.customStageBound === 'true') {
            return;
        }
        stage.dataset.customStageBound = 'true';

        let interactionMode = '';
        let pointerId = null;
        let dragOffsetX = 0;
        let dragOffsetY = 0;
        let resizeHandle = '';
        let interactionRect = null;
        let rotationOffset = 0;
        let textDragOffsetX = 0;
        let textDragOffsetY = 0;
        let textInteractionRect = null;

        const onPointerDown = (event) => {
            const frameType = this.getActiveFrameType(root);
            if (!frameType) {
                return;
            }
            const textMoveHandleElement = event.target.closest('#customFrameStageTextMoveHandle');
            const rotateHandleElement = event.target.closest('[data-placement-rotate-handle]');
            const resizeHandleElement = event.target.closest('[data-placement-resize-handle]');
            resizeHandle = resizeHandleElement?.dataset.placementResizeHandle || '';
            interactionRect = window.QRFrames.getFrameQRRect(frameType);
            pointerId = event.pointerId;

            if (textMoveHandleElement) {
                const stageMetrics = this.getCustomFrameStageMetrics(stage);
                if (!stageMetrics) {
                    return;
                }
                interactionMode = 'move-text';
                textInteractionRect = window.QRFrames.getFrameTextRect(frameType, stageMetrics.width);
                const handleRect = textMoveHandleElement.getBoundingClientRect();
                textDragOffsetX = event.clientX - handleRect.left + 14;
                textDragOffsetY = event.clientY - handleRect.top + 14;
                stage.setPointerCapture(pointerId);
                event.preventDefault();
                return;
            }

            if (rotateHandleElement) {
                const stageMetrics = this.getCustomFrameStageMetrics(stage);
                if (!stageMetrics) {
                    return;
                }
                interactionMode = 'rotate';
                const currentRotation = window.QRFrames.getFrameCustomization(frameType).qrRotation || 0;
                rotationOffset = currentRotation - this.getStageRotationFromPointer(interactionRect, stageMetrics, event);
                box.setPointerCapture(pointerId);
                event.preventDefault();
                return;
            }

            interactionMode = resizeHandle ? 'resize' : 'move';
            const boxRect = box.getBoundingClientRect();
            dragOffsetX = event.clientX - boxRect.left;
            dragOffsetY = event.clientY - boxRect.top;
            box.setPointerCapture(pointerId);
            event.preventDefault();
        };

        const onPointerMove = (event) => {
            if (!interactionMode) {
                return;
            }
            const stageMetrics = this.getCustomFrameStageMetrics(stage);
            if (!stageMetrics) {
                return;
            }
            const frameType = this.getActiveFrameType(root);
            if (interactionMode === 'move-text') {
                if (!textInteractionRect) {
                    return;
                }
                const nextRect = window.QRFrames.setFrameTextRect(frameType, {
                    x: event.clientX - stageMetrics.left - textDragOffsetX,
                    y: event.clientY - stageMetrics.top - textDragOffsetY
                }, stageMetrics.width);
                if (!nextRect) {
                    return;
                }
                this.syncStageTextEditor(root, frameType, stageMetrics);
                this.scheduleFramePreviewSampleRefresh(root);
                this.scheduleActiveFrameRefresh(root);
                return;
            }
            if (interactionMode === 'rotate') {
                if (!interactionRect) {
                    return;
                }
                const nextRotation = this.getStageRotationFromPointer(interactionRect, stageMetrics, event) + rotationOffset;
                window.QRFrames.setFrameCustomization(frameType, {
                    qrRotation: nextRotation
                });
                this.syncCustomFrameStageBox(root);
                this.scheduleFramePreviewSampleRefresh(root);
                this.scheduleActiveFrameRefresh(root);
                return;
            }
            if (interactionMode === 'resize') {
                if (!interactionRect) {
                    return;
                }
                const minSidePx = 16;
                const pointerX = event.clientX - stageMetrics.left;
                const pointerY = event.clientY - stageMetrics.top;
                const startLeft = interactionRect.xPct * stageMetrics.width;
                const startTop = interactionRect.yPct * stageMetrics.height;
                const startWidth = interactionRect.widthPct * stageMetrics.width;
                const startHeight = interactionRect.heightPct * stageMetrics.height;
                const startRight = startLeft + startWidth;
                const startBottom = startTop + startHeight;
                let nextLeft = startLeft;
                let nextTop = startTop;
                let nextWidthPx = startWidth;
                let nextHeightPx = startHeight;

                if (resizeHandle === 'top-left') {
                    nextLeft = Math.min(startRight - minSidePx, pointerX);
                    nextTop = Math.min(startBottom - minSidePx, pointerY);
                    nextWidthPx = startRight - nextLeft;
                    nextHeightPx = startBottom - nextTop;
                } else if (resizeHandle === 'top-right') {
                    nextTop = Math.min(startBottom - minSidePx, pointerY);
                    nextWidthPx = Math.max(minSidePx, pointerX - startLeft);
                    nextHeightPx = startBottom - nextTop;
                } else if (resizeHandle === 'bottom-left') {
                    nextLeft = Math.min(startRight - minSidePx, pointerX);
                    nextWidthPx = startRight - nextLeft;
                    nextHeightPx = Math.max(minSidePx, pointerY - startTop);
                } else if (resizeHandle === 'bottom-right') {
                    nextWidthPx = Math.max(minSidePx, pointerX - startLeft);
                    nextHeightPx = Math.max(minSidePx, pointerY - startTop);
                } else if (resizeHandle === 'top') {
                    nextTop = Math.min(startBottom - minSidePx, pointerY);
                    nextHeightPx = startBottom - nextTop;
                } else if (resizeHandle === 'right') {
                    nextWidthPx = Math.max(minSidePx, pointerX - startLeft);
                } else if (resizeHandle === 'bottom') {
                    nextHeightPx = Math.max(minSidePx, pointerY - startTop);
                } else if (resizeHandle === 'left') {
                    nextLeft = Math.min(startRight - minSidePx, pointerX);
                    nextWidthPx = startRight - nextLeft;
                } else {
                    nextWidthPx = Math.max(minSidePx, pointerX - startLeft);
                    nextHeightPx = Math.max(minSidePx, pointerY - startTop);
                }

                window.QRFrames.setFrameQRRect(frameType, {
                    xPct: nextLeft / stageMetrics.width,
                    yPct: nextTop / stageMetrics.height,
                    widthPct: nextWidthPx / stageMetrics.width,
                    heightPct: nextHeightPx / stageMetrics.height
                });
                this.syncCustomFrameStageBox(root);
                this.scheduleFramePreviewSampleRefresh(root);
                this.scheduleActiveFrameRefresh(root);
                return;
            }
            const newLeft = event.clientX - stageMetrics.left - dragOffsetX;
            const newTop = event.clientY - stageMetrics.top - dragOffsetY;
            const xPct = newLeft / stageMetrics.width;
            const yPct = newTop / stageMetrics.height;
            window.QRFrames.setFrameQRRect(frameType, { xPct, yPct });
            this.syncCustomFrameStageBox(root);
            this.scheduleFramePreviewSampleRefresh(root);
            this.scheduleActiveFrameRefresh(root);
        };

        const onPointerUp = (event) => {
            if (!interactionMode) {
                return;
            }
            const activePointerId = pointerId;
            const completedMode = interactionMode;
            interactionMode = '';
            resizeHandle = '';
            interactionRect = null;
            rotationOffset = 0;
            textInteractionRect = null;
            try {
                if (activePointerId !== null) {
                    if (completedMode === 'move-text') {
                        stage.releasePointerCapture(activePointerId);
                    } else {
                        box.releasePointerCapture(activePointerId);
                    }
                }
            } catch (_) { /* ignore */ }
            pointerId = null;
            this.triggerActiveFrameRefresh(root);
        };

        box.addEventListener('keydown', (event) => {
            const frameType = this.getActiveFrameType(root);
            if (!frameType) {
                return;
            }
            const step = event.shiftKey ? 0.05 : 0.01;
            const rect = window.QRFrames.getFrameQRRect(frameType);
            const updates = {
                ArrowLeft: { xPct: rect.xPct - step },
                ArrowRight: { xPct: rect.xPct + step },
                ArrowUp: { yPct: rect.yPct - step },
                ArrowDown: { yPct: rect.yPct + step }
            };
            if (!updates[event.key]) {
                return;
            }
            event.preventDefault();
            this.updateFramePlacementFromControls(root, updates[event.key]);
        });

        const rotateHandle = root.querySelector('#customFrameQRRotateHandle');
        if (rotateHandle && rotateHandle.dataset.rotateKeyBound !== 'true') {
            rotateHandle.addEventListener('keydown', (event) => {
                const frameType = this.getActiveFrameType(root);
                if (!frameType) {
                    return;
                }

                const step = event.shiftKey ? 15 : 1;
                let delta = 0;
                if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
                    delta = -step;
                } else if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
                    delta = step;
                }

                if (!delta) {
                    return;
                }

                event.preventDefault();
                const currentRotation = window.QRFrames.getFrameCustomization(frameType).qrRotation || 0;
                window.QRFrames.setFrameCustomization(frameType, {
                    qrRotation: currentRotation + delta
                });
                this.syncCustomFrameStageBox(root);
                this.scheduleFramePreviewSampleRefresh(root);
                this.scheduleActiveFrameRefresh(root);
            });
            rotateHandle.dataset.rotateKeyBound = 'true';
        }

        box.addEventListener('pointerdown', onPointerDown);
        box.addEventListener('pointermove', onPointerMove);
        box.addEventListener('pointerup', onPointerUp);
        box.addEventListener('pointercancel', onPointerUp);
        if (stageTextMoveHandle) {
            stageTextMoveHandle.addEventListener('pointerdown', onPointerDown);
            stage.addEventListener('pointermove', onPointerMove);
            stage.addEventListener('pointerup', onPointerUp);
            stage.addEventListener('pointercancel', onPointerUp);
        }
    },

    activateFrameByType(root = document, frameType) {
        const grid = root.querySelector('#frameSelector');
        if (!grid) {
            return;
        }
        const target = grid.querySelector(`.frame-card[data-frame="${frameType}"]`);
        if (!target) {
            return;
        }
        target.click();
    },

    syncControlValues(root = document, frameType = this.getActiveFrameType(root)) {
        if (!window.QRFrames) {
            return;
        }

        const stageText = root.querySelector('#customFrameStageText');
        const frameForegroundColorControl = FrameColorControl.getControl(root, 'frameForegroundColor');
        const frameBackgroundColorControl = FrameColorControl.getControl(root, 'frameBackgroundColor');
        const frameTextColorControl = FrameColorControl.getControl(root, 'frameTextColor');

        if (!stageText || !frameForegroundColorControl || !frameBackgroundColorControl || !frameTextColorControl) {
            return;
        }

        const customization = window.QRFrames.getFrameCustomization(frameType);

        this.setStageTextContent(stageText, customization.frameText);
        FrameColorControl.setValue(frameForegroundColorControl, customization.frameColor);
        FrameColorControl.setValue(frameBackgroundColorControl, customization.backgroundColor);
        frameTextColorControl.picker.dataset.userModified = customization.textColor ? 'true' : 'false';
        FrameColorControl.setValue(
            frameTextColorControl,
            customization.textColor || window.QRFrames.getDefaultTextColor(frameType, customization.frameColor)
        );
        this.syncStageTextEditor(root, frameType);
    },

    applySettings(root = document, frameType = this.getActiveFrameType(root)) {
        if (!window.QRFrames) {
            return;
        }

        const stageText = root.querySelector('#customFrameStageText');
        const frameForegroundColorControl = FrameColorControl.getControl(root, 'frameForegroundColor');
        const frameBackgroundColorControl = FrameColorControl.getControl(root, 'frameBackgroundColor');
        const frameTextColorControl = FrameColorControl.getControl(root, 'frameTextColor');

        if (!stageText || !frameForegroundColorControl || !frameBackgroundColorControl || !frameTextColorControl) {
            return;
        }

        window.QRFrames.setFrameCustomization(frameType, {
            frameText: this.normalizeInlineFrameText(stageText.textContent),
            frameColor: FrameColorControl.getValue(frameForegroundColorControl),
            backgroundColor: FrameColorControl.getValue(frameBackgroundColorControl),
            textColor: frameTextColorControl.picker.dataset.userModified === 'true' ? FrameColorControl.getValue(frameTextColorControl) : null
        });
    },

    async updateFramePreviewSamples(root = document) {
        if (!window.QRFrames) {
            return;
        }

        const qrContainer = root.querySelector('#qrcode');
        const liveCanvas = qrContainer?.querySelector('canvas');
        if (liveCanvas instanceof HTMLCanvasElement) {
            window.QRFrames.updateFramePreviews(liveCanvas);
            return;
        }

        const previewState = typeof QRCodePreviewRenderer !== 'undefined'
            ? QRCodePreviewRenderer.getPreviewStateForContainer(qrContainer)
            : null;

        if (previewState?.qrCanvas instanceof HTMLCanvasElement) {
            window.QRFrames.updateFramePreviews(previewState.qrCanvas);
            return;
        }

        if (
            previewState?.qrText
            && previewState?.qrOptions
            && typeof buildNativeQRCodeSVG === 'function'
            && typeof QRCodePreviewRenderer?.svgMarkupToCanvas === 'function'
        ) {
            try {
                const qrSVG = buildNativeQRCodeSVG({
                    text: previewState.qrText,
                    size: 100,
                    qrOptions: previewState.qrOptions
                });
                const qrCanvas = await QRCodePreviewRenderer.svgMarkupToCanvas(qrSVG, 100);
                window.QRFrames.updateFramePreviews(qrCanvas);
                return;
            } catch (error) {
                console.error('Unable to refresh frame thumbnails from the current QR preview.', error);
            }
        }

        const frameCards = root.querySelectorAll('.frame-card');
        frameCards.forEach(card => {
            if (!card.dataset.frame) {
                return;
            }
            const preview = card.querySelector('.frame-preview');
            if (!preview) {
                return;
            }

            const previewMarkup = window.QRFrames.getFramePreviewMarkup(card.dataset.frame, card.dataset.customFrameId || '');
            preview.innerHTML = previewMarkup;
        });
    },

    applyFrameSearch(root = document, frameSearchInput = root.querySelector('#framePresetSearchInput'), frameSearchEmpty = root.querySelector('#framePresetSearchEmpty')) {
        if (!frameSearchInput) {
            return;
        }

        const searchTerm = frameSearchInput.value.trim().toLowerCase();
        const cards = root.querySelectorAll('#frameSelector .frame-card');
        let visibleCount = 0;

        cards.forEach(card => {
            const searchText = card.dataset.frameName || '';
            const isVisible = !searchTerm || searchText.includes(searchTerm);
            card.hidden = !isVisible;
            card.classList.toggle('is-filtered-out', !isVisible);
            const shell = card.closest('.frame-card-shell-custom');
            if (shell) {
                shell.hidden = !isVisible;
            }
            if (isVisible) {
                visibleCount += 1;
            }
        });

        if (frameSearchEmpty) {
            frameSearchEmpty.hidden = visibleCount > 0;
        }
    },

    triggerActiveFrameRefresh(root = document) {
        const qrContainer = root.querySelector('#qrcode');
        const activeFrameType = this.getActiveFrameType(root);
        const refreshed = typeof QRCodePreviewRenderer !== 'undefined'
            ? QRCodePreviewRenderer.refreshContainerPreview(qrContainer, activeFrameType)
            : false;

        if (refreshed) {
            return;
        }

        const activeFrame = root.querySelector('.frame-card.active');
        if (activeFrame) {
            activeFrame.click();
        }
    },

    getActiveFrameType(root = document) {
        return root.querySelector('.frame-card.active')?.dataset.frame || 'none';
    },

    getQRCodeAppearance() {
        this.applySettings(document);

        const activeFrameType = window.QRFrames?.getActiveFrameType?.(document);
        if (activeFrameType === window.QRFrames?.FRAME_TYPES?.NONE) {
            return {
                colorDark: '#000000',
                colorLight: window.QRFrames.QR_BACKGROUND_COLOR
            };
        }

        if (!window.QRFrames) {
            return {
                colorDark: '#000000',
                colorLight: '#ffffff'
            };
        }

        return {
            colorDark: window.QRFrames.FRAME_FOREGROUND_COLOR,
            colorLight: window.QRFrames.TRANSPARENT_BACKGROUND ? 'rgba(255, 255, 255, 0)' : window.QRFrames.QR_BACKGROUND_COLOR
        };
    },

    decorateQRCodeOptions(options = {}) {
        const appearance = this.getQRCodeAppearance();
        const logoMinimumTypeNumber = QRCodeLogoControls.getRecommendedMinTypeNumber();
        const requestedTypeNumber = Number(options.typeNumber);
        const hasExplicitTypeNumber = Number.isInteger(requestedTypeNumber) && requestedTypeNumber > 0;
        const requestedMinTypeNumber = Number(options.minTypeNumber);
        const normalizedRequestedMinTypeNumber = Number.isInteger(requestedMinTypeNumber) && requestedMinTypeNumber > 0
            ? requestedMinTypeNumber
            : QR_CODE_VERSION_AUTOMATIC;

        return {
            ...options,
            minTypeNumber: hasExplicitTypeNumber
                ? normalizedRequestedMinTypeNumber
                : Math.max(normalizedRequestedMinTypeNumber, logoMinimumTypeNumber),
            colorDark: appearance.colorDark,
            colorLight: appearance.colorLight
        };
    },

    wrapQRCodeConstructor() {
        if (this.qrCodeWrapped || typeof window.QRCode !== 'function') {
            return;
        }

        const OriginalQRCode = window.QRCode;
        const controls = this;
        function WrappedQRCode(element, options) {
            const decoratedOptions = controls.decorateQRCodeOptions(options);
            const instance = new OriginalQRCode(element, decoratedOptions);
            QRCodeLogoControls.applyLogoToContainer(element, instance, decoratedOptions);
            return instance;
        }

        Object.keys(OriginalQRCode).forEach(key => {
            WrappedQRCode[key] = OriginalQRCode[key];
        });
        WrappedQRCode.prototype = OriginalQRCode.prototype;

        window.QRCode = WrappedQRCode;
        this.qrCodeWrapped = true;
    },

    observe() {
        this.wrapQRCodeConstructor();

        const initializeControls = () => this.init(document);
        initializeControls();

        const observer = new MutationObserver(() => initializeControls());
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
};

const QRCodeDownloadButtonLayout = {
    resizeObserver: null,
    measureContainer: null,

    getResizeObserver() {
        if (!this.resizeObserver && typeof ResizeObserver !== 'undefined') {
            this.resizeObserver = new ResizeObserver(entries => {
                entries.forEach(entry => {
                    this.updateGroup(entry.target);
                });
            });
        }

        return this.resizeObserver;
    },

    getMeasureContainer() {
        if (this.measureContainer?.isConnected) {
            return this.measureContainer;
        }

        const container = document.createElement('div');
        container.setAttribute('aria-hidden', 'true');
        container.style.position = 'absolute';
        container.style.visibility = 'hidden';
        container.style.pointerEvents = 'none';
        container.style.inset = '0 auto auto -9999px';
        container.style.width = 'auto';
        container.style.maxWidth = 'none';
        container.style.whiteSpace = 'nowrap';
        document.documentElement.appendChild(container);
        this.measureContainer = container;
        return container;
    },

    init(root = document) {
        root.querySelectorAll('.download-buttons').forEach(group => {
            if (group.dataset.downloadLayoutBound !== 'true') {
                this.getResizeObserver()?.observe(group);
                group.dataset.downloadLayoutBound = 'true';
            }

            this.updateGroup(group);
        });
    },

    measureButtonWidth(button) {
        const styles = window.getComputedStyle(button);
        const measureKey = [
            button.innerHTML,
            button.className,
            styles.font,
            styles.paddingLeft,
            styles.paddingRight,
            styles.borderLeftWidth,
            styles.borderRightWidth,
            styles.gap,
            styles.columnGap,
            styles.letterSpacing,
            styles.textTransform
        ].join('|');

        if (button.dataset.downloadMeasureKey === measureKey) {
            const cachedWidth = Number.parseFloat(button.dataset.downloadMeasureWidth || '0');
            if (cachedWidth > 0) {
                return cachedWidth;
            }
        }

        const clone = button.cloneNode(true);
        clone.style.width = 'auto';
        clone.style.maxWidth = 'none';
        clone.style.whiteSpace = 'nowrap';
        const measureContainer = this.getMeasureContainer();
        measureContainer.replaceChildren(clone);
        const width = clone.getBoundingClientRect().width;
        button.dataset.downloadMeasureKey = measureKey;
        button.dataset.downloadMeasureWidth = String(width);
        return width;
    },

    updateGroup(group) {
        const buttons = Array.from(group.querySelectorAll('.btn'));
        if (buttons.length < 2) {
            group.classList.remove('download-buttons-two-column');
            return;
        }

        const groupWidth = group.clientWidth;
        if (!groupWidth) {
            group.classList.remove('download-buttons-two-column');
            return;
        }

        const styles = window.getComputedStyle(group);
        const columnGap = Number.parseFloat(styles.columnGap || styles.gap || '0') || 0;
        const columnWidth = (groupWidth - columnGap) / 2;
        const fitsTwoColumns = buttons.every(button => this.measureButtonWidth(button) <= columnWidth);

        group.classList.toggle('download-buttons-two-column', fitsTwoColumns);
    },

    observe() {
        const initialize = () => {
            window.requestAnimationFrame(() => this.init(document));
        };

        initialize();
        document.addEventListener('app:route-rendered', initialize);
        window.addEventListener('resize', initialize);

        const observer = new MutationObserver(() => initialize());
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
};

const QRCodeConfigurationAccordion = {
    SECTION_ORDER: ['Content', 'Frame', 'Logo', 'Settings'],
    layoutShells: new Set(),
    layoutRefreshScheduled: false,
    layoutWindowBound: false,
    SECTION_META: {
        Content: {
            icon: 'bi-card-text',
            description: 'Enter the main information that will be encoded in the QR code.'
        },
        Settings: {
            icon: 'bi-sliders',
            description: 'Control scanning resilience and other shared QR generation settings.'
        },
        Frame: {
            icon: 'bi-grid-1x2',
            description: 'Choose the QR frame style and adjust styling for the selected frame.'
        },
        Logo: {
            icon: 'bi-image',
            description: 'Choose a logo for the center mark and adjust its size.'
        }
    },

    init(root = document) {
        const formSections = root.querySelectorAll('.qr-form-section');
        formSections.forEach(formSection => {
            if (formSection.dataset.configurationAccordionInitialized === 'true') {
                return;
            }

            const title = formSection.querySelector('.section-title');
            const customizationPanel = formSection.querySelector('.qr-customization-panel');
            if (!title || !customizationPanel) {
                return;
            }

            const directChildren = Array.from(formSection.children).filter(child => child !== title);
            const contentNodes = [];
            let typeNode = null;

            directChildren.forEach(child => {
                if (child === customizationPanel) {
                    typeNode = child;
                    return;
                }

                contentNodes.push(child);
            });

            const errorCorrectionGroup = contentNodes.find(node =>
                node.classList.contains('form-group') && node.querySelector('#errorCorrection')
            ) || null;

            const contentSectionNodes = errorCorrectionGroup
                ? contentNodes.filter(node => node !== errorCorrectionGroup)
                : contentNodes;

            const typeBlock = customizationPanel.querySelector('.qr-config-type-block');
            const logoBlock = customizationPanel.querySelector('.qr-config-logo-block');
            if (!typeBlock || !logoBlock) {
                return;
            }

            const typeNodes = [];
            typeNodes.push(...Array.from(typeBlock.childNodes));
            const sections = [
                {
                    label: 'Content',
                    nodes: contentSectionNodes
                },
                {
                    label: 'Frame',
                    nodes: typeNodes
                },
                {
                    label: 'Logo',
                    nodes: Array.from(logoBlock.childNodes)
                }
            ];

            if (errorCorrectionGroup) {
                sections.push({
                    label: 'Settings',
                    nodes: [errorCorrectionGroup]
                });
            }

            customizationPanel.remove();

            const shell = document.createElement('div');
            shell.className = 'config-layout-shell';
            shell.dataset.activeSection = sections[0]?.label.toLowerCase().replace(/\s+/g, '-') || 'content';
            formSection.appendChild(shell);

            this.renderResponsiveLayout(shell, sections);
            this.observeLayout(shell, sections);

            formSection.dataset.configurationAccordionInitialized = 'true';
        });
    },

    observeLayout(shell, sections) {
        shell.dataset.layoutWidth = String(Math.round(shell.clientWidth || 0));
        shell.__configurationSections = sections;
        this.layoutShells.add(shell);
    },

    refreshObservedLayouts(force = false) {
        this.layoutRefreshScheduled = false;

        this.layoutShells.forEach(shell => {
            if (!shell?.isConnected) {
                this.layoutShells.delete(shell);
                return;
            }

            const nextWidth = Math.round(shell.clientWidth || 0);
            const previousWidth = Number(shell.dataset.layoutWidth || '0');
            if (!force && nextWidth === previousWidth) {
                return;
            }

            shell.dataset.layoutWidth = String(nextWidth);
            this.renderResponsiveLayout(shell, shell.__configurationSections || []);
        });
    },

    scheduleLayoutRefresh(force = false) {
        if (this.layoutRefreshScheduled) {
            if (force) {
                this.layoutRefreshForced = true;
            }
            return;
        }

        this.layoutRefreshForced = force;
        this.layoutRefreshScheduled = true;
        window.requestAnimationFrame(() => {
            const shouldForce = Boolean(this.layoutRefreshForced);
            this.layoutRefreshForced = false;
            this.refreshObservedLayouts(shouldForce);
        });
    },

    renderResponsiveLayout(shell, sections) {
        const activeSection = shell.dataset.activeSection || '';
        const defaultSection = sections[0] ? this.normalizeSectionName(sections[0].label) : '';
        const tabs = this.createTabsLayout(sections, activeSection || defaultSection);

        shell.replaceChildren(tabs);

        const tabList = tabs.querySelector('.config-tabs-list');
        if (tabList && this.tabsFit(tabList)) {
            shell.dataset.layoutMode = 'tabs';
            this.bindTabInteractions(tabs, shell);
            return;
        }

        const accordion = this.createAccordionLayout(sections, activeSection);
        shell.replaceChildren(accordion);
        shell.dataset.layoutMode = 'accordion';
        this.bindAccordionInteractions(accordion, shell);
        this.syncVisibleSection(shell, activeSection || defaultSection);
    },

    tabsFit(tabList) {
        const rowFits = tabList.scrollWidth <= Math.ceil(tabList.clientWidth + 1);
        const triggersFit = Array.from(tabList.querySelectorAll('.config-tab-trigger')).every(trigger => {
            const triggerFits = trigger.scrollWidth <= Math.ceil(trigger.clientWidth + 1);
            const content = trigger.querySelector('.config-tab-trigger-main');
            const contentFits = !content || content.scrollWidth <= Math.ceil(content.clientWidth + 1);
            return triggerFits && contentFits;
        });

        return rowFits && triggersFit;
    },

    normalizeSectionName(label) {
        return label.toLowerCase().replace(/\s+/g, '-');
    },

    getSectionMeta(label) {
        return this.SECTION_META[label] || {
            icon: 'bi-folder2-open',
            description: ''
        };
    },

    createTabsLayout(sections, activeSection) {
        const tabs = document.createElement('div');
        tabs.className = 'config-tabs';

        const tabList = document.createElement('div');
        tabList.className = 'config-tabs-list';
        tabList.setAttribute('role', 'tablist');
        tabList.setAttribute('aria-label', 'QR code configuration sections');

        const panelStack = document.createElement('div');
        panelStack.className = 'config-tabs-panels';

        sections.forEach(section => {
            this.createTabSection(section, activeSection === this.normalizeSectionName(section.label), tabList, panelStack);
        });

        tabs.appendChild(tabList);
        tabs.appendChild(panelStack);
        return tabs;
    },

    createAccordionLayout(sections, activeSection) {
        const accordion = document.createElement('div');
        accordion.className = 'config-accordion';

        sections.forEach(section => {
            accordion.appendChild(this.createAccordionSection(
                section,
                activeSection === this.normalizeSectionName(section.label)
            ));
        });

        return accordion;
    },

    createTabSection(section, isActive, tabList, panelStack) {
        const { label, nodes } = section;
        const meta = this.getSectionMeta(label);
        const normalizedLabel = label.toLowerCase().replace(/\s+/g, '-');
        const tabId = `config-tab-${normalizedLabel}`;
        const panelId = `config-panel-${normalizedLabel}`;

        const trigger = document.createElement('button');
        trigger.type = 'button';
        trigger.className = `config-tab-trigger${isActive ? ' active' : ''}`;
        trigger.id = tabId;
        trigger.dataset.section = normalizedLabel;
        trigger.setAttribute('role', 'tab');
        trigger.setAttribute('aria-selected', isActive ? 'true' : 'false');
        trigger.setAttribute('aria-controls', panelId);
        trigger.setAttribute('tabindex', isActive ? '0' : '-1');
        trigger.setAttribute('aria-label', `${label}. ${meta.description}`);
        if (meta.description) {
            trigger.title = meta.description;
        }
        trigger.innerHTML = `
            <span class="config-tab-trigger-main">
                <span class="config-tab-icon" aria-hidden="true">
                    <i class="bi ${meta.icon}"></i>
                </span>
                <span class="config-tab-label">${label}</span>
            </span>
        `;

        const panel = document.createElement('div');
        panel.className = `config-tab-panel${isActive ? ' active' : ''}`;
        panel.id = panelId;
        panel.dataset.section = normalizedLabel;
        panel.setAttribute('role', 'tabpanel');
        panel.setAttribute('aria-labelledby', tabId);
        panel.hidden = !isActive;

        nodes.forEach(node => {
            if (node) {
                panel.appendChild(node);
            }
        });

        tabList.appendChild(trigger);
        panelStack.appendChild(panel);
    },

    createAccordionSection(section, isOpen) {
        const { label, nodes } = section;
        const meta = this.getSectionMeta(label);
        const normalizedLabel = this.normalizeSectionName(label);
        const item = document.createElement('section');
        item.className = `config-accordion-item${isOpen ? ' open' : ''}`;
        item.dataset.section = normalizedLabel;

        const trigger = document.createElement('button');
        trigger.type = 'button';
        trigger.className = `config-accordion-trigger${isOpen ? ' active' : ''}`;
        trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        trigger.setAttribute('aria-controls', `config-accordion-panel-${normalizedLabel}`);
        trigger.innerHTML = `
            <span class="config-accordion-trigger-main">
                <span class="config-tab-icon" aria-hidden="true">
                    <i class="bi ${meta.icon}"></i>
                </span>
                <span class="config-accordion-copy">
                    <span class="config-accordion-label">${label}</span>
                    <span class="config-accordion-description">${meta.description}</span>
                </span>
            </span>
            <i class="bi bi-chevron-down config-accordion-chevron" aria-hidden="true"></i>
        `;

        const panel = document.createElement('div');
        panel.className = 'config-accordion-panel';
        panel.id = `config-accordion-panel-${normalizedLabel}`;
        panel.hidden = !isOpen;

        nodes.forEach(node => {
            if (node) {
                panel.appendChild(node);
            }
        });

        item.appendChild(trigger);
        item.appendChild(panel);
        return item;
    },

    bindTabInteractions(tabs, shell) {
        const triggers = Array.from(tabs.querySelectorAll('.config-tab-trigger'));
        if (!triggers.length) {
            return;
        }

        triggers.forEach((trigger, index) => {
            trigger.addEventListener('click', () => this.activateTab(tabs, shell, trigger.dataset.section));
            trigger.addEventListener('keydown', event => {
                let nextIndex = index;

                if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
                    nextIndex = (index + 1) % triggers.length;
                } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
                    nextIndex = (index - 1 + triggers.length) % triggers.length;
                } else if (event.key === 'Home') {
                    nextIndex = 0;
                } else if (event.key === 'End') {
                    nextIndex = triggers.length - 1;
                } else {
                    return;
                }

                event.preventDefault();
                const nextTrigger = triggers[nextIndex];
                this.activateTab(tabs, shell, nextTrigger.dataset.section);
                nextTrigger.focus();
            });
        });
    },

    bindAccordionInteractions(accordion, shell) {
        const triggers = Array.from(accordion.querySelectorAll('.config-accordion-trigger'));
        triggers.forEach(trigger => {
            trigger.onclick = () => {
                const item = trigger.closest('.config-accordion-item');
                if (!item) {
                    return;
                }

                this.activateAccordionSection(accordion, shell, item.dataset.section);
            };
        });
    },

    activateTab(tabs, shell, sectionName) {
        shell.dataset.activeSection = sectionName;
        tabs.querySelectorAll('.config-tab-trigger').forEach(trigger => {
            const isActive = trigger.dataset.section === sectionName;
            trigger.classList.toggle('active', isActive);
            trigger.setAttribute('aria-selected', isActive ? 'true' : 'false');
            trigger.setAttribute('tabindex', isActive ? '0' : '-1');
        });

        tabs.querySelectorAll('.config-tab-panel').forEach(panel => {
            const isActive = panel.dataset.section === sectionName;
            panel.classList.toggle('active', isActive);
            panel.hidden = !isActive;
        });

        this.syncVisibleSection(shell, sectionName);
    },

    activateAccordionSection(accordion, shell, sectionName) {
        const targetItem = accordion.querySelector(`.config-accordion-item[data-section="${sectionName}"]`);
        const shouldCollapse = Boolean(targetItem) && targetItem.classList.contains('open');
        shell.dataset.activeSection = shouldCollapse ? '' : sectionName;

        accordion.querySelectorAll('.config-accordion-item').forEach(item => {
            const isActive = !shouldCollapse && item.dataset.section === sectionName;
            item.classList.toggle('open', isActive);

            const trigger = item.querySelector('.config-accordion-trigger');
            const panel = item.querySelector('.config-accordion-panel');
            if (trigger) {
                trigger.classList.toggle('active', isActive);
                trigger.setAttribute('aria-expanded', isActive ? 'true' : 'false');
            }

            if (panel) {
                panel.hidden = !isActive;
            }
        });

        this.syncVisibleSection(shell, shouldCollapse ? '' : sectionName);
    },

    syncVisibleSection(root, sectionName) {
        if (typeof QRCodeLogoControls !== 'undefined') {
            if (sectionName === 'logo') {
                QRCodeLogoControls.ensurePresetTilesRendered(root);
            } else {
                QRCodeLogoControls.releasePresetTiles(root);
            }
        }

        if (sectionName !== 'frame' || typeof QRCodeFrameControls === 'undefined') {
            return;
        }

        window.requestAnimationFrame(() => {
            QRCodeFrameControls.updatePositionPanelVisibility(root, QRCodeFrameControls.getActiveFrameType(root));
            QRCodeFrameControls.scheduleFramePreviewSampleRefresh(root?.ownerDocument || document);
        });
    },

    observe() {
        const initializeAccordion = () => this.init(document);
        initializeAccordion();

        document.addEventListener('app:route-rendered', initializeAccordion);
        document.addEventListener('app:sidebar-layout-changed', () => this.scheduleLayoutRefresh(true));

        if (!this.layoutWindowBound) {
            window.addEventListener('resize', () => this.scheduleLayoutRefresh());
            this.layoutWindowBound = true;
        }

        const observer = new MutationObserver(() => initializeAccordion());
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
};

document.addEventListener('DOMContentLoaded', () => {
    QRCodeExportControls.observe();
    QRCodeDownloadButtonLayout.observe();
    QRCodeLogoControls.observe();
    QRCodeFrameControls.observe();
    QRCodeConfigurationAccordion.observe();
});
