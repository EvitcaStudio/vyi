import { Logger } from './vendor/logger.min.mjs';
import { Icon } from './icon.mjs';

                /**
                 * FORMAT
                 * {
                 *  v: 1, // version
                 *  i: [
                 *     [] // icon 0
                 *     [
                 *         name, // 0
                 *         width, // 1
                 *         height, // 2
                 *         frame delay, // 3
                 *         data url, // 4
                 *         frame array // 5
                 *         [
                 *            // frame 1 
                 *               [
                 *                  data url
                 *              ],
                 *            // frame 2 
                 *               [
                 *                  data url
                 *              ],
                 *            // etc
                 *         ]
                 *         states array // 6 // optional
                 *         [
                 *              [
                 *                  state name, // 0
                 *                  state data url, // 1
                 *                  state frame delay, // 2
                 *                  state frame array  // 3 // optional
                 *                  [
                 *                      [
                 *                          state frame data url
                 *                      ],
                 *                      [
                 *                          state frame data url
                 *                      ]
                 *                  ]
                 *              ]
                 *         ]
                 *         
                 *     ] // icon 1
                 *  ] // array of icons, the length of "i" is how many "icons" are in the vyi
                 *  
                 * }
                 */
                // ...

export class VYI {
	/**
	 * The version of the module.
	 */
	version = "VERSION_REPLACE_ME";
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
    name;
    /**
     * The version of the VYI.
     * @private
     * @type {number}
     */
    vyiVersion;
    /**
     * Initializes this module with the information from the VYI passed.
     * @param {Object|string} pVYIData - A string containing the path to the vyi json or a JSON / Javascript object containing the vyi information.
     */
	constructor(pVYIData) {
        this.logger.registerType('VYI-Module', '#ff6600');
        this.init(pVYIData);
	}
    /**
     * Initializes this module with the information from the VYI passed.
     * @param {Object|string} pVYIData - A string containing the path to the vyi json or a JSON / Javascript object containing the vyi information.
     * @private
     */
    async init(pVYIData) {
        // Can only be initialized one time.
        if (!this.initiated) { 
            await this.sift(pVYIData);
            this.initiated = true;
        }
    }
    /**
     * Initializes this module with the information from the VYI passed.
     * @param {Object|string} pVYIData - A string containing the path to the vyi json or a JSON / Javascript object containing the vyi information.
     * @private
     */
    async sift(pVYIData) {
        if (pVYIData) {
            let vyi;
            // If the data is a path then we need to use fetch to acquire the data first
            // Then sift through it
            if (typeof(pVYIData) === 'string') {
                const url = pVYIData;
                const response = await fetch(url);
                vyi = await response.json();
            } else if (pVYIData instanceof Object) {
                vyi = pVYIData;
            }
            /**
             * The version of the vyi.
             * @type {number}
             */
            const vyiVersion = vyi.v;
            /**
             * An array of icons that this vyi holds.
             * @type {Array}
             */
            const icons = vyi.i;
            this.vyiVersion = vyiVersion;
            // Loop through the icons and add them to the vyi module instance.
            icons.forEach((pIconData) => {
                this.addIcon(pIconData);
            });
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
                return new Icon(pIconData, this);
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
     * Exports this VYI into VYI format.
     * @returns {Object} Returns the vyi data.
     */
    export() {
        const vyiData = {};
        // ...
        return vyiData;
    }
}