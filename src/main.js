import * as Utils from "heavens-utils/Utils"
import * as ServerUtils from "heavens-utils/ServerUtils"
import * as Path from "node:path"
import { HNO_PROJ_DIR_FOUND } from "./classes"
//We want a project like structure. 

//We want to first see what kind of project the user will be making
//The selections should be Backend and front end, if the selection is backend then create a new folder to it and by default import my utils into the project

//if it is frontend by default add a copy of Utils.js into the workng directory.

//We can smalll options like auto opening a project with code, deleting a project, listing a project etc.

//we will be using windows batch to help with running the correct script

//the first thing to do is collect some data, where is the script currently at?

const script_path = import.meta.filename
const script_dir = import.meta.dirname

let HConfig
// let path_dir

//well make a Hconfig.json file and look for it by default
//the ts config file will contiain a path to the directories of the projects, under the alias "projectDir"

//all projects will have a HPRConfig.json file with meta data in it
async function run(){
    const path_to_HConfig = Path.join(script_dir, "HConfig.json")
    if(ServerUtils.isFile(path_to_HConfig)){
        HConfig = ServerUtils.getJSONFile(path_to_HConfig) 
    }else{
        //if there is no HConfig.json create one, set the projectDir to by defualt HProjects in the current direcotry
        HConfig = ServerUtils.getJSONFile(ServerUtils.writeFile(path_to_HConfig, JSON.stringify({projectDir : Path.join(script_dir, "HProjects")})))
    }

    //now its time to analyze where the projects are.

    let { projectDir } = HConfig

    if(ServerUtils.isDirectory(projectDir)){

    }else{
        HNO_PROJ_DIR_FOUND
    }
}
// run()