# Vocab Cuckoo

Vocab-cuckoo는 웹 상에서 접하는 단어들로 영어공부를 할 수 있게 도와주는 크롬익스텐션입니다. 우클릭을 통해 단어를 한국어 또는 영어로 번역된 형태와 함께 저장할 수 있도록 해주며, 사용자가 설정한 시간에 따라 저장한 단어를 알림형태로 띄워줍니다. 




**Contents**
- Features
- Installation
- Skills
- Version Control and Collaboration
- Deployment
- Challenges
- Things to do
-----



## **Features**

- 로그인, 회원 인증
- 우클릭을 이용해 선택한 단어 한국어 & 영어 형태로 저장
- Chrome Local Storage를 이용해 최근 10개 단어 저장
- 최근 저장한 10개 단어 보기 기능
- login한 사용자들에게 제공되는 날짜별 저장한 단어들 보기 기능
- 단어 알람 기능
- 단어 알람 환경 설정(시간/ 주기/ 하루 알람 끄기 기능)
- 알람 띄워진 후 show / ignore 기능
-------



## **Installation**

**Client**

```javascript
git clone https://github.com/hiiiii11/vocab-cuckoo-client.git
cd vocab-cuckoo-client
npm install
npm start
```

**Server**

```javascript
git clone https://github.com/hiiiii11/vocab-cuckoo-server.git
cd vocab-cuckoo-server
npm install
npm run server
```
-------------



## **Skills**

**1. Client Side**

- ES2015 +
- React, Create-React-app
- Redux
- HTTP request using fetch
- Chrome APIs
  : Chrome Identity API(로그인) / contextMenus, chrome storage(단어 저장) / chrome.alarms, chrome.runtime Message, chrome.notifications (알람 설정 및 알람 띄우기)
- Google Translate Api


**2. Server side**

- Express
- Node.js
- mongoose
- JSON Web Token Authentication
- Mongo DB, atlas
-------------
  
  

## **Version Control**

- Git, Github
- Trello를 이용한 일정관리
-----------


  
## Deployment
- **Server**: AWS Elastic Beanstalk, Circle CI

----------------


## **Challenges**

-  처음에 크롬 익스텐션의 background script와 react가 상호작용하는 구조가 잘 이해가 가지 않아 어려움이 있었습니다. 차츰 chrome api들을 익혀나가면서 background script와 react컴포넌트에서 다룰 chrome 기능들을 분리하고,  chrome.runtime.sendMessage와 chrome.runtime.onMessage를 이용해 컴포넌트에서 발생하는 이벤트를 전달해서 background에서 처리하는 관계를 구축하였습니다.
- 처음 AWS  서버 배포를 다루는 과정에서  오류를 해결하는데에 어려움이 있었습니다. stackoverflow등을 이용하여 오류를 처리하기는 했으나 아직 부족한 점이 많고 좀 더 학습이 필요할 것 같습니다.

-------------------


## **Things to do**

- CSS 수정 후 chrome app에 client 배포
- chrome storage에 저장된 단어 delete 기능 추가
- db에 저장된 단어 해가 바뀌면 지워지도록 하는 기능 추가
- unit test, integration test



Special Thanks to [Ken Huh](https://github.com/ken123777 "ken huh") / Vanilla Coding 
