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
     * @param {number} pIndex - The index of this frame.
     * @param {VYI} pVYI - The vyi that owns this frame.
     */
    constructor(pFrameData, pIndex, pVYI) {
        /**
         * The VYI that owns this icon.
         * @private
         * @type {pVYI}
         */
        this.vyi = pVYI;
        this.sift(pFrameData, pIndex);
    }
    /**
     * Sifts through the icon data and adds data to this frame.
     * @param {Object} pFrameData - The frame data that is used to build this frame.
     * @param {number} pIndex - The index of this frame.
     * @private
     */
    sift(pFrameData, pIndex) {
        // Loop through frame data and build frame.
        const dataURL = pFrameData[0];
        const frameDelay = pFrameData[1];
        // Set the data url
        this.setDataURL(dataURL);
        // Set the frame delay
        this.setDelay(frameDelay);
        // Set the index of the frame
        this.setIndex(pIndex);
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
                this.vyi.logger.prefix('VYI-module').error('Invalid delay type!');
            }
        }
        return this;
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
                this.vyi.logger.prefix('VYI-module').error('Invalid data url type!');
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
     * Sets the index of the frame.
     * @private
     * @param {number} pIndex - THe index to set the frame to.
     * @returns {self} This frame instance.
     */
    setIndex(pIndex) {
        if (pIndex) {
            if (typeof(pIndex) === 'number') {
                this.index = pIndex;
            } else {
                this.vyi.logger.prefix('VYI-module').error('Invalid index type!');
            }
        }
        return this;
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