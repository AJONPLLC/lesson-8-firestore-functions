import * as functions from 'firebase-functions';
import * as nodegit from 'nodegit';
import { rmdirSync } from 'fs';
import * as os from 'os';

export const gitReadCommit = functions.firestore
  .document('books/{bookId}')
  .onCreate(async snapshot => {
    const book = snapshot.data();
    const token = functions.config().git.token; //Trying to keep this secret, run firebase functions:config:set git.token=<your_token>
    const repoOwner = "AJONPLLC";
    const repoName = "lesson-8-hugo";
    const repoUrl = "https://github.com/" + repoOwner + "/" + repoName + ".git";
    const opts = {
      fetchOpts: {
        callbacks: {
          credentials: function() {
            return nodegit.Cred.userpassPlaintextNew(token, "x-oauth-basic");
          },
          certificateCheck: function() {
            return 1;
          }
        }
      }
    };

    console.log(book);

    nodegit.Clone(repoUrl, os.tmpdir(),opts)
    .then((repo) => {
      return repo.getCommit("676bdb8071cd435499603b8f28f4cc5ee72c4f72");
    })
    .then((commit)=>{
      return commit.getEntry("README.md");
    })
      // Get the blob contents from the file.
  .then(function(entry) {
    // Patch the blob to contain a reference to the entry.
    return entry.getBlob().then(function(blob) {
      blob.entry = entry;
      return blob;
    });
  })
  // Display information about the blob.
  .then(function(blob) {
    // Show the path, sha, and filesize in bytes.
    console.log(blob.entry.path() + blob.entry.sha() + blob.rawsize() + "b");

    // Show a spacer.
    console.log(Array(72).join("=") + "\n\n");

    // Show the entire file.
    console.log(String(blob));
  })
  .catch(function(err) { console.log(err); });
  });
