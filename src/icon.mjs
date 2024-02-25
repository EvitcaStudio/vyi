import { Frame } from './frame.mjs';
//  *     [
//  *         name, // 0
//  *         width, // 1
//  *         height, // 2
//  *         frame delay, // 3
//  *         data url, // 4
//  *         frame array // 5
//  *         [
//  *            // frame 1 
//  *               [
//  *                  data url,
//                     frame delay
//  *              ],
//  *            // frame 2 
//  *               [
//  *                  data url,
//                     frame delay
//  *              ],
//  *            // etc
//  *         ]
//  *         states array // 6 // optional
//  *         [
//  *              [
//  *                  state name, // 0
//  *                  state data url, // 1
//  *                  state frame delay, // 2
//  *                  state frame array  // 3 // optional
//  *                  [
//  *                      [
//  *                          state frame data url,
//  *                          state frame delay
//  *                      ],
//  *                      [
//  *                          state frame data url,
//  *                          state frame delay
//  *                      ]
//  *                  ]
//  *              ]
//  *         ]
//  *         
//  *     ]
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
     * The data URL of the sprite in this frame.
     * @private
     * @type {string}
     */
    dataURL;
    /**
     * The delay of this frame.
     * @private
     * @type {number}
     */
    delay = 100;
    /**
     * The name of this icon.
     * @private
     * @type {string}
     */
    name = 'default-name';
    /**
     * Creates this icon instance.
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
        const iconName = pIconData[0];
        const iconWidth = pIconData[1];
        const iconHeight = pIconData[2];
        const iconDelay = pIconData[3];
        const iconDataURL = pIconData[4];
        const frameArray = pIconData[5];
        const stateArray = pIconData[6];

        // Set name
        this.rename(iconName);
        // Set size
        this.setSize(iconWidth, iconHeight);
        // Set icon delay
        this.setDelay(iconDelay);
        // Set dataURL
        this.setDataURL(iconDataURL);
        // Check if the frame data is an array
        if (Array.isArray(frameArray)) {
            // If the frame array has data then we need to store it.
            if (frameArray.length) {
                // We use the count to assign indexes to the frames.
                let count = 0;
                frameArray.forEach((pFrame) => {
                    // pFrame is an array holding the datalURL and frameDelay of the frame
                    this.addFrame(pFrame, count);
                    count++;
                });
            }
        }
        console.log(this);
        console.log(pIconData, 'iconData');
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
     * Sets the data url of this icon.
     * @param {DataURL} pDataURL - The base64 data of this image.
     * @returns {self} This icon instance.
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
     * Sets the delay of this icon in ms.
     * Type checking is done in the API that calls this. All values are sanitized prior.
     * @param {number} pDelay - The delay in ms to set this icon to.
     * @returns {self} This icon instance.
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
     * Gets the delay of this icon.
     * @returns {number} The delay of this icon.
     */
    getDelay() {
        return this.delay;
    }
    /**
     * 
     * @param {string} pName - The new name of the icon.
     * @returns {self} This icon instance.
     */
    rename(pName) {
        if (pName) {
            if (typeof(pName) === 'string') {
                this.name = pName;
            } else {
                this.vyi.logger.prefix('VYI-Module').error('Invalid type for pName!');
            }
        }
        return this;
    }
    /**
     * Sets all the frames belonging to this icon to the same delay.
     * @param {number} pDelay - The delay to set all frames to.
     * @returns {self} This icon instance.
     */
    setAllFrameDelays(pDelay) {
        if (pDelay) {
            if (typeof(pDelay) === 'number') {
                this.frames.forEach((pFrame) => {
                    pFrame.setDelay(pDelay);
                });
            } else {
                this.vyi.logger.prefix('VYI-Module').error('Invalid type for pDelay!');
            }
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
            } else {
                this.vyi.logger.prefix('VYI-Module').error('Invalid type for pDelay.');
            }
        } else {
            this.vyi.logger.prefix('VYI-Module').error('Frame not found. Cannot set frame delay.');
        }
        return this;
    }
    /**
     * Adds a new frame to this icon.
     * @param {Object} pFrameData - The frame data to give this frame.
     * @param {number} pIndex - The index of this frame.
     * @returns {Frame|undefined} The frame that was added or undefined.
     */
    addFrame(pFrameData, pIndex) {
        if (pFrameData) {
            if (pFrameData instanceof Object) {
                // We pass "this.vyi" because this passes the vyi module to the frane.
                const frame = new Frame(pFrameData, pIndex, this.vyi);
                // Add the frame to the frames array.
                this.frames.push(frame);
                return frame;
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
        if (pFrame) {
            if (this.frames.includes(pFrame)) {
                this.frames.splice(this.frames.indexOf(pFrame), 1);
            }
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