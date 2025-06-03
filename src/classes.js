import { HOptionList, HOption} from "heavens-utils/Utils"

export class H_NO_ProjDir_Found extends HOptionList{
    constructor(){
        super([
            new HOption("Dinner With JZ")
        ])
    }
}

export const H_NO_PROJDIR_FOUND_OPTIONS = (new H_NO_ProjDir_Found())