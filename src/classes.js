import * as ServerUtils from "heavens-utils/ServerUtils"
import * as Utils from "heavens-utils/Utils"

export class HUser_Directory_Resolve extends Utils.HOptionList{
    constructor(){
            super([
                new Utils.HOption("Enter path to an existing Projects Directory", async () => {
                    console.log("Plese enter a valid directory and it will be used to thold your projects\ntype 'cancel' at any time to go back.")
                    while(true){
                        let inp = await ServerUtils.InputManager.readLine()
                        if(inp == 'cancel') return null
                        if(ServerUtils.isDirectory(inp)) return inp
                        console.log("The path specified does not point to a folder. Please select enter a valid path.")
                }
            }
            ),
            new Utils.HOption("Enter path to create a new Projects Directory"),
            new Utils.HOption("Let the project manager create a new Projects driectory")
            ])
        }
    }


export const H_NO_PROJDIR_FOUND_OPTIONS = (new HUser_Directory_Resolve())