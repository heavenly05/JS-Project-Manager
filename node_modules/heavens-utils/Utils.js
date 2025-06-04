
const asciiRange = [{min : 65, max : 90},{min : 97, max : 122}]
const audioFormats = [
    ".mp3",   // MP3
    ".aac",   // AAC
    ".ogg",   // OGG (Vorbis)
    ".wav",   // WAV
    ".flac",  // FLAC
    ".m4a",   // M4A
    ".wma"    // WMA
  ];
  
  const pictureFormats = [
    ".jpg",   // JPEG
    ".jpeg",  // JPEG
    ".png",   // PNG
    ".gif",   // GIF
    ".bmp",   // BMP
    ".tiff",  // TIFF
    ".svg",   // SVG
    ".webp"   // WebP
  ];
  

/**
 * @author Heaven Williams
 * @param {Number[]} array
 * @returns {Number | null}the sum of all numbers added together in an array
 */
function return_sum(array){
    if(Array.isArray(array)){
        array.reduce((p,v,i,a) => {
        return (typeof v == "number") ? (v + p) : 0
        }, 0)
    }
    return null;
}

/**
 * A function hat generates a random array of numbers, length being the amount of elements in the array, max being the maximum size of the array(inclusive), and inclusive being if 0 should be included or not.
 * @author Heaven Williams
 * @example
 * generateRandomArr(10,10,false);
 * //generates an array with 10 random values ranging from 1 - 10
 * @param {Number} length 
 * @param {Number} max 
 * @param {Boolean} inclusize 
 * @returns {number[]}
 */
function generateRandomArr(length, max, inclusize){
    let arr = []
    for(let i = 0; i < length; i++){
        arr.push((Math.round((Math.random() * (inclusize ? max : (max - 1) )))) + (inclusize ? 0 : 1))
    }
    return arr;
}

/**
 * Generates a psuedo-random string with a fixed length, Utilizes ascii ranges and randomly chooses uppercase and lowercase letters.
 * @author Heaven Williams
 * @param {number} length
 * @returns {string}
 * @example 
 * const secret_key = generateRandomString(10)
 * //generates a 10 letter string
 */
function generateRandomString(length){
    const asciiRange = [{min : 65, max : 90},{min : 97, max : 122}]

    let randomString = "";
    for(let i = 0; i < length; i++){
        let range = asciiRange[Math.random() <= 0.5 ? 0 : 1];

        let charCode = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;

        randomString += (String.fromCharCode(charCode))
    } 
    return randomString;
}

/**
 * @author Heaven Williams
 * @param {any[]} arr 
 * @param {any} val 
 * @returns 
 */
function valueInArray(arr , val){
    if(!Array.isArray(arr)) throw new Error("arr must be an Array.")
    let contains = false
    arr.forEach((v) =>{
        if(val == v) contains = true
        return
    })
    return contains
}


/**
 * Generates a psuedo-random number with a fixed length, each number being 1 - 9
 * @author Heaven Williams
 * @param {number} length
 * @returns {number}
 * @example 
 * const secret_key = generateRandomNumber(10)
 * //generates a random 10 digit number and automatically parses it to an integer.
 */
function generateRandomNumber(length){
    let numberString = "";
    for(let i = 0; i < length; i++){
        let number = ((Math.floor(Math.random() * 10)));
        numberString += (number + ((number <= 0 && i == 0) ? 1 : 0)).toString();
    }
    return parseInt(numberString)
}

/**
 * Generates a psuedo-random string mixed with numbers and letter with a fixed length
 * @author Heaven Williams 
 * 
 * @param {number} length
 * @returns {string}
 * @example 
 * const secret_key = generateRandomMixedString(10)
 * //generates a random 10 character string that can contain a mix of letters and numbers
 */
function generateRandomMixedString(length){
    let mixedString = "";
    for(let i = 0; i < length; i++){
        let random = (Math.random() <= 0.5 ? generateRandomNumber(1) : generateRandomString(1));
        mixedString += random;
    }
    return mixedString;
}

/**
 * @author Heaven Williams
 * @returns {string} Returns the current date in a acceptable string format.
 */
function getDate(){
    let date = new Date()
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
}


function getSupportedAudioFormats(){
    return audioFormats;
}

function getSupportedImageFormats(){
    return pictureFormats;
}


function pathToAabsolutePath(path){
    return new String(path).split("\\")
}

function splitPath(path){
    return (new String(path).includes("\\")) ? split("\\") : null
}

/**
 * Takes ina  tring and converts it into an array, character by character.
 * @author Heaven Williams
 * @param {string} string 
 * @returns {string[]} an array representation fo a string
 * @example 
 * cosnt myName = stringToArray("heaven") 
 * //returns [h,e,a,v,e,n]
 */
function stringToArray(string){
    if(typeof string != "string") throw new Error("string is not a type of string.")
    let arr = []
for(let i = 0; i < string.length; i++){
    arr.push(string.slice(i,i+1))
}

return arr
}

