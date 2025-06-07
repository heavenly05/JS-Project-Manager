import * as ServerUtils from "heavens-utils/ServerUtils"
import * as Utils from "heavens-utils/Utils"
import * as Path from "path"
import {execSync} from "child_process"
import { isFloat32Array } from "util/types"
import { readFileSync } from "fs"

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

            new Utils.HOption("Frontend Project", async () => {
                if(!ServerUtils.isDirectory("./res/templates/frontend_templates")){
                        console.warn(MISSING_FRONTEND_TEMPLATES_ERRMSG)

                        return null
                    }
                    return "frontend"
            }),

            new Utils.HOption("Backend Project", async () => {
                if(!ServerUtils.isDirectory("./res/templates/backend_templates")){
                        console.warn(MISSING_BACKEND_TEMPLATES_ERRMSG)
                        return null
                    }
                    return "backend"
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
        //((ServerUtils.isFile("./src/HConfig.json")) ? (!(ServerUtils.isDirectory(ServerUtils.getJSONFile("./src/HConfig.json")["projectDir"]))) ? [] : ServerUtils.ListDirectories(ServerUtils.getJSONFile("./src/HConfig.json")["projectDir"]).map(v => new Utils.HOption(v, (p) => Path.join(Path.resolve(ServerUtils.getJSONFile("./src/HConfig.json")["projectDir"]), v))) : [])

        //this list filters through each folder in the HProject directory and checks fo an HProoj.json file, its options have the projects name and its actions returns an array, the first index ([0]), returns the contents of the HProj file in the folder, the second index ([1]) returns the path to the project directory.

        super(HPROJECT_LIST_OPTIONS.getOptions().filter(v => ServerUtils.isFile(Path.join(v.performAction(), "HProj.json"))).map(p => new Utils.HOption(Path.basename(p.performAction()),() => [(ServerUtils.getJSONFile(Path.join(p.performAction(), "HProj.json"))), (Path.dirname(p.performAction()))]
    )))
    }
}

export class HActive_Projects_List extends Utils.HOptionList{
    constructor(){
        //filters through HProject_info_List and goes throguh to see if the project is active and returns the path to the active directory in the perfromAcion() of the option
        super(HPROJECT_INFO_LIST_OPTIONS.getOptions().filter(v => v.performAction()[0]["isActive"] == true).map(p => new Utils.HOption(p.getName(), () => p.performAction()[1])))
    }
}



export class HTyped_Active_Projects_List extends Utils.HOptionList{
    constructor(){
        super(HPROJECT_INFO_LIST_OPTIONS.getOptions().filter(v => v.performAction()[0]["isActive"] == true).map((p) => new Utils.HOption(`${p.getName()} - ${p.performAction()[0]["type"]}`, p.getAction())))
    }
}

export class HTyped_Projects_List extends Utils.HOptionList{
    constructor(){
        super(HPROJECT_INFO_LIST_OPTIONS.getOptions().map((p) => new Utils.HOption(`${p.getName()} - ${p.performAction()[0]["type"]}`, p.getAction())))
    }
}

export class HTyped_Inactive_Projects_List extends Utils.HOptionList{
    constructor(){
        super(HPROJECT_INFO_LIST_OPTIONS.getOptions().filter(v => v.performAction()[0]["isActive"] == false).map((p) => new Utils.HOption(`${p.getName()} - ${p.performAction()[0]["type"]}`, p.getAction())))
    }
}


