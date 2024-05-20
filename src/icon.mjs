import { VYI } from './vyi.mjs';
import { Frame } from './frame.mjs';

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
    name = '';
    /**
     * Creates this icon instance.
     * @param {Object} pIconData - The icon data that is used to build this icon.
     * @private
     */
    constructor(pIconData) {
        this.parse(pIconData);
    }
    /**
     * parses through the icon data and adds data to this icon.
     * @param {Object} pIconData - The icon data that is used to build this icon.
     * @private
     */
    parse(pIconData) {
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
                frameArray.forEach((pFrame) => {
                    // pFrame is an array holding the datalURL and frameDelay of the frame
                    this.addFrame(pFrame);
                });
            }
        }
        // Check if the states data is an array
        if (Array.isArray(stateArray)) {
            // If the state array has data then we need to store it.
            if (stateArray.length) {
                stateArray.forEach((pState) => {
                    // Here we create a icon with aggregated data because the state data is not enough to make it an icon.
                    // We do this because a state is basically an icon, but it just "inherits" alot of the data. But this makes it easier to manage if we treat it internally as an icon.
                    const aggregatedIconData = [];
                    // iconName
                    aggregatedIconData[0] = pState[0];
                    // iconWidth
                    aggregatedIconData[1] = iconWidth;
                    // iconHeight
                    aggregatedIconData[2] = iconHeight;
                    // frame delay
                    aggregatedIconData[3] = pState[2];
                    // iconDataURL
                    aggregatedIconData[4] = pState[1];
                    // frame array
                    aggregatedIconData[5] = pState[3];
                    this.addState(aggregatedIconData);
                });
            }
        }
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
     * Gets the width and height of this icon and returns it.
     * @returns {Object} An object with the width and height of this icon.
     */
    getSize() {
        return { width: this.width, height: this.height };
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
                VYI.logger.prefix('VYI-module').error('Invalid data url type!');
            }
        }
        return this;
    }
    /**
     * Gets the data URL of this icon.
     * @returns {DataURL} - The base64 data of this image.
     */
    getDataURL() {
        return this.dataURL;
    }
    /**
     * Sets the frame delay of this icon.
     * @param {number} pDelay - The delay to set this frame to.
     * @returns {self} This icon instance.
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
     * Gets the delay of this icon.
     * @returns {number} The delay of this icon.
     */
    getDelay() {
        return this.delay;
    }
    /**
     * Changes the name of this icon.
     * @param {string} pName - The new name of the icon.
     * @returns {self} This icon instance.
     */
    rename(pName) {
        if (pName || pName === '') {
            if (typeof(pName) === 'string') {
                this.name = pName;
            } else {
                VYI.logger.prefix('VYI-Module').error('Invalid type for pName!');
            }
        }
        return this;
    }
    /**
     * Returns the name of this icon.
     * @returns {string} The name of this icon.
     */
    getName() {
        return this.name;
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
                VYI.logger.prefix('VYI-Module').error('Invalid type for pDelay!');
            }
        }
        return this;
    }
    /**
     * Adds this icon data as a state. A state is also an icon.
     * @param {Object} pIconData - The data used to create this state icon.
     * @returns {Icon|undefined} The state that was added or undefined.
     */
    addState(pIconData) {
        if (pIconData instanceof Object) {
            const state = new Icon(pIconData);
            this.states.push(state);
            return state;
        }
    }
    /**
     * Removes the state passed or the state with the name pName.
     * @param {Icon} pState - The state to remove from this icon. pName should be not be used in tandem with this method of removing.
     * @param {string} pName - The name of the state to remove. pState must be undefined to use this method for removing.
     * @returns {self} This icon instance.
     */
    removeState(pState, pName) {
        // The index used to remove this frame.
        let index;
        // Remove via reference to state.
        if (this.states.includes(pState)) {
            index = this.states.indexOf(pState);
        // Remove via reference to name
        } else if (typeof(pName) === 'string') {
            const state = this.getState(pName);
            if (state) {
                index = this.states.indexOf(state);
            }
        } else {
            VYI.logger.prefix('VYI-Module').error('Failed to remove state!');
            return this;
        }
        if (typeof(index) === 'number') {
            // Remove the state
            this.states.splice(index, 1);
        }
        return this;
    }
    /**
     * Adds a new frame to this icon.
     * @param {Object} pFrameData - The frame data to give this frame.
     * @returns {Frame|undefined} The frame that was added or undefined.
     */
    addFrame(pFrameData) {
        if (pFrameData) {
            if (pFrameData instanceof Object) {
                const frame = new Frame(pFrameData, this);
                // Add the frame to the frames array.
                this.frames.push(frame);
                // Re-index frames after a change
                this.indexFrames();
                return frame;
            } else {
                VYI.logger.prefix('VYI-Module').error('Invalid frame data passed!');
            }
        } else {
            VYI.logger.prefix('VYI-Module').error('No frame data passed!');
        }
    }
    /**
     * Removes the frame passed or the frame that exists at pIndex.
     * @param {Frame} pFrame - The frame to remove from this icon. pIndex should be not be used in tandem with this method of removing.
     * @param {number} pIndex - The index of the frame to remove. pFrame must be undefined to use this method for removing.
     * @returns {self} This icon instance.
     */
    removeFrame(pFrame, pIndex) {
        // The index used to remove this frame.
        let index;
        // Remove via reference to frame.
        if (this.frames.includes(pFrame)) {
            index = this.frames.indexOf(pFrame);
        // Remove via index passed.
        } else if (pIndex || pIndex === 0) {
            if (typeof(pIndex) === 'number') {
                const frame = this.getFrame(pIndex);
                if (frame) {
                    index = pIndex;
                }
            } else {
                VYI.logger.prefix('VYI-Module').error('Invalid pIndex type!');
            }
        } else {
            VYI.logger.prefix('VYI-Module').error('Failed to remove frame!');
        }
        if (typeof(index) === 'number') {
            // Remove the frame
            this.frames.splice(index, 1);
            // Re-index frames after a change
            this.indexFrames();
        }
        return this;
    }
    /**
     * Index the frames properly.
     * @private
     */
    indexFrames() {
        // Reorder the frames after removing.
        this.frames.forEach((pFrame, pIndex) => {
            pFrame.index = pIndex;
        });
    }
    /**
     * Reorders the frame in the animation. The index of the passed frame will be swapped with the frame at pIndex.
     * The "first" frame of the animation is technically this icon's dataURL. So if you are aiming to change the order of this icon and convert it into a frame.
     * pCurrentIndex must be set to -1 to match this icon.
     * @param {number} pCurrentIndex - The current index of the frame.
     * @param {number} pIndex - The index the frame will be moving to.
     * @returns {self} This icon instance.
     */
    reorderFrame(pCurrentIndex, pIndex) {
        if (typeof(pCurrentIndex) === 'number' && typeof(pIndex) === 'number') {
            let frameAtIndex;
            let currentFrame;
            // We check if the current index is -1, if it is then it means we want to treat this icon as a frame. As the icon data and delay of this icon serves
            // as the frame 0.
            if (pCurrentIndex === -1) {
                currentFrame = this;
            // Otherwise if the index passed can be found in the frames array, then we use that frame.
            } else if (this.frames[pCurrentIndex]) {
                currentFrame = this.frames[pCurrentIndex];
            }

            // We get the frame at the specified index.
            if (this.frames[pIndex]) {
                frameAtIndex = this.frames[pIndex];
            }

            // If both frames can be found, we can swap their data.
            if (currentFrame && frameAtIndex) {
                // Store frame data
                const currentFrameDataURL = currentFrame.getDataURL();
                const currentFrameDelay = currentFrame.getDelay();

                const frameAtIndexDataURL = frameAtIndex.getDataURL();
                const frameAtIndexDelay = frameAtIndex.getDelay();

                // Swap data from frame
                currentFrame.setDataURL(frameAtIndexDataURL);
                currentFrame.setDelay(frameAtIndexDelay);
                // Swap data to frame
                frameAtIndex.setDataURL(currentFrameDataURL);
                frameAtIndex.setDelay(currentFrameDelay);
            } else {
                VYI.logger.prefix('VYI-Module').error('There was no frame found at pCurrentIndex, or there was no frame found at pIndex!');
            }
        } else {
            VYI.logger.prefix('VYI-Module').error('Invalid type used!');
        }
        return this;
    }
    /**
     * Gets the frame existing at pIndex.
     * Frame 0 will actually be frame "1" in the animation. As this icon will actually be frame 0.
     * If you are trying to get "frame" 1. Then you will need to use the icon's delay and data url. As that is frame 0.
     * @param {number} pIndex - The index of the frame to get.
     * @returns {Frame|undefined} The frame found at pIndex.
     */
    getFrame(pIndex) {
        if (typeof(pIndex) === 'number') {
            return this.frames[pIndex];
        } else {
            VYI.logger.prefix('VYI-Module').error('Invalid type used!');
        }
    }
    /**
     * Returns an array of all the frames this icons has.
     * @returns {Array} An array of frames this icon has.
     */
    getFrames() {
        return [ ...this.frames ];
    }
    /**
     * Gets all the frames belonging to this icon.
     * @private
     * @returns {Array} An array containing the frame data of all frames.
     */
    getFramesData() {
        const frameDataArray = [];
        this.frames.forEach((pFrame) => {
            frameDataArray.push(pFrame.export());
        });
        return frameDataArray;
    }
    /**
     * Gets the state that has the name pName.
     * @param {string} pName - The name of the state to get.
     * @returns {Icon} The state that has the name of pName.
     */
    getState(pName) {
        for (const icon of this.states) {
            // If the state has the same name, return that state
            if (icon.getName() === pName) {
                return icon;
            }
        };
    }
    /**
     * Returns an array of all the states this icons has.
     * @returns {Array} An array of states this icon has.
     */
    getStates() {
        return [ ...this.states ];
    }
    /**
     * Gets all the states belonging to this icon.
     * @private
     * @returns {Array} An array containing the state data of all frames.
     */
    getStatesData() {
        const stateDataArray = [];
        // Loop state array to export relevant information.
        this.states.forEach((pState) => {
            stateDataArray.push(pState.exportAsState());
        });
        return stateDataArray;        
    }
    /**
     * Exports this icon as if it was a state in the proper vyi format.
     * @private
     * @returns {Array} An array of data related to this icon as if it were a state.
     */
    exportAsState() {
        const stateData = [];
        // state name
        stateData[0] = this.getName();
        // state dataURL
        stateData[1] = this.getDataURL();
        // state frame delay
        stateData[2] = this.getDelay();
        // state frame array
        stateData[3] = [];

        // Loop frame array to export relevant information.
        this.frames.forEach((pFrame) => {
            stateData[3].push(pFrame.export());
        });
        return stateData;
    }
    /**
     * Exports this icon's data into proper vyi format.
     * @private
     * @returns {Array} An array of data related to this icon in the proper vyi format.
     */
    export() {
        const iconData = [];
        // icon name
        iconData[0] = this.getName();
        // Get the size of this icon.
        const size = this.getSize();
        // icon width
        iconData[1] = size.width;
        // icon height
        iconData[2] = size.height;
        // frame delay
        iconData[3] = this.getDelay();
        // icon DataURL
        iconData[4] = this.getDataURL();
        // frame array
        iconData[5] = this.getFramesData();

        // this is actually an optional data entry into the vyi, only used if states actually exist on this icon.
        // this will save data
        if (this.states.length) {
            // states array
            iconData[6] = this.getStatesData();
        }
        return iconData;
    }
}