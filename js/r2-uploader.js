// Cloudflare R2 Image Uploader
import { Storage } from './storage.js';

export class R2Uploader {
    constructor() {
        this.settings = Storage.getSettings();
    }

    // Update settings
    updateSettings(settings) {
        this.settings = settings;
    }

    // Check if R2 is configured
    isConfigured() {
        const r2 = this.settings.r2Config;
        return r2.workerUrl && r2.workerUrl.trim() !== '';
    }

    // Generate AWS Signature V4 for R2
    async generateSignature(method, url, headers, payload = '') {
        const algorithm = 'AWS4-HMAC-SHA256';
        const service = 's3';
        const region = 'auto'; // R2 uses 'auto' region

        const now = new Date();
        const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
        const dateStamp = amzDate.slice(0, 8);

        // Add required headers
        headers['x-amz-date'] = amzDate;
        headers['x-amz-content-sha256'] = await this.sha256(payload);

        // Create canonical request
        const canonicalUri = new URL(url).pathname;
        const canonicalHeaders = Object.keys(headers)
            .sort()
            .map(key => `${key.toLowerCase()}:${headers[key].trim()}`)
            .join('\n');
        const signedHeaders = Object.keys(headers)
            .sort()
            .map(key => key.toLowerCase())
            .join(';');

        const canonicalRequest = [
            method,
            canonicalUri,
            '', // query string
            canonicalHeaders + '\n',
            signedHeaders,
            headers['x-amz-content-sha256']
        ].join('\n');

        // Create string to sign
        const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
        const stringToSign = [
            algorithm,
            amzDate,
            credentialScope,
            await this.sha256(canonicalRequest)
        ].join('\n');

        // Calculate signature
        const signingKey = await this.getSignatureKey(
            this.settings.r2Config.secretAccessKey,
            dateStamp,
            region,
            service
        );
        const signature = await this.hmac(signingKey, stringToSign);

        // Create authorization header
        headers['Authorization'] = `${algorithm} Credential=${this.settings.r2Config.accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

        return headers;
    }

    // SHA256 hash
    async sha256(message) {
        const msgBuffer = new TextEncoder().encode(message);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // HMAC-SHA256
    async hmac(key, message) {
        const keyBuffer = typeof key === 'string' ? new TextEncoder().encode(key) : key;
        const msgBuffer = new TextEncoder().encode(message);

        const cryptoKey = await crypto.subtle.importKey(
            'raw',
            keyBuffer,
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['sign']
        );

        const signature = await crypto.subtle.sign('HMAC', cryptoKey, msgBuffer);

        // For signature, return hex string
        if (typeof key !== 'string') {
            const sigArray = Array.from(new Uint8Array(signature));
            return sigArray.map(b => b.toString(16).padStart(2, '0')).join('');
        }

        // For intermediate keys, return ArrayBuffer
        return new Uint8Array(signature);
    }

    // Get signing key
    async getSignatureKey(key, dateStamp, region, service) {
        const kDate = await this.hmac('AWS4' + key, dateStamp);
        const kRegion = await this.hmac(kDate, region);
        const kService = await this.hmac(kRegion, service);
        const kSigning = await this.hmac(kService, 'aws4_request');
        return kSigning;
    }

    // Upload file to R2 via Cloudflare Worker
    async uploadFile(file, filename) {
        const r2 = this.settings.r2Config;

        // Check if worker URL is configured
        if (!r2.workerUrl) {
            console.warn('No Cloudflare Worker URL configured. Falling back to Data URLs.');
            console.warn('Configure workerUrl in Settings to enable R2 uploads.');
            return await this.fileToDataURL(file);
        }

        try {
            // Upload via Cloudflare Worker
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(r2.workerUrl, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Upload failed');
            }

            const data = await response.json();

            if (!data.success || !data.url) {
                throw new Error('Invalid response from upload worker');
            }

            // Return the public URL from R2
            return data.url;
        } catch (error) {
            console.error('Worker upload failed:', error);
            console.warn('Falling back to Data URL storage');
            return await this.fileToDataURL(file);
        }
    }

    // Upload from Data URL (for pasted images or URL scraping)
    async uploadDataURL(dataURL, filename) {
        // Convert data URL to Blob
        const response = await fetch(dataURL);
        const blob = await response.blob();

        // Create File object
        const file = new File([blob], filename, { type: blob.type });

        return await this.uploadFile(file, filename);
    }

    // Fallback: Use Data URL if R2 is not configured
    async uploadWithFallback(file) {
        if (this.isConfigured()) {
            try {
                return await this.uploadFile(file, file.name);
            } catch (error) {
                console.error('R2 upload failed, using data URL fallback:', error);
                return await this.fileToDataURL(file);
            }
        } else {
            // Use data URL as fallback
            return await this.fileToDataURL(file);
        }
    }

    // Convert file to data URL
    fileToDataURL(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    // Scrape image from URL (CORS-limited, may not work for all sites)
    async scrapeImageFromURL(url) {
        try {
            // Try to fetch the image directly
            const response = await fetch(url);
            const blob = await response.blob();

            // Generate filename from URL
            const filename = url.split('/').pop().split('?')[0] || 'scraped-image.jpg';

            if (this.isConfigured()) {
                const file = new File([blob], filename, { type: blob.type });
                return await this.uploadFile(file, filename);
            } else {
                // Use the URL directly if R2 is not configured
                return url;
            }
        } catch (error) {
            // CORS error or fetch failed - just use the URL directly
            console.warn('Could not fetch image, using URL directly:', error);
            return url;
        }
    }
}