/**
 * Converts every value in an array into a string and returns the ew array
 * @author Heaven Williams
 * @param {any[]} arr 
 * @returns {string[]}
 * @example
 * const arr = ArraytoStringArray([1,2,"hop",3])
 * //returns : ["1", "2", "hop", "3"]
 */
function ArrayToStringArray(arr){
    if(!Array.isArray(arr)) throw new Error("arr is not an array.")
    return arr.map((v) => v.toString())
}


/**
 * Converts a string to a an array then converts each character to their character.
* @author Heaven Williams
 * @param {string} string 
 * @returns {Int8Array}
 * @example
 * c
 */
function stringToByte(string){
    if(typeof(string) != "string") throw new Error("string does not have the type of sting")
    //returns an array of bytes of a string
    return stringToArray(string).filter(v => typeof(v) == "string").map(v => v.charCodeAt(0))
}

/**
 * Converts a JSON object into an array of bytes. No need to stringify.
 * @author Heaven Williams
 * @param {JSON} obj 
 * @returns {Int8Array}
 * @example
 * const obj = JSONToByte({hello : "world"})
 * //returns : [123,  34, 104, 101, 108, 108, 111,  34,  58,  34, 119, 111, 114, 108, 100, 34, 125]
 */
function JSONToByte(obj){
    if(typeof(obj) != "object") throw new Error("obj is not an object.")
    return stringToByte(JSON.stringify(obj))
}

/**
 * Attempts to convert an array into an array of Bytes
 * @author Heaven Williams
 * @param {any[]} arr 
 * @returns {Int8Array | number[]}
 * @example
 * const bytes = arrToBytes([1,2,3]
 * //returns [ 49, 50, 51 ]
 */
function arrToBytes(arr){
    if(!Array.isArray(arr)) throw new Error("arr is not an array")
    return arr.map((v) => stringToByte(v.toString())[0])
}


/**
 * Attempts to convert any value into a byte, it converts it to a string first and then turns it into a byte, different outputs may appear depending on the input
 * @author Heaven Williams
 * @param {any} data 
 * @returns {Int8Array | unknown}
 * @example 
 * const byte = anyToByte(1)
 * //returns [49]
 */
function anyToByte(data){
    return stringToByte(data.toString())
}

/**
 * Converts a single byte to a Character, assuming the inputted number is a byte
 * @author Heaven Williams
 * @param {number} byte 
 * @returns {string}
 * @example
 * const letter = byteArrToChar(49)
 * // returns 1 (the number 1 is number 49 in the ASCII encoding table)
 */
function byteToChar(byte){
    if(!Number.isInteger(byte)) throw new Error("byte is not an integer")
    return String.fromCharCode(byte)
}


/**
 * Converts mutliple bytes back into strings and returns them in an array
 * @author Heaven Williams
 * @param {...number} bytes
 * @returns {string[]}
 * @example
 * const letter = bytesToString(49, 50, 51)
 * // returns [1,2,3]
 */
function bytesToString(...bytes){
    return bytes.filter(byte => Number.isInteger(byte)).map(v => byteToChar(v))
}


/**
 * Converts an array of bytes back into strings and returns them in an array
 * Differs from bytesToString because you can pass n actually array, and not just paramaters to the function.
 * @author Heaven Williams
 * @param {number[]} bytes
 * @returns {string[]}
 * @example
 * const letter = bytesArrToChars([49,50,51])
 * // returns [1,2,3]
 */
function byteArrToChars(arr){
    if(!(Array.isArray(arr))) throw new Error("arr is not an Array")
    return arr.filter(byte => Number.isInteger(byte)).map(v => byteToChar(v))
}

/**
 * takes in an array of character codes and converts them into characters. Includes an optional offset parameter
 * @param {Array} arr 
 * @param {number} offset 
 * @returns {string[]}
 */
function charCodeArrToChar(arr, offset = 0){
    if(!Array.isArray(arr)) throw new Error("Arr is not type of array")
    if(typeof(offset) != "number") throw new Error("Offset is not a number.")
        return arr.map((v) => {
        if(typeof(v) == "number") return String.fromCharCode((offset + v))
    })
}

    
/**
 * Takes in a number of seconds and auto formats a short sentence to the nearest conversion.
 * @param {number} seconds 
 * @returns {string}
 */
function secondsToString(seconds){
    if(typeof(seconds) != "number") throw new Error("Seconds must be a number.")

    return (seconds <= 60) ? `${seconds} seconds`: ((seconds / 60) <= 60) ? `${Math.round(seconds / 60)} minutes and ${seconds % 60} seconds` : `${Math.round((seconds/60) / 60)} hours and ${Math.round((seconds / 60) % 60)} minutes`
}


/**
 * filters through an array of strings and turns the strings into numbers, will filter out aythng that cannot be turned into a number 
 * @param {string[]} arr 
 * @returns {number[] | any[]}
 */
function arrayToNumArray(arr){
    if(!Array.isArray(arr)) throw new Error("arr is not an array")

    return ArrayToStringArray(arr).map((v) => {
            let number = Number.parseInt(v)
            if(!Number.isNaN(number)) return number
    }).filter((v) => typeof(v) == "number")
}

/**
 * Takes in an array of indexes and "indexes" a selected array with the indexes in the index array. returns an array of the values. If a value isnt present at an index it will be undefined in the returned array. the offset value will shift all array indexes by the offset. for example if you wanted to shift the offset down by 1, you would put -1 if you do not want to shift the array you can put 0 or omit the parameter as by default it is 0.
 * @param {number[]} arr_of_indexs 
 * @param {any[]} arr 
 * @param {number} offset 
 * @returns {any[]}
 */
function indexArrN(arr_of_indexs, arr, offset = 0){
    if(!Number.isInteger(offset)) throw new Error("offset must be an integer.")
    if(!Array.isArray(arr)) throw new Error("arr is not an Array.")
    if(!Array.isArray(arr_of_indexs)) throw new Error("arr_of_indexs is not an Array.")
    return arr_of_indexs.filter((v) => (typeof(v) == "number")).map((v) => {return arr[v + offset]})
}

/**
 * 
 * @param  {...any[]} arrs Takes multiple arrays and returns a new array of all combned values of all the entered arrays. if a passed in value is not an array, it will skip over it.
 * @returns any[]
 */
function joinArrs(...arrs){
    //takes a bunch of arrays and combines all the values of them into one array, ignores all values that are not arrays
    const new_array = []

    arrs.filter((v) => Array.isArray(v)).forEach(c => c.forEach((p) => new_array.push(p)))

    return new_array
}

/**
 * Takes in an array full of array and combines all the inner arrays into one.
 * @param {any[]} arr 
 * @returns {any[]}
 */
function joinArrayOfArrays(arr){
    if(!Array.isArray(arr)) throw new Error("arr is not an array")
    const new_arr = []
    arr.filter(v => Array.isArray(v)).forEach(v => v.forEach(p => new_arr.push(p)))
    return new_arr
}

function decimalToBinary(dec){
    if(typeof(dec) != "number") throw new Error("dec must be a typeof number.")

    return (dec >>> 0).toString(2)
}

function decArrToBinArr(arr){
    if(!Array.isArray(arr)) throw new Error("arr in not an array.")
        return arr.map((v) => {
            if(typeof(v) == "number") return decimalToBinary(v)
    })
}
    

/**
 * A function the determine whether 2 arrays contain the same contnet. The sort paramater determines if the array should be presorted to see if they contain the same values, regardless of the order the elements are in. by default, sort is set to true meaning the function will autosort the arrays. if sort is set to false the arrays wont be autosorted and must have the same order to pass.
 * @param {any[]} arr1 
 * @param {any[]} arr2 
 * @param {boolean} in_order 
 * @returns {boolean}
 */
function arraysHaveSameContent(arr1, arr2, sort = true) {
    if(!Array.isArray(arr1)) throw new Error("arr1 is not an array.")
    if(!Array.isArray(arr2)) throw new Error("arr2 is not an array.")
    if(typeof(sort) != "boolean") throw new Error("sort is not a boolean.")

    if (arr1.length !== arr2.length) return false;

    if(sort){
        arr1 = [...arr1].sort();
        arr2 = [...arr2].sort();
    }
    
    return arr1.every((element, index) => element === arr2[index]);
  }

  /**
   * returns whether or not a multiple arrays contian the same content
   * @param {boolean} sort 
   * @param  {...[]} arrs 
   * @returns boolean
   */
  function multipleArraysHaveSameContent(sort = true, ...arrs) {
        if(typeof sort != "boolean") throw new Error("sort must be a boolean")
    // Filter out non-array arguments
    arrs = arrs.filter((v) => Array.isArray(v));
    // If there are fewer than 2 arrays, return true (nothing to compare)
    if (arrs.length < 2) return true;

    // If order doesn't matter, sort all arrays
    if (sort) {
        arrs = arrs.map(arr => [...arr].sort());
    }

    // Compare the first array with all others
    const firstArray = arrs[0];
    return arrs.every(arr => {
        if (arr.length !== firstArray.length) return false; // Length mismatch
        return arr.every((element, index) => element === firstArray[index]); // Element mismatch
    });
}
/**
 * Goes through an array of arrays to see if each array contains the same values
 * @param {any[]} arr 
 * @param {boolean} sort 
 * @returns {boolean}
 */
export function arrayOfMultpleArraysHaveSameContent(arr, sort = true){
    if(!Array.isArray(arr)) throw new Error("arr is not an array")
    if(typeof sort != "boolean") throw new Error("sort must be a boolean")
    // Filter out non-array arguments
    arr = arr.filter((v) => Array.isArray(v));
    // If there are fewer than 2 arrays, return true (nothing to compare)
    if (arr.length < 2) return true;

    // If order doesn't matter, sort all arrays
    if (sort) {
        arr = arr.map(arr => [...arr].sort());
    }

    // Compare the first array with all others
    const firstArray = arr[0];
    return arr.every(arr => {
        if (arr.length !== firstArray.length) return false; // Length mismatch
        return arr.every((element, index) => element === firstArray[index]); // Element mismatch
    });
}

