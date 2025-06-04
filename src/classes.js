import * as ServerUtils from "heavens-utils/ServerUtils"
import * as Utils from "heavens-utils/Utils"

export class HUser_Directory_Resolve extends Utils.HOptionList{
    constructor(){
            super([
                new Utils.HOption("Choose your own directory", async () => {
                    console.log("Plese enter a valid directory and it will be used to to hold your projects\ntype 'cancel' at any time to go back.")
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

/**
 *Project manager maiun menu
 */
export class HProject_Manager_Main_Menu extends Utils.HOptionList{
    constructor(){
        super([
            new Utils.HOption("Create new Project", (v) => {
                //the passed in path would be the path to the ProjDir folder

                //we will query the user for, the name of the project, the author, type and if they want utils.

                

            }),

            new Utils.HOption("Load a Project", (v) => {

            }),

            new Utils.HOption("View Current Projects"), (v) => {

            },

            new Utils.HOption("Remove A Project"), (v) => {

            },

            new Utils.HOption("Configuration", (v) => {

            })

        ])
    }
}

//a node project will contain an src folder, will query the user if they want utils and be installed with npm if so. 
//each project will contain a HProj.json file with data like:
//name, date, authors, and type

//a web based project will contain a src folde rand th eoption to have the utils.js file. it will have a index.js file that has a canvas and a title with the prject name ffrom the HProj.json file.

//if a folder doesnt have a HProj file and it is in HprojDir then it will be ignored

//the user should be able to configure where they want to place their projects 





export const H_NO_PROJDIR_FOUND_OPTIONS = (new HUser_Directory_Resolve())
export const HPROJECT_MANAGER_MAIN_MENU_OPTIONS = (new HProject_Manager_Main_Menu())