import { VYI } from './vyi.mjs';

/**
 * @public
 */
export class Frame {
    /**
     * The delay of this frame.
     * @private
     * @type {number}
     */
    delay = 100;
    /**
     * The data URL of the sprite in this frame.
     * @private
     * @type {string}
     */
    dataURL;
    /**
     * The index of this frame. This indicates the order of the frame. 0 - Infinity.
     * @private
     * @type {number}
     */
    index = 0;
    /**
     * The icon that owns this frame. 
     * @private
     * @type {Icon}
     */
    parent;
    /**
     * The vyi this frame belongs to.
     * 
     * @private
     * @type {VYI}
     */
    vyi;
    /**
     * The default delay in ms of frames.
     * @private
     * @type {number}
     */
    static defaultDelay = 100;
    /**
     * Create this frame class instance.
     * @param {Array} pFrameData - The frame data that is used to build this frame.
     * @param {Icon} pParentIcon - The icon that created this frame.
     * @private
     */
    constructor(pFrameData, pParentIcon) {
        this.vyi = pParentIcon.vyi;
        this.parent = pParentIcon;
        this.parse(pFrameData);
    }
    /**
     * parses through the icon data and adds data to this frame.
     * @param {Array} pFrameData - The frame data that is used to build this frame.
     * @private
     */
    parse(pFrameData) {
        // Loop through frame data and build frame.
        const dataURL = pFrameData[0];
        const frameDelay = pFrameData[1] ? pFrameData[1] : this.parent.getDelay();
        // Set the data url
        this.setDataURL(dataURL);
        // Set the frame delay
        this.setDelay(frameDelay);
    }
    /**
     * Sets the delay of this frame in ms.
     * @param {number} pDelay - The delay in ms to set this frame to.
     * @returns {self} This frame instance.
     */
    setDelay(pDelay) {
        if (pDelay) {
            if (typeof(pDelay) === 'number') {
                this.delay = pDelay;
            } else {
                VYI.logger.prefix('VYI-module').error('Invalid delay type!');
            }
        }
        return this;
    }
    /**
     * Gets the delay of this frame.
     * @returns {number} The delay of this frame.
     */
    getDelay() {
        return this.delay;
    }
    /**
     * Sets the data url of this frame.
     * @param {DataURL} pDataURL - The base64 data of this image.
     * @returns {self} This frame instance.
     */
    setDataURL(pDataURL) {
        if (pDataURL) {
            if (typeof(pDataURL) === 'string') {
                this.dataURL = pDataURL;
            } else {
                VYI.logger.prefix('VYI-module').error('Invalid data url type!');
            }
        }
        return this;
    }
    /**
     * Gets the data URL of this frame.
     * @returns {DataURL} - The base64 data of this image.
     */
    getDataURL() {
        return this.dataURL;
    }
    /**
     * Gets the vyi this frame belongs to.
     * 
     * @returns {VYI} The vyi this frame belongs to.
     */
    getVyi() {
        return this.vyi;
    }
    /**
     * Gets the icon this frame belongs to.
     * 
     * @returns {Icon} The icon this frame belongs to.
     */
    getParent() {
        return this.parent;
    }
    /**
     * Exports this frame's data into proper vyi format.
     * @private
     * @returns {Array} An array of data related to this frame in the proper vyi format.
     */
    export() {
        const frameData = [];
        // frame dataURL
        frameData[0] = this.getDataURL();
        // We do not have to store the delay if it is the default value of 100. This will save data.
        const delayIsDefault = this.getDelay() === Frame.defaultDelay;
        if (!delayIsDefault) {
            // frame delay
            frameData[1] = this.getDelay();
        }
        return frameData;
    }
}