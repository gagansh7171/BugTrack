# BugTrack

> An easy to use bug tracking system with an intuitive user interface and instinctive workflow

Bug Tracking App designed especially for [IMG](https://github.com/IMGIITRoorkee).If you want to have a look on how website looks like then visit [here](./walkthrough). A bug tracking system or defect tracking system is a software application that keeps track of reported software bugs in software development projects. The ER Diagram I used to create models is [here](./er-diagram.png). This project satisfies all requirements as specified in <a href='https://mail-attachment.googleusercontent.com/attachment/u/0/?ui=2&ik=46e9327f1c&attid=0.1&permmsgid=msg-f:1664314856295001574&th=1718d58b3bde6de6&view=att&disp=inline&realattid=1718d581b3cefff40fb1&saddbat=ANGjdJ8THi0QjOAmQ3JL9BrGObMWYmNAWYYdpjHJwCJo2Q2QiTSIRS5NA6-ygYqwE_UYLywta_gT39f6YTS73rpbwpnZuUSH5GD0JMfEcFZLHZN2rTBqCEBMsaifVPoGpp6-OqQOPLMOJpK7PhlvfyujTOsisXPi53MmP4ahtVgE7gWW5xDizZbylS_IFv7ABMU7qyebNKMWxyfJyvkJcGt4sSLaT-P5UxnDKI-fLwjtb_1eD6nbypJnphC0QJz7CLZV7jF9iEoeYT6_-OyPNcKjLYwLa3EM4qiYKC1qufSYB3VmRHsHOiFpAK45oLcOv27GCCkeHvS3hnLT1lam2fWNaBpcEzCinTWQVATrQW_jGiYOGsPTsDfhKtY282KlRGUTqPKYWQ_TXyEj-8mwq1JNTYWME1Gq2sfvBdzstaIBDtw9V7k3zvQGm2s1V7mLXbiYHkpjwdLe45oDN4ZF-CY4Ehg-yjDDtFnqUnBk1jpaVXNLT6K-TdY5I10lDIynGf_ZBpUwRbq8W1XJOLE2sJ8TQ5ZPFna9S-HER2b3DfNuxypaMMRFWiIeUh7mkmm-ncaBJykB0uMj2gx-5Ug6xAcxyKhYHkzJSlD0l_H03NQN1nPGUdzQUEbiY8So8tzJE4fqDUixiwUzAySzHpkG6ruyD2YOdkULhU-AZBidABkcNfXgcgH1upXodAewILs'>here</a>
. Some of the extra features I implemented are : </br>
  * Make avatar for users from name initials if no display_picture is given
  * Search Users and Projects by Name
  * A list of My Projects
  * A section for My teams
  * Profile Page for every user which can be visited with proper url like any other website
  * Completely Responsive design
  * Deletion of previous profile photo from server on changing dp to save space

For the project **Backend** I learned how to use:
- [x] [Django](https://www.djangoproject.com/)
- [x] [Django Rest Framework](https://www.django-rest-framework.org/)
- [x] [Oauth](https://django-oauth-toolkit.readthedocs.io/en/latest/)
- [x] Django [channels](https://channels.readthedocs.io/en/latest/) for websockets
- [x] [Django CKeditor](https://django-ckeditor.readthedocs.io/en/latest/)
- [X] Django RichTextField

For the project **Frontend** I learned how to use:
- [x] [React.JS](https://reactjs.org/)
- [x] [React Redux](https://react-redux.js.org/)
- [x] [React Router](https://reactrouter.com/)
- [x] [CKeditor-React](https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/frameworks/react.html)
- [x] write uploadAdapter for image support in CKeditor
- [x] [Axios](https://github.com/axios/axios)
- [x] [Semantic UI](https://react.semantic-ui.com/)
- [x] [React-Cookies](https://www.npmjs.com/package/react-cookies)

Extras:
 - [x] [Dockerize](https://docs.docker.com/compose/gettingstarted/) your app.

### Prerequisites <br/>
  * Python 3
  * pip
  * npm
  * mysql
  * [Docker](https://docs.docker.com/compose/install/)
-----------------
## Setup Instructions <br/>
  * Clone this repository.
  * This app is dockerized and connects to local mysql, if you do not have a user which has access to mysql via any host then you need to make a new user for that.
  ```
  mysql -u root -p

  CREATE USER '<<username>>'@'%%' IDENTIFIED BY '<<password>>';
  GRANT ALL PRIVILEGES ON * . * TO '<<username>>'@'%%';
  FLUSH PRIVILEGES;
  ```
  * Create database bug.
  * Change [docker-compose.yaml](./docker-compose.yaml) accordingly.
  * Create settings.ini as given in the [example](./project/settings.ini.example)
  * Make sure ports 6379, 8000, 3000 are not in use.
  * Now navigate to Bug-Track-Master.
  ```
  docker compose build
  docker compose up -d
  ```
  * Above commands will take a few mimutes to run properly.
  * visit [here](http://localhost:3000/)
-----------------
## Learning Resources for beginners<br/>
 * [Dockerize](https://medium.com/@gagansh7171/dockerize-your-django-and-react-app-68a7b73ab6e9?sk=f285da192ec695afdb1583ea42f94427) your app.
 * For Redux you can visit [CSS-Tricks](https://css-tricks.com/learning-react-redux/) and [VALENTINO's blog](https://www.valentinog.com/blog/redux/).
 * For a good grasp on React's lifecycle methods visit [here](https://projects.wojtekmaj.pl/react-lifecycle-methods-diagram/)
 * React's [documentation](https://reactjs.org/docs/getting-started.html) is more than sufficient to kick start your React-App.
 * Django's poll app [tutorial](https://docs.djangoproject.com/en/3.1/intro/tutorial01/) is good enough to give you knowledge of django's terminologies and usage.
 * I found this axios [cheatsheet](https://kapeli.com/cheat_sheets/Axios.docset/Contents/Resources/Documents/index) really helpful.
 * For django channels you can checkout official [tutorial](https://channels.readthedocs.io/en/latest/tutorial/index.html) and [Real Python](https://realpython.com/getting-started-with-django-channels/)
