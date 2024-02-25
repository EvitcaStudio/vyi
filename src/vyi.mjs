import { Logger } from './vendor/logger.min.mjs';
import { Icon } from './icon.mjs';

export class VYI {
	/**
	 * The version of the module.
	 */
	version = "VERSION_REPLACE_ME";
    /**
     * A message that is attached to exported vyi's made with this tool.
     * @private
     * @type {string}
     */
    generatedMessage = 'https://github.com/EvitcaStudio/vyi-reader'
    /** The logger module this module uses to log errors / logs.
     * @private
     * @type {Object}
     */
    logger = new Logger();
    /**
     * If this VYI has initialized a vyi.
     * @private
     * @type {boolean}
     */
    initiated = false;
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
    name = 'rename-this-vyi';
    /**
     * The version of the VYI.
     * @private
     * @type {number}
     */
    formatVersion;
    /**
     * Initializes this module with the information from the VYI passed.
     * @param {Object|string} pVYIData - A string containing the path to the vyi json or a JSON / Javascript object containing the vyi information.
     */
	constructor(pVYIData) {
        return new Promise((pResolve, pReject) => {
            this.logger.registerType('VYI-Module', '#ff6600');
            this.sift(pVYIData, pResolve);
        });
	}
    /**
     * Initializes this module with the information from the VYI passed.
     * @async
     * @param {Object|string} pVYIData - A string containing the path to the vyi json or a JSON / Javascript object containing the vyi information.
     * @param {any} - The resolve callback.
     */
    async sift(pVYIData, pResolve) {
        if (!this.initiated) {
            if (pVYIData) {
                let vyi;
                // If the data is a path then we need to use fetch to acquire the data first
                if (typeof(pVYIData) === 'string') {
                    const url = pVYIData;
                    const response = await fetch(url);
                    vyi = await response.json();
                } else if (pVYIData instanceof Object) {
                    vyi = pVYIData;
                }
                // If there is data to parse
                // Then sift through it
                if (vyi) {
                    /**
                     * An array of icons that this vyi holds.
                     * @type {Array}
                     */
                    const icons = vyi.i;
                    /**
                     * The version of the vyi. 1 for default if no version is found.
                     * @type {number}
                     */
                    this.formatVersion = vyi.v || 1;;

                    if (Array.isArray(icons)) {
                        // Loop through the icons and add them to the vyi module instance.
                        icons.forEach((pIconData) => {
                            this.addIcon(pIconData);
                        });
                        this.initiated = true;
                        // Resolve the promise.
                        if (typeof(pResolve) === 'function') {
                            pResolve(this);
                        }
                    } else {
                        this.logger.prefix('VYI-module').error('Invalid .vyi file! Cannot parse.')
                    }
                }
            }
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
                // We pass "this" because this passes the vyi module to the icon.
                const icon = new Icon(pIconData, this);
                // Add the icon to the icons array.
                this.icons.push(icon);
                return icon;
            } else {
                this.logger.prefix('VYI-module').error('Invalid icon data type passed!');
            }
        } else {
            this.logger.prefix('VYI-module').error('No icon data passed!');
        }
    }
    /**
     * Removes the icon from this VYI.
     * @param {Icon} - The icon to remove.
     */
    removeIcon(pIcon) {
        if (this.icons.includes(pIcon)) {
            this.icons.splice(this.icons.indexOf(pIcon), 1);
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
        for (const icon of this.icons) {
            // If the icon has the same name, return that icon
            if (icon.getName() === pName) {
                return icon;
            }
        };
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
        // A helpful note attached to this vyi
        vyi.generatedMessage = this.generatedMessage;
        this.icons.forEach((pIcon) => {
            // Push the icon data to the vyi export object.
            vyi.i.push(pIcon.export());
        });
        return vyi;
    }
}