var currentTime = moment().format("HH");
var localStorageContainer = 'work-day-scheduler-tasks'

// time in 24 hour format must be integer
var workDayStart = 9;
var workDayEnd = 18;

// saveTasks to grid
var saveTask = function(id) {
    // Make key-value pair to add to the storage array
    var dataToAdd = {};
    dataToAdd['id'] = id;
    dataToAdd['content'] = $('#'+id+'-blk').find('p.card-text').text()
    console.log('Saving: ',dataToAdd)

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
    if (data){
        data.forEach(function(val) {
            var container = $('#'+val.id+'-blk');
            container.find('p.card-text').text(val.content);
        })
    }
}



// Create rows with the id corresponding to their corresponding time 24H format
var createTimeBlocks = function() {
    for (i=workDayStart; i<workDayEnd; i++) {

        // $(<id>) creates; $(id) selects... hmmmm...
        var timeBlock = $("<div>").addClass('row').attr('id',i+"-blk");
        var displayTime = $("<div>").addClass("col-1");
        var taskContent = $('<div>').addClass("col card "+setTimeColor(i)+" mb-3");
        var saveTaskBtn = $('<div>').addClass('col-1');

        var taskDesc = $('<p>')
        .addClass('card-text m-auto')

        var saveButton = $("<button>")
        .addClass('btn btn-primary')
        .text('Save Task')
        .on('click', function() {
            var id = this.id.split('-')[0]
            // .children is drect. .find is recursive??
            var editingArea = $('#'+id+'-blk').find('textarea.form-control');

            var newContent = $('<p>')
                            .addClass('card-text m-auto')
                            .text(editingArea.val());

            editingArea.replaceWith(newContent);

            saveTask(id);

            $(this).text('Save Task');
            $(this).removeClass();
            $(this).addClass('btn btn-primary');
        }).attr('id',i+"-btn");

        taskContent.on("click", function() {
            var text = $(this).find('p')
              .text()
              .trim();
          
            var textInput = $("<textarea>")
            .addClass("form-control")
            .val(text);
          
            $(this).find('p').replaceWith(textInput);

            var button = $(this).parent('.row').find('.btn')

            button.text('Update Task');
            button.removeClass();
            button.addClass('btn btn-warning');
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
        // future
        return 'text-white bg-success';
    }
    else if(parseInt(currentTime) > time) {

        // past
        return 'text-white bg-secondary';
    }
    else{
        // present
        return 'text-white bg-primary';
    }
}

$("#currentDay").html("Current Date: " + moment().format('MMMM Do YYYY'));
createTimeBlocks();
loadTasks();
