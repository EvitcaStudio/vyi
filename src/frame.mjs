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
     * Create this frame class instance.
     * @param {Object} pFrameData - The frame data that is used to build this frame.
     * @param {VYI} pVYI - The vyi that owns this frame.
     */
    constructor(pFrameData, pVYI) {
        /**
         * The VYI that owns this icon.
         * @private
         * @type {pVYI}
         */
        this.vyi = pVYI;
        this.sift(pFrameData);
    }
    /**
     * Sifts through the icon data and adds data to this frame.
     * @param {Object} pFrameData - The frame data that is used to build this frame.
     * @private
     */
    sift(pFrameData) {
        // Loop through frame data and build frame.
    }
    /**
     * Sets the delay of this frame in ms.
     * Type checking is done in the API that calls this. All values are sanitized prior.
     * @param {number} pDelay - The delay in ms to set this frame to.
     * @returns {self} This frame instance.
     */
    setDelay(pDelay) {
        this.delay = pDelay;
        return this;
    }
    /**
     * Sets the data url of this frame.
     * @param {DataURL} pDataURL - The base64 data of this image.
     * @returns {self} This frame instance.
     */
    setDataURL(pDataURL) {
        if (typeof(pDataURL) === 'string') {
            this.dataURL = pDataURL;
        } else {
            this.vyi.logger.prefix('VYI-module').error('Invalid data url type!');
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
     * Gets the index of this frame.
     * @returns {number} The index of this frame.
     */
    getIndex() {
        return this.index;
    }
    /**
     * Gets the data URL of this frame.
     * @returns {DataURL} - The base64 data of this image.
     */
    getDataURL() {
        return this.dataURL;
    }
}