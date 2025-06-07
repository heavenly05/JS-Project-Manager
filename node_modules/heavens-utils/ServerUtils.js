import * as fs from "node:fs"
import Path from "node:path"
import * as fsp from "node:fs/promises"



class InputManager {
    constructor() {
        throw new Error("Input Manager cannot be initialized as it is a Static class.");
    }

    static #is_initialized = false;
    static #global_holder = "";
    static #new_input_detected = false;
    static #watch_mode = false;

    // Initialize stdin listeners only once
    static #init() {
        if (InputManager.#is_initialized) return;
        InputManager.#is_initialized = true;

        // process.stdin.setEncoding('utf8');
        process.stdin.on('readable', () => {
            let chunk;
            let holder = "";
            while ((chunk = process.stdin.read()) !== null) {
                holder += chunk;
            }
            if (holder) {
                InputManager.#global_holder = holder.trim();
                if (InputManager.#watch_mode) {
                    InputManager.#new_input_detected = true;
                }
            }
        });
    }

    /**
     * Reads from stdin via a watchmode. When new input is available returns a promise containing the query result.If an value array is specifiied, it will check every value in an array to see if it matches with the input. if the input does not match a value in the valueArr, it will print out the errMSG if specified, and wait for the next input
     * @param {string | undefined}
     * @param {any[] | undefined} valueArr 
     * @returns {string}
     */
    static async readLine(valueArr, errMSG) {
        if(valueArr != undefined && !Array.isArray(valueArr)) throw new Error("valueArr is not an array")
        if(typeof(errMSG) != "string" && errMSG != undefined) throw new Error("errMSG must be a string")
        InputManager.#init();
        InputManager.#watch_mode = true;

        if(Array.isArray(valueArr)) valueArr = valueArr.map((v) => v.toString())
        
        // console.log(valueArr)

            //if the inpt exists, let it go through
            //if it doesnt exists perform some action
            //requery the user?

        return await new Promise((resolve) => {
            const interval = setInterval(() => {
                if (InputManager.#new_input_detected) {
                    if(valueArr != undefined && valueArr.includes(InputManager.#global_holder)){
                        // console.log(InputManager.#global_holder.toString())
                        InputManager.#watch_mode = false;
                        InputManager.#new_input_detected = false;
                        clearInterval(interval);
                        resolve(InputManager.#global_holder);
                    }else if(valueArr != undefined && !valueArr.includes(InputManager.#global_holder)){
                        if(errMSG != undefined){
                            console.warn(errMSG)
                        }
                        InputManager.#new_input_detected = false;
                    }else{
                        InputManager.#watch_mode = false;
                        InputManager.#new_input_detected = false;
                        clearInterval(interval);
                        resolve(InputManager.#global_holder);
                    }
                }
            }, 50);
        });
    }

    static close_stdin() {
        process.stdin.destroy();
    }

    

}



async function handleClientData(request){
    return await new Promise((resolve, reject) => {
        let buffer = "";
        request.on("data", (chunk) => {
            buffer += chunk
        })
        request.on("end", () => {
            //console.log(buffer)
            resolve(JSON.parse(buffer))
        })
        request.on("error", (err) => {
            reject(err);
        })
    });
}

/**
 * returns the contents of a file as a string in a syncronous manner. 
 * @param {string} filePath 
 * @returns {string}
 */
function getFile(filePath) {
    if(typeof filePath != "string") throw new Error("filePath does not point to a file.")
    if(!doesFileExist(filePath)) throw new Error("File does not exist")
    try {
       return fs.readFileSync(filePath, {encoding : "ascii"})
    } catch (error) {
        console.error(error)
        return null;
    }
}

async function getFileP(filePath){
    try {
        return await fsp.readFile(filePath, {encoding : "ascii"});
    } catch (error) {
        console.error(error)
    }
}

function getFileAsync(filePath, callBack){
    try {
        return fs.readFile(filePath, {encoding : "ascii"}, callBack)
    } catch (error) {
        console.error(error)
    }
}
function writeFile(file_path, data){
    try {
        fs.writeFileSync(file_path, data)
        return file_path
    } catch (error) {
        console.error(error)
        return null
    }
}

/**
 * stringifys an array and turns all commas into (\\) effectively making it a path
 * @param {string[]} arr 
 * @returns {string}
 */
function arrToPath(arr){
    if(!(arr instanceof Array)) throw new Error('arr must be an instnce of Array.')
    return arr.toString().replaceAll(",","\\") 
}

/**
 * turns a path into an arry regardless if it uses forward slashes or backslashes
 * @param {string} path 
 * @returns {string[]}
 */
function pathToArr(path){
    if(!(typeof(path) == "string")) throw new Error("path must be of the data type of string")
    return path.replace("/", "\\").split("\\")
}

/**
 * 
 * @param {string} path 
 * @returns {boolean}
 * returns true if the selected path is a file, returns false if it is not and returns null if the file doesnt exist
 */
function isFile(path){
    if (!doesFileExist(path)) return null
    return fs.lstatSync(path).isFile()
}

/**
 * 
 * @param {string} path 
 * @returns {boolean}
 * returns true if the selected path is a directory, returns false if it is not and returns null if the directory doesnt exist
 */
function isDirectory(path){
    if (!doesFileExist(path)) return null
    return fs.lstatSync(path).isDirectory()
}

/**
 * 
 * @param {string} path 
 * @returns {boolean}
 * returns True if a File exists, otherwise false
 */
function doesFileExist(path){
    if(typeof path != "string") throw new Error("path is not a string")
    return fs.existsSync(path)
}

/**
 * 
 * @param {string} path 
 * @returns {string[]}
 * returns An array of all directories within a directory, if there are none it will return an empty array
 */
function ListDirectories(path){
    if(!isDirectory(path)) return null
    return fs.readdirSync(path).filter((v) => {
        return isDirectory(Path.join(path,v))
    })
}

/**
 * 
 * @param {string} path 
 * @returns {string[]}
 * returns An array of all files within a directory, if there are none it will return an empty array
 */
function ListFiles(path){
 if(!isDirectory(path)) return null
    return fs.readdirSync(path).filter((v) => {
        return isFile(Path.join(path,v))
    })
}

/**
 * 
 * @param {string} path 
 * @returns {{full_dir_path : string, file_name : string, dir_path : string}[]}
 * An array of objects of all files within a directory including the file paths, if there are none it will return an empty array
 */
function ListFilesWithPaths(path){
    path = Path.resolve(path)
    if(!isDirectory(path)) throw new Error(path + " does not oint do a directory")
    return fs.readdirSync(path).map((v) => {
        if(isFile(Path.join(path, v))) return {full_dir_path: Path.join(path, v), filename : v, dir_path : path}
    }).filter((v) => {
        return v != undefined
    })
   }


   /**
 * 
 * @param {string} path 
 * @returns {{full_dir_path : string, dirname : string, dir_path : string}[]}
 * returns An array of objects containing all directories within a directory and i08/
 * ts path, if there are none it will return an empty array, returns null if59 it doesnt exist
 */
function ListDirectoriesWithPaths(path){
    path = Path.resolve(path)
    if(!isDirectory(path)) return null
    return fs.readdirSync(path).map((v) => {
        if(isDirectory(Path.join(path, v))) return {full_dir_path: Path.join(path, v), dirname : v, dir_path: path}
    }).filter((v) => {
        return v != undefined
    })
    
}


/**
 * makes a directory in the path specified wth the name (dir_name) specified. returns the path to the created folder, if it was successful else it returns null
 * @param {string} path 
 * @param {string} dir_name
 * @returns {string}
 */
function makeFolder(path, dir_name){
    if(typeof path != "string") throw new Error("path must be a string")
    if(typeof dir_name != "string") throw new Error("dir_name must be a string")

    path = Path.resolve(path)

    if(!isDirectory(path)) throw new Error("path is not a directory")

    try {
        let new_path = validateBaseName(dir_name, path, true).path

        fs.mkdirSync(new_path)
        return new_path
    } catch (error) {
        console.error(error)
        return null
    }
    
}

/**
 * Copies a file (from) and recreates it in a directory (to) and returns a path to the newly created file, if successful
 * @param {string} to 
 * @param {string} from 
 */
function copyFile(to, from){
    if(typeof to != "string") throw new Error("the to paramater must be a string")
    if(typeof from != "string") throw new Error("the from path must be a string")

    to = Path.resolve(to)
    // console.log(to)
    from = Path.resolve(from)

    if(!isDirectory(to)) throw new Error("the 'to' path is not a directory")

    if(!isFile(from)) throw new Error("the 'from' path is not an file.")

    return writeFile((validateBaseName(Path.basename(from), to, false).path), getFile(from))
}



/**
 * determines if a file has a proper name as long as it has an extension
 * @param file_path
 * @returns {boolean} 
 */
function isProperFileName(file_path){
    try {
        return (typeof getFileExtension(file_path) == "string" &&  getFileExtension(file_path).trim() != "." && getFileExtension(file_path).trim() != "")
    } catch (e) {
        return false
    }
}

/**
 * Returns the file extension of a file
 * @param {string} file_path
 * @returns {string} 
 */
function getFileExtension(file_path){
    if(typeof file_path != "string") throw new Error("file_path must be a string")
    file_path = Path.basename(file_path)
    if(!file_path.includes(".")) throw new Error("may not be a file cannot find the (.) to determine the file extension.")
    
    return file_path.slice(Path.basename(file_path).lastIndexOf("."))
    
}

/**
 * Removes file extension from a file and returns it{
 *@param {string} file_path
 @returns {string}
 */
function removeFileExtension(file_path){
    if(!isProperFileName(file_path)) throw new Error("File name is not proper. ensure the file has an fle extension.")
    return file_path.slice(0,file_path.indexOf(getFileExtension(file_path)))

}





function getJSONFile(file_path){
    try {
        return JSON.parse(getFile(file_path))
    } catch (error) {
        console.log(error)
    }
    
}


function setJSONFileProperty(file_path,property, value){
    try {
     let newProp = JSON.parse(getFile(file_path));
     newProp[property] = value 
     writeFile(file_path, JSON.stringify(newProp))
    } catch (err) {
        console.log(err)
    }
}


/**
 * "Validates" a basename by making a valid name for a folder or file depending on the isDirectory paramater.
 * It will check if the basename exists within the inputted directory path and return a name similar to the inputted name, if the name is valid it will just return the original name 
 * 
 * @param {string} name 
 * @param {string} dir_path 
 * @param {boolean} isDir
 * @returns {{path : string, valid_name : string}}

 */
function validateBaseName(name, dir_path, isDir ){
    if(typeof isDir != "boolean") throw new Error("isDirectory must be a boolean")
    if(typeof name != "string") throw new Error("name must be an string")
    if(typeof dir_path != "string") throw new Error("dir_path must be a string.")

    dir_path = Path.resolve(dir_path)
    //check to see if the name exists, if it is a directory or a file path within the dir_path

    //if it is a file
    name = Path.basename(name)
    if(!isDir){
        //first check to make sure the gooner didnt give us a fake file name
        //ensure we only get the filename and not an entre path
        if(!isProperFileName(name)) throw new Error("name is not a proper file name. Ensure it has an file extension.")
        
        
        //temporarily seperate the file name and its extension
            const file_ext = getFileExtension(name)
            const file_name = removeFileExtension(name)
            name = `${file_name}${file_ext}`
            let i = 0
            while(true){
                if(!isFile(Path.join(dir_path,name))){
                    return {path : Path.join(dir_path,name), valid_name : name}
                }
                name = `${file_name}${i}${file_ext}`
                i++
            }
 
    }else{
        let i = 0
        const dir_name = name
        while(true){
    
            if(!isDirectory(Path.join(dir_path, name))){
                return {path : Path.join(dir_path,name), valid_name : name}
            }
                name = `${dir_name}${i}`
                i++
            }
    }
}

class HFile{
    /**
     * A path to the selected file
     * @param {string} path 
     * @param {HParentDirectory} parent 
     */
    constructor(path, parent){
        if(!(parent instanceof HParentDirectory)) throw new Error("parent must be of type HParentDirectory")
        if(isFile(path)){
            this.#parent = parent
            this.#name = Path.basename(path)
            this.#path = Path.resolve(path)
            //this allows us to save up memory by ony bringing out the data on demand, previously qhwn our -Directory was searching it was extrememly slow and this couldve been one of th ereasons why
            
        }else throw new Error("The path does not point to a file.")
    }

    #name
    #path
    #parent
    /**
     * returns the file name
     * @returns {string}
     */
    getFileName(){
        return this.#name
    }

    /**
     * returns the parent of the HFile
     * @returns {HParentDirectory}
     */
    getParent(){
        return this.#parent
    }

    /**
     * Returns the full name of the flle based on the full name of the parent.
     * @returns {string}
     */
    getFullName(){
        return (this.#parent instanceof HChildDirectory) ? Path.join(this.#parent.getFullName(), this.getFileName()) : this.getFileName()
    }


    /**
     * returns the path to the fle
     * @returns {string}
     */
    getFilePath(){
        return this.#path
    }

    /**
     * returns the data within the file
     * @returns {string}
     */
    getFileData(){
        return  getFile(this.getFilePath())
    }
}

class HParentDirectory{
    //we are trying to programmatically map a directory, we have to do this in an optimized and intellegent way

    /**
     * @author Heaven Williams
     * @param {string} path 
     */
    constructor(path){
        //we use dynaimc inport so we can easily use the path module in commonJS or ES seamlessly.
        if( isDirectory(path)){
            this.#path = Path.resolve(path)
            this.#name = Path.basename(this.#path)
        }else throw new Error("path does not point to a directory")
        
        this.#file_paths =  ListFilesWithPaths(path).map((v) => {
            return v.full_dir_path
        })

        this.#sub_dirs_paths = ListDirectoriesWithPaths(path).map((v) => {
            return v.full_dir_path
        })
    }

    #path
    #name
    #file_paths = []
    #sub_dirs_paths = []

    /**
     * assign a task that every child directory will run and pass on to their kids
     * If assignself is true the parent will also do the task
     * @param {(v : HParentDirectory)()} task 
     * @param {boolean} assignSelf
     */
    assignTask(task, assignSelf = false){
        if(!(typeof task == "function")) throw new Error("task must be a function.")
        //tell each child to run their do task function
    if(assignSelf) task(this)
        this.getChildren().forEach((v) => v.#doTask(task))
    }

    /**
     * run a prespecified task on all directories, Parent directory will be passed in as an paramater
     * @param {(v : HParentDirectory)()} task 
     */
    #doTask(task){
        if(typeof task != "function") throw new Error("task is not a function, you can specify it with the assignTask function")

        task(this)
        this.getChildren().forEach((v) => v.#doTask(task))
    }

    getChildren(){
        return this.#sub_dirs_paths.map((v) => new HChildDirectory(this,v))
    }

    getFiles(){
        return this.#file_paths.map((v) => new HFile(v, this))
    }


    /**
     * path to directory
     * @returns {string}
     */
    getPath(){
        return this.#path
    }

    /**
     * the directorys name
     * @returns {string}
     */
    getName(){
        return this.#name
    }

    /**
     * an array of each sub direcory path
     * @returns {string[]}
     */
    getChildPaths(){
        return this.#sub_dirs_paths
    }

    /**
     * an array of each file path in the directory .
     * @returns {string[]}
     */
    getFilePaths(){
        return this.#file_paths
    }

    /**
     * returns true or false depending on whether there are any subdirectories
     * @returns {boolean}
     */
    hasChildren(){
        return (this.getChildPaths().length > 0)
    }

     /**
     * returns if whether or not the Parent directory is the root parent
     * by checking if it is an instace of a child directory
     * "every parent is a child and every chld is a parent except the first parent"
     * @returns {boolean}
     */
    isRootParent(){
        return !(this instanceof HChildDirectory)
    }

    /**
     * returns true or false depending on whether there are any files
     * @returns {boolean}
     */
    hasFiles(){
        return (this.getFilePaths().length > 0)
    }

}

class HChildDirectory extends HParentDirectory{
    /**
     * @author Heaven Williams
     * @param {HParentDirectory} parent 
     * @param {string} path 
     */
    constructor(parent, path){
        if(!(parent instanceof HParentDirectory)) throw new Error("parent is not an instance of HParentDirectory")
        super(path)
        this.#parent = parent
    }

    #parent

    /**
     * returns the parent of the HChildDirectory
     * @returns {HParentDirectory}
     */
    getParent(){
        return this.#parent
    }

    /**
     * returns the directorys full name by joining it with the parent name in a path like format. it will include the root parent in every name.
     * @returns {string}
     */
    getFullNameWRoot(){
        return (this.#parent instanceof HChildDirectory) ? Path.join(this.#parent.getFullNameWRoot(), this.getName()) : Path.join(this.#parent.getName(), this.getName())
    }

     /**
     * returns the directorys full name by joining it with the parent name in a path like format. Does so wthout the root
     * @returns {string}
     */
    getFullName(){
        return (this.#parent instanceof HChildDirectory) ? Path.join(this.#parent.getFullName(), this.getName()) : this.getName()
    }

    /**
     * returns the siblings, or other child nodes from the parent node of this directory.
     * @returns {HChildDirectory[]}
     */
    getSiblings(){
        return this.#parent.getChildren().filter((v) => v.getName() != this.getName())
    }

    /**
     * returns the siblings paths, or other child paths from the parent node of this directory.
     * @returns {string[]}
     */
    getSiblingsPaths(){
        return this.#parent.getChildPaths().filter((v) => v != this.getPath())
    }

}


/**
 * Copies all directories and files of a directory and moves it to another directory. can automake a subfolder if specified
 * 
 * @param {string} from
 * @param {string} to
 * @param {string | undefined} sub_dir_name
 * @returns {string}
 * returns the path to the new directory
 */
function copyDirectory(from, to, sub_dir_name){
    //determine if there will be a subdirectory name, if there isnt just put everything directly in the to path.
    let wantsSubDir = true
    if(sub_dir_name == undefined) {
        wantsSubDir = false
        sub_dir_name = ""
    }
    
    //ensure all the paramater tyes are valid
    if(typeof from != "string") throw new Error("from must be an string")
    if(typeof to != "string") throw new Error("to must be an string")
    if(typeof sub_dir_name != "string") throw new Error("sub_dir_name must be an string")

    //create a parent directory to map out the paths
    const RootDir = new HParentDirectory(Path.resolve(from))

    //use the to directory to determine where exacltly the copied data will end up
    if(wantsSubDir){
        to = validateBaseName(sub_dir_name,Path.resolve(to), true).path
    }else{
        to = Path.resolve(to)

        if(!isDirectory(to)) throw new Error("'to' is not a Directory")
    }

    // console.log("everything will be placed in : " + to)

    //create queues, these are where the new folder paths and file pathswith the copies will be stored temporarily

    let dir_queue = [to]
    let file_queue = []

    //assign a task to all directories inside the from path, making them append their path name (relative to their parent) to the 'to' path and makes them do the smae for their files but sends over the original file path as well to aid in the process
    RootDir.assignTask((v) => {
        
        if(v instanceof HChildDirectory){
            dir_queue.push(Path.join(to, v.getFullName()))
        }
        //append new file path and old file path
         v.getFiles().forEach((f) => {
            file_queue.push([Path.dirname(Path.join(to,f.getFullName())), f.getFilePath()])
         })
    }, true)

    //create the directories
    dir_queue.forEach((v) =>{
        makeFolder(Path.dirname(v), Path.basename(v))
    })

    //create the files
    file_queue.forEach((v) => {
        copyFile(v[0], v[1])
    })

    return to

}






export {getFile,getFileAsync, getFileP, handleClientData,writeFile, doesFileExist,isDirectory,isFile, ListDirectories, ListFiles, ListFilesWithPaths, ListDirectoriesWithPaths, makeFolder, copyFile,setJSONFileProperty, copyDirectory, validateBaseName, HFile,HParentDirectory,HChildDirectory, arrToPath, pathToArr, InputManager, getFileExtension, removeFileExtension, isProperFileName, getJSONFile}