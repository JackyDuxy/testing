// elements
const button = document.getElementById("submit");
const history_button = document.getElementById('showhistory');
const history_delete = document.getElementById('deletehistory');

//prev_container
var prev_container = prev_containers;

console.log("test prevcon")
console.log(prev_container)

let counter = document.getElementById("counter");
// instead of = 0 need to be equal to what database says
let num = prev_container[0]["num"]

let task = document.getElementById("descripition");
let task_img = document.getElementById("task_img");
let display = document.getElementById("display");

let task_input = "";
let task_img_input = "";

//lists to append to local storage
let text_list = []
let img_list = []

// index number
let fct = 0

//enter -> empty line for display
const br = document.createElement('br');
console.log("inside script.js")
console.log(prev_containers)

// grabbign the lists from local storage
localStorage.getItem("ImageList")
localStorage.getItem("TextList")


// if there is stuff on local storage -> we load them and set them into our variables
if(localStorage.getItem("TextList") != null){
    text_list = localStorage.getItem("TextList").split(",");
    img_list =localStorage.getItem("ImageList").split(",");
    fct = localStorage.getItem("TextList").split(",").length - 1;
}




// when the submit button is pressed  -> run button pressed function
button.addEventListener("click", button_pressed);

//when history button presse show history
history_button.addEventListener("click", show_history);


// function delete_his(){
//     text_list = [];
//     img_list = [];
// }

//edit function -> create two text box which allows users to edit the current divs text and images
function edit_pressed(){
    // //parentnode of the parente node of the edit button we pressed (aka div container that stores our text and image)
    // console.log("parent of paretn of edit button")
    // console.log(this.parentNode.parentNode)
    // //this.parentNode parent of the edit button we pressed (aka div the contains the three buttons)
    // console.log("parent of edit button")
    // console.log(this.parentNode)
    // //this == edit button that was pressed
    // console.log("edit button we pressed")
    // console.log(this)
    //we are grabbing the container that stores all user input
    let divs = this.parentNode.parentNode


    //grabbed the orignal text and image from the div we are editing
    let old_txt  = divs.childNodes[0]
    let old_img = divs.childNodes[1]

    //create two input elements for user to input their updated items
    let edit_text = document.createElement("input");
    let edit_url = document.createElement("input");

    // setting up place holders and ids for the created elements
    edit_text.placeholder = "The task you want to change";
    edit_url.placeholder = "The url you want to change";
    edit_text.className = "edit_text";
    edit_url.className = "edit_url";

    //create a div container to hold our two input elements
    const edit_con = document.createElement('div')
    edit_con.className = ("inside")

    //the new submit button
    let submit_button = document.createElement('button')
    submit_button.innerText = "Submit"

    submit_button.id = this.id



    //update our display to show the update input element and new submit button
    divs.appendChild(br);
    divs.appendChild(br);
    divs.appendChild(edit_con);

    //the add the input elements inside our edit con container
    edit_con.appendChild(edit_text);
    edit_con.appendChild(edit_url);
    edit_con.appendChild(br);
    edit_con.appendChild(submit_button);

    //update our text and images
    function submit_button_pressed(){

        old_img.src = edit_url.value;
        divs.appendChild(br)
        old_txt.innerText = edit_text.value;
        divs.appendChild(br)
        divs.removeChild(edit_con)
        
        console.log(this.id)
        // update backend

        // HOMEWORK fix it so that we grab old img and old text as string and pass it to sendedit
        console.log(edit_url.value, edit_text.value)


        var sendedit= {"id": this.id, "username":username, "edit_text":edit_text.value , "edit_url":edit_url.value}



        console.log("sendedit:", sendedit)

        // edit text and img
        fetch('/edit_pass', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(sendedit)
        }).then(response => response.json()).then(sendedit => {
            // Handle the response data here
            console.log(sendedit);
        
            // // After a successful POST request, redirect to another page
            // window.location.href = '/blog';
        }).catch(error => {
            console.error("Error:", error);
        });

            // we need to also update our prev container

        }
    //when ever our users click on the update button we need to update our display 
    submit_button.addEventListener("click", submit_button_pressed);
}

