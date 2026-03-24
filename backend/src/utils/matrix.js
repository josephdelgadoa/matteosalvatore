/**
 * Barcode Matrix Configuration (Consolidated March 2026)
 * Formula: [Style_8][Color_2][Talla_1] (Total: 11 digits)
 */

const COLOR_MAPPING = {
    "ARENA": "01", "SAND": "01",
    "AZUL": "02", "BLUE": "02",
    "AZUL MARINO": "03", "NAVY": "03", "NAVY BLUE": "03",
    "AZUL NOCHE": "04", "NIGHT BLUE": "04",
    "BEIGE": "05",
    "BLANCO": "06", "WHITE": "06",
    "CAMELL": "07", "CAMEL": "07",
    "CELESTE BEBE": "08", "BABY BLUE": "08", "LIGHT BLUE": "08",
    "CEMENTO": "09", "CEMENT": "09",
    "CREMA": "10", "CREAM": "10",
    "HUESO": "11", "BONE": "11", "OFF WHITE": "11",
    "MELANGE": "12", "HEATHER": "12",
    "NEGRO": "13", "BLACK": "13",
    "PALO ROSA": "14", "DUSTY PINK": "14", "ROSE": "14",
    "PLOMO": "15", "GRAY": "15", "GREY": "15",
    "PLOMO PLATA": "16", "SILVER": "16", "SILVER GRAY": "16", "PLATA": "16",
    "PLOMO RATA": "17", "DARK GRAY": "17", "CHARCOAL": "17",
    "ROJO": "18", "RED": "18",
    "ROSADO BEBE": "19", "BABY PINK": "19", "PINK": "19",
    "SKY": "20",
    "TURQUESA": "21", "TURQUOISE": "21",
    "VERDE": "22", "GREEN": "22",
    "VERDE BOTELLA": "23", "BOTTLE GREEN": "23",
    "VINO": "24", "WINE": "24", "BURGUNDY": "24", "MAROON": "24"
};

const SIZE_MAPPING = {
    "XS": "0", "28": "0",
    "S": "1", "30": "1",
    "M": "2", "32": "2",
    "L": "3", "34": "3",
    "XL": "4", "36": "4",
    "XXL": "5", "38": "5",
    "40": "6"
};

const STYLE_MAPPING = {
    "POLO PIMA BASICO": "00501000",
    "POLO CLASICO": "00501000",
    "POLO SLIM FIT": "00501000",
    "POLO ESENCIAL": "00501000",
    "POLO OVERSIZE": "00502000",
    "POLO BOXY": "00503000",
    "HENLEY MC": "00504000",
    "HENLEY ML": "00505000",
    "CONJUNTO CANGURO": "00506000",
    "CONJUNTO RAGLAN": "00507000",
    "PANTALON CARGO": "00508000",
    "PANTALON JOGGUER": "00509000",
    "JOGGER": "00509000",
    "PANTALON SKINNY": "00510000",
    "CONJUNTO TULUM": "00511000",
    "CAMISA TULUM": "00512000",
    "HOODIE CLASSIC": "00513000",
    "CAPUCHA": "00513000"
};

/**
 * Normalizes input string to match mapping keys
 */
function normalize(str) {
    if (!str) return "";
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove accents
        .replace(/PREMIUM/gi, "") // Remove fluff
        .replace(/\-/g, "")
        .replace(/\s+/g, " ")
        .trim().toUpperCase();
}

/**
 * Generates an 11-digit barcode or SKU based on style code, color, and size
 */
function generateMatrixBarcode(stylePrefix, colorName, sizeName) {
    const style = stylePrefix || "00000000";
    
    // Find color ID
    const normalizedColor = normalize(colorName);
    let colorId = "00";
    for (const [name, id] of Object.entries(COLOR_MAPPING)) {
        if (normalizedColor === normalize(name)) {
            colorId = id;
            break;
        }
    }
    if (colorId === "00") {
        for (const [name, id] of Object.entries(COLOR_MAPPING)) {
            if (normalizedColor.includes(normalize(name))) {
                colorId = id;
                break;
            }
        }
    }

    // Find size ID
    const normalizedSize = normalize(sizeName);
    let sizeId = "0";
    for (const [name, id] of Object.entries(SIZE_MAPPING)) {
        if (normalizedSize === normalize(name)) {
            sizeId = id;
            break;
        }
    }
    
    return `${style}${colorId}${sizeId}`;
}

module.exports = {
    COLOR_MAPPING,
    SIZE_MAPPING,
    STYLE_MAPPING,
    generateMatrixBarcode,
    normalize
};
