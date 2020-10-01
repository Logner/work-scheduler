var currentTime = moment().format("HH");
var localStorageContainer = 'work-day-scheduler-tasks'

// saveTasks to grid
var saveTask = function(id) {
    //finding relevant elements
    var dataToAdd = {};
    dataToAdd['id'] = id;
    dataToAdd['content'] = $('#'+id+'-blk').find('p.card-text').text()
    console.log(dataToAdd)

    // pushing data to localstorage
    var data = localStorage.getItem(localStorageContainer);
    if (data) {
        data = JSON.parse(data)
        dataFound = false;

        data.forEach(function(val) {
            if (val.id == id) {
                val.content = dataToAdd.content;
                dataFound = true;
            }
        })

        if (!(dataFound)) {
            data.push(dataToAdd);
        }

        data = JSON.stringify(data);
        localStorage.setItem(localStorageContainer, data);
    }
    else {
        data = [dataToAdd];
        data = JSON.stringify(data);
        localStorage.setItem(localStorageContainer, data);
        
    }
}

// loadTasks from Grid
var loadTasks = function() {
    data = JSON.parse(localStorage.getItem(localStorageContainer));
    data.forEach(function(val) {
        var container = $('#'+val.id+'-blk');
        container.find('p.card-text').text(val.content);
    })
}



// Create rows with the id corresponding to their corresponding time 24H format
var createTimeBlocks = function() {
    for (i=9; i<18; i++) {

        // $(<id>) creates; $(id) selects... hmmmm...
        var timeBlock = $("<div>").addClass('row').attr('id',i+"-blk");
        console.log(timeBlock)
        var displayTime = $("<div>").addClass("col-1");
        var taskContent = $('<div>').addClass("col card "+setTimeColor(i)+" mb-3");
        var saveTaskBtn = $('<div>').addClass('col-1');

        var taskDesc = $('<p>')
        .addClass('card-text m-auto')
        // TODO: Change this to loadTasks
        .text("Nothing Scheduled");

        var saveButton = $("<button>")
        .addClass('btn btn-primary')
        .text('Save Task')
        .on('click', function() {
            var id = this.id.split('-')[0]
            // .children is drect. .find is recursive??
            var editingArea = $('#'+id+'-blk').find('textarea.form-control');


            if (editingArea.val()) {
                var newContent = $('<p>')
                                .addClass('card-text m-auto')
                                .text(editingArea.val());

                editingArea.replaceWith(newContent);

                saveTask(id);
            }

            else {
                // button animation showing cant save unedited task
                alert('cant save an unedited task!')
            }
        }).attr('id',i+"-btn");

        taskContent.on("click", "p", function() {
            var text = $(this)
              .text()
              .trim();
          
            var textInput = $("<textarea>")
            .addClass("form-control")
            .val(text);
          
            $(this).replaceWith(textInput);  
          });
        

        displayTime.html(i+":00 to "+(i+1)+":00");

        taskContent.append(taskDesc);
        saveTaskBtn.append(saveButton);
        timeBlock.append(displayTime, taskContent, saveTaskBtn);
        $('.container').append(timeBlock);
    }
}

var setTimeColor = function(time) {
    if (parseInt(currentTime) < time) {
        return 'text-white bg-success';
    }
    else if(parseInt(currentTime) > time) {

        // past
        return 'text-white bg-secondary';
    }
    else{
        return 'text-white bg-primary';
    }
}

$("#currentDay").html("Current Date: " + moment().format('MMMM Do YYYY'));
createTimeBlocks();
loadTasks();
