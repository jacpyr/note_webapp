var notes = [];
var selectedElement = 0;

function indexOfFirstLine(text) {
    let index = text.indexOf("\n");
    if (index === -1) index = undefined;
    return index;
}

function generateSummary(text, noOfLetters) {
    if (text.length < noOfLetters) {
        return text;
    }
    else {
        return text.substring(0, noOfLetters) + "...";
    }
}

function sortFunction(a, b) {
    if (a[0] === b[0]) {
        return 0;
    }
    else {
        return (a[0] > b[0]) ? -1 : 1;
    }
}

$(document).ready(function () {
    if (localStorage.getItem('notes') === null) {
        notes = [];
    } else {
        notes = JSON.parse(localStorage.getItem('notes'));
    }
    notes.sort(sortFunction);
    let list = document.getElementById("note_list");
    if (notes.length != 0) {
        for (let i = 0; i < notes.length; i++) {
            let note_heading = notes[i][1];
            let note_content = generateSummary(notes[i][2],10);
            let listItem=create_note_list_element(note_heading,note_content,i)
            if(i==selectedElement){
                listItem.style.backgroundColor='#eef3f8';
            }
            list.appendChild(listItem);
        }
        document.getElementById("static_content").style.display = "none";
        document.getElementById("note_content").style.display = "block";
    }
    else {
        document.getElementById("static_content").style.display = "block";
        document.getElementById("note_content").style.display = "none";
    }
    if(notes.length>0){
        displayNote('0');
    }
    
});

function create_note_list_element(heading,content,i){
    let note_wrapper = document.createElement('div');
    let note_heading = document.createElement('div');
    let note_content = document.createElement('div');
    let button_wrapper = document.createElement('div');
    let button = document.createElement('button');
    let listItem =document.createElement('li');
    listItem.className='note_summary';
    note_wrapper.className = 'note_wrapper';
    button_wrapper.className='button_wrapper';
    note_heading.className='note_heading'
    note_content.className='note_content';
    button.className='delete_button';
    button.onclick = deleteNotes;
    button.id='button_'+i;
    button.innerHTML='<img class="delete_img" src="./css/images/delete_button2.png">';
    note_heading.innerHTML=heading;
    note_content.innerHTML=content;
    note_wrapper.appendChild(note_heading);
    note_wrapper.appendChild(note_content);
    button_wrapper.appendChild(button);
    listItem.appendChild(note_wrapper);
    listItem.appendChild(button_wrapper);
    listItem.onclick=displayNotes;
    return listItem;
}

/*function add_note(){
    let note_heading = '';
    let note_content = '';
    var list = document.getElementById('note_list');
    list.appendChild(create_note_list_element(note_heading,note_content));
}
*/

function displayNote(ind){

    selectedElement = ind;
    text = notes[ind][1] + '\n' + notes[ind][2];
    document.getElementById("note_content").value='';
    document.getElementById("note_content").value = text;
}

function reset_list_bgcolor(list){
    let nodes = Array.from(list.children);
    nodes.forEach((el) => {
        el.style.backgroundColor='inherit';
      });
}

var displayNotes = function () {
    let list = document.getElementById('note_list');
    let nodes = Array.from(list.children);
    let ind = nodes.indexOf(this);
    reset_list_bgcolor(list);   
    this.style.backgroundColor='#eef3f8';
    displayNote(ind)
};

var deleteNotes = function (event) {
    let list = document.getElementById('note_list');
    let nodes = Array.from( list.children );
    let node = this.parentElement.parentElement;
    let ind = nodes.indexOf(node);
    event.stopPropagation();
    notes.splice(ind,1);
  
    list.removeChild(node);
    if (notes.length>0){
        displayNote('0');
        selectedElement=0;
    }
    else{
        document.getElementById("static_content").style.display = "block";
        document.getElementById("note_content").style.display = "none";
    }
    localStorage.setItem('notes',JSON.stringify(notes));
};

function addNote() {
    selectedElement = notes.length;
    if (notes.length == 0) {
        document.getElementById("static_content").style.display = "none";
        document.getElementById("note_content").style.display = "block";
    }
    notes.push([Date.now(), '', '']);
    localStorage.setItem('notes',JSON.stringify(notes));
    document.getElementById("note_content").value = '';
    let list = document.getElementById("note_list");
    let listItem=create_note_list_element('','',selectedElement);
    reset_list_bgcolor(list);
    listItem.style.backgroundColor='#eef3f8';
    list.appendChild(listItem);
    document.getElementById('note_content').focus();
    document.getElementById('note_content').select();
}

function changeContent() {
    let in_text = document.getElementById("note_content").value;
    ind = indexOfFirstLine(in_text);
    let heading = '';
    let content = '';
    if (ind > 0) {
        heading = in_text.substring(0, ind);
        content = in_text.substring(ind + 1, in_text.length);
    }
    else {
        heading = in_text;
        content = '';
    }
    notes[selectedElement][0] = Date.now();
    notes[selectedElement][1] = heading;
    notes[selectedElement][2] = content;
    localStorage.setItem('notes', JSON.stringify(notes));
    let listElement = document.getElementsByClassName('note_summary')[selectedElement];
    let targetDiv = listElement.getElementsByClassName("note_heading")[0];
    targetDiv.innerHTML = heading;
    targetDiv = listElement.getElementsByClassName("note_content")[0];
    targetDiv.innerHTML = generateSummary(content, 10);
    let nodes = Array.from(document.getElementsByClassName('note-summary'));
    nodes.forEach(element => {
        element.onclick='displayNotes';
    });
    return 0;
}