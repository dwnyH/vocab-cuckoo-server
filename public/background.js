/* global chrome */
let questionNotif;
let answerNotif;
let answerNotifOptions;

const contextMenuItem = {
    "id": "vocab-cuckoo",
    "title": "Vocab Cuckoo",
    "contexts": ["selection"]
};

const isEnglish = (text) => {
    return (
        (text.charCodeAt() >= 65 && text.charCodeAt() <= 90) || (text.charCodeAt() >= 97 && text.charCodeAt() <= 122) || (text.charCodeAt() === 32)
    )
}

const isKorean = (text) => {
    return (
        (text.charCodeAt() >= 45032 && text.charCodeAt() <= 55203) || (text.charCodeAt() === 32)
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
        wordStorage.unshift(selectedInfo);
    } else {
        wordStorage.pop();
        wordStorage.unshift(selectedInfo);
    }

    chrome.storage.sync.set({
        words: wordStorage
    }, function() {
        window.alert(`단어 ${selectedInfo.text} 가 저장되었습니다 :)`);
        console.log("added to list with new values", wordStorage);

        if (chrome.runtime.lastError) {
            console.log(chrome.runtime.lastError);
        }
    });
};

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
            chrome.storage.sync.get('words', (data) => {
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

                if (chrome.runtime.lastError) {
                    console.log(chrome.runtime.lastError);
                }
            });
        } else {
            window.alert('영어 또는 한국어로 구성된 단어를 저장해주세요 :)');
        }
    }
});

const setAlarm = (updatedAlarmInfo) => {
    const dt = new Date();
    let alarmInfo;

    chrome.alarms.clearAll(() => {
        if (updatedAlarmInfo && updatedAlarmInfo !== "delay" && updatedAlarmInfo !== "forward") {
            const {hours, minutes, frequency} = updatedAlarmInfo;

            updatedAlarmInfo.todayAlarm = "on";
            chrome.storage.sync.set({
                alarmInfo: updatedAlarmInfo
            }, () => {
                dt.setHours(hours);
                dt.setMinutes(minutes);

                if (frequency) {
                    alarmInfo = {
                        when: dt.valueOf(),
                        periodInMinutes: frequency
                    };
                } else {
                    alarmInfo = {
                        when: dt.valueOf()
                    };
                }

                chrome.alarms.create("cuckooAlarm", alarmInfo);

                if (chrome.runtime.lastError) {
                    console.log(chrome.runtime.lastError);
                }
            });
        } else {
            chrome.storage.sync.get('alarmInfo', (storagedAlarmData) => {
                const {hours, minutes, frequency} = storagedAlarmData.alarmInfo;
                dt.setHours(hours);
                dt.setMinutes(minutes);

                if (updatedAlarmInfo === "delay") {
                    dt.setDate(dt.getDate() + 1);
                }

                if (frequency) {
                    alarmInfo = {
                        when: dt.valueOf(),
                        periodInMinutes: frequency
                    };
                } else {
                    alarmInfo = {
                        when: dt.valueOf()
                    };
                }

                chrome.alarms.create("cuckooAlarm", alarmInfo);
            });
        }

        if (chrome.runtime.lastError) {
            console.log(chrome.runtime.lastError);
        }
    });
};

const setBackgroundEnv = () => {
    chrome.notifications.getAll((notifs) => {
        if (Object.keys(notifs).length) {
            for (let key in notifs) {
                chrome.notifications.clear(key);
            }
        }
    });

    chrome.contextMenus.create(contextMenuItem);
    setAlarm();
}

const handleAlarm = () => {
    chrome.storage.sync.get('words', (data) => {
        const randomNumber = Math.floor(Math.random()*10);
        const alertWord = data.words[randomNumber].text;
        const translatedWord = data.words[randomNumber].translated;
        const notifOptions = {
            type: "basic",
            iconUrl: "/icons/birdIcon-48.png",
            title: "cuckoo!",
            message: `Do you remember word ${alertWord}?`,
            buttons: [{
                title: 'Show Definition'
            }, {
                title: 'Ignore'
            }],
            requireInteraction: true
        };

        answerNotifOptions = {
            type: "basic",
            iconUrl: "/icons/birdIcon-48.png",
            title: alertWord,
            message: translatedWord,
            buttons: [{
                title: 'Thanks!'
            }],
            requireInteraction: true
        }

        chrome.notifications.create(notifOptions, (id) => {
            questionNotif = id;
        });

        if (chrome.runtime.lastError) {
            console.log(chrome.runtime.lastError);
        }
    });
}

chrome.runtime.onInstalled.addListener(() => {
    setBackgroundEnv();
});

chrome.runtime.onStartup.addListener(() => {
    setBackgroundEnv();
});

chrome.runtime.onMessage.addListener((message) => {
    console.log(message);
    if (message.type === "alarmSet") {
        setAlarm(message.alarmInfo);
    } else if (message.type === "alarmOff") {
        setAlarm("delay");
    } else if (message.type === "alarmOn") {
        debugger;
        setAlarm("forward");
    }
});

chrome.alarms.onAlarm.addListener(() => {
    chrome.alarms.getAll((data)=> {console.log(data)});
    handleAlarm();
});

chrome.notifications.onButtonClicked.addListener((notifId, btnIdx) => {
    if (notifId === questionNotif) {
        if (btnIdx === 0) {
            chrome.notifications.create(answerNotifOptions, (id) => {
                answerNotif = id;
            });
        } else if (btnIdx === 1) {
            chrome.notifications.clear(notifId);
        }
    } else if (notifId === answerNotif) {
        if (btnIdx === 0) {
            chrome.notifications.clear(notifId);
        }
    }
});
