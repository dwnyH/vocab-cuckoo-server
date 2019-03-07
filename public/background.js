/* global chrome */

const contextMenuItem = {
    "id": "vocab-cuckoo",
    "title": "Vocab Cuckoo",
    "contexts": ["selection"]
};

const isEnglish = (text) => {
    return (
        text.charCodeAt() >= 65 && text.charCodeAt() <= 90) || (text.charCodeAt() >= 97 && text.charCodeAt() <= 122
    );
};

const isKorean = (text) => {
    return (
        text.charCodeAt() >= 45032 && text.charCodeAt() <= 55203
    );
};

const dataDuplicationCheck = (storagedTextsInfo, newText) => storagedTextsInfo.every(textInfo => textInfo.text !== newText);

const requestTranslatedData = async(text, translateTo) => {
    try {
        const url = "https://www.googleapis.com/language/translate/v2";
        const apiKey = "AIzaSyBIJDRLJEnNOclhQ60zcG9GLnoKYL7wfDE";
        const response = await fetch(`${url}/?key=${apiKey}&q=${text}&target=${translateTo}`);
        const responseData = await response.json();

        return responseData.data.translations[0].translatedText;
    } catch (err) {
        window.alert('현재 시스템에 오류가 있어 저장이 되지 않습니다.');
    }
};

const updateStorage = (wordStorage, selectedInfo) => {
    if (wordStorage.length < 10) {
        wordStorage.push(selectedInfo);
    } else {
        wordStorage.shift();
        wordStorage.push(selectedInfo);
    }

    chrome.storage.sync.set({
        words: wordStorage
    }, function() {
        window.alert(`단어 ${selectedInfo.text} 가 저장되었습니다 :)`);
        console.log("added to list with new values", wordStorage);
    });
};

chrome.contextMenus.create(contextMenuItem);
chrome.contextMenus.onClicked.addListener(async(clickedData) => {
    const {menuItemId, selectionText} = clickedData;
    if (menuItemId === 'vocab-cuckoo' && selectionText && typeof selectionText === "string") {
        let language;
        let translated;
        let date = new Date().toISOString();

        if (selectionText.split('').every(isEnglish)) {
            language = 'en';
            translated = await requestTranslatedData(selectionText, 'ko');
        } else if (selectionText.split('').every(isKorean)) {
            language = 'ko';
            translated = await requestTranslatedData(selectionText, 'en');
        }

        if (language) {
            chrome.storage.sync.get({
                words: []
            }, (data) => {
                const selectedInfo = {
                    text: selectionText.toLowerCase(),
                    language,
                    date,
                    translated
                };

                if (dataDuplicationCheck(data.words, selectedInfo.text)) {
                    updateStorage(data.words, selectedInfo);
                } else {
                    window.alert('이미 저장된 단어입니다!');
                }
            });
        } else {
            window.alert('영어 또는 한국어로 구성된 단어를 저장해주세요 :)');
        }
    }
});
