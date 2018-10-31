const main = function() {
  createDOMElements();
  prepareDOMListeners();
  emptyListMessage();
}
const DomElements = {};

function createDOMElements() {
  DomElements.addBtn = document.querySelector('#addBtn');
  DomElements.clearBtn = document.querySelector('#clearBtn');
  DomElements.inputTitle = document.querySelector('#title');
  DomElements.list = document.querySelector('#list');
  DomElements.emptyDiv = document.querySelector('#emptyDiv');
}


function prepareDOMListeners() {
  DomElements.addBtn.addEventListener('click', createTask);
  DomElements.list.addEventListener('click', listElementsController);
  DomElements.clearBtn.addEventListener('click', removeAll);
}

function createTask() {
  // Checking input
  const taskName = readTaskFromInput();

  validateTask(taskName); 
}

function validateTask(taskName) {
  // Input isn't empty
  if(taskName !== '' ) {
    const check = [...document.querySelectorAll('.textSpan')].some(el => el.textContent === taskName);
    // Checking if task with that name exists
    // add if not
    if(!check) {
      const li = addListElement(taskName);
      DomElements.list.appendChild(li);
      emptyListMessage();
    } else {
      // Checking if task already exists
      // print msg if yes
      DomElements.emptyDiv.style.display = 'block';
      printMessage(`Chosen task exists. Remove the previous one "${taskName}" and try to add once again.`);
      setTimeout(() => {
        DomElements.emptyDiv.style.display = 'none';
      }, 2000);
    }
  } 
  // input is empty
  else {
    DomElements.emptyDiv.style.display = 'block';
    printMessage('Task name required ...');
    setTimeout(() => {
      DomElements.emptyDiv.style.display = 'none';
      emptyListMessage();
    },2000);
  }
}


function listElementsController(e) {
  if(e.target.tagName === "LI") e.target.className = (e.target.className === 'checked') ? '' :'checked'; 
  // Adding new classes from e.target
  const classBtn = e.target.className;
  // Reading name of an existing task
  let currentTask = e.target.parentElement.querySelector('.textSpan');
  let newTask = '';

  let insert;
  
  if(classBtn === "close") {
    e.target.parentElement.remove();
    emptyListMessage();
  } 
  
  if(classBtn === "edit") {
    // adding class active, which will expand input element
    insert = e.target.parentElement.querySelector('.insert')
    insert.classList.toggle('active');
    insert.focus();
    // hiding edit
    e.target.classList.toggle('hide');
    // Displaying 'Accept' & 'Reject'
    e.target.parentElement.querySelectorAll('.actionBtn')
      .forEach(el => el.classList.toggle('hide'));
  } 
  
  if(classBtn.includes("accept")) {
    const element = e.target.parentElement.querySelector('.insert');
    insert = element.value !== '' ? element : false;

    if(insert.value) {
      e.target.parentElement.querySelector('.edit').classList.toggle('hide');
      insert.classList.toggle('active');
      newTask = insert.value;
      
      // Hiding 'Accept' & 'Reject'
      e.target.parentElement.querySelectorAll('.actionBtn')
      .forEach(el => el.classList.toggle('hide'));
      
      DomElements.emptyDiv.style.display = 'block';
      printMessage(`Task "${currentTask.textContent}" has been replaced by "${newTask}".`);
        setTimeout(() => {
          DomElements.emptyDiv.style.display = 'none';
        }, 3000);

      currentTask.textContent = newTask;

    } else {
      DomElements.emptyDiv.style.display = 'block';
      printMessage('Task name cannot be empty. "Accept" or "Reject"');
      setTimeout(() => {
        DomElements.emptyDiv.style.display = 'none';
      }, 3000);
    }
  } 
  
  if(classBtn.includes("reject")) {
    currentTask = currentTask;
    e.target.parentElement.querySelector('.edit').classList.toggle('hide');
    insert = e.target.parentElement.querySelector('.insert');
    insert.classList.toggle('active');
    insert.value = '';
    // chowanie 'Accept' i 'Reject'
    e.target.parentElement.querySelectorAll('.actionBtn')
    .forEach(el => el.classList.toggle('hide'));
    
    DomElements.emptyDiv.style.display = 'block';
    printMessage(`Changes in task "${currentTask.textContent}" has been canceled.`);
      setTimeout(() => {
        DomElements.emptyDiv.style.display = 'none';
      }, 2000);
  }
};



function readTaskFromInput() {
  const task = DomElements.inputTitle.value !== '' ?  DomElements.inputTitle.value : '';
  DomElements.inputTitle.select();
  return task;
}

function addListElement(optional = '') {
  let li = document.createElement('li'); // 

  // Span is only for CSS
  // If no argument, function readTaskFromInput will run  
  li.appendChild(createButton('span', `${optional = optional ? optional : readTaskFromInput()}`, 'textSpan'));
    
  // Edit button
  li.appendChild(createButton('span', 'edit[...]', 'edit'));
  
  // Accept button
  li.appendChild(createButton('span', 'Accept', 'accept hide actionBtn'));

  // Reject button
  li.appendChild(createButton('span', 'Reject', 'reject hide actionBtn'));
  
  // Input 
  li.appendChild(createButton('input', '', 'insert', 'placeholder', 'Change name...'));
  
  // delete button
  li.appendChild(createButton('span', 'X', 'close'));
  
  return li;
}

// arrt & attrTest are optional
function createButton(tag, text, klasa, attr = null, attrText = null) {
  let element = document.createElement(`${tag}`);
  element.textContent = `${text}`;
  element.className = `${klasa}`;
  if(attr && attrText) element.setAttribute(attr, attrText);
  return element;
}

function emptyListMessage() {
  
  const count = DomElements.list.childElementCount;
  if(count > 0) {
    DomElements.emptyDiv.style.display = 'none';
    printMessage('The list has no elements');
  } else {
    DomElements.emptyDiv.style.display = 'block';
  }
  
  if(count >= 2) {
    DomElements.clearBtn.style.display = 'block';
  } else {
    DomElements.clearBtn.style.display = 'none';
    printMessage('The list has no elements');
  }
}

function printMessage(message) {
  DomElements.emptyDiv.innerHTML = `<p>${message}</p>`;
}

function showHide(action, element) {
  action = action == 'show' ? 'block' : 'none';
  const el = checkElement(element);

  el.style.display = `${action}`;
}

function checkElement(el) {
  if(document.querySelector(`.${el}`)) {
    return document.querySelector(`.${el}`);
  } else if(document.querySelector(`#${el}`)) {
    return document.querySelector(`#${el}`);
  } else {
    return document.querySelector(`${el}`);
  }
}

function removeAll() {
  DomElements.list.innerHTML = '';
  DomElements.clearBtn.style.display = 'none';
  emptyListMessage();
}

document.addEventListener('DOMContentLoaded', main);