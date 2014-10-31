var processor = function() {
    var processList = [],
        addedItems = [];
    return {
        add: function(process) {
            addedItems.push(process);
        },
        process: function() {
            var newProcessList = [],
                len = processList.length,
                i;
            for (i = 0; i < len; i++) {
                if (!processList[i].removed) {
                    processList[i].move();
                    newProcessList.push(processList[i]);
                }
            }
            processList = newProcessList.concat(addedItems);
            addedItems = [];
        }
    };
};