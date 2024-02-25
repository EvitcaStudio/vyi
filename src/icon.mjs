import { Frame } from './frame.mjs';

// A icon can have states that are also icons
export class Icon {
    /**
     * An array of Icon's that are state of this icon.
     * @private
     * @type {Array}
     */
    states = [];
    /**
     * An arary of Frame's that are the frames of this icon.
     * @private
     * @type {Array}
     */
    frames = [];
    /**
     * The width of this icon. All states and frames of this icon must match this size.
     * @private
     * @type {number}
     */
    width = 32;
    /**
     * The height of this icon. All states and frames of this icon must match this size.
     * @private
     * @type {number}
     */
    height = 32;
    /**
     * The name of this icon.
     * @private
     * @type {string}
     */
    name;
    /**
     * Creates the icon class.
     * @param {Object} pIconData - The icon data that is used to build this icon.
     * @param {VYI} pVYI - The vyi that owns this icon.
     */
    constructor(pIconData, pVYI) {
        /**
         * The VYI that owns this icon.
         * @private
         * @type {pVYI}
         */
        this.vyi = pVYI;
        this.sift(pIconData);
    }
    /**
     * Sifts through the icon data and adds data to this icon.
     * @param {Object} pIconData - The icon data that is used to build this icon.
     * @private
     */
    sift(pIconData) {
        // Loop through pIconData and create this icon
    }
    /**
     * Sets the size of this icon.
     * @param {number} pWidth - The width of this icon.
     * @param {number} pHeight - THe height of this icon.
     * @returns {self} This icon instance.
     */
    setSize(pWidth, pHeight) {
        if (typeof(pWidth) === 'number') {
            this.width = pWidth;
        }
        if (typeof(pHeight) === 'number') {
            this.height = pHeight;
        }
    }
    /**
     * 
     * @param {string} pName - The new name of the icon.
     * @returns {self} This icon instance.
     */
    rename(pName) {
        if (typeof(pName) === 'string') {
            this.name = pName;
        } else {
            this.vyi.logger.prefix('VYI-Module').error('Invalid type for pName!');
        }
        return this;
    }
    /**
     * Sets all the frames belonging to this icon to the same delay.
     * @param {number} pDelay - The delay to set all frames to.
     * @returns {self} This icon instance.
     */
    setAllFrameDelays(pDelay) {
        if (typeof(pDelay) === 'number') {
            this.frames.forEach((pFrame) => {
                pFrame.setDelay(pDelay);
            });
        } else {
            this.vyi.logger.prefix('VYI-Module').error('Invalid type for pDelay!');
        }
        return this;
    }
    /**
     * Sets the frame delay of the passed frame.
     * @param {number} pFrame - The frame to change the delay of.
     * @param {number} pDelay - The delay to set this frame to.
     * @returns {self} This icon instance.
     */
    setFrameDelay(pFrame, pDelay) {
        if (pFrame) {
            if (typeof(pDelay) === 'number') {
                pFrame.setDelay(pDelay);
            }
        } else {
            this.vyi.logger.prefix('VYI-Module').error('Frame not found. Cannot set frame delay.');
        }
        return this;
    }
    /**
     * Adds a new frame to this icon.
     * @returns {Frame|undefined} The frame that was added or undefined.
     */
    addFrame(pFrameData) {
        if (pFrameData) {
            if (pFrameData instanceof Object) {
                // We pass "this.vyi" because this passes the vyi module to the frane.
                return new Frame(pFrameData, this.vyi);
            } else {
                this.vyi.logger.prefix('VYI-Module').error('Invalid frame data passed!');
            }
        } else {
            this.vyi.logger.prefix('VYI-Module').error('No frame data passed!');
        }
    }
    /**
     * Removes the frame from this icon.
     * @param {Frame} pFrame - The frame to remove from this icon.
     * @returns {self} This icon instance.
     */
    removeFrame(pFrame) {
        if (this.frames.includes(pFrame)) {
            this.frames.splice(this.frames.indexOf(pFrame), 1);
        }
        return this;
    }
    /**
     * Reorders the frame in this icon.
     * @param {Frame} - The frame that will be changing in order.pFrame
     * @param {number} - The index the frame will be moving to.
     * @returns {self} This icon instance.
     */
    reorderFrame(pFrame, pIndex) {
        return this;
    }
    /**
     * Gets all the frames belonging to this icon.
     * @returns {Ovject} An object containing the frame data of all frames.
     */
    getFrames() {
        const frameDataObject = {};
        this.frames.forEach((pFrame) => {
            frameDataObject[pFrame.index] = pFrame.getDataURL();
        });
        return frameDataObject;
    }   
}