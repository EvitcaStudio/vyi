import { Logger } from './vendor/logger.mjs';
import { Icon } from './icon.mjs';
import pako from './vendor/pako.esm.mjs';

/**
 * @public
 */
export class VYI {
	/**
	 * The version of the module.
	 */
	static version = "VERSION_REPLACE_ME";
    /** The logger module this module uses to log errors / logs.
     * @private
     * @type {Object}
     */
    static logger = new Logger();
    /**
     * An array of icons that belong to this VYI
     * @private
     * @type {Array}
     */
    icons = [];
    /**
     * The name of this vyi.
     * @private
     * @type {string}
     */
    name = 'failed-to-find-vyi-name';
    /**
     * The version of the VYI.
     * @private
     * @type {number}
     */
    formatVersion;
    /**
     * An array of used IDs to prevent collusion between duplicate named icons.
     * 
     * @private
     * @type {Array}
     */
    reservedIDs = [];
    /**
     * Initializes this module with the information from the VYI passed.
     * @param {Object} pVyiData - A JSON / Javascript object containing the vyi information.this.ogger
    */
    constructor(pVyiData) {
        VYI.logger.registerType('VYI-Module', '#ff6600');
        this.parse(pVyiData);
    }
    /**
     * Parses the provided VYI data (either a URL, a JSON object, or binary data) and processes it.
     * If the data is a URL (string), it fetches/reads the data and parses it as JSON.
     * If the data is binary, it attempts to inflate it using pako or decode it as plain text.
     *
     * @param {string|Object|Uint8Array|ArrayBuffer} pVyiData - The VYI data to parse. Or a path to a VYI file.
     * @returns {Promise<void>} - A promise that resolves when the parsing is completed.
     * @throws {Error} - Throws an error if fetching, inflating, or decoding fails.
     */
    async parse(pVyiData) {
        if (!pVyiData) return;

        try {
            let vyi;

            if (typeof(pVyiData) === 'string') {
                const isNodeEnv = typeof(window) === 'undefined';
                vyi = isNodeEnv 
                    ? await this.readFileAndGetVYI(pVyiData) 
                    : await this.fetchAndParseJSON(pVyiData);
            } else if (typeof(pVyiData) === 'object' && !Array.isArray(pVyiData) && !(pVyiData instanceof ArrayBuffer || pVyiData instanceof Uint8Array)) {
                vyi = pVyiData;
            } else if (pVyiData instanceof ArrayBuffer || pVyiData instanceof Uint8Array) {
                vyi = await this.handleBinaryData(pVyiData);
            } else {
                throw new Error('Invalid input type provided.');
            }

            // If there is valid vyi data, process it
            if (vyi) {
                this.processVyiData(vyi);
            }
        } catch (pError) {
            VYI.logger.prefix('VYI-module').error(`Error processing VYI data: ${pError.message}`);
            throw pError; // Rethrow the error for further handling
        }
    }
    /**
     * Reads a file and returns the vyi from it.
     * 
     * @private
     * @param {string} - The URL to read the data from.
     * @returns {Promise<Object>} - The vyi from the file.
     */
    async readFileAndGetVYI(pURL) {
        const fs = (await import('fs')).promises;
        const data = await fs.readFile(pURL);
        return this.handleBinaryData(data);
    }
    /**
     * Fetches data from a URL and parses it as JSON.
     *
     * @private
     * @param {string} pURL - The URL to fetch the data from.
     * @returns {Promise<Object>} - A promise that resolves to the parsed JSON data.
     */
    async fetchAndParseJSON(pURL) {
        try {
            const response = await fetch(pURL);
            const jsonData = await response.json();
            return jsonData;
        } catch (pError) {
            throw new Error(`Failed to fetch or parse JSON from URL: ${pError}`);
        }
    }
    /**
     * Handles binary data (ArrayBuffer or Uint8Array). Attempts to inflate or decode it.
     *
     * @private
     * @param {ArrayBuffer|Uint8Array} pBinaryData - The binary data to process.
     * @returns {Object|string|null} - The parsed JSON object or decoded string, or null if it fails.
     */
    handleBinaryData(pBinaryData) {
        const arrayBuffer = pBinaryData instanceof ArrayBuffer ? pBinaryData : pBinaryData.buffer;

        try {
            // Attempt to decompress the binary data
            const decompressed = pako.inflate(arrayBuffer, { to: 'string' });
            return JSON.parse(decompressed);
        } catch {
            // If decompression fails, decode it as plain text
            const decodedText = new TextDecoder().decode(arrayBuffer);
            return JSON.parse(decodedText);
        }
    }
    /**
     * Processes the parsed VYI data and adds icons to the VYI module instance.
     * 
     * @private
     * @param {Object} pVyi - The parsed VYI data.
     */
    processVyiData(pVyi) {
        const icons = pVyi.i;
        this.formatVersion = pVyi.v || 1;

        if (Array.isArray(icons)) {
            icons.forEach((pIconData) => {
                this.addIcon(pIconData, this);
            });
        } else {
            VYI.logger.prefix('VYI-module').error('Invalid .vyi file! Cannot parse icons.');
        }
    }
    /**
     * Adds an icon to this VYI.
     * @param {Object} pIconData - The icon data to use.
     * @returns {Icon|undefined} - The Icon added or undefined.
     */
    addIcon(pIconData) {
        if (pIconData) {
            if (pIconData instanceof Object) {
                const icon = new Icon(pIconData, this);
                // Add the icon to the icons array.
                this.icons.push(icon);
                return icon;
            } else {
                VYI.logger.prefix('VYI-module').error('Invalid icon data type passed!');
            }
        } else {
            VYI.logger.prefix('VYI-module').error('No icon data passed!');
        }
    }
    /**
     * Removes the icon passed or the icon with the name pName.
     * @param {Icon} pIcon - The state to remove from this icon. pName should be not be used in tandem with this method of removing.
     * @param {string} pName - The name of the icon to remove. pIcon must be undefined to use this method for removing.
     */
    removeIcon(pIcon, pName) {
        const icon = pIcon || this.getIcon(pName);
        if (icon) {
            if (this.icons.includes(icon)) {
                this.icons.splice(this.icons.indexOf(icon), 1);
            }
        }
    }
    /**
     * Returns all the icon names in this vyi.
     * @returns {Array} An array of icon names in this vyi.
     */
    getIconNames() {
        // Array to store the icon names.
        const iconNames = [];
        this.icons.forEach((pIcon) => {
            iconNames.push(pIcon.name);
        });
        return iconNames;
    }
    /**
     * Gets the icon that has the name pName.
     * @param {string} pName - The name of the icon to get.
     * @returns {Icon|undefined} The icon that has the name pName or undefined.
     */
    getIcon(pName) {
        if (typeof(pName) === 'string') {
            for (let i = this.icons.length - 1; i >= 0; i--) {
                const icon = this.icons[i];
                // If the icon has the same name, return that icon
                if (icon.getName() === pName) {
                    return icon;
                }
            }
        } else {
            VYI.logger.prefix('VYI-module').error('Invalid name type used!');
        }
    }
    /**
     * Gets an icon by the id provided.
     * 
     * @private
     * @param {string} pID - The id of the icon.
     * @returns {Icon} The icon that has the id that was passed.
     */
    getIconByID(pID) {
        if (!pID) return;
        for (const icon of this.icons) {
            for (const state of icon.states) {
                if (state.id === pID) return state;
            }
            if (icon.id === pID) return icon;
        }
    }
    /**
     * Gets all the icons in this vyi.
     * @returns {Array<Icon>}
     */
    getIcons() {
        return [...this.icons];
    }
    /**
     * Renames the vyi.
     * 
     * @param {string} pName - The name to give this vyi.
     */
    rename(pName) {
        if (typeof(pName) === 'string') {
            this.name = pName;
        } else {
            VYI.logger.prefix('VYI-module').error('Invalid name type used!');
        }
    }
    /**
     * Gets the name of the vyi.
     * @returns {string} The name of the vyi.
     */
    getName() {
        return this.name;
    }
    /**
     * Exports this VYI into VYI format.
     * @returns {Object} Returns the vyi data.
     */
    export() {
        const vyi = {};
        // Set version
        vyi.v = this.formatVersion;
        // Set the icons array
        vyi.i = [];
        this.icons.forEach((pIcon) => {
            // Push the icon data to the vyi export object.
            vyi.i.push(pIcon.export());
        });
        return vyi;
    }
}