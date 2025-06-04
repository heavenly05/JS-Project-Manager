import * as ServerUtils from "heavens-utils/ServerUtils"
import * as Utils from "heavens-utils/Utils"
import * as Path from "path"
import {execSync} from "child_process"

export class HUser_Directory_Resolve extends Utils.HOptionList{
    constructor(){
            super([
                new Utils.HOption("Choose your own directory", async () => {
                    console.log("Please enter a valid directory and it will be used to to hold your projects\ntype 'cancel' at any time to go back.")

                    while(true){
                        let inp = await ServerUtils.InputManager.readLine()

                        if(inp == 'cancel') return null
                        if(ServerUtils.isDirectory(inp)) return inp
                        console.log("The path specified does not point to a folder. Please enter a valid path.")
                    }
                }),
                new Utils.HOption("Let the project manager create a new HProjects directory(recommended)", async (arg) => {
                    if(typeof arg != 'string') throw new Error("arg must be a typeof string.")
                    if(!ServerUtils.isDirectory(arg)) throw new Error("arg must be a directory.")
                    return ServerUtils.makeFolder(arg, "HProjects")
                }),
                new Utils.HOption("Exit", async () => process.exit(0))
            ])
        }
}

export class HCreate_Project_Type extends Utils.HOptionList{
    constructor(){
        super([
            new Utils.HOption("Backend Project", async () => {
                if(!ServerUtils.isDirectory("./res/templates/backend_templates")){
                        console.warn(MISSING_BACKEND_TEMPLATES_ERRMSG)
                        return null
                    }
                    return "backend"
            }),

            new Utils.HOption("Frontend Project", async () => {
                if(!ServerUtils.isDirectory("./res/templates/frontend_templates")){
                        console.warn(MISSING_FRONTEND_TEMPLATES_ERRMSG)

                        return null
                    }
                    return "frontend"
            }),

            new Utils.HOption("Cancel", async () => null),
        ])
    }
}

export class HFrontEndTemplates_List extends Utils.HOptionList{
    constructor(){
         super(ServerUtils.ListDirectories("./res/templates/frontend_templates").map((v) => {
            return new Utils.HOption(v, async () => Path.join(Path.resolve("./res/templates/frontend_templates"), v))
        }))
    }
}

export class HBackEndTemplates_List extends Utils.HOptionList{
     constructor(){
        super(ServerUtils.ListDirectories("./res/templates/backend_templates").map((v) => {
            return new Utils.HOption(v, async () => Path.join(Path.resolve("./res/templates/backend_templates"), v))
        }))
    }
}


export class HProject_List extends Utils.HOptionList{
    constructor(){
        super(ServerUtils.ListDirectories(ServerUtils.getJSONFile("./src/HConfig.json")["projectDir"]).map(v => new Utils.HOption(v, async (p) => Path.join(Path.resolve(ServerUtils.getJSONFile("./src/HConfig.json")["projectDir"]), v))))
    }
}

/**
 *Project manager maiun menu
 */
export class HProject_Manager_Main_Menu extends Utils.HOptionList{
    constructor(){
        super([
            new Utils.HOption("Create new Project", async (v) => {
                //the passed in path would be the path to the ProjDir folder

                //we will query the user for, the name of the project, the author, type and if they want utils.

                if(typeof v != "string")throw new Error("v must be a string")
                if(!ServerUtils.isDirectory(v)) throw new Error("projectDir is not a directory. Please relaunch the program to attempt to fix errors")
                
                console.log("Project Creator.\nType 'cancel' to go back")

                console.log("Please enter a project name")
                let project_name
                let date = Utils.getDate()
                let authors
                let type
                let selected_template_options

                while(true){
                    let inp = await ServerUtils.InputManager.readLine()
                    if(inp == 'cancel') return null
                    if(!inp.includes(" ")){
                        if(inp.length >= 3){
                            project_name = inp.toString()
                            break
                        }else console.log("Project name must be at least 3 characters long.")
                    }else console.log("Project name cannot contain any spaces. use - or _ instead.")
                }
                
                console.log("Project Name: " + project_name)

                console.log("\nPlease enter the author(s) name(s). Use commas to seperate the names.")

                while(true){
                    let inp = await ServerUtils.InputManager.readLine()
                    if(inp == 'cancel') return null
                    authors = inp.split(",")
                    break
                }

                console.log("\nProject Authors: ")
                console.log(authors)
                
                console.log("Select a project type from the projects list.\n")
                console.log(HCreate_Project_Type_Options.toString())
                while(true){
                    let selected_option = HCreate_Project_Type_Options.getOptions()[(Number.parseInt((await ServerUtils.InputManager.readLine(getRangeArr(1,HCreate_Project_Type_Options.getOptions().length), "Thats not a valid input")))) - 1]
                
                    type = await selected_option.performAction()
                    if(type == null) return null
                    break
                }
                console.log("Project Type: " + type + "\n")

                if(type == "backend") selected_template_options = HBACKEND_TEMPLATE_OPTIONS; else selected_template_options = HFRONTEND_TEMPLATE_OPTIONS
                
                if(selected_template_options.getOptions().length < 1){
                    console.log("You do not have any " + type + " templates, normally there would be a default one but it may have been moved or deleted. You can either create a template or download the default one from the github repo\n[link:] - https://github.com/heavenly05/JS-Project-Manager/tree/development/res/templates\nThe Program will now exit.")
                    return null
                }
                console.log("Choose a Project Template from the list:")
                console.log("\nYou currently have: " + selected_template_options.getOptions().length + " " + type +" templates")

                console.log(selected_template_options.toString())
                
                let path_to_template
                while(true){
                    path_to_template = await selected_template_options.getOptions()[(Number.parseInt((await ServerUtils.InputManager.readLine(getRangeArr(1,selected_template_options.getOptions().length), "Thats not a valid input")))) - 1].performAction()
                    break
                }
                //used bad naming convention, but whatever
                let projOBJ = {
                    project_name : project_name,
                    dateCreated : date,
                    authors : authors,
                    type : type,
                    isActive : true
                }

                ServerUtils.writeFile(Path.join(ServerUtils.copyDirectory(path_to_template,v,project_name),"HProj.json"), JSON.stringify(projOBJ))

                console.log(`Project ${project_name} created! Returning back to the main menu...`)

            }),

            new Utils.HOption("Load a Project", async (v) => {
                if(HPROJECT_LIST_OPTIONS.getOptions().length < 1){
                    console.log("You currently have no projects!")
                    return
                }
                console.log("*JPM only supports opening projects with Visual Studio Code, Make sure you have VCS 'code' command set up or something unexpected will occur.*\n")

                console.log(`You have ${HPROJECT_LIST_OPTIONS.getOptions().length } projects.`)
                console.log("Select which project you would like to load.")

                console.log(HPROJECT_LIST_OPTIONS.toString())
                
                execSync(`code ${await (HPROJECT_LIST_OPTIONS.getOptions()[(Number.parseInt((await ServerUtils.InputManager.readLine(getRangeArr(1, HPROJECT_LIST_OPTIONS.getOptions().length), "Invalid value."))) - 1)]).performAction()}`)

            }),

            new Utils.HOption("View Current Projects"), async (v) => {

            },

            new Utils.HOption("Run a Project", async(v) => {

            }),

            new Utils.HOption("Remove A Project"), async (v) => {

            },

            new Utils.HOption("Make a Template", async (v) => {
                
            }),

            new Utils.HOption("Configuration", async (v) => {

            }),

            new Utils.HOption("Exit", async () => process.exit(0))

        ])
    }
}




//a node project will contain an src folder, will query the user if they want utils and be installed with npm if so. 
//each project will contain a HProj.json file with data like:
//name, date, authors, and type

//a web based project will contain a src folde rand th eoption to have the utils.js file. it will have a index.js file that has a canvas and a title with the prject name ffrom the HProj.json file.

//if a folder doesnt have a HProj file and it is in HprojDir then it will be ignored

//the user should be able to configure where they want to place their projects 

/**
 * returns non zero indexes of an array
 * @param {any[]} array 
 * @returns 
 */
export function getIndexeWOZindex(array) {
    if(!Array.isArray(array)) throw new Error("array must be an array")
    return array.map((v,i) =>  i + 1)
}

/**
 * returns an array of all values between a certain range, both values included
 * @param {number} start
 * @param {number} end 
 * @returns {number[]}
 */
export function getRangeArr(start, end){
    if(!Number.isInteger(start)) throw new error("start must be an integer")
    if(!Number.isInteger(end)) throw new error("end must be an integer")
        const arr = []
        for(let i = start; ((start > end) ? i >= end : i <= end); ((start > end) ? i-- : i++)) arr.push(i)
    return arr
}

export const H_NO_PROJDIR_FOUND_OPTIONS = (new HUser_Directory_Resolve())

export const HPROJECT_MANAGER_MAIN_MENU_OPTIONS = (new HProject_Manager_Main_Menu())

export const HCreate_Project_Type_Options = (new HCreate_Project_Type())

export const HFRONTEND_TEMPLATE_OPTIONS = (new HFrontEndTemplates_List())

export const HBACKEND_TEMPLATE_OPTIONS = (new HBackEndTemplates_List())

export const HPROJECT_LIST_OPTIONS = (new HProject_List())

export const MISSING_BACKEND_TEMPLATES_ERRMSG =  "*backend templates are missing, you will be unable to create backend projects. if you deleted or moved the folder, place it back where it was and re-run the program.* If you cannot recover the folder navigate to this link: \nhttps://github.com/heavenly05/JS-Project-Manager/tree/development/res/templates \nDownload the backend_templates folder and place it in the the following path: " + Path.join(Path.dirname(import.meta.dirname),"/res/templates") +" if the res or template folder does not exist place reconstruct the path.\n\nThe last option is to create your own backend template*"

export const MISSING_FRONTEND_TEMPLATES_ERRMSG =  "*frontend templates are missing, you will be unable to create frontend projects. if you deleted or moved the folder, place it back where it was and re-run the program.* If you cannot recover the folder navigate to this link: \nhttps://github.com/heavenly05/JS-Project-Manager/tree/development/res/templates \nDownload the frontend_templates folder and place it in the the following path: " + Path.join(Path.dirname(import.meta.dirname),"/res/templates") +"\nif the res or template folder does not exist, reconstruct the path.\n\nThe last option is to create your own frontend template*\n\n"
