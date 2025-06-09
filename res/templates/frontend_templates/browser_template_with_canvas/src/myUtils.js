

async function getHProjJSON(){
    return ((await fetch("../HProj.json")).json())
}

/**
 * returns the inneHTML of an element to the projects name, according to the HProj.json. if the project_name is undefined it will default to project_name
 * @param {Element} element 
 * @returns {string}
 */
export async function displayProjName(element){
    const HProj = (await getHProjJSON())
    element.innerHTML = (!HProj["project_name"]) ? "project_name" : HProj["project_name"]
}

//define your utilities here