const axios = require('axios');
const { logger } = require('../utils/logger');

const CULQI_API_URL = 'https://api.culqi.com/v2';

class CulqiService {
    constructor() {
        this.privateKey = process.env.CULQI_SECRET_KEY;
    }

    async createCharge(chargeData) {
        try {
            const response = await axios.post(`${CULQI_API_URL}/charges`, chargeData, {
                headers: {
                    'Authorization': `Bearer ${this.privateKey}`,
                    'Content-Type': 'application/json',
                    ...(process.env.CULQI_RSA_ID ? { 'x-culqi-rsa-id': process.env.CULQI_RSA_ID } : {})
                }
            });
            return response.data;
        } catch (error) {
            const errorMsg = error.response?.data?.user_message || error.response?.data?.merchant_message || error.message;
            logger.error(`Culqi Charge Error: ${errorMsg}`);
            throw new Error(errorMsg);
        }
    }
}

module.exports = new CulqiService();