function delete_pressed(){

    var divs = this.parentNode.parentNode;
    //grab the unorderlist
    var parentDiv = divs;
    // console.log(parentDiv)
    let checkers = parentDiv.childNodes[0].textContent;
    parentDiv.remove();

    console.log("BEFORE DELETE")
    console.log(text_list)
    console.log(img_list)

    let index_remove = text_list.indexOf(checkers);

    console.log(index_remove)
    delete text_list[index_remove];
    delete img_list[index_remove];

    // local lists    
    console.log("After DELETE1");
    text_list = text_list.join(' ').trim('').split(' ');
    img_list = img_list.join(' ').trim('').split(' ');

    console.log(text_list);
    console.log(img_list);
    
    console.log("After DELETE2");

    localStorage.setItem("TextList",text_list);
    localStorage.setItem("ImageList",img_list);
    console.log(localStorage.getItem(text_list));
    console.log(localStorage.getItem(img_list));
}
//submit button
function finish_pressed() {

    let list_content_containers = this.parentNode.parentNode.parentNode
    let content_container = this.parentNode.parentNode;

    console.log("content_container_list")
    console.log(list_content_containers)

    console.log("content_container")
    console.log(content_container)

    console.log(this.id)
    // before delete from prev container
    console.log(prev_containers)
    for (let i = 1; i < prev_containers.length; i = i + 1) {
        
        console.log(this.id)
        console.log(prev_containers[i]["id"])

        if (this.id == prev_containers[i]["id"]){
            console.log(prev_container[i]["id"])
            prev_containers.splice(i,1)
            console.log("after id for loop:")
            console.log(prev_container)
            break
        }
    
    }

    //after delete from prev container
    console.log(prev_container)
    

    num += 1;
    counter.innerText = "Finished: " + num;

    

    var dataToSendNum = {"id": this.id, "num":num, "username":username}
    console.log(dataToSendNum)

    // removes from backend
    fetch('/num_pass', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSendNum)
    }).then(response => response.json()).then(dataToSendNum => {
        // Handle the response data here
        console.log(dataToSendNum);
    
        // // After a successful POST request, redirect to another page
        // window.location.href = '/blog';
    }).catch(error => {
        console.error("Error:", error);
    });

    
 

    content_container.remove()

  
  }

//functions
//Finish Button - Real
function button_pressed(){

    //grabbing user input values after they click submit and store them 
    task_input = task.value;
    task_img_input = task_img.value;

    // creating elements for our divs display
    //unordered list tag which will store our task val
    let ul = document.createElement("ul");

    //image tag which will store user inputed image 
    let image = document.createElement('img');

    //setting the image to user input
    image.src = task_img_input;

    // create an div card inside
    let divs = document.createElement('div');

    //setting container id for our div
    divs.id = "container";

    //button div
    let button_divs = document.createElement('div');

    //create finish, backspace, and edit button for  our button div
    const finish = document.createElement('button');
    const edit = document.createElement('button');

    //setting the text and ids for each of our buttons
    finish.innerText = "Finished";
    finish.id = unique_id;
    finish.className = "FinishButton"
    edit.innerText = "Edit";
    edit.id = unique_id;
    edit.className = "EditButton";

    prev_container['task'] = text_list;
    prev_container['image'] = text_list;

    //add the eventlistner of the buttons
    finish.addEventListener("click", finish_pressed);
    edit.addEventListener("click", edit_pressed);



    ul.textContent = task_input;

    display.appendChild(divs);
    divs.appendChild(ul);
    divs.appendChild(image);
    divs.appendChild(br);
    divs.appendChild(br);
    divs.appendChild(button_divs)
    button_divs.appendChild(finish);
    button_divs.appendChild(edit);


    // add image to children
    task.value = "";
    task_img.value = "";



    //data we want to send to main.py so that we can update database
    var dataToSend = {"id": unique_id, "task": task_input, "img": task_img_input, "username": username}
    console.log(dataToSend)

    //we are going to redirect utilizing fetch method
    fetch('/submit_data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
    }).then(response => response.json()).then(data => {
        // Handle the response data here
        console.log(data);
    
        // // After a successful POST request, redirect to another page
        // window.location.href = '/blog';
    }).catch(error => {
        console.error("Error:", error);
    });

    

    //1.  append datatosend to prev container
    prev_container.push(dataToSend)

    console.log("After push", prev_container)
    //2.  increment unique id
    unique_id +=1

    
    
}

function show_history(){

    // let temporaryData;
    // let thatdata;

    // fetch('/get_data')
    //     .then(response => response.json())
    //     .then(thedata => {
    //         temporaryData = thedata;
    //         console.log(temporaryData);
    //         processData(temporaryData);
    //     })
    //     .catch(error => console.error('Error:', error));

    // function processData(thatdata) {
        
    //     console.log('Processing data:', thatdata);
    // }

    while(display.childNodes[1] != null){
        display.childNodes[1].remove();
        console.log(display.childNodes[1]);
        if(display.length == 1){
            break
        }
    }

    // //grab the data from the function
    // let finaldata = processData(thatdata)

    // console.log(finaldata)
    // //things in thatdata
    // if (finaldata) {
    //     let changeline = document.createElement("br");
    //     console.log(finaldata["img"]);
    //     console.log(finaldata["task"]);
    
    //     display.appendChild(changeline);
    
    //     let ul = document.createElement("ul");
    //     let image = document.createElement('img');
    //     image.src = finaldata["img"];
    //     ul.textContent = finaldata["task"];
    
    //     let div_con = document.createElement('div');
    //     div_con.id = "container";
    
    //     let button_divs = document.createElement('div');
    //     const br = document.createElement('br');
    
    //     const finish = document.createElement('button');
    //     const edit = document.createElement('button');
    
    //     finish.innerText = "Finished";
    //     finish.id = "FinishButton";
    //     edit.innerText = "Edit";
    //     edit.className = "EditButton";
    
    //     display.appendChild(div_con);
    //     div_con.appendChild(ul);
    //     div_con.appendChild(image);
    //     div_con.appendChild(br);
    //     div_con.appendChild(button_divs);
    //     button_divs.appendChild(finish);
    //     button_divs.appendChild(edit);
    
    //     finish.addEventListener("click", finish_pressed);
    //     edit.addEventListener("click", edit_pressed);
    // }
    // //instructions:
    
    //if there is nothing in the array prev_containers do nothing
    if(prev_container.length > 1){
        //transcript for loop that under else\
        // console.log(thedata)
        for (let ct = 1; ct <= prev_container.length-1; ct = ct+1){
            let changeline = document.createElement("br");
            console.log(ct)
            // task for understanding: log the IMG, TASK, USER, and ID, of each container in prev container
            console.log(prev_container[ct]["img"]);
            console.log(prev_container[ct]["task"]);
            // console.log(prev_containers[1]);
            display.appendChild(changeline);

            let ul = document.createElement("ul");

            //image tag which will store user inputed image 
            let image = document.createElement('img');

            //setting the image to past user input
            image.src = prev_containers[ct]["img"];

            //settign the ul to past user input
            ul.textContent = prev_containers[ct]["task"];
            
            // create an div card inside
            let div_con = document.createElement('div');

            //setting container id for our div
            div_con.id = "container";

            //button div -> div contaner to store our buttons :>
            let button_divs = document.createElement('div');

            //enter -> empty line for display
            const br = document.createElement('br');

            //create finish, backspace, and edit button for  our button div
            const finish = document.createElement('button');
            const backspace = document.createElement('button');
            const edit = document.createElement('button');

            //setting the text and ids for each of our buttons
            finish.innerText = "Finished";
            finish.id = prev_container[ct]["id"];
            backspace.innerText = "Delete";
            edit.id = prev_container[ct]["id"];
            edit.innerText = "Edit";
            edit.className = "EditButton";
            
            //adding all the elements inton display
            display.appendChild(div_con);
            div_con.appendChild(ul);
            div_con.appendChild(image);
            div_con.appendChild(br)
            div_con.appendChild(button_divs);
            button_divs.appendChild(finish);
            button_divs.appendChild(edit);

            finish.addEventListener("click", finish_pressed);
            edit.addEventListener("click", edit_pressed);
        }

   
    }
    else {
        console.log("nothing")
    }

    // console.log(thedata)

}


history_delete.addEventListener("click", delete_his);

function delete_his() {

    while(display.childNodes[1] != null){
        display.childNodes[1].remove();
        console.log(display.childNodes[1]);
        if(display.length == 1){
            break
        }
    }



    console.log(prev_containers);
    for (let i = 1; i <= prev_containers.length; i = i + 1) {
        let ul = document.createElement("ul");
        // Image tag which will store user inputted image
        let image = document.createElement('img');
        // Setting the image to past user input
        image.src = prev_containers[i]["image"]; // Assuming 'image' is the key for image source
        // Setting the ul to past user input
        ul.textContent = prev_containers[i]["task"]; // task text

        // Create a div card inside
        let div_con = document.createElement('div');
        // Setting container id for our div
        div_con.id = "container";
        // Enter -> empty line for display
        const br = document.createElement('br');

        // Create a "Delete this task" button
        let deleteButton = document.createElement('button');
        deleteButton.id = prev_container[i]["id"]
        deleteButton.textContent = "Delete this task";

        // Add event listener to the button to handle deletion
        deleteButton.addEventListener('click', delete_btn_individual)
        function delete_btn_individual(){

            console.log(this.id)

            //RuntimeError: 'cryptography' package is required for sha256_password or caching_sha2_password auth methods
            let database_i = {"id": this.id, "username": username}
            console.log(database_i)
            //pass the new variable to main.py
            fetch('/pass_data_dltbtn', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(database_i)
            }).then(response => response.json()).then(data => {
                // Handle the response data here
                console.log(data);
            }).catch(error => {
                console.error("Error:", error);
            });


            for (let i = 1; i < prev_containers.length; i = i + 1) {
        
                console.log(this.id)
                console.log(prev_containers[i]["id"])
        
                if (this.id == prev_containers[i]["id"]){
                    console.log(prev_container[i]["id"])
                    prev_containers.splice(i,1)
                    console.log("after id for loop:")
                    console.log(prev_container)
                    break
                }
            
            }

            this.parentNode.remove()



        }
        
        //grabbing the user name in the prev container
        console.log(username)
        //grabbing the variable that has the index of i
                // Adding all the elements into display
        display.appendChild(div_con);
        div_con.appendChild(ul);
        div_con.appendChild(image);
        div_con.appendChild(br);
        div_con.appendChild(deleteButton);
        }
    
    }




// Tips
// parentNode: Get the parent node of the current element.
// parentElement: Get the parent element of the current element.
// children: Get all child elements of the current element.
// firstChild: Get the first child element of the current element.
// lastChild: Get the last child element of the current element.
// previousSibling: Get the previous sibling element of the current element.
// nextSibling: Get the next sibling element of the current element.
// appendChild(): Add an element as a child node of the current element to the parent node.
// removeChild(): Remove the child nodes of the current element from the parent node.
// abcdefghijklmnopqrstuvwxyz