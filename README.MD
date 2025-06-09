# Javascript Project Manager (JPM)
### A Project Manager that well, manages Javacript projects, for both backend and frontend projects. No matter if your using nodeJS, react any framewrok or even vanilla js in the web browser this tool will help make your development more enjoyable

# How to Run
## Option 1

1.Navigate to a folder <br>

2.Clone the github repo: ```https://github.com/heavenly05/heavens-utils.git``` <br> 

3.Navigate to the created directories root folder where the ```JPM.bat``` file is located <br>

4.Run ```JPM.bat``` (you can place it on the desktop)

## Option 2
1.Navigate to a folder <br>

2.Clone the github repo: ```https://github.com/heavenly05/heavens-utils.git``` <br> 

3.Navigate to the created directories root folder where the package.json folder is<br>

4.Open the directory in the terminal

5.Use ```node .``` to run the program (its important to run with the ```packge.json``` file as the JPM relies on relative file paths)

# Menus
JPM operates through the CLI (command line interface) It features various menus in which the user interacts through an I/O system allowing for versatile control over nearly everything

# Project Types
The JPM has 2 project types : <br> - Backend Projects <br> - Frontend Projects <br><br> The project types are used to categorize and properly run your projects

# Creating projects
When you create a project in the JPM it creates a folder for your Project in its internal project directory, where every project you create goes. You can create a Project directly from the JPM and it will handle everything. You inut things like the project_name, the type of project, and the authors. You can also choos to upload an existing project, A copy of your project directroy will be made by the JPM and a HProj.json File will be placed in the copy. (for both options) 

# Loading a Project
The JPM can open your project in Visual studio code for you, allowing you to semlessly work on it at the push of a key.

# Removing Projects
 The JPM can remove unwanted projects but not in the traditional sense. It does not delete your files or floders but it filters the folder out by setting ```isActive``` flag in the rojects HProj.json to false. You wold have to manually navigate to the Projects folder and delete your project folder for it to be removed from your computer. 

# Running Projects
### The JPM can run projects for you depending on your project structure and type. <br>
 - [For Backend] : The JPM will first look inside your projects root directory for a pakcage.json file with a main field. If it specifies then the JPM will run the command ```node .``` to try and run it. If your project deosnt specifiy a package.json file with a main field it will check for ```src/main.js``` file and attempt to run that. If your project doesnt contain neither of these the JPM will tell you it could not find the file
- [For Frontend] : The JPM will look for ```src/index.html```, If it exists it will propmt you to choose which browser you want to open it with, default choices being chrome and microsoft edge. but you can specifiy another. If a ```src/index.html``` doesnt exist, The JPM willt ell you it could not find the file.

# Viewing Projects
You can view your Active, Inactive, or Both projects at anytie via the main menu

# Making Templates
You can make your own reuseable template for your projects via the main menu. Heres how it works : <br>You pass in a path to the directory of the template you want to make, Everything in the template will be copied to the JPM's templates folder. You specifiy a name and a type for te teplate and thats it! You an now make projects with that template!

# Configuration
You can change and view the JPM's project directory through the configuration option in the main menu, Take note when you change the Project directory the JPM doesnt take your project folders so youll have to manually go in and copy the folders. The JPM exposes thigns like the Template directory and the Projects Directory so you can go in and make changes as you wish

# Compatibility
I used node v22.16.0 to make this program, I only used built in modules and my own library (which also uses built in modules) so it should be comapatible with older versions of node

### Author Heaven Williams <br>
 Link to heavens-utils library GitHub Repository link : https://github.com/heavenly05/heavens-utils <br> Email: heaventhsaltacc@gmail.com 