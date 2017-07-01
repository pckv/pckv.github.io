var valid_players;

function item(index) {
    return $("#li" + index);
}

function update_command() {
    var command = "?vote";
    
    $(".items li").each(function(index) {
        if (item(index).val()) {
            command += " " + item(index).val() + ";";
        }
    });
    
    $(".command").val(command);
}

function save_storage(event) {
    var index = parseInt(event.target.id.slice(2));
    localStorage.setItem("li" + index, item(index).val());
}

function load_storage() {
    $(".items li").each(function(index) {
        item(index).val(localStorage.getItem("li" + index));
    });
}

function validate_input(event) {
    var e = $("#" + event.target.id);
    
    if (!e.val()) {
        if (e.hasClass("invalid"))
            e.removeClass("invalid");
        return;
    }
    
    for (index in valid_players) {
        if (e.val().toLowerCase() == valid_players[index].toLowerCase()) {
            // Input must be valid
            if (e.hasClass("invalid"))
                e.removeClass("invalid");
            return true;
        }
    }
    
    if (!e.hasClass("invalid"))
        e.addClass("invalid");
    return false;
}

function swap_values(e1, e2) {
    var e2_value = e2.val();
    e2.val(e1.val());
    e1.val(e2_value);
}

function handle_swap(event) {
    var down = event.keyCode == 40,
        up = event.keyCode == 38;
    
    if (!up && !down)
        return;
    
    var e = $("#" + event.target.id),
        index = parseInt(event.target.id.slice(2)),
        next;
    
    if ((down && index >= 14) || (up && index <= 0))
        return;
    
    next = item(index + (down ? 1 : -1));
    swap_values(e, next);
    next.focus();
    update_command();
}

function copy_command() {
    $(".command").focus().select();
    document.execCommand("copy");
}

$(document).ready(function() {
    load_storage();
    update_command();
    
    // https://stackoverflow.com/a/14573550
    valid_players = $("#players option").map(function() {
        return this.value;
    }).get();
    
    $(".items").on("input", update_command);
    $(".items").on("focusout", function(event) {
        save_storage(event);
        validate_input(event);
    });
    $(".items").on("keyup", handle_swap);
    
    $("#copy").on("click", copy_command);
    $(".command").on("click", copy_command);
});

