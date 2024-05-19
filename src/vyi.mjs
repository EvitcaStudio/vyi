import { Logger } from './vendor/logger.min.mjs';
import { Icon } from './icon.mjs';

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
    name = 'vyi-to-be-renamed';
    /**
     * The version of the VYI.
     * @private
     * @type {number}
     */
    formatVersion;
    /**
     * Initializes this module with the information from the VYI passed.
     * @param {Object} pVYIData - A JSON / Javascript object containing the vyi information.
    */
    constructor(pVYIData) {
        VYI.logger.registerType('VYI-Module', '#ff6600');
        if (pVYIData) {
            if (pVYIData instanceof Object) {
                this.parse(pVYIData);
            } else {
                VYI.logger.prefix('VYI-module').error('Invalid vyiData type! Cannot parse!');
            }
        }
    }
    /**
     * Initializes this module with the information from the VYI passed.
     * Can call parse multiple times with different data to "merge" vyis.
     * @async
     * @param {Object|string} pVYIData - A string containing the path to the vyi json or a JSON / Javascript object containing the vyi information.
     */
    async parse(pVYIData) {
        try {
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
                // Then parse through it
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
                    this.formatVersion = vyi.v || 1;

                    if (Array.isArray(icons)) {
                        // Loop through the icons and add them to the vyi module instance.
                        icons.forEach((pIconData) => {
                            this.addIcon(pIconData);
                        });
                    } else {
                        VYI.logger.prefix('VYI-module').error('Invalid .vyi file! Cannot parse.');
                    }
                }
            }
        } catch (pError) {
            VYI.logger.prefix('VYI-module').error(`Error processing vyi data: ${pError}`);
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
                const icon = new Icon(pIconData);
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
            this.logger.prefix('VYI-module').error('Invalid name type used!');
        }
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