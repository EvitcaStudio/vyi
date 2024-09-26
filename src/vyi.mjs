import { Logger } from './vendor/logger.mjs';
import { Icon } from './icon.mjs';
import { Frame } from './frame.mjs';
import pako from './vendor/pako.esm.mjs';

/**
 * @public
 */
class VYI {
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
     * A map of icons that belong to this VYI
     * @private
     * @type {Map}
     */
    icons = new Map();
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
    formatVersion = 1;
    /**
     * Initializes this module with the information from the VYI passed.
     * @param {Object} pVyiData - A JSON / Javascript object containing the vyi information.this.ogger
    */
    constructor(pVyiData) {
        VYI.logger.registerType('Vyi-module', '#ff6600');
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

            if (typeof pVyiData === 'string') {
                const isNodeEnv = typeof window === 'undefined';
                vyi = isNodeEnv 
                    ? await this.readFileAndGetVYI(pVyiData) 
                    : await this.fetchAndParseJSON(pVyiData);
            } else if (pVyiData instanceof VYI) {
                vyi = pVyiData.export();
            } else if (pVyiData instanceof Object && !Array.isArray(pVyiData) && !(pVyiData instanceof ArrayBuffer || pVyiData instanceof Uint8Array)) {
                vyi = pVyiData;
            } else if (pVyiData instanceof ArrayBuffer || pVyiData instanceof Uint8Array) {
                vyi = await this.handleBinaryData(pVyiData);
            } else {
                throw new Error('Error processing: Invalid input type provided.');
            }

            this.processVyiData(vyi);
        } catch (pError) {
            VYI.logger.prefix('Vyi-module').error(`${pError.message}`);
        }
    }
    /**
     * Reads a file and returns the vyi from it.
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
     * @private
     * @param {Object} pVyi - The parsed VYI data.
     */
    processVyiData(pVyi) {
        const icons = pVyi.i;
        this.formatVersion = pVyi.v || 1;

        if (Array.isArray(icons)) {
            icons.forEach((pIconData) => {
                this.addIcon(pIconData);
            });
        } else {
            VYI.logger.prefix('Vyi-module').error('Invalid .vyi file! Cannot parse icons.');
        }
    }
    /**
     * Adds an icon to this VYI.
     * @param {Icon|Array} pIconData - The icon data to use.
     * @returns {Icon|undefined} - The Icon added or undefined.
     */
    addIcon(pIconData) {
        if (!pIconData) {
            VYI.logger.prefix('Vyi-module').error('No icon data passed!');
            return;
        }

        if (!(pIconData instanceof Icon) && !Array.isArray(pIconData)) {
            VYI.logger.prefix('Vyi-module').error('Invalid icon data type passed!');
            return;
        }

        const icon = pIconData instanceof Icon
            ? pIconData
            : new Icon(pIconData);

        this.icons.set(icon.id, icon);
        icon.setVyi(this);
        return icon;
    }
    /**
     * Removes the icon passed.
     * @param {Icon} pIcon - The icon to remove from this vyi.
     */
    removeIcon(pIcon) {
        if (!pIcon) return;
        if (pIcon instanceof Icon) {
            if (this.icons.delete(pIcon.id)) {;
                pIcon.removeVyi();
            }
        }
    }
    /**
     * Removes the icon via it's name. The LAST defined icon that has the passed name will be removed. As names are not unique.
     * @param {string} pName - The name to use to find the icon.
     */
    removeIconByName(pName) {
        const icon = this.getIcon(pName);
        this.removeIcon(icon);
    }
    /**
     * Removes the icon via it's id.
     * @param {string} pName - The id to use to find the icon.
     */
    removeIconById(pId) {
        const icon = this.getIconById(pId);
        this.removeIcon(icon);
    }
    /**
     * Returns all the icon names in this vyi.
     * @returns {Array} An array of icon names in this vyi.
     */
    getIconNames() {
        const iconNames = this.getIcons().map((pIcon) => pIcon.name);
        return iconNames;
    }
    /**
     * Gets the icon that has the name pName. The LAST defined icon that has the passed name will be returned.
     * @param {string} pName - The name of the icon to get.
     * @returns {Icon|undefined} The icon that has the name pName or undefined.
     */
    getIcon(pName) {
        if (typeof pName === 'string') {
            const icons = this.getIcons();
            for (let i = icons.length - 1; i >= 0; i--) {
                const icon = icons[i];
                // If the icon has the same name, return that icon
                if (icon.getName() === pName) {
                    return icon;
                }
            }
        } else {
            VYI.logger.prefix('Vyi-module').error('Invalid name type used!');
        }
    }
    /**
     * Gets the number of icons this vyi has.
     * @returns {number} The amount of icons this vyi has.
     */
    getIconCount() {
        return this.icons.size;
    }
    /**
     * Gets an icon by the id provided.
     * @param {string} pId - The id of the icon.
     * @returns {Icon} The icon that has the id that was passed.
     */
    getIconById(pId) {
        if (!pId) return;
        // We recursively check the states of the parent to get the icon if its not found on the vyi.
        const icon = this.icons.get(pId) || this.getIcons().find((pIcon) => pIcon.states.has(pId))?.getStateById(pId);
        return icon;
    }
    /**
     * Gets all the icons in this vyi.
     * @returns {Array<Icon>}
     */
    getIcons() {
        return Array.from(this.icons.values());
    }
    /**
     * Renames the vyi.
     * @param {string} pName - The name to give this vyi.
     */
    rename(pName) {
        if (typeof pName === 'string') {
            this.name = pName;
        } else {
            VYI.logger.prefix('Vyi-module').error('Invalid name type used!');
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
        vyi.v = this.formatVersion;
        vyi.i = this.getIcons().map((pIcon) => pIcon.export());
        return vyi;
    }
}

export { VYI, Icon, Frame };