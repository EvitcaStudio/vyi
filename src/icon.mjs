import { VYI } from './vyi.mjs';
import { Frame } from './frame.mjs';

/**
 * @public
 */
export class Icon {
    /**
     * A map of icons that are state of this icon.
     * @private
     * @type {Map}
     */
    states = new Map();
    /**
     * A map of frames that are the frames of this icon.
     * @private
     * @type {Map}
     */
    frames = new Map();
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
     * The icon that owns this icon. This means this icon is state. 
     * @private
     * @type {Icon}
     */
    parent;
    /**
     * The vyi this icon belongs to.
     * 
     * @private
     * @type {VYI}
     */
    vyi;
    /**
     * A random unique Id attached to each icon to distinguish them from others in the event another icon shares the same name.
     * 
     * @private
     * @type {string}
     */
    id;
    /**
     * An set of used Ids to prevent collusion between duplicate named icons.
     * 
     * @private
     * @type {Set}
     */
    static reservedIds = new Set();
    /**
    * Generates a UUID (Universally Unique Identifier) version 4.
    * 
    * @private
    * @returns {string} The generated UUID.
    */
    static generateId() {
       const genId = () => {
           return Math.floor(Math.random() * 0xFFFFFFFF).toString(16).padStart(8, '0');
       }

       let id = genId();
       while (this.reservedIds.has(id)) {
           id = genId();
       }
       this.reservedIds.add(id);
       return id;
   }
    /**
     * Creates this icon instance.
     * @param {Array} pIconData - The icon data that is used to build this icon.
     * @private
     */
    constructor(pIconData) {
        this.parse(pIconData);
        this.assignId();
    }
    /**
     * Sets the vyi of this icon.
     * 
     * @private
     * @param {VYI} pVyi - The vyi that owns this icon.
     */
    setVyi(pVyi) {
        if (!pVyi) return;

        if (pVyi instanceof VYI) {
            this.vyi = pVyi;
        }
    }
    /**
     * Removes the vyi from this icon.
     * @private
     */
    removeVyi() {
        this.vyi = null;
    }
    /**
     * Assigns an Id to this icon.
     * @private
     */
    assignId() {
        this.id = Icon.generateId();
    }
    /**
     * Gets the id of this icon.
     * @returns {string} The id of this icon.
     */
    getId() {
        return this.id;
    }
    /**
     * Gets the vyi this icon belongs to.
     * @returns {VYI} The vyi this icon belongs to.
     */
    getVyi() {
        return this.vyi;
    }
    /**
     * Gets the icon this state belongs to. If this icon is not a state, it will return undefined.
     * @returns {Icon|undefined} The icon this state belongs to.
     */
    getParent() {
        return this.parent;
    }
    /**
     * Parses through the icon data and adds data to this icon.
     * @param {Array} pIconData - The icon data that is used to build this icon.
     */
    parse(pIconData) {
        if (!pIconData) return;

        // Loop through the icon data and create this icon
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
        if (typeof pWidth === 'number') {
            this.width = pWidth;
        }
        if (typeof pHeight === 'number') {
            this.height = pHeight;
        }
    }
    /**
     * Gets the width of the icon.
     * @returns {number} The width of the icon.
     */
    getWidth() {
        return this.width;
    }
    /**
     * Gets the height of the icon.
     * @returns {number} The height of the icon.
     */
    getHeight() {
        return this.height;
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
        if (typeof pDataURL === 'string') {
            this.dataURL = pDataURL;
        } else {
            VYI.logger.prefix('Vyi-module').error('Invalid data url type!');
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
        if (typeof pDelay === 'number') {
            this.delay = pDelay;
        } else {
            VYI.logger.prefix('Vyi-module').error('Invalid delay type!');
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
        if (typeof pName === 'string') {
            this.name = pName;
        } else {
            VYI.logger.prefix('Vyi-module').error('Invalid type for pName!');
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
        if (typeof pDelay === 'number') {
            this.setDelay(pDelay);
            this.getFrames().forEach((pFrame) => pFrame.setDelay(pDelay));
        } else {
            VYI.logger.prefix('Vyi-module').error('Invalid type for pDelay!');
        }
        return this;
    }
    /**
     * Adds a new frame to this icon.
     * @param {Frame|Array} pFrameData - The frame data to give this frame.
     * @returns {Frame|undefined} The frame that was added or undefined.
     */
    addFrame(pFrameData) {
        if (!pFrameData) {
            VYI.logger.prefix('Vyi-module').error('No frame data passed!');
            return;
        }

        if (!(pFrameData instanceof Frame) && !Array.isArray(pFrameData)) {
            VYI.logger.prefix('Vyi-module').error('Invalid frame data type passed!');
            return;
        }

        // Create the icon instance
        const frame = pFrameData instanceof Frame
            ? pFrameData
            : new Frame(pFrameData);

        if (frame.getWidth() !== frame.getWidth() || frame.getHeight() !== frame.getHeight()) {
            VYI.logger.prefix('Vyi-module').error('Frame dimensions do not match parent!');
            return;
        }

        frame.setParent(this);
        // We store this frame under its index in the Map 0-1
        this.frames.set(this.frames.size, frame);
        this.indexFrames();

        return frame;
    }
    /**
     * Removes the frame passed.
     * @param {Frame} pFrame - The frame to remove from this icon.
     * @returns {self} This icon instance.
     */
    removeFrame(pFrame) {
        if (!pFrame) return;
        if (pFrame instanceof Frame) {
            if (this.frames.delete(pFrame.index)) {
                pFrame.removeParent();
                this.indexFrames();
            }
        }
        return this;
    }
    /**
     * Removes the frame via it's index.
     * @param {number} pIndex - The index of the frame to remove.
     * @returns {self} This icon instance.
     */
    removeFrameByIndex(pIndex) {
        const frame = this.getFrame(pIndex);
        this.removeFrame(frame);
        return this;
    }
    /**
     * Index the frames properly.
     * @private
     */
    indexFrames() {
        this.getFrames().forEach((pFrame, pIndex) => {
            pFrame.index = pIndex;
        });
    }
    /**
     * Reorders the frame in the animation. The index of the passed frame will be swapped with the frame at pIndex.
     * The "first" frame of the animation is technically this icon's dataURL. So if you are aiming to change the order of this icon and convert it into a frame.
     * pCurrentIndex must be set to -1 to match this icon.
     * 
     * @param {number} pCurrentIndex - The current index of the frame.
     * @param {number} pIndex - The index the frame will be moving to.
     * @returns {self} This icon instance.
     */
    reorderFrame(pCurrentIndex, pIndex) {
        if (typeof pCurrentIndex === 'number' && typeof pIndex === 'number') {
            let frameAtIndex = this.getFrame(pIndex);
            let currentFrame = pCurrentIndex === -1 
                ? this
                : this.getFrame(pCurrentIndex)

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
                VYI.logger.prefix('Vyi-module').error('There was no frame found at pCurrentIndex, or there was no frame found at pIndex!');
            }
        } else {
            VYI.logger.prefix('Vyi-module').error('Invalid type used!');
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
        return this.frames.get(pIndex);
    }
    /**
     * Returns an array of all the frames this icons has.
     * @returns {Array} An array of frames this icon has.
     */
    getFrames() {
        return Array.from(this.frames.values());
    }
    /**
     * Gets all the frames belonging to this icon.
     * @private
     * @returns {Array} An array containing the frame data of all frames.
     */
    getFramesData() {
        const frameDataArray = this.getFrames().map((pFrame) => pFrame.export());
        return frameDataArray;
    }
    /**
     * Adds this icon data as a state. A state is also an icon.
     * @param {Array} pIconData - The data used to create this state icon.
     * @returns {Icon|undefined} The state that was added or undefined.
     */
    addState(pIconData) {
        if (!pIconData) {
            VYI.logger.prefix('Vyi-module').error('No icon data passed!');
            return;
        }

        if (!(pIconData instanceof Icon) && !Array.isArray(pIconData)) {
            VYI.logger.prefix('Vyi-module').error('Invalid icon data type passed!');
            return;
        }

        // Create the icon instance
        const state = pIconData instanceof Icon
            ? pIconData
            : new Icon(pIconData);

        if (state.getWidth() !== this.getWidth() || state.getHeight() !== this.getHeight()) {
            VYI.logger.prefix('Vyi-module').error('State dimensions do not match parent!');
            return;
        }

        state.setParent(this);
        state.setVyi(this.vyi);
        this.states.set(state.id, state);

        return state;
    }
    /**
     * Sets the parent for this state.
     * @private
     * @param {Icon} pParent - The parent icon of this state.
     */
    setParent(pParent) {
        if (!pParent || this.parent) return;
        if (pParent instanceof Icon) {
            this.parent = pParent;
        }
    }
    /**
     * Removes the parent and vyi from this state.
     * @private
     */
    removeParent() {
        if (this.parent) {
            this.parent = null;
            this.vyi = null;
        }
    }
    /**
     * Removes the state passed.
     * @param {Icon} pState - The state to remove from this icon.
     * @returns {self} This icon instance.
     */
    removeState(pState) {
        if (pState instanceof Icon) {
            if (this.icons.delete(pState.id)) {;
                pState.removeParent();
            }
        }
        return this;
    }
    /**
     * Removes the state via it's name. The LAST defined icon that has the passed name will be removed. As names are not unique.
     * @param {string} pName - The name to use to find the state.
     * @returns {self} This icon instance.
     */
    removeStateByName(pName) {
        const state = this.getState(pName);
        this.removeState(state);
        return this;
    }
    /**
     * Removes the state via it's id.
     * @param {string} pName - The id to use to find the state.
     * @returns {self} This icon instance.
     */
    removeStateById(pId) {
        const state = this.getStateById(pId);
        this.removeState(state);
        return this;
    }
    /**
     * Gets the state that has the name pName. The LAST defined state that has the passed name will be returned.
     * @param {string} pName - The name of the state to get.
     * @returns {Icon} The state that has the name of pName.
     */
    getState(pName) {
        if (typeof pName === 'string') {
            const states = this.getStates();
            for (let i = states.length - 1; i >= 0; i--) {
                const state = states[i];
                // If the icon has the same name, return that icon
                if (state.getName() === pName) {
                    return state;
                }
            }
        } else {
            VYI.logger.prefix('Vyi-module').error('Invalid name type used!');
        }
    }
    /**
     * Gets the state by the id provided.
     * @private
     * @param {string} pId - The id of the state.
     * @returns {Icon} The state that has the id that was passed.
     */
    getStateById(pId) {
        if (!pId) return;
        return this.states.get(pId);
    }
    /**
     * Returns an array of all the states this icons has.
     * @returns {Array} An array of states this icon has.
     */
    getStates() {
        return Array.from(this.states.values());
    }
    /**
     * Gets all the states belonging to this icon.
     * @private
     * @returns {Array} An array containing the state data of all frames.
     */
    getStatesData() {
        const stateDataArray = this.getStates().map((pState) => pState.exportAsState());
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
        stateData[3] = this.getFrames().map((pFrame) => pFrame.export());
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
        // icon width
        iconData[1] = this.getWidth();
        // icon height
        iconData[2] = this.getHeight();
        // frame delay
        iconData[3] = this.getDelay();
        // icon DataURL
        iconData[4] = this.getDataURL();
        // frame array
        iconData[5] = this.getFramesData();

        // This is actually an optional data entry into the vyi, only used if states actually exist on this icon.
        if (this.states.size > 0) {
            iconData[6] = this.getStatesData();
        }
        return iconData;
    }
}