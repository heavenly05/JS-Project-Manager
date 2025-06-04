import * as ServerUtils from "heavens-utils/ServerUtils"
import * as Utils from "heavens-utils/Utils"

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
            new Utils.HOption("NodeJS Project", async () => "node"),
            new Utils.HOption("Browser Project", async () => "browser"),
            new Utils.HOption("Cancel", async () => null),
        ])
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

                while(true){
                    let inp = await ServerUtils.InputManager.readLine()
                    if(inp == 'cancel') return null
                    project_name = inp.toString()
                    break
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




            }),

            new Utils.HOption("Load a Project", async (v) => {

            }),

            new Utils.HOption("View Current Projects"), async (v) => {

            },

            new Utils.HOption("Remove A Project"), async (v) => {

            },

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
        let difference = Math.abs(start - end)
        for(let i = start; ((start > end) ? i >= end : i <= end); ((start > end) ? i-- : i++)) arr.push(i)
    return arr
}

export const H_NO_PROJDIR_FOUND_OPTIONS = (new HUser_Directory_Resolve())
export const HPROJECT_MANAGER_MAIN_MENU_OPTIONS = (new HProject_Manager_Main_Menu())
export const HCreate_Project_Type_Options = (new HCreate_Project_Type())