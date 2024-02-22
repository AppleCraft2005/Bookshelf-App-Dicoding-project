FormSubmit = document.getElementById('inputBook')
FormSubmit.addEventListener('submit', function(event) {
    const titleInput = document.getElementById('inputBookTitle').value;
    const authorInput = document.getElementById('inputBookAuthor').value;
    const yearInput = document.getElementById('inputBookYear').value;
    const bookIsComp = checkboxStatus();

    const bookData = {
        Id: generateID(),
        Title: titleInput,
        Author: authorInput,
        Year: parseInt(yearInput),
        isComplete: checkboxStatus(),
    }

    event.preventDefault();
    toJSON(bookData);

    listNotComplete(); 
    listComplete();

})

function generateID() {     // menghasilkan ID unik
    return +new Date();
}

function checkboxStatus() {  // membuat ketika kotak dicentang akan bernilai true dan jika tidak jadi false
    const Checkbox = document.getElementById('inputBookIsComplete');
    const isChecked = Checkbox.checked;

    if(isChecked) {
        return true;
    }
    else {
        return false;
    }
}

const lokalKey = 'LOCAL_KEY';
function toJSON(data) {     // mengubah data object menjadi string JSON
    let dataBookArr = [];
    if(typeof(Storage) !== undefined ) {
        if(localStorage.getItem(lokalKey) !== null) {
            dataBookArr = JSON.parse(localStorage.getItem(lokalKey));
        }
        
        dataBookArr.unshift(data);
        
        localStorage.setItem(lokalKey, JSON.stringify(dataBookArr));

    }
}

function toOBJ() {  // mengambalin data dari string JSON ke object
    if(typeof(Storage) !== undefined ) {
        return JSON.parse(localStorage.getItem(lokalKey)) || [];
    }
    else {
        return []
    }
}

function moveToComplete(id) {   // mengubah status dari false menjadi true
    const dataOBJ = toOBJ();
    
    for(let book of dataOBJ) {
        
        if(book.Id == id) {
           bookStatus = book.isComplete = true;
        }     
    }
    
    localStorage.setItem(lokalKey, JSON.stringify(dataOBJ))
    listNotComplete(); 
    listComplete();
}

function moveToNotComplete(id) {   // mengubah status dari false menjadi true
    const dataOBJ = toOBJ();

    for(const book of dataOBJ) {
        if(book.Id == id){
            bookStatus = book.isComplete = false;
        }
    }
    localStorage.setItem(lokalKey, JSON.stringify(dataOBJ))
    listNotComplete(); 
    listComplete();
}

const SearchBar = document.getElementById('searchBookTitle');
SearchBar.addEventListener('input', function() {
    searchBook(SearchBar.value);
})

function searchBook(keyword) {
    listComplete(keyword);
    listNotComplete(keyword);
}

function listComplete(keyword ='') {   // membuat elemen dan memasukkan data untuk list selesai membaca
    const listDatabook = document.getElementById('completeBookshelfList');
    listDatabook.classList.add('book_list');
    
    const dataOBJ = toOBJ();
    
    listDatabook.innerHTML = '';
    dataOBJ.forEach(data => {
        if (data.isComplete && data.Title.toLowerCase().includes(keyword.toLowerCase())) {
            const Article = createElement(data);
            listDatabook.appendChild(Article);
        }
    });
}

function listNotComplete(keyword ='') {    // membuat elemen dan memasukkan data untuk list belum selesai dibaca
    const listDatabook = document.getElementById('incompleteBookshelfList');
    listDatabook.classList.add('book_list');
    
    const dataOBJ = toOBJ();
    
    console.log(toOBJ())
    
    listDatabook.innerHTML = '';
    dataOBJ.forEach(data => {
        if (!data.isComplete && data.Title.toLowerCase().includes(keyword.toLowerCase())) {
            const Article = createElement(data);
            listDatabook.appendChild(Article);
        }
    });
}

function createElement(item) {
    let Article = document.createElement('article');
    Article.classList.add('book_item');
    
    let H3 = document.createElement('h3');
    Article.appendChild(H3);
    H3.innerText = item.Title;
    
    let P = document.createElement('p');
    Article.appendChild(P);
    P.innerText = 'Penulis: ' + item.Author;
    P.innerHTML += '<br>Tahun: ' + item.Year;
    
    let Div = document.createElement('div');
    Div.classList.add('action');
    Article.appendChild(Div);
    
    let Button1 = document.createElement('button');
    Button1.classList.add('green');
    Div.appendChild(Button1);
    Button1.innerText = item.isComplete ? 'Belum selesai di Baca' : 'Selesai dibaca';
    Button1.setAttribute('dataID', item.Id);
    Button1.addEventListener('click', function() {
        let dataID1 = this.getAttribute('dataID');
        item.isComplete ?  moveToNotComplete(dataID1) : moveToComplete(dataID1);
    })
    
    let Button2 = document.createElement('button');
    Button2.classList.add('red');
    Div.appendChild(Button2);
    Button2.innerText = 'Hapus buku';
    Button2.setAttribute('dataID', item.Id);
    Button2.addEventListener('click', function() {
        let dataID2 = this.getAttribute('dataID');
        deleteBook(dataID2);

    })

    return Article;
}

function deleteBook(id) {   // untuk menghapus data
    const dataOBJ = toOBJ();

    for(let book of dataOBJ) {

        if(book.Id == id) {
            let indexBook = dataOBJ.indexOf(book);
            let Confirm = confirm('Yakin mau menghapus Buku ?')
            if(Confirm) {
                dataOBJ.splice(indexBook,1);
            }
            break;
        }
    }

    localStorage.setItem(lokalKey, JSON.stringify(dataOBJ))
    listNotComplete(); 
    listComplete();
}

window.addEventListener('load', function() {    
    if(typeof(Storage) !== undefined) {
        // return listNotComplete()
        listNotComplete(); 
        listComplete();
    }
})




