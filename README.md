# Steps to start
1. `git clone https://github.com/AJONPLLC/lesson-8-firestore-functions.git`
1. `cd lesson-8-firestore-functions`
1. `npm install`

# Setup Firebase project
Create a project at https://firebase.google.com/ and grab your web config:

![](https://angularfirebase.com/wp-content/uploads/2017/04/firebase-dev-prod-credentials.png)

> Important in order to add books you need to allow sign-in and become a member with admin role.

![Auth Methods](https://res.cloudinary.com/ajonp/image/upload/v1545254801/ajonp-ajonp-com/8-lesson-firestore-functions/grc4ngshqowu8ep66mkd.png)![](https://res.cloudinary.com/ajonp/image/upload/v1545254808/ajonp-ajonp-com/8-lesson-firestore-functions/ezuu1fugenfqg9pqt08f.png)

Enable Google Signin to keep it simple, or any others.
![Enable Google Signin](https://res.cloudinary.com/ajonp/image/upload/v1545254908/ajonp-ajonp-com/8-lesson-firestore-functions/j9ks7gelgblp1yitlrqj.png)

## Replace src/environments/environment.ts and src/environments/environment.prod.ts

```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: 'APIKEY',
    authDomain: 'DEV-APP.firebaseapp.com',
    databaseURL: 'https://DEV-APP.firebaseio.com',
    projectId: 'DEV-APP',
    storageBucket: 'DEV-APP.appspot.com',
    messagingSenderId: '123456789'
  }
};
```

# Firestore Security
Don't forget to update Firestore security before running locally or you will not be able to login!
`firebase deploy --only firestore`

You will see this in console.
![Failure](https://res.cloudinary.com/ajonp/image/upload/v1545255115/ajonp-ajonp-com/8-lesson-firestore-functions/frulxdjbjy2qpakb5z34.png)

## Update User credentials
Add under roles admin:true.
![roles admin](https://res.cloudinary.com/ajonp/image/upload/v1545255367/ajonp-ajonp-com/8-lesson-firestore-functions/r72pmmlxxkg8wopimcnv.png)

# Serve Locally
`ng serve`

# Add a book
Once you are an admin you can now add a book under /books click the plus button.
![Add Book](https://res.cloudinary.com/ajonp/image/upload/v1545255471/ajonp-ajonp-com/8-lesson-firestore-functions/qjnxocy2r7doab1um561.png)

# Deploy
Follow [CI/CD Lesson](https://ajonp.com/lessons/2-firebase-ci/)

# Issues
If I messed up (it happens a lot), Pull request is awesome.

Just need help Join our [Slack Channel](https://ajonp-com.slack.com/join/shared_invite/enQtNDk4NjMyNDUxMzM0LWQwMThkZDE3MDAzNzVmNWE3N2M1NzkwMzg1YWQ5NzIxZmIyYTM3ZjEyOGU3YjQ0NTFkYzRmZjMyYzExNDNlNTg)

Or Hit us up on [Twitter](https://twitter.com/ajonpcom)
