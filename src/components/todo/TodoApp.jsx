// Should own the states

import { useEffect, useState } from "react"
import TodoInput from "./TodoInput"
import TodoList from "./TodoList"
import TodoFilters from './TodoFilters'
import TodoPagination from './TodoPagination'
import { sortedList, buildPagination, buildQueryParams } from '../../utils/helpers'
import { RECORDS_PER_PAGE, INITIAL_TODO_FORM } from '../../utils/Constants'
import { getAllTodos, saveTodo, updateTodo, deleteTodoByID } from '../../services/todoService'
import ConfirmDelete from "./ConfirmDelete"
import Spinner from "../Spinner"
import { useDebounce } from "../../hooks/useDebounce"

function TodoApp() {

    const [todoForm, setTodoForm] = useState(INITIAL_TODO_FORM);
    const [todoItems, setTodoItems] = useState([])
    const [isUpdate, setIsUpdate] = useState(false)
    const [selectedUpdateId, setSelectedUpdateId] = useState(null)
    const [filter, setFilter] = useState({ priority: 'all', status: 'all' })
    const [search, setSearch] = useState('')
    const [seletedSortOption, setSeletedSortOption] = useState('newest')
    const [pageNumber, setPageNumber] = useState(1)
    const [httpError, setHttpError] = useState('')
    const [confirmDel, setConfirmDel] = useState(null)
    const [fetchedApiDetails, setFetchedApiDetails] = useState(null)
    const [skeletonLoading, setSkeletonLoading] = useState(false)
    
    const loadTodos = async (params) => {
        setSkeletonLoading(true)
        try {
            const response = await getAllTodos(params)
            if(response.success) {
                setFetchedApiDetails(response)
                setTodoItems(response.records)
            }
        } catch (e) {
            console.error(e)
        } finally {
            setSkeletonLoading(false)
        }
    }
    const searchQuery = useDebounce(search, 500)
    useEffect(()=>{
        setSkeletonLoading(true)
    }, [search])

    useEffect(() => {
        loadTodos(buildQueryParams(searchQuery, seletedSortOption, filter, pageNumber))
    }, [searchQuery, seletedSortOption, filter, pageNumber])

    const totalPages = (fetchedApiDetails) ? Math.ceil(parseInt(fetchedApiDetails.totalRecords) / RECORDS_PER_PAGE) : 0
    const startIndex = (pageNumber > totalPages ? (pageNumber - 1) - 1 : pageNumber - 1) * RECORDS_PER_PAGE
    const endIndex = startIndex + RECORDS_PER_PAGE
    const displayPages = buildPagination(pageNumber, totalPages)

    const handleSearch = (searchTerm) => {
        setSearch(searchTerm)
        setPageNumber(1)
    }

    const handleAddTodo = async() => {
        if (todoForm.title.trim() === '' || todoForm.details.trim() === '') return;
        setSkeletonLoading(true)
        let newTodo = {
            'title': todoForm.title,
            'details': todoForm.details,
            'priority': todoForm.priority ? todoForm.priority : 'medium',
            'due_date': todoForm.due_date,
            'status': 'pending',
        }
        try {
            const serverResponse = await saveTodo(newTodo)
            console.log(serverResponse)
            if(serverResponse.success){
                loadTodos(buildQueryParams(search, seletedSortOption, filter, pageNumber))
            }
            setTodoForm(INITIAL_TODO_FORM)
        } catch (e) {
            console.error(e)
        } finally {
            setSkeletonLoading(false)
        }
    }

    const handleDelete = async() => {
        setSkeletonLoading(true)
        try {
            const resposne = await deleteTodoByID(confirmDel)
            if (resposne.success) {
                loadTodos(buildQueryParams(search, seletedSortOption, filter, pageNumber))
            } else {
                setHttpError("Try Again!")
            }
        } catch (err) {
            console.error(err)
        } finally {
            setSkeletonLoading(false)
            setConfirmDel(null)
        }
    }

    const handleEdit = (id) => {
        const todo = todoItems.find(todo => todo.todo_id === id)
        if (!todo) return;
        setSelectedUpdateId(todo.todo_id)
        setIsUpdate(true)
        setTodoForm({
            ...todo
        })
    }

    const handleCancelUpdate = () => {
        setSelectedUpdateId(null)
        setIsUpdate(false)
        setTodoForm(INITIAL_TODO_FORM)
    }

    const handleStatus = async (status, id) => {
        setSkeletonLoading(true)
        const updatedItem = todoItems.find((todo => todo.todo_id === id))
        try {
            const response = await updateTodo(id, { 'status': status ? 'completed' : 'pending' })
            if (response.success) {
                const updatedList = todoItems.map(todo => {
                    return id === todo.todo_id
                        ? {
                            ...todo,
                            'status': status ? 'completed' : 'pending'
                        } :
                        todo
                })
                setTodoItems(updatedList)
            }
        } catch (err) {
            console.error(err)
        } finally {
            setSkeletonLoading(false)
        }

    }

    const handleUpdateItem = async () => {
        if (todoForm.title.trim() === '') return;
        setSkeletonLoading(true)
        try {
            const updatedStatus = {
                'title': todoForm.title,
                'details': todoForm.details,
                'due_date': todoForm.due_date,
                'priority': todoForm.priority,
                'status': todoForm.status
            }
            const res = await updateTodo(selectedUpdateId, updatedStatus)
            if(res.success){
                loadTodos(buildQueryParams(search,seletedSortOption, filter, pageNumber))
            }
        } catch (err) {
            console.error(err)
        } finally {
            setSkeletonLoading(false)
        }
        handleCancelUpdate()
    }

    const handleInputChange = (name, value) => {
        setTodoForm((prev) => {
            return {
                ...prev,
                [name]: value
            }
        })
    }

    const handleFilter = (filterType, selectedLabel) => {
        setFilter(prev => {
            return {
                ...prev,
                [filterType]: selectedLabel
            }
        })
        setPageNumber(1)
    }

    const handleSort = (selectedOption) => {
        setSeletedSortOption(selectedOption)
        setPageNumber(1)
    }

    const handlePage = (selectedPage) => {
        setPageNumber(selectedPage)
    }

    return (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
            {/* {loading && <Spinner /> } */}
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 p-3 text-center">Todo App</h1>
            <hr className="mb-10 mt-5 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:via-neutral-400" />
            <div className="max-w-lg mx-auto">
                <TodoInput
                    todoForm={todoForm}
                    handleAddTodo={handleAddTodo}
                    handleUpdateItem={handleUpdateItem}
                    handleCancelUpdate={handleCancelUpdate}
                    handleInputChange={handleInputChange}
                    isUpdate={isUpdate}
                />
            </div>
            <hr className="my-12 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-25 dark:via-neutral-400" />
            <div className="mx-auto">
                <TodoFilters
                    handleFilter={handleFilter}
                    activeFilters={filter}
                    handleSearch={handleSearch}
                    seletedSortOption={seletedSortOption}
                    handleSort={handleSort}
                />
                <TodoList
                    filteredTodos={todoItems}
                    handleDelete={(id)=>setConfirmDel(id)}
                    handleEdit={handleEdit}
                    handleStatus={handleStatus}
                    isLoading={skeletonLoading}
                />
                <TodoPagination
                    currentPage={pageNumber}
                    totalPages={totalPages}
                    handlePage={handlePage}
                    displayPages={displayPages}
                />
                {confirmDel && <ConfirmDelete deleteConfirmed={handleDelete} setConfirmDelete={setConfirmDel} />  }
            </div>
        </div>
    )
}

export default TodoApp