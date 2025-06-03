//This file contains exports for classes made for modularity

/**
 * An option list to specify name-action pairs
 */
export class HOptionList{
    constructor(){
        throw new Error("option list is a class meant to be used for other classes to extend.")
    }

    #list = []

    /**
     * @heavenly05
     * adds an option to the OptionList, returns true if successful
     * @param {HOption} option 
     * @returns {boolean}
     * @throws {Error}
     */
    addOption(option){
        if(!(option instanceof HOption)) throw new Error("option must be a instance of HOption")
        this.#list.push(option)
        return true
    }

    /**
     * @heavenly05
     * removes an option from the Option list based on the index 
     * @param {number} index 
     */
    removeOption(index){
        if(!(Number.isInteger(index))) throw new Error("index must be a number")
        this.#list[index] = undefined
    }

    /**
     * @heavenly05
     * returns a copy of the list of options.
     * @returns {HOption[]}
     */
    getOptions(){
        return this.#list.filter(v => v != undefined)
    }

    /**
     * @heavenly05
     * returns decorated options in a format like : [n] - option name
     * @returns {HOption[]}
     */
    getDecoratedOptions(){
        return this.getOptions().map((v,i) => {
            return new HOption(`[${i + 1} - ${v.getName()}]`, v.getAction())
        })
    }

    /**
     * @heavenly05
     * returns an option from the option list, return if the option does not exist
     * @param {number} index 
     * @returns {HOption | undefined}
     */
    getOption(index){
        if(!(Number.isInteger(index))) throw new Error("index must be a number")
        this.#list[index] = undefined
    }

    /**
     * @heavenly05
     * returns a stringified version of the OptionList
     * @returns {string}
     */
    toString(){
        let string = ""
        this.getDecoratedOptions().forEach(v => string += v.getName + "\n")
        return string
    }
}

/**
 * @heavenly05
 * A class meant to create an Option object to go with an OptionList
 */
export class HOption{
    /**
     * @heavenly05
     * creates a new option, containing a name for the option and an action. when performing an action the name is passed in as a parameter to the action function
     * @param {string} name 
     * @param {(option_name : string)()} action 
     */
    constructor(name, action){
        if(typeof name != 'string') throw new TypeError("name must be a string")
        if(typeof action != 'function' && action != undefined) throw new TypeError("action must be an function or must be undefined")
    }

    static #name
    static #action

    /**
     * @heavenly05
     * returns the name of the option
     * @returns {string}
     */
    getName(){
        return this.#name
    }

    /**
     * @heavenly05
     * Runs the specified action for the option
     */
    performAction(){
        if(this.#action != undefined)
        this.#action(this.getName())
    }

    /**
     * returns an options specified action.if not option is specified wull return undefined
     * @returns {() | undefined}
     */
    getAction(){
        return this.#action
    }

    toString(){
        return this.getName()
    }
}

export class HNO_PROJ_DIR_FOUND extends HOptionList{
    constructor(){
        this.addOption(new HOption("Specify A directory"))
        this.addOption(new HOption("Create a new Project Directory"))
    }
}