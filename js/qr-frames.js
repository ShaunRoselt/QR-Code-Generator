"use strict";

/**
 * QR Code Frame Utilities
 * Provides visual card-based frame selection with multiple frame styles
 */

const QRFrames = {
    FRAME_CATALOG_INDEX_PATH: 'js/frames/index.js',
    FRAME_ARTBOARD_WIDTH: 64,
    DECORATIVE_FRAME_ARTBOARD_HEIGHT: 84,
    MAX_FRAME_QR_SIZE_PCT: 2,
    BORDER_FRAME_WIDTH_RATIO: 8 / 300,
    BORDER_SEPARATOR_RATIO: 3 / 300,
    FRAME_BACKGROUND_COLOR: '#ffffff',
    QR_BACKGROUND_COLOR: '#ffffff',
    FRAME_FOREGROUND_COLOR: '#000000',
    FRAME_TEXT: 'Scan me!',
    FRAME_TEXT_DEFAULT: 'Scan me!',
    FRAME_TEXT_VARIANTS: new Set(['Scan me!', 'Skandeer my!', 'Scanne mich!', 'סרקו אותי!', 'امسحني!']),
    FRAME_TEXT_COLOR: null,
    TRANSPARENT_BACKGROUND: false,
    frameCatalog: null,
    frameCatalogPromise: null,
    frameCatalogScriptPromises: {},
    frameCustomizations: {},
    customFrame: null,
    customFrames: [],
    activeCustomFrameId: '',
    frameQRRectOverrides: {},
    FRAME_FONT_DEFAULT: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    FRAME_FONT_SCRIPT: '"Allison", "Caveat", cursive',
    RENDER_PHASES: {
        BEFORE: 'before',
        AFTER: 'after'
    },
    // Path data authored against the shared 64x84 decorative frame artboard.
    BOLD_BORDER_PATH: 'M64 3.815v76.27a1.3 1.3 0 0 1-.498.301c-1.572.382-2.568 1.345-2.926 2.911-.16.703-.677.683-1.234.683H40.61c-11.885 0-23.789 0-35.693.02-.816 0-1.254-.2-1.473-1.044a3.16 3.16 0 0 0-2.409-2.43C.2 80.307 0 79.865 0 79.042.02 54.327.02 29.633 0 4.92c0-.843.18-1.345 1.055-1.566 1.254-.321 2.03-1.185 2.389-2.45.06-.32.219-.642.418-.903h56.336c.04.06.1.1.12.16.378 1.968 1.552 3.153 3.503 3.534.08.02.14.08.179.12',
    CENTERED_QR_FRAME_PATH: 'M-2 4a6 6 0 0 1 6-6h56a6 6 0 0 1 6 6h-4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2zm66 74H0zm-66 0V4a6 6 0 0 1 6-6v4a2 2 0 0 0-2 2v74zM60-2a6 6 0 0 1 6 6v74h-4V4a2 2 0 0 0-2-2z',
    CENTERED_QR_RIP_PATH: 'M3.016 83.259 0 78l1.767-1 2.574 4.66 2.132-3.86c.546-.989 2.105-.989 2.65 0l2.133 3.86 2.132-3.86c.546-.989 2.104-.989 2.65 0l2.133 3.86 2.131-3.86c.547-.989 2.105-.989 2.651 0l2.132 3.86 2.132-3.86c.546-.989 2.105-.989 2.65 0L32 81.66l2.132-3.86c.546-.989 2.105-.989 2.65 0l2.133 3.86 2.132-3.86c.546-.989 2.104-.989 2.65 0l2.133 3.86 2.132-3.86c.546-.989 2.104-.989 2.65 0l2.132 3.86 2.132-3.86c.546-.989 2.105-.989 2.651 0l2.132 3.86L62.233 77 64 78l-3.016 5.259c-.546.988-2.104.988-2.65 0l-2.132-3.86-2.132 3.86c-.546.988-2.105.988-2.651 0l-2.132-3.86-2.132 3.86c-.546.988-2.105.988-2.65 0l-2.133-3.86-2.132 3.86c-.546.988-2.105.988-2.65 0l-2.133-3.86-2.132 3.86c-.546.988-2.104.988-2.65 0l-2.132-3.86-2.133 3.86c-.546.988-2.104.988-2.65 0l-2.132-3.86-2.132 3.86c-.546.988-2.105.988-2.65 0l-2.133-3.86-2.132 3.86c-.546.988-2.105.988-2.65 0l-2.133-3.86-2.132 3.86c-.546.988-2.104.988-2.65 0',
    VIDEO_ICON_PATH: 'M13.9917 72.9938C13.8958 72.6354 13.6146 72.3542 13.2563 72.2583C12.6083 72.0833 10 72.0833 10 72.0833C10 72.0833 7.39375 72.0833 6.74375 72.2583C6.38542 72.3542 6.10417 72.6354 6.00834 72.9938C5.8875 73.6563 5.82917 74.3271 5.83334 75C5.82917 75.6729 5.8875 76.3438 6.00834 77.0063C6.10417 77.3646 6.38542 77.6458 6.74375 77.7417C7.39167 77.9167 10 77.9167 10 77.9167C10 77.9167 12.6063 77.9167 13.2563 77.7417C13.6146 77.6458 13.8958 77.3646 13.9917 77.0063C14.1125 76.3438 14.1708 75.6729 14.1667 75C14.1708 74.3271 14.1125 73.6563 13.9917 72.9938ZM9.16667 76.25V73.75L11.3313 75L9.16667 76.25Z',
    PHONE_FRAME_PATH: 'M8 0a4 4 0 0 0-4 4v76a4 4 0 0 0 4 4h48a4 4 0 0 0 4-4V4a4 4 0 0 0-4-4zm15 4a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2zm6 0a1 1 0 1 0 0 2h11a1 1 0 1 0 0-2zm6 72a3 3 0 1 1-6 0 3 3 0 0 1 6 0M7 11a2 2 0 0 1 2-2h46a2 2 0 0 1 2 2v56a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2z',
    CORNER_ACCENT_PATH_PRIMARY: 'M59.78 10.864H64l-.04 1.122h-3.54c.1.2.18.421.26.662a.568.568 0 1 1-1.08.36 4.8 4.8 0 0 0-.66-1.362l-.005-.007c-1.075-1.417-1.166-1.537-8.015-1.537H48.9a.76.76 0 0 0 0 1.523.581.581 0 0 1 0 1.163.76.76 0 0 0 0 1.524.581.581 0 0 1 0 1.162.76.76 0 0 0-.76.762c0 .36.24.661.58.741h.2c.32 0 .58.26.58.582q0 .12-.06.24c-.1.22-.3.36-.54.36-.1 0-.2 0-.3-.02H44c-.36 0-.74.281-.74.762 0 .482.3.822.74.822h7.56c1 0 1.74.26 2.2.742.36.4.54.922.5 1.523a24 24 0 0 1-.086 1.306l-.034.418c-.08.962-.14 1.724-.06 2.225.08.38.2.5.54.561.54.08.8-.4 1.36-2.065l.085-.25c.178-.521.377-1.105.635-1.674.26-.56.718-.8 1.137-1.02l.003-.002c.4-.2.78-.42 1.12-.882.72-.982 1.02-2.666 1.02-2.686a.57.57 0 0 1 .66-.46c.3.04.52.34.46.66 0 .04-.14.782-.44 1.624H64v1.163h-3.86c-.046.124-.117.224-.183.318q-.03.041-.057.083c-.5.701-1.08 1.002-1.52 1.222-.34.18-.52.281-.6.461-.24.531-.42 1.062-.592 1.568l-.088.256-.1.28c-.235.665-.441 1.247-.74 1.705-.38.58-.88.881-1.48.881-.1 0-.22 0-.32-.02-.82-.12-1.32-.62-1.48-1.483-.12-.641-.06-1.483.04-2.525.04-.501.08-1.083.12-1.684 0-.3-.06-.5-.2-.661-.24-.26-.7-.381-1.36-.381H44c-1.08 0-1.9-.842-1.9-1.964 0-1.063.86-1.925 1.9-1.925h3.14a2.2 2.2 0 0 1-.14-.741c0-.521.22-1.002.56-1.343-.34-.34-.56-.822-.56-1.343s.22-1.002.56-1.343c-.34-.34-.56-.822-.56-1.343C47 9.862 47.86 9 48.92 9h2.02c3.72 0 5.46.04 6.58.28 1.22.281 1.68.822 2.26 1.584M8.9 51.813c0 .32.26.581.58.581s.56-.26.56-.56v-31.37c0-.42.26-.762.6-.762h27.72a.581.581 0 0 0 0-1.162h-27.7c-.98 0-1.76.862-1.76 1.904zM25.64 64.84h27.7c.98 0 1.76-.862 1.76-1.904V31.568a.581.581 0 1 0-1.16 0v31.348c0 .42-.26.761-.6.761h-27.7a.581.581 0 0 0 0 1.163',
    CORNER_ACCENT_PATH_SECONDARY: 'M20 62.174h-7.58c-.66 0-1.12-.12-1.36-.38-.14-.161-.2-.361-.2-.662.04-.601.08-1.183.12-1.684.1-1.042.16-1.884.04-2.525-.16-.862-.66-1.363-1.48-1.483-.74-.12-1.36.18-1.8.861-.299.458-.505 1.04-.74 1.704l-.1.28-.088.257a17 17 0 0 1-.592 1.568c-.08.18-.26.28-.6.46-.44.221-1.02.522-1.52 1.223l-.049.073a3 3 0 0 0-.191.308H0v1.163h3.34c-.3.841-.44 1.583-.44 1.623a.57.57 0 1 0 1.12.2c0-.02.3-1.703 1.02-2.685.34-.461.72-.682 1.12-.882l.003-.002c.419-.22.878-.46 1.137-1.02.258-.57.457-1.153.635-1.675l.085-.25c.56-1.663.82-2.144 1.36-2.064.34.06.46.18.54.561.08.501.02 1.263-.06 2.225q-.023.295-.052.61c-.03.346-.063.715-.088 1.114-.04.601.14 1.122.5 1.523.46.481 1.2.742 2.2.742H20c.44 0 .74.34.74.822 0 .48-.38.761-.74.761h-4.6c-.1-.02-.2-.02-.3-.02h-4.22a1.923 1.923 0 0 0-.96 3.588c-.2.3-.3.661-.3 1.042 0 .662.34 1.243.84 1.584-.22.32-.34.701-.34 1.102 0 .26.06.521.16.762-4.086-.06-4.299-.34-5.191-1.512l-.009-.012a4.8 4.8 0 0 1-.66-1.363.568.568 0 1 0-1.08.36c.08.242.16.442.26.663H0v1.162h4.22c.56.762 1.04 1.303 2.26 1.583 1 .221 2.5.281 5.46.281h3.14c1.06 0 1.92-.862 1.92-1.924 0-.521-.22-1.002-.56-1.343.34-.34.56-.822.56-1.343s-.22-1.002-.56-1.343c.34-.34.56-.822.56-1.343 0-.26-.06-.52-.14-.741H20c1.04 0 1.9-.862 1.9-1.925 0-1.182-.82-2.024-1.9-2.024m-4.14 7.316a.76.76 0 0 1-.76.762h-3.58a.76.76 0 0 1 0-1.524h3.56c.44 0 .78.341.78.762m-.78 3.468H12c-.4-.02-.74-.361-.74-.762a.76.76 0 0 1 .76-.762h3.08a.76.76 0 1 1-.02 1.523m.78-6.154a.76.76 0 0 1-.76.762h-4.24a.76.76 0 0 1 0-1.523h4.04c.06.02.1.02.16.02h.2c.36.08.6.38.6.741',
    BAG_FRAME_PATH: 'M59.123 17.153c0-2.303-1.857-4.153-4.128-4.153H8.024c-2.29 0-4.129 1.869-4.129 4.153L2 75.847C2 78.15 3.858 80 6.129 80H56.87c2.292 0 4.13-1.869 4.13-4.153zm-52.788 0c0-.925.75-1.699 1.689-1.699h46.97a1.7 1.7 0 0 1 1.69 1.7v48.951H6.334z',
    BAG_HANDLE_LEFT_PATH: 'm22.81 3.02-4.69 4.663v9.93h4.69z',
    BAG_HANDLE_RIGHT_PATH: 'm40.188 3.02 4.692 4.663v9.93h-4.692z',
    BAG_HANDLE_SHADOW_PATH: 'M40.188 3H22.81v4.72h17.377z',
    MAILER_FRAME_BACKGROUND_PATH: 'M10.5 45.5v-39h43l.5 39L40.5 56 32 50l-8.5 6z',
    MAILER_FRAME_PATH: 'M54.96 7.636v25.508l7.227 5.594v36.166A4.104 4.104 0 0 1 58.09 79H6.096A4.104 4.104 0 0 1 2 74.904V38.738l7.246-5.594V7.636A2.63 2.63 0 0 1 11.883 5h40.44a2.63 2.63 0 0 1 2.637 2.636m5.064 62.223V42.21L42.156 56.034zm-7.7-62.887H11.882a.65.65 0 0 0-.664.664v37.266l12.576 9.766 5.71-4.418a4.24 4.24 0 0 1 5.177 0l5.71 4.418 12.595-9.747V7.636a.67.67 0 0 0-.664-.664M4.161 69.86 22.03 56.035 4.162 42.209zm1.935 6.979H58.09a1.93 1.93 0 0 0 1.934-1.934V72.57l-26.67-20.652a2.08 2.08 0 0 0-2.522 0L4.162 72.57v2.333c0 1.062.873 1.934 1.935 1.934',
    DELIVERY_VAN_ARTBOARD_HEIGHT: 67,
    DELIVERY_VAN_PANEL_PATH: 'M1 11a2 2 0 0 1 2-2h28a2 2 0 0 1 2 2v42a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2z',
    DELIVERY_VAN_BODY_PATH: 'M30 24a2 2 0 0 1 2-2h9.819a4 4 0 0 1 2.829 1.171l8.181 8.182A4 4 0 0 0 55.657 33H61a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H30z',
    DELIVERY_VAN_CHASSIS_PATH: 'M30 43h34v7H30z',
    DELIVERY_VAN_CAB_PATH: 'M44 25.5h1.819a2 2 0 0 1 1.414.586l5.181 5.182A2 2 0 0 1 51 34.682h-6a1 1 0 0 1-1-1z',
    DELIVERY_VAN_STRIPE_PATH: 'M32 37h18v4H32z',
    DELIVERY_VAN_WHEEL_ARCH_PATH: 'M34 46a5 5 0 0 1 10 0v3H34zm14 0a5 5 0 0 1 10 0v3H48z',
    DELIVERY_VAN_WHEEL_LEFT_PATH: 'M39 48a5 5 0 1 1 0 10 5 5 0 0 1 0-10',
    DELIVERY_VAN_WHEEL_RIGHT_PATH: 'M53 48a5 5 0 1 1 0 10 5 5 0 0 1 0-10',
    DISPLAY_STAND_FRAME_PATH: 'M51.71 13.67c.329 0 .602.274.602.603v37.092H14.62v-37.11c0-.329.273-.603.602-.603zm0-1.806H15.22a2.4 2.4 0 0 0-2.39 2.39v38.899h41.29V14.255c-.019-1.314-1.095-2.39-2.409-2.39',
    DISPLAY_STAND_SHADOW_PATH: 'M6.764 52.17h53.421c.463 0 .815.223.815.491 0 .28-.37.492-.815.492H6.764c-.463 0-.815-.224-.815-.492 0-.28.37-.492.815-.492',
    DISPLAY_STAND_BASE_PATH: 'M52.417 59.05H14.532c-3.107 0-5.634-2.645-5.634-5.897h49.153c0 3.252-2.527 5.898-5.634 5.898',
    DISPLAY_STAND_SUPPORT_PATH: 'M49.612 59.209c-.85-1.008-2.125-1.217-3.307-.57-.61-.61-1.719-.628-2.66-.267-.352.133-4.547 1.845-5.895 2.397-.5-.875-1.553-1.218-1.996-1.35-.684-.21-10.089-1.94-13.637-1.142-1.2.266-10.513 3.86-10.901 4.013a.57.57 0 0 0-.315.723c.111.285.425.437.703.323 2.679-1.027 9.811-3.747 10.754-3.956 3.122-.704 12.214.837 13.1 1.103 1.09.343 1.516.742 1.497 1.427-.037.78-.425 1.122-1.552 1.35-.776.152-7.299.666-9.738.875-.296.019-.517.285-.499.609a.55.55 0 0 0 .536.513h.037a430 430 0 0 1 3.88-.304 199 199 0 0 0 3.345 1.807c1.33.684 2.199.17 3.289-.457.13-.076.277-.152.425-.228.665-.38 8.906-5.554 9.904-6.257.314-.21 1.404-.856 2.254.152.204.247.296.551.278.894-.037.4-.24.76-.573 1.027-.407.342-10.348 8.387-11.586 9.262-2.125 1.483-4.675 1.902-7.631 1.236-.647-.152-8.334-2.377-12.306-3.537a.5.5 0 0 0-.333.019l-2.753 1.027a.57.57 0 0 0-.314.722c.11.286.425.438.702.324l2.55-.99c1.496.438 11.4 3.33 12.195 3.5q1.497.343 2.883.343c2.07 0 3.954-.57 5.598-1.731 1.294-.894 11.272-8.977 11.66-9.3a2.67 2.67 0 0 0 .98-1.807c.018-.666-.167-1.275-.574-1.75m-13.507 5.858c-.148.076-.295.171-.425.247-1.127.647-1.515.837-2.273.438-.425-.21-1.145-.609-1.829-.97 1.885-.172 3.566-.324 3.973-.4.646-.133 2.346-.456 2.439-2.396v-.114c2.106-.856 5.691-2.32 5.987-2.435.462-.17.942-.209 1.275-.114-2.2 1.427-8.556 5.42-9.147 5.744',
    DISPLAY_STAND_SIDE_SHADOW_PATH: 'M3 79.695h1.035l10.762-6.91-4.18-11.768L3 63.22z',
    SIDEBAR_CARD_BACKGROUND_LEFT_PATH: 'M7 28.5h12l-2 43H6.5L5 49.5 4 38H3l-1.5-1v-2.5l1-1L5 33z',
    SIDEBAR_CARD_BACKGROUND_TOP_PATH: 'M60.079 19.469c-.11.806.212 1.587.083 2.389-.051-.526-.349-.575-.836-.573q-19.76.03-39.517.012a9 9 0 0 1-.928-.097c-.345-.621-.303-1.247-.031-1.882.323-.126.661-.098.995-.1h39.097c.39.006.815-.09 1.137.25',
    SIDEBAR_CARD_FRAME_PATH: 'm18.704 19.457-.779-.17c-.727-.553-.943-1.27-.854-2.177.103-1.007.174-2.018.245-3.03.05-.702.1-1.405.16-2.107.065-.785.282-.973 1.054-.973h41.923c.79 0 1.025.238 1.078 1.024q.057.774.118 1.547v.003c.1 1.285.2 2.57.276 3.857.076 1.26-.579 1.948-1.847 2.037q-.235-.001-.47-.008-.236-.007-.473-.008h-39.3q-.561.001-1.132.005M62.94 68.175c.007-.017.06.23.06.325v2.117c-.114.88-.538 1.478-1.481 1.606H17.511l-.058-.006h-1.15l-.005-.003-10.329.003q-.097-1.392-.197-2.783c-.18-2.544-.361-5.089-.526-7.635-.034-.516-.162-.793-.73-.683-.404.078-.526-.094-.553-.502q-.375-5.611-.802-11.216c-.041-.549.025-.864.674-.736.386.077.47-.09.441-.477a725 725 0 0 1-.615-8.948c-.035-.554-.159-.807-.8-.774-1.142.045-1.836-.683-1.853-1.814q-.015-1.138.001-2.276c.025-.964.659-1.627 1.616-1.723q.073-.008.145-.01.063-.003.125-.008c.188-.018.39.004.592.025.386.041.765.082 1.024-.16.246-.227.354-.604.46-.981.046-.161.092-.322.148-.47q.115-.302.226-.608c.125-.341.25-.683.389-1.018.316-.757.791-1.344 1.687-1.426.243-.079.49-.067.737-.056q.13.007.26.008l2.291.002c2.447.005 5.396.01 7.488-.015l.09-1.46q.045-.713.08-1.424c.056-1.098.113-2.196.245-3.288a1 1 0 0 1 .076-.32l.018-.056a.8.8 0 0 1 .156-.255c.225-.083.452-.097.679-.087l.153-.001q18.931 0 37.856.022c.157 0 .314-.016.471-.032.333-.034.667-.068.996.05h.195c.558 0 1.038.02 1.11.722.135 1.095.193 2.198.251 3.3q.036.714.081 1.428c.103 1.55.192 3.104.282 4.655l.086 1.478q.157 2.668.31 5.334.176 3 .358 6 .102 1.676.198 3.352L62 49.266q.178 3.068.363 6.135.085 1.412.167 2.824v.01l.14 2.366c.143 2.42.206 4.848.268 7.274.004.051.002.24.001.3M18.125 29.13H8.698a5 5 0 0 0-.866.03c-.523.135-.827.477-.993.978-.09.277-.203.545-.315.813-.127.305-.254.61-.35.925q-.02.062-.049.125c-.068.157-.14.32.073.47 1.538.046 3.075.039 4.611.031.919-.004 1.837-.009 2.754-.002.427.003 1.137.001 1.879 0a204 204 0 0 1 2.492 0l.079-1.39q.055-.99.113-1.98m-.267 4.678c-2.7.007-6.001.01-9.125.012H8.73l-4.827.005q-.117 0-.236-.006c-.277-.01-.555-.018-.822.086-.781.538-.865 2.612-.123 3.212.223.094.453.087.683.08q.09-.004.18-.004h14.082zm-.275 4.837-.067-.001c-3.32 0-8.425 0-11.744.008a2 2 0 0 1-.164-.008c-.25-.018-.512-.036-.63.301-.064.704.006 1.402.076 2.099.032.32.064.642.083.964.051.845.115 1.69.178 2.536.07.927.14 1.854.193 2.782l.003.066c.018.355.037.711.25 1.021.195.194.43.184.666.173q.08-.004.16-.004h8.637c1.066 0 1.1.094 1.057 1.16-.04.995-.101 1.99-.163 2.983-.055.894-.11 1.787-.15 2.682-.032.719-.08 1.437-.128 2.155-.063.947-.126 1.894-.152 2.843a1 1 0 0 1-.282.738c-.245.163-.518.155-.788.147l-.183-.003h-7.13q-.065 0-.131-.004c-.238-.012-.49-.025-.59.303-.014 1.042.076 2.075.165 3.11.056.645.112 1.291.143 1.94.025.541.068 1.082.111 1.623.042.521.083 1.043.109 1.565l.005.128c.012.29.023.58.215.826.192.195.43.187.663.178l.159-.003c.878.009 1.756.005 2.635.001a125 125 0 0 1 4.099.029l.014.007a6 6 0 0 0 1.057-.07l-.006-.012c-.144-.34-.135-.702-.123-1.057.084-2.022.19-4.044.34-6.063q.056-1.686.152-3.368l.135-2.358q.08-1.413.163-2.824.181-3.056.355-6.112l.109-1.909q.094-1.67.193-3.34',
    CLIPBOARD_FRAME_PATH: 'M62 78.561C62.02 79.9 60.936 81 59.62 81H4.4C3.063 81 2 79.899 2 78.561V13.4A2.4 2.4 0 0 1 4.4 11h55.22c1.316 0 2.4 1.084 2.38 2.4zM59.62 68V13.4H4.4V68z',
    CLIPBOARD_CLIP_PATH: 'M23.458 6.955h4.644A3.97 3.97 0 0 1 32.068 3a3.97 3.97 0 0 1 3.967 3.955h4.644a4.11 4.11 0 0 1 4.101 4.111v2.948a.785.785 0 0 1-.793.795H20.15a.785.785 0 0 1-.794-.795v-2.948a4.11 4.11 0 0 1 4.102-4.11m10.178.02c0 .867-.702 1.57-1.567 1.57a1.57 1.57 0 0 1-1.567-1.57 1.568 1.568 0 1 1 3.134 0',
    NOTEBOOK_TOP_SHADOW_PATH: 'm6.238 14.453-.02-2.23 49.22-8.278c1.293-.113 2.325.85 2.343 2.136l.019 8.353z',
    NOTEBOOK_FRAME_PATH: 'M60.913 77.785a2.334 2.334 0 0 1-2.325 2.344H6.218V12.223h52.37a2.334 2.334 0 0 1 2.325 2.343zm-2.325-12.89V14.568H8.544v50.329z',
    NOTEBOOK_TABS_PATH: 'M10.663 20.463h-6.45c-.807 0-1.444.662-1.444 1.436v.133c0 .813.637 1.474 1.444 1.474h6.45a1.45 1.45 0 0 0 1.443-1.455v-.133a1.45 1.45 0 0 0-1.444-1.455m.001 16.121h-6.45a1.45 1.45 0 0 0-1.444 1.456v.132a1.45 1.45 0 0 0 1.444 1.455h6.45a1.45 1.45 0 0 0 1.443-1.455v-.132a1.45 1.45 0 0 0-1.444-1.456M4.213 52.706h6.45a1.45 1.45 0 0 1 1.443 1.455v.132a1.45 1.45 0 0 1-1.444 1.456h-6.45c-.806 0-1.443-.662-1.443-1.475v-.132c0-.775.637-1.436 1.444-1.436m6.45 16.121h-6.45a1.45 1.45 0 0 0-1.444 1.455v.133a1.45 1.45 0 0 0 1.444 1.455h6.45a1.45 1.45 0 0 0 1.443-1.455v-.133a1.45 1.45 0 0 0-1.444-1.455',
    FOLDED_BANNER_BACKGROUND_PATH: 'M22.5 32v-9L19 21l-2.5-3.5.5-4 2-3L22.5 9l2.5.5h1l2.5-3 3.5-1 3 1L37.5 8l.5 2 2.5-.5 3.5.5 2 2 1 2 .5 2-.5 2-1.5 3-2 1-1.5 1v9h7a2 2 0 0 1 2 2v34c0 1.105-.395 3.5-1.5 3.5H14c-1.105 0-1-2.395-1-3.5V34a2 2 0 0 1 2-2z',
    FOLDED_BANNER_BODY_PATH: 'M21.463 23.283a7.514 7.514 0 0 1-5.7-7.299c0-4.152 3.356-7.516 7.5-7.516.75 0 1.48.113 2.174.32A7.6 7.6 0 0 1 27.82 6.1a7.43 7.43 0 0 1 4.237-1.315 7.43 7.43 0 0 1 6.6 3.965 7.5 7.5 0 0 1 2.044-.282c4.144 0 7.5 3.383 7.5 7.516 0 3.472-2.353 6.426-5.55 7.284v8.069h6.431c1.65 0 3 1.352 3 3.006v42.73a3 3 0 0 1-3 3.007H14.938a3 3 0 0 1-3-3.007v-42.73a3 3 0 0 1 3-3.007h6.524zm15.693-.665a7.6 7.6 0 0 0 3.694.9v5.263h-3.975v-3.702a.537.537 0 0 0-.525-.526.525.525 0 0 0-.525.526v3.702h-3.3v-3.702a.525.525 0 1 0-1.05 0v3.702h-3.281v-3.702a.525.525 0 1 0-1.05 0v3.702h-3.881V23.5c1.256 0 2.493-.32 3.58-.902.395-.207.526-.695.32-1.09s-.694-.526-1.088-.32a5.9 5.9 0 0 1-3.318.693.9.9 0 0 0-.563-.076 5.896 5.896 0 0 1-4.819-5.803c0-3.27 2.644-5.919 5.906-5.863.75 0 1.482.132 2.175.414h.019l.112.037a.803.803 0 0 0 1.032-.45c.919-2.255 3.131-3.702 5.475-3.702a5.89 5.89 0 0 1 5.381 3.495c0 .044.012.077.026.117l.012.033a.81.81 0 0 0 1.05.451h.018a5.6 5.6 0 0 1 2.156-.413c3.244 0 5.888 2.65 5.888 5.9a5.91 5.91 0 0 1-4.714 5.782.9.9 0 0 0-.576.088 5.9 5.9 0 0 1-3.41-.684c-.394-.206-.881-.075-1.087.32-.207.394-.075.883.318 1.09m-13.893 7.215v1.504H40.85v-1.504zm25.818 3.289c.675 0 1.219.544 1.219 1.221v35.44H13.719v-35.44c0-.677.543-1.221 1.219-1.221z',
    RIBBON_FRAME_PATH: 'M51.541 16.932c.345 0 .65.285.65.65v39.819H11.81V17.562c0-.345.284-.65.65-.65h39.08m0-1.912H12.46a2.55 2.55 0 0 0-2.557 2.562v41.75h44.216v-41.75A2.58 2.58 0 0 0 51.541 15',
    RIBBON_LEFT_PATH: 'M9.902 61.407H0l3.774-6.304L0 48.8h9.902z',
    RIBBON_RIGHT_PATH: 'M54.098 61.407H64l-3.774-6.304L64 48.8h-9.902z',
    RIBBON_LEFT_SHADOW_PATH: 'M9.903 57.95v-6.61s-3.41 1.343-3.41 3.112c0 3.498 3.41 3.498 3.41 3.498',
    RIBBON_RIGHT_SHADOW_PATH: 'M54.098 57.95v-6.61s3.409 1.343 3.409 3.112c0 3.498-3.41 3.498-3.41 3.498',
    RIBBON_MIDDLE_PATH: 'M57.507 62.445v-7.972c-.101 3.416-6.412 2.928-9.882 2.928h-31.27c-3.47 0-9.76.488-9.882-2.928v12.303c0 1.77 1.44 3.213 3.206 3.213h44.642a3.216 3.216 0 0 0 3.207-3.213v-4.27c-.02-.02-.02-.041-.02-.061',
    GIFT_FRAME_PATH: 'M56.525 20.57v49.175H7.475V20.569zm0-2.425H7.475a2.395 2.395 0 0 0-2.4 2.406v49.175a2.395 2.395 0 0 0 2.4 2.405h49.069c1.331 0 2.4-1.07 2.4-2.405V20.569a2.427 2.427 0 0 0-2.419-2.424',
    GIFT_TEXT_CONTAINER_PATH: 'M56.525 81.546H7.475a2.395 2.395 0 0 1-2.4-2.406v-9.094h53.887v9.094a2.44 2.44 0 0 1-2.437 2.406',
    BOW_SHADOW_PATH: 'M62.094 18.333v.921l-12.619-.094c.112.77.075 1.635-.375 2.48-.506.94-1.613 2.067-3.994 2.067-3.15 0-7.443-2.048-9.956-4.171a2.9 2.9 0 0 1-1.612.507h-2.25a2.77 2.77 0 0 1-1.594-.507c-2.494 2.104-6.806 4.171-9.956 4.171-2.382 0-3.488-1.127-3.994-2.067-.45-.845-.488-1.71-.375-2.48l-13.481.113.077-.94 30.258-2.482z',
    BOW_LEFT_RIBBON_PATH: 'M20.9 8.205s-13.875-.507-18-.113c2.175 1.973 4.144 4.623 4.144 4.623l-5.081 5.618 22.275-.15c-.507-2.01-3.338-9.978-3.338-9.978',
    BOW_RIGHT_RIBBON_PATH: 'M43.156 8.205s13.875-.507 18-.113c-2.175 1.973-4.143 4.623-4.143 4.623l5.08 5.618-22.274-.15c.525-2.01 3.337-9.978 3.337-9.978',
    BOW_LEFT_SOLID_PATH: 'M30.594 8.487s-6.225-5.374-10.95-5.337c-4.725.038-4.444 3.007-4.238 3.852.356 1.504 2.175 5.187 2.175 7.216s-2.137 4.735-1.031 6.915c2.25 4.397 12.188-.958 14.044-4.153 1.837-3.194 0-8.493 0-8.493',
    BOW_RIGHT_SOLID_PATH: 'M34.269 8.487s6.225-5.374 10.95-5.337c4.725.038 4.444 2.988 4.237 3.834-.356 1.503-2.175 5.186-2.175 7.215s2.157 4.754 1.032 6.934c-2.25 4.397-12.188-.958-14.044-4.153s0-8.493 0-8.493',
    BOW_LEFT_SHADOW_PATH: 'M28.006 8.618S20 2.85 17.675 5.255c-2.569 2.687 10.331 3.363 10.331 3.363',
    BOW_RIGHT_SHADOW_PATH: 'M36.838 8.618s8.006-5.768 10.33-3.363c2.588 2.687-10.33 3.363-10.33 3.363',
    BOW_KNOT_PATH: 'M31.306 7.867h2.25a1.93 1.93 0 0 1 1.931 1.935v7.235a1.93 1.93 0 0 1-1.93 1.935h-2.25a1.93 1.93 0 0 1-1.932-1.935V9.783c0-1.052.863-1.916 1.931-1.916',
    POINTER_PANEL_TRIANGLE_POINTS: {
        tip: { x: 32.5, y: 61 },
        right: { x: 35.531, y: 67 },
        left: { x: 29.47, y: 67 }
    },
    CORNER_ACCENT_STROKE_WIDTH: 1.35,

    // Available frame types
    FRAME_TYPES: {
        NONE: 'none',
        SCAN_ME: 'scanme',
        SCAN_ME_BORDER: 'scanme-border',
        ROUNDED_BANNER: 'rounded-banner',
        OUTLINED_LABEL: 'outlined-label',
        FOOTER_PANEL: 'footer-panel',
        CENTER_BADGE: 'center-badge',
        POINTER_PANEL: 'pointer-panel',
        BOLD_BORDER: 'bold-border',
        CENTERED_QR: 'centered-qr',
        BOX_POINTER: 'box-pointer',
        TOP_BANNER: 'top-banner',
        SKETCH_BORDER: 'sketch-border',
        SCRIPT_CARD: 'script-card',
        VIDEO_PANEL: 'video-panel',
        PHONE_SCREEN: 'phone-screen',
        ARROW_NOTE: 'arrow-note',
        CORNER_ACCENT: 'corner-accent',
        BAG_TAG: 'bag-tag',
        MAILER: 'mailer',
        DELIVERY_VAN: 'delivery-van',
        DISPLAY_STAND: 'display-stand',
        SIDEBAR_CARD: 'sidebar-card',
        CLIPBOARD: 'clipboard',
        NOTEBOOK: 'notebook',
        FOLDED_BANNER: 'folded-banner',
        RIBBON: 'ribbon',
        GIFT_BOW: 'gift-bow',
        CUSTOM: 'custom'
    },

    async loadFrameCatalog() {
        if (this.frameCatalogPromise) {
            return this.frameCatalogPromise;
        }

        this.frameCatalogPromise = this.loadFrameCatalogInternal();
        return this.frameCatalogPromise;
    },

    async loadFrameCatalogInternal() {
        await this.loadFrameCatalogScript(this.FRAME_CATALOG_INDEX_PATH);

        const catalog = window.QRFrameCatalog;
        const frameScriptPaths = Array.isArray(catalog?.frameScriptPaths)
            ? catalog.frameScriptPaths
            : [];

        await Promise.all(frameScriptPaths.map(path => this.loadFrameCatalogScript(path)));

        this.frameCatalog = window.QRFrameCatalog || null;
        return this.frameCatalog;
    },

    loadFrameCatalogScript(path) {
        if (this.frameCatalogScriptPromises[path]) {
            return this.frameCatalogScriptPromises[path];
        }

        const existingScript = document.querySelector(`script[data-qr-frame-script="${path}"]`);
        if (existingScript?.dataset.loaded === 'true') {
            this.frameCatalogScriptPromises[path] = Promise.resolve();
            return this.frameCatalogScriptPromises[path];
        }

        this.frameCatalogScriptPromises[path] = new Promise((resolve, reject) => {
            const script = existingScript || document.createElement('script');

            if (!existingScript) {
                script.src = path;
                script.async = false;
                script.defer = false;
                script.dataset.qrFrameScript = path;
                document.head.appendChild(script);
            }

            const handleLoad = () => {
                script.dataset.loaded = 'true';
                script.removeEventListener('load', handleLoad);
                script.removeEventListener('error', handleError);
                resolve();
            };

            const handleError = () => {
                script.removeEventListener('load', handleLoad);
                script.removeEventListener('error', handleError);
                reject(new Error(`Failed to load frame catalog script: ${path}`));
            };

            script.addEventListener('load', handleLoad);
            script.addEventListener('error', handleError);
        });

        return this.frameCatalogScriptPromises[path];
    },

    getFrameCatalog() {
        return this.frameCatalog || window.QRFrameCatalog || null;
    },

    getFrameDefinition(frameType) {
        if (!frameType) {
            return null;
        }

        if (frameType === this.FRAME_TYPES.CUSTOM) {
            return this.getFrameCatalog()?.customFrameTemplate || null;
        }

        return this.getFrameCatalog()?.frames?.find(frame => frame.id === frameType) || null;
    },

    getFrameDefinitionQRRect(frameType, heightRatio = 1) {
        const defaultQRRect = this.getFrameDefinition(frameType)?.defaultQRRect;
        if (!defaultQRRect) {
            return null;
        }

        return this.clampFrameQRRect(defaultQRRect, heightRatio);
    },

    getFrameOptions() {
        const catalogFrames = this.getFrameCatalog()?.frames;
        if (Array.isArray(catalogFrames) && catalogFrames.length) {
            return catalogFrames.map(frame => ({
                id: frame.id,
                name: I18n.translateString(frame.name)
            }));
        }

        return [
            {
                id: this.FRAME_TYPES.NONE,
                name: I18n.translateString('None')
            },
            {
                id: this.FRAME_TYPES.SCAN_ME,
                name: I18n.translateString('Scan me!')
            },
            {
                id: this.FRAME_TYPES.SCAN_ME_BORDER,
                name: I18n.translateString('Scan me! + Border')
            },
            {
                id: this.FRAME_TYPES.ROUNDED_BANNER,
                name: I18n.translateString('Rounded Banner')
            },
            {
                id: this.FRAME_TYPES.OUTLINED_LABEL,
                name: I18n.translateString('Outlined Label')
            },
            {
                id: this.FRAME_TYPES.FOOTER_PANEL,
                name: I18n.translateString('Footer Panel')
            },
            {
                id: this.FRAME_TYPES.CENTER_BADGE,
                name: I18n.translateString('Center Badge')
            },
            {
                id: this.FRAME_TYPES.POINTER_PANEL,
                name: I18n.translateString('Pointer Panel')
            },
            {
                id: this.FRAME_TYPES.BOLD_BORDER,
                name: I18n.translateString('Bold Border')
            },
            {
                id: this.FRAME_TYPES.CENTERED_QR,
                name: I18n.translateString('Centered QR')
            },
            {
                id: this.FRAME_TYPES.BOX_POINTER,
                name: I18n.translateString('Box Pointer')
            },
            {
                id: this.FRAME_TYPES.TOP_BANNER,
                name: I18n.translateString('Top Banner')
            },
            {
                id: this.FRAME_TYPES.SKETCH_BORDER,
                name: I18n.translateString('Sketch Border')
            },
            {
                id: this.FRAME_TYPES.SCRIPT_CARD,
                name: I18n.translateString('Script Card')
            },
            {
                id: this.FRAME_TYPES.VIDEO_PANEL,
                name: I18n.translateString('Video Panel')
            },
            {
                id: this.FRAME_TYPES.PHONE_SCREEN,
                name: I18n.translateString('Phone Screen')
            },
            {
                id: this.FRAME_TYPES.ARROW_NOTE,
                name: I18n.translateString('Arrow Note')
            },
            {
                id: this.FRAME_TYPES.CORNER_ACCENT,
                name: I18n.translateString('Corner Accent')
            },
            {
                id: this.FRAME_TYPES.BAG_TAG,
                name: I18n.translateString('Bag Tag')
            },
            {
                id: this.FRAME_TYPES.MAILER,
                name: I18n.translateString('Mailer')
            },
            {
                id: this.FRAME_TYPES.DELIVERY_VAN,
                name: I18n.translateString('Delivery Van')
            },
            {
                id: this.FRAME_TYPES.DISPLAY_STAND,
                name: I18n.translateString('Display Stand')
            },
            {
                id: this.FRAME_TYPES.SIDEBAR_CARD,
                name: I18n.translateString('Sidebar Card')
            },
            {
                id: this.FRAME_TYPES.CLIPBOARD,
                name: I18n.translateString('Clipboard')
            },
            {
                id: this.FRAME_TYPES.NOTEBOOK,
                name: I18n.translateString('Notebook')
            },
            {
                id: this.FRAME_TYPES.FOLDED_BANNER,
                name: I18n.translateString('Folded Banner')
            },
            {
                id: this.FRAME_TYPES.RIBBON,
                name: I18n.translateString('Ribbon')
            },
            {
                id: this.FRAME_TYPES.GIFT_BOW,
                name: I18n.translateString('Gift Bow')
            }
        ];
    },

    getResolvedFrameText() {
        if (this.isDefaultFrameText(this.FRAME_TEXT)) {
            return this.FRAME_TEXT_DEFAULT;
        }

        return this.FRAME_TEXT;
    },

    isDefaultFrameText(frameText) {
        return typeof frameText === 'string' && this.FRAME_TEXT_VARIANTS.has(frameText);
    },

    getDefaultFrameText(frameType = this.FRAME_TYPES.NONE) {
        const frameDefinition = this.getFrameDefinition(frameType);
        if (frameDefinition && Object.prototype.hasOwnProperty.call(frameDefinition, 'supportsText') && !frameDefinition.supportsText) {
            return '';
        }

        if (frameDefinition && Object.prototype.hasOwnProperty.call(frameDefinition, 'defaultText')) {
            return frameDefinition.defaultText || '';
        }

        if (!this.supportsFrameText(frameType)) {
            return '';
        }

        return this.FRAME_TEXT_DEFAULT;
    },

    getFrameCustomizationKey(frameType = this.FRAME_TYPES.NONE) {
        return frameType || this.FRAME_TYPES.NONE;
    },

    supportsFrameText(frameType = this.FRAME_TYPES.NONE) {
        const frameDefinition = this.getFrameDefinition(frameType);
        if (frameDefinition && Object.prototype.hasOwnProperty.call(frameDefinition, 'supportsText')) {
            return Boolean(frameDefinition.supportsText);
        }

        return ![this.FRAME_TYPES.NONE, this.FRAME_TYPES.CUSTOM].includes(frameType);
    },

    createFrameCustomization(frameType = this.FRAME_TYPES.NONE, overrides = {}) {
        const frameDefinition = this.getFrameDefinition(frameType);
        const defaultCustomization = frameDefinition?.defaultCustomization || {};
        const frameColor = FrameColorControl.normalizeColorValue(overrides.frameColor, defaultCustomization.frameColor || '#000000');
        const backgroundColor = FrameColorControl.normalizeColorValue(overrides.backgroundColor, defaultCustomization.backgroundColor || '#ffffff');
        const backgroundColorState = FrameColorControl.parseColorValue(backgroundColor, '#ffffff');
        const defaultFrameText = this.getDefaultFrameText(frameType);

        return {
            frameText: typeof overrides.frameText === 'string'
                ? overrides.frameText || defaultFrameText
                : defaultFrameText,
            frameColor,
            backgroundColor,
            textColor: overrides.textColor == null
                ? null
                : FrameColorControl.normalizeColorValue(overrides.textColor, this.getDefaultTextColor(frameType, frameColor)),
            transparentBackground: backgroundColorState.alpha <= 0
        };
    },

    getFrameCustomization(frameType = this.FRAME_TYPES.NONE) {
        const key = this.getFrameCustomizationKey(frameType);
        if (!this.frameCustomizations[key]) {
            this.frameCustomizations[key] = this.createFrameCustomization(frameType);
        }

        const normalizedCustomization = this.createFrameCustomization(frameType, this.frameCustomizations[key]);
        this.frameCustomizations[key] = normalizedCustomization;
        return normalizedCustomization;
    },

    isDefaultFrameCustomization(frameType, customization) {
        const normalizedCustomization = this.createFrameCustomization(frameType, customization);
        const defaultCustomization = this.createFrameCustomization(frameType);
        return JSON.stringify(normalizedCustomization) === JSON.stringify(defaultCustomization);
    },

    serializeFrameCustomizations() {
        const serialized = {};
        Object.entries(this.frameCustomizations).forEach(([frameType, customization]) => {
            if (this.isDefaultFrameCustomization(frameType, customization)) {
                return;
            }

            serialized[frameType] = this.createFrameCustomization(frameType, customization);
        });
        return serialized;
    },

    restoreFrameCustomizations(customizations = {}) {
        const restoredCustomizations = {};
        Object.entries(customizations).forEach(([frameType, customization]) => {
            restoredCustomizations[this.getFrameCustomizationKey(frameType)] = this.createFrameCustomization(frameType, customization || {});
        });
        this.frameCustomizations = restoredCustomizations;
    },

    applyFrameCustomization(frameType = this.FRAME_TYPES.NONE) {
        const customization = this.getFrameCustomization(frameType);
        this.FRAME_TEXT = customization.frameText;
        this.FRAME_FOREGROUND_COLOR = customization.frameColor;
        this.FRAME_BACKGROUND_COLOR = customization.backgroundColor;
        this.QR_BACKGROUND_COLOR = customization.backgroundColor;
        this.FRAME_TEXT_COLOR = customization.textColor;
        this.TRANSPARENT_BACKGROUND = customization.transparentBackground;
        return customization;
    },

    withFrameCustomization(frameType, render) {
        if (!frameType) {
            return render();
        }

        const previousState = {
            frameText: this.FRAME_TEXT,
            frameColor: this.FRAME_FOREGROUND_COLOR,
            backgroundColor: this.FRAME_BACKGROUND_COLOR,
            textColor: this.FRAME_TEXT_COLOR,
            transparentBackground: this.TRANSPARENT_BACKGROUND
        };

        this.applyFrameCustomization(frameType);

        try {
            return render();
        } finally {
            this.FRAME_TEXT = previousState.frameText;
            this.FRAME_FOREGROUND_COLOR = previousState.frameColor;
            this.FRAME_BACKGROUND_COLOR = previousState.backgroundColor;
            this.QR_BACKGROUND_COLOR = previousState.backgroundColor;
            this.FRAME_TEXT_COLOR = previousState.textColor;
            this.TRANSPARENT_BACKGROUND = previousState.transparentBackground;
        }
    },

    getFrameDisplayName(frameType) {
        if (frameType === this.FRAME_TYPES.CUSTOM) {
            return I18n.translateString('Custom');
        }
        const match = this.getFrameOptions().find(frame => frame.id === frameType);
        return match ? match.name : this.getResolvedFrameText();
    },

    getFrameSettingsMarkup() {
        const frameType = this.FRAME_TYPES.NONE;
        const customization = this.getFrameCustomization(frameType);
        return `
            <div class="frame-settings-panel">
                <div class="form-group" data-frame-setting="text" hidden>
                    <label class="form-label" for="frameTextInput">${I18n.translateString('Frame Text')}</label>
                    <input type="text" class="form-input" id="frameTextInput" value="${this.escapeAttribute(customization.frameText)}" maxlength="40">
                </div>
                <div class="frame-settings-grid">
                    <div data-frame-setting="frameColor">
                        ${FrameColorControl.render({ id: 'frameForegroundColor', label: 'Frame Color', value: customization.frameColor })}
                    </div>
                    <div data-frame-setting="backgroundColor">
                        ${FrameColorControl.render({ id: 'frameBackgroundColor', label: 'Background Color', value: customization.backgroundColor })}
                    </div>
                    <div data-frame-setting="textColor" hidden>
                        ${FrameColorControl.render({ id: 'frameTextColor', label: 'Text Color', value: customization.textColor || this.getDefaultTextColor(frameType, customization.frameColor) })}
                    </div>
                </div>
            </div>
        `;
    },

    getLogoControlsMarkup() {
        const currentShape = typeof QRCodeLogoControls !== 'undefined' ? QRCodeLogoControls.logoShape : 'rounded';
        return `
            <div class="frame-settings-panel logo-settings-panel">
                ${typeof QRCodeLogoControls !== 'undefined' ? QRCodeLogoControls.getPresetMarkup() : ''}
                <div class="frame-settings-grid logo-settings-grid">
                    <div class="form-group">
                        <label class="form-label" for="qrLogoSizeRange">${I18n.translateString('Logo Size')}</label>
                        <div class="form-hint">${I18n.translateString('Choose how large the selected logo appears inside the QR code.')}</div>
                        <input type="range" class="logo-size-range" id="qrLogoSizeRange" min="12" max="${typeof QRCodeLogoControls !== 'undefined' ? QRCodeLogoControls.getMaximumAllowedLogoSizePercent() : 34}" step="1" value="${typeof QRCodeLogoControls !== 'undefined' ? QRCodeLogoControls.sizePercent : 22}">
                        <div class="form-hint" id="qrLogoSizeValue">${I18n.translate('{size}% of QR width (max {max}% for this QR code)', { size: typeof QRCodeLogoControls !== 'undefined' ? QRCodeLogoControls.sizePercent : 22, max: typeof QRCodeLogoControls !== 'undefined' ? QRCodeLogoControls.getMaximumAllowedLogoSizePercent() : 34 })}</div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">${I18n.translateString('Logo Shape')}</label>
                        <div class="logo-shape-toggle">
                            ${typeof QRCodeLogoControls !== 'undefined' ? QRCodeLogoControls.getLogoShapeButtonsMarkup(currentShape) : ''}
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label" for="qrLogoPaddingRange">${I18n.translateString('Inner Logo Padding')}</label>
                        <div class="form-hint">${I18n.translateString('Controls the space between the inner logo and its outer shape.')}</div>
                        <input type="range" class="logo-size-range" id="qrLogoPaddingRange" min="0" max="80" step="1" value="${typeof QRCodeLogoControls !== 'undefined' ? QRCodeLogoControls.logoPadding : 20}">
                        <div class="form-hint" id="qrLogoPaddingValue">${typeof QRCodeLogoControls !== 'undefined' ? QRCodeLogoControls.logoPadding : 20}%</div>
                    </div>
                    ${FrameColorControl.render({
                        id: 'logoBackgroundColor',
                        label: 'Logo Background Color',
                        value: typeof QRCodeLogoControls !== 'undefined' ? QRCodeLogoControls.logoBackgroundColor : '#ffffff'
                    })}
                </div>
            </div>
        `;
    },

    setFrameCustomization(frameTypeOrSettings, settingsOverride) {
        const frameType = typeof frameTypeOrSettings === 'string'
            ? frameTypeOrSettings
            : this.FRAME_TYPES.NONE;
        const settings = typeof frameTypeOrSettings === 'string'
            ? (settingsOverride || {})
            : (frameTypeOrSettings || {});
        const customization = {
            ...this.getFrameCustomization(frameType)
        };
        const {
            frameText,
            frameColor,
            backgroundColor,
            textColor
        } = settings;
        const defaultFrameText = this.getDefaultFrameText(frameType);

        if (typeof frameText === 'string') {
            customization.frameText = this.isDefaultFrameText(frameText)
                ? (defaultFrameText || this.FRAME_TEXT_DEFAULT)
                : (frameText || defaultFrameText);
        } else if (!customization.frameText) {
            customization.frameText = defaultFrameText;
        }

        if (typeof frameColor === 'string') {
            customization.frameColor = FrameColorControl.normalizeColorValue(frameColor, customization.frameColor);
        }

        if (typeof backgroundColor === 'string') {
            customization.backgroundColor = FrameColorControl.normalizeColorValue(backgroundColor, customization.backgroundColor);
        }

        if (textColor === null) {
            customization.textColor = null;
        } else if (typeof textColor === 'string') {
            customization.textColor = FrameColorControl.normalizeColorValue(textColor, this.getDefaultTextColor(frameType, customization.frameColor));
        }

        this.frameCustomizations[this.getFrameCustomizationKey(frameType)] = customization;
        this.applyFrameCustomization(frameType);
    },

    resetFrameToDefaults(frameType = this.FRAME_TYPES.NONE) {
        const key = this.getFrameCustomizationKey(frameType);

        if (frameType === this.FRAME_TYPES.CUSTOM) {
            const frame = this.getActiveCustomFrame();
            if (!frame) {
                return null;
            }

            frame.qrRect = this.getDefaultCustomFrameQRRect(frame);
            this.customFrame = frame;
            return frame;
        }

        delete this.frameCustomizations[key];
        return this.applyFrameCustomization(frameType);
    },

    getDefaultTextColor(frameType, frameColor = this.FRAME_FOREGROUND_COLOR) {
        const defaultTextColor = this.getFrameDefinition(frameType)?.defaultTextColor;
        if (typeof defaultTextColor === 'string') {
            return defaultTextColor === 'frameColor'
                ? frameColor
                : FrameColorControl.normalizeColorValue(defaultTextColor, frameColor);
        }

        switch (frameType) {
            case this.FRAME_TYPES.ROUNDED_BANNER:
            case this.FRAME_TYPES.FOOTER_PANEL:
            case this.FRAME_TYPES.CENTER_BADGE:
            case this.FRAME_TYPES.POINTER_PANEL:
            case this.FRAME_TYPES.BOLD_BORDER:
            case this.FRAME_TYPES.BOX_POINTER:
            case this.FRAME_TYPES.TOP_BANNER:
            case this.FRAME_TYPES.VIDEO_PANEL:
            case this.FRAME_TYPES.BAG_TAG:
            case this.FRAME_TYPES.FOLDED_BANNER:
            case this.FRAME_TYPES.DELIVERY_VAN:
            case this.FRAME_TYPES.SIDEBAR_CARD:
            case this.FRAME_TYPES.CLIPBOARD:
            case this.FRAME_TYPES.NOTEBOOK:
            case this.FRAME_TYPES.RIBBON:
            case this.FRAME_TYPES.GIFT_BOW:
                return '#ffffff';
            default:
                return frameColor;
        }
    },

    getLabelColor(defaultColor) {
        return this.FRAME_TEXT_COLOR || defaultColor;
    },

    getFrameBackgroundFill() {
        return this.TRANSPARENT_BACKGROUND ? 'transparent' : this.FRAME_BACKGROUND_COLOR;
    },

    getQRBackgroundFill() {
        return this.TRANSPARENT_BACKGROUND ? 'transparent' : this.QR_BACKGROUND_COLOR;
    },

    escapeAttribute(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    },

    isDecorativeFrame(frameType) {
        const frameDefinition = this.getFrameDefinition(frameType);
        if (frameDefinition && Object.prototype.hasOwnProperty.call(frameDefinition, 'decorative')) {
            return Boolean(frameDefinition.decorative);
        }

        return [
            this.FRAME_TYPES.ROUNDED_BANNER,
            this.FRAME_TYPES.OUTLINED_LABEL,
            this.FRAME_TYPES.FOOTER_PANEL,
            this.FRAME_TYPES.CENTER_BADGE,
            this.FRAME_TYPES.POINTER_PANEL,
            this.FRAME_TYPES.BOLD_BORDER,
            this.FRAME_TYPES.CENTERED_QR,
            this.FRAME_TYPES.BOX_POINTER,
            this.FRAME_TYPES.TOP_BANNER,
            this.FRAME_TYPES.SKETCH_BORDER,
            this.FRAME_TYPES.SCRIPT_CARD,
            this.FRAME_TYPES.VIDEO_PANEL,
            this.FRAME_TYPES.PHONE_SCREEN,
            this.FRAME_TYPES.ARROW_NOTE,
            this.FRAME_TYPES.CORNER_ACCENT,
            this.FRAME_TYPES.BAG_TAG,
            this.FRAME_TYPES.MAILER,
            this.FRAME_TYPES.DELIVERY_VAN,
            this.FRAME_TYPES.DISPLAY_STAND,
            this.FRAME_TYPES.SIDEBAR_CARD,
            this.FRAME_TYPES.CLIPBOARD,
            this.FRAME_TYPES.NOTEBOOK,
            this.FRAME_TYPES.FOLDED_BANNER,
            this.FRAME_TYPES.RIBBON,
            this.FRAME_TYPES.GIFT_BOW
        ].includes(frameType);
    },

    /**
     * Get visual frame selector HTML with preview cards
     */
    getFrameSelector() {
        const frames = this.getFrameOptions().map(frame => ({
            ...frame,
            preview: this.getFramePreviewMarkup(frame.id)
        }));
        const noneFrame = frames.find(frame => frame.id === this.FRAME_TYPES.NONE);
        const presetFrames = frames.filter(frame => frame.id !== this.FRAME_TYPES.NONE);
        const customCardMarkup = this.getCustomFrameCardsMarkup();
        const positionPanelHidden = true;

        return `
            <div class="form-group qr-customization-panel">
                <div class="qr-config-type-block">
                    <div class="form-hint qr-section-hint">${I18n.translateString('Choose the frame that wraps the generated QR code.')}</div>
                    <div class="frame-presets-panel">
                        <input type="file" class="logo-upload-input" id="customFrameInput" accept="image/png,image/jpeg,image/svg+xml,image/webp">
                        <div class="frame-presets-header">
                            <div class="frame-presets-title">${I18n.translateString('Frame Types')}</div>
                        </div>
                        <div class="frame-presets-search">
                            <input type="search" class="form-input frame-presets-search-input" id="framePresetSearchInput" placeholder="${I18n.translateString('Search frame types')}" aria-label="${I18n.translateString('Filter frame types by name')}">
                        </div>
                        <div class="frame-selector-grid" id="frameSelector">
                            ${noneFrame ? `
                                <button type="button" class="frame-card frame-card-button active" data-frame="${noneFrame.id}" data-frame-name="${`${noneFrame.name} ${noneFrame.id}`.toLowerCase()}" aria-label="${noneFrame.name} frame preset">
                                    <span class="frame-preview">
                                        ${noneFrame.preview}
                                    </span>
                                    <span class="frame-name">${noneFrame.name}</span>
                                </button>
                            ` : ''}
                            <button type="button" class="frame-card frame-card-button frame-card-action" data-frame-action="upload-custom" data-frame-name="upload custom frame file" aria-label="${I18n.translateString('Upload custom frame')}">
                                <span class="frame-preview frame-preview-action frame-preview-upload">
                                    <i class="bi bi-upload"></i>
                                </span>
                                <span class="frame-name">${I18n.translateString('Upload frame')}</span>
                            </button>
                            ${customCardMarkup}
                            ${presetFrames.map(frame => `
                                <button type="button" class="frame-card frame-card-button" data-frame="${frame.id}" data-frame-name="${`${frame.name} ${frame.id}`.toLowerCase()}" aria-label="${frame.name} frame preset">
                                    <span class="frame-preview">
                                        ${frame.preview}
                                    </span>
                                    <span class="frame-name">${frame.name}</span>
                                </button>
                            `).join('')}
                        </div>
                        <div class="form-hint frame-presets-empty-state" id="framePresetSearchEmpty" hidden>${I18n.translateString('No frame types match your search.')}</div>
                    </div>
                    <div class="custom-frame-position-panel frame-edit-panel" id="customFramePositionPanel" ${positionPanelHidden ? 'hidden' : ''}>
                        <div class="frame-edit-header">
                            <div class="frame-edit-title" id="customFramePositionTitle">${I18n.translateString('Frame edit')}</div>
                            <div class="form-hint frame-edit-intro">${I18n.translateString('Position the QR code inside the selected frame and adjust its colors.')}</div>
                        </div>
                        <div class="frame-edit-section frame-edit-section-position">
                            <div class="frame-edit-section-title">${I18n.translateString('Position & size')}</div>
                            <div class="form-hint" id="customFramePositionHint">${I18n.translateString('Drag the QR box on the preview and resize it from any corner or side.')}</div>
                            <div class="custom-frame-stage" id="customFrameStage">
                                <img id="customFrameStageImage" alt="${I18n.translateString('Frame placement preview')}">
                                <div class="custom-frame-qr-box" id="customFrameQRBox" tabindex="0" role="slider" aria-label="${I18n.translateString('QR code placement')}">
                                    <span>QR</span>
                                    <span class="custom-frame-qr-resize-handle custom-frame-qr-resize-handle-top-left" data-placement-resize-handle="top-left" aria-hidden="true"></span>
                                    <span class="custom-frame-qr-resize-handle custom-frame-qr-resize-handle-top-right" data-placement-resize-handle="top-right" aria-hidden="true"></span>
                                    <span class="custom-frame-qr-resize-handle custom-frame-qr-resize-handle-bottom-left" data-placement-resize-handle="bottom-left" aria-hidden="true"></span>
                                    <span class="custom-frame-qr-resize-handle custom-frame-qr-resize-handle-bottom-right" data-placement-resize-handle="bottom-right" aria-hidden="true"></span>
                                    <span class="custom-frame-qr-resize-handle custom-frame-qr-resize-handle-top" data-placement-resize-handle="top" aria-hidden="true"></span>
                                    <span class="custom-frame-qr-resize-handle custom-frame-qr-resize-handle-right" data-placement-resize-handle="right" aria-hidden="true"></span>
                                    <span class="custom-frame-qr-resize-handle custom-frame-qr-resize-handle-bottom" data-placement-resize-handle="bottom" aria-hidden="true"></span>
                                    <span class="custom-frame-qr-resize-handle custom-frame-qr-resize-handle-left" data-placement-resize-handle="left" aria-hidden="true"></span>
                                </div>
                            </div>
                        </div>
                        <div class="frame-edit-section frame-edit-section-style">
                            <div class="frame-edit-section-title">${I18n.translateString('Style')}</div>
                            ${this.getFrameSettingsMarkup()}
                        </div>
                        <div class="custom-frame-position-actions frame-edit-actions">
                            <button type="button" class="btn btn-secondary" id="customFrameCenterButton">
                                <i class="bi bi-bullseye"></i> ${I18n.translateString('Center')}
                            </button>
                            <button type="button" class="btn btn-secondary" id="customFrameResetButton">
                                <i class="bi bi-arrow-counterclockwise"></i> ${I18n.translateString('Reset')}
                            </button>
                            <button type="button" class="btn btn-secondary custom-frame-remove-button" id="customFrameRemoveButton" hidden>
                                <i class="bi bi-trash"></i> ${I18n.translateString('Remove frame')}
                            </button>
                        </div>
                    </div>
                </div>
                <div class="qr-config-logo-block">
                    ${this.getLogoControlsMarkup()}
                </div>
            </div>
        `;
    },

    getCustomFrameCardsMarkup() {
        if (!this.customFrames.length) {
            return '';
        }
        return this.customFrames.map(frame => this.getCustomFrameCardMarkup(frame)).join('');
    },

    getCustomFrameCardMarkup(frame = this.getActiveCustomFrame()) {
        if (!frame) {
            return '';
        }
        const frameName = this.escapeHTML(frame.name || I18n.translateString('Custom'));
        const preview = this.getFramePreviewMarkup(this.FRAME_TYPES.CUSTOM, frame.id);
        return `
            <button type="button" class="frame-card frame-card-button" style="grid-row: 1;" data-frame="${this.FRAME_TYPES.CUSTOM}" data-frame-name="custom uploaded frame ${frameName.toLowerCase()}" data-custom-frame="true" data-custom-frame-id="${frame.id}" aria-label="${frameName} ${I18n.translateString('frame preset')}">
                <span class="frame-preview">
                    ${preview}
                </span>
                <span class="frame-name">${frameName}</span>
            </button>
        `;
    },

    /**
     * Get preview image markup for a frame type
     */
    getFramePreviewMarkup(frameType, customFrameId = '') {
        const previousCustomFrameId = this.activeCustomFrameId;
        if (frameType === this.FRAME_TYPES.CUSTOM && customFrameId) {
            this.setActiveCustomFrame(customFrameId);
        }
        const previewCanvas = this.withFrameCustomization(frameType, () => this.applyFrame(this.createSampleQRCodeCanvas(100), frameType, 100));
        if (frameType === this.FRAME_TYPES.CUSTOM && customFrameId) {
            this.setActiveCustomFrame(previousCustomFrameId);
        }
        const previewName = this.getFrameDisplayName(frameType);

        return `<img src="${previewCanvas.toDataURL('image/png')}" alt="${previewName} frame preview">`;
    },

    getPlacementStageImageDataUrl(frameType, size = 300) {
        if (frameType === this.FRAME_TYPES.CUSTOM) {
            return this.getActiveCustomFrame()?.dataUrl || '';
        }
        if (!frameType) {
            return '';
        }
        const canvas = this.withFrameCustomization(frameType, () => this.applyFrame(this.createBlankQRCodeCanvas(size), frameType, size));
        return canvas.toDataURL('image/png');
    },

    updateFramePreviewCard(card, qrCanvas, previewSize = 100) {
        if (!qrCanvas || !card) {
            return;
        }

        const frameType = card.dataset.frame;
        const preview = card.querySelector('.frame-preview');
        if (!preview || !frameType) {
            return;
        }

        const normalizedQRCanvas = this.getSquareQRSourceCanvas(qrCanvas);
        const previousCustomFrameId = this.activeCustomFrameId;
        if (frameType === this.FRAME_TYPES.CUSTOM && card.dataset.customFrameId) {
            this.setActiveCustomFrame(card.dataset.customFrameId);
        }

        const framedPreview = this.withFrameCustomization(frameType, () => {
            const sourceCanvas = document.createElement('canvas');
            sourceCanvas.width = previewSize;
            sourceCanvas.height = previewSize;
            const sourceContext = sourceCanvas.getContext('2d');
            sourceContext.fillStyle = this.getQRBackgroundFill();
            sourceContext.fillRect(0, 0, previewSize, previewSize);
            sourceContext.drawImage(normalizedQRCanvas, 0, 0, previewSize, previewSize);
            return this.applyFrameWithActiveCustomization(sourceCanvas, frameType, previewSize);
        });
        const previewName = this.getFrameDisplayName(frameType);

        preview.innerHTML = `<img src="${framedPreview.toDataURL('image/png')}" alt="${previewName} frame preview">`;
        if (frameType === this.FRAME_TYPES.CUSTOM && card.dataset.customFrameId) {
            this.setActiveCustomFrame(previousCustomFrameId);
        }
    },

    resetFramePreviewCard(card) {
        if (!card) {
            return;
        }

        const preview = card.querySelector('.frame-preview');
        if (!preview || !card.dataset.frame) {
            return;
        }

        preview.innerHTML = this.getFramePreviewMarkup(card.dataset.frame, card.dataset.customFrameId || '');
    },

    updateActiveFramePreview(qrCanvas, previewSize = 100) {
        const activeCard = document.querySelector('.frame-card.active');
        if (!activeCard) {
            return;
        }

        this.updateFramePreviewCard(activeCard, qrCanvas, previewSize);
    },

    /**
     * Update frame selector thumbnails using the current QR preview canvas
     */
    updateFramePreviews(qrCanvas, previewSize = 100) {
        if (!qrCanvas) {
            return;
        }

        const frameCards = document.querySelectorAll('.frame-card');
        frameCards.forEach(card => {
            this.updateFramePreviewCard(card, qrCanvas, previewSize);
        });
    },

    /**
     * Create a QR-like sample canvas used for frame selector thumbnails
     */
    createSampleQRCodeCanvas(size) {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;

        const ctx = canvas.getContext('2d');
        const modules = [
            '1111001000',
            '1001000100',
            '1011000010',
            '1001001000',
            '1111000010',
            '0000010100',
            '1010100010',
            '0100001000',
            '0010100010',
            '0000000000'
        ];
        const moduleSize = size / modules.length;

        ctx.fillStyle = this.getQRBackgroundFill();
        ctx.fillRect(0, 0, size, size);
        ctx.fillStyle = this.FRAME_FOREGROUND_COLOR;

        modules.forEach((row, y) => {
            for (let x = 0; x < row.length; x += 1) {
                if (row[x] === '1') {
                    ctx.fillRect(x * moduleSize, y * moduleSize, moduleSize, moduleSize);
                }
            }
        });

        return canvas;
    },

    createBlankQRCodeCanvas(size) {
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = this.TRANSPARENT_BACKGROUND ? 'rgba(255, 255, 255, 0)' : this.getQRBackgroundFill();
        ctx.fillRect(0, 0, size, size);
        return canvas;
    },

    /**
     * Get shared frame metrics for preview and export rendering
     */
    getFrameMetrics(frameType, size) {
        if (this.isDecorativeFrame(frameType)) {
            return this.getDecorativeFrameMetrics(frameType, size);
        }

        const hasText = frameType === this.FRAME_TYPES.SCAN_ME || frameType === this.FRAME_TYPES.SCAN_ME_BORDER;
        const textHeight = hasText ? Math.round(size * 0.15) : 0;
        const isBorderFrame = frameType === this.FRAME_TYPES.SCAN_ME_BORDER;

        const metrics = {
            size,
            hasText,
            totalHeight: size + textHeight,
            textHeight,
            borderWidth: isBorderFrame ? Math.max(2, Math.round(size * this.BORDER_FRAME_WIDTH_RATIO)) : 0,
            separatorWidth: isBorderFrame ? Math.max(2, Math.round(size * this.BORDER_FRAME_WIDTH_RATIO)) : 0,
            qrInset: isBorderFrame ? Math.max(20, Math.round(size * 0.12)) : 0,
            borderRadius: Math.max(3, Math.round(size * 0.01)),
            fontSize: hasText ? Math.max(6, Math.round(textHeight * 0.58)) : 0,
            textY: hasText ? size + (textHeight / 2) : size
        };
        const defaultQRBounds = isBorderFrame
            ? { x: metrics.qrInset, y: metrics.qrInset, size: size - (metrics.qrInset * 2) }
            : { x: 0, y: 0, size };
        metrics.qrBounds = this.applyQRRectOverride(frameType, size, metrics.totalHeight, defaultQRBounds);
        return metrics;
    },

    getDecorativeFrameConfig(frameType) {
        const defaultConfig = {
            artboardHeight: this.DECORATIVE_FRAME_ARTBOARD_HEIGHT,
            qrBackground: { x: 6, y: 6, width: 52, height: 52, radius: 4 },
            interiorBackground: null,
            qrBounds: { x: 12, y: 12, size: 40 }
        };

        switch (frameType) {
            case this.FRAME_TYPES.ROUNDED_BANNER:
                return {
                    artboardHeight: this.DECORATIVE_FRAME_ARTBOARD_HEIGHT,
                    interiorBackground: { x: 1, y: 1, width: 62, height: 62, radius: 3 },
                    qrBackground: null,
                    qrBounds: { x: 12, y: 12, size: 40 }
                };
            case this.FRAME_TYPES.OUTLINED_LABEL:
                return {
                    artboardHeight: this.DECORATIVE_FRAME_ARTBOARD_HEIGHT,
                    interiorBackground: { x: 1, y: 1, width: 62, height: 82, radius: 3 },
                    qrBackground: null,
                    qrBounds: { x: 12, y: 12, size: 40 }
                };
            case this.FRAME_TYPES.FOOTER_PANEL:
                return {
                    artboardHeight: this.DECORATIVE_FRAME_ARTBOARD_HEIGHT,
                    interiorBackground: { x: 1, y: 1, width: 62, height: 62, radius: 3 },
                    qrBackground: null,
                    qrBounds: { x: 12, y: 12, size: 40 }
                };
            case this.FRAME_TYPES.POINTER_PANEL:
                return {
                    artboardHeight: this.DECORATIVE_FRAME_ARTBOARD_HEIGHT,
                    interiorBackground: { x: 1, y: 1, width: 62, height: 58, radius: 3 },
                    qrBackground: null,
                    qrBounds: { x: 12, y: 12, size: 40 }
                };
            case this.FRAME_TYPES.CENTERED_QR:
                return {
                    artboardHeight: this.DECORATIVE_FRAME_ARTBOARD_HEIGHT,
                    interiorBackground: { x: 4, y: 2, width: 56, height: 76, radius: 2 },
                    qrBackground: null,
                    qrBounds: { x: 12, y: 12, size: 40 }
                };
            case this.FRAME_TYPES.BOX_POINTER:
                return {
                    artboardHeight: this.DECORATIVE_FRAME_ARTBOARD_HEIGHT,
                    interiorBackground: { x: 3, y: 1, width: 58, height: 58, radius: 3 },
                    qrBackground: null,
                    qrBounds: { x: 12, y: 12, size: 40 }
                };
            case this.FRAME_TYPES.TOP_BANNER:
                return {
                    artboardHeight: this.DECORATIVE_FRAME_ARTBOARD_HEIGHT,
                    interiorBackground: { x: 3, y: 25, width: 58, height: 58, radius: 3 },
                    qrBackground: null,
                    qrBounds: { x: 12, y: 34, size: 40 }
                };
            case this.FRAME_TYPES.SKETCH_BORDER:
                return {
                    artboardHeight: this.DECORATIVE_FRAME_ARTBOARD_HEIGHT,
                    interiorBackground: { x: 6.5, y: 8.5, width: 51, height: 68, radius: 2 },
                    qrBackground: null,
                    qrBounds: { x: 16, y: 19, size: 32 }
                };
            case this.FRAME_TYPES.PHONE_SCREEN:
                return {
                    artboardHeight: this.DECORATIVE_FRAME_ARTBOARD_HEIGHT,
                    interiorBackground: { x: 7, y: 9, width: 50, height: 60, radius: 2 },
                    qrBackground: null,
                    qrBounds: { x: 15, y: 17, size: 34 }
                };
            case this.FRAME_TYPES.ARROW_NOTE:
                return {
                    artboardHeight: this.DECORATIVE_FRAME_ARTBOARD_HEIGHT,
                    interiorBackground: { x: 7, y: 9, width: 50, height: 60, radius: 2 },
                    qrBackground: null,
                    qrBounds: { x: 12, y: 10, size: 40 }
                };
            case this.FRAME_TYPES.CORNER_ACCENT:
                return {
                    artboardHeight: this.DECORATIVE_FRAME_ARTBOARD_HEIGHT,
                    interiorBackground: null,
                    qrBackground: null,
                    qrBounds: { x: 20, y: 29.5, size: 24 }
                };
            case this.FRAME_TYPES.BAG_TAG:
                return {
                    artboardHeight: this.DECORATIVE_FRAME_ARTBOARD_HEIGHT,
                    interiorBackground: { x: 6.5, y: 15.5, width: 50, height: 50.75, radius: 2 },
                    qrBackground: null,
                    qrBounds: { x: 16.5, y: 26, size: 30 }
                };
            case this.FRAME_TYPES.MAILER:
                return {
                    artboardHeight: this.DECORATIVE_FRAME_ARTBOARD_HEIGHT,
                    interiorBackground: null,
                    qrBackground: null,
                    qrBounds: { x: 19.5, y: 15, size: 25 }
                };
            case this.FRAME_TYPES.DELIVERY_VAN:
                return {
                    artboardHeight: this.DELIVERY_VAN_ARTBOARD_HEIGHT,
                    interiorBackground: null,
                    qrBackground: null,
                    qrBounds: { x: 7.5, y: 17.5, size: 19 }
                };
            case this.FRAME_TYPES.DISPLAY_STAND:
                return {
                    artboardHeight: this.DECORATIVE_FRAME_ARTBOARD_HEIGHT,
                    interiorBackground: null,
                    qrBackground: null,
                    qrBounds: { x: 22, y: 21, size: 23 }
                };
            case this.FRAME_TYPES.SIDEBAR_CARD:
                return {
                    artboardHeight: this.DECORATIVE_FRAME_ARTBOARD_HEIGHT,
                    interiorBackground: null,
                    qrBackground: null,
                    qrBounds: { x: 28.5, y: 31.5, size: 22 }
                };
            case this.FRAME_TYPES.CLIPBOARD:
                return {
                    artboardHeight: this.DECORATIVE_FRAME_ARTBOARD_HEIGHT,
                    interiorBackground: null,
                    qrBackground: null,
                    qrBounds: { x: 15, y: 24, size: 34 }
                };
            case this.FRAME_TYPES.NOTEBOOK:
                return {
                    artboardHeight: this.DECORATIVE_FRAME_ARTBOARD_HEIGHT,
                    interiorBackground: null,
                    qrBackground: null,
                    qrBounds: { x: 19.5, y: 24.5, size: 30 }
                };
            case this.FRAME_TYPES.FOLDED_BANNER:
                return {
                    artboardHeight: this.DECORATIVE_FRAME_ARTBOARD_HEIGHT,
                    interiorBackground: null,
                    qrBackground: null,
                    qrBounds: { x: 20.5, y: 40, size: 23 }
                };
            case this.FRAME_TYPES.RIBBON:
                return {
                    artboardHeight: this.DECORATIVE_FRAME_ARTBOARD_HEIGHT,
                    interiorBackground: null,
                    qrBackground: null,
                    qrBounds: { x: 19.5, y: 24.5, size: 25 }
                };
            case this.FRAME_TYPES.GIFT_BOW:
                return {
                    artboardHeight: this.DECORATIVE_FRAME_ARTBOARD_HEIGHT,
                    interiorBackground: { x: 7.5, y: 20.57, width: 49.05, height: 49.18, radius: 2 },
                    qrBackground: null,
                    qrBounds: { x: 17, y: 30, size: 30 }
                };
            case this.FRAME_TYPES.VIDEO_PANEL:
                return {
                    artboardHeight: this.DECORATIVE_FRAME_ARTBOARD_HEIGHT,
                    interiorBackground: { x: 1, y: 1, width: 62, height: 62, radius: 3 },
                    qrBackground: null,
                    qrBounds: { x: 12, y: 12, size: 40 }
                };
            default:
                return defaultConfig;
        }
    },

    getDecorativeFrameMetrics(frameType, size) {
        const config = this.getDecorativeFrameConfig(frameType);
        const scale = size / this.FRAME_ARTBOARD_WIDTH;
        const strokeWidth = Math.max(1.5, scale * 2);
        const mapRect = rect => rect ? {
            x: scale * rect.x,
            y: scale * rect.y,
            width: scale * rect.width,
            height: scale * rect.height,
            radius: scale * rect.radius
        } : null;
        const mapQRBounds = bounds => bounds ? {
            x: scale * bounds.x,
            y: scale * bounds.y,
            size: scale * bounds.size
        } : null;
        const mappedInteriorBackground = mapRect(config.interiorBackground);
        const mappedQRBackground = mapRect(config.qrBackground);
        const defaultQRBounds = this.getNormalizedDecorativeQRBounds(
            size,
            mappedInteriorBackground || mappedQRBackground,
            mapQRBounds(config.qrBounds)
        );
        const totalHeight = Math.ceil(scale * config.artboardHeight);
        const qrBounds = this.applyQRRectOverride(frameType, size, totalHeight, defaultQRBounds);

        return {
            size,
            scale,
            artboardHeight: config.artboardHeight,
            totalHeight,
            strokeWidth,
            outerRadius: Math.max(2, scale * 3),
            interiorBackground: mappedInteriorBackground,
            qrBackground: mappedQRBackground,
            qrBounds,
            fontSize: Math.max(6, scale * 9)
        };
    },

    getScanMeBorderInnerPadding(size) {
        const borderWidth = Math.max(2, Math.round(size * this.BORDER_FRAME_WIDTH_RATIO));
        const qrInset = Math.max(20, Math.round(size * 0.12));

        return Math.max(2, qrInset - (borderWidth / 2));
    },

    getNormalizedDecorativeQRBounds(size, qrContainer, fallbackBounds) {
        if (!qrContainer) {
            return fallbackBounds;
        }

        const targetPadding = this.getScanMeBorderInnerPadding(size);
        const squareSize = Math.min(qrContainer.width, qrContainer.height);
        const qrSize = Math.max(0, squareSize - (targetPadding * 2));

        return {
            x: qrContainer.x + ((squareSize - qrSize) / 2),
            y: qrContainer.y + ((squareSize - qrSize) / 2),
            size: qrSize
        };
    },

    applyQRRectOverride(frameType, width, height, defaultBounds) {
        const override = this.frameQRRectOverrides[frameType]
            || this.getFrameDefinitionQRRect(frameType, height / width);
        if (!override) {
            return defaultBounds;
        }
        return this.normalizedRectToBounds(this.clampFrameQRRect(override, height / width), width, height);
    },

    boundsToNormalizedRect(bounds, width, height) {
        return this.clampFrameQRRect({
            xPct: bounds.x / width,
            yPct: bounds.y / height,
            widthPct: (bounds.width ?? bounds.size) / width,
            heightPct: (bounds.height ?? bounds.size) / height
        }, height / width);
    },

    normalizedRectToBounds(rect, width, height) {
        const normalized = this.clampFrameQRRect(rect, height / width);
        return {
            x: normalized.xPct * width,
            y: normalized.yPct * height,
            width: normalized.widthPct * width,
            height: normalized.heightPct * height,
            size: normalized.widthPct * width
        };
    },

    getFrameQRRectDimensions(rect = {}, heightRatio = 1) {
        const normalizedHeightRatio = Math.max(0.1, Number(heightRatio) || 1);
        const minWidthPct = 0.05;
        const minHeightPct = minWidthPct / normalizedHeightRatio;
        const maxWidthPct = this.MAX_FRAME_QR_SIZE_PCT;
        const maxHeightPct = this.MAX_FRAME_QR_SIZE_PCT / normalizedHeightRatio;
        const fallbackSizePct = Number(rect?.sizePct);
        const rawWidthPct = Number(rect?.widthPct);
        const rawHeightPct = Number(rect?.heightPct);
        const widthPct = Math.min(maxWidthPct, Math.max(minWidthPct, Number.isFinite(rawWidthPct) ? rawWidthPct : (Number.isFinite(fallbackSizePct) ? fallbackSizePct : 0.5)));
        const heightPct = Math.min(maxHeightPct, Math.max(minHeightPct, Number.isFinite(rawHeightPct) ? rawHeightPct : (Number.isFinite(fallbackSizePct) ? (fallbackSizePct / normalizedHeightRatio) : (0.5 / normalizedHeightRatio))));

        return { widthPct, heightPct };
    },

    getFrameQRRectBounds(rect = {}, heightRatio = 1) {
        const { widthPct, heightPct } = this.getFrameQRRectDimensions(rect, heightRatio);
        const minVisibleXPct = Math.min(widthPct * 0.35, 0.12);
        const minVisibleYPct = Math.min(heightPct * 0.35, 0.12);

        return {
            minXPct: minVisibleXPct - widthPct,
            maxXPct: 1 - minVisibleXPct,
            minYPct: minVisibleYPct - heightPct,
            maxYPct: 1 - minVisibleYPct
        };
    },

    clampFrameQRRect(rect, heightRatio = 1) {
        const { widthPct, heightPct } = this.getFrameQRRectDimensions(rect, heightRatio);
        const bounds = this.getFrameQRRectBounds({ widthPct, heightPct }, heightRatio);
        const xPct = Math.min(bounds.maxXPct, Math.max(bounds.minXPct, Number(rect.xPct) || 0));
        const yPct = Math.min(bounds.maxYPct, Math.max(bounds.minYPct, Number(rect.yPct) || 0));
        return {
            xPct,
            yPct,
            widthPct,
            heightPct,
            sizePct: widthPct
        };
    },

    getDefaultFrameQRRect(frameType, width = 300) {
        if (frameType === this.FRAME_TYPES.CUSTOM) {
            const frame = this.getActiveCustomFrame();
            if (!frame) {
                return { xPct: 0.25, yPct: 0.25, sizePct: 0.5 };
            }
            return this.getDefaultCustomFrameQRRect(frame);
        }
        const previousOverride = this.frameQRRectOverrides[frameType];
        delete this.frameQRRectOverrides[frameType];
        const metrics = this.getFrameMetrics(frameType, width);
        if (previousOverride) {
            this.frameQRRectOverrides[frameType] = previousOverride;
        }
        return this.boundsToNormalizedRect(metrics.qrBounds || { x: 0, y: 0, size: width }, width, metrics.totalHeight || width);
    },

    getFrameQRRect(frameType) {
        if (frameType === this.FRAME_TYPES.CUSTOM) {
            const frame = this.getActiveCustomFrame();
            return frame
                ? this.clampFrameQRRect(frame.qrRect || this.getDefaultFrameQRRect(frameType), this.getFrameHeightRatio(frameType))
                : this.getDefaultFrameQRRect(frameType);
        }
        return this.clampFrameQRRect(this.frameQRRectOverrides[frameType] || this.getDefaultFrameQRRect(frameType), this.getFrameHeightRatio(frameType));
    },

    getFrameHeightRatio(frameType) {
        if (frameType === this.FRAME_TYPES.CUSTOM) {
            const frame = this.getActiveCustomFrame();
            return frame ? frame.naturalHeight / frame.naturalWidth : 1;
        }
        const metrics = this.getFrameMetrics(frameType, 300);
        return (metrics.totalHeight || 300) / 300;
    },

    getFrameQRRectRange(frameType, rectOverride = null) {
        const rect = rectOverride == null
            ? this.getFrameQRRect(frameType)
            : (typeof rectOverride === 'number' ? { sizePct: rectOverride } : rectOverride);
        return this.getFrameQRRectBounds(rect, this.getFrameHeightRatio(frameType));
    },

    setFrameQRRect(frameType, partial) {
        if (frameType === this.FRAME_TYPES.CUSTOM) {
            return this.setCustomQRRect(partial);
        }
        if (!frameType) {
            return null;
        }
        const nextRect = this.clampFrameQRRect({
            ...this.getFrameQRRect(frameType),
            ...partial
        }, this.getFrameHeightRatio(frameType));
        this.frameQRRectOverrides[frameType] = nextRect;
        return nextRect;
    },

    resetFrameQRRect(frameType) {
        if (frameType === this.FRAME_TYPES.CUSTOM) {
            const frame = this.getActiveCustomFrame();
            if (frame) {
                frame.qrRect = this.getDefaultCustomFrameQRRect(frame);
                this.customFrame = frame;
            }
            return frame?.qrRect || null;
        }
        delete this.frameQRRectOverrides[frameType];
        return this.getFrameQRRect(frameType);
    },

    /**
     * Format metric values for SVG output
     */
    formatMetric(value) {
        return Number(value.toFixed(2));
    },

    /**
     * Extract the inner SVG content and source viewBox
     */
    extractSVGSource(qrSVG, fallbackSize) {
        const content = qrSVG
            .replace(/^[\s\S]*?<svg\b[^>]*>/i, '')
            .replace(/<\/svg>\s*$/i, '')
            .trim();

        const viewBoxMatch = qrSVG.match(/viewBox="([^"]+)"/i);
        if (viewBoxMatch) {
            const [minX, minY, width, height] = viewBoxMatch[1].split(/\s+/).map(Number);
            return {
                content: this.normalizeQRCodeSVGContent(content, width, height),
                viewBox: { minX, minY, width, height }
            };
        }

        const widthMatch = qrSVG.match(/width="([^"]+)"/i);
        const heightMatch = qrSVG.match(/height="([^"]+)"/i);
        const width = parseFloat(widthMatch?.[1]) || fallbackSize;
        const height = parseFloat(heightMatch?.[1]) || fallbackSize;

        return {
            content: this.normalizeQRCodeSVGContent(content, width, height),
            viewBox: { minX: 0, minY: 0, width, height }
        };
    },

    normalizeQRCodeSVGContent(content, width, height) {
        const wrapper = document.createElement('div');
        wrapper.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg">${content}</svg>`;
        const svgElement = wrapper.firstElementChild;
        if (!svgElement) {
            return content.trim();
        }

        svgElement.querySelectorAll('rect').forEach(rect => {
            const rectWidth = rect.getAttribute('width');
            const rectHeight = rect.getAttribute('height');
            const rectX = rect.getAttribute('x') || '0';
            const rectY = rect.getAttribute('y') || '0';
            if (!this.isQRCodeBackgroundRect(rectWidth, rectHeight, rectX, rectY, width, height)) {
                return;
            }
            rect.remove();
        });

        return Array.from(svgElement.childNodes)
            .map(node => node.outerHTML || node.textContent || '')
            .join('')
            .trim();
    },

    isQRCodeBackgroundRect(rectWidth, rectHeight, rectX, rectY, width, height) {
        const matchesDimension = (value, target) => {
            if (!value) {
                return false;
            }
            const normalizedValue = String(value).trim();
            if (normalizedValue === '100%') {
                return true;
            }
            const numericValue = Number.parseFloat(normalizedValue);
            return Number.isFinite(numericValue) && Math.abs(numericValue - target) < 0.01;
        };

        const matchesOrigin = value => {
            const numericValue = Number.parseFloat(String(value).trim());
            return !Number.isFinite(numericValue) || Math.abs(numericValue) < 0.01;
        };

        return matchesDimension(rectWidth, width)
            && matchesDimension(rectHeight, height)
            && matchesOrigin(rectX)
            && matchesOrigin(rectY);
    },

    /**
     * Build a framed SVG using shared layout metrics
     */
    buildFrameSVG(frameType, size, qrContent, sourceViewBox) {
        if (this.isDecorativeFrame(frameType)) {
            return this.buildDecorativeFrameSVG(frameType, size, qrContent, sourceViewBox);
        }

        const metrics = this.getFrameMetrics(frameType, size);
        const qrBounds = metrics.qrBounds || { x: 0, y: 0, width: size, height: size, size };
        const qrWidth = qrBounds.width ?? qrBounds.size ?? size;
        const qrHeight = qrBounds.height ?? qrBounds.size ?? size;
        const scaleX = qrWidth / sourceViewBox.width;
        const scaleY = qrHeight / sourceViewBox.height;
        const translateX = qrBounds.x - (sourceViewBox.minX * scaleX);
        const translateY = qrBounds.y - (sourceViewBox.minY * scaleY);
        const borderInset = metrics.borderWidth / 2;
        const noneFrameBackground = frameType === this.FRAME_TYPES.NONE && !this.TRANSPARENT_BACKGROUND ? `
            <rect x="0" y="0" width="${size}" height="${metrics.totalHeight}" fill="${this.getQRBackgroundFill()}"></rect>
        ` : '';
        const qrAreaBackground = frameType !== this.FRAME_TYPES.NONE
            && frameType !== this.FRAME_TYPES.SCAN_ME_BORDER
            && !this.TRANSPARENT_BACKGROUND ? `
            <rect x="0" y="0" width="${size}" height="${size}" fill="${this.getQRBackgroundFill()}"></rect>
        ` : '';
        const scanMeBorderBackground = frameType === this.FRAME_TYPES.SCAN_ME_BORDER ? `
            <rect x="${this.formatMetric(borderInset)}" y="${this.formatMetric(borderInset)}" width="${this.formatMetric(size - metrics.borderWidth)}" height="${this.formatMetric(metrics.totalHeight - metrics.borderWidth)}" rx="${metrics.borderRadius}" fill="${this.getFrameBackgroundFill()}"></rect>
        ` : '';

        return `
            <svg viewBox="0 0 ${size} ${metrics.totalHeight}" fill="none" xmlns="http://www.w3.org/2000/svg">
                ${noneFrameBackground}
                ${qrAreaBackground}
                ${scanMeBorderBackground}
                <g transform="translate(${this.formatMetric(translateX)} ${this.formatMetric(translateY)}) scale(${this.formatMetric(scaleX)} ${this.formatMetric(scaleY)})">
                    ${qrContent}
                </g>
                ${frameType === this.FRAME_TYPES.SCAN_ME ? `
                    <rect x="0" y="${size}" width="${size}" height="${metrics.textHeight}" fill="${this.getFrameBackgroundFill()}"></rect>
                ` : ''}
                ${frameType === this.FRAME_TYPES.SCAN_ME_BORDER ? `
                    <rect x="${this.formatMetric(borderInset)}" y="${this.formatMetric(borderInset)}" width="${this.formatMetric(size - metrics.borderWidth)}" height="${this.formatMetric(metrics.totalHeight - metrics.borderWidth)}" rx="${metrics.borderRadius}" stroke="${this.FRAME_FOREGROUND_COLOR}" stroke-width="${metrics.borderWidth}" fill="none"></rect>
                    <line x1="${this.formatMetric(borderInset)}" y1="${size}" x2="${this.formatMetric(size - borderInset)}" y2="${size}" stroke="${this.FRAME_FOREGROUND_COLOR}" stroke-width="${metrics.separatorWidth}"></line>
                ` : ''}
                ${metrics.hasText ? `
                    <text x="${size / 2}" y="${this.formatMetric(metrics.textY)}" text-anchor="middle" dominant-baseline="middle" font-size="${metrics.fontSize}" font-weight="700" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" fill="${this.getLabelColor(this.FRAME_FOREGROUND_COLOR)}">${this.FRAME_TEXT}</text>
                ` : ''}
            </svg>
        `;
    },

    buildDecorativeFrameSVG(frameType, size, qrContent, sourceViewBox) {
        const metrics = this.getDecorativeFrameMetrics(frameType, size);
        const qrWidth = metrics.qrBounds.width ?? metrics.qrBounds.size;
        const qrHeight = metrics.qrBounds.height ?? metrics.qrBounds.size;
        const qrScaleX = qrWidth / sourceViewBox.width;
        const qrScaleY = qrHeight / sourceViewBox.height;
        const qrTranslateX = metrics.qrBounds.x - (sourceViewBox.minX * qrScaleX);
        const qrTranslateY = metrics.qrBounds.y - (sourceViewBox.minY * qrScaleY);
        const frameMarkup = this.getDecorativeFrameSVGMarkup(frameType, metrics);

        return `
            <svg viewBox="0 0 ${size} ${metrics.totalHeight}" fill="none" xmlns="http://www.w3.org/2000/svg">
                ${frameMarkup.beforeQR}
                <g transform="translate(${this.formatMetric(qrTranslateX)} ${this.formatMetric(qrTranslateY)}) scale(${this.formatMetric(qrScaleX)} ${this.formatMetric(qrScaleY)})">
                    ${qrContent}
                </g>
                ${frameMarkup.afterQR}
            </svg>
        `;
    },

    getDecorativeFrameSVGMarkup(frameType, metrics) {
        const interiorBackground = metrics.interiorBackground ? `<rect x="${this.formatMetric(metrics.interiorBackground.x)}" y="${this.formatMetric(metrics.interiorBackground.y)}" width="${this.formatMetric(metrics.interiorBackground.width)}" height="${this.formatMetric(metrics.interiorBackground.height)}" rx="${this.formatMetric(metrics.interiorBackground.radius)}" fill="${this.getFrameBackgroundFill()}"></rect>` : '';
        const qrBackground = metrics.qrBackground ? `<rect x="${this.formatMetric(metrics.qrBackground.x)}" y="${this.formatMetric(metrics.qrBackground.y)}" width="${this.formatMetric(metrics.qrBackground.width)}" height="${this.formatMetric(metrics.qrBackground.height)}" rx="${this.formatMetric(metrics.qrBackground.radius)}" fill="${this.getQRBackgroundFill()}"></rect>` : '';
        const customText = ({
            x = metrics.size / 2,
            y,
            color,
            fontSize = metrics.fontSize,
            fontWeight = '700',
            fontFamily = this.FRAME_FONT_DEFAULT,
            rotation,
            rotateX = x,
            rotateY = y
        }) => `
            <text x="${this.formatMetric(x)}" y="${this.formatMetric(y)}" text-anchor="middle" dominant-baseline="middle" font-size="${this.formatMetric(fontSize)}" font-weight="${fontWeight}" font-family="${fontFamily}" fill="${this.getLabelColor(color)}"${rotation !== undefined ? ` transform="rotate(${rotation} ${this.formatMetric(rotateX)} ${this.formatMetric(rotateY)})"` : ''}>${this.FRAME_TEXT}</text>
        `;
        const commonText = (textY, color) => customText({ y: textY, color });

        switch (frameType) {
            case this.FRAME_TYPES.ROUNDED_BANNER:
                return {
                    beforeQR: `
                        <rect x="${this.scaleArtboardX(1, metrics)}" y="${this.scaleArtboardY(1, metrics)}" width="${this.scaleArtboardX(62, metrics)}" height="${this.scaleArtboardY(62, metrics)}" rx="${this.formatMetric(metrics.outerRadius)}" stroke="${this.FRAME_FOREGROUND_COLOR}" stroke-width="${this.formatMetric(metrics.strokeWidth)}" fill="none"></rect>
                        ${interiorBackground}
                        ${qrBackground}
                        <rect x="${this.scaleArtboardX(1, metrics)}" y="${this.scaleArtboardY(67, metrics)}" width="${this.scaleArtboardX(62, metrics)}" height="${this.scaleArtboardY(16, metrics)}" rx="${this.scaleArtboardY(1, metrics)}" fill="${this.FRAME_FOREGROUND_COLOR}" stroke="${this.FRAME_FOREGROUND_COLOR}" stroke-width="${this.formatMetric(metrics.strokeWidth)}"></rect>
                    `,
                    afterQR: commonText(this.scaleArtboardY(75.765, metrics), '#ffffff')
                };
            case this.FRAME_TYPES.OUTLINED_LABEL:
                return {
                    beforeQR: `
                        <rect x="${this.scaleArtboardX(1, metrics)}" y="${this.scaleArtboardY(1, metrics)}" width="${this.scaleArtboardX(62, metrics)}" height="${this.scaleArtboardY(82, metrics)}" rx="${this.formatMetric(metrics.outerRadius)}" stroke="${this.FRAME_FOREGROUND_COLOR}" stroke-width="${this.formatMetric(metrics.strokeWidth)}" fill="none"></rect>
                        ${interiorBackground}
                        ${qrBackground}
                    `,
                    afterQR: commonText(this.scaleArtboardY(73.765, metrics), this.FRAME_FOREGROUND_COLOR)
                };
            case this.FRAME_TYPES.FOOTER_PANEL:
                return {
                    beforeQR: `
                        <path d="${this.getTopRoundedRectPath(this.scaleArtboardX(1, metrics), this.scaleArtboardY(1, metrics), this.scaleArtboardX(62, metrics), this.scaleArtboardY(62, metrics), metrics.outerRadius)}" stroke="${this.FRAME_FOREGROUND_COLOR}" stroke-width="${this.formatMetric(metrics.strokeWidth)}" fill="none"></path>
                        ${interiorBackground}
                        ${qrBackground}
                        <path d="${this.getBottomRoundedRectPath(this.scaleArtboardX(1, metrics), this.scaleArtboardY(63, metrics), this.scaleArtboardX(62, metrics), this.scaleArtboardY(20, metrics), metrics.outerRadius)}" fill="${this.FRAME_FOREGROUND_COLOR}" stroke="${this.FRAME_FOREGROUND_COLOR}" stroke-width="${this.formatMetric(metrics.strokeWidth)}"></path>
                    `,
                    afterQR: commonText(this.scaleArtboardY(73.765, metrics), '#ffffff')
                };
            case this.FRAME_TYPES.CENTER_BADGE:
                return {
                    beforeQR: `
                        ${qrBackground}
                        <rect x="${this.scaleArtboardX(7, metrics)}" y="${this.scaleArtboardY(63, metrics)}" width="${this.scaleArtboardX(50, metrics)}" height="${this.scaleArtboardY(16, metrics)}" rx="${this.scaleArtboardY(1, metrics)}" fill="${this.FRAME_FOREGROUND_COLOR}" stroke="${this.FRAME_FOREGROUND_COLOR}" stroke-width="${this.formatMetric(metrics.strokeWidth)}"></rect>
                    `,
                    afterQR: commonText(this.scaleArtboardY(71.765, metrics), '#ffffff')
                };
            case this.FRAME_TYPES.POINTER_PANEL:
                return {
                    beforeQR: `
                        <rect x="${this.scaleArtboardX(1, metrics)}" y="${this.scaleArtboardY(1, metrics)}" width="${this.scaleArtboardX(62, metrics)}" height="${this.scaleArtboardY(58, metrics)}" rx="${this.formatMetric(metrics.outerRadius)}" stroke="${this.FRAME_FOREGROUND_COLOR}" stroke-width="${this.formatMetric(metrics.strokeWidth)}" fill="none"></rect>
                        ${interiorBackground}
                        ${qrBackground}
                        <path d="${this.getPointerPanelTrianglePath(metrics)}" fill="${this.FRAME_FOREGROUND_COLOR}"></path>
                        <path d="${this.getBottomRoundedRectPath(this.scaleArtboardX(1, metrics), this.scaleArtboardY(68, metrics), this.scaleArtboardX(62, metrics), this.scaleArtboardY(14, metrics), this.scaleArtboardY(1, metrics))}" fill="${this.FRAME_FOREGROUND_COLOR}" stroke="${this.FRAME_FOREGROUND_COLOR}" stroke-width="${this.formatMetric(metrics.strokeWidth)}"></path>
                    `,
                    afterQR: commonText(this.scaleArtboardY(75.765, metrics), '#ffffff')
                };
            case this.FRAME_TYPES.BOLD_BORDER:
                return {
                    beforeQR: `
                        <path d="${this.BOLD_BORDER_PATH}" transform="scale(${this.formatMetric(metrics.scale)})" fill="${this.FRAME_FOREGROUND_COLOR}"></path>
                        ${qrBackground}
                    `,
                    afterQR: commonText(this.scaleArtboardY(73.765, metrics), '#ffffff')
                };
            case this.FRAME_TYPES.CENTERED_QR:
                return {
                    beforeQR: `
                        <path d="${this.CENTERED_QR_FRAME_PATH}" transform="scale(${this.formatMetric(metrics.scale)})" fill="${this.FRAME_FOREGROUND_COLOR}"></path>
                        ${qrBackground}
                    `,
                    afterQR: `
                        <path d="${this.CENTERED_QR_RIP_PATH}" transform="scale(${this.formatMetric(metrics.scale)})" fill="${this.FRAME_FOREGROUND_COLOR}"></path>
                        ${commonText(this.scaleArtboardY(68.765, metrics), this.FRAME_FOREGROUND_COLOR)}
                    `
                };
            case this.FRAME_TYPES.BOX_POINTER:
                return {
                    beforeQR: `
                        <path d="M6 1h52a3 3 0 0 1 3 3v52a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V4a3 3 0 0 1 3-3Z" transform="scale(${this.formatMetric(metrics.scale)})" fill="none" stroke="${this.FRAME_FOREGROUND_COLOR}" stroke-width="2"></path>
                        ${interiorBackground}
                        ${qrBackground}
                        <path d="m32.5 61 3.031 5.25H29.47z" transform="scale(${this.formatMetric(metrics.scale)})" fill="${this.FRAME_FOREGROUND_COLOR}"></path>
                        <path d="M4 67h56a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V68a1 1 0 0 1 1-1Z" transform="scale(${this.formatMetric(metrics.scale)})" fill="${this.FRAME_FOREGROUND_COLOR}" stroke="${this.FRAME_FOREGROUND_COLOR}" stroke-width="2"></path>
                    `,
                    afterQR: commonText(this.scaleArtboardY(75.765, metrics), '#ffffff')
                };
            case this.FRAME_TYPES.TOP_BANNER:
                return {
                    beforeQR: `
                        <path d="M4 1h56a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1Z" transform="scale(${this.formatMetric(metrics.scale)})" fill="${this.FRAME_FOREGROUND_COLOR}" stroke="${this.FRAME_FOREGROUND_COLOR}" stroke-width="2"></path>
                        <path d="m32.5 23-3.031-5.25h6.062z" transform="scale(${this.formatMetric(metrics.scale)})" fill="${this.FRAME_FOREGROUND_COLOR}"></path>
                        <path d="M6 25h52a3 3 0 0 1 3 3v52a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V28a3 3 0 0 1 3-3Z" transform="scale(${this.formatMetric(metrics.scale)})" fill="none" stroke="${this.FRAME_FOREGROUND_COLOR}" stroke-width="2"></path>
                        ${interiorBackground}
                        ${qrBackground}
                    `,
                    afterQR: commonText(this.scaleArtboardY(9.765, metrics), '#ffffff')
                };
            case this.FRAME_TYPES.SKETCH_BORDER:
                return {
                    beforeQR: `
                        <path d="M49.392 6.206a.59.59 0 0 1-.478-.243.593.593 0 0 1 .12-.83l4.02-3.013a.57.57 0 0 1 .816.122c.2.263.14.627-.12.829l-4.02 3.013a.54.54 0 0 1-.338.122M22.233 8.674H12.41l-1.134.849a.54.54 0 0 1-.338.121.59.59 0 0 1-.478-.242.58.58 0 0 1-.038-.666.6.6 0 0 0 .356.12c.12 0 .239-.041.338-.122l4.021-3.014a.61.61 0 0 0 .12-.829.59.59 0 0 0-.817-.121l-4.02 3.013a.61.61 0 0 0-.087.87H8.61C7.176 8.653 6 9.826 6 11.303v8.141l-3.881 2.9a.593.593 0 0 0-.12.83.59.59 0 0 0 .478.242c.12.02.239-.02.338-.121l7.066-5.279a.61.61 0 0 0 .12-.829.57.57 0 0 0-.816-.121l-.577.43v-6.193h16.765q.029.096.094.181a.59.59 0 0 0 .477.243c.12 0 .259-.04.338-.121l4.021-3.014a.593.593 0 0 0 .12-.829.59.59 0 0 0-.816-.121l-1.35 1.011h-2.83l-3.205 2.427a.54.54 0 0 1-.338.121.59.59 0 0 1-.478-.242.585.585 0 0 1-.022-.675.6.6 0 0 0 .34.108c.12 0 .24-.04.34-.121l7.065-5.279a.593.593 0 0 0 .12-.829.57.57 0 0 0-.817-.121z" transform="scale(${this.formatMetric(metrics.scale)})" fill="${this.FRAME_FOREGROUND_COLOR}"></path>
                        <path d="M.588 46.431a.59.59 0 0 1-.478-.242.61.61 0 0 1 .12-.83L6 41.031V26.288l1.891-1.415a.593.593 0 0 0-.004-.953.6.6 0 0 1-.135.144l-2.468 1.86a.64.64 0 0 1-.358.122.53.53 0 0 1-.458-.243.593.593 0 0 1 .12-.83L6 23.91v-2.09l2.608-1.942V58.83h46.714V27.522l2.607-1.941v2.308l3.901-2.915a.57.57 0 0 1 .816.12c.2.264.14.628-.12.83l-4.816 3.6a.54.54 0 0 1-.338.121.6.6 0 0 1-.367-.127.59.59 0 0 0 .009.694.59.59 0 0 0 .477.243c.12 0 .24-.04.339-.122l.12-.08v14.481l1.213-.911a.57.57 0 0 1 .816.121c.2.263.14.627-.12.83l-2.746 2.062c-.1.101-.219.121-.338.121a.6.6 0 0 1-.354-.117.585.585 0 0 0 .016.684.59.59 0 0 0 .477.242.54.54 0 0 0 .339-.12l.716-.527v2.25l5.096-3.808a.57.57 0 0 1 .816.122.59.59 0 0 1-.12.829l-7.065 5.279a.54.54 0 0 1-.339.12.6.6 0 0 1-.35-.114.58.58 0 0 0 .031.661.59.59 0 0 0 .478.243c.12 0 .239-.04.338-.121l1.115-.83v15.412l4.479-3.358a.57.57 0 0 1 .816.121.593.593 0 0 1-.12.83l-6.15 4.61a.54.54 0 0 1-.338.122.6.6 0 0 1-.341-.108.585.585 0 0 0 .022.674.59.59 0 0 0 .478.243c.12 0 .238-.04.338-.121l.816-.647v4.59c0 1.477-1.174 2.65-2.607 2.65H53.57l1.254-.95a.593.593 0 0 0-.01-.956.6.6 0 0 1-.149.166l-5.553 4.166a.38.38 0 0 1-.338.121.59.59 0 0 1-.478-.242.593.593 0 0 1 .12-.83l1.966-1.475H33.867l.438-.324a.593.593 0 0 0-.01-.955.6.6 0 0 1-.15.166l-7.065 5.279a.38.38 0 0 1-.339.121.59.59 0 0 1-.477-.242.593.593 0 0 1 .119-.83l4.305-3.215H11.913l1.532-1.133a.593.593 0 0 0-.011-.956.6.6 0 0 1-.147.167L6.22 80.124a.54.54 0 0 1-.339.122.59.59 0 0 1-.477-.243.61.61 0 0 1 .12-.83l3.193-2.385h-.11C7.155 76.788 6 75.595 6 74.138v-8.675l1.414-1.052a.593.593 0 0 0-.01-.957.6.6 0 0 1-.15.168l-2.747 2.063a.54.54 0 0 1-.338.121.59.59 0 0 1-.478-.243.593.593 0 0 1 .12-.829l2.19-1.644V47.584l1.512-1.132a.61.61 0 0 0 .12-.83.6.6 0 0 0-.123-.122.6.6 0 0 1-.156.183l-2.767 2.063a.54.54 0 0 1-.338.121.59.59 0 0 1-.478-.242.593.593 0 0 1 .12-.83l2.11-1.573v-1.804l2.13-1.597a.61.61 0 0 0 .119-.83.6.6 0 0 0-.125-.124.6.6 0 0 1-.134.144L.926 46.31a.54.54 0 0 1-.338.121" transform="scale(${this.formatMetric(metrics.scale)})" fill="${this.FRAME_FOREGROUND_COLOR}"></path>
                        <path d="M53.551 27.845a.59.59 0 0 1-.477-.242.593.593 0 0 1 .12-.83l2.189-1.639V11.303h-5.334l3.543-2.65h1.79c1.454 0 2.608 1.193 2.608 2.65v11.879l1.632-1.222a.57.57 0 0 1 .816.122c.2.262.14.627-.12.829l-6.428 4.813a.54.54 0 0 1-.339.121M2.02 79.154a.59.59 0 0 0 .478.243c.12 0 .24-.02.339-.121l2.766-2.063a.61.61 0 0 0 .12-.83.59.59 0 0 0-.816-.12L2.14 78.324a.593.593 0 0 0-.12.83m45.062-67.285a.59.59 0 0 0 .478.242c.12 0 .239-.02.338-.101l5.852-4.389a.593.593 0 0 0 .12-.829.59.59 0 0 0-.817-.121l-2.655 1.982H30.662c.12.243.04.546-.179.728l-2.588 1.922h19.11a.58.58 0 0 0 .077.565M33.329 6.206a.59.59 0 0 1-.478-.243.593.593 0 0 1 .12-.83l1.353-1.01a.57.57 0 0 1 .816.121c.2.263.14.627-.12.83l-1.353 1.01a.54.54 0 0 1-.338.122m-.736 74.364a.59.59 0 0 0 .478.242c.14 0 .259-.04.338-.122l1.354-1.01a.593.593 0 0 0 .12-.83.59.59 0 0 0-.817-.121l-1.353 1.01a.593.593 0 0 0-.12.83" transform="scale(${this.formatMetric(metrics.scale)})" fill="${this.FRAME_FOREGROUND_COLOR}"></path>
                        ${interiorBackground}
                        ${qrBackground}
                    `,
                    afterQR: commonText(this.scaleArtboardY(67.765, metrics), this.FRAME_FOREGROUND_COLOR)
                };
            case this.FRAME_TYPES.SCRIPT_CARD:
                return {
                    beforeQR: `
                        <rect x="0" y="0" width="${this.formatMetric(metrics.size)}" height="${this.formatMetric(metrics.totalHeight)}" rx="${this.scaleArtboardY(4, metrics)}" fill="${this.getFrameBackgroundFill()}"></rect>
                        ${qrBackground}
                    `,
                    afterQR: customText({
                        y: this.scaleArtboardY(72.7, metrics),
                        color: this.FRAME_FOREGROUND_COLOR,
                        fontSize: this.scaleArtboardY(20, metrics),
                        fontWeight: '400',
                        fontFamily: this.FRAME_FONT_SCRIPT
                    })
                };
            case this.FRAME_TYPES.VIDEO_PANEL:
                return {
                    beforeQR: `
                        <path d="M4 1h56a3 3 0 0 1 3 3v56a3 3 0 0 1-3 3H4a3 3 0 0 1-3-3V4a3 3 0 0 1 3-3Z" transform="scale(${this.formatMetric(metrics.scale)})" fill="none" stroke="${this.FRAME_FOREGROUND_COLOR}" stroke-width="2"></path>
                        ${interiorBackground}
                        ${qrBackground}
                        <path d="M2 67h60a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V68a1 1 0 0 1 1-1" transform="scale(${this.formatMetric(metrics.scale)})" fill="${this.FRAME_FOREGROUND_COLOR}"></path>
                        <path d="M2 67h60a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V68a1 1 0 0 1 1-1Z" transform="scale(${this.formatMetric(metrics.scale)})" stroke="${this.FRAME_FOREGROUND_COLOR}" stroke-width="2"></path>
                    `,
                    afterQR: `
                        <path d="${this.VIDEO_ICON_PATH}" transform="scale(${this.formatMetric(metrics.scale)})" fill="#ffffff"></path>
                        ${customText({
                            x: this.scaleArtboardX(39, metrics),
                            y: this.scaleArtboardY(75.765, metrics),
                            color: '#ffffff',
                            fontSize: this.scaleArtboardY(9, metrics)
                        })}
                    `
                };
            case this.FRAME_TYPES.PHONE_SCREEN:
                return {
                    beforeQR: `
                        <path d="${this.PHONE_FRAME_PATH}" transform="scale(${this.formatMetric(metrics.scale)})" fill="${this.FRAME_FOREGROUND_COLOR}" fill-rule="evenodd"></path>
                        ${qrBackground}
                    `,
                    afterQR: customText({
                        y: this.scaleArtboardY(63.18, metrics),
                        color: this.FRAME_FOREGROUND_COLOR,
                        fontSize: this.scaleArtboardY(8, metrics)
                    })
                };
            case this.FRAME_TYPES.ARROW_NOTE:
                return {
                    beforeQR: `
                        <rect x="0" y="0" width="${this.formatMetric(metrics.size)}" height="${this.formatMetric(metrics.totalHeight)}" rx="${this.scaleArtboardY(4, metrics)}" fill="${this.getFrameBackgroundFill()}"></rect>
                        ${qrBackground}
                    `,
                    afterQR: `
                        <path d="M6.096 77.37s-3.764-5.443-1.203-11.627C6.01 63.022 7.539 61.8 7.539 61.8l-1.478.361-.24-.878s2.939-.379 3.643-.258c-.584 1.292-.859 3.324-.859 3.324l-.842-.086.447-1.809s-2.458 2.326-3.077 5.581c-1.048 5.495 1.255 9.198 1.255 9.198z" transform="scale(${this.formatMetric(metrics.scale)})" fill="${this.FRAME_FOREGROUND_COLOR}"></path>
                        ${customText({
                            x: this.scaleArtboardX(34, metrics),
                            y: this.scaleArtboardY(74.5, metrics),
                            color: this.FRAME_FOREGROUND_COLOR,
                            fontSize: this.scaleArtboardY(18, metrics),
                            fontWeight: '400',
                            fontFamily: this.FRAME_FONT_SCRIPT,
                            rotation: -6.5,
                            rotateX: this.scaleArtboardX(34, metrics),
                            rotateY: this.scaleArtboardY(74.5, metrics)
                        })}
                    `
                };
            case this.FRAME_TYPES.CORNER_ACCENT:
                return {
                    beforeQR: `
                        <rect x="0" y="0" width="${this.formatMetric(metrics.size)}" height="${this.formatMetric(metrics.totalHeight)}" rx="${this.scaleArtboardY(4, metrics)}" fill="${this.getFrameBackgroundFill()}"></rect>
                        <path d="${this.CORNER_ACCENT_PATH_PRIMARY}" transform="scale(${this.formatMetric(metrics.scale)})" fill="${this.getFrameBackgroundFill()}" stroke="${this.FRAME_FOREGROUND_COLOR}" stroke-width="${this.CORNER_ACCENT_STROKE_WIDTH}" stroke-linecap="round" stroke-linejoin="round"></path>
                        <path d="${this.CORNER_ACCENT_PATH_SECONDARY}" transform="scale(${this.formatMetric(metrics.scale)})" fill="${this.getFrameBackgroundFill()}" fill-rule="evenodd" stroke="${this.FRAME_FOREGROUND_COLOR}" stroke-width="${this.CORNER_ACCENT_STROKE_WIDTH}" stroke-linecap="round" stroke-linejoin="round"></path>
                        ${qrBackground}
                    `,
                    afterQR: customText({
                        x: this.scaleArtboardX(37, metrics),
                        y: this.scaleArtboardY(71.68, metrics),
                        color: this.FRAME_FOREGROUND_COLOR,
                        fontSize: this.scaleArtboardY(8, metrics)
                    })
                };
            case this.FRAME_TYPES.BAG_TAG:
                return {
                    beforeQR: `
                        <path d="${this.BAG_FRAME_PATH}" transform="scale(${this.formatMetric(metrics.scale)})" fill="${this.FRAME_FOREGROUND_COLOR}"></path>
                        <path d="${this.BAG_HANDLE_LEFT_PATH}" transform="scale(${this.formatMetric(metrics.scale)})" fill="${this.FRAME_FOREGROUND_COLOR}"></path>
                        <path d="${this.BAG_HANDLE_RIGHT_PATH}" transform="scale(${this.formatMetric(metrics.scale)})" fill="${this.FRAME_FOREGROUND_COLOR}"></path>
                        <path d="${this.BAG_HANDLE_SHADOW_PATH}" transform="scale(${this.formatMetric(metrics.scale)})" fill="#84868E"></path>
                        ${qrBackground}
                    `,
                    afterQR: customText({
                        y: this.scaleArtboardY(73.765, metrics),
                        color: '#ffffff',
                        fontSize: this.scaleArtboardY(9, metrics)
                    })
                };
            case this.FRAME_TYPES.MAILER:
                return {
                    beforeQR: `
                        <rect x="0" y="0" width="${this.formatMetric(metrics.size)}" height="${this.formatMetric(metrics.totalHeight)}" fill="${this.getFrameBackgroundFill()}"></rect>
                        <path d="${this.MAILER_FRAME_BACKGROUND_PATH}" transform="scale(${this.formatMetric(metrics.scale)})" fill="${this.getFrameBackgroundFill()}"></path>
                        <path d="${this.MAILER_FRAME_PATH}" transform="scale(${this.formatMetric(metrics.scale)})" fill="${this.FRAME_FOREGROUND_COLOR}" fill-rule="evenodd" clip-rule="evenodd"></path>
                        <rect x="${this.scaleArtboardX(14, metrics)}" y="${this.scaleArtboardY(9.5, metrics)}" width="${this.scaleArtboardX(36, metrics)}" height="${this.scaleArtboardY(36, metrics)}" rx="${this.scaleArtboardY(2, metrics)}" fill="${this.getQRBackgroundFill()}"></rect>
                    `,
                    afterQR: customText({
                        x: this.scaleArtboardX(32, metrics),
                        y: this.scaleArtboardY(70.68, metrics),
                        color: this.FRAME_FOREGROUND_COLOR,
                        fontSize: this.scaleArtboardY(8, metrics)
                    })
                };
            case this.FRAME_TYPES.DELIVERY_VAN:
                return {
                    beforeQR: `
                        <path d="${this.DELIVERY_VAN_PANEL_PATH}" transform="scale(${this.formatMetric(metrics.scale)})" fill="${this.FRAME_FOREGROUND_COLOR}"></path>
                        <path d="${this.DELIVERY_VAN_BODY_PATH}" transform="scale(${this.formatMetric(metrics.scale)})" fill="${this.FRAME_FOREGROUND_COLOR}"></path>
                        <path d="${this.DELIVERY_VAN_CHASSIS_PATH}" transform="scale(${this.formatMetric(metrics.scale)})" fill="${this.FRAME_FOREGROUND_COLOR}"></path>
                        <path d="${this.DELIVERY_VAN_CAB_PATH}" transform="scale(${this.formatMetric(metrics.scale)})" fill="${this.FRAME_FOREGROUND_COLOR}" fill-opacity="0.5"></path>
                        <path d="${this.DELIVERY_VAN_STRIPE_PATH}" transform="scale(${this.formatMetric(metrics.scale)})" fill="${this.FRAME_FOREGROUND_COLOR}" fill-opacity="0.5"></path>
                        <path d="${this.DELIVERY_VAN_WHEEL_ARCH_PATH}" transform="scale(${this.formatMetric(metrics.scale)})" fill="${this.FRAME_FOREGROUND_COLOR}" fill-opacity="0.5"></path>
                        <rect x="${this.scaleArtboardX(4, metrics)}" y="${this.scaleArtboardY(14, metrics)}" width="${this.scaleArtboardX(26, metrics)}" height="${this.scaleArtboardY(26, metrics)}" rx="${this.scaleArtboardY(2, metrics)}" fill="${this.getQRBackgroundFill()}"></rect>
                    `,
                    afterQR: `
                        <path d="${this.DELIVERY_VAN_WHEEL_LEFT_PATH}" transform="scale(${this.formatMetric(metrics.scale)})" fill="${this.FRAME_FOREGROUND_COLOR}"></path>
                        <path d="${this.DELIVERY_VAN_WHEEL_RIGHT_PATH}" transform="scale(${this.formatMetric(metrics.scale)})" fill="${this.FRAME_FOREGROUND_COLOR}"></path>
                        ${customText({
                            x: this.scaleArtboardX(17, metrics),
                            y: this.scaleArtboardY(47.248, metrics),
                            color: '#ffffff',
                            fontSize: this.scaleArtboardY(5.86, metrics)
                        })}
                    `
                };
            case this.FRAME_TYPES.DISPLAY_STAND:
                return {
                    beforeQR: `
                        ${customText({
                            x: this.scaleArtboardX(33, metrics),
                            y: this.scaleArtboardY(7.68, metrics),
                            color: this.FRAME_FOREGROUND_COLOR,
                            fontSize: this.scaleArtboardY(8, metrics)
                        })}
                        <rect x="${this.scaleArtboardX(14, metrics)}" y="${this.scaleArtboardY(13, metrics)}" width="${this.scaleArtboardX(39, metrics)}" height="${this.scaleArtboardY(39, metrics)}" fill="${this.getFrameBackgroundFill()}"></rect>
                        <rect x="${this.scaleArtboardX(17, metrics)}" y="${this.scaleArtboardY(16, metrics)}" width="${this.scaleArtboardX(33, metrics)}" height="${this.scaleArtboardY(33, metrics)}" rx="${this.scaleArtboardY(2, metrics)}" fill="${this.getQRBackgroundFill()}"></rect>
                        <path d="${this.DISPLAY_STAND_FRAME_PATH}" transform="scale(${this.formatMetric(metrics.scale)})" fill="${this.FRAME_FOREGROUND_COLOR}"></path>
                    `,
                    afterQR: `
                        <path d="${this.DISPLAY_STAND_SHADOW_PATH}" transform="scale(${this.formatMetric(metrics.scale)})" fill="${this.FRAME_FOREGROUND_COLOR}"></path>
                        <path d="${this.DISPLAY_STAND_SHADOW_PATH}" transform="scale(${this.formatMetric(metrics.scale)})" fill="#ffffff" fill-opacity="0.5"></path>
                        <path d="${this.DISPLAY_STAND_BASE_PATH}" transform="scale(${this.formatMetric(metrics.scale)})" fill="${this.FRAME_FOREGROUND_COLOR}"></path>
                        <path d="${this.DISPLAY_STAND_SUPPORT_PATH}" transform="scale(${this.formatMetric(metrics.scale)})" fill="${this.FRAME_FOREGROUND_COLOR}"></path>
                        <path d="${this.DISPLAY_STAND_SIDE_SHADOW_PATH}" transform="scale(${this.formatMetric(metrics.scale)})" fill="${this.FRAME_FOREGROUND_COLOR}" fill-opacity="0.5"></path>
                    `
                };
            case this.FRAME_TYPES.SIDEBAR_CARD:
                return {
                    beforeQR: `
                        <path d="${this.SIDEBAR_CARD_BACKGROUND_LEFT_PATH}" transform="scale(${this.formatMetric(metrics.scale)})" fill="${this.getFrameBackgroundFill()}"></path>
                        <path d="${this.SIDEBAR_CARD_BACKGROUND_TOP_PATH}" transform="scale(${this.formatMetric(metrics.scale)})" fill="${this.getFrameBackgroundFill()}"></path>
                        <path d="${this.SIDEBAR_CARD_FRAME_PATH}" transform="scale(${this.formatMetric(metrics.scale)})" fill="${this.FRAME_FOREGROUND_COLOR}" fill-rule="evenodd" clip-rule="evenodd"></path>
                        <rect x="${this.scaleArtboardX(24, metrics)}" y="${this.scaleArtboardY(27, metrics)}" width="${this.scaleArtboardX(31, metrics)}" height="${this.scaleArtboardY(31, metrics)}" rx="${this.scaleArtboardY(2, metrics)}" fill="${this.getQRBackgroundFill()}"></rect>
                    `,
                    afterQR: customText({
                        x: this.scaleArtboardX(39.5, metrics),
                        y: this.scaleArtboardY(65.595, metrics),
                        color: '#ffffff',
                        fontSize: this.scaleArtboardY(7, metrics)
                    })
                };
            case this.FRAME_TYPES.CLIPBOARD:
                return {
                    beforeQR: `
                        <rect x="${this.scaleArtboardX(3, metrics)}" y="${this.scaleArtboardY(13, metrics)}" width="${this.scaleArtboardX(57, metrics)}" height="${this.scaleArtboardY(56, metrics)}" fill="${this.getFrameBackgroundFill()}"></rect>
                        <path d="${this.CLIPBOARD_FRAME_PATH}" transform="scale(${this.formatMetric(metrics.scale)})" fill="${this.FRAME_FOREGROUND_COLOR}" fill-rule="evenodd" clip-rule="evenodd"></path>
                        <path d="${this.CLIPBOARD_CLIP_PATH}" transform="scale(${this.formatMetric(metrics.scale)})" fill="${this.FRAME_FOREGROUND_COLOR}" fill-rule="evenodd" clip-rule="evenodd"></path>
                        <path d="${this.CLIPBOARD_CLIP_PATH}" transform="scale(${this.formatMetric(metrics.scale)})" fill="#ffffff" fill-opacity="0.5" fill-rule="evenodd" clip-rule="evenodd"></path>
                        <rect x="${this.scaleArtboardX(8, metrics)}" y="${this.scaleArtboardY(17, metrics)}" width="${this.scaleArtboardX(48, metrics)}" height="${this.scaleArtboardY(48, metrics)}" rx="${this.scaleArtboardY(2, metrics)}" fill="${this.getQRBackgroundFill()}"></rect>
                    `,
                    afterQR: customText({
                        x: this.scaleArtboardX(32, metrics),
                        y: this.scaleArtboardY(75.18, metrics),
                        color: '#ffffff',
                        fontSize: this.scaleArtboardY(8, metrics)
                    })
                };
            case this.FRAME_TYPES.NOTEBOOK:
                return {
                    beforeQR: `
                        <rect x="${this.scaleArtboardX(8, metrics)}" y="${this.scaleArtboardY(14, metrics)}" width="${this.scaleArtboardX(51, metrics)}" height="${this.scaleArtboardY(52, metrics)}" fill="${this.getFrameBackgroundFill()}"></rect>
                        <path d="${this.NOTEBOOK_TOP_SHADOW_PATH}" transform="scale(${this.formatMetric(metrics.scale)})" fill="${this.FRAME_FOREGROUND_COLOR}" fill-opacity="0.5"></path>
                        <path d="${this.NOTEBOOK_FRAME_PATH}" transform="scale(${this.formatMetric(metrics.scale)})" fill="${this.FRAME_FOREGROUND_COLOR}" fill-rule="evenodd" clip-rule="evenodd"></path>
                        <path d="${this.NOTEBOOK_TABS_PATH}" transform="scale(${this.formatMetric(metrics.scale)})" fill="${this.FRAME_FOREGROUND_COLOR}"></path>
                        <path d="${this.NOTEBOOK_TABS_PATH}" transform="scale(${this.formatMetric(metrics.scale)})" fill="#ffffff" fill-opacity="0.5"></path>
                        <rect x="${this.scaleArtboardX(13.5, metrics)}" y="${this.scaleArtboardY(18.5, metrics)}" width="${this.scaleArtboardX(42, metrics)}" height="${this.scaleArtboardY(42, metrics)}" rx="${this.scaleArtboardY(2, metrics)}" fill="${this.getQRBackgroundFill()}"></rect>
                    `,
                    afterQR: customText({
                        x: this.scaleArtboardX(34, metrics),
                        y: this.scaleArtboardY(73.18, metrics),
                        color: '#ffffff',
                        fontSize: this.scaleArtboardY(8, metrics)
                    })
                };
            case this.FRAME_TYPES.FOLDED_BANNER:
                return {
                    beforeQR: `
                        <rect x="0" y="0" width="${this.formatMetric(metrics.size)}" height="${this.formatMetric(metrics.totalHeight)}" fill="${this.getFrameBackgroundFill()}"></rect>
                        <path d="${this.FOLDED_BANNER_BACKGROUND_PATH}" transform="scale(${this.formatMetric(metrics.scale)})" fill="${this.getFrameBackgroundFill()}"></path>
                        <path d="${this.FOLDED_BANNER_BODY_PATH}" transform="scale(${this.formatMetric(metrics.scale)})" fill="${this.FRAME_FOREGROUND_COLOR}" fill-rule="evenodd" clip-rule="evenodd"></path>
                        <rect x="${this.scaleArtboardX(16, metrics)}" y="${this.scaleArtboardY(35.5, metrics)}" width="${this.scaleArtboardX(32, metrics)}" height="${this.scaleArtboardY(32, metrics)}" rx="${this.scaleArtboardY(2, metrics)}" fill="#E6E7ED"></rect>
                    `,
                    afterQR: customText({
                        x: this.scaleArtboardX(32, metrics),
                        y: this.scaleArtboardY(75.51, metrics),
                        color: '#ffffff',
                        fontSize: this.scaleArtboardY(6, metrics)
                    })
                };
            case this.FRAME_TYPES.RIBBON:
                return {
                    beforeQR: `
                        <path d="${this.RIBBON_FRAME_PATH}" transform="scale(${this.formatMetric(metrics.scale)})" fill="${this.FRAME_FOREGROUND_COLOR}"></path>
                        <path d="${this.RIBBON_LEFT_PATH}" transform="scale(${this.formatMetric(metrics.scale)})" fill="#84868E"></path>
                        <path d="${this.RIBBON_RIGHT_PATH}" transform="scale(${this.formatMetric(metrics.scale)})" fill="#84868E"></path>
                        <path d="${this.RIBBON_LEFT_SHADOW_PATH}" transform="scale(${this.formatMetric(metrics.scale)})" fill="#5A5C66"></path>
                        <path d="${this.RIBBON_RIGHT_SHADOW_PATH}" transform="scale(${this.formatMetric(metrics.scale)})" fill="#5A5C66"></path>
                        <path d="${this.RIBBON_MIDDLE_PATH}" transform="scale(${this.formatMetric(metrics.scale)})" fill="${this.FRAME_FOREGROUND_COLOR}"></path>
                        <rect x="${this.scaleArtboardX(14, metrics)}" y="${this.scaleArtboardY(19, metrics)}" width="${this.scaleArtboardX(36, metrics)}" height="${this.scaleArtboardY(36, metrics)}" rx="${this.scaleArtboardY(2, metrics)}" fill="#E6E7ED"></rect>
                    `,
                    afterQR: customText({
                        y: this.scaleArtboardY(64.345, metrics),
                        color: '#ffffff',
                        fontSize: this.scaleArtboardY(7, metrics)
                    })
                };
            case this.FRAME_TYPES.GIFT_BOW:
                return {
                    beforeQR: `
                        <path d="${this.GIFT_FRAME_PATH}" transform="scale(${this.formatMetric(metrics.scale)})" fill="${this.FRAME_FOREGROUND_COLOR}"></path>
                        <path d="${this.GIFT_TEXT_CONTAINER_PATH}" transform="scale(${this.formatMetric(metrics.scale)})" fill="${this.FRAME_FOREGROUND_COLOR}"></path>
                        ${qrBackground}
                        <path d="${this.BOW_SHADOW_PATH}" transform="scale(${this.formatMetric(metrics.scale)})" fill="#84868E"></path>
                        <path d="${this.BOW_LEFT_RIBBON_PATH}" transform="scale(${this.formatMetric(metrics.scale)})" fill="#84868E"></path>
                        <path d="${this.BOW_RIGHT_RIBBON_PATH}" transform="scale(${this.formatMetric(metrics.scale)})" fill="#84868E"></path>
                        <path d="${this.BOW_LEFT_SOLID_PATH}" transform="scale(${this.formatMetric(metrics.scale)})" fill="${this.FRAME_FOREGROUND_COLOR}"></path>
                        <path d="${this.BOW_RIGHT_SOLID_PATH}" transform="scale(${this.formatMetric(metrics.scale)})" fill="${this.FRAME_FOREGROUND_COLOR}"></path>
                        <path d="${this.BOW_LEFT_SHADOW_PATH}" transform="scale(${this.formatMetric(metrics.scale)})" fill="#84868E"></path>
                        <path d="${this.BOW_RIGHT_SHADOW_PATH}" transform="scale(${this.formatMetric(metrics.scale)})" fill="#84868E"></path>
                        <path d="${this.BOW_KNOT_PATH}" transform="scale(${this.formatMetric(metrics.scale)})" fill="#84868E"></path>
                    `,
                    afterQR: customText({
                        y: this.scaleArtboardY(76.345, metrics),
                        color: '#ffffff',
                        fontSize: this.scaleArtboardY(7, metrics)
                    })
                };
            default:
                return {
                    beforeQR: qrBackground,
                    afterQR: ''
                };
        }
    },

    /**
     * Apply frame to QR code canvas
     * @param {HTMLCanvasElement} canvas - The QR code canvas
     * @param {string} frameType - Type of frame to apply
     * @param {number} targetSize - Target size for the final canvas
     * @returns {HTMLCanvasElement} - New canvas with frame applied
     */
    applyFrame(canvas, frameType, targetSize = 300) {
        if (!frameType) {
            return canvas;
        }

        return this.withFrameCustomization(frameType, () => this.applyFrameWithActiveCustomization(canvas, frameType, targetSize));
    },

    applyFrameWithActiveCustomization(canvas, frameType, targetSize = 300) {
        if (!frameType) {
            return canvas;
        }

        if (frameType === this.FRAME_TYPES.CUSTOM) {
            if (!this.hasCustomFrame()) {
                return canvas;
            }
            const sourceCanvas = this.getSquareQRSourceCanvas(canvas);
            const metrics = this.getCustomFrameMetrics(targetSize);
            const framedCanvas = document.createElement('canvas');
            framedCanvas.width = metrics.size;
            framedCanvas.height = metrics.totalHeight;
            const ctx = framedCanvas.getContext('2d');
            this.drawCustomFrame(ctx, sourceCanvas, metrics);
            return framedCanvas;
        }

        const sourceCanvas = this.getSquareQRSourceCanvas(canvas);

        const metrics = this.getFrameMetrics(frameType, targetSize);

        // Create new canvas with frame
        const framedCanvas = document.createElement('canvas');
        framedCanvas.width = targetSize;
        framedCanvas.height = metrics.totalHeight;
        const ctx = framedCanvas.getContext('2d');

        if (this.isDecorativeFrame(frameType)) {
            this.drawDecorativeFrame(ctx, sourceCanvas, frameType, metrics);
            return framedCanvas;
        }

        // Draw QR code at top
        if (frameType === this.FRAME_TYPES.SCAN_ME_BORDER) {
            ctx.fillStyle = this.getFrameBackgroundFill();
            this.roundRect(
                ctx,
                metrics.borderWidth / 2,
                metrics.borderWidth / 2,
                metrics.size - metrics.borderWidth,
                metrics.totalHeight - metrics.borderWidth,
                metrics.borderRadius
            );
            ctx.fill();

            const qrBounds = metrics.qrBounds;
            ctx.drawImage(sourceCanvas, qrBounds.x, qrBounds.y, qrBounds.width ?? qrBounds.size, qrBounds.height ?? qrBounds.size);
        } else {
            if (!this.TRANSPARENT_BACKGROUND) {
                ctx.fillStyle = this.getQRBackgroundFill();
                ctx.fillRect(0, 0, targetSize, metrics.size);
                if (frameType === this.FRAME_TYPES.NONE && metrics.totalHeight > metrics.size) {
                    ctx.fillRect(0, metrics.size, targetSize, metrics.totalHeight - metrics.size);
                }
            }
            const qrBounds = metrics.qrBounds;
            ctx.drawImage(sourceCanvas, qrBounds.x, qrBounds.y, qrBounds.width ?? qrBounds.size, qrBounds.height ?? qrBounds.size);
        }

        // Apply frame based on type
        if (frameType === this.FRAME_TYPES.SCAN_ME) {
            this.drawScanMeFrame(ctx, metrics);
        } else if (frameType === this.FRAME_TYPES.SCAN_ME_BORDER) {
            this.drawScanMeBorderFrame(ctx, metrics);
        }

        return framedCanvas;
    },

    drawDecorativeFrame(ctx, canvas, frameType, metrics) {
        // Only filled shell-style frames need their outer art drawn before the QR background and QR modules.
        if (frameType === this.FRAME_TYPES.BOLD_BORDER) {
            this.drawBoldBorderShell(ctx, metrics);
        } else if (frameType === this.FRAME_TYPES.CENTERED_QR) {
            this.drawCenteredQRFrame(ctx, metrics, this.RENDER_PHASES.BEFORE);
        } else if (frameType === this.FRAME_TYPES.SCRIPT_CARD) {
            this.drawScriptCardFrame(ctx, metrics, this.RENDER_PHASES.BEFORE);
        } else if (frameType === this.FRAME_TYPES.PHONE_SCREEN) {
            this.drawPhoneScreenFrame(ctx, metrics, this.RENDER_PHASES.BEFORE);
        } else if (frameType === this.FRAME_TYPES.ARROW_NOTE) {
            this.drawArrowNoteFrame(ctx, metrics, this.RENDER_PHASES.BEFORE);
        } else if (frameType === this.FRAME_TYPES.CORNER_ACCENT) {
            this.drawCornerAccentFrame(ctx, metrics, this.RENDER_PHASES.BEFORE);
        } else if (frameType === this.FRAME_TYPES.BAG_TAG) {
            this.drawBagTagFrame(ctx, metrics, this.RENDER_PHASES.BEFORE);
        } else if (frameType === this.FRAME_TYPES.MAILER) {
            this.drawMailerFrame(ctx, metrics, this.RENDER_PHASES.BEFORE);
        } else if (frameType === this.FRAME_TYPES.DELIVERY_VAN) {
            this.drawDeliveryVanFrame(ctx, metrics, this.RENDER_PHASES.BEFORE);
        } else if (frameType === this.FRAME_TYPES.DISPLAY_STAND) {
            this.drawDisplayStandFrame(ctx, metrics, this.RENDER_PHASES.BEFORE);
        } else if (frameType === this.FRAME_TYPES.SIDEBAR_CARD) {
            this.drawSidebarCardFrame(ctx, metrics, this.RENDER_PHASES.BEFORE);
        } else if (frameType === this.FRAME_TYPES.CLIPBOARD) {
            this.drawClipboardFrame(ctx, metrics, this.RENDER_PHASES.BEFORE);
        } else if (frameType === this.FRAME_TYPES.NOTEBOOK) {
            this.drawNotebookFrame(ctx, metrics, this.RENDER_PHASES.BEFORE);
        } else if (frameType === this.FRAME_TYPES.FOLDED_BANNER) {
            this.drawFoldedBannerFrame(ctx, metrics, this.RENDER_PHASES.BEFORE);
        } else if (frameType === this.FRAME_TYPES.RIBBON) {
            this.drawRibbonFrame(ctx, metrics, this.RENDER_PHASES.BEFORE);
        } else if (frameType === this.FRAME_TYPES.GIFT_BOW) {
            this.drawGiftBowFrame(ctx, metrics, this.RENDER_PHASES.BEFORE);
        }

        if (metrics.interiorBackground) {
            ctx.fillStyle = this.getFrameBackgroundFill();
            this.roundRect(
                ctx,
                metrics.interiorBackground.x,
                metrics.interiorBackground.y,
                metrics.interiorBackground.width,
                metrics.interiorBackground.height,
                metrics.interiorBackground.radius
            );
            ctx.fill();
        }

        if (metrics.qrBackground) {
            ctx.fillStyle = this.getQRBackgroundFill();
            this.roundRect(
                ctx,
                metrics.qrBackground.x,
                metrics.qrBackground.y,
                metrics.qrBackground.width,
                metrics.qrBackground.height,
                metrics.qrBackground.radius
            );
            ctx.fill();
        }

        if (metrics.qrBounds) {
            ctx.drawImage(
                canvas,
                metrics.qrBounds.x,
                metrics.qrBounds.y,
                metrics.qrBounds.width ?? metrics.qrBounds.size,
                metrics.qrBounds.height ?? metrics.qrBounds.size
            );
        }

        switch (frameType) {
            case this.FRAME_TYPES.ROUNDED_BANNER:
                this.drawRoundedBannerFrame(ctx, metrics);
                break;
            case this.FRAME_TYPES.OUTLINED_LABEL:
                this.drawOutlinedLabelFrame(ctx, metrics);
                break;
            case this.FRAME_TYPES.FOOTER_PANEL:
                this.drawFooterPanelFrame(ctx, metrics);
                break;
            case this.FRAME_TYPES.CENTER_BADGE:
                this.drawCenterBadgeFrame(ctx, metrics);
                break;
            case this.FRAME_TYPES.POINTER_PANEL:
                this.drawPointerPanelFrame(ctx, metrics);
                break;
            case this.FRAME_TYPES.BOLD_BORDER:
                this.drawBoldBorderLabel(ctx, metrics);
                break;
            case this.FRAME_TYPES.CENTERED_QR:
                this.drawCenteredQRFrame(ctx, metrics, this.RENDER_PHASES.AFTER);
                break;
            case this.FRAME_TYPES.BOX_POINTER:
                this.drawBoxPointerFrame(ctx, metrics);
                break;
            case this.FRAME_TYPES.TOP_BANNER:
                this.drawTopBannerFrame(ctx, metrics);
                break;
            case this.FRAME_TYPES.SKETCH_BORDER:
                this.drawSketchBorderFrame(ctx, metrics);
                break;
            case this.FRAME_TYPES.SCRIPT_CARD:
                this.drawScriptCardFrame(ctx, metrics);
                break;
            case this.FRAME_TYPES.VIDEO_PANEL:
                this.drawVideoPanelFrame(ctx, metrics);
                break;
            case this.FRAME_TYPES.PHONE_SCREEN:
                this.drawPhoneScreenFrame(ctx, metrics, this.RENDER_PHASES.AFTER);
                break;
            case this.FRAME_TYPES.ARROW_NOTE:
                this.drawArrowNoteFrame(ctx, metrics);
                break;
            case this.FRAME_TYPES.CORNER_ACCENT:
                this.drawCornerAccentFrame(ctx, metrics, this.RENDER_PHASES.AFTER);
                break;
            case this.FRAME_TYPES.BAG_TAG:
                this.drawBagTagFrame(ctx, metrics, this.RENDER_PHASES.AFTER);
                break;
            case this.FRAME_TYPES.MAILER:
                this.drawMailerFrame(ctx, metrics, this.RENDER_PHASES.AFTER);
                break;
            case this.FRAME_TYPES.DELIVERY_VAN:
                this.drawDeliveryVanFrame(ctx, metrics, this.RENDER_PHASES.AFTER);
                break;
            case this.FRAME_TYPES.DISPLAY_STAND:
                this.drawDisplayStandFrame(ctx, metrics, this.RENDER_PHASES.AFTER);
                break;
            case this.FRAME_TYPES.SIDEBAR_CARD:
                this.drawSidebarCardFrame(ctx, metrics, this.RENDER_PHASES.AFTER);
                break;
            case this.FRAME_TYPES.CLIPBOARD:
                this.drawClipboardFrame(ctx, metrics, this.RENDER_PHASES.AFTER);
                break;
            case this.FRAME_TYPES.NOTEBOOK:
                this.drawNotebookFrame(ctx, metrics, this.RENDER_PHASES.AFTER);
                break;
            case this.FRAME_TYPES.FOLDED_BANNER:
                this.drawFoldedBannerFrame(ctx, metrics, this.RENDER_PHASES.AFTER);
                break;
            case this.FRAME_TYPES.RIBBON:
                this.drawRibbonFrame(ctx, metrics, this.RENDER_PHASES.AFTER);
                break;
            case this.FRAME_TYPES.GIFT_BOW:
                this.drawGiftBowFrame(ctx, metrics, this.RENDER_PHASES.AFTER);
                break;
        }
    },

    getSquareQRSourceCanvas(canvas) {
        if (!canvas || canvas.width === canvas.height) {
            return canvas;
        }

        const size = Math.min(canvas.width, canvas.height);
        const normalizedCanvas = document.createElement('canvas');
        normalizedCanvas.width = size;
        normalizedCanvas.height = size;

        const context = normalizedCanvas.getContext('2d');
        context.drawImage(canvas, 0, 0, size, size, 0, 0, size, size);

        return normalizedCanvas;
    },

    /**
     * Draw "Scan me!" text frame (no border)
     */
    drawScanMeFrame(ctx, metrics) {
        ctx.fillStyle = this.getFrameBackgroundFill();
        ctx.fillRect(0, metrics.size, metrics.size, metrics.textHeight);

        ctx.fillStyle = this.getLabelColor(this.FRAME_FOREGROUND_COLOR);
        ctx.font = `700 ${metrics.fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.getResolvedFrameText(), metrics.size / 2, metrics.textY);
    },

    /**
     * Draw "Scan me!" text frame with border
     */
    drawScanMeBorderFrame(ctx, metrics) {
        ctx.fillRect(
            metrics.borderWidth / 2,
            metrics.size,
            metrics.size - metrics.borderWidth,
            metrics.textHeight - (metrics.borderWidth / 2)
        );

        // Draw outer border with rounded corners
        ctx.strokeStyle = this.FRAME_FOREGROUND_COLOR;
        ctx.lineWidth = metrics.borderWidth;
        this.roundRect(
            ctx,
            metrics.borderWidth / 2,
            metrics.borderWidth / 2,
            metrics.size - metrics.borderWidth,
            metrics.totalHeight - metrics.borderWidth,
            metrics.borderRadius
        );
        ctx.stroke();

        // Draw horizontal line separating QR from text
        ctx.beginPath();
        ctx.lineWidth = metrics.separatorWidth;
        ctx.moveTo(metrics.borderWidth / 2, metrics.size);
        ctx.lineTo(metrics.size - (metrics.borderWidth / 2), metrics.size);
        ctx.stroke();

        // Draw "Scan me!" text
        ctx.fillStyle = this.getLabelColor(this.FRAME_FOREGROUND_COLOR);
        ctx.font = `700 ${metrics.fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.getResolvedFrameText(), metrics.size / 2, metrics.textY);
    },

    drawRoundedBannerFrame(ctx, metrics) {
        ctx.strokeStyle = this.FRAME_FOREGROUND_COLOR;
        ctx.lineWidth = metrics.strokeWidth;
        this.roundRect(
            ctx,
            this.scaleArtboardX(1, metrics),
            this.scaleArtboardY(1, metrics),
            this.scaleArtboardX(62, metrics),
            this.scaleArtboardY(62, metrics),
            metrics.outerRadius
        );
        ctx.stroke();

        ctx.fillStyle = this.FRAME_FOREGROUND_COLOR;
        this.roundRect(
            ctx,
            this.scaleArtboardX(1, metrics),
            this.scaleArtboardY(67, metrics),
            this.scaleArtboardX(62, metrics),
            this.scaleArtboardY(16, metrics),
            this.scaleArtboardY(1, metrics)
        );
        ctx.fill();
        ctx.stroke();

        this.drawFrameLabel(ctx, metrics, this.scaleArtboardY(75.765, metrics), '#ffffff');
    },

    drawOutlinedLabelFrame(ctx, metrics) {
        ctx.strokeStyle = this.FRAME_FOREGROUND_COLOR;
        ctx.lineWidth = metrics.strokeWidth;
        this.roundRect(
            ctx,
            this.scaleArtboardX(1, metrics),
            this.scaleArtboardY(1, metrics),
            this.scaleArtboardX(62, metrics),
            this.scaleArtboardY(82, metrics),
            metrics.outerRadius
        );
        ctx.stroke();

        this.drawFrameLabel(ctx, metrics, this.scaleArtboardY(73.765, metrics), this.FRAME_FOREGROUND_COLOR);
    },

    drawFooterPanelFrame(ctx, metrics) {
        ctx.strokeStyle = this.FRAME_FOREGROUND_COLOR;
        ctx.lineWidth = metrics.strokeWidth;
        this.topRoundedRect(
            ctx,
            this.scaleArtboardX(1, metrics),
            this.scaleArtboardY(1, metrics),
            this.scaleArtboardX(62, metrics),
            this.scaleArtboardY(62, metrics),
            metrics.outerRadius
        );
        ctx.stroke();

        ctx.fillStyle = this.FRAME_FOREGROUND_COLOR;
        this.bottomRoundedRect(
            ctx,
            this.scaleArtboardX(1, metrics),
            this.scaleArtboardY(63, metrics),
            this.scaleArtboardX(62, metrics),
            this.scaleArtboardY(20, metrics),
            metrics.outerRadius
        );
        ctx.fill();
        ctx.stroke();

        this.drawFrameLabel(ctx, metrics, this.scaleArtboardY(73.765, metrics), '#ffffff');
    },

    drawCenterBadgeFrame(ctx, metrics) {
        ctx.strokeStyle = this.FRAME_FOREGROUND_COLOR;
        ctx.lineWidth = metrics.strokeWidth;
        ctx.fillStyle = this.FRAME_FOREGROUND_COLOR;
        this.roundRect(
            ctx,
            this.scaleArtboardX(7, metrics),
            this.scaleArtboardY(63, metrics),
            this.scaleArtboardX(50, metrics),
            this.scaleArtboardY(16, metrics),
            this.scaleArtboardY(1, metrics)
        );
        ctx.fill();
        ctx.stroke();

        this.drawFrameLabel(ctx, metrics, this.scaleArtboardY(71.765, metrics), '#ffffff');
    },

    drawPointerPanelFrame(ctx, metrics) {
        ctx.strokeStyle = this.FRAME_FOREGROUND_COLOR;
        ctx.lineWidth = metrics.strokeWidth;
        this.roundRect(
            ctx,
            this.scaleArtboardX(1, metrics),
            this.scaleArtboardY(1, metrics),
            this.scaleArtboardX(62, metrics),
            this.scaleArtboardY(58, metrics),
            metrics.outerRadius
        );
        ctx.stroke();

        const trianglePoints = this.getPointerPanelTriangleCoordinates(metrics);
        ctx.beginPath();
        ctx.moveTo(trianglePoints.tip.x, trianglePoints.tip.y);
        ctx.lineTo(trianglePoints.right.x, trianglePoints.right.y);
        ctx.lineTo(trianglePoints.left.x, trianglePoints.left.y);
        ctx.closePath();
        ctx.fillStyle = this.FRAME_FOREGROUND_COLOR;
        ctx.fill();

        this.bottomRoundedRect(
            ctx,
            this.scaleArtboardX(1, metrics),
            this.scaleArtboardY(68, metrics),
            this.scaleArtboardX(62, metrics),
            this.scaleArtboardY(14, metrics),
            this.scaleArtboardY(1, metrics)
        );
        ctx.fillStyle = this.FRAME_FOREGROUND_COLOR;
        ctx.fill();
        ctx.stroke();

        this.drawFrameLabel(ctx, metrics, this.scaleArtboardY(75.765, metrics), '#ffffff');
    },

    drawBoldBorderShell(ctx, metrics) {
        this.drawArtboardPath(ctx, metrics, this.BOLD_BORDER_PATH, {
            fill: this.FRAME_FOREGROUND_COLOR
        });
    },

    drawBoldBorderLabel(ctx, metrics) {
        this.drawFrameLabel(ctx, metrics, this.scaleArtboardY(73.765, metrics), '#ffffff');
    },

    drawCenteredQRFrame(ctx, metrics, phase = this.RENDER_PHASES.AFTER) {
        if (phase === this.RENDER_PHASES.BEFORE) {
            this.drawArtboardPath(ctx, metrics, this.CENTERED_QR_FRAME_PATH, {
                fill: this.FRAME_FOREGROUND_COLOR
            });
            return;
        }

        this.drawArtboardPath(ctx, metrics, this.CENTERED_QR_RIP_PATH, {
            fill: this.FRAME_FOREGROUND_COLOR
        });
        this.drawFrameLabel(ctx, metrics, this.scaleArtboardY(68.765, metrics), this.FRAME_FOREGROUND_COLOR);
    },

    drawBoxPointerFrame(ctx, metrics) {
        this.drawArtboardPath(ctx, metrics, 'M6 1h52a3 3 0 0 1 3 3v52a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V4a3 3 0 0 1 3-3Z', {
            stroke: this.FRAME_FOREGROUND_COLOR,
            lineWidth: 2
        });
        this.drawArtboardPath(ctx, metrics, 'm32.5 61 3.031 5.25H29.47z', {
            fill: this.FRAME_FOREGROUND_COLOR
        });
        this.drawArtboardPath(ctx, metrics, 'M4 67h56a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V68a1 1 0 0 1 1-1Z', {
            fill: this.FRAME_FOREGROUND_COLOR,
            stroke: this.FRAME_FOREGROUND_COLOR,
            lineWidth: 2
        });
        this.drawFrameLabel(ctx, metrics, this.scaleArtboardY(75.765, metrics), '#ffffff');
    },

    drawTopBannerFrame(ctx, metrics) {
        this.drawArtboardPath(ctx, metrics, 'M4 1h56a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1Z', {
            fill: this.FRAME_FOREGROUND_COLOR,
            stroke: this.FRAME_FOREGROUND_COLOR,
            lineWidth: 2
        });
        this.drawArtboardPath(ctx, metrics, 'm32.5 23-3.031-5.25h6.062z', {
            fill: this.FRAME_FOREGROUND_COLOR
        });
        this.drawArtboardPath(ctx, metrics, 'M6 25h52a3 3 0 0 1 3 3v52a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V28a3 3 0 0 1 3-3Z', {
            stroke: this.FRAME_FOREGROUND_COLOR,
            lineWidth: 2
        });
        this.drawFrameLabel(ctx, metrics, this.scaleArtboardY(9.765, metrics), '#ffffff');
    },

    drawSketchBorderFrame(ctx, metrics) {
        this.drawArtboardPath(ctx, metrics, 'M49.392 6.206a.59.59 0 0 1-.478-.243.593.593 0 0 1 .12-.83l4.02-3.013a.57.57 0 0 1 .816.122c.2.263.14.627-.12.829l-4.02 3.013a.54.54 0 0 1-.338.122M22.233 8.674H12.41l-1.134.849a.54.54 0 0 1-.338.121.59.59 0 0 1-.478-.242.58.58 0 0 1-.038-.666.6.6 0 0 0 .356.12c.12 0 .239-.041.338-.122l4.021-3.014a.61.61 0 0 0 .12-.829.59.59 0 0 0-.817-.121l-4.02 3.013a.61.61 0 0 0-.087.87H8.61C7.176 8.653 6 9.826 6 11.303v8.141l-3.881 2.9a.593.593 0 0 0-.12.83.59.59 0 0 0 .478.242c.12.02.239-.02.338-.121l7.066-5.279a.61.61 0 0 0 .12-.829.57.57 0 0 0-.816-.121l-.577.43v-6.193h16.765q.029.096.094.181a.59.59 0 0 0 .477.243c.12 0 .259-.04.338-.121l4.021-3.014a.593.593 0 0 0 .12-.829.59.59 0 0 0-.816-.121l-1.35 1.011h-2.83l-3.205 2.427a.54.54 0 0 1-.338.121.59.59 0 0 1-.478-.242.585.585 0 0 1-.022-.675.6.6 0 0 0 .34.108c.12 0 .24-.04.34-.121l7.065-5.279a.593.593 0 0 0 .12-.829.57.57 0 0 0-.817-.121z', {
            fill: this.FRAME_FOREGROUND_COLOR
        });
        this.drawArtboardPath(ctx, metrics, 'M.588 46.431a.59.59 0 0 1-.478-.242.61.61 0 0 1 .12-.83L6 41.031V26.288l1.891-1.415a.593.593 0 0 0-.004-.953.6.6 0 0 1-.135.144l-2.468 1.86a.64.64 0 0 1-.358.122.53.53 0 0 1-.458-.243.593.593 0 0 1 .12-.83L6 23.91v-2.09l2.608-1.942V58.83h46.714V27.522l2.607-1.941v2.308l3.901-2.915a.57.57 0 0 1 .816.12c.2.264.14.628-.12.83l-4.816 3.6a.54.54 0 0 1-.338.121.6.6 0 0 1-.367-.127.59.59 0 0 0 .009.694.59.59 0 0 0 .477.243c.12 0 .24-.04.339-.122l.12-.08v14.481l1.213-.911a.57.57 0 0 1 .816.121c.2.263.14.627-.12.83l-2.746 2.062c-.1.101-.219.121-.338.121a.6.6 0 0 1-.354-.117.585.585 0 0 0 .016.684.59.59 0 0 0 .477.242.54.54 0 0 0 .339-.12l.716-.527v2.25l5.096-3.808a.57.57 0 0 1 .816.122.59.59 0 0 1-.12.829l-7.065 5.279a.54.54 0 0 1-.339.12.6.6 0 0 1-.35-.114.58.58 0 0 0 .031.661.59.59 0 0 0 .478.243c.12 0 .239-.04.338-.121l1.115-.83v15.412l4.479-3.358a.57.57 0 0 1 .816.121.593.593 0 0 1-.12.83l-6.15 4.61a.54.54 0 0 1-.338.122.6.6 0 0 1-.341-.108.585.585 0 0 0 .022.674.59.59 0 0 0 .478.243c.12 0 .238-.04.338-.121l.816-.647v4.59c0 1.477-1.174 2.65-2.607 2.65H53.57l1.254-.95a.593.593 0 0 0-.01-.956.6.6 0 0 1-.149.166l-5.553 4.166a.38.38 0 0 1-.338.121.59.59 0 0 1-.478-.242.593.593 0 0 1 .12-.83l1.966-1.475H33.867l.438-.324a.593.593 0 0 0-.01-.955.6.6 0 0 1-.15.166l-7.065 5.279a.38.38 0 0 1-.339.121.59.59 0 0 1-.477-.242.593.593 0 0 1 .119-.83l4.305-3.215H11.913l1.532-1.133a.593.593 0 0 0-.011-.956.6.6 0 0 1-.147.167L6.22 80.124a.54.54 0 0 1-.339.122.59.59 0 0 1-.477-.243.61.61 0 0 1 .12-.83l3.193-2.385h-.11C7.155 76.788 6 75.595 6 74.138v-8.675l1.414-1.052a.593.593 0 0 0-.01-.957.6.6 0 0 1-.15.168l-2.747 2.063a.54.54 0 0 1-.338.121.59.59 0 0 1-.478-.243.593.593 0 0 1 .12-.829l2.19-1.644V47.584l1.512-1.132a.61.61 0 0 0 .12-.83.6.6 0 0 0-.123-.122.6.6 0 0 1-.156.183l-2.767 2.063a.54.54 0 0 1-.338.121.59.59 0 0 1-.478-.242.593.593 0 0 1 .12-.83l2.11-1.573v-1.804l2.13-1.597a.61.61 0 0 0 .119-.83.6.6 0 0 0-.125-.124.6.6 0 0 1-.134.144L.926 46.31a.54.54 0 0 1-.338.121', {
            fill: this.FRAME_FOREGROUND_COLOR
        });
        this.drawArtboardPath(ctx, metrics, 'M53.551 27.845a.59.59 0 0 1-.477-.242.593.593 0 0 1 .12-.83l2.189-1.639V11.303h-5.334l3.543-2.65h1.79c1.454 0 2.608 1.193 2.608 2.65v11.879l1.632-1.222a.57.57 0 0 1 .816.122c.2.262.14.627-.12.829l-6.428 4.813a.54.54 0 0 1-.339.121M2.02 79.154a.59.59 0 0 0 .478.243c.12 0 .24-.02.339-.121l2.766-2.063a.61.61 0 0 0 .12-.83.59.59 0 0 0-.816-.12L2.14 78.324a.593.593 0 0 0-.12.83m45.062-67.285a.59.59 0 0 0 .478.242c.12 0 .239-.02.338-.101l5.852-4.389a.593.593 0 0 0 .12-.829.59.59 0 0 0-.817-.121l-2.655 1.982H30.662c.12.243.04.546-.179.728l-2.588 1.922h19.11a.58.58 0 0 0 .077.565M33.329 6.206a.59.59 0 0 1-.478-.243.593.593 0 0 1 .12-.83l1.353-1.01a.57.57 0 0 1 .816.121c.2.263.14.627-.12.83l-1.353 1.01a.54.54 0 0 1-.338.122m-.736 74.364a.59.59 0 0 0 .478.242c.14 0 .259-.04.338-.122l1.354-1.01a.593.593 0 0 0 .12-.83.59.59 0 0 0-.817-.121l-1.353 1.01a.593.593 0 0 0-.12.83', {
            fill: this.FRAME_FOREGROUND_COLOR
        });
        this.drawFrameLabel(ctx, metrics, this.scaleArtboardY(67.765, metrics), '#ffffff');
    },

    drawScriptCardFrame(ctx, metrics, phase = this.RENDER_PHASES.AFTER) {
        if (phase === this.RENDER_PHASES.BEFORE) {
            ctx.fillStyle = this.getFrameBackgroundFill();
            this.roundRect(ctx, 0, 0, metrics.size, metrics.totalHeight, this.scaleArtboardY(4, metrics));
            ctx.fill();
            return;
        }

        this.drawArtboardText(ctx, metrics, {
            y: 72.7,
            fontSize: 20,
            fontWeight: '400',
            fontFamily: this.FRAME_FONT_SCRIPT,
            color: this.FRAME_FOREGROUND_COLOR
        });
    },

    drawVideoPanelFrame(ctx, metrics) {
        this.drawArtboardPath(ctx, metrics, 'M4 1h56a3 3 0 0 1 3 3v56a3 3 0 0 1-3 3H4a3 3 0 0 1-3-3V4a3 3 0 0 1 3-3Z', {
            stroke: this.FRAME_FOREGROUND_COLOR,
            lineWidth: 2
        });
        this.drawArtboardPath(ctx, metrics, 'M2 67h60a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V68a1 1 0 0 1 1-1', {
            fill: this.FRAME_FOREGROUND_COLOR
        });
        this.drawArtboardPath(ctx, metrics, 'M2 67h60a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V68a1 1 0 0 1 1-1Z', {
            stroke: this.FRAME_FOREGROUND_COLOR,
            lineWidth: 2
        });
        this.drawArtboardPath(ctx, metrics, this.VIDEO_ICON_PATH, {
            fill: '#ffffff'
        });
        this.drawArtboardText(ctx, metrics, {
            x: 39,
            y: 75.765,
            fontSize: 9,
            color: '#ffffff'
        });
    },

    drawPhoneScreenFrame(ctx, metrics, phase = this.RENDER_PHASES.AFTER) {
        if (phase === this.RENDER_PHASES.BEFORE) {
            this.drawArtboardPath(ctx, metrics, this.PHONE_FRAME_PATH, {
                fill: this.FRAME_FOREGROUND_COLOR,
                fillRule: 'evenodd'
            });
            return;
        }

        this.drawArtboardText(ctx, metrics, {
            y: 63.18,
            fontSize: 8,
            color: this.FRAME_FOREGROUND_COLOR
        });
    },

    drawArrowNoteFrame(ctx, metrics, phase = this.RENDER_PHASES.AFTER) {
        if (phase === this.RENDER_PHASES.BEFORE) {
            ctx.fillStyle = this.getFrameBackgroundFill();
            this.roundRect(ctx, 0, 0, metrics.size, metrics.totalHeight, this.scaleArtboardY(4, metrics));
            ctx.fill();
            return;
        }

        this.drawArtboardPath(ctx, metrics, 'M6.096 77.37s-3.764-5.443-1.203-11.627C6.01 63.022 7.539 61.8 7.539 61.8l-1.478.361-.24-.878s2.939-.379 3.643-.258c-.584 1.292-.859 3.324-.859 3.324l-.842-.086.447-1.809s-2.458 2.326-3.077 5.581c-1.048 5.495 1.255 9.198 1.255 9.198z', {
            fill: this.FRAME_FOREGROUND_COLOR
        });
        this.drawArtboardText(ctx, metrics, {
            x: 34,
            y: 74.5,
            fontSize: 18,
            fontWeight: '400',
            fontFamily: this.FRAME_FONT_SCRIPT,
            color: this.FRAME_FOREGROUND_COLOR,
            rotation: -6.5,
            rotateX: 34,
            rotateY: 74.5
        });
    },

    drawCornerAccentFrame(ctx, metrics, phase = this.RENDER_PHASES.AFTER) {
        if (phase === this.RENDER_PHASES.BEFORE) {
            ctx.fillStyle = this.getFrameBackgroundFill();
            this.roundRect(ctx, 0, 0, metrics.size, metrics.totalHeight, this.scaleArtboardY(4, metrics));
            ctx.fill();

            this.drawArtboardPath(ctx, metrics, this.CORNER_ACCENT_PATH_PRIMARY, {
                fill: this.getFrameBackgroundFill(),
                stroke: this.FRAME_FOREGROUND_COLOR,
                lineWidth: this.CORNER_ACCENT_STROKE_WIDTH,
                lineCap: 'round',
                lineJoin: 'round'
            });
            this.drawArtboardPath(ctx, metrics, this.CORNER_ACCENT_PATH_SECONDARY, {
                fill: this.getFrameBackgroundFill(),
                fillRule: 'evenodd',
                stroke: this.FRAME_FOREGROUND_COLOR,
                lineWidth: this.CORNER_ACCENT_STROKE_WIDTH,
                lineCap: 'round',
                lineJoin: 'round'
            });
            return;
        }

        this.drawArtboardText(ctx, metrics, {
            x: 37,
            y: 71.68,
            fontSize: 8,
            color: this.FRAME_FOREGROUND_COLOR
        });
    },

    drawBagTagFrame(ctx, metrics, phase = this.RENDER_PHASES.AFTER) {
        if (phase === this.RENDER_PHASES.BEFORE) {
            this.drawArtboardPath(ctx, metrics, this.BAG_FRAME_PATH, {
                fill: this.FRAME_FOREGROUND_COLOR
            });
            this.drawArtboardPath(ctx, metrics, this.BAG_HANDLE_LEFT_PATH, {
                fill: this.FRAME_FOREGROUND_COLOR
            });
            this.drawArtboardPath(ctx, metrics, this.BAG_HANDLE_RIGHT_PATH, {
                fill: this.FRAME_FOREGROUND_COLOR
            });
            this.drawArtboardPath(ctx, metrics, this.BAG_HANDLE_SHADOW_PATH, {
                fill: '#84868E'
            });
            return;
        }

        this.drawArtboardText(ctx, metrics, {
            y: 73.765,
            fontSize: 9,
            color: '#ffffff'
        });
    },

    drawMailerFrame(ctx, metrics, phase = this.RENDER_PHASES.AFTER) {
        if (phase === this.RENDER_PHASES.BEFORE) {
            ctx.fillStyle = this.getFrameBackgroundFill();
            ctx.fillRect(0, 0, metrics.size, metrics.totalHeight);

            this.drawArtboardPath(ctx, metrics, this.MAILER_FRAME_BACKGROUND_PATH, {
                fill: this.getFrameBackgroundFill()
            });
            this.drawArtboardPath(ctx, metrics, this.MAILER_FRAME_PATH, {
                fill: this.FRAME_FOREGROUND_COLOR,
                fillRule: 'evenodd'
            });

            ctx.fillStyle = this.getQRBackgroundFill();
            this.roundRect(
                ctx,
                this.scaleArtboardX(14, metrics),
                this.scaleArtboardY(9.5, metrics),
                this.scaleArtboardX(36, metrics),
                this.scaleArtboardY(36, metrics),
                this.scaleArtboardY(2, metrics)
            );
            ctx.fill();
            return;
        }

        this.drawArtboardText(ctx, metrics, {
            x: 32,
            y: 70.68,
            fontSize: 8,
            color: this.FRAME_FOREGROUND_COLOR
        });
    },

    drawDeliveryVanFrame(ctx, metrics, phase = this.RENDER_PHASES.AFTER) {
        if (phase === this.RENDER_PHASES.BEFORE) {
            this.drawArtboardPath(ctx, metrics, this.DELIVERY_VAN_PANEL_PATH, {
                fill: this.FRAME_FOREGROUND_COLOR
            });
            this.drawArtboardPath(ctx, metrics, this.DELIVERY_VAN_BODY_PATH, {
                fill: this.FRAME_FOREGROUND_COLOR
            });
            this.drawArtboardPath(ctx, metrics, this.DELIVERY_VAN_CHASSIS_PATH, {
                fill: this.FRAME_FOREGROUND_COLOR
            });
            this.drawArtboardPath(ctx, metrics, this.DELIVERY_VAN_CAB_PATH, {
                fill: this.FRAME_FOREGROUND_COLOR,
                opacity: 0.5
            });
            this.drawArtboardPath(ctx, metrics, this.DELIVERY_VAN_STRIPE_PATH, {
                fill: this.FRAME_FOREGROUND_COLOR,
                opacity: 0.5
            });
            this.drawArtboardPath(ctx, metrics, this.DELIVERY_VAN_WHEEL_ARCH_PATH, {
                fill: this.FRAME_FOREGROUND_COLOR,
                opacity: 0.5
            });

            ctx.fillStyle = this.getQRBackgroundFill();
            this.roundRect(
                ctx,
                this.scaleArtboardX(4, metrics),
                this.scaleArtboardY(14, metrics),
                this.scaleArtboardX(26, metrics),
                this.scaleArtboardY(26, metrics),
                this.scaleArtboardY(2, metrics)
            );
            ctx.fill();
            return;
        }

        this.drawArtboardPath(ctx, metrics, this.DELIVERY_VAN_WHEEL_LEFT_PATH, {
            fill: this.FRAME_FOREGROUND_COLOR
        });
        this.drawArtboardPath(ctx, metrics, this.DELIVERY_VAN_WHEEL_RIGHT_PATH, {
            fill: this.FRAME_FOREGROUND_COLOR
        });
        this.drawArtboardText(ctx, metrics, {
            x: 17,
            y: 47.248,
            fontSize: 5.86,
            color: '#ffffff'
        });
    },

    drawDisplayStandFrame(ctx, metrics, phase = this.RENDER_PHASES.AFTER) {
        if (phase === this.RENDER_PHASES.BEFORE) {
            this.drawArtboardText(ctx, metrics, {
                x: 33,
                y: 7.68,
                fontSize: 8,
                color: this.FRAME_FOREGROUND_COLOR
            });

            ctx.fillStyle = this.getFrameBackgroundFill();
            ctx.fillRect(
                this.scaleArtboardX(14, metrics),
                this.scaleArtboardY(13, metrics),
                this.scaleArtboardX(39, metrics),
                this.scaleArtboardY(39, metrics)
            );

            ctx.fillStyle = this.getQRBackgroundFill();
            this.roundRect(
                ctx,
                this.scaleArtboardX(17, metrics),
                this.scaleArtboardY(16, metrics),
                this.scaleArtboardX(33, metrics),
                this.scaleArtboardY(33, metrics),
                this.scaleArtboardY(2, metrics)
            );
            ctx.fill();

            this.drawArtboardPath(ctx, metrics, this.DISPLAY_STAND_FRAME_PATH, {
                fill: this.FRAME_FOREGROUND_COLOR
            });
            return;
        }

        this.drawArtboardPath(ctx, metrics, this.DISPLAY_STAND_SHADOW_PATH, {
            fill: this.FRAME_FOREGROUND_COLOR
        });
        this.drawArtboardPath(ctx, metrics, this.DISPLAY_STAND_SHADOW_PATH, {
            fill: '#ffffff',
            opacity: 0.5
        });
        this.drawArtboardPath(ctx, metrics, this.DISPLAY_STAND_BASE_PATH, {
            fill: this.FRAME_FOREGROUND_COLOR
        });
        this.drawArtboardPath(ctx, metrics, this.DISPLAY_STAND_SUPPORT_PATH, {
            fill: this.FRAME_FOREGROUND_COLOR
        });
        this.drawArtboardPath(ctx, metrics, this.DISPLAY_STAND_SIDE_SHADOW_PATH, {
            fill: this.FRAME_FOREGROUND_COLOR,
            opacity: 0.5
        });
    },

    drawSidebarCardFrame(ctx, metrics, phase = this.RENDER_PHASES.AFTER) {
        if (phase === this.RENDER_PHASES.BEFORE) {
            this.drawArtboardPath(ctx, metrics, this.SIDEBAR_CARD_BACKGROUND_LEFT_PATH, {
                fill: this.getFrameBackgroundFill()
            });
            this.drawArtboardPath(ctx, metrics, this.SIDEBAR_CARD_BACKGROUND_TOP_PATH, {
                fill: this.getFrameBackgroundFill()
            });
            this.drawArtboardPath(ctx, metrics, this.SIDEBAR_CARD_FRAME_PATH, {
                fill: this.FRAME_FOREGROUND_COLOR,
                fillRule: 'evenodd'
            });

            ctx.fillStyle = this.getQRBackgroundFill();
            this.roundRect(
                ctx,
                this.scaleArtboardX(24, metrics),
                this.scaleArtboardY(27, metrics),
                this.scaleArtboardX(31, metrics),
                this.scaleArtboardY(31, metrics),
                this.scaleArtboardY(2, metrics)
            );
            ctx.fill();
            return;
        }

        this.drawArtboardText(ctx, metrics, {
            x: 39.5,
            y: 65.595,
            fontSize: 7,
            color: '#ffffff'
        });
    },

    drawClipboardFrame(ctx, metrics, phase = this.RENDER_PHASES.AFTER) {
        if (phase === this.RENDER_PHASES.BEFORE) {
            ctx.fillStyle = this.getFrameBackgroundFill();
            ctx.fillRect(
                this.scaleArtboardX(3, metrics),
                this.scaleArtboardY(13, metrics),
                this.scaleArtboardX(57, metrics),
                this.scaleArtboardY(56, metrics)
            );

            this.drawArtboardPath(ctx, metrics, this.CLIPBOARD_FRAME_PATH, {
                fill: this.FRAME_FOREGROUND_COLOR,
                fillRule: 'evenodd'
            });
            this.drawArtboardPath(ctx, metrics, this.CLIPBOARD_CLIP_PATH, {
                fill: this.FRAME_FOREGROUND_COLOR,
                fillRule: 'evenodd'
            });
            this.drawArtboardPath(ctx, metrics, this.CLIPBOARD_CLIP_PATH, {
                fill: '#ffffff',
                fillRule: 'evenodd',
                opacity: 0.5
            });

            ctx.fillStyle = this.getQRBackgroundFill();
            this.roundRect(
                ctx,
                this.scaleArtboardX(8, metrics),
                this.scaleArtboardY(17, metrics),
                this.scaleArtboardX(48, metrics),
                this.scaleArtboardY(48, metrics),
                this.scaleArtboardY(2, metrics)
            );
            ctx.fill();
            return;
        }

        this.drawArtboardText(ctx, metrics, {
            x: 32,
            y: 75.18,
            fontSize: 8,
            color: '#ffffff'
        });
    },

    drawNotebookFrame(ctx, metrics, phase = this.RENDER_PHASES.AFTER) {
        if (phase === this.RENDER_PHASES.BEFORE) {
            ctx.fillStyle = this.getFrameBackgroundFill();
            ctx.fillRect(
                this.scaleArtboardX(8, metrics),
                this.scaleArtboardY(14, metrics),
                this.scaleArtboardX(51, metrics),
                this.scaleArtboardY(52, metrics)
            );

            this.drawArtboardPath(ctx, metrics, this.NOTEBOOK_TOP_SHADOW_PATH, {
                fill: this.FRAME_FOREGROUND_COLOR,
                opacity: 0.5
            });
            this.drawArtboardPath(ctx, metrics, this.NOTEBOOK_FRAME_PATH, {
                fill: this.FRAME_FOREGROUND_COLOR,
                fillRule: 'evenodd'
            });
            this.drawArtboardPath(ctx, metrics, this.NOTEBOOK_TABS_PATH, {
                fill: this.FRAME_FOREGROUND_COLOR
            });
            this.drawArtboardPath(ctx, metrics, this.NOTEBOOK_TABS_PATH, {
                fill: '#ffffff',
                opacity: 0.5
            });

            ctx.fillStyle = this.getQRBackgroundFill();
            this.roundRect(
                ctx,
                this.scaleArtboardX(13.5, metrics),
                this.scaleArtboardY(18.5, metrics),
                this.scaleArtboardX(42, metrics),
                this.scaleArtboardY(42, metrics),
                this.scaleArtboardY(2, metrics)
            );
            ctx.fill();
            return;
        }

        this.drawArtboardText(ctx, metrics, {
            x: 34,
            y: 73.18,
            fontSize: 8,
            color: '#ffffff'
        });
    },

    drawFoldedBannerFrame(ctx, metrics, phase = this.RENDER_PHASES.AFTER) {
        if (phase === this.RENDER_PHASES.BEFORE) {
            ctx.fillStyle = this.getFrameBackgroundFill();
            ctx.fillRect(0, 0, metrics.size, metrics.totalHeight);

            this.drawArtboardPath(ctx, metrics, this.FOLDED_BANNER_BACKGROUND_PATH, {
                fill: this.getFrameBackgroundFill()
            });
            this.drawArtboardPath(ctx, metrics, this.FOLDED_BANNER_BODY_PATH, {
                fill: this.FRAME_FOREGROUND_COLOR,
                fillRule: 'evenodd'
            });

            ctx.fillStyle = '#E6E7ED';
            this.roundRect(
                ctx,
                this.scaleArtboardX(16, metrics),
                this.scaleArtboardY(35.5, metrics),
                this.scaleArtboardX(32, metrics),
                this.scaleArtboardY(32, metrics),
                this.scaleArtboardY(2, metrics)
            );
            ctx.fill();
            return;
        }

        this.drawArtboardText(ctx, metrics, {
            x: 32,
            y: 75.51,
            fontSize: 6,
            color: '#ffffff'
        });
    },

    drawRibbonFrame(ctx, metrics, phase = this.RENDER_PHASES.AFTER) {
        if (phase === this.RENDER_PHASES.BEFORE) {
            this.drawArtboardPath(ctx, metrics, this.RIBBON_FRAME_PATH, {
                fill: this.FRAME_FOREGROUND_COLOR
            });
            this.drawArtboardPath(ctx, metrics, this.RIBBON_LEFT_PATH, {
                fill: '#84868E'
            });
            this.drawArtboardPath(ctx, metrics, this.RIBBON_RIGHT_PATH, {
                fill: '#84868E'
            });
            this.drawArtboardPath(ctx, metrics, this.RIBBON_LEFT_SHADOW_PATH, {
                fill: '#5A5C66'
            });
            this.drawArtboardPath(ctx, metrics, this.RIBBON_RIGHT_SHADOW_PATH, {
                fill: '#5A5C66'
            });
            this.drawArtboardPath(ctx, metrics, this.RIBBON_MIDDLE_PATH, {
                fill: this.FRAME_FOREGROUND_COLOR
            });

            ctx.fillStyle = '#E6E7ED';
            this.roundRect(
                ctx,
                this.scaleArtboardX(14, metrics),
                this.scaleArtboardY(19, metrics),
                this.scaleArtboardX(36, metrics),
                this.scaleArtboardY(36, metrics),
                this.scaleArtboardY(2, metrics)
            );
            ctx.fill();
            return;
        }

        this.drawArtboardText(ctx, metrics, {
            y: 64.345,
            fontSize: 7,
            color: '#ffffff'
        });
    },

    drawGiftBowFrame(ctx, metrics, phase = this.RENDER_PHASES.AFTER) {
        if (phase === this.RENDER_PHASES.BEFORE) {
            this.drawArtboardPath(ctx, metrics, this.GIFT_FRAME_PATH, {
                fill: this.FRAME_FOREGROUND_COLOR
            });
            this.drawArtboardPath(ctx, metrics, this.GIFT_TEXT_CONTAINER_PATH, {
                fill: this.FRAME_FOREGROUND_COLOR
            });
            this.drawArtboardPath(ctx, metrics, this.BOW_SHADOW_PATH, {
                fill: '#84868E'
            });
            this.drawArtboardPath(ctx, metrics, this.BOW_LEFT_RIBBON_PATH, {
                fill: '#84868E'
            });
            this.drawArtboardPath(ctx, metrics, this.BOW_RIGHT_RIBBON_PATH, {
                fill: '#84868E'
            });
            this.drawArtboardPath(ctx, metrics, this.BOW_LEFT_SOLID_PATH, {
                fill: this.FRAME_FOREGROUND_COLOR
            });
            this.drawArtboardPath(ctx, metrics, this.BOW_RIGHT_SOLID_PATH, {
                fill: this.FRAME_FOREGROUND_COLOR
            });
            this.drawArtboardPath(ctx, metrics, this.BOW_LEFT_SHADOW_PATH, {
                fill: '#84868E'
            });
            this.drawArtboardPath(ctx, metrics, this.BOW_RIGHT_SHADOW_PATH, {
                fill: '#84868E'
            });
            this.drawArtboardPath(ctx, metrics, this.BOW_KNOT_PATH, {
                fill: '#84868E'
            });
            return;
        }

        this.drawArtboardText(ctx, metrics, {
            y: 76.345,
            fontSize: 7,
            color: '#ffffff'
        });
    },

    drawFrameLabel(ctx, metrics, y, color) {
        ctx.fillStyle = this.getLabelColor(color);
        ctx.font = `700 ${metrics.fontSize}px ${this.FRAME_FONT_DEFAULT}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.getResolvedFrameText(), metrics.size / 2, y);
    },

    drawArtboardText(ctx, metrics, {
        x = 32,
        y,
        fontSize = 9,
        fontWeight = '700',
        fontFamily = this.FRAME_FONT_DEFAULT,
        color = this.FRAME_FOREGROUND_COLOR,
        rotation,
        rotateX = x,
        rotateY = y
    }) {
        ctx.save();
        ctx.fillStyle = this.getLabelColor(color);
        ctx.font = `${fontWeight} ${this.scaleArtboardY(fontSize, metrics)}px ${fontFamily}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        if (rotation !== undefined) {
            ctx.translate(this.scaleArtboardX(rotateX, metrics), this.scaleArtboardY(rotateY, metrics));
            ctx.rotate((rotation * Math.PI) / 180);
            ctx.translate(-this.scaleArtboardX(rotateX, metrics), -this.scaleArtboardY(rotateY, metrics));
        }

        ctx.fillText(this.getResolvedFrameText(), this.scaleArtboardX(x, metrics), this.scaleArtboardY(y, metrics));
        ctx.restore();
    },

    /**
     * Helper to draw rounded rectangle
     */
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

    topRoundedRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height);
        ctx.lineTo(x, y + height);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
    },

    bottomRoundedRect(ctx, x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + width, y);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.closePath();
    },

    getTopRoundedRectPath(x, y, width, height, radius) {
        return [
            `M ${this.formatMetric(x + radius)} ${this.formatMetric(y)}`,
            `H ${this.formatMetric(x + width - radius)}`,
            `Q ${this.formatMetric(x + width)} ${this.formatMetric(y)} ${this.formatMetric(x + width)} ${this.formatMetric(y + radius)}`,
            `V ${this.formatMetric(y + height)}`,
            `H ${this.formatMetric(x)}`,
            `V ${this.formatMetric(y + radius)}`,
            `Q ${this.formatMetric(x)} ${this.formatMetric(y)} ${this.formatMetric(x + radius)} ${this.formatMetric(y)}`,
            'Z'
        ].join(' ');
    },

    getBottomRoundedRectPath(x, y, width, height, radius) {
        return [
            `M ${this.formatMetric(x)} ${this.formatMetric(y)}`,
            `H ${this.formatMetric(x + width)}`,
            `V ${this.formatMetric(y + height - radius)}`,
            `Q ${this.formatMetric(x + width)} ${this.formatMetric(y + height)} ${this.formatMetric(x + width - radius)} ${this.formatMetric(y + height)}`,
            `H ${this.formatMetric(x + radius)}`,
            `Q ${this.formatMetric(x)} ${this.formatMetric(y + height)} ${this.formatMetric(x)} ${this.formatMetric(y + height - radius)}`,
            'Z'
        ].join(' ');
    },

    getPointerPanelTrianglePath(metrics) {
        const trianglePoints = this.getPointerPanelTriangleCoordinates(metrics);

        return [
            `M ${trianglePoints.tip.x} ${trianglePoints.tip.y}`,
            `L ${trianglePoints.right.x} ${trianglePoints.right.y}`,
            `L ${trianglePoints.left.x} ${trianglePoints.left.y}`,
            'Z'
        ].join(' ');
    },

    getPointerPanelTriangleCoordinates(metrics) {
        return {
            tip: {
                x: this.scaleArtboardX(this.POINTER_PANEL_TRIANGLE_POINTS.tip.x, metrics),
                y: this.scaleArtboardY(this.POINTER_PANEL_TRIANGLE_POINTS.tip.y, metrics)
            },
            right: {
                x: this.scaleArtboardX(this.POINTER_PANEL_TRIANGLE_POINTS.right.x, metrics),
                y: this.scaleArtboardY(this.POINTER_PANEL_TRIANGLE_POINTS.right.y, metrics)
            },
            left: {
                x: this.scaleArtboardX(this.POINTER_PANEL_TRIANGLE_POINTS.left.x, metrics),
                y: this.scaleArtboardY(this.POINTER_PANEL_TRIANGLE_POINTS.left.y, metrics)
            }
        };
    },

    drawArtboardPath(ctx, metrics, pathData, options = {}) {
        const path = new Path2D(pathData);
        ctx.save();
        ctx.scale(metrics.scale, metrics.scale);
        if (typeof options.opacity === 'number') {
            ctx.globalAlpha = options.opacity;
        }

        if (options.fill) {
            ctx.fillStyle = options.fill;
            ctx.fill(path, options.fillRule || 'nonzero');
        }

        if (options.stroke) {
            ctx.strokeStyle = options.stroke;
            ctx.lineWidth = options.lineWidth || 2;
            ctx.stroke(path);
        }

        ctx.restore();
    },

    scaleArtboardX(value, metrics) {
        return this.formatMetric(value * metrics.scale);
    },

    scaleArtboardY(value, metrics) {
        return this.formatMetric(value * metrics.scale);
    },

    /**
     * Export QR code with frame as PNG
     * @param {HTMLCanvasElement} canvas - The QR code canvas
     * @param {string} frameType - Type of frame
     * @param {number} exportSize - Export resolution
     * @param {string} filename - Download filename
     */
    exportWithFrame(canvas, frameType, exportSize, filename) {
        const framedCanvas = this.applyFrame(canvas, frameType, exportSize);
        
        framedCanvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);
        }, 'image/png');
    },

    /**
     * Export QR code with frame as SVG
     * @param {string} qrSVG - The QR code SVG string
     * @param {string} frameType - Type of frame
     * @param {number} size - SVG size
     * @param {string} filename - Download filename
     */
    exportSVGWithFrame(qrSVG, frameType, size, filename) {
        const framedSVG = this.wrapSVGWithFrame(qrSVG, frameType, size);
        
        const blob = new Blob([framedSVG], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    },

    /**
     * Wrap QR code SVG with frame
     * @param {string} qrSVG - The QR code SVG string
     * @param {string} frameType - Type of frame
     * @param {number} size - SVG size
     * @returns {string} - Framed SVG string
     */
    wrapSVGWithFrame(qrSVG, frameType, size) {
        if (!frameType) {
            return qrSVG;
        }
        return this.withFrameCustomization(frameType, () => this.wrapSVGWithFrameWithActiveCustomization(qrSVG, frameType, size));
    },

    wrapSVGWithFrameWithActiveCustomization(qrSVG, frameType, size) {
        if (!frameType) {
            return qrSVG;
        }
        const { content, viewBox } = this.extractSVGSource(qrSVG, size);
        if (frameType === this.FRAME_TYPES.CUSTOM) {
            if (!this.hasCustomFrame()) {
                return qrSVG;
            }
            return this.buildCustomFrameSVG(size, content, viewBox);
        }
        return this.buildFrameSVG(frameType, size, content, viewBox);
    },

    /* ============================================================
     * Custom (user-uploaded) frame support
     * ============================================================ */

    escapeHTML(value) {
        return String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    },

    hasCustomFrame() {
        return Boolean(this.getActiveCustomFrame());
    },

    getActiveCustomFrame() {
        if (!this.customFrames.length) {
            this.customFrame = null;
            this.activeCustomFrameId = '';
            return null;
        }
        const activeFrame = this.customFrames.find(frame => frame.id === this.activeCustomFrameId) || this.customFrames[0];
        this.activeCustomFrameId = activeFrame.id;
        this.customFrame = activeFrame;
        return activeFrame;
    },

    setActiveCustomFrame(frameId) {
        const frame = this.customFrames.find(candidate => candidate.id === frameId);
        if (!frame) {
            this.customFrame = null;
            return null;
        }
        this.activeCustomFrameId = frame.id;
        this.customFrame = frame;
        return frame;
    },

    clampCustomQRRect(rect) {
        const frame = this.getActiveCustomFrame();
        const heightRatio = frame ? frame.naturalHeight / frame.naturalWidth : 1;
        return this.clampFrameQRRect(rect, heightRatio);
    },

    getDefaultCustomFrameQRRect(frame) {
        const aspect = frame.naturalHeight / frame.naturalWidth || 1;
        const defaultSizePct = 0.5;
        const defaultYPct = Math.max(0, 0.5 - (defaultSizePct / (2 * aspect)));
        return this.clampFrameQRRect({
            xPct: 0.5 - (defaultSizePct / 2),
            yPct: defaultYPct,
            sizePct: defaultSizePct
        }, aspect);
    },

    loadCustomFrameFromDataUrl(dataUrl, options = {}) {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.onload = () => {
                const naturalWidth = image.naturalWidth || image.width;
                const naturalHeight = image.naturalHeight || image.height;
                if (!naturalWidth || !naturalHeight) {
                    reject(new Error('Invalid image dimensions'));
                    return;
                }
                const frame = {
                    id: `custom-frame-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                    name: options.name || I18n.translateString('Custom'),
                    dataUrl,
                    image,
                    naturalWidth,
                    naturalHeight,
                    qrRect: null
                };
                frame.qrRect = this.getDefaultCustomFrameQRRect(frame);
                this.customFrames.unshift(frame);
                this.setActiveCustomFrame(frame.id);
                resolve(frame);
            };
            image.onerror = () => reject(new Error('Failed to load custom frame image'));
            image.src = dataUrl;
        });
    },

    async loadCustomFrameFile(file) {
        if (!file) {
            return false;
        }
        const dataUrl = await this.readFileAsDataUrl(file);
        try {
            await this.loadCustomFrameFromDataUrl(dataUrl, { name: file.name || I18n.translateString('Custom') });
            return true;
        } catch (err) {
            return false;
        }
    },

    readFileAsDataUrl(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(file);
        });
    },

    clearCustomFrame() {
        const activeId = this.activeCustomFrameId;
        this.customFrames = this.customFrames.filter(frame => frame.id !== activeId);
        this.customFrame = null;
        this.activeCustomFrameId = this.customFrames[0]?.id || '';
        this.getActiveCustomFrame();
    },

    setCustomQRRect(partial) {
        const frame = this.getActiveCustomFrame();
        if (!frame) {
            return null;
        }
        frame.qrRect = this.clampFrameQRRect({
            ...frame.qrRect,
            ...partial
        }, frame.naturalHeight / frame.naturalWidth);
        this.customFrame = frame;
        return frame.qrRect;
    },

    getCustomFrameMetrics(size) {
        const frame = this.getActiveCustomFrame();
        const aspect = frame.naturalHeight / frame.naturalWidth;
        const totalHeight = Math.round(size * aspect);
        const qrRect = this.clampFrameQRRect(frame.qrRect, aspect);
        const qrPxWidth = qrRect.widthPct * size;
        const qrPxHeight = qrRect.heightPct * totalHeight;
        return {
            size,
            totalHeight,
            qrBounds: {
                x: qrRect.xPct * size,
                y: qrRect.yPct * totalHeight,
                width: qrPxWidth,
                height: qrPxHeight,
                size: qrPxWidth
            }
        };
    },

    drawCustomFrame(ctx, sourceCanvas, metrics) {
        const frame = this.getActiveCustomFrame();
        ctx.drawImage(frame.image, 0, 0, metrics.size, metrics.totalHeight);
        const { x, y } = metrics.qrBounds;
        const qrWidth = metrics.qrBounds.width ?? metrics.qrBounds.size;
        const qrHeight = metrics.qrBounds.height ?? metrics.qrBounds.size;
        // Optional white square behind QR for contrast (only when not transparent)
        if (!this.TRANSPARENT_BACKGROUND) {
            ctx.fillStyle = this.getQRBackgroundFill();
            ctx.fillRect(x, y, qrWidth, qrHeight);
        }
        ctx.drawImage(sourceCanvas, x, y, qrWidth, qrHeight);
    },

    buildCustomFrameSVG(size, qrContent, sourceViewBox) {
        const frame = this.getActiveCustomFrame();
        const metrics = this.getCustomFrameMetrics(size);
        const { x, y } = metrics.qrBounds;
        const qrWidth = metrics.qrBounds.width ?? metrics.qrBounds.size;
        const qrHeight = metrics.qrBounds.height ?? metrics.qrBounds.size;
        const scaleX = qrWidth / sourceViewBox.width;
        const scaleY = qrHeight / sourceViewBox.height;
        const translateX = x - (sourceViewBox.minX * scaleX);
        const translateY = y - (sourceViewBox.minY * scaleY);
        const qrBackground = this.TRANSPARENT_BACKGROUND
            ? ''
            : `<rect x="${this.formatMetric(x)}" y="${this.formatMetric(y)}" width="${this.formatMetric(qrWidth)}" height="${this.formatMetric(qrHeight)}" fill="${this.getQRBackgroundFill()}"></rect>`;
        return `
            <svg viewBox="0 0 ${size} ${metrics.totalHeight}" fill="none" xmlns="http://www.w3.org/2000/svg">
                <image href="${frame.dataUrl}" x="0" y="0" width="${size}" height="${metrics.totalHeight}" preserveAspectRatio="none"></image>
                ${qrBackground}
                <g transform="translate(${this.formatMetric(translateX)} ${this.formatMetric(translateY)}) scale(${this.formatMetric(scaleX)} ${this.formatMetric(scaleY)})">
                    ${qrContent}
                </g>
            </svg>
        `;
    }
};

window.QRFrames = QRFrames;
