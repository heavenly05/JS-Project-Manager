import { HOptionList, HOption} from "heavens-utils/Utils"

export class HUser_Directory_Resolve extends HOptionList{
    constructor(){
        super([
            new HOption("Enter path to an existing Projects Directory"),
            new HOption("Enter path to create a new Projects Directory"),
            new HOption("Let the project manager create a new Projects driectory")
        ])
    }
}

export const H_NO_PROJDIR_FOUND_OPTIONS = (new HUser_Directory_Resolve())