/* global chrome */
(function() {
    const contextMenuItem = {
        "id": "vocab-cuckoo",
        "title": "Vocab Cuckoo",
        "contexts": ["selection"]
    };

    chrome.contextMenus.create(contextMenuItem);
    chrome.contextMenus.onClicked.addListener(function(clickedData) {
        const {menuItemId, selectionText} = clickedData;
        if (menuItemId === 'vocab-cuckoo' && selectionText) {
          if (typeof selectionText === "string") {
            chrome.storage.sync.get({
                words: []
            }, function(data) {
                updateStorage(data.words); //storing the storage value in a variable and passing to update function
            }
            );

            function updateStorage(wordStorage) {
                if (wordStorage.length < 10) {
                    wordStorage.push(selectionText);
                } else {
                    wordStorage.shift();
                    wordStorage.push(selectionText);
                }
                chrome.storage.sync.set({
                    words: wordStorage
                }, function() {
                    console.log("added to list with new values", wordStorage);
                });
            }
          }
        }
    });
})();
