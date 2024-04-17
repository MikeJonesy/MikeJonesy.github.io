import '../assets/css/style.css';

const app = document.getElementById('app');

app.innerHTML = `
    <div class = "todos">
        <div class="todos-header">
            <h3 class="todos-title">ToDo List</h3>
            <div>
                <p>You have <span class="todos-count></span>
                <button class="todos-clear" style="display: none;">
                    Clear the completed ToDos
                </button>
            </div>
        </div>
        <form class="todos-form" name="todos">
            <input type="text" placeholder="what's next?" name="todo">
        </form>
        <ul class="todos-list"></ul>
    </div>
`;

//state
//let toDoList = []

const toDoForm = document.forms.todos
const toDoInput = toDoForm.todo
const toDoList = document.querySelector('.todos-list')


function createToDo(event){
    event.preventDefault()
    console.log(event)
    const toDo = toDoInput.value
    const toDoListItem = `<li>${toDo}</li>`
    appendTodo(toDoListItem)
}

function appendTodo (toDoListItem) {
    console.log(typeof toDoListItem, toDoList)
    toDoList.insertAdjacentHTML('afterbegin',`${toDoListItem}`)
}

toDoForm.addEventListener("submit",createToDo)

