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
    // fetch task description from p element
    dataToAdd['content'] = $('#'+id+'-blk').find('p.card-text').text()
    console.log('Saving: ',dataToAdd)

    var data = localStorage.getItem(localStorageContainer);

    // pushing data to localstorage
    if (data) {

        data = JSON.parse(data)
        // a switch that indicates whether the item has been saved already or not
        var dataFound = false;

        data.forEach(function(val) {
            if (val.id == id) {
                val.content = dataToAdd.content;
                dataFound = true;
            }
        })

        // if switch is false after the loop, just push it to data array
        if (!(dataFound)) {
            data.push(dataToAdd);
        }

        // Save data to localstorage
        data = JSON.stringify(data);
        localStorage.setItem(localStorageContainer, data);
    }
    // if localstorage entry doesnt exist, make a new entry
    else {
        data = [dataToAdd];
        data = JSON.stringify(data);
        localStorage.setItem(localStorageContainer, data);
        
    }
}

// loadTasks from Grid
var loadTasks = function() {
    data = JSON.parse(localStorage.getItem(localStorageContainer));
    // if data exists, change the right container to reflect localstorage data
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

        if (i < 10) {
            i = '09'
        }

        // Creating containers using bootstrap grid classes
        // $(<id>) creates and $(id) selects
        var timeBlock = $("<div>").addClass('row').attr('id',i+"-blk");
        var displayTime = $("<div>").addClass("col-sm-auto dt");
        var taskContent = $('<div>').addClass("col card "+setTimeColor(i)+" mb-3");
        var saveTaskBtn = $('<div>').addClass('col-sm-auto sb');

        // child for taskContent card (need to create this child due to bootstrap rules)
        var taskDesc = $('<p>')
        .addClass('card-text m-auto')

        // create save button
        var saveButton = $("<button>")
        .addClass('btn btn-primary')
        .text('Save Task')
        .attr('id',i+"-btn");

        // Showing the relevant time-period for the block
        displayTime.html("<b class='align-middle'>"+i+":00 to "+(parseInt(i)+1)+":00</b>");

        taskContent.append(taskDesc);
        saveTaskBtn.append(saveButton);
        timeBlock.append(displayTime, taskContent, saveTaskBtn);
        $('.container').append(timeBlock);
    }
}

// selecting color based on current time upon page load.
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

// Populating the page
$("#currentDay").html("Current Date: " + moment().format('MMMM Do YYYY'));
createTimeBlocks();
loadTasks();

// Adding event listeners

// TODO: in order to add a second type of button, we would need to make some
//       changes in the create-tasks code. For now this works.
$("button").on('click', function() {
    // get id
    var id = this.id.split('-')[0]
    // use id to find the right row element. and get it's text-area

    // .children is drect children and .find is a recursive search??
    var editingArea = $('#'+id+'-blk').find('textarea.form-control');
    
    // if empty, it'll stay empty. otherwise changes it to the value in editing area.
    var newContent = $('<p>')
                    .addClass('card-text m-auto')
                    //TODO:could prove to be buggy if the structure changes
                    .text(editingArea.val());

    editingArea.replaceWith(newContent);

    saveTask(id);

    $(this).text('Save Task');
    $(this).removeClass();
    $(this).addClass('btn btn-primary');
})

// TODO: Same thing as above.
$("div.card").on('click', function() {
    // this code is straight out of the module.
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
})