/**
 * Returns the amout of time a value aears in an array.
 * @param {any[]} arr 
 * @param {any} value 
 * @returns {number}
 */
function countOccurences(arr, value){
    if(!Array.isArray(arr)) throw new Error("arr is not an array.")
    
    return arr.filter(v => v === value).length
}

function viewToArr(byteArr){
    if(!ArrayBuffer.isView(byteArr)) throw new Error("byteAr is not a view")

    return (Array.from(byteArr))
}


class InstanceWrapper {
    constructor(originalObject) {
      this.instance = originalObject;
    }
  
    getInstance() {
      return this.instance;
    }
  
    logInstance() {
      console.log("Current Instance:", this.instance);
    }
  
    updateInstance(key, value) {
      if (this.instance.hasOwnProperty(key)) {
        this.instance[key] = value;
      } else {
        console.warn(`Key "${key}" does not exist on the instance.`);
      }
    }
  }
  
/**
 * returns the average of a dataset of number
 * @param {number[]} dataArr 
 * @returns {number}
 */
function getMean(dataArr){
    if (!Array.isArray(dataArr)) throw new Error('data Array is not an array')
    return dataArr.reduce((acc, val) => acc + val, 0) / dataArr.length;
}

/**
 *  variance tells us how spread apart numebrs are from each other, based on the mean/average of a data set like a scatter plot if the points are far from each other and they look random then they have high variance meaning they vary alot, hwoever if we get a kinda straight line they dont vary much and low variance. depending on what your looking for you might want high or low variance. there is no term for high variance i

    variance has a formula, it uses sigma, the sum of all data point, timesa^2  (x - mean)^2/n x being the current data mean being the mean of the data set

    the number you get will give you how far MOST numebrs in the set tend to be fromt he mean. jsut an estimate

    square rooting both sides of the equation gives you the standard deviation which is th evariance but in original units and not squared terms.
 * @param {number[]} dataArr 
 * @returns {number}
 */
function getVariance(dataArr){
    if (!Array.isArray(dataArr)) throw new Error('data Array is not an array')
   
    let mean = getMean(dataArr)

    return (dataArr.reduce((acc, val) => acc +  Math.pow((val - mean), 2), 0) / dataArr.length)

}

/**
 * Returns the standard deviation of a set of number
 * @param {number[]} dataArr 
 * @returns {number}
 */
function getStdDeviationWV(dataArr){
    if (!Array.isArray(dataArr)) throw new Error("Data Array is not an array")
    //automatically applies variance
    return Math.sqrt(getVariance(dataArr))
}

/**
 * returns the smallest integer that can divide another integer evenly that isnt one. a null result means the number is prime
 * @param {number} numb 
 * @returns {number}
 */
function getSmallestDivisor(numb){
    if(!Number.isInteger(numb)) throw new Error("numb is not an integer.")
        for(let i = 2; i < numb; i++){
            if(numb % i == 0) return i
        }
        //null means number is prime
    return null
}

/**
 * returns the greatest integer that can divide another integer evenly that isnt one. a null result means the number is prime
 * @param {number} numb 
 * @returns {number}
 */
function getGreatestDivisor(numb){
    if(!Number.isInteger(numb)) throw new Error("numb is not an integer.")
        for(let i = (numb - 1); i > 2; i--){
            if(numb % i == 0) return i
        }
        //null means number is prime
    return null
}
  
/**
 * Applys the growth formula to a set of parameters 
 * @param {number} initial 
 * @param {number} rate 
 * @param {number} time 
 * @returns {number}
 */
function growthFormula(initial, rate, time){
    if(typeof initial != "number") throw new Error("initial is not an number.")
    if(typeof rate != "number") throw new Error("rate is not an number.")
    if(typeof time != "number") throw new Error("time is not an number.")
    return initial * Math.pow((1 + rate/100), time)
}

/**
 * Applys the decay formula to a set of parameters 
 * @param {number} initial 
 * @param {number} rate 
 * @param {number} time 
 * @returns {number}
 */
function decayFormula(initial, rate, time){
   if(typeof initial != "number") throw new Error("initial is not an number.")
    if(typeof rate != "number") throw new Error("rate is not an number.")
    if(typeof time != "number") throw new Error("time is not an number.")

    return initial * Math.pow((1 - rate/100), time)
}

/**
 * Returns whether or not the subject is a class or not. A property will be temporarily added the the prototype of the subject - if the class has a property or method witht he name of: __$test$_, it iwll b overwritten and set to null
 * @param {any} subject 
 * @returns {boolean}
 */
