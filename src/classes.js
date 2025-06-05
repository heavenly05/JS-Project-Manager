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
        
        super(((ServerUtils.isFile("./src/HConfig.json")) ? (!(ServerUtils.isDirectory(ServerUtils.getJSONFile("./src/HConfig.json")["projectDir"]))) ? [] : ServerUtils.ListDirectories(ServerUtils.getJSONFile("./src/HConfig.json")["projectDir"]).map(v => new Utils.HOption(v, (p) => Path.join(Path.resolve(ServerUtils.getJSONFile("./src/HConfig.json")["projectDir"]), v))) : []))
    }
}

export class HProject_Info_List extends Utils.HOptionList{
    constructor(){
        console.log(HPROJECT_LIST_OPTIONS.getOptions().filter(v => {
            console.log(!!ServerUtils.isFile(Path.join(v.performAction(), "HProj.json")))
        }))
        //((ServerUtils.isFile("./src/HConfig.json")) ? (!(ServerUtils.isDirectory(ServerUtils.getJSONFile("./src/HConfig.json")["projectDir"]))) ? [] : ServerUtils.ListDirectories(ServerUtils.getJSONFile("./src/HConfig.json")["projectDir"]).map(v => new Utils.HOption(v, (p) => Path.join(Path.resolve(ServerUtils.getJSONFile("./src/HConfig.json")["projectDir"]), v))) : [])
         super()
    }

}

export class HActive_Projects_List extends Utils.HOptionList{
    constructor(){
        //lowkey man
        super(HPROJECT_INFO_LIST_OPTIONS.getOptions().filter(v => v.performAction()["isActive"] == true).map(p => new Utils.HOption(p.performAction()["project_name"], () => Path.join((ServerUtils.getJSONFile("./src/HConfig.json")["projectDir"]),p.performAction()["project_name"]))))
    }
}

export class HInactive_Projects_List extends Utils.HOptionList{
    constructor(){
        //lowkey man
        super(HPROJECT_INFO_LIST_OPTIONS.getOptions().filter(v => v.performAction()["isActive"] == false).map(p => new Utils.HOption(p.performAction()["project_name"], () => Path.join((ServerUtils.getJSONFile("./src/HConfig.json")["projectDir"]),p.performAction()["project_name"]))))
    }
}

export class HBrowser_Option_List extends Utils.HOptionList{
    constructor(){
        super([
            new Utils.HOption("chrome", async () => {
                return "chrome"
            }),
            
            new Utils.HOption("Microsoft edge", async () => {
                return "msedge"
            }),

            new Utils.HOption("Other Browser", async () => {
                console.log("enter the path or system alias for your browser")
                return await ServerUtils.InputManager().readLine()
            })
        ])
    }
}

export class HProject_Visibility_List extends Utils.HOptionList{
    constructor(){
        super([
            new Utils.HOption("Active Projects", () => {

                if((HACTIVE_PROJECTS_LIST_OPTIONS.getOptions().length > 0)){
                    console.log(HACTIVE_PROJECTS_LIST_OPTIONS.toString())
                }else{
                    console.log("[* You have no active projects *]")
                    return null
                }
            }),

            new Utils.HOption("Inactive Projects", () => {
                if((HINACTIVE_PROJECTS_LIST_OPTIONS.getOptions().length > 0)){
                    console.log(HINACTIVE_PROJECTS_LIST_OPTIONS.toString())
                }else{
                    console.log("[* You have no inactive projects *]")
                    return null
                }
            }),

            new Utils.HOption("All Projects", () => {
                 if((HPROJECT_LIST_OPTIONS.getOptions().length > 0)){
                    console.log(HPROJECT_LIST_OPTIONS.toString())
                }else{
                    console.log("[* You have no projects *]")
                    return null
                }
            }),

            new Utils.HOption("cancel", () =>  null)
        ])
    }
}

/**
 *Project manager main menu
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

                console.log(`You have ${HACTIVE_PROJECTS_LIST_OPTIONS.getOptions().length } active projects.`)
                console.log("Select which project you would like to load.")

                console.log(HACTIVE_PROJECTS_LIST_OPTIONS.toString())
                
                execSync(`code ${await (HACTIVE_PROJECTS_LIST_OPTIONS.getOptions()[(Number.parseInt((await ServerUtils.InputManager.readLine(getRangeArr(1, HACTIVE_PROJECTS_LIST_OPTIONS.getOptions().length), "Invalid value."))) - 1)]).performAction()}`)

            }),

            new Utils.HOption("View Current Projects", async (v) => {
                if(HACTIVE_PROJECTS_LIST_OPTIONS.getOptions() < 1){
                    console.log("You have no active projects")
                }
                console.log("View your Active/Inactive Projects\n")
                console.log("Select an option below.")

                console.log(HPROJECT_VISIBILITY_LIST_OPTIONS.toString())

            await (HPROJECT_VISIBILITY_LIST_OPTIONS.getOptions()[(Number.parseInt((await ServerUtils.InputManager.readLine(getRangeArr(1, HPROJECT_VISIBILITY_LIST_OPTIONS.getOptions().length), "Invalid value."))) - 1)]).performAction()

            }),

            new Utils.HOption("Run a Project", async(v) => {
                if(HACTIVE_PROJECTS_LIST_OPTIONS.getOptions() < 1){
                    console.log("You have no active projects")
                }

                console.log("JPM will look for a package.json folder and run the file in the 'main' field for backend projects. If a package.json file does not exist, JPM will look for a src/Main.js file and will run it with node. it should be the entry into your program\n\nJPM will look for a src/index.html in Frontend projects and try to run it with chrome or microsoft edge or a selected browser, it should be the entry into your program.")

                console.log("Please select an option from the list below")

                console.log(HACTIVE_PROJECTS_LIST_OPTIONS.toString())

                let selected_project_path = await (HACTIVE_PROJECTS_LIST_OPTIONS.getOptions()[(Number.parseInt((await ServerUtils.InputManager.readLine(getRangeArr(1, HACTIVE_PROJECTS_LIST_OPTIONS.getOptions().length), "Invalid value."))) - 1)]).performAction()

                let path_to_hproj = Path.join(selected_project_path, "HProj.json")

                if(!ServerUtils.isFile(path_to_hproj)){
                    console.log("Project does not have a HProj.json file please recover or reconstruct it.")
                    return
                }

                const type = ServerUtils.getJSONFile(path_to_hproj)["type"]

                if(type == "backend"){
                    //check for a package.json file first, check if it has a main field and then run 
                    if(ServerUtils.isFile(Path.join(selected_project_path, "package.json"))){
                        if("main" in ServerUtils.getJSONFile(Path.join(selected_project_path, "package.json"))){
                            execSync(`node ${selected_project_path}`)
                        }
                    }else if(ServerUtils.isFile(Path.join(selected_project_path,"src/Main.js"))){
                        execSync(`start cmd /k node ${Path.join(selected_project_path,"src/Main.js")}`)
                    }else{
                        console.log("Unable to run backend project because one of the following reasons:\n1.Project does not contain src/Main.js\n2.Project does not have a main field in package.json file.\n3.Project does not have a package.json file and (reason 1).")
                        return null
                    }
                }else if(type == "frontend"){
                    if(ServerUtils.doesFileExist(Path.join(selected_project_path, "src/index.html"))){
                        console.log("Select a browser\n")

                        execSync(`code ${await (HBROWSER_OPTION_LIST_OPTIONS.getOptions()[(Number.parseInt((await ServerUtils.InputManager.readLine(getRangeArr(1, HBROWSER_OPTION_LIST_OPTIONS.getOptions().length), "Invalid value."))) - 1)]).performAction()} ${Path.join(selected_project_path, "src/index.html")}`)

                    }else{
                        console.log("Project does not contain a src/index.html file")
                    }
                }else{
                    console.log("Project lacks a type field in its HProj.json file.")
                    return null
                }
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

export const HPROJECT_INFO_LIST_OPTIONS = (new HProject_Info_List())

export const HACTIVE_PROJECTS_LIST_OPTIONS = (new HActive_Projects_List())

export const HPROJECT_VISIBILITY_LIST_OPTIONS = (new HProject_Visibility_List())

export const HINACTIVE_PROJECTS_LIST_OPTIONS = (new HInactive_Projects_List())

export const HBROWSER_OPTION_LIST_OPTIONS = (new HBrowser_Option_List())


export const MISSING_BACKEND_TEMPLATES_ERRMSG =  "*backend templates are missing, you will be unable to create backend projects. if you deleted or moved the folder, place it back where it was and re-run the program.* If you cannot recover the folder navigate to this link: \nhttps://github.com/heavenly05/JS-Project-Manager/tree/development/res/templates \nDownload the backend_templates folder and place it in the the following path: " + Path.join(Path.dirname(import.meta.dirname),"/res/templates") +" if the res or template folder does not exist place reconstruct the path.\n\nThe last option is to create your own backend template*"

export const MISSING_FRONTEND_TEMPLATES_ERRMSG =  "*frontend templates are missing, you will be unable to create frontend projects. if you deleted or moved the folder, place it back where it was and re-run the program.* If you cannot recover the folder navigate to this link: \nhttps://github.com/heavenly05/JS-Project-Manager/tree/development/res/templates \nDownload the frontend_templates folder and place it in the the following path: " + Path.join(Path.dirname(import.meta.dirname),"/res/templates") +"\nif the res or template folder does not exist, reconstruct the path.\n\nThe last option is to create your own frontend template*\n\n"