export class HInactive_Projects_List extends Utils.HOptionList{
    constructor(){
        //lowkey man
        //filters through HProject_info_List and goes throguh to see if the project is inactive and returns the path to the inactive directory in the perfromAction() of the option

        super(HPROJECT_INFO_LIST_OPTIONS.getOptions().filter(v => v.performAction()[0]["isActive"] == false).map(p => new Utils.HOption(p.getName(), () => p.performAction()[1])))
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

                    console.log(HTYPED_ACTIVE_PROJECTS_LIST_OPTIONS.toString())
                }else{
                    console.log("[* You have no active projects *]")
                    return null
                }
            }),

            new Utils.HOption("Inactive Projects", () => {
                if((HINACTIVE_PROJECTS_LIST_OPTIONS.getOptions().length > 0)){
                    console.log(HTYPED_INACTIVE_PROJECTS_LIST_OPTIONS.toString())
                }else{
                    console.log("[* You have no inactive projects *]")
                    return null
                }
            }),

            new Utils.HOption("All Projects", () => {
                 if((HTYPED_PROJECTS_LIST.getOptions().length > 0)){
                    console.log(HTYPED_PROJECTS_LIST.toString())
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
                            if(!ServerUtils.isDirectory(Path.join(v, inp))){
                                project_name = inp.toString()
                                break
                            }else console.log("A project with that name already exists.")
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
                
                await refreshLists()

                console.log(`Project ${project_name} created!.`)
                console.log("Press Enter to continue")
                await ServerUtils.InputManager.readLine()
            }),

            new Utils.HOption("Load a Project", async (v) => {
                if(HPROJECT_LIST_OPTIONS.getOptions().length < 1){
                    console.log("You currently have no projects!")
                    return
                }
                console.log("*JPM only supports opening projects with Visual Studio Code, Make sure you have VCS 'code' command set up or something unexpected will occur.*\n")

                console.log("Press Enter to Proceed")
                await ServerUtils.InputManager.readLine()

                console.log(`You have ${HACTIVE_PROJECTS_LIST_OPTIONS.getOptions().length } active projects.`)
                console.log("Select which project you would like to load.")

                console.log(HACTIVE_PROJECTS_LIST_OPTIONS.toString())
                
                let option = await (HACTIVE_PROJECTS_LIST_OPTIONS.getOptions()[(Number.parseInt((await ServerUtils.InputManager.readLine(getRangeArr(1, HACTIVE_PROJECTS_LIST_OPTIONS.getOptions().length), "Invalid value."))) - 1)])

                execSync(`code ${Path.join(option.performAction(), option.getName())}`)

                console.log("project loaded. Press enter to return.")
                console.log("Press Enter to continue")
                await ServerUtils.InputManager.readLine()

            }),

            
            new Utils.HOption("View Current Projects", async (v) => {
                if(HPROJECT_INFO_LIST_OPTIONS.getOptions() < 1){
                    console.log("You have no projects")
                    console.log("Press Enter to return")
                    await ServerUtils.InputManager.readLine()
                    return
                }
                console.log("View your Active/Inactive Projects\n")
                console.log("Select an option below.")

                console.log(HPROJECT_VISIBILITY_LIST_OPTIONS.toString())

            await (HPROJECT_VISIBILITY_LIST_OPTIONS.getOptions()[(Number.parseInt((await ServerUtils.InputManager.readLine(getRangeArr(1, HPROJECT_VISIBILITY_LIST_OPTIONS.getOptions().length), "Invalid value."))) - 1)]).performAction()
                console.log("Press Enter to return")
                await ServerUtils.InputManager.readLine()
            }),


            new Utils.HOption("Run a Project", async(v) => {
                if(HACTIVE_PROJECTS_LIST_OPTIONS.getOptions() < 1){
                    console.log("You have no active projects")
                    console.log("Press Enter to return")
                    await ServerUtils.InputManager.readLine()
                    return
                }

                console.log("JPM will look for a package.json folder and run the file in the 'main' field for backend projects. If a package.json file does not exist, JPM will look for a src/Main.js file and will run it with node. it should be the entry into your program\n\nJPM will look for a src/index.html in Frontend projects and try to run it with chrome or microsoft edge or a selected browser, it should be the entry into your program.The browser should be installed before running")

                console.log("Press Enter to continue, 'cancel to return.")
                if(await ServerUtils.InputManager.readLine() == "cancel")return

                console.log("Please select an option from the list below")

                console.log(HTYPED_ACTIVE_PROJECTS_LIST_OPTIONS.toString())

                let selected_project = await (HACTIVE_PROJECTS_LIST_OPTIONS.getOptions()[(Number.parseInt((await ServerUtils.InputManager.readLine(getRangeArr(1, HACTIVE_PROJECTS_LIST_OPTIONS.getOptions().length), "Invalid value."))) - 1)])

                let selected_project_path = Path.join(selected_project.performAction(), selected_project.getName())

                let path_to_hproj = Path.join(selected_project_path,"HProj.json")

                

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
                         console.log("Press Enter to return")
                        await ServerUtils.InputManager.readLine()
                        return null
                    }
                }else if(type == "frontend"){
                    if(ServerUtils.doesFileExist(Path.join(selected_project_path, "src/index.html"))){
                        console.log("Select a browser\n")
                        console.log(HBROWSER_OPTION_LIST_OPTIONS.toString())
                        execSync(`start ${await (HBROWSER_OPTION_LIST_OPTIONS.getOptions()[(Number.parseInt((await ServerUtils.InputManager.readLine(getRangeArr(1, HBROWSER_OPTION_LIST_OPTIONS.getOptions().length), "Invalid value."))) - 1)]).performAction()} ${Path.join(selected_project_path, "src/index.html")}`)

                    }else{
                        console.log("Project does not contain a src/index.html file")
                         console.log("Press Enter to return")
                        await ServerUtils.InputManager.readLine()
                    }
                }else{
                    console.log("Project lacks a type field in its HProj.json file.")
                     console.log("Press Enter to return")
                    await ServerUtils.InputManager.readLine()
                    return null
                }

                 console.log("Press Enter to return")
                await ServerUtils.InputManager.readLine()
            }),


            new Utils.HOption("Remove A Project", async (v) => {
                if(HACTIVE_PROJECTS_LIST_OPTIONS.getOptions().length < 1){
                    console.log("You have no projects.")

                    console.log("Press Enter to return")
                    await ServerUtils.InputManager.readLine()
                    return
                }   

                console.log("JPM will not 'delete' your project folder or its contents it will still exist in the directory it was made in. JPM will set the projects 'isActive' property to false and JPM will not be able to detect it. You can manually enable/disable it from your project based on your needs.")

                console.log("Press Enter to continue, or 'cancel to return.")
                if(await ServerUtils.InputManager.readLine() == "cancel")return

                console.log("Choose a project to remove\n")
                console.log(HTYPED_ACTIVE_PROJECTS_LIST_OPTIONS.toString())

                let chosen_project = await (HTYPED_ACTIVE_PROJECTS_LIST_OPTIONS.getOptions()[(Number.parseInt((await ServerUtils.InputManager.readLine(getRangeArr(1, HTYPED_ACTIVE_PROJECTS_LIST_OPTIONS.getOptions().length), "Invalid value."))) - 1)])

                let proj_dir = Path.join(chosen_project.performAction()[1], chosen_project.performAction()[0]["project_name"])
                
                let path_to_hproj = Path.join(proj_dir,"HProj.json")

                if(ServerUtils.isFile(path_to_hproj)){
                    console.log("Are you sure you want to remove " + chosen_project.getName() + "?\nIf you want JPM to manage the project again you have to set the 'isActive' attribute back to true in the Projects HProj.json file.\nType ok (all lowercase) to confirm else you will be returned back to the main menu.")

                    if(await ServerUtils.InputManager.readLine() != "ok")return
                    
                    
                    
                    
                    

                    const contents = (ServerUtils.getJSONFile(path_to_hproj))

                    contents["isActive"] = false

                    ServerUtils.writeFile(path_to_hproj,JSON.stringify(contents))

                    

                    console.log(chosen_project.getName() + " has been removed.")
                }else{
                    console.log("HProj.json is missing in the project directory. Reconstruct or recover the file and restart the program")
                }

                await refreshLists()

                console.log("Press Enter to return")
                await ServerUtils.InputManager.readLine() 
            }),


            new Utils.HOption("Make a Template", async (v) => {
                let type
                let template_name
                let path_to_template
                console.log("Choose which type of project your template will be for.\n")
                console.log(HCreate_Project_Type_Options.toString())
                while(true){
                    type = await await HCreate_Project_Type_Options.getOptions()[Number.parseInt((await ServerUtils.InputManager.readLine(getRangeArr(1, HCreate_Project_Type_Options.getOptions().length), "thats not a valid input"))) - 1].performAction()

                    if (type == null) return
                    else break
                }

                 console.log('Enter a name for your Template\nType cancel to return.\n') 

                while(true){
                    let inp = await ServerUtils.InputManager.readLine()
                    if(inp == 'cancel') return null
                    if(!inp.includes(" ")){
                        if(inp.length >= 3){
                            if((type == "frontend" && !ServerUtils.isDirectory(Path.join("./res/templates/frontend_templates" , inp))) || (type == "backend" && !ServerUtils.isDirectory(Path.join("./res/templates/backend_templates" , inp)))){
                                template_name = inp.toString()
                                break
                            }else console.log("A Template with that name already exists.")
                        }else console.log("Template name must be at least 3 characters long.")
                    }else console.log("Template name cannot contain any spaces. use - or _ instead.")
                }

                console.log("\nEnter the path to where your template is stored.\nAll the files and folders will be copied from thereand placed within the JPM's templates folder. Templates must be deleted manually.")

                while(true){
                    let inp = await ServerUtils.InputManager.readLine()

                    if(inp == 'cancel') return null
                    if(ServerUtils.isDirectory(inp)) {
                        path_to_template = inp
                        break
                    }
                    console.log("The path specified does not point to a folder. Please enter a valid path.")
                }
                try {
                    ServerUtils.copyDirectory(path_to_template, (type == "frontend") ? "./res/templates/frontend_templates" : "./res/templates/backend_templates", template_name)
                    HFRONTEND_TEMPLATE_OPTIONS = (new HFrontEndTemplates_List())

                    HBACKEND_TEMPLATE_OPTIONS = (new HBackEndTemplates_List())

                console.log(template_name + " template created. Press Enter to return.")
                
                } catch (error) {
                    console.error("An error occued while copying your template, Some things may be missing from it.")
                }
                
                
                await ServerUtils.InputManager.readLine()
                
            }),


            new Utils.HOption("Configuration", async (v) => {
                console.log(HCONFIGURATION_MENU_LIST_OPTIONS.toString())

               if(await HCONFIGURATION_MENU_LIST_OPTIONS.getOptions()[Number.parseInt((await ServerUtils.InputManager.readLine(getRangeArr(1, HCONFIGURATION_MENU_LIST_OPTIONS.getOptions().length), "thats not a valid input"))) - 1].performAction() == null) return null

                console.log("Press enter to return")
                await ServerUtils.InputManager.readLine()
            }),


            new Utils.HOption("Exit", async () => process.exit(0))

        ])
    }
}

export class HConfiguration_Menu_List extends Utils.HOptionList{
    constructor(){
        //develper can change their projects directory
        super([
            new Utils.HOption("Change Projects Directory",async () => {
                const script_dir = import.meta.dirname
                const path_to_HConfig = Path.join(script_dir, "HConfig.json")

                if(ServerUtils.isFile(path_to_HConfig)){
                    let HConfig = ServerUtils.getJSONFile(path_to_HConfig) 
                        
                    console.log(H_NO_PROJDIR_FOUND_OPTIONS.toString())

                    let selected_option = H_NO_PROJDIR_FOUND_OPTIONS.getOptions()[(Number.parseInt((await ServerUtils.InputManager.readLine(getRangeArr(1,H_NO_PROJDIR_FOUND_OPTIONS.getOptions().length), "Thats not a valid input")))) - 1]

                    let inp = await selected_option.performAction(script_dir)

                    console.log(inp)
                }else{
                    console.log("HConfig.json is missing, please reconstruct it or recover it.")
                }
                return ""
            }),

            new Utils.HOption("View Projects Directory Path", async () => {
                const script_dir = import.meta.dirname
                const path_to_HConfig = Path.join(script_dir, "HConfig.json")
                    if(ServerUtils.isFile(path_to_HConfig)){
                        console.log(path_to_HConfig)
                    }else console.log("HConfig.json file is missing. please recover it or change the project directory.")

                    return ""
            }),


            new Utils.HOption("cancel", () => null)
        ])
    }
}


//6/4/2025
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

async function refreshLists(){
    HPROJECT_LIST_OPTIONS = (new HProject_List())

    HPROJECT_INFO_LIST_OPTIONS = (new HProject_Info_List())

    HACTIVE_PROJECTS_LIST_OPTIONS = (new HActive_Projects_List())

    HINACTIVE_PROJECTS_LIST_OPTIONS = (new HInactive_Projects_List())

    HPROJECT_VISIBILITY_LIST_OPTIONS = (new HProject_Visibility_List())

    HTYPED_ACTIVE_PROJECTS_LIST_OPTIONS = (new HTyped_Active_Projects_List())

    HTYPED_INACTIVE_PROJECTS_LIST_OPTIONS = (new HTyped_Inactive_Projects_List())

    HTYPED_PROJECTS_LIST = (new HTyped_Projects_List())
}

export const H_NO_PROJDIR_FOUND_OPTIONS = (new HUser_Directory_Resolve())

export const HPROJECT_MANAGER_MAIN_MENU_OPTIONS = (new HProject_Manager_Main_Menu())

export const HCreate_Project_Type_Options = (new HCreate_Project_Type())

export let HFRONTEND_TEMPLATE_OPTIONS = (new HFrontEndTemplates_List())

export let HBACKEND_TEMPLATE_OPTIONS = (new HBackEndTemplates_List())

//everything to do with managing project folders
export let HPROJECT_LIST_OPTIONS = (new HProject_List())

export let HPROJECT_INFO_LIST_OPTIONS = (new HProject_Info_List())

export let HACTIVE_PROJECTS_LIST_OPTIONS = (new HActive_Projects_List())

export let HPROJECT_VISIBILITY_LIST_OPTIONS = (new HProject_Visibility_List())

export let HINACTIVE_PROJECTS_LIST_OPTIONS = (new HInactive_Projects_List())

export let HTYPED_ACTIVE_PROJECTS_LIST_OPTIONS = (new HTyped_Active_Projects_List())

export let HTYPED_INACTIVE_PROJECTS_LIST_OPTIONS = (new HTyped_Inactive_Projects_List())

export let HTYPED_PROJECTS_LIST = (new HTyped_Projects_List())

export let HBROWSER_OPTION_LIST_OPTIONS = (new HBrowser_Option_List())

export let HCONFIGURATION_MENU_LIST_OPTIONS = (new HConfiguration_Menu_List())

//---


export let MISSING_BACKEND_TEMPLATES_ERRMSG =  "*backend templates are missing, you will be unable to create backend projects. if you deleted or moved the folder, place it back where it was and re-run the program.* If you cannot recover the folder navigate to this link: \nhttps://github.com/heavenly05/JS-Project-Manager/tree/development/res/templates \nDownload the backend_templates folder and place it in the the following path: " + Path.join(Path.dirname(import.meta.dirname),"/res/templates") +" if the res or template folder does not exist place reconstruct the path.\n\nThe last option is to create your own backend template*"

export const MISSING_FRONTEND_TEMPLATES_ERRMSG =  "*frontend templates are missing, you will be unable to create frontend projects. if you deleted or moved the folder, place it back where it was and re-run the program.* If you cannot recover the folder navigate to this link: \nhttps://github.com/heavenly05/JS-Project-Manager/tree/development/res/templates \nDownload the frontend_templates folder and place it in the the following path: " + Path.join(Path.dirname(import.meta.dirname),"/res/templates") +"\nif the res or template folder does not exist, reconstruct the path.\n\nThe last option is to create your own frontend template*\n\n"