function isClass(subject){
    try{
    if(!subject.prototype) return false
    if (typeof subject !== "function") return false;
    if (/^class\s/.test(Function.prototype.toString.call(subject))) return true;

    if(["String", "Number", "Boolean", "Object", "Array", "Map", "Set", "Date", "Error"].includes(subject.name)) return true

    return Object.getOwnPropertyNames(subject.prototype).length > 1;
    }catch(e){
        return false
    }
    
}

/**
 * returns true/false based on whether the subject is a primitive value or not.
 * @param {any} subject
 * @returns {boolean}
 */
function isPrimitive(subject){
    return ["undefined","object","boolean","number","bigint","string","symbol","function"].includes(typeof subject)
}
/**
 * A class ued to define an incrementable node, It goes up one by one until it reaches a maximimum value then it will increment another node. Can be useful for mny scenarioes and uses
 * 
 * @author Heaven
 */

class INode{
    constructor(max, zero_indexing = true){
        if(!Number.isInteger(max)) throw new Error("max must be a number")
        if(typeof(zero_indexing) != "boolean") throw new Error("zero_indexing must be a boolean.")
        if(max <= 0) throw new Error("Max must be greater than zero")
            this.#max = max
            this.#next_node = undefined
            this.#previous_node = undefined
            this.#zero_indexng = zero_indexing
            this.#value = (this.#zero_indexng == true)? 0 : 1
    }
    #zero_indexng
    #max
    #value
    #next_node
    #is_single_node = true
    #previous_node
    
    /**
     * Sets the next node ( to the right of the current node)
     * @author Heaven Williams
     * @param {INode} next_node
     * 
     * @example
     * const myNode = new INode(10).setNextNode(new Inode(10))
     */
    setNextNode(next_node){
        if(!(next_node instanceof INode)) throw new Error("Next node must be of type INode.")
        this.#is_single_node = false
        this.#next_node = next_node
    }


    /**
     * Sets the previous node ( to the left of the current node)
     * @author Heaven Williams
     * @param {INode} prev_node
     * 
     * @example
     * const myNode = new INode(10).setPreviousNode(new Inode(10))
     */
    setPreviousNode(prev_node){
        if(!(prev_node instanceof INode)) throw new Error("Previous node must be of type INode.")
        this.#previous_node = prev_node
        this.#is_single_node = false
    }


    /**
     * flags the next node as intentionally empty
     * @author Heaven Williams
     *  
     * @example
     * const myNode = new INode(10)
     * myNode.setNoNextNode()
     * 
     */
    setNoNextNode(){
        this.#next_node = undefined
        this.#is_single_node = (this.getPreviousNode() instanceof INode) ? false  : true
    }

    /**
     * flags the previous node as intentionally empty
     * @author Heaven Williams
     *  
     * @example
     * const myNode = new INode(10)
     * myNode.setNoPreviousNode()
     * 
     */
    setNoPreviousNode(){
        this.#previous_node = undefined
        this.#is_single_node = (this.getNextNode() instanceof INode) ? false  : true
    }
    
    /**
     * Returns true if the selceted node has an next node otherwise it will return false.
     * @author Heaven Williams
     * @returns {boolean}
     * 
     * @example
     * const myNode = new INode(10)
     * myNode.hasNoNextNode()
     * //returns true
     */
    hasNoNextNode(){
        return (this.getNextNode() == undefined)  && (!(this.getNextNode() instanceof INode))
    }

    /**
     * Returns true if the selceted node has an previous node otherwise it will return false.
     * @author Heaven Williams
     * @returns {boolean}
     * 
     * @example
     * const myNode = new INode(10)
     * myNode.hasNoPreviousNode()
     * //returns true
     */
    hasNoPreviousNode(){
        return (this.getPreviousNode() == undefined)  && (!(this.getPreviousNode() instanceof INode))
    }

    /**
     * Returns the maxmum value of the node
     * @author Heaven Williams
     * @returns {number}
     * 
     * @example
     * const myNode = new INode(10)
     * myNode.getMax()
     * //returns 10
     */
    getMax(){
        return this.#max
    }


