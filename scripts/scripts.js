function checkForWindowResize() {
    // console.log(`Screen width: ${window.innerWidth}`);
    if (window.innerWidth > 1024) {
        all(25);
    }else if (window.innerWidth > 768 && window.innerWidth <= 1024){
        all(15);
    }else {
        all(8);
    }
}

checkForWindowResize()

window.addEventListener('resize', checkForWindowResize);

function all(cantF){

    var sheets = [];

    for (let i = 1; i <= 256; i++) {
        sheets[i-1] = {id: i, flag: true};
    }

    var countAll = 0;

    sheets.push({count: countAll});

    if(localStorage.getItem('sheets') === null){
        localStorage.setItem('sheets',JSON.stringify(sheets));
    }else{
        localStorage.getItem('sheets');
    }

    var database = JSON.parse(localStorage.getItem('sheets'));
    var counter = database[database.length - 1];

    $('#counter').html(counter.count);
    $('#output').html(database.length - counter.count - 1);

    var start = 0;
    var cant = cantF;
    var end = cantF;

    var table = document.querySelector('#tableJ');

    var rows = (database.length - 1) / cant;

    if(Math.round(rows) < rows){
        rows = Math.round(rows) + 1;
    }

    table.innerHTML = "";

    for (let i = 0; i < rows; i++) {
        table.innerHTML += `<tr id="row${i}">`;
        var rowsAll = document.querySelector(`#row${i}`);
        for (let j = start; j < end; j++) {
            if(j >= database.length - 1){
                rowsAll.innerHTML += `<td></td>`;
            }else{
                rowsAll.innerHTML += `
                <td id="${database[j].id}" flag${database[j].id}="${database[j].flag}" class="text-center buttons">${database[j].id}</td>
            `;
            }
        }
        table.innerHTML += `</tr>`;
        start += cant;
        end += cant;
    }

    sheets = database;

    function update(){
        database.forEach(d => {
            if($(`#${d.id}`).attr(`flag${d.id}`) === "false"){
                $(`#${d.id}`).addClass('buttonClick');
            }
            else{
                $(`#${d.id}`).removeClass('buttonClick');
            }
        });
    }

    var mouseIsDown = false;

    function selectSheets(i){
        var finded = sheets.find(e => e.id === sheets[i].id);
        if($(`#${sheets[i].id}`).attr(`flag${sheets[i].id}`) === "true"){
            $(`#${sheets[i].id}`).addClass('buttonClick');
            finded.flag = false;
            counter.count += 1;
            $(`#${sheets[i].id}`).attr(`flag${sheets[i].id}`, "false");
        }
        else{
            $(`#${sheets[i].id}`).removeClass('buttonClick');
            finded.flag = true;
            counter.count -= 1;
            $(`#${sheets[i].id}`).attr(`flag${sheets[i].id}`, "true")
        }
        if(counter.count < 0){
            counter.count = 0;
        }
        localStorage.setItem('sheets',JSON.stringify(sheets));
        $('#counter').html(counter.count);
        $('#output').html(database.length - counter.count - 1);
    }

    for (let i = 0; i < sheets.length; i++) {
        $(`#${sheets[i].id}`).mousedown(() => {mouseIsDown = true});
        $(`#${sheets[i].id}`).mouseup(() => {mouseIsDown = false});
        $(`#${sheets[i].id}`).mousedown(() => {
            selectSheets(i);
        });
        $(`#${sheets[i].id}`).mouseover(() => {
            if(mouseIsDown){
                selectSheets(i);
            }
        });
    };

    $('#removeAll').click(() => {

        Swal.fire({
            title: 'Estás seguro(a)?',
            text: "No podrás revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, Eliminar!',
            cancelButtonText: 'Cancelar!'
        }).then((result) => {
            if (result.isConfirmed) {

                sheets = database;
                for (let i = 0; i < sheets.length; i++) {
                    sheets[i].flag = true;
                    $(`#${sheets[i].id}`).removeClass('buttonClick');
                    $(`#${sheets[i].id}`).attr(`flag${sheets[i].id}`, "true");
                    counter.count = 0;
                }
                localStorage.setItem('sheets',JSON.stringify(sheets));
                $('#counter').html(counter.count);
                $('#output').html(database.length - counter.count - 1);
                
                Swal.fire({
                    title: 'Eliminado!',
                    text : 'La tabla ha sido eliminada satisfactoriamente',
                    icon : 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        });

    });

    update();

    function download(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
    
        element.style.display = 'none';
        document.body.appendChild(element);
    
        element.click();
    
        document.body.removeChild(element);
    }

    function downloadFile(){
        download("Database.txt", JSON.stringify(database));
    }

    var newDatabase = [];

    document.getElementById('inputfile').addEventListener('change', function() { 
        var fr=new FileReader();
        fr.onload=function(){
            try {
                newDatabase = JSON.parse(fr.result);
                counter = newDatabase[newDatabase.length - 1];
                for(let i = 0; i < newDatabase.length - 1; i++){
                    $(`#${newDatabase[i].id}`).attr(`flag${newDatabase[i].id}`, newDatabase[i].flag);
                    if($(`#${newDatabase[i].id}`).attr(`flag${newDatabase[i].id}`) === "false"){
                        $(`#${newDatabase[i].id}`).addClass('buttonClick');
                    }
                    else{
                        $(`#${newDatabase[i].id}`).removeClass('buttonClick');
                    }
                }
                localStorage.setItem('sheets',JSON.stringify(newDatabase));
                $('#counter').html(counter.count);
                $('#output').html(database.length - counter.count - 1);
                Swal.fire({
                    title : 'Información Compatible',
                    text: 'Datos importados correctamente',
                    icon : 'success',
                    timer: 1500,
                    showConfirmButton: false
                });
                sheets = newDatabase;
            } catch (e) {
                Swal.fire({
                    title: 'Archivo no Válido',
                    text : 'Elige un archivo compatible!',
                    icon : 'error',
                    timer: 2000,
                    showConfirmButton: false
                });
            }
        }   
        fr.readAsText(this.files[0]);

    });

    $('#toInput').attr('placeholder', database.length - 1);

    var radioType = document.getElementsByName('inputType');

    var typeFlag = true;

    radioType.forEach(e => {
        $(e).change(() => {
            if (e.value === '1') {
                $('#rangeForm').removeClass('d-none');
                $('#numbersForm').addClass('d-none');
                typeFlag = true;
            }else{
                $('#rangeForm').addClass('d-none');
                $('#numbersForm').removeClass('d-none');
                typeFlag = false;
            }
        })
    });

    $("#numbersFInput").on('input', function() { 
        var value=$(this).val().replace(/[^0-9.,]*/g, '');
        value=value.replace(/\.{2,}/g, ',');
        value=value.replace(/\.,/g, ',');
        value=value.replace(/\,\./g, ',');
        value=value.replace(/\,{2,}/g, ',');
        value=value.replace(/\.[0-9]+\./g, ',');
        value=value.replace('.', ',');
        $(this).val(value)
    });

    function rangeInput(text){
        $(String(text)).on('input', function() { 
            var value=$(this).val().replace(/[^0-9.,]*/g, '');
            value=value.replace(/\.{2,}/g, '');
            value=value.replace(/\.,/g, '');
            value=value.replace(/\,\./g, '');
            value=value.replace(/\,{2,}/g, '');
            value=value.replace(/\.[0-9]+\./g, '');
            value=value.replace('.', '');
            value=value.replace(',', '');
            $(this).val(value)
        });
    }

    rangeInput("#fromInput");
    rangeInput("#toInput");

    $('#newSendBtn').click(() => {
        if(typeFlag){
            var from = 0;
            var to = 0;
            var fromInput = $('#fromInput');
            var toInput = $('#toInput');
            if (fromInput.val() === "" || fromInput.val() <= 0) {
                from = 0;
            }else{
                from = fromInput.val() - 1;
            }
            if (toInput.val() === "" || toInput.val() > (database.length - 1)) {
                to = database.length - 2;
            }else{
                to = toInput.val() - 1;
            }
            if($('#fromInput').val() > $('#toInput').val()){
                from = $('#toInput').val() - 1;
                to = $('#fromInput').val() - 1; 
            }
            for (let i = from; i <= to; i++) {
                selectSheets(i);
            }
            fromInput.val("");
            toInput.val("");
        }else{
            var numbersFInput = $('#numbersFInput');
            var numbers = [];
            if(numbersFInput.val() === ""){
                numbers = [0];
            }else{
                var numbersArray = String(numbersFInput.val()).split(',');
                if(numbersFInput.val()[numbersFInput.val().length - 1] === ','){
                    numbersArray.splice((numbersArray.length - 1),1);
                }else if(numbersFInput.val()[0] === ','){
                    numbersArray.splice(0,1);
                }
                numbers = numbersArray;
            }
            for (let i = 0; i < numbers.length; i++) {
                selectSheets(numbers[i] - 1);
                numbersFInput.val("");
            }
        }
        $('#newForm').modal('hide');
    });

    var myModalEl = document.getElementById('newForm');
    myModalEl.addEventListener('hidden.bs.modal', function () {
        $('#fromInput').val("");
        $('#toInput').val("");
        $('#numbersFInput').val("");
    });

}