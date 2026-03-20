/**
 * Matrix Mapping for Matteo Salvatore Product Identification Systems (2026)
 * This utility handles the conversion of Styles, Colors, and Sizes into 
 * the official 11-digit barcode format: [Style_8][Color_2][Talla_1]
 */

export const COLOR_MAPPING: Record<string, string> = {
    "AZUL": "01",
    "AZUL MARINO": "02",
    "AZUL NOCHE": "03",
    "AZUL ACERO": "04",
    "BEIGE": "05",
    "BEIGE / ARENA": "06",
    "BEIGE / CREMA": "07",
    "BLANCO": "08",
    "CAMELL": "09",
    "CELESTE BEBE": "10",
    "CELESTE PASTEL": "11",
    "CEMENTO": "12",
    "CREMA": "13",
    "GRIS": "14",
    "GRIS ACERO": "15",
    "GRIS CARBON": "16",
    "GRIS HIELO": "17",
    "HUESO": "18",
    "LADRILLO": "19",
    "MARRON": "20",
    "MARRON / CAFE": "21",
    "MARRON / TOPO": "22",
    "MELANGE": "23",
    "MELANGE CLARO": "24",
    "NEGRO": "25",
    "PALO ROSA": "26",
    "PLOMO": "27",
    "PLOMO PLATA": "28",
    "PLOMO RATA": "29",
    "ROJO": "30",
    "ROSADO BEBE": "31",
    "ROSA CLARO": "32",
    "SKY": "33",
    "CIELO": "33",
    "TURQUESA": "34",
    "VERDE": "35",
    "VERDE BOTELLA": "36",
    "VERDE OLIVA": "37",
    "VERDE OLIVO / MILITAR": "38",
    "VINTO / BORGOÑA": "39",
    "ARENA": "42" // Alias for Beige/Arena
};

export const SIZE_MAPPING: Record<string, string> = {
    "S": "1",
    "M": "2",
    "L": "3",
    "XL": "4",
    "XXL": "5",
    "30": "6",
    "32": "7",
    "40": "7", // Added 40 for loafers based on sql
    "42": "8"
};

export const STYLE_MAPPING: Record<string, string> = {
    "POLO PIMA BASICO": "00501000",
    "POLO PIMA CLASICO": "00501000",
    "POLO ESENCIAL": "00501000",
    "POLO PREMIUM": "00501000",
    "POLO OVERSIZE": "00502000",
    "POLO BOXI": "00503000",
    "POLO HENLEY MC": "00504000",
    "POLO HENLEY ML": "00505000",
    "CASACA BOMBER": "00506000",
    "CASACA HARRINGTON": "00507000",
    "MOCASINES": "00508000",
    "PANTALON CHINO": "00509000",
    "PANTALON CARGO": "00510000",
    "SHORT CHINO": "00511000",
    "CAMISA LINO": "00512000",
    "CHOMPA MERINO": "00513000"
};

/**
 * Normalizes input string to match mapping keys
 */
export function normalize(str: string): string {
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
export function generateMatrixBarcode(stylePrefix: string, colorName: string, sizeName: string): string {
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

/**
 * Infers style code from product name, including color if found
 * Returns [Style_8][Color_2]
 */
export function inferStyleCode(productName: string): string | null {
    const normalizedName = normalize(productName);
    let styleBase = null;
    
    for (const [styleName, code] of Object.entries(STYLE_MAPPING)) {
        if (normalizedName.includes(normalize(styleName))) {
            styleBase = code;
            break;
        }
    }

    if (!styleBase) return null;

    // Find Color for the main Product SKU
    let colorId = "00";
    for (const [colorName, id] of Object.entries(COLOR_MAPPING)) {
        if (normalizedName.includes(normalize(colorName))) {
            colorId = id;
            break;
        }
    }

    return `${styleBase}${colorId}`;
}