    /**
     * Returns the previous node of the current node. If a previous node has not been set or the setPreviousNode() was called it will return undefined
     * @author Heaven Williams
     * @returns {INode | undefined}
     * 
     * @example
     * ```js
     * const myNode = new INode(10)
     * myNode.setPreviousNode(new INode(10))
     * myNode.getPreviousNode()
     * //returns Inode{}
     * ```
     */
    getPreviousNode(){
        return (this.#previous_node instanceof INode) ? this.#previous_node : undefined 
    }

    /**
     * Returns the next node of the current node. If a  next node has not been set or the setNoNextNode() was called it will return undefined
     * @author Heaven Williams
     * @returns {INode | undefined}
     * 
     * @example
     * ```js
     * const myNode = new INode(10)
     * myNode.setNextNode(new INode(10))
     * myNode.getNextNode()
     * //returns Inode{}
     * ```
     */
    getNextNode(){
        return (this.#next_node instanceof INode) ? this.#next_node : undefined
    }

    /**
     * returns true if zeroindexing is enabled
     * @returns {boolean}
     */
    zeroIndexingEnabled(){
        return this.#zero_indexng
    }

    /**
     * Performs a series of steps to increment the node
     */
    incrementNode(){
    //ngl i dont remember what half this does...
    if(!(this.getNextNode() instanceof INode) && !(this.hasNoNextNode()) ) throw new Error("Next node must be of type INode.")

    
    //the last element in the array will call increment on itelf and reset the previous nodes value.

    if(this.hasNoNextNode() && !this.hasNoPreviousNode() && !this.isAtMax()){
    //this would be the last node (first in the array)
            this.incrementValue()
            this.getPreviousNode().resetValue()
        return
    }



    if(this.isSingleNode() && !this.isAtMax()){
        //scenario where this is the only node and its not at its max. increment it
        this.incrementValue()
        return
    }

    if(this.hasNoPreviousNode() && !this.isAtMax()){
        //if this is the first node, (last in the array) is not at its max increment it 
        this.incrementValue()
        return
    }else if(this.hasNoPreviousNode() && this.isAtMax()){
        //if this is the first node (last in the array) is at its max and the next node is not at its max increment the next node, the next node will increment itself and it will reset the previous nodes value if needed.
        this.getNextNode().incrementNode()
        return
    }
    
    if(!this.isAtMax() && this.getPreviousNode().isAtMax()){
        //if this is not at max and the previous 
        this.getPreviousNode().resetValue()
        this.incrementValue()
        return
    }else if(this.isAtMax() && this.getPreviousNode().isAtMax() && !this.getNextNode().isAtMax()){
        this.resetValue()
        this.getPreviousNode().resetValue()
        this.getNextNode().incrementValue()
        return
    }else if(this.isAtMax() && this.getPreviousNode().isAtMax() && this.getNextNode().isAtMax()){
        this.getPreviousNode().resetValue()
        this.getNextNode().incrementNode()
        return
    }



    //the first should jsut be steadily incremented
    
        //if the next node is at is max and so are you, run incrementnode on the net node so it can pass on down the line. just to check to make sure everyhing is going right. if nothing happens, you dont have to worry about ti.
        
    }

    /**
     * increments the value of this ndoe
     */
    incrementValue(){
        this.#value++
    }

    /**
     * retunrs the current value of this node
     * @returns {number}
     */
    getValue(){
        return this.#value
    }

    /**
     * returns if the node is at max or not
     * @returns {boolean}
     */
    isAtMax(){
        return (this.#value >= this.#max)
    }

    /**
     * Resets the nodes value, will reset to zero or one based on if zero indexing is enabled
     */
    resetValue(){
        this.#value = (this.#zero_indexng == true)? 0 : 1
    }

    /**
     * Returns the default value of the node, when it is reset.
     * @returns {0 | 1}
     */
    getDefaultValue(){
        return (this.#zero_indexng == true)? 0 : 1
    }  

    /**
     * returns whether the selected node is a boolean or not.
     * @returns {boolean}
     */
    isSingleNode(){
        return this.#is_single_node
    }
}

/**
 * @param {number} max
 * @param {number} node_count
 * @param {boolean} zero_indexing
 * 
 */
class INodeList{
    constructor(max, node_count, zero_indexing = true){
        if(!Number.isInteger(max)) throw new Error("max must be a number")
        if(!Number.isInteger(node_count)) throw new Error("node_count must be a number")

        if(typeof(zero_indexing) != "boolean") throw new Error("zero_indexing must be a boolean.")

        if(max <= 0) throw new Error("Max must be greater than zero")
        if(node_count <= 0) throw new Error("node_count must be greater than zero")

        this.#max = max
        this.#zero_indexing = zero_indexing
    
         for(let i = 0; i < node_count; i++){
                this.getList().push(new INode(this.getMax(), zero_indexing))
            }
    
            this.getList().forEach((v,i,a) => {
                if(!(v instanceof INode)) throw new Error("v is not and instance of INode.")
                    //if i == 0, it is the last element of the network, (first in the array since were going right to left) flag it to have no next node, if the network has more than one element, set its revious node to the next element in the array
                if(i == 0) {
                    v.setNoNextNode()
                    if(a.length > 1) v.setPreviousNode(a[i+1])
                    return
                }
                
                //if i == a.length - 1 it is the first element of the network (last in the array since were going right to left), flag it to have no previous node a.lenght - 2 checks if there is at least 2 elements in the array (total) if there is sets the next node of the first node to the second to last element in the array which would be the second element in the network (Right to left)
                if(i == (a.length - 1)){
                    v.setNoPreviousNode()
                    if((a.length - 2) >= 0) v.setNextNode(a[i-1])
                    return
                }

                v.setNextNode(a[i-1])
                v.setPreviousNode(a[i+1])
            })
    }

    #list = []
    #max
    #zero_indexing

    /**
     * returns whether zero ndexing is enabled
     * @returns {boolean}
     */
    zeroIndexingEnabled(){
        return this.#zero_indexing
    }

    /**
     * returns the array of nodes
     * @returns {Array}
     */
    getList(){
        return this.#list
    }

    /**
     * returns the maximum value of the nodes wthin the Network
     * @returns {number}
     */
    getMax(){
        return this.#max
    }

    /**
     * returns the number of nodes within the network
     * @returns {number}
     */
    getNodeCount(){
        return this.#list.length
    }

    /**
     * 
     * @returns 
     */
    getOutComes(){
        //this only returns the amount of outcoes the user asked for. there will always be more outcomes because of the way we made this, but the user can still specify how far they want to go with the increentN times.
        return Math.pow(this.#max + ((this.#zero_indexing == true)? 1 : 0), this.getNodeCount())
    }



    resetList(){
        this.getList().forEach(v => v.resetValue())
    }

    /**
     * 
     * @param {number} node_id 
     * @returns 
     */
    getNode(node_id){
        if(!Number.isInteger(node_id)) throw new Error("Node ID is not an number")

        if(node_id > (this.getNodeCount() - 1)|| node_id < 0) throw new Error("Invalid node id. It does not exist in the Network.")

        let node = this.#list[(node_id)]
        return ( node instanceof INode) ? node : null
    }

    getNodeValueArr(){
        return this.#list.map((v) => {
            if((v instanceof INode)){
                return v.getValue()
            }
        })
    }

    nodesMaxedOut(){
        return this.#list.every((v) => {
            if((v instanceof INode)) return v.isAtMax()
        })
    }

    incrementList(){
         if(!this.nodesMaxedOut()){
            let last_node = this.getList()[this.getList().length - 1]
            if(!(last_node instanceof INode)) throw new Error("First node is not an instance of INode")
            last_node.incrementNode()
        }
    }

    incrementListN(times){
        if(!(Number.isInteger(times))) throw new Error("Times is not an integer.")
            for(let i = 0; i < times; i++) this.incrementList()
    }
}

/**
 * Follows LIFO, (Last in First Out) The last element to go into the stack will be first to be out. can be used for things like undo operations, purel for example
 */
class HStack{
    /**
     * type and size are optional
     * Type allows you to use a generic to only allow specific objects to be placed in the stack. you must pass in a class
     * @param {Object | undefined} type 
     * @param {number | undefined} size 
     */
    constructor(type,size){
        if(!isClass(type) && type != undefined) throw new Error("type must be an class.")
        if(!Number.isInteger(size) && size != undefined) throw new Error("size must be an number.")

        this.#generic = type
        this.#size = size
    }

    #list = []
    #generic
    #size 

    /**
     * returns a copy of the stack
     * @returns {unknown[]}
     */
    peekList(){
        return Array.from(this.#list)
    }

    /**
     * returns the number of elements on the stack
     * @returns {number}
     */
    getElementCount(){
        return this.#list.length
    }

    /**
     * returns  the next element on the Stack without removing it/ if there is no element returns undefined
     * @returns {unknown | undefined}
     */
    peek(){
        return this.#list[this.getElementCount() - 1]
    }

    /**
     * removes the last element from an array and returns it. If the stack is empty, undefined is returned and the stack is not modified
     * @returns {unknown | undefined}
     */
    pop(){
        return this.#list.pop()
    }

    /**
     * push a new element onto the stack
     * if the element is primitive the stack will autoconvert to the clas accodingly, however there is no support for objects, undefined, null and functions.
     * @param {unkown} element 
     */
    push(element){
        //if a primitive value was pushed into the stack we can assume that the generic is a Primitive wrapper
        try {
            
            if(typeof element == "boolean" && this.#generic == Boolean){ element = new Boolean(element)}
            else if(typeof element == "number" && this.#generic == Number){ element = new Number(element)} else if(typeof element == "string" && this.#generic == String){element = new String(element)} else if (typeof element == "bigint" && this.#generic == BigInt) {element = new BigInt(element)} else if(typeof element == "symbol" && this.#generic == Symbol) {element = new Symbol(element)}

            if(this.#generic != undefined && !(element instanceof this.#generic)) throw new Error()
        
        } catch (error) {

            throw new Error("Element must be instansiated from the class: " + this.#generic + " received ["  + (["boolean","number","bigint","string","symbol"].includes(typeof element) ? typeof element : element) + "].")
        }
        
        if(this.#size != undefined && (this.getElementCount() + 1) > this.#size) throw new Error("element exceeds Stacks Maximum size which is " + this.#size + " elements.")
        this.#list.push(element)
    
    }

    /**
     * 
     * @returns {string} A stringified version of the stacklist, ca be parsed back into an array.
     */
    toString(){
        return JSON.stringify(this.peekList())
    }
}

/**
 * Queue's support the FIFO (First in First Out) the frst items to come into the queue are the first ones to leave
 */
class HQueue{
    /**
     * type and size are optional
     * Type allows you to use a generic to only allow specific objects to be placed in the stack. you must pass in a class
     * @param {Object | undefined} type 
     * @param {number | undefined} size 
     */
    constructor(type,size){
        if(!isClass(type) && type != undefined) throw new Error("type must be an class.")
        if(!Number.isInteger(size) && size != undefined) throw new Error("size must be an number.")

        this.#generic = type
        this.#size = size
    }
    #list = []
    #generic
    #size
    /**
     * returns a copy of the queue
     * @returns {unkown[]}
     */
    peekList(){
        return Array.from(this.#list)
    }

    /**
     * returns the number of elements in the Queue
     * @returns {number}
     */
    getElementCount(){
        return this.#list.length
    }

    /**
     * returns the first element on the Queue without removing it from the Queue
     * @returns {unknown | undefined}
     */
    peek(){
        return this.#list[0]
    }


    /**
     * ushes an element into the Queue
     * @param {unknown} element 
     */
    push(element){
         //if a primitive value was pushed into the stack we can assume that the generic is a Primitive wrapper
        try {
            
            if(typeof element == "boolean" && this.#generic == Boolean){ element = new Boolean(element)}
            else if(typeof element == "number" && this.#generic == Number){ element = new Number(element)} else if(typeof element == "string" && this.#generic == String){element = new String(element)} else if (typeof element == "bigint" && this.#generic == BigInt) {element = new BigInt(element)} else if(typeof element == "symbol" && this.#generic == Symbol) {element = new Symbol(element)}

            if(this.#generic != undefined && !(element instanceof this.#generic)) throw new Error()
        
        } catch (error) {

            throw new Error("Element must be instansiated from the class: " + this.#generic + " received ["  + (["boolean","number","bigint","string","symbol"].includes(typeof element) ? typeof element : element) + "].")
        }
        
        if(this.#size != undefined && (this.getElementCount() + 1) > this.#size) throw new Error("element exceeds Queue's Maximum size which is " + this.#size + " elements.")
        this.#list.push(element)
    }

    /**
     * removes the first element in the Queue and returns it.
     * @returns {unknown | undefined}
     */
    pull(){
        return this.#list.shift()
    }

}

/**
 * An interface for the intenal workings of the HOptonList 
 */
export class HOptionListInterface{
    constructor(){
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
            return new HOption(`[${i + 1}] - ${v.getName()}`, v.getAction())
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
        this.getDecoratedOptions().forEach(v => string += (v.getName() + "\n"))
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
        
        this.#name = name
        this.#action = action
    }

    #name
    #action

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
     * Runs the specified action for the option, args will be passed into the action, if its not undefined
     * @param {any} args 
     */
    performAction(args){
        if(this.#action != undefined)this.#action(args)
    }

    /**
     * returns an options specified action.if not option is specified wull return undefined
     * @returns {() | undefined}
     */
    getAction(){
        return this.#action
    }


}

/**
 * An abstract like class, You can directly create an options list from it or you can prebuild a list by creating a class and calling super in the constructor passing in the options as arguments where it will be applied into an internal options interface
 */
export class HOptionList{
    /**
     * Takes in an array of HOptions to pass into the HOptionInterface.
     * @param {HOption[]} options 
     */
    constructor(options){
        if(!Array.isArray(options)) throw new Error("Options must be an array")
        this.#HOptionInterface = new HOptionListInterface()

        options.filter((v) => v instanceof HOption).forEach((v) => this.#HOptionInterface.addOption(v))
    }
    #HOptionInterface
    
    /**
     * returns an arrayof  the options in the list.
     * @returns {HOption[]}
     */
    getOptions(){
        return this.#HOptionInterface.getOptions()
    }

    /**
     * @heavenly05
     * returns decorated options in a format like : [n] - option name
     * @returns {HOption[]}
     */
    getDecoratedOptions(){
        return this.#HOptionInterface.getDecoratedOptions()
    }

    /**
     * @heavenly05
     * returns an option from the option list, return if the option does not exist
     * @param {number} index 
     * @returns {HOption | undefined}
     */
    getOption(index){
        if(!(Number.isInteger(index))) throw new Error("index must be a number")
        this.#HOptionInterface.getOption(index)
    }

    /**
     * @heavenly05
     * returns a stringified version of the OptionList
     * @returns {string}
     */
    toString(){
        return this.#HOptionInterface.toString()
    }
    
}


export {asciiRange, generateRandomArr, generateRandomMixedString, generateRandomNumber,generateRandomString,return_sum, getDate, INode, INodeList, charCodeArrToChar, secondsToString,indexArrN, joinArrs,decimalToBinary, decArrToBinArr,arraysHaveSameContent, multipleArraysHaveSameContent,countOccurences, joinArrayOfArrays, InstanceWrapper, stringToArray, stringToByte, JSONToByte, anyToByte, byteToChar,bytesToString,byteArrToChars,  arrToBytes, arrayToNumArray, viewToArr, valueInArray, getMean, getVariance, getStdDeviationWV, getSmallestDivisor, getGreatestDivisor, growthFormula, decayFormula, isClass, HStack, HQueue, isPrimitive}

