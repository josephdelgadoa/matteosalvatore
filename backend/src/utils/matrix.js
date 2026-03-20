/**
 * Barcode Matrix Configuration (Updated March 2026)
 * Formula: [Style_8][Color_2][Talla_1] (Total: 11 digits)
 */

const COLOR_MAPPING = {
    "AZUL": "01",
    "AZUL MARINO": "02",
    "AZUL NOCHE": "03",
    "AZUL ACERO": "04",
    "BEIGE": "05",
    "BEIGE / ARENA": "06",
    "BEIGE / CREMA": "07",
    "BLANCO": "08",
    "CAMELL": "09",
    "CELESTE BEBÉ": "10",
    "CELESTE PASTEL": "11",
    "CEMENTO": "12",
    "CREMA": "13",
    "GRIS": "14",
    "GRIS ACERO": "15",
    "GRIS CARBÓN": "16",
    "GRIS HIELO": "17",
    "GUINDA": "18",
    "HUESO": "19",
    "MARRÓN": "20",
    "MARRÓN / TABACO": "21",
    "MARRÓN / TOPO": "22",
    "MELANGE": "23",
    "MELANGE CLARO": "24",
    "NEGRO": "25",
    "PALO ROSA": "26",
    "PLOMO": "27",
    "PLOMO PLATA": "28",
    "PLOMO RATA": "29",
    "ROJO": "30",
    "ROSADO BEBÉ": "31",
    "ROSA CLARO": "32",
    "SKY": "33",
    "CIELO": "33",
    "TURQUESA": "34",
    "VERDE": "35",
    "VERDE BOTELLA": "36",
    "VERDE OLIVA": "37",
    "VERDE OLIVO / MILITAR": "38",
    "VERDE MILITAR": "39",
    "VERDE CEMENTO": "40",
    "VINO": "41",
    "ARENA": "42"
};

const SIZE_MAPPING = {
    "XS": "0",
    "28": "0",
    "S": "1",
    "30": "1",
    "M": "2",
    "32": "2",
    "L": "3",
    "34": "3",
    "XL": "4",
    "36": "5", // Note: The mapping table says XL/34 is 4, and XXL/36 is 5. But S/30, M/32, L/34? 
    "XXL": "5",
    "38": "6",
    "40": "7"
};

const STYLE_MAPPING = {
    "POLO PIMA BÁSICO": "00501000",
    "POLO PIMA CLÁSICO": "00501000",
    "POLO ESENCIAL": "00501000",
    "POLO PREMIUM": "00501000",
    "POLO OVERSIZE": "00502000",
    "POLO BOXI": "00503000",
    "POLO HENLEY MC": "00504000",
    "POLO HENLEY ML": "00505000",
    "CONJUNTO CANGURO": "00506000",
    "SET RANGLA / SET URBANO": "00507000",
    "PANTALÓN CARGO FIT": "00508000",
    "PANTALÓN JOGGUER": "00509000",
    "PANTALÓN SKINNY": "00510000",
    "CONJUNTO TULUM": "00511000",
    "CAMISA TULUM": "00512000",
    "POLERA HOODIE CLASSIC": "00513000"
};

/**
 * Normalizes input string to match mapping keys
 * Removes accents and common fluff words like 'PREMIUM'
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
        if (normalizedColor.includes(normalize(name))) {
            colorId = id;
            break;
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
