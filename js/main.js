const API = "http://localhost:8000/posts";

let foto = $('#foto');
let descr = $('#description');
let post = $('#post');
let postsList = $('#post-list');
let search = $('#search');

let paginate = $("#paginate");
let page = 1; //страницы всегда начинаются с 1
let limit = 6;

function render() {
  fetch(`${API}?q=${search.val()}&_page=${page}&_limit=${limit}`)
    .then((res) => res.json())
    .then((data) => {
      postsList.empty(); 
      data.forEach((item) => {
        // console.log(item)
        postsList.append(`
        <div class="col-lg-4 col-sm-6">
            <div class="product-card">
             <div id=${item.id} class="card m-3" style="width: 18rem;">
                <div class="product-thumb">
                    <a href="#">
                        <img src="${item.foto}" alt="image">
                    </a>
                </div>
                <div class="product-details">
                    <p>${item.descr}</p>
                </div>
                <div class="product-bottom-details d-flex justify-content-between">
                    <div class="product-buttons">
                        <a href=""><i class="far fa-comment"></i></a>
                    </div>
                    <div class="product-buttons"  >
                        <a href="" data-bs-toggle="modal" data-bs-target="#editModal"><i class="far fa-edit btn-edit" ></i></a>
                    </div>
                    <div class="product-buttons">
                        <a href=""><i class="far fa-trash-alt btn-delete"></i></a>
                    </div>
                    <div class="product-buttons">
                        <a href=""><i class="far fa-heart"></i></a>
                    </div>
                </div>
            </div>
        </div>
        `);
      });
      // отображение кнопок для пагинации
      paginate.html(`
      <div>
      <button class="btn btn-dark" id="btn-prev" ${
        page == 1 ? "disabled" : ""
      }>Previous</button>
      <strong>${page}</strong>
      <button class="btn btn-dark" id="btn-next" ${
        data.length < limit ? "disabled" : ""
      }>Next</button>
      </div>
      `);
    });
}
render();

// пагинация
$("body").on("click", "#btn-prev", function () {
  console.log("prev clicked!");
  page -= 1;
  render();
});
$("body").on("click", "#btn-next", function () {
  console.log("next clicked!");
  page += 1;
  render();
});

// отправляем на бэК
post.on('click', function(){
    let newPost = {
        foto: foto.val(),
        descr: descr.val(), 
    }

    fetch(API, {
        method: "POST", 
        body: JSON.stringify(newPost), //отправляем как стринг
        headers: {
          "Content-type": "application/json; charset=utf-8",
        }, //кодировка
      }).then(() => {
        console.log("PRODUCT ADDED!"), render(); // перерендер
      });
})




// удаление 
$("body").on("click", ".btn-delete", function (e) {
    let id = e.target.parentNode.parentNode.parentNode.parentNode.id;
    
    fetch(`${API}/${id}`, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json; charset=utf-8",
      }, 
    }).then(() => render()); //перерендер
  });


  // поиск
search.on("input", function () {
    render(); //перерендер для живого поиска
});


let editFoto = $('#edit-foto');
let editDescr = $('#edit-descr');
let btnSaveEdit=$('#btn-save-edit');
let editId = $("#edit-id");
// edit
$("body").on("click", ".btn-edit", function (e) {
    console.log('clicked');
    let id = e.target.parentNode.parentNode.parentNode.parentNode.id;

    // отправляем get запрос по id
    fetch(`${API}/${id}`)
      .then((res) => res.json())
      .then((data) => {
        // подставили данные в инпуты
        
        editFoto.val(data.foto);
        editDescr.val(data.descr);
        editId.val(data.id);
        
      });
  });
  
// сохраняем измененные данные
  btnSaveEdit.on("click", function () {
    // создаем новый объект с данными из инпутов формы редактирования
    let editedPost = {
    
      foto: editFoto.val(),
      descr: editDescr.val(),
      
    };
    // отправляем patch запрос по id для частичного изменения данных в db
    fetch(`${API}/${editId.val()}`, {
      method: "PATCH", //метод запроса
      body: JSON.stringify(editedPost), //переводим в string и отправляем
      headers: {
        "Content-type": "application/json; charset=utf-8",
      }, //кодировка
    }).then(() => render()); //перерендер
  });

