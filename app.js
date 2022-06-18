// Selectors
const todo = Array.from(document.getElementsByClassName('todo'))
const todoInput = document.querySelector('.todo-input')
const todoButton = document.querySelector('.todo-button')
const todoList = document.querySelector('.todo-list')
const filterOption = document.querySelector('.filter-todo')
const contextMenu = document.querySelector('.contextMenu')

// Functions

const CONTEXT_OPTIONS = ['Finish Task', 'Delete Task']

const contextFunc = e => {
    e.preventDefault()
    contextMenu.innerHTML = null
    contextMenu.style = null
    const h = window.innerHeight, w = window.innerWidth, y = e.clientY, x = e.clientX, ch = CONTEXT_OPTIONS.length * 40, cw = 200
    CONTEXT_OPTIONS.forEach(option => {
        const contextItem = document.createElement('li')
        contextItem.classList.add('contextItem')
        contextItem.innerText = option
        if (option === 'Finish Task') {
            contextItem.addEventListener('click', () => contextFinish(e))
        } else if (option === 'Delete Task') {
            contextItem.addEventListener('click', () => contextDelete(e))
        }
        contextMenu.append(contextItem)
    })
    contextMenu.classList.add('show')
    contextMenu.style.top = `${h - y < ch ? null : y}px`
    contextMenu.style.bottom = `${h - y < ch ? h - y : null}px`
    contextMenu.style.left = `${w - x < cw ? null : x}px`
    contextMenu.style.right = `${w - x < cw ? w - x : null}px`
}

const contextFinish = e => {
    const todo = e.target.closest('.todo')
    todo.classList.contains('completed') ? todo.classList.remove('completed') : todo.classList.add('completed')
}

const contextDelete = e => {
    const todo = e.target.closest('.todo')
    console.log(todo)
    todo.classList.add('fall')
    removeLocalTodos(todo)
    todo.addEventListener('transitionend', () => {
        todo.remove()
    })
}

const removeContextFunc = () => {
    contextMenu.innerHTML = ''
    contextMenu.classList.remove('show')
    contextMenu.style = null
}

const addTodo = (event) => {
    event.preventDefault()

    const todoDiv = document.createElement('div')
    todoDiv.classList.add('todo')
    todoDiv.addEventListener('contextmenu', contextFunc)

    const newTodo = document.createElement('li')
    newTodo.innerText = todoInput.value
    newTodo.classList.add('todo-item')
    todoDiv.appendChild(newTodo)

    saveLocalTodos(todoInput.value)

    const completedButton = document.createElement('button')
    completedButton.innerHTML = '<i class="fas fa-check"></i>'
    completedButton.classList.add('complete-btn')
    todoDiv.appendChild(completedButton)

    const trashButton = document.createElement('button')
    trashButton.innerHTML = '<i class="fas fa-trash"></i>'
    trashButton.classList.add('trash-btn')
    todoDiv.appendChild(trashButton)

    todoList.appendChild(todoDiv)

    todoInput.value = ''
}

const deleteCheck = (e) => {
    const item = e.target
    // delete
    if (item.classList[0] === 'trash-btn') {
        const todo = item.parentElement
        // animation
        todo.classList.add('fall')
        removeLocalTodos(todo)
        todo.addEventListener('transitionend', () => {
            todo.remove()
        })
    }
    // check mark
    if (item.classList[0] === 'complete-btn') {
        const todo = item.parentElement
        todo.classList.toggle('completed')
    }
}

const filterTodo = (e) => {
    const todos = todoList.childNodes
    todos.forEach((todo) => {
        switch (e.target.value) {
            case "all":
                todo.style.display = 'flex'
                break
            case "completed":
                if (todo.classList.contains("completed")) {
                    todo.style.display = 'flex'
                } else {
                    todo.style.display = 'none'
                }
                break
            case "uncompleted":
                if (!todo.classList.contains("completed")) {
                    todo.style.display = 'flex'
                } else {
                    todo.style.display = 'none'
                }
                break
        }
    })
}

const saveLocalTodos = (todo) => {
    let todos
    if (localStorage.getItem('todos') === null) {
        todos = []
    } else {
        todos = JSON.parse(localStorage.getItem('todos'))
    }
    todos.push(todo)
    localStorage.setItem('todos', JSON.stringify(todos))
}

const getTodos = () => {
    let todos
    if (localStorage.getItem('todos') === null) {
        todos = []
    } else {
        todos = JSON.parse(localStorage.getItem('todos'))
    }
    todos.forEach(todo => {
        // Div
        const todoDiv = document.createElement('div')
        todoDiv.classList.add('todo')
        todoDiv.addEventListener('contextmenu', contextFunc)
        // li
        const newTodo = document.createElement('li')
        newTodo.innerText = todo
        newTodo.classList.add('todo-item')
        todoDiv.appendChild(newTodo)
        // check button
        const completedButton = document.createElement('button')
        completedButton.innerHTML = '<i class="fas fa-check"></i>'
        completedButton.classList.add('complete-btn')
        todoDiv.appendChild(completedButton)
        // trash button 
        const trashButton = document.createElement('button')
        trashButton.innerHTML = '<i class="fas fa-trash"></i>'
        trashButton.classList.add('trash-btn')
        todoDiv.appendChild(trashButton)
        // append to list
        todoList.appendChild(todoDiv)
    })
}

const removeLocalTodos = (todo) => {
    let todos
    if (localStorage.getItem('todos') === null) {
        todos = []
    } else {
        todos = JSON.parse(localStorage.getItem('todos'))
    }
    const todoIdex = todo.children[0].innerText
    todos.splice(todos.indexOf(todoIdex), 1)
    localStorage.setItem('todos', JSON.stringify(todos))
}

// Event Listeners

todoButton.addEventListener('click', addTodo)
todoList.addEventListener('click', deleteCheck)
filterOption.addEventListener('click', filterTodo)
document.addEventListener('DOMContentLoaded', getTodos)
document.addEventListener('click', removeContextFunc)
document.addEventListener('contextmenu', e => e.preventDefault())