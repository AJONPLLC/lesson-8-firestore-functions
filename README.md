# Steps to start
1. `git clone https://github.com/AJONPLLC/lesson-8-firestore-functions.git`
1. `cd lesson-8-firestore-functions`
1. `npm install`

# Setup Firebase project
Create a project at https://firebase.google.com/ and grab your web config:

![](https://angularfirebase.com/wp-content/uploads/2017/04/firebase-dev-prod-credentials.png)

> Important in order to add books you need to 



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
# Serve Locally
`ng serve`

# Deploy
Follow [CI/CD Lesson](https://ajonp.com/lessons/2-firebase-ci/)


# Issues
If I messed up (it happens a lot), Pull request is awesome.

Just need help Join our [Slack Channel](https://ajonp-com.slack.com/join/shared_invite/enQtNDk4NjMyNDUxMzM0LWQwMThkZDE3MDAzNzVmNWE3N2M1NzkwMzg1YWQ5NzIxZmIyYTM3ZjEyOGU3YjQ0NTFkYzRmZjMyYzExNDNlNTg)

Or Hit us up on [Twitter](https://twitter.com/ajonpcom)
