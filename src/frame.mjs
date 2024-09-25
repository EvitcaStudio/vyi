import { VYI, Icon } from './vyi.mjs';

/**
 * @public
 */
export class Frame {
    /**
     * The delay of this frame.
     * @private
     * @type {number}
     */
    delay;
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
    constructor(pFrameData) {
        this.parse(pFrameData);
    }
    /**
     * Parses through the icon data and adds data to this frame.
     * @param {Array} pFrameData - The frame data that is used to build this frame.
     * @private
     */
    parse(pFrameData) {
        if (!pFrameData) return;
        // Loop through frame data and build frame.
        const dataURL = pFrameData[0];
        const frameDelay = pFrameData[1] 
            ? pFrameData[1] 
            : this.parent 
                ? this.parent.getDelay()
                : null;

        this.setDataURL(dataURL);
        // A frame delay may not be passed. So we await for a parent to default this frame's delay to.
        if (frameDelay) {
            this.setDelay(frameDelay);
        }
    }
    /**
     * Sets the parent for this frame.
     * @private
     * @param {Icon} pParent - The parent icon of this frame.
     */
    setParent(pParent) {
        if (!pParent || this.parent) return;
        if (pParent instanceof Icon) {
            this.parent = pParent;
            this.vyi = pParent.vyi;
            // If no delay is found, get it from the parent.
            if (!this.getDelay()) {
                this.setDelay(this.parent.getDelay());
            }
        }
    }
    /**
     * Removes the parent and vyi from this frame.
     * @private
     */
    removeParent() {
        this.parent = null;
        this.vyi = null;
    }
    /**
     * Sets the delay of this frame in ms.
     * @param {number} pDelay - The delay in ms to set this frame to.
     * @returns {self} This frame instance.
     */
    setDelay(pDelay) {
        if (typeof pDelay === 'number') {
            this.delay = pDelay;
        } else {
            VYI.logger.prefix('Vyi-module').error('Invalid delay type!');
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
        if (typeof pDataURL === 'string') {
            this.dataURL = pDataURL;
        } else {
            VYI.logger.prefix('Vyi-module').error('Invalid data url type!');
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
     * Gets the width of the frame.
     * @returns {number} The width of the frame.
     */
    getWidth() {
        if (!this.parent) return;
        return this.parent.width;
    }
    /**
     * Gets the height of the frame.
     * @returns {number} The height of the frame.
     */
    getHeight() {
        if (!this.parent) return;
        return this.parent.height;
    }
    /**
     * Gets the width and height of this frame and returns it.
     * @returns {Object} An object with the width and height of this frame.
     */
    getSize() {
        if (!this.parent) return;
        return { width: this.parent.width, height: this.parent.height };
    }
    /**
     * Gets the vyi this frame belongs to.
     * @returns {VYI} The vyi this frame belongs to.
     */
    getVyi() {
        return this.vyi;
    }
    /**
     * Gets the icon this frame belongs to.
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
        const frameData = [this.getDataURL()];
        const delayIsDefault = this.getDelay() === Frame.defaultDelay;
        if (!delayIsDefault) {
            frameData[1] = this.getDelay() || Frame.defaultDelay;
        }
        return frameData;
    }
}