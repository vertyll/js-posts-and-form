import { getPostsData, getAlbums } from './api.js'

const saveFilterSettings = () => {
    let path = window.location.pathname.substring(1)
    for(inputName in filterInputs) {
        if(filterInputs[inputName].type != 'button') {
            localStorage.setItem(`${path}::${inputName}`, form[inputName].value)
        }
    }
}

window.addEventListener('beforeunload', () => {
    saveFilterSettings()
})

const resetFilterForm = () => {
    for(let inputName in filterInputs) {
        if(filterInputs[inputName].type != 'button') {
            form[inputName].value = filterInputs[inputName].defaultValue
        }
    }
    localStorage.clear()
}

const buildFilter = (inputs) => {

    filterInputs = inputs

    let filterContainer = document.getElementById('filterContainer')
    let filterForm = document.createElement('form')
    filterContainer.appendChild(filterForm)
    filterForm.name = 'filterForm'
    filterForm.id = 'filterForm'

    for(let inputName in inputs) {
        let formItem = document.createElement('div')
        filterForm.appendChild(formItem)
        formItem.className = 'input-wrap-filter'
        
        if(inputs[inputName].type != 'button') {
            let labelForInput = document.createElement('label')
            formItem.appendChild(labelForInput)
            labelForInput.htmlFor = inputName
            labelForInput.innerText = inputs[inputName].label
        }
        let filterFormElement = document.createElement(inputs[inputName].type)
        formItem.appendChild(filterFormElement)
        
        filterFormElement.id = inputName
        filterFormElement.name = inputName

        if(inputs[inputName].type == 'button') {
            filterFormElement.innerText = inputs[inputName].body
            filterFormElement.type = 'button'
            if(inputs[inputName].btnFunction) {
                filterFormElement.addEventListener('click', inputs[inputName].btnFunction)
            }
        }
        else if(inputs[inputName].type == 'input') {
            filterFormElement.type = inputs[inputName].inputType
        }
    }
    form = document.forms['filterForm']
    let path = window.location.pathname.substring(1)
    for(inputName in filterInputs){
        if(filterInputs[inputName].type != 'button'){
            if(localStorage.getItem(`${path}::${inputName}`)) {
                form[inputName].value = localStorage.getItem(`${path}::${inputName}`)
            }
        }
    }
    return filterForm
}

const selectFilter = async (switchFilter) => {

    let filterData

    if(switchFilter == 'posts') {
        postsContainer.innerHTML=''
        filterData = await getPostsData()
    } else if(switchFilter == 'albums') {
        albumsContainer.innerHTML=''
        filterData = await getAlbums()
    }

    let filterKeys = []

    for(let inputName in filterInputs) {
        filterKeys[inputName] = form[inputName].value
        if(form[inputName].type == 'text') {       
            if(!!filterKeys[inputName]) {
                filterData = filterData.filter((e) => {
                    return e[filterInputs[inputName].filterKey].indexOf(form[inputName].value) !== -1
                })
            }
        } else if(form[inputName].type == 'number') {
            if(!!filterKeys[inputName]){
                filterData = filterData.filter((e) =>{
                    return e[filterInputs[inputName].filterKey] == form[inputName].value
                })
            }
        }
    }
    return filterData
}

export { buildFilter, selectFilter, resetFilterForm, saveFilterSettings }